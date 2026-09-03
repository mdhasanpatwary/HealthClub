/**
 * Pure type definitions for admin notifications.
 * Separated from helpers to avoid Turbopack bundling issues
 * where type exports from mixed-export files can leak as
 * undefined runtime references in the server actions tree.
 */

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
