import { prisma } from "@/lib/prisma";
import LandingClient from "./LandingClient";

async function getLandingData() {
  try {
    const [projects, achievements, journeys, projectCount, journeyCount, achievementCount, settingsRaw] =
      await Promise.all([
        prisma.project.findMany({ orderBy: [{ sort_order: "asc" }, { created_at: "desc" }], take: 3 }),
        prisma.achievement.findMany({ orderBy: [{ sort_order: "asc" }, { year: "desc" }], take: 4 }),
        prisma.journey.findMany({ orderBy: [{ sort_order: "asc" }, { created_at: "desc" }], take: 4 }),
        prisma.project.count(),
        prisma.journey.count(),
        prisma.achievement.count(),
        prisma.$queryRaw`SELECT * FROM settings WHERE id = 'default' LIMIT 1`,
      ]);

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
