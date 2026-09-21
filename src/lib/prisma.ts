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

const isProduction = process.env.NODE_ENV === "production";

// In production serverless functions, each concurrent instance should maintain a minimal
// pool (max: 2) to prevent connection pool exhaustion against Supabase / Supavisor.
const maxPoolSize = process.env.PG_MAX_POOL_SIZE
  ? parseInt(process.env.PG_MAX_POOL_SIZE, 10)
  : (isProduction ? 2 : 10);

// Log diagnostic warning if production runtime is configured with direct port 5432 instead of transaction pooler
if (isProduction && connectionString && connectionString.includes(":5432")) {
  logger.warn(
    "[Prisma:pg.Pool] DATABASE_URL is pointing to direct port 5432 instead of Supavisor connection pooler (port 6543 with ?pgbouncer=true). This may risk connection exhaustion under load."
  );
}

// Reuse pool across hot-reloads (dev) AND serverless cold starts (prod)
if (!globalForPrisma.pool) {
  globalForPrisma.pool = new pg.Pool({
    connectionString,
    max: maxPoolSize,            // max: 2 in production (prevents connection exhaustion); 10 in dev
    idleTimeoutMillis: 20_000,   // Recycle idle connections after 20s to avoid stale pooler connections
    connectionTimeoutMillis: 15_000, // 15s connection timeout to handle WAN latency/cold starts
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
    log: isProduction ? ["error"] : ["error", "warn"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Always preserve prisma instance on global to prevent duplicate PrismaClient instances
// across warm container invocations in both development and production serverless runtimes.
globalForPrisma.prisma = prisma;


