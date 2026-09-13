import { prisma, withRetry } from "@/lib/prisma";
import LandingClient from "./LandingClient";

export const dynamic = 'force-dynamic';

async function getLandingData() {
  try {
    const projects = await withRetry(() => prisma.project.findMany({ orderBy: [{ sort_order: "asc" }, { created_at: "desc" }], take: 3 }), []);
    const achievements = await withRetry(() => prisma.achievement.findMany({ orderBy: [{ sort_order: "asc" }, { year: "desc" }], take: 4 }), []);
    const journeys = await withRetry(() => prisma.journey.findMany({ orderBy: [{ sort_order: "asc" }, { created_at: "desc" }], take: 4 }), []);
    
    const counts = await withRetry<any[]>(
      () => prisma.$queryRaw`
        SELECT 
          (SELECT count(*) FROM projects) as projects,
          (SELECT count(*) FROM journeys) as journeys,
          (SELECT count(*) FROM achievements) as achievements
      `,
      [{ projects: 0n, journeys: 0n, achievements: 0n }]
    );
    const row = counts && counts.length > 0 ? counts[0] : { projects: 0n, journeys: 0n, achievements: 0n };
    const projectCount = Number(row.projects || 0);
    const journeyCount = Number(row.journeys || 0);
    const achievementCount = Number(row.achievements || 0);
    
    const settingsRaw = await withRetry<any[]>(() => prisma.$queryRaw`SELECT * FROM settings WHERE id = 'default' LIMIT 1`, []);
    const settings = Array.isArray(settingsRaw) && settingsRaw.length > 0 ? settingsRaw[0] : null;

    return {
      projects,
      achievements,
      journeys,
      stats: { projectCount, journeyCount, achievementCount },
      settings,
    };
  } catch (error) {
    console.error("Error in getLandingData:", error);
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
