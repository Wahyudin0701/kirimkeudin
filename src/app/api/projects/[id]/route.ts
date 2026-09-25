import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";

// PUT — update proyek
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description ?? null,
        thumbnail_url: body.thumbnail_url ?? null,
        tech_stack: body.tech_stack ?? [],
        project_url: body.project_url ?? null,
        github_url: body.github_url ?? null,
        start_date: body.start_date ?? null,
        end_date: body.end_date ?? null,
        sort_order: body.sort_order ?? 0,
      },
    });

    await logActivity({ action: 'update', entity: 'project', entityId: id, description: `Memperbarui proyek "${body.title || 'Untitled'}"` });

    return NextResponse.json(project);
  } catch (e) {
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

// DELETE — hapus proyek
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await prisma.project.delete({ where: { id } });

    await logActivity({ action: 'delete', entity: 'project', entityId: id, description: `Menghapus proyek "${deleted.title}"` });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}
