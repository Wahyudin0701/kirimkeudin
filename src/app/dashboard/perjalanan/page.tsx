import { prisma, withRetry } from "@/lib/prisma";
import PerjalananClient from "./PerjalananClient";

export const dynamic = 'force-dynamic';

export default async function DashboardPerjalananPage() {
  const items = await withRetry(
    () => prisma.journey.findMany({ orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }] }),
    []
  );

  return <PerjalananClient initialItems={items} />;
}
