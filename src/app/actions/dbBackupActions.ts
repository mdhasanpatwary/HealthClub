"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import {
  DatabaseSnapshot,
  BackupTableStats,
  BackupSettings,
} from "@/services/db";
import {
  verifySuperAdmin,
  generateTableSql,
  fetchAllDatabaseData,
  purgeExpiredSnapshots,
} from "@/lib/dbBackupUtils";

/**
 * Get live database statistics across all models
 */
export async function getDatabaseStatsSummaryAction(): Promise<BackupTableStats | null> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return null;

  try {
    const [
      members,
      partners,
      partnerStaff,
      transactions,
      doctors,
      partnerRequests,
      contactMessages,
      systemSettings,
      pwaInstallations,
      memberNotifications,
      adminUsers,
      databaseSnapshots,
    ] = await prisma.$transaction([
      prisma.member.count(),
      prisma.partner.count(),
      prisma.partnerStaff.count(),
      prisma.transaction.count(),
      prisma.doctor.count(),
      prisma.partnerRequest.count(),
      prisma.contactMessage.count(),
      prisma.systemSetting.count(),
      prisma.pwaInstallation.count(),
      prisma.memberNotification.count(),
      prisma.adminUser.count(),
      prisma.databaseSnapshot.count(),
    ]);

    const totalRecords =
      members +
      partners +
      partnerStaff +
      transactions +
      doctors +
      partnerRequests +
      contactMessages +
      systemSettings +
      pwaInstallations +
      memberNotifications +
      adminUsers;

    return {
      members,
      partners,
      partnerStaff,
      transactions,
      doctors,
      partnerRequests,
      contactMessages,
      systemSettings,
      pwaInstallations,
      memberNotifications,
      adminUsers,
      databaseSnapshots,
      totalRecords,
    };
  } catch (error) {
    logger.error("Error fetching database stats summary:", error);
    return null;
  }
}

/**
 * One-click Export database dump in JSON or SQL format
 */
export async function exportDatabaseDumpAction(
  format: "json" | "sql" = "json",
  tables?: string[]
): Promise<{ success: boolean; filename?: string; payload?: string; message?: string }> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.error };
  }

  try {
    const dbData = await fetchAllDatabaseData(tables);
    const now = new Date();
    const dateStr = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);

    if (format === "json") {
      const stats: Record<string, number> = {};
      let totalRecords = 0;
      for (const [key, rows] of Object.entries(dbData)) {
        stats[key] = rows.length;
        totalRecords += rows.length;
      }

      const dumpObject = {
        metadata: {
          platform: "Health Club (হেলথ ক্লাব)",
          version: "1.0",
          exportedAt: now.toISOString(),
          exportedBy: auth.email,
          totalRecords,
          tableCounts: stats,
        },
        data: dbData,
      };

      const payload = JSON.stringify(dumpObject, null, 2);
      return {
        success: true,
        filename: `healthclub-db-backup-${dateStr}.json`,
        payload,
      };
    } else {
      // SQL Format
      let sqlDump = `-- =========================================================\n`;
      sqlDump += `-- Health Club Platform - PostgreSQL Database Backup Dump\n`;
      sqlDump += `-- Exported At: ${now.toISOString()}\n`;
      sqlDump += `-- Exported By: ${auth.email}\n`;
      sqlDump += `-- Target Dialect: PostgreSQL (Supabase Compatible)\n`;
      sqlDump += `-- =========================================================\n\n`;
      sqlDump += `BEGIN;\n\n`;

      for (const [key, rows] of Object.entries(dbData)) {
        sqlDump += generateTableSql(key, rows as Record<string, unknown>[]);
      }

      sqlDump += `COMMIT;\n-- Backup Completed Successfully\n`;

      return {
        success: true,
        filename: `healthclub-db-backup-${dateStr}.sql`,
        payload: sqlDump,
      };
    }
  } catch (error) {
    logger.error("Error exporting database dump:", error);
    return { success: false, message: "ডাটাবেস ব্যাকআপ এক্সপোর্ট করতে সমস্যা হয়েছে।" };
  }
}

const createSnapshotSchema = z.object({
  name: z.string().trim().min(2, "স্ন্যাপশটের নাম কমপক্ষে ২ অক্ষরের হতে হবে।").max(100),
  description: z.string().trim().max(300).optional(),
  format: z.enum(["json", "sql"]).default("json"),
  trigger: z.enum(["manual", "automated"]).default("manual"),
});

export type CreateSnapshotInput = z.infer<typeof createSnapshotSchema>;

/**
 * Creates a server-side Database Snapshot with retention policy checks
 */
