import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings;
    // Fallback to raw query if Prisma client wasn't successfully regenerated
    if (prisma.settings) {
      settings = await prisma.settings.findUnique({ where: { id: "default" } });
    } else {
      const res: any = await prisma.$queryRaw`SELECT * FROM settings WHERE id = 'default' LIMIT 1`;
      settings = Array.isArray(res) && res.length > 0 ? res[0] : null;
    }

    if (!settings) {
      if (prisma.settings) {
        settings = await prisma.settings.create({
          data: { id: "default", name: "Wahyudin", email: "kirimkeudin@gmail.com" },
        });
      } else {
        await prisma.$executeRaw`INSERT INTO settings (id, name, email, updated_at) VALUES ('default', 'Wahyudin', 'kirimkeudin@gmail.com', NOW())`;
        const res: any = await prisma.$queryRaw`SELECT * FROM settings WHERE id = 'default' LIMIT 1`;
        settings = Array.isArray(res) ? res[0] : null;
      }
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, avatar_url } = body;

    let settings;
    if (prisma.settings) {
      settings = await prisma.settings.upsert({
        where: { id: "default" },
        update: {
          name: name !== undefined ? name : undefined,
          avatar_url: avatar_url !== undefined ? avatar_url : undefined,
        },
        create: {
          id: "default",
          name: name || "Wahyudin",
          email: "kirimkeudin@gmail.com",
          avatar_url: avatar_url || null,
        },
      });
    } else {
      // Fallback
      const res: any = await prisma.$queryRaw`SELECT * FROM settings WHERE id = 'default' LIMIT 1`;
      const existing = Array.isArray(res) && res.length > 0 ? res[0] : null;
      
      const finalName = name !== undefined ? name : (existing?.name || "Wahyudin");
      const finalAvatar = avatar_url !== undefined ? avatar_url : (existing?.avatar_url || null);

      if (existing) {
        await prisma.$executeRaw`UPDATE settings SET name = ${finalName}, avatar_url = ${finalAvatar}, updated_at = NOW() WHERE id = 'default'`;
      } else {
        await prisma.$executeRaw`INSERT INTO settings (id, name, email, avatar_url, updated_at) VALUES ('default', ${finalName}, 'kirimkeudin@gmail.com', ${finalAvatar}, NOW())`;
      }
      
      const updatedRes: any = await prisma.$queryRaw`SELECT * FROM settings WHERE id = 'default' LIMIT 1`;
      settings = Array.isArray(updatedRes) ? updatedRes[0] : null;
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
