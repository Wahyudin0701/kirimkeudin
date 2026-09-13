import { NextResponse } from "next/server";
import { s3Client, BUCKET_NAME, PUBLIC_URL } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Validasi Ukuran (Maks 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Ukuran file maksimal 10MB" }, { status: 400 });
    }

    // Validasi Ekstensi Berbahaya
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const blockedExtensions = ["exe", "bat", "cmd", "sh", "js", "ts", "php", "py", "ps1", "vbs"];
    if (blockedExtensions.includes(ext)) {
      return NextResponse.json({ error: "Tipe file tidak diizinkan" }, { status: 400 });
    }

    const uniqueKey = `uploads/${Date.now()}-${uuidv4()}.${ext}`;

    // Konversi file ke Buffer untuk upload ke R2
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueKey,
      ContentType: file.type || "image/jpeg",
      Body: buffer,
    });

    await s3Client.send(command);

    const fileUrl = `${PUBLIC_URL}/${uniqueKey}`;

    return NextResponse.json({ fileUrl });
  } catch (error) {
    console.error("Upload Route Error:", error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
