import { prisma } from "@/lib/prisma";
import PortofolioClient from "./PortofolioClient";

export const dynamic = 'force-dynamic';

export default async function PortofolioHomePage() {
  const [projectCount, journeyCount, achievementCount] = await Promise.all([
    prisma.project.count().catch(() => 0),
    prisma.journey.count().catch(() => 0),
    prisma.achievement.count().catch(() => 0),
  ]);

  return (
    <PortofolioClient
      initialStats={{ projects: projectCount, journeys: journeyCount, achievements: achievementCount }}
    />
  );
}
