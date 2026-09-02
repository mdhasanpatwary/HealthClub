"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { hasAdminPermission } from "@/lib/permissions";
import {
  type NotificationCategory,
  type NotificationSeverity,
  type AdminNotificationItem,
  type AdminNotificationSummary,
  type PaginatedAdminNotificationsResult,
  type GetAdminNotificationsParams,
  DEFAULT_SUMMARY,
  SETTING_KEY_READ,
  SETTING_KEY_DISMISSED,
  getPersistedAdminNotificationIds,
  savePersistedAdminNotificationIds,
  formatRenewalNotifications,
  formatPartnerRequestNotifications,
  formatContactMessageNotifications,
  formatExpiringMemberNotifications,
  formatNewMemberNotifications,
  filterAndPaginateNotifications,
} from "./adminNotificationHelpers";

export type {
  NotificationCategory,
  NotificationSeverity,
  AdminNotificationItem,
  AdminNotificationSummary,
  PaginatedAdminNotificationsResult,
  GetAdminNotificationsParams,
};

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

    const allNotifications: AdminNotificationItem[] = [
      ...formatRenewalNotifications(pendingRenewals),
      ...formatPartnerRequestNotifications(pendingPartnerRequests),
      ...formatContactMessageNotifications(contactMessages),
      ...formatExpiringMemberNotifications(expiringMembers),
      ...formatNewMemberNotifications(recentMembers),
    ];

    // Sort all by timestamp descending
    allNotifications.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Merge persisted DB sets with any passed client IDs
    const dismissedSet = new Set([...dbDismissedIds, ...(params?.dismissedIds || [])]);
    const readSet = new Set([...dbReadIds, ...(params?.readIds || [])]);

    return filterAndPaginateNotifications(
      allNotifications,
      params,
      dismissedSet,
      readSet,
      {
        pendingRenewalsCount: pendingRenewals.length,
        pendingPartnerRequestsCount: pendingPartnerRequests.length,
        unreadMessagesCount: contactMessages.length,
        expiringMembersCount: expiringMembers.length,
        newMembersCount: recentMembers.length,
      }
    );
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
