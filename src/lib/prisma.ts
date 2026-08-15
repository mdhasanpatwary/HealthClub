
import { PrismaClient } from "@/generated/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pool: pg.Pool;
};

// Prefer DATABASE_URL (pgbouncer transaction-mode pooler, port 6543) for faster
// connections. Fall back to DIRECT_URL (session-mode, port 5432) for migrations.
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

// Reuse pool across hot-reloads (dev) AND serverless cold starts (prod)
if (!globalForPrisma.pool) {
  globalForPrisma.pool = new pg.Pool({
    connectionString,
    max: 5,               // pgbouncer manages its own pool; over-provisioning causes "too many clients"
    idleTimeoutMillis: 10_000,   // recycle idle connections quickly
    connectionTimeoutMillis: 10_000,
    ssl: { rejectUnauthorized: false },
  });

  // Catch unhandled errors on idle clients to prevent Node process termination
  globalForPrisma.pool.on("error", (err) => {
    console.error("[Prisma:pg.Pool] Unexpected idle client error:", err);
  });
}

const adapter = new PrismaPg(globalForPrisma.pool);
if (!globalForPrisma.prisma || !("systemSetting" in globalForPrisma.prisma)) {
  globalForPrisma.prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma;

