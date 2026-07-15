import { PrismaClient } from "@/generated/client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production") {
  const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({
    adapter,
    log: ["error", "warn"]
  });
} else {
  if (!globalForPrisma.prisma) {
    const pool = new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["error", "warn"]
    });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
