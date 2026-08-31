"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { hasAdminPermission } from "@/lib/permissions";

export type NotificationCategory =
  | "renewal"
  | "partner_request"
  | "message"
  | "member_new"
  | "member_expiring"
  | "system";

export type NotificationSeverity = "high" | "medium" | "low" | "info";

export interface AdminNotificationItem {
  id: string;
  category: NotificationCategory;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  timestamp: string;
  actionUrl: string;
  actionLabelBn: string;
  actionLabelEn: string;
  severity: NotificationSeverity;
  meta?: Record<string, string | number | boolean | null | undefined>;
  isRead?: boolean;
}

export interface AdminNotificationSummary {
  items: AdminNotificationItem[];
  unreadCount: number;
  highPriorityCount: number;
  pendingRenewalsCount: number;
  pendingPartnerRequestsCount: number;
  unreadMessagesCount: number;
  expiringMembersCount: number;
  newMembersCount: number;
}

export interface PaginatedAdminNotificationsResult {
  items: AdminNotificationItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  summary: AdminNotificationSummary;
}

export interface GetAdminNotificationsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  severity?: string;
  search?: string;
  unreadOnly?: boolean;
  readIds?: string[];
  dismissedIds?: string[];
}

const DEFAULT_SUMMARY: AdminNotificationSummary = {
  items: [],
  unreadCount: 0,
  highPriorityCount: 0,
  pendingRenewalsCount: 0,
  pendingPartnerRequestsCount: 0,
  unreadMessagesCount: 0,
  expiringMembersCount: 0,
  newMembersCount: 0,
};

const SETTING_KEY_READ = "admin_notifications_read_ids";
const SETTING_KEY_DISMISSED = "admin_notifications_dismissed_ids";

async function getPersistedAdminNotificationIds(key: string): Promise<string[]> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key },
    });
    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    logger.error(`Error reading ${key} from systemSetting:`, err);
  }
  return [];
}

async function savePersistedAdminNotificationIds(key: string, ids: string[]): Promise<boolean> {
  try {
    const truncated = ids.slice(-200);
    await prisma.systemSetting.upsert({
      where: { key },
      create: { key, value: JSON.stringify(truncated) },
      update: { value: JSON.stringify(truncated) },
    });
    return true;
  } catch (err) {
    logger.error(`Error saving ${key} to systemSetting:`, err);
    return false;
  }
}

/**
 * Fetches real-time administrative notifications with server-side pagination,
 * filtering and search support.
 */
