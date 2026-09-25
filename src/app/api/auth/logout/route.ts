import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear the auth cookies by setting maxAge to 0
  cookieStore.set("sb-access-token", "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  
  cookieStore.set("sb-refresh-token", "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  return NextResponse.json({ success: true });
}
