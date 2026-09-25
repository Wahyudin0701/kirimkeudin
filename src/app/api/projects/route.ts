import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";

export const dynamic = 'force-dynamic';

// GET — ambil semua proyek
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    });
    return NextResponse.json(projects);
  } catch (e) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// POST — tambah proyek baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title } = body;
    const project = await prisma.project.create({
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

    await logActivity({ action: 'create', entity: 'project', entityId: project.id, description: `Menambahkan proyek "${title}"` });

    return NextResponse.json(project, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}
