import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    (params as any).id = id;

    // Cek apakah folder ini punya subfolder atau file (Sesuai Opsi A: Tidak bisa hapus jika tidak kosong)
    const childFolders = await prisma.vaultFolder.count({ where: { parent_id: id } });
    const childFiles = await prisma.vaultFile.count({ where: { folder_id: id } });

    if (childFolders > 0 || childFiles > 0) {
      return NextResponse.json({ error: "Folder tidak kosong. Hapus isinya terlebih dahulu." }, { status: 400 });
    }

    const deleted = await prisma.vaultFolder.delete({ where: { id } });

    await logActivity({ action: 'delete', entity: 'vault_folder', entityId: params.id, description: `Menghapus folder "${deleted.name}"` });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus folder" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const folder = await prisma.vaultFolder.update({
      where: { id },
      data: { name: body.name },
    });

    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengubah nama folder" }, { status: 500 });
  }
}
