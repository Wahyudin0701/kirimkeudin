import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";

// PATCH — update status submission (unread → read → archived)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await prisma.inboxSubmission.update({
      where: { id },
      data: { status: body.status },
    });
    await logActivity({ action: 'update', entity: 'inbox', entityId: id, description: `Menandai pesan dari "${updated.sender_name}" sebagai dibaca` });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH Error:", e);
    return NextResponse.json({ error: "Gagal update status" }, { status: 500 });
  }
}

// DELETE — hapus submission
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const { id } = await params;
    // Hapus files dulu (cascade harusnya handle ini, tapi kita eksplisit)
    await prisma.inboxFile.deleteMany({ where: { submission_id: id } });
    const deleted = await prisma.inboxSubmission.delete({ where: { id } });
    await logActivity({ action: 'delete', entity: 'inbox', entityId: id, description: `Menghapus pesan dari "${deleted.sender_name}"` });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE Error:", e);
    return NextResponse.json({ error: "Gagal menghapus kiriman" }, { status: 500 });
  }
}
