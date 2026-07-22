import { PrismaClient } from "@/generated/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pool: pg.Pool;
};

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

// Reuse pool across hot-reloads (dev) AND serverless cold starts (prod)
if (!globalForPrisma.pool) {
  globalForPrisma.pool = new pg.Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl: { rejectUnauthorized: false },
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

