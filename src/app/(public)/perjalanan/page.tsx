import { prisma } from "@/lib/prisma";
import PerjalananClient from "./PerjalananClient";

async function getJourneys() {
  try {
    return await prisma.journey.findMany({
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    });
  } catch {
    return [];
  }
}

export default async function PerjalananPage() {
  const journeys = await getJourneys();
  return <PerjalananClient journeys={journeys} />;
}
