import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logActivity, getDeviceInfo } from "@/lib/activity-log";

export async function POST(request: Request) {
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

  const deviceInfo = getDeviceInfo(request);
  await logActivity({ action: 'logout', entity: 'auth', description: 'Logout dari dashboard', metadata: deviceInfo });

  return NextResponse.json({ success: true });
}
