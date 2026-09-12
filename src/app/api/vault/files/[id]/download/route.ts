import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "@/lib/s3";

const prisma = new PrismaClient();

function extractKeyFromUrl(urlStr: string): string | null {
  try {
    const url = new URL(urlStr);
    return url.pathname.substring(1);
  } catch (e) {
    return null;
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const file = await prisma.vaultFile.findUnique({ where: { id } });
    if (!file || !file.file_url) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const key = file.file_key || extractKeyFromUrl(file.file_url);
    if (!key) {
      return NextResponse.json({ error: "Invalid file key" }, { status: 400 });
    }

    const originalName = file.original_name || 'download';
    const encodedName = encodeURIComponent(originalName)
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29');

    const url = new URL(req.url);
    const isInline = url.searchParams.get("inline") === "true";
    const dispositionType = isInline ? "inline" : "attachment";
    const disposition = `${dispositionType}; filename="${originalName}"; filename*=UTF-8''${encodedName}`;

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ResponseContentDisposition: disposition,
      ResponseContentType: file.mime_type || "application/octet-stream",
      ResponseCacheControl: isInline ? "public, max-age=31536000, immutable" : "private, no-store",
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    return NextResponse.redirect(presignedUrl);

  } catch (error) {
    const err = error as any;
    console.error("File download proxy error:", err);
    return NextResponse.json(
      { error: "Failed to process download URL", details: err.message },
      { status: 500 }
    );
  }
}
