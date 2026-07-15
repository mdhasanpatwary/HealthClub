import { PrismaClient } from "@/generated/client/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaPg({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  prismaInstance = new PrismaClient({
    adapter,
    log: ["error", "warn"]
  });
} else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["error", "warn"]
    });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
