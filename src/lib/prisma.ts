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
const isBuild =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.npm_lifecycle_event === "build" ||
  Boolean(process.env.NEXT_IS_BUILD) ||
  process.argv.some((arg) => typeof arg === "string" && arg.includes("build"));

// Connection pool sizing:
// - Build phase (Next.js static site generation): 6 connections per worker prevents pending queue timeouts.
// - Production serverless runtime (Vercel/Node): 3 connections per container to stay within pooler limits.
// - Local development: 10 connections for snappy hot-reload.
const maxPoolSize = process.env.PG_MAX_POOL_SIZE
  ? parseInt(process.env.PG_MAX_POOL_SIZE, 10)
  : isBuild
  ? 6
  : isProduction
  ? 3
  : 10;

// Connection timeout:
// 60s during build and 30s during runtime gives sufficient headroom for WAN latency and peak queue bursts.
const connectionTimeoutMillis = process.env.PG_CONNECTION_TIMEOUT_MS
  ? parseInt(process.env.PG_CONNECTION_TIMEOUT_MS, 10)
  : isBuild
  ? 60_000
  : 30_000;

// Idle timeout:
// 60s during build preserves warm TLS connections across static page generations; 20s in runtime.
const idleTimeoutMillis = isBuild ? 60_000 : 20_000;

// Log diagnostic warning if production runtime is configured with direct port 5432 instead of transaction pooler
if (isProduction && connectionString && connectionString.includes(":5432")) {
  logger.warn(
    "[Prisma:pg.Pool] DATABASE_URL is pointing to direct port 5432 instead of Supavisor connection pooler (port 6543 with ?pgbouncer=true). This may risk connection exhaustion under load."
  );
}

const isLocalDb = Boolean(
  connectionString &&
    (connectionString.includes("localhost") ||
      connectionString.includes("127.0.0.1") ||
      connectionString.includes(".local"))
);

const poolKey = `${connectionString}_ssl:${!isLocalDb}`;
const globalWithKey = globalForPrisma as {
  prisma?: PrismaClient;
  pool?: pg.Pool;
  currentPoolKey?: string;
};

// Reuse pool across hot-reloads (dev) AND serverless cold starts (prod),
// but recreate if connectionString or local SSL mode changes
if (!globalWithKey.pool || globalWithKey.currentPoolKey !== poolKey) {
  if (globalWithKey.pool) {
    globalWithKey.pool.end().catch(() => {});
  }
  globalWithKey.currentPoolKey = poolKey;
  globalWithKey.pool = new pg.Pool({
    connectionString,
    max: maxPoolSize,
    idleTimeoutMillis,
    connectionTimeoutMillis,
    keepAlive: true,             // Send TCP keep-alive packets to prevent Supabase/AWS dropping idle connections
    keepAliveInitialDelayMillis: 10_000,
    ssl: isLocalDb ? false : { rejectUnauthorized: false },
  });

  // Catch unhandled errors on idle clients to prevent Node process termination
  globalWithKey.pool.on("error", (err) => {
    logger.error("[Prisma:pg.Pool] Unexpected idle client error:", err);
  });

  globalWithKey.prisma = undefined;
}

const createPrismaClient = () => {
  const adapter = new PrismaPg(globalWithKey.pool!);
  return new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["error", "warn"],
  });
};

export const prisma = globalWithKey.prisma ?? createPrismaClient();

// Always preserve prisma instance on global to prevent duplicate PrismaClient instances
// across warm container invocations in both development and production serverless runtimes.
globalWithKey.prisma = prisma;

/**
 * Executes a database operation with automatic retry on transient connection timeouts.
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  retries = 2,
  delayMs = 500
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (err: unknown) {
      attempt++;
      const isTimeout =
        err instanceof Error &&
        (err.message.includes("timeout exceeded") ||
          err.message.includes("connection timeout") ||
          err.message.includes("Connection terminated") ||
          err.message.includes("ETIMEDOUT") ||
          err.message.includes("ECONNRESET"));

      if (attempt >= retries || !isTimeout) {
        throw err;
      }

      logger.warn(
        `[Prisma:withDbRetry] Retrying DB operation after transient connection error (attempt ${attempt}/${retries}): ${err instanceof Error ? err.message : String(err)}`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
}


