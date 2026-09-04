import { PrismaClient } from "@/generated/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { logger } from "@/lib/logger";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
  pool?: pg.Pool;
};

// Prefer DATABASE_URL (pgbouncer transaction-mode pooler, port 6543) for faster
// connections. Fall back to DIRECT_URL (session-mode, port 5432) for migrations.
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

// Reuse pool across hot-reloads (dev) AND serverless cold starts (prod)
if (!globalForPrisma.pool) {
  globalForPrisma.pool = new pg.Pool({
    connectionString,
    max: 15,                     // Sufficient pool capacity for concurrent server actions
    idleTimeoutMillis: 30_000,   // Keep healthy connections warm; recycle after 30s
    connectionTimeoutMillis: 30_000, // 30s connection timeout to handle WAN latency/cold starts
    keepAlive: true,             // Send TCP keep-alive packets to prevent Supabase/AWS dropping idle connections
    keepAliveInitialDelayMillis: 10_000,
    ssl: { rejectUnauthorized: false },
  });

  // Catch unhandled errors on idle clients to prevent Node process termination
  globalForPrisma.pool.on("error", (err) => {
    logger.error("[Prisma:pg.Pool] Unexpected idle client error:", err);
  });
}

const createPrismaClient = () => {
  const adapter = new PrismaPg(globalForPrisma.pool!);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

