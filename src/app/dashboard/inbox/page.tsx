import { prisma } from "@/lib/prisma";
import InboxClient from "./InboxClient";

export const dynamic = 'force-dynamic';

export default async function DashboardInboxPage() {
  const items = await prisma.submission
    .findMany({ 
      orderBy: { created_at: 'desc' },
      include: { files: true }
    })
    .catch(() => []);

  return <InboxClient initialItems={items} />;
}
