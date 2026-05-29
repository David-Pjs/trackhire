import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Retry wrapper — handles Neon cold starts (free tier suspends after 5 min)
export const db = prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ args, query }) {
        try {
          return await query(args);
        } catch (err: any) {
          const isConnectionError =
            err?.message?.includes("Can't reach database") ||
            err?.message?.includes("connection") ||
            err?.code === "P1001";

          if (isConnectionError) {
            await new Promise((r) => setTimeout(r, 3000));
            return await query(args);
          }
          throw err;
        }
      },
    },
  },
});
