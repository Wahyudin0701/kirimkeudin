import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const journey = await prisma.journey.update({
      where: { id },
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

    await logActivity({ action: 'update', entity: 'journey', entityId: id, description: `Memperbarui perjalanan "${body.role || body.institution || 'Untitled'}"` });

    return NextResponse.json(journey);
  } catch (e) {
    console.error("PUT Error:", e);
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await prisma.journey.delete({ where: { id } });

    await logActivity({ action: 'delete', entity: 'journey', entityId: id, description: `Menghapus perjalanan "${deleted.role || deleted.institution || ''}"` });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE Error:", e);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}
