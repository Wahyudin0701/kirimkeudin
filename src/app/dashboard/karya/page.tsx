import { prisma, withRetry } from "@/lib/prisma";
import KaryaClient from "./KaryaClient";

export const dynamic = 'force-dynamic';

export default async function DashboardKaryaPage() {
  const projects = await withRetry(
    () => prisma.project.findMany({ orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }] }),
    []
  );

  return <KaryaClient initialProjects={projects} />;
}
