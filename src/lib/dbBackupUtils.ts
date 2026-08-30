import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";

/**
 * Maps Prisma model names and UI identifiers to actual PostgreSQL snake_case table names.
 */
export const MODEL_TO_POSTGRES_TABLE_MAP: Record<string, string> = {
  members: "members",
  member: "members",
  Member: "members",
  partners: "partners",
  partner: "partners",
  Partner: "partners",
  partnerStaff: "partner_staff",
  partner_staff: "partner_staff",
  PartnerStaff: "partner_staff",
  transactions: "transactions",
  transaction: "transactions",
  Transaction: "transactions",
  doctors: "doctors",
  doctor: "doctors",
  Doctor: "doctors",
  partnerRequests: "partner_requests",
  partner_requests: "partner_requests",
  PartnerRequest: "partner_requests",
  contactMessages: "contact_messages",
  contact_messages: "contact_messages",
  ContactMessage: "contact_messages",
  systemSettings: "system_settings",
  system_settings: "system_settings",
  SystemSetting: "system_settings",
  pwaInstallations: "pwa_installations",
  pwa_installations: "pwa_installations",
  PwaInstallation: "pwa_installations",
  memberNotifications: "member_notifications",
  member_notifications: "member_notifications",
  MemberNotification: "member_notifications",
  adminUsers: "admin_users",
  admin_users: "admin_users",
  AdminUser: "admin_users",
  databaseSnapshots: "database_snapshots",
  database_snapshots: "database_snapshots",
  DatabaseSnapshot: "database_snapshots",
  reviews: "reviews",
  review: "reviews",
  Review: "reviews",
  pushSubscriptions: "push_subscriptions",
  push_subscriptions: "push_subscriptions",
  PushSubscription: "push_subscriptions",
};

/**
 * Maps Prisma camelCase property names to PostgreSQL snake_case column names per table.
 */
