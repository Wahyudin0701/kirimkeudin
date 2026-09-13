import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, type, newName } = await req.json();

    if (!id || !type || !newName || !newName.trim()) {
      return NextResponse.json({ error: "Missing required fields or empty name" }, { status: 400 });
    }

    if (type === "folder") {
      await prisma.vaultFolder.update({
        where: { id },
        data: { name: newName.trim() }
      });
    } else if (type === "file") {
      await prisma.vaultFile.update({
        where: { id },
        data: { original_name: newName.trim() }
      });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Rename error:", error);
    return NextResponse.json({ error: error.message || "Failed to rename item" }, { status: 500 });
  }
}
