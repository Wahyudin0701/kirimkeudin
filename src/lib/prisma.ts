import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// In serverless environments (Vercel), each function invocation is short-lived.
// Setting connection_limit=1 ensures each serverless instance only holds 1 DB
// connection, preventing Supabase connection pool exhaustion across many concurrent invocations.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 'connection_limit=1&pool_timeout=10',
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Helper to retry Prisma queries that might fail due to transient connection pool exhaustion
 * in the serverless environment (Vercel).
 */
export async function withRetry<T>(operation: () => Promise<T>, fallback: T, maxRetries = 3): Promise<T> {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (e: any) {
      lastError = e;
      console.warn(`[Prisma Retry] Attempt ${attempt}/${maxRetries} failed:`, e.message || String(e));
      if (attempt < maxRetries) {
        // Exponential backoff: 500ms, 1000ms, ...
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }
  console.error(`[Prisma Retry] All ${maxRetries} attempts failed. Returning fallback. Error:`, lastError);
  return fallback;
}
