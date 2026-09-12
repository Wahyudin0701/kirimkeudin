import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — ambil semua entry perjalanan
export async function GET() {
  try {
    const journeys = await prisma.journey.findMany({
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    });
    return NextResponse.json(journeys);
  } catch (e) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// POST — tambah entry perjalanan baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const journey = await prisma.journey.create({
      data: {
        category: body.category ?? null,
        institution: body.institution ?? null,
        role: body.role ?? null,
        description: body.description ?? null,
        start_date: body.start_date ?? null,
        end_date: body.end_date ?? null,
        location: body.location ?? null,
        sort_order: body.sort_order ?? 0,
      },
    });
    return NextResponse.json(journey, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}
