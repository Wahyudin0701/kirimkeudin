import { prisma } from "@/lib/prisma";
import KaryaClient from "./KaryaClient";

export const dynamic = 'force-dynamic';

export default async function DashboardKaryaPage() {
  const projects = await prisma.project
    .findMany({ orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }] })
    .catch(() => []);

  return <KaryaClient initialProjects={projects} />;
}
