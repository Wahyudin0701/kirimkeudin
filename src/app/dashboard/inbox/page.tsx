import { prisma, withRetry } from "@/lib/prisma";
import InboxClient from "./InboxClient";

export const dynamic = 'force-dynamic';

export default async function DashboardInboxPage() {
  const items = await withRetry(
    () => prisma.inboxSubmission.findMany({ 
      orderBy: { created_at: 'desc' },
      include: { files: true }
    }),
    []
  );

  return <InboxClient initialItems={items} />;
}
