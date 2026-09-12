import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — ambil semua pencapaian
export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: [{ sort_order: "asc" }, { year: "desc" }],
    });
    return NextResponse.json(achievements);
  } catch (e) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// POST — tambah pencapaian baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const achievement = await prisma.achievement.create({
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
    return NextResponse.json(achievement, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}
