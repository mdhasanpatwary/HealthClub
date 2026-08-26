import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";

/**
 * Ensures the authenticated user is an active super admin.
 */
export async function verifySuperAdmin(): Promise<{ authorized: boolean; email?: string; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return {
      authorized: false,
      error: "অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে এডমিন হিসেবে লগইন করুন।",
    };
  }

  const role = session.adminRole || "super_admin";
  if (role !== "super_admin") {
    return {
      authorized: false,
      error: "ডাটাবেস ব্যাকআপ ও স্ন্যাপশট শুধুমাত্র সুপার এডমিন পরিচালনা করতে পারেন।",
    };
  }

  return { authorized: true, email: session.userId || "super_admin" };
}

/**
 * Escape SQL values safely for PostgreSQL INSERT statements
 */
export function escapeSqlValue(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return isFinite(val) ? String(val) : "NULL";
  if (val instanceof Date) return `'${val.toISOString()}'`;
  if (typeof val === "object") {
    const jsonStr = JSON.stringify(val).replace(/'/g, "''");
    return `'${jsonStr}'`;
  }
  const str = String(val).replace(/'/g, "''");
  return `'${str}'`;
}

/**
 * Generate PostgreSQL INSERT statement for a batch of records
 */
export function generateTableSql(tableName: string, rows: Record<string, unknown>[]): string {
  if (!rows || rows.length === 0) return `-- No records in table ${tableName}\n`;

  const columns = Object.keys(rows[0]);
  const colNames = columns.map((col) => `"${col}"`).join(", ");

  let sql = `-- Table: ${tableName} (${rows.length} rows)\n`;
  for (const row of rows) {
    const values = columns.map((col) => escapeSqlValue(row[col])).join(", ");
    sql += `INSERT INTO "${tableName}" (${colNames}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
  }
  return sql + "\n";
}

/**
 * Fetches all database records grouped by model name
 */
export async function fetchAllDatabaseData(tables?: string[]) {
  const allTables = tables && tables.length > 0 ? tables : [
    "members",
    "partners",
    "partnerStaff",
    "transactions",
    "doctors",
    "partnerRequests",
    "contactMessages",
    "systemSettings",
    "pwaInstallations",
    "memberNotifications",
    "adminUsers",
  ];

  const data: Record<string, unknown[]> = {};

  if (allTables.includes("members")) data.members = await prisma.member.findMany();
  if (allTables.includes("partners")) data.partners = await prisma.partner.findMany();
  if (allTables.includes("partnerStaff")) data.partnerStaff = await prisma.partnerStaff.findMany();
  if (allTables.includes("transactions")) data.transactions = await prisma.transaction.findMany();
  if (allTables.includes("doctors")) data.doctors = await prisma.doctor.findMany();
  if (allTables.includes("partnerRequests")) data.partnerRequests = await prisma.partnerRequest.findMany();
  if (allTables.includes("contactMessages")) data.contactMessages = await prisma.contactMessage.findMany();
  if (allTables.includes("systemSettings")) data.systemSettings = await prisma.systemSetting.findMany();
  if (allTables.includes("pwaInstallations")) data.pwaInstallations = await prisma.pwaInstallation.findMany();
  if (allTables.includes("memberNotifications")) data.memberNotifications = await prisma.memberNotification.findMany();
  if (allTables.includes("adminUsers")) data.adminUsers = await prisma.adminUser.findMany();

  return data;
}

/**
 * Internal helper to purge expired and excessive snapshots
 */
export async function purgeExpiredSnapshots(maxSnapshots: number = 20) {
  try {
    const now = new Date();
    // 1. Delete snapshots whose expiry date has passed
    await prisma.databaseSnapshot.deleteMany({
      where: {
        expiresAt: {
          not: null,
          lt: now,
        },
      },
    });

    // 2. If remaining count exceeds maxSnapshots, purge oldest
    const count = await prisma.databaseSnapshot.count();
    if (count > maxSnapshots) {
      const excess = count - maxSnapshots;
      const oldest = await prisma.databaseSnapshot.findMany({
        orderBy: { createdAt: "asc" },
        take: excess,
        select: { id: true },
      });
      const idsToDelete = oldest.map((s) => s.id);
      if (idsToDelete.length > 0) {
        await prisma.databaseSnapshot.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }
    }
  } catch (err) {
    logger.error("Error purging expired snapshots:", err);
  }
}
