import { prisma } from "@/lib/prisma";
import PencapaianClient from "./PencapaianClient";

export const dynamic = 'force-dynamic';

export default async function DashboardPencapaianPage() {
  const items = await prisma.achievement
    .findMany({ orderBy: [{ sort_order: 'asc' }, { year: 'desc' }] })
    .catch(() => []);

  return <PencapaianClient initialItems={items} />;
}
