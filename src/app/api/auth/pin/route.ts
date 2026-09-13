import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORRECT_PIN = process.env.ADMIN_PIN || "0701";

export async function POST(request: Request) {
  try {
    const { pin, access_token, refresh_token } = await request.json();

    if (pin !== CORRECT_PIN) {
      return NextResponse.json({ error: "PIN salah" }, { status: 401 });
    }

    // Set cookies server-side for enhanced security (HttpOnly)
    const cookieStore = await cookies();
    
    cookieStore.set("sb-access-token", access_token, {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
    
    cookieStore.set("sb-refresh-token", refresh_token, {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PIN Validation Error:", e);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
