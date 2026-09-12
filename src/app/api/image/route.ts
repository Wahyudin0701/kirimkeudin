import { NextResponse } from "next/server";
import { s3Client, BUCKET_NAME } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) return new NextResponse("Missing url", { status: 400 });

  // Ekstrak key dari URL R2 public
  let key = url;
  if (url.includes(".r2.dev/")) {
    key = url.split(".r2.dev/")[1];
  } else if (url.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL || "MISSING")) {
    key = url.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL + "/", "");
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      return new NextResponse("File tidak ditemukan", { status: 404 });
    }

    // Stream body langsung dari R2 ke client (tanpa redirect)
    const stream = response.Body as ReadableStream;
    
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": response.ContentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(response.ContentLength ? { "Content-Length": String(response.ContentLength) } : {}),
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
