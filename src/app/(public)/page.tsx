import { prisma } from "@/lib/prisma";
import LandingClient from "./LandingClient";

export const dynamic = 'force-dynamic';

async function getLandingData() {
  try {
    // Run sequentially to avoid exhausting serverless connection pools on Vercel
    const projects = await prisma.project.findMany({ orderBy: [{ sort_order: "asc" }, { created_at: "desc" }], take: 3 }).catch(() => []);
    const achievements = await prisma.achievement.findMany({ orderBy: [{ sort_order: "asc" }, { year: "desc" }], take: 4 }).catch(() => []);
    const journeys = await prisma.journey.findMany({ orderBy: [{ sort_order: "asc" }, { created_at: "desc" }], take: 4 }).catch(() => []);
    
    const projectCount = await prisma.project.count().catch(() => 0);
    const journeyCount = await prisma.journey.count().catch(() => 0);
    const achievementCount = await prisma.achievement.count().catch(() => 0);
    
    const settingsRaw = await prisma.$queryRaw`SELECT * FROM settings WHERE id = 'default' LIMIT 1`.catch(() => []);
    const settings = Array.isArray(settingsRaw) && settingsRaw.length > 0 ? settingsRaw[0] : null;

    return {
      projects,
      achievements,
      journeys,
      stats: { projectCount, journeyCount, achievementCount },
      settings,
    };
  } catch {
    return {
      projects: [],
      achievements: [],
      journeys: [],
      stats: { projectCount: 0, journeyCount: 0, achievementCount: 0 },
      settings: null,
    };
  }
}

export default async function BerandaPage() {
  const data = await getLandingData();

  return <LandingClient {...data} />;
}