export async function createDatabaseSnapshotAction(
  rawInput: CreateSnapshotInput
): Promise<{ success: boolean; message: string; snapshotId?: string }> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.error || "অননুমোদিত অ্যাক্সেস।" };
  }

  const parsed = createSnapshotSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    const { name, description, format, trigger } = parsed.data;
    const dbData = await fetchAllDatabaseData();

    const tableStats: Record<string, number> = {};
    for (const [key, rows] of Object.entries(dbData)) {
      tableStats[key] = rows.length;
    }

    let dataPayload = "";
    if (format === "json") {
      dataPayload = JSON.stringify(
        {
          metadata: {
            name,
            description,
            createdAt: new Date().toISOString(),
            createdBy: auth.email,
            tableStats,
          },
          data: dbData,
        },
        null,
        2
      );
    } else {
      let sql = `BEGIN;\n`;
      for (const [key, rows] of Object.entries(dbData)) {
        sql += generateTableSql(key, rows as Record<string, unknown>[]);
      }
      sql += `COMMIT;\n`;
      dataPayload = sql;
    }

    const fileSize = Buffer.byteLength(dataPayload, "utf8");

    // Fetch retention settings
    const settings = await getBackupSettingsAction();
    let expiresAt: Date | null = null;
    if (settings.retentionDays > 0) {
      expiresAt = new Date(Date.now() + settings.retentionDays * 24 * 60 * 60 * 1000);
    }

    const created = await prisma.databaseSnapshot.create({
      data: {
        name,
        description: description || null,
        format,
        fileSize,
        tableStats: JSON.stringify(tableStats),
        dataPayload,
        trigger,
        createdBy: auth.email,
        expiresAt,
      },
    });

    // Auto-cleanup retention policies
    await purgeExpiredSnapshots(settings.maxSnapshots);

    revalidatePath("/admin/settings/backup");
    return {
      success: true,
      message: "ডাটাবেস স্ন্যাপশট সফলভাবে সংরক্ষণ করা হয়েছে।",
      snapshotId: created.id,
    };
  } catch (error) {
    logger.error("Error creating database snapshot:", error);
    return { success: false, message: "ডাটাবেস স্ন্যাপশট তৈরি করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Get all database snapshots for the registry table
 */
export async function getDatabaseSnapshotsAction(): Promise<DatabaseSnapshot[]> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) return [];

  try {
    const records = await prisma.databaseSnapshot.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        format: true,
        fileSize: true,
        tableStats: true,
        trigger: true,
        createdBy: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    return records.map((r) => {
      let parsedStats: Record<string, number> = {};
      try {
        parsedStats = JSON.parse(r.tableStats);
      } catch {
        parsedStats = {};
      }

      return {
        id: r.id,
        name: r.name,
        description: r.description,
        format: r.format as "json" | "sql",
        fileSize: r.fileSize,
        tableStats: parsedStats,
        trigger: r.trigger as "manual" | "automated",
        createdBy: r.createdBy,
        createdAt: r.createdAt.toISOString(),
        expiresAt: r.expiresAt ? r.expiresAt.toISOString() : null,
      };
    });
  } catch (error) {
    logger.error("Error fetching database snapshots:", error);
    return [];
  }
}

/**
 * Downloads the stored data payload for a specific snapshot
 */
export async function downloadSnapshotPayloadAction(
  snapshotId: string
): Promise<{ success: boolean; name?: string; format?: "json" | "sql"; payload?: string; message?: string }> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.error };
  }

  try {
    const record = await prisma.databaseSnapshot.findUnique({
      where: { id: snapshotId },
    });

    if (!record || !record.dataPayload) {
      return { success: false, message: "স্ন্যাপশট ফাইলটি পাওয়া যায়নি।" };
    }

    return {
      success: true,
      name: record.name,
      format: record.format as "json" | "sql",
      payload: record.dataPayload,
    };
  } catch (error) {
    logger.error("Error retrieving snapshot payload:", error);
    return { success: false, message: "স্ন্যাপশট ডাউনলোড করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Deletes a snapshot from the database registry
 */
export async function deleteDatabaseSnapshotAction(
  snapshotId: string
): Promise<{ success: boolean; message: string }> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.error || "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    await prisma.databaseSnapshot.delete({
      where: { id: snapshotId },
    });
    revalidatePath("/admin/settings/backup");
    return { success: true, message: "স্ন্যাপশট সফলভাবে ডিলিট করা হয়েছে।" };
  } catch (error) {
    logger.error("Error deleting database snapshot:", error);
    return { success: false, message: "স্ন্যাপশট ডিলিট করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Get automated backup & retention settings
 */
export async function getBackupSettingsAction(): Promise<BackupSettings> {
  const defaultSettings: BackupSettings = {
    autoSchedule: "weekly",
    retentionDays: 30,
    maxSnapshots: 20,
    lastRunAt: null,
    notifyOnBackup: true,
  };

  try {
    const keys = [
      "backup_auto_schedule",
      "backup_retention_days",
      "backup_max_snapshots",
      "backup_last_run_at",
      "backup_notify_on_backup",
    ];

    const records = await prisma.systemSetting.findMany({
      where: { key: { in: keys } },
    });

    const map = new Map(records.map((r) => [r.key, r.value]));

    return {
      autoSchedule: (map.get("backup_auto_schedule") as BackupSettings["autoSchedule"]) || defaultSettings.autoSchedule,
      retentionDays: Number(map.get("backup_retention_days")) || defaultSettings.retentionDays,
      maxSnapshots: Number(map.get("backup_max_snapshots")) || defaultSettings.maxSnapshots,
      lastRunAt: map.get("backup_last_run_at") || null,
      notifyOnBackup: map.get("backup_notify_on_backup") !== "false",
    };
  } catch (error) {
    logger.error("Error fetching backup settings:", error);
    return defaultSettings;
  }
}

/**
 * Update automated backup & retention settings
 */
export async function updateBackupSettingsAction(
  settings: BackupSettings
): Promise<{ success: boolean; message: string }> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.error || "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const entries = [
      { key: "backup_auto_schedule", value: settings.autoSchedule },
      { key: "backup_retention_days", value: String(settings.retentionDays) },
      { key: "backup_max_snapshots", value: String(settings.maxSnapshots) },
      { key: "backup_notify_on_backup", value: settings.notifyOnBackup ? "true" : "false" },
    ];

    await prisma.$transaction(
      entries.map((item) =>
        prisma.systemSetting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value },
        })
      )
    );

    revalidatePath("/admin/settings/backup");
    return { success: true, message: "ব্যাকআপ ও রিটেনশন পলিসি সফলভাবে সংরক্ষিত হয়েছে।" };
  } catch (error) {
    logger.error("Error updating backup settings:", error);
    return { success: false, message: "ব্যাকআপ পলিসি সংরক্ষণ করতে সমস্যা হয়েছে।" };
  }
}
