import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, type, targetFolderId } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type === "folder") {
      // Mencegah circular reference: folder tidak boleh dipindah ke dirinya sendiri
      if (id === targetFolderId) {
        return NextResponse.json({ error: "Cannot move folder into itself" }, { status: 400 });
      }

      // TODO: Pencegahan perpindahan ke subfoldernya sendiri bisa ditambahkan jika hirarki sangat dalam, 
      // tapi secara UI kita hanya memindahkan lewat drag&drop ke target yang terlihat.
      
      await prisma.vaultFolder.update({
        where: { id },
        data: { parent_id: targetFolderId || null }
      });
    } else if (type === "file") {
      await prisma.vaultFile.update({
        where: { id },
        data: { folder_id: targetFolderId || null }
      });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Move error:", error);
    return NextResponse.json({ error: error.message || "Failed to move item" }, { status: 500 });
  }
}