export async function getAdminNotificationsAction(
  params?: GetAdminNotificationsParams
): Promise<PaginatedAdminNotificationsResult> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin" || !hasAdminPermission(session.adminRole || "super_admin", "manage_notifications")) {
    return {
      items: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: params?.pageSize || 10,
      summary: DEFAULT_SUMMARY,
    };
  }

  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fifteenDaysAhead = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

    const [
      pendingRenewals,
      pendingPartnerRequests,
      contactMessages,
      recentMembers,
      expiringMembers,
      dbReadIds,
      dbDismissedIds,
    ] = await Promise.all([
      // 1. Pending renewal requests
      prisma.member.findMany({
        where: { renewalStatus: "pending" },
        select: {
          id: true,
          name: true,
          phone: true,
          renewalBkashSender: true,
          renewalBkashTxnId: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),

      // 2. Pending partner requests
      prisma.partnerRequest.findMany({
        where: { status: "pending" },
        select: {
          id: true,
          orgName: true,
          category: true,
          phone: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),

      // 3. Contact messages
      prisma.contactMessage.findMany({
        select: {
          id: true,
          name: true,
          phone: true,
          message: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),

      // 4. Recently registered members (last 7 days)
      prisma.member.findMany({
        where: {
          createdAt: { gte: sevenDaysAgo },
        },
        select: {
          id: true,
          name: true,
          phone: true,
          tier: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),

      // 5. Active members expiring within 15 days
      prisma.member.findMany({
        where: {
          status: "active",
          expiryDate: {
            gte: now,
            lte: fifteenDaysAhead,
          },
        },
        select: {
          id: true,
          name: true,
          phone: true,
          tier: true,
          expiryDate: true,
        },
        orderBy: { expiryDate: "asc" },
        take: 50,
      }),

      // 6. Persisted DB Read IDs
      getPersistedAdminNotificationIds(SETTING_KEY_READ),

      // 7. Persisted DB Dismissed IDs
      getPersistedAdminNotificationIds(SETTING_KEY_DISMISSED),
    ]);

    const allNotifications: AdminNotificationItem[] = [];

    // Format Renewal Notifications
    for (const r of pendingRenewals) {
      allNotifications.push({
        id: `renewal-${r.id}`,
        category: "renewal",
        titleBn: "নতুন মেম্বারশিপ নবায়ন আবেদন",
        titleEn: "New Membership Renewal Request",
        descriptionBn: `${r.name} (${r.phone}) বিকাশ TrxID: ${r.renewalBkashTxnId || "N/A"} দিয়ে নবায়ন আবেদন করেছেন।`,
        descriptionEn: `${r.name} (${r.phone}) requested renewal with bKash TrxID: ${r.renewalBkashTxnId || "N/A"}.`,
        timestamp: r.createdAt.toISOString(),
        actionUrl: "/admin/renewals",
        actionLabelBn: "অনুমোদন করুন",
        actionLabelEn: "Review & Approve",
        severity: "high",
        meta: {
          memberId: r.id,
          phone: r.phone,
          sender: r.renewalBkashSender,
          trxId: r.renewalBkashTxnId,
        },
      });
    }

    // Format Partner Request Notifications
    for (const p of pendingPartnerRequests) {
      const catBn =
        p.category === "hospital"
          ? "হাসপাতাল"
          : p.category === "diagnostic"
            ? "ডায়াগনস্টিক সেন্টার"
            : "ফার্মেসি";
      allNotifications.push({
        id: `partner-req-${p.id}`,
        category: "partner_request",
        titleBn: "নতুন পার্টনার আবেদন",
        titleEn: "New Partner Application",
        descriptionBn: `"${p.orgName}" (${catBn}) অংশীদারিত্বের জন্য আবেদন জমা দিয়েছে।`,
        descriptionEn: `"${p.orgName}" (${p.category}) submitted a partner onboarding application.`,
        timestamp: p.createdAt.toISOString(),
        actionUrl: "/admin/partner-requests",
        actionLabelBn: "আবেদন দেখুন",
        actionLabelEn: "View Request",
        severity: "high",
        meta: {
          orgName: p.orgName,
          category: p.category,
          phone: p.phone,
        },
      });
    }

    // Format Contact Messages
    for (const msg of contactMessages) {
      const snippet =
        msg.message.length > 60
          ? `${msg.message.slice(0, 60)}...`
          : msg.message;
      allNotifications.push({
        id: `msg-${msg.id}`,
        category: "message",
        titleBn: `নতুন বার্তা: ${msg.name}`,
        titleEn: `New Message: ${msg.name}`,
        descriptionBn: `"${snippet}" - যোগাযোগ: ${msg.phone}`,
        descriptionEn: `"${snippet}" - Contact: ${msg.phone}`,
        timestamp: msg.createdAt.toISOString(),
        actionUrl: "/admin/messages",
        actionLabelBn: "বার্তা পড়ুন",
        actionLabelEn: "Read Message",
        severity: "medium",
        meta: {
          senderName: msg.name,
          phone: msg.phone,
        },
      });
    }

    // Format Expiring Members
    for (const exp of expiringMembers) {
      const expDateStr = new Date(exp.expiryDate).toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      allNotifications.push({
        id: `expiring-${exp.id}`,
        category: "member_expiring",
        titleBn: "মেম্বারশিপের মেয়াদ উত্তীর্ণের সতর্কতা",
        titleEn: "Membership Expiring Soon",
        descriptionBn: `${exp.name} (${exp.phone}) এর কার্ডের মেয়াদ ${expDateStr} তারিখে শেষ হবে।`,
        descriptionEn: `${exp.name} (${exp.phone}) membership will expire on ${expDateStr}.`,
        timestamp: exp.expiryDate.toISOString(),
        actionUrl: "/admin/members",
        actionLabelBn: "সদস্য দেখুন",
        actionLabelEn: "View Member",
        severity: "medium",
        meta: {
          memberId: exp.id,
          phone: exp.phone,
        },
      });
    }

    // Format New Members
    for (const mem of recentMembers) {
      const tierLabel = mem.tier === "founding" ? "ফাউন্ডিং মেম্বার" : "প্রিমিয়াম মেম্বার";
      allNotifications.push({
        id: `new-mem-${mem.id}`,
        category: "member_new",
        titleBn: "নতুন সদস্য নিবন্ধন",
        titleEn: "New Member Registered",
        descriptionBn: `${mem.name} (${tierLabel}) সফলভাবে নিবন্ধিত হয়েছেন।`,
        descriptionEn: `${mem.name} (${mem.tier}) has recently registered.`,
        timestamp: mem.createdAt.toISOString(),
        actionUrl: "/admin/members",
        actionLabelBn: "প্রোফাইল দেখুন",
        actionLabelEn: "View Profile",
        severity: "low",
        meta: {
          memberId: mem.id,
          phone: mem.phone,
          tier: mem.tier,
        },
      });
    }

    // Sort all by timestamp descending
    allNotifications.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Merge persisted DB sets with any passed client IDs
    const dismissedSet = new Set([...dbDismissedIds, ...(params?.dismissedIds || [])]);
    const readSet = new Set([...dbReadIds, ...(params?.readIds || [])]);

    // Explicitly set isRead flag on every notification item
    for (const item of allNotifications) {
      item.isRead = readSet.has(item.id);
    }

    const unreadCount = allNotifications.filter(
      (item) => !dismissedSet.has(item.id) && !item.isRead
    ).length;

    const highPriorityCount = allNotifications.filter(
      (item) =>
        item.severity === "high" &&
        !dismissedSet.has(item.id) &&
        !item.isRead
    ).length;

    const summary: AdminNotificationSummary = {
      items: allNotifications,
      unreadCount,
      highPriorityCount,
      pendingRenewalsCount: pendingRenewals.length,
      pendingPartnerRequestsCount: pendingPartnerRequests.length,
      unreadMessagesCount: contactMessages.length,
      expiringMembersCount: expiringMembers.length,
      newMembersCount: recentMembers.length,
    };

    // Filter by dismissed
    let filtered = allNotifications.filter((item) => !dismissedSet.has(item.id));

    // Filter by Category
    if (params?.category && params.category !== "all") {
      if (params.category === "actions") {
        filtered = filtered.filter(
          (item) => item.category === "renewal" || item.category === "partner_request"
        );
      } else {
        filtered = filtered.filter((item) => item.category === params.category);
      }
    }

    // Filter by Unread Only
    if (params?.unreadOnly) {
      filtered = filtered.filter((item) => !item.isRead);
    }

    // Filter by Search Query
    if (params?.search && params.search.trim().length > 0) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter((item) => {
        const titleBn = item.titleBn.toLowerCase();
        const titleEn = item.titleEn.toLowerCase();
        const descBn = item.descriptionBn.toLowerCase();
        const descEn = item.descriptionEn.toLowerCase();
        const phone = String(item.meta?.phone || "").toLowerCase();
        const orgName = String(item.meta?.orgName || "").toLowerCase();
        const sender = String(item.meta?.sender || "").toLowerCase();
        const trxId = String(item.meta?.trxId || "").toLowerCase();

        return (
          titleBn.includes(q) ||
          titleEn.includes(q) ||
          descBn.includes(q) ||
          descEn.includes(q) ||
          phone.includes(q) ||
          orgName.includes(q) ||
          sender.includes(q) ||
          trxId.includes(q)
        );
      });
    }

    const totalItems = filtered.length;
    const page = Math.max(1, params?.page || 1);
    const pageSize = Math.max(1, params?.pageSize || 10);
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
      summary,
    };
  } catch (error) {
    logger.error("Error in getAdminNotificationsAction:", error);
    return {
      items: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: params?.pageSize || 10,
      summary: DEFAULT_SUMMARY,
    };
  }
}

/**
 * Marks a single admin notification as read and persists it to the database.
 */
export async function markAdminNotificationReadAction(
  notificationId: string
): Promise<{ success: boolean; readIds: string[] }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { success: false, readIds: [] };
  }

  const current = await getPersistedAdminNotificationIds(SETTING_KEY_READ);
  if (!current.includes(notificationId)) {
    const updated = [...current, notificationId];
    await savePersistedAdminNotificationIds(SETTING_KEY_READ, updated);
    return { success: true, readIds: updated };
  }
  return { success: true, readIds: current };
}

/**
 * Marks all given admin notifications (or all current active items) as read.
 */
export async function markAllAdminNotificationsReadAction(
  notificationIds?: string[]
): Promise<{ success: boolean; readIds: string[] }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { success: false, readIds: [] };
  }

  const current = await getPersistedAdminNotificationIds(SETTING_KEY_READ);
  const toAdd = notificationIds && notificationIds.length > 0 ? notificationIds : [];
  const merged = Array.from(new Set([...current, ...toAdd]));
  await savePersistedAdminNotificationIds(SETTING_KEY_READ, merged);
  return { success: true, readIds: merged };
}

