import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// Re-export all types from the dedicated types file
export type {
  NotificationCategory,
  NotificationSeverity,
  AdminNotificationItem,
  AdminNotificationSummary,
  PaginatedAdminNotificationsResult,
  GetAdminNotificationsParams,
} from "./adminNotificationTypes";

import type {
  AdminNotificationItem,
  AdminNotificationSummary,
  PaginatedAdminNotificationsResult,
  GetAdminNotificationsParams,
} from "./adminNotificationTypes";

export const DEFAULT_SUMMARY: AdminNotificationSummary = {
  items: [],
  unreadCount: 0,
  highPriorityCount: 0,
  pendingRenewalsCount: 0,
  pendingPartnerRequestsCount: 0,
  unreadMessagesCount: 0,
  expiringMembersCount: 0,
  newMembersCount: 0,
};

export const SETTING_KEY_READ = "admin_notifications_read_ids";
export const SETTING_KEY_DISMISSED = "admin_notifications_dismissed_ids";

export async function getPersistedAdminNotificationIds(key: string): Promise<string[]> {
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

export async function savePersistedAdminNotificationIds(key: string, ids: string[]): Promise<boolean> {
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

export function formatRenewalNotifications(
  pendingRenewals: Array<{
    id: string;
    name: string;
    phone: string;
    renewalBkashSender: string | null;
    renewalBkashTxnId: string | null;
    createdAt: Date;
  }>
): AdminNotificationItem[] {
  return pendingRenewals.map((r) => ({
    id: `renewal-${r.id}`,
    category: "renewal" as const,
    titleBn: "নতুন মেম্বারশিপ নবায়ন আবেদন",
    titleEn: "New Membership Renewal Request",
    descriptionBn: `${r.name} (${r.phone}) বিকাশ TrxID: ${r.renewalBkashTxnId || "N/A"} দিয়ে নবায়ন আবেদন করেছেন।`,
    descriptionEn: `${r.name} (${r.phone}) requested renewal with bKash TrxID: ${r.renewalBkashTxnId || "N/A"}.`,
    timestamp: r.createdAt.toISOString(),
    actionUrl: "/admin/renewals",
    actionLabelBn: "অনুমোদন করুন",
    actionLabelEn: "Review & Approve",
    severity: "high" as const,
    meta: {
      memberId: r.id,
      phone: r.phone,
      sender: r.renewalBkashSender,
      trxId: r.renewalBkashTxnId,
    },
  }));
}

export function formatPartnerRequestNotifications(
  pendingPartnerRequests: Array<{
    id: string;
    orgName: string;
    category: string;
    phone: string;
    createdAt: Date;
  }>
): AdminNotificationItem[] {
  return pendingPartnerRequests.map((p) => {
    const catBn =
      p.category === "hospital"
        ? "হাসপাতাল"
        : p.category === "diagnostic"
          ? "ডায়াগনস্টিক সেন্টার"
          : "ফার্মেসি";
    return {
      id: `partner-req-${p.id}`,
      category: "partner_request" as const,
      titleBn: "নতুন পার্টনার আবেদন",
      titleEn: "New Partner Application",
      descriptionBn: `"${p.orgName}" (${catBn}) অংশীদারিত্বের জন্য আবেদন জমা দিয়েছে।`,
      descriptionEn: `"${p.orgName}" (${p.category}) submitted a partner onboarding application.`,
      timestamp: p.createdAt.toISOString(),
      actionUrl: "/admin/partner-requests",
      actionLabelBn: "আবেদন দেখুন",
      actionLabelEn: "View Request",
      severity: "high" as const,
      meta: {
        orgName: p.orgName,
        category: p.category,
        phone: p.phone,
      },
    };
  });
}

export function formatContactMessageNotifications(
  contactMessages: Array<{
    id: string;
    name: string;
    phone: string;
    message: string;
    createdAt: Date;
  }>
): AdminNotificationItem[] {
  return contactMessages.map((msg) => {
    const snippet =
      msg.message.length > 60
        ? `${msg.message.slice(0, 60)}...`
        : msg.message;
    return {
      id: `msg-${msg.id}`,
      category: "message" as const,
      titleBn: `নতুন বার্তা: ${msg.name}`,
      titleEn: `New Message: ${msg.name}`,
      descriptionBn: `"${snippet}" - যোগাযোগ: ${msg.phone}`,
      descriptionEn: `"${snippet}" - Contact: ${msg.phone}`,
      timestamp: msg.createdAt.toISOString(),
      actionUrl: "/admin/messages",
      actionLabelBn: "বার্তা পড়ুন",
      actionLabelEn: "Read Message",
      severity: "medium" as const,
      meta: {
        senderName: msg.name,
        phone: msg.phone,
      },
    };
  });
}

export function formatExpiringMemberNotifications(
  expiringMembers: Array<{
    id: string;
    name: string;
    phone: string;
    tier: string;
    expiryDate: Date;
  }>
): AdminNotificationItem[] {
  return expiringMembers.map((exp) => {
    const expDateStr = new Date(exp.expiryDate).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return {
      id: `expiring-${exp.id}`,
      category: "member_expiring" as const,
      titleBn: "মেম্বারশিপের মেয়াদ উত্তীর্ণের সতর্কতা",
      titleEn: "Membership Expiring Soon",
      descriptionBn: `${exp.name} (${exp.phone}) এর কার্ডের মেয়াদ ${expDateStr} তারিখে শেষ হবে।`,
      descriptionEn: `${exp.name} (${exp.phone}) membership will expire on ${expDateStr}.`,
      timestamp: exp.expiryDate.toISOString(),
      actionUrl: "/admin/members",
      actionLabelBn: "সদস্য দেখুন",
      actionLabelEn: "View Member",
      severity: "medium" as const,
      meta: {
        memberId: exp.id,
        phone: exp.phone,
      },
    };
  });
}

export function formatNewMemberNotifications(
  recentMembers: Array<{
    id: string;
    name: string;
    phone: string;
    tier: string;
    status: string;
    createdAt: Date;
  }>
): AdminNotificationItem[] {
  return recentMembers.map((mem) => {
    const tierLabel = mem.tier === "founding" ? "ফাউন্ডিং মেম্বার" : "প্রিমিয়াম মেম্বার";
    return {
      id: `new-mem-${mem.id}`,
      category: "member_new" as const,
      titleBn: "নতুন সদস্য নিবন্ধন",
      titleEn: "New Member Registered",
      descriptionBn: `${mem.name} (${tierLabel}) সফলভাবে নিবন্ধিত হয়েছেন।`,
      descriptionEn: `${mem.name} (${mem.tier}) has recently registered.`,
      timestamp: mem.createdAt.toISOString(),
      actionUrl: "/admin/members",
      actionLabelBn: "প্রোফাইল দেখুন",
      actionLabelEn: "View Profile",
      severity: "low" as const,
      meta: {
        memberId: mem.id,
        phone: mem.phone,
        tier: mem.tier,
      },
    };
  });
}

export function filterAndPaginateNotifications(
  allNotifications: AdminNotificationItem[],
  params: GetAdminNotificationsParams | undefined,
  dismissedSet: Set<string>,
  readSet: Set<string>,
  counts: {
    pendingRenewalsCount: number;
    pendingPartnerRequestsCount: number;
    unreadMessagesCount: number;
    expiringMembersCount: number;
    newMembersCount: number;
  }
): PaginatedAdminNotificationsResult {
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
    pendingRenewalsCount: counts.pendingRenewalsCount,
    pendingPartnerRequestsCount: counts.pendingPartnerRequestsCount,
    unreadMessagesCount: counts.unreadMessagesCount,
    expiringMembersCount: counts.expiringMembersCount,
    newMembersCount: counts.newMembersCount,
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
}
