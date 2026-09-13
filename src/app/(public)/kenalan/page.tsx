import { prisma } from "@/lib/prisma";
import KenalanClient from "./KenalanClient";

export const dynamic = 'force-dynamic';

export default async function KenalanPage() {
  const [settingsRaw, journeys] = await Promise.all([
    prisma.$queryRaw`SELECT * FROM settings WHERE id = 'default' LIMIT 1`.catch(() => []),
    prisma.journey.findMany({ orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }] }).catch(() => []),
  ]);

  const settings = Array.isArray(settingsRaw) && (settingsRaw as any[]).length > 0 ? (settingsRaw as any[])[0] : null;

  return <KenalanClient settings={settings} journeys={journeys} />;
}
