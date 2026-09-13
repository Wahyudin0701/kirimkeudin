import { prisma } from "@/lib/prisma";
import PortofolioClient from "./PortofolioClient";

export const dynamic = 'force-dynamic';

export default async function PortofolioHomePage() {
  const projectCount = await prisma.project.count().catch(() => 0);
  const journeyCount = await prisma.journey.count().catch(() => 0);
  const achievementCount = await prisma.achievement.count().catch(() => 0);

  return (
    <PortofolioClient
      initialStats={{ projects: projectCount, journeys: journeyCount, achievements: achievementCount }}
    />
  );
}
