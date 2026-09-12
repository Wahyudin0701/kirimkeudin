import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { s3Client, BUCKET_NAME, PUBLIC_URL } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Mendapatkan R2 key dari file_url (fallback jika file_key kosong)
function extractKeyFromUrl(fileUrl: string): string {
  return fileUrl.replace(PUBLIC_URL.replace(/\/$/, "") + "/", "");
}

// Rekursif mendapatkan semua folder keturunan
function getDescendantFolderIds(
  allFolders: { id: string; parent_id: string | null }[],
  parentId: string
): string[] {
  const children = allFolders.filter((f) => f.parent_id === parentId);
  let ids = children.map((f) => f.id);
  for (const child of children) {
    ids = ids.concat(getDescendantFolderIds(allFolders, child.id));
  }
  return ids;
}

// Membangun path relatif file di dalam ZIP berdasarkan hirarki folder
function buildRelativePath(
  folderId: string | null,
  rootFolderId: string,
  allFolders: { id: string; name: string; parent_id: string | null }[]
): string {
  if (!folderId || folderId === rootFolderId) return "";
  const folder = allFolders.find((f) => f.id === folderId);
  if (!folder) return "";
  const parentPath = buildRelativePath(folder.parent_id, rootFolderId, allFolders);
  return parentPath ? `${parentPath}/${folder.name}` : folder.name;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await params;

    // Ambil folder target
    const targetFolder = await prisma.vaultFolder.findUnique({ where: { id } });
    if (!targetFolder) {
      return NextResponse.json({ error: "Folder tidak ditemukan" }, { status: 404 });
    }

    // Ambil seluruh folder & cari descendant
    const allFolders = await prisma.vaultFolder.findMany({
      select: { id: true, name: true, parent_id: true },
    });
    const descendantIds = getDescendantFolderIds(allFolders, id);
    const allFolderIds = [id, ...descendantIds];

    // Ambil semua file dalam folder target + descendant
    const files = await prisma.vaultFile.findMany({
      where: { folder_id: { in: allFolderIds } },
      select: {
        id: true,
        original_name: true,
        file_key: true,
        file_url: true,
        folder_id: true,
      },
    });

    if (files.length === 0) {
      return NextResponse.json({
        folderName: targetFolder.name,
        files: [],
      });
    }

    // Generate Presigned GET URL (5 menit) untuk setiap file
    const fileList = await Promise.all(
      files.map(async (file) => {
        // Ambil key dari DB jika ada, fallback parse dari file_url
        const key = file.file_key || (file.file_url ? extractKeyFromUrl(file.file_url) : null);
        if (!key) return null;

        // Path di dalam ZIP: path relatif/namafile.ext
        const folderPath = buildRelativePath(file.folder_id, id, allFolders);
        const archivePath = folderPath
          ? `${folderPath}/${file.original_name || "file"}`
          : file.original_name || "file";

        const command = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 300, // 5 menit
        });

        return {
          name: file.original_name || "file",
          archivePath,
          presignedUrl,
        };
      })
    );

    // Filter null (file yang tidak punya key)
    const validFiles = fileList.filter(Boolean) as {
      name: string;
      archivePath: string;
      presignedUrl: string;
    }[];

    return NextResponse.json({
      folderName: targetFolder.name,
      files: validFiles,
    });
  } catch (error: any) {
    console.error("Download URLs error:", error);
    return NextResponse.json(
      { error: "Gagal membuat daftar URL unduhan", details: error.message },
      { status: 500 }
    );
  }
}