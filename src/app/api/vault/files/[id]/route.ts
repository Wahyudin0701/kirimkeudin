import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { s3Client, BUCKET_NAME } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { logActivity } from "@/lib/activity-log";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    (params as any).id = id;

    // Cari file di database
    const file = await prisma.vaultFile.findUnique({ where: { id } });
    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
    }

    // Ekstrak Key dari file_url (asumsinya format: https://[public_url]/vault/[nama_file])
    if (file.file_url) {
      const urlParts = file.file_url.split("/");
      // ambil 2 part terakhir (vault/nama_file)
      const key = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
      
      // Hapus dari S3/R2
      try {
        await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
      } catch (s3Error) {
        console.error("Failed to delete from R2, proceeding to delete DB record:", s3Error);
      }
    }

    // Hapus dari DB
    const deleted = await prisma.vaultFile.delete({ where: { id } });

    await logActivity({ action: 'delete', entity: 'vault_file', entityId: params.id, description: `Menghapus file "${deleted.original_name || deleted.display_name || 'file'}"` });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus file" }, { status: 500 });
  }
}