export const MODEL_COLUMN_MAPS: Record<string, Record<string, string>> = {
  members: {
    joinedDate: "joined_date",
    expiryDate: "expiry_date",
    qrCodeUrl: "qr_code_url",
    totalSaved: "total_saved",
    birthDate: "birth_date",
    profilePictureUrl: "profile_picture_url",
    emailVerified: "email_verified",
    verificationCode: "verification_code",
    verificationCodeCreatedAt: "verification_code_created_at",
    createdAt: "created_at",
    bkashSender: "bkash_sender",
    bkashTxnId: "bkash_txn_id",
    renewalStatus: "renewal_status",
    renewalBkashSender: "renewal_bkash_sender",
    renewalBkashTxnId: "renewal_bkash_txn_id",
  },
  partners: {
    logoText: "logo_text",
    mapLink: "map_link",
    imageUrl: "image_url",
    emergencyPhone: "emergency_phone",
    workingHours: "working_hours",
    departmentDiscounts: "department_discounts",
    verificationCode: "verification_code",
    verificationCodeCreatedAt: "verification_code_created_at",
    createdAt: "created_at",
  },
  partner_staff: {
    partnerId: "partner_id",
    deskName: "desk_name",
    isActive: "is_active",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  transactions: {
    memberId: "member_id",
    memberName: "member_name",
    partnerId: "partner_id",
    partnerName: "partner_name",
    staffId: "staff_id",
    staffName: "staff_name",
    deskName: "desk_name",
    createdAt: "created_at",
  },
  doctors: {
    chamberName: "chamber_name",
    chamberAddress: "chamber_address",
    roomNo: "room_no",
    visitingDays: "visiting_days",
    visitingHours: "visiting_hours",
    serialPhone: "serial_phone",
    consultationFee: "consultation_fee",
    imageUrl: "image_url",
    partnerId: "partner_id",
    isActive: "is_active",
    availableToday: "available_today",
    onLeaveUntil: "on_leave_until",
    createdAt: "created_at",
  },
  partner_requests: {
    orgName: "org_name",
    contactName: "contact_name",
    createdAt: "created_at",
  },
  contact_messages: {
    createdAt: "created_at",
  },
  system_settings: {
    updatedAt: "updated_at",
  },
  pwa_installations: {
    userId: "user_id",
    deviceType: "device_type",
    isStandalone: "is_standalone",
    installedAt: "installed_at",
    lastActiveAt: "last_active_at",
    promptShown: "prompt_shown",
    promptDismissed: "prompt_dismissed",
    promptAccepted: "prompt_accepted",
    sessionCount: "session_count",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  member_notifications: {
    memberId: "member_id",
    titleBn: "title_bn",
    titleEn: "title_en",
    messageBn: "message_bn",
    messageEn: "message_en",
    isRead: "is_read",
    createdAt: "created_at",
  },
  admin_users: {
    isActive: "is_active",
    lastLoginAt: "last_login_at",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  database_snapshots: {
    fileSize: "file_size",
    tableStats: "table_stats",
    dataPayload: "data_payload",
    createdBy: "created_by",
    createdAt: "created_at",
    expiresAt: "expires_at",
  },
  reviews: {
    memberId: "member_id",
    partnerId: "partner_id",
    adminFeedback: "admin_feedback",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  push_subscriptions: {
    userId: "user_id",
    userRole: "user_role",
    userAgent: "user_agent",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

/**
 * Converts a camelCase identifier to snake_case.
 */
export function camelToSnakeCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

/**
 * Resolves the PostgreSQL table name for a given model or table identifier.
 */
export function getPostgresTableName(identifier: string): string {
  return MODEL_TO_POSTGRES_TABLE_MAP[identifier] || camelToSnakeCase(identifier);
}

/**
 * Resolves the PostgreSQL column name for a given table and property key.
 */
export function getPostgresColumnName(tableNameOrModel: string, propName: string): string {
  const pgTable = getPostgresTableName(tableNameOrModel);
  const tableMap = MODEL_COLUMN_MAPS[pgTable];
  if (tableMap && tableMap[propName]) {
    return tableMap[propName];
  }
  return camelToSnakeCase(propName);
}

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
 * Generate PostgreSQL INSERT statement for a batch of records with accurate snake_case identifiers.
 */
export function generateTableSql(tableName: string, rows: Record<string, unknown>[]): string {
  const pgTableName = getPostgresTableName(tableName);
  if (!rows || rows.length === 0) return `-- No records in table ${pgTableName}\n`;

  const rawPropertyKeys = Object.keys(rows[0]);
  const pgColumns = rawPropertyKeys.map((prop) => getPostgresColumnName(pgTableName, prop));
  const colNames = pgColumns.map((col) => `"${col}"`).join(", ");

  let sql = `-- Table: ${pgTableName} (${rows.length} rows)\n`;
  for (const row of rows) {
    const values = rawPropertyKeys.map((prop) => escapeSqlValue(row[prop])).join(", ");
    sql += `INSERT INTO "${pgTableName}" (${colNames}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
  }
  return sql + "\n";
}

/**
 * Fetches all database records grouped by model name in foreign-key safe dependency order.
 */
export async function fetchAllDatabaseData(tables?: string[]) {
  // Normalize table selection to check both camelCase and snake_case keys
  const requestedNormalized = tables && tables.length > 0
    ? new Set(tables.map((t) => getPostgresTableName(t)))
    : null;

  const isIncluded = (key: string) => {
    if (!requestedNormalized) return true;
    return requestedNormalized.has(getPostgresTableName(key));
  };

  const data: Record<string, unknown[]> = {};

  // 1. Independent parent tables
  if (isIncluded("systemSettings")) data.systemSettings = await prisma.systemSetting.findMany();
  if (isIncluded("adminUsers")) data.adminUsers = await prisma.adminUser.findMany();
  if (isIncluded("pwaInstallations")) data.pwaInstallations = await prisma.pwaInstallation.findMany();
  if (isIncluded("contactMessages")) data.contactMessages = await prisma.contactMessage.findMany();
  if (isIncluded("partnerRequests")) data.partnerRequests = await prisma.partnerRequest.findMany();
  if (isIncluded("pushSubscriptions")) data.pushSubscriptions = await prisma.pushSubscription.findMany();
  if (isIncluded("members")) data.members = await prisma.member.findMany();
  if (isIncluded("partners")) data.partners = await prisma.partner.findMany();

  // 2. Child tables with foreign keys
  if (isIncluded("partnerStaff")) data.partnerStaff = await prisma.partnerStaff.findMany();
  if (isIncluded("doctors")) data.doctors = await prisma.doctor.findMany();
  if (isIncluded("transactions")) data.transactions = await prisma.transaction.findMany();
  if (isIncluded("memberNotifications")) data.memberNotifications = await prisma.memberNotification.findMany();
  if (isIncluded("reviews")) data.reviews = await prisma.review.findMany();

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
