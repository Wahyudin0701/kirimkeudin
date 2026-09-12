import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Buat folder baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Nama folder wajib diisi" }, { status: 400 });
    }

    const folder = await prisma.vaultFolder.create({
      data: {
        name: body.name,
        parent_id: body.parent_id || null,
      },
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat folder" }, { status: 500 });
  }
}
