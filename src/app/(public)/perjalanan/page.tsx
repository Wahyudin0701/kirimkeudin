import { prisma } from "@/lib/prisma";
import PerjalananClient from "./PerjalananClient";

export const dynamic = 'force-dynamic';

async function getJourneys() {
  try {
    const raw = await prisma.journey.findMany({
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    });
    return [...raw].sort((a, b) => {
      const getYear = (str: string | null) => {
        if (!str) return 0;
        const match = str.match(/\d{4}/);
        return match ? parseInt(match[0], 10) : 0;
      };
      const yearA = Math.max(getYear(a.start_date), getYear(a.end_date));
      const yearB = Math.max(getYear(b.start_date), getYear(b.end_date));
      return yearB - yearA;
    });
  } catch {
    return [];
  }
}

export default async function PerjalananPage() {
  const journeys = await getJourneys();
  return <PerjalananClient journeys={journeys} />;
}
