import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — ambil semua submission inbox
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // unread|read|archived

    const submissions = await prisma.inboxSubmission.findMany({
      where: status ? { status } : undefined,
      include: { files: true },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(submissions);
  } catch (e) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

// POST — terima kiriman baru dari form publik
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.sender_name || !body.message) {
      return NextResponse.json({ error: "Nama dan pesan wajib diisi" }, { status: 400 });
    }

    const submission = await prisma.inboxSubmission.create({
      data: {
        sender_name: body.sender_name,
        sender_email: body.sender_email ?? null,
        sender_contact: body.sender_contact ?? null,
        purpose: body.purpose ?? null,
        message: body.message,
        status: "unread",
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menyimpan kiriman" }, { status: 500 });
  }
}
