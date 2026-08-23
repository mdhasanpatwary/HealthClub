"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { MemberNotification, MemberNotificationType } from "@/services/db";

export interface MemberNotificationSummary {
  items: MemberNotification[];
  unreadCount: number;
  highPriorityCount: number;
}

export interface GetMemberNotificationsParams {
  unreadOnly?: boolean;
  type?: string;
  limit?: number;
}

export interface CreateMemberNotificationInput {
  memberId: string;
  type: MemberNotificationType;
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  link?: string;
}

/**
 * Internal helper to safely create a notification for a member.
 */
export async function createMemberNotification(
  data: CreateMemberNotificationInput
): Promise<MemberNotification | null> {
  try {
    const notification = await prisma.memberNotification.create({
      data: {
        id: `notif_${crypto.randomUUID()}`,
        memberId: data.memberId,
        type: data.type,
        titleBn: data.titleBn,
        titleEn: data.titleEn,
        messageBn: data.messageBn,
        messageEn: data.messageEn,
        link: data.link || null,
        isRead: false,
      },
    });

    return {
      id: notification.id,
      memberId: notification.memberId,
      type: notification.type as MemberNotificationType,
      titleBn: notification.titleBn,
      titleEn: notification.titleEn,
      messageBn: notification.messageBn,
      messageEn: notification.messageEn,
      isRead: notification.isRead,
      link: notification.link || undefined,
      createdAt: notification.createdAt.toISOString(),
    };
  } catch (error) {
    logger.error("Error creating member notification:", error);
    return null;
  }
}

/**
 * Fetches in-app notifications for the currently logged-in member.
 * Also evaluates expiration proximity and auto-creates reminder alerts when needed.
 */
export async function getMemberNotificationsAction(
  params?: GetMemberNotificationsParams
): Promise<MemberNotificationSummary> {
  const session = await getSessionUser();
  if (!session || !session.userId) {
    return { items: [], unreadCount: 0, highPriorityCount: 0 };
  }

  const memberId = session.userId;

  try {
    // 1. Fetch member to check expiry status
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true, name: true, expiryDate: true, status: true },
    });

    if (member && member.status === "active") {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const expiry = new Date(member.expiryDate);
      expiry.setHours(0, 0, 0, 0);
      const diffMs = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      // If expiring within 30 days or already expired, verify if an expiring notification exists within the last 7 days
      if (diffDays <= 30) {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const existingAlert = await prisma.memberNotification.findFirst({
          where: {
            memberId,
            type: "expiring_soon",
            createdAt: { gte: sevenDaysAgo },
          },
        });

        if (!existingAlert) {
          const isExpired = diffDays <= 0;
          await createMemberNotification({
            memberId,
            type: "expiring_soon",
            titleBn: isExpired
              ? "মেম্বারশিপের মেয়াদ উত্তীর্ণ হয়েছে"
              : "মেম্বারশিপের মেয়াদ উত্তীর্ণের সতর্কতা",
            titleEn: isExpired
              ? "Membership Expired"
              : "Membership Expiring Soon",
            messageBn: isExpired
              ? "আপনার হেলথ ক্লাব মেম্বারশিপ কার্ডটির মেয়াদ শেষ হয়ে গেছে। সব পার্টনার হাসপাতালের সুবিধা সচল রাখতে দ্রুত রিনিউ করুন।"
              : `আপনার মেম্বারশিপ কার্ডের মেয়াদ আর মাত্র ${diffDays} দিন বাকি রয়েছে। নিরবচ্ছিন্ন ডিসকাউন্ট পেতে এখনই রিনিউ করুন।`,
            messageEn: isExpired
              ? "Your Health Club membership card has expired. Please renew now to restore healthcare partner discounts."
              : `Your membership card will expire in ${diffDays} days. Renew today to maintain uninterrupted benefits.`,
            link: "/dashboard/renew",
          });
        }
      }
    }

    // 2. Fetch all member notifications
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { memberId };
    if (params?.unreadOnly) {
      where.isRead = false;
    }
    if (params?.type && params.type !== "all") {
      if (params.type === "transactions") {
        where.type = "transaction_recorded";
      } else if (params.type === "account") {
        where.type = { in: ["renewal_approved", "renewal_rejected", "expiring_soon", "welcome", "system"] };
      } else {
        where.type = params.type;
      }
    }

    const notifications = await prisma.memberNotification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: params?.limit || 50,
    });

    // 3. Count unread
    const unreadCount = await prisma.memberNotification.count({
      where: { memberId, isRead: false },
    });

    const items: MemberNotification[] = notifications.map((n) => ({
      id: n.id,
      memberId: n.memberId,
      type: n.type as MemberNotificationType,
      titleBn: n.titleBn,
      titleEn: n.titleEn,
      messageBn: n.messageBn,
      messageEn: n.messageEn,
      isRead: n.isRead,
      link: n.link || undefined,
      createdAt: n.createdAt.toISOString(),
    }));

    const highPriorityCount = items.filter(
      (n) =>
        !n.isRead &&
        (n.type === "renewal_approved" ||
          n.type === "renewal_rejected" ||
          n.type === "expiring_soon")
    ).length;

    return {
      items,
      unreadCount,
      highPriorityCount,
    };
  } catch (error) {
    logger.error("Error in getMemberNotificationsAction:", error);
    return { items: [], unreadCount: 0, highPriorityCount: 0 };
  }
}

/**
 * Marks a specific notification as read.
 */
export async function markMemberNotificationReadAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session || !session.userId) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    await prisma.memberNotification.updateMany({
      where: {
        id: notificationId,
        memberId: session.userId,
      },
      data: { isRead: true },
    });

    return { success: true };
  } catch (error) {
    logger.error("Error in markMemberNotificationReadAction:", error);
    return { success: false, error: "নোটিফিকেশন আপডেট করা যায়নি।" };
  }
}

/**
 * Marks all notifications as read for the currently logged-in member.
 */
export async function markAllMemberNotificationsReadAction(): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  const session = await getSessionUser();
  if (!session || !session.userId) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const res = await prisma.memberNotification.updateMany({
      where: {
        memberId: session.userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return { success: true, count: res.count };
  } catch (error) {
    logger.error("Error in markAllMemberNotificationsReadAction:", error);
    return { success: false, error: "সব নোটিফিকেশন আপডেট করা যায়নি।" };
  }
}

/**
 * Deletes a notification for the member.
 */
export async function deleteMemberNotificationAction(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getSessionUser();
  if (!session || !session.userId) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    await prisma.memberNotification.deleteMany({
      where: {
        id: notificationId,
        memberId: session.userId,
      },
    });

    return { success: true };
  } catch (error) {
    logger.error("Error in deleteMemberNotificationAction:", error);
    return { success: false, error: "নোটিফিকেশন ডিলিট করা যায়নি।" };
  }
}