/**
 * Dismisses a single notification and persists dismissal to the database.
 */
export async function dismissAdminNotificationAction(
  notificationId: string
): Promise<{ success: boolean; dismissedIds: string[] }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { success: false, dismissedIds: [] };
  }

  const current = await getPersistedAdminNotificationIds(SETTING_KEY_DISMISSED);
  if (!current.includes(notificationId)) {
    const updated = [...current, notificationId];
    await savePersistedAdminNotificationIds(SETTING_KEY_DISMISSED, updated);
    return { success: true, dismissedIds: updated };
  }
  return { success: true, dismissedIds: current };
}

/**
 * Clears all read notifications by dismissing them in the database.
 */
export async function clearAllAdminReadAction(): Promise<{
  success: boolean;
  dismissedIds: string[];
}> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { success: false, dismissedIds: [] };
  }

  const [currentRead, currentDismissed] = await Promise.all([
    getPersistedAdminNotificationIds(SETTING_KEY_READ),
    getPersistedAdminNotificationIds(SETTING_KEY_DISMISSED),
  ]);

  const merged = Array.from(new Set([...currentDismissed, ...currentRead]));
  await savePersistedAdminNotificationIds(SETTING_KEY_DISMISSED, merged);
  return { success: true, dismissedIds: merged };
}
