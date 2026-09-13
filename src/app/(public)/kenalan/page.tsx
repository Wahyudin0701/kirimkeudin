import { prisma, withRetry } from "@/lib/prisma";
import KenalanClient from "./KenalanClient";

export const dynamic = 'force-dynamic';

export default async function KenalanPage() {
  const settingsRaw = await withRetry<any[]>(() => prisma.$queryRaw`SELECT * FROM settings WHERE id = 'default' LIMIT 1`, []);
  const journeys = await withRetry(() => prisma.journey.findMany({ orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }] }), []);

  const settings = Array.isArray(settingsRaw) && (settingsRaw as any[]).length > 0 ? (settingsRaw as any[])[0] : null;

  return <KenalanClient settings={settings} journeys={journeys} />;
}
