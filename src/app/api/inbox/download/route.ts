import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "@/lib/s3";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const name = searchParams.get("name") || "download";

  if (!url) return new NextResponse("Missing url", { status: 400 });

  // Extract key from R2 public URL
  let key = url;
  if (url.includes(".r2.dev/")) {
    key = url.split(".r2.dev/")[1];
  } else if (process.env.CLOUDFLARE_R2_PUBLIC_URL && url.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL)) {
    key = url.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL + "/", "");
  }

  try {
    const encodedName = encodeURIComponent(name)
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29');

    const disposition = `attachment; filename="${name}"; filename*=UTF-8''${encodedName}`;

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ResponseContentDisposition: disposition,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    return NextResponse.redirect(presignedUrl);
  } catch (error) {
    console.error("Download proxy error:", error);
    return new NextResponse("Error generating download link", { status: 500 });
  }
}
