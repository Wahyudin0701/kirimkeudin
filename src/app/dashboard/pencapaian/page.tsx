import { prisma, withRetry } from "@/lib/prisma";
import PencapaianClient from "./PencapaianClient";

export const dynamic = 'force-dynamic';

export default async function DashboardPencapaianPage() {
  const items = await withRetry(
    () => prisma.achievement.findMany({ orderBy: [{ sort_order: 'asc' }, { year: 'desc' }] }),
    []
  );

  return <PencapaianClient initialItems={items} />;
}
