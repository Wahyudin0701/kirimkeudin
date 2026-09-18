import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Ambil isi dari sebuah folder (atau root jika tidak ada parent_id)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get("folderId");

    // Menjalankan ke-4 query secara paralel untuk memangkas waktu tunggu jaringan (network latency)
    const [folders, files, allFiles, allFolders] = await Promise.all([
      prisma.vaultFolder.findMany({
        where: { parent_id: parentId || null },
        orderBy: { name: "asc" },
      }),
      prisma.vaultFile.findMany({
        where: { folder_id: parentId || null },
        orderBy: { created_at: "desc" },
      }),
      prisma.vaultFile.findMany({ select: { folder_id: true, file_size: true } }),
      prisma.vaultFolder.findMany({ orderBy: { name: "asc" } }) // Mengambil SEMUA folder beserta namanya
    ]);

    const sizeMap = new Map<string, bigint>();
    const calculateFolderSize = (folderId: string): bigint => {
      if (sizeMap.has(folderId)) return sizeMap.get(folderId)!;
      let total = 0n;
      for (const f of allFiles) {
        if (f.folder_id === folderId) total += f.file_size ? BigInt(f.file_size.toString()) : 0n;
      }
      for (const sub of allFolders) {
        if (sub.parent_id === folderId) total += calculateFolderSize(sub.id);
      }
      sizeMap.set(folderId, total);
      return total;
    };

    const serializedFolders = folders.map((f) => ({
      ...f,
      size: calculateFolderSize(f.id).toString()
    }));

    const serializedFiles = files.map((f) => ({
      ...f,
      file_size: f.file_size ? f.file_size.toString() : "0"
    }));

    let totalVaultSize = 0n;
    for (const f of allFiles) {
      if (f.file_size) totalVaultSize += BigInt(f.file_size.toString());
    }

    return NextResponse.json({ 
      folders: serializedFolders, 
      files: serializedFiles, 
      allFolders,
      totalVaultSize: totalVaultSize.toString()
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat isi vault" }, { status: 500 });
  }
}
