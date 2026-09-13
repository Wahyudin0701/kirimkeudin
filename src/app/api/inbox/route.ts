import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

// GET — ambil semua submission inbox
export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // unread|read|archived

    const submissions = await prisma.inboxSubmission.findMany({
      where: status ? { status } : undefined,
      include: { files: true },
      orderBy: { created_at: "desc" },
    });

    const serialized = JSON.stringify(submissions, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    return new NextResponse(serialized, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("GET Inbox Error:", e);
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

    const filesData = Array.isArray(body.files) ? body.files.map((f: any) => ({
      original_name: f.original_name,
      file_url: f.file_url,
      file_size: f.file_size,
      mime_type: f.mime_type,
    })) : [];

    const submission = await prisma.inboxSubmission.create({
      data: {
        sender_name: body.sender_name,
        sender_email: body.sender_email ?? null,
        sender_contact: body.sender_contact ?? null,
        purpose: body.purpose ?? null,
        message: body.message,
        status: "unread",
        files: {
          create: filesData
        }
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Gagal menyimpan kiriman" }, { status: 500 });
  }
}
