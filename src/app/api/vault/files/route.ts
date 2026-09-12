import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { s3Client, BUCKET_NAME, PUBLIC_URL } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// POST - Dapatkan Presigned URL untuk upload + Simpan record awal di DB
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, contentType, size, folderId } = body;

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Data file tidak lengkap" }, { status: 400 });
    }

    // Buat key unik (supaya tidak tertimpa jika ada nama file sama)
    const ext = filename.split(".").pop();
    const uniqueKey = `vault/${Date.now()}-${uuidv4()}.${ext}`;

    // Buat Presigned URL untuk metode PUT
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const finalFileUrl = `${PUBLIC_URL}/${uniqueKey}`;

    // Simpan ke database
    const fileRecord = await prisma.vaultFile.create({
      data: {
        original_name: filename,
        file_key: uniqueKey,
        file_url: finalFileUrl,
        file_size: size,
        mime_type: contentType,
        folder_id: folderId || null,
      },
    });

    return NextResponse.json({
      uploadUrl,
      fileRecord: {
        ...fileRecord,
        file_size: fileRecord.file_size ? fileRecord.file_size.toString() : "0"
      },
      key: uniqueKey,
    });
  } catch (error) {
    console.error("Presigned URL Error:", error);
    return NextResponse.json({ error: "Gagal membuat URL upload" }, { status: 500 });
  }
}
