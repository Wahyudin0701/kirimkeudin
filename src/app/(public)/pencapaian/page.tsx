import { prisma } from "@/lib/prisma";
import PencapaianClient from "./PencapaianClient";

async function getAchievements() {
  try {
    return await prisma.achievement.findMany({ orderBy: [{ sort_order: "asc" }, { year: "desc" }] });
  } catch { return []; }
}

export default async function PencapaianPage() {
  const achievements = await getAchievements();

  return <PencapaianClient achievements={achievements} />;
}
