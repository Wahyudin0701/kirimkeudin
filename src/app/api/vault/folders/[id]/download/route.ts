import { NextResponse } from "next/server";

/**
 * Route ini sudah DEPRECATED.
 * Fitur unduh folder ZIP sekarang dilakukan di sisi klien menggunakan jszip.
 * Gunakan GET /api/vault/folders/[id]/download-urls untuk mendapatkan presigned URLs,
 * lalu buat ZIP di browser.
 */
export async function GET() {
  return NextResponse.json(
    {
      error: "Endpoint ini sudah tidak digunakan.",
      info: "Gunakan /api/vault/folders/[id]/download-urls untuk fitur unduh folder.",
    },
    { status: 410 }
  );
}
