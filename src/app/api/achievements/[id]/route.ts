import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        name: body.name,
        issuer: body.issuer ?? null,
        category: body.category ?? null,
        year: body.year ? parseInt(body.year) : null,
        photo_url: body.photo_url ?? null,
        credential_url: body.credential_url ?? null,
        sort_order: body.sort_order ?? 0,
      },
    });
    return NextResponse.json(achievement);
  } catch (e) {
    console.error("PUT Error:", e);
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.achievement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE Error:", e);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}
