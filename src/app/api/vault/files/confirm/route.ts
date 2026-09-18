import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PUBLIC_URL } from "@/lib/s3";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, filename, contentType, size, folderId } = body;

    if (!key || !filename) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const finalFileUrl = `${PUBLIC_URL}/${key}`;

    const fileRecord = await prisma.vaultFile.create({
      data: {
        original_name: filename,
        file_key: key,
        file_url: finalFileUrl,
        file_size: size,
        mime_type: contentType,
        folder_id: folderId || null,
      },
    });

    return NextResponse.json({
      fileRecord: {
        ...fileRecord,
        file_size: fileRecord.file_size ? fileRecord.file_size.toString() : "0"
      }
    });
  } catch (error) {
    console.error("Confirm Upload Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan record" }, { status: 500 });
  }
}
