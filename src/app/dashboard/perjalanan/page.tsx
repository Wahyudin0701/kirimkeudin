import { prisma } from "@/lib/prisma";
import PerjalananClient from "./PerjalananClient";

export const dynamic = 'force-dynamic';

export default async function DashboardPerjalananPage() {
  const items = await prisma.journey
    .findMany({ orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }] })
    .catch(() => []);

  return <PerjalananClient initialItems={items} />;
}
