import { prisma, withRetry } from "@/lib/prisma";
import PortofolioClient from "./PortofolioClient";

export const dynamic = 'force-dynamic';

export default async function PortofolioHomePage() {
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

  return (
    <PortofolioClient
      initialStats={{ projects: projectCount, journeys: journeyCount, achievements: achievementCount }}
    />
  );
}
