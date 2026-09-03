"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import {
  getOrGenerateVapidKeys,
  sendWebPushNotification,
  WebPushPayload,
} from "@/lib/webpush";
import { hasAdminPermission } from "@/lib/permissions";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const saveSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string().min(1),
  auth: z.string().min(1),
  userId: z.string().optional().nullable(),
  userRole: z.enum(["member", "partner", "admin", "guest"]).optional().nullable(),
  platform: z.string().max(50).optional().nullable(),
  userAgent: z.string().max(300).optional().nullable(),
});

const broadcastPushSchema = z.object({
  title: z.string().min(1, "শিরোনাম দিন").max(120),
  body: z.string().min(1, "বার্তার বিবরণ দিন").max(500),
  url: z.string().max(300).optional().default("/"),
  tag: z.string().max(50).optional().default("general"),
  targetAudience: z.enum(["all", "members", "partners", "emergency", "advisory"]),
  requireInteraction: z.boolean().optional().default(false),
  testEndpoint: z.string().url().optional(),
});

export type BroadcastPushInput = z.infer<typeof broadcastPushSchema>;

export interface PushSubscriberStats {
  totalSubscribers: number;
  memberSubscribers: number;
  partnerSubscribers: number;
  guestSubscribers: number;
  platformBreakdown: Array<{ platform: string; count: number }>;
}

// ---------------------------------------------------------------------------
// Client Subscription Management Actions
// ---------------------------------------------------------------------------

/**
 * Returns the public VAPID key so browser client can subscribe.
 */
export async function getVapidPublicKeyAction(): Promise<{
  success: boolean;
  publicKey?: string;
  error?: string;
}> {
  try {
    const keys = await getOrGenerateVapidKeys();
    return {
      success: true,
      publicKey: keys.publicKey,
    };
  } catch (error) {
    logger.error("[pushActions] getVapidPublicKeyAction failed:", error);
    return {
      success: false,
      error: "পুশ নোটিফিকেশন কনফিগারেশন লোড করা সম্ভব হয়নি।",
    };
  }
}

/**
 * Saves or updates a browser PushSubscription in PostgreSQL.
 */
export async function savePushSubscriptionAction(
  rawInput: z.infer<typeof saveSubscriptionSchema>
): Promise<{ success: boolean; error?: string }> {
  try {
    const parsed = saveSubscriptionSchema.safeParse(rawInput);
    if (!parsed.success) {
      return { success: false, error: "ভুল সাবস্ক্রিপশন তথ্য।" };
    }

    const { endpoint, p256dh, auth, userId, userRole, platform, userAgent } = parsed.data;

    // Optional: match user role from session if not explicitly provided
    let effectiveUserId = userId || null;
    let effectiveUserRole = userRole || "guest";

    if (!effectiveUserId) {
      const session = await getSessionUser();
      if (session?.userId) {
        effectiveUserId = session.userId;
        effectiveUserRole = session.role === "admin" ? "admin" : "member";
      }
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: {
        endpoint,
        p256dh,
        auth,
        userId: effectiveUserId,
        userRole: effectiveUserRole,
        platform: platform || "Unknown",
        userAgent: userAgent ? userAgent.slice(0, 300) : null,
      },
      update: {
        p256dh,
        auth,
        userId: effectiveUserId ?? undefined,
        userRole: effectiveUserRole ?? undefined,
        platform: platform || undefined,
        userAgent: userAgent ? userAgent.slice(0, 300) : undefined,
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    logger.error("[pushActions] savePushSubscriptionAction failed:", error);
    return { success: false, error: "সাবস্ক্রিপশন সংরক্ষণ করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Removes a push subscription on user opt-out.
 */
export async function removePushSubscriptionAction(
  endpoint: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!endpoint || typeof endpoint !== "string") {
      return { success: false, error: "ভুল এন্ডপয়েন্ট।" };
    }

    await prisma.pushSubscription.deleteMany({
      where: { endpoint },
    });

    return { success: true };
  } catch (error) {
    logger.error("[pushActions] removePushSubscriptionAction failed:", error);
    return { success: false, error: "সাবস্ক্রিপশন মুছতে সমস্যা হয়েছে।" };
  }
}

/**
 * Checks if an endpoint is currently registered in the database.
 */
export async function checkPushSubscriptionStatusAction(
  endpoint: string
): Promise<{ isSubscribed: boolean }> {
  try {
    if (!endpoint) return { isSubscribed: false };
    const count = await prisma.pushSubscription.count({
      where: { endpoint },
    });
    return { isSubscribed: count > 0 };
  } catch (error) {
    logger.error("[pushActions] checkPushSubscriptionStatusAction error:", error);
    return { isSubscribed: false };
  }
}

// ---------------------------------------------------------------------------
// Admin Push Broadcast Actions
// ---------------------------------------------------------------------------

/**
 * Admin action: Retrieves subscriber counts and platform statistics.
 */
export async function getPushSubscriberStatsAction(): Promise<PushSubscriberStats> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin" || !hasAdminPermission(session.adminRole || "super_admin", "send_broadcast")) {
    return {
      totalSubscribers: 0,
      memberSubscribers: 0,
      partnerSubscribers: 0,
      guestSubscribers: 0,
      platformBreakdown: [],
    };
  }

  try {
    const [total, memberCount, partnerCount, guestCount, platformGroup] =
      await Promise.all([
        prisma.pushSubscription.count(),
        prisma.pushSubscription.count({ where: { userRole: "member" } }),
        prisma.pushSubscription.count({ where: { userRole: "partner" } }),
        prisma.pushSubscription.count({
          where: { OR: [{ userRole: "guest" }, { userRole: null }] },
        }),
        prisma.pushSubscription.groupBy({
          by: ["platform"],
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
        }),
      ]);

    const platformBreakdown = platformGroup.map((item) => ({
      platform: item.platform || "Other",
      count: item._count.id,
    }));

    return {
      totalSubscribers: total,
      memberSubscribers: memberCount,
      partnerSubscribers: partnerCount,
      guestSubscribers: guestCount,
      platformBreakdown,
    };
  } catch (error) {
    logger.error("[pushActions] getPushSubscriberStatsAction error:", error);
    return {
      totalSubscribers: 0,
      memberSubscribers: 0,
      partnerSubscribers: 0,
      guestSubscribers: 0,
      platformBreakdown: [],
    };
  }
}

/**
 * Admin action: Broadcasts Web Push notifications to targeted audiences.
 */
export async function sendPushBroadcastAction(
  rawInput: BroadcastPushInput
): Promise<{
  success: boolean;
  message: string;
  stats?: {
    total: number;
    sent: number;
    failed: number;
    expired: number;
  };
}> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin" || !hasAdminPermission(session.adminRole || "super_admin", "send_broadcast")) {
    return {
      success: false,
      message: "অননুমোদিত অ্যাক্সেস। পুশ নোটিফিকেশন পাঠানোর অনুমতি নেই।",
    };
  }

  const parsed = broadcastPushSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "ইনপুট ত্রুটি।",
    };
  }

  const {
    title,
    body,
    url,
    tag,
    targetAudience,
    requireInteraction,
    testEndpoint,
  } = parsed.data;

  try {
    // 1. Single test delivery
    if (testEndpoint) {
      const sub = await prisma.pushSubscription.findUnique({
        where: { endpoint: testEndpoint },
      });

      if (!sub) {
        return {
          success: false,
          message: "নির্দিষ্ট টেস্ট ডিভাইসের সাবস্ক্রিপশন পাওয়া যায়নি।",
        };
      }

      const res = await sendWebPushNotification(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        {
          title: `[টেস্ট] ${title}`,
          body,
          url: url || "/",
          tag: "test-push",
          requireInteraction: true,
        }
      );

      if (res.success) {
        return {
          success: true,
          message: "টেস্ট পুশ নোটিফিকেশন সফলভাবে আপনার ডিভাইসে পাঠানো হয়েছে!",
          stats: { total: 1, sent: 1, failed: 0, expired: 0 },
        };
      } else {
        if (res.expired) {
          try {
            await prisma.pushSubscription.deleteMany({
              where: { endpoint: testEndpoint },
            });
          } catch (purgeError) {
            logger.error("[pushActions] Failed to delete expired test endpoint:", purgeError);
          }
        }
        return {
          success: false,
          message: `টেস্ট পুশ পাঠানো যায়নি: ${res.error || "অজানা ত্রুটি"}`,
          stats: { total: 1, sent: 0, failed: 1, expired: res.expired ? 1 : 0 },
        };
      }
    }

    // 2. Audience filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (targetAudience === "members") {
      where.userRole = "member";
    } else if (targetAudience === "partners") {
      where.userRole = "partner";
    }
    // "emergency", "advisory", and "all" target all active subscriptions

    const subscribers = await prisma.pushSubscription.findMany({
      where,
      select: { endpoint: true, p256dh: true, auth: true },
    });

    if (subscribers.length === 0) {
      return {
        success: false,
        message: "নির্বাচিত ক্যাটাগরিতে কোনো পুশ নোটিফিকেশন গ্রাহক পাওয়া যায়নি।",
        stats: { total: 0, sent: 0, failed: 0, expired: 0 },
      };
    }

    const payload: WebPushPayload = {
      title,
      body,
      url: url || "/",
      tag: tag || `push_${Date.now()}`,
      requireInteraction: Boolean(requireInteraction),
    };

    let sent = 0;
    let failed = 0;
    let expired = 0;
    const expiredEndpoints: string[] = [];

    // Send in chunks of 20 to avoid overwhelming the serverless thread
    const CHUNK_SIZE = 20;
    for (let i = 0; i < subscribers.length; i += CHUNK_SIZE) {
      const chunk = subscribers.slice(i, i + CHUNK_SIZE);
      const results = await Promise.all(
        chunk.map((sub) => sendWebPushNotification(sub, payload))
      );

      for (let j = 0; j < results.length; j++) {
        const res = results[j];
        if (res.success) {
          sent++;
        } else {
          failed++;
          if (res.expired) {
            expired++;
            expiredEndpoints.push(chunk[j].endpoint);
          }
        }
      }
    }

    // Automatically purge expired or defunct subscriptions in batch
    if (expiredEndpoints.length > 0) {
      try {
        await prisma.pushSubscription.deleteMany({
          where: {
            endpoint: { in: expiredEndpoints },
          },
        });
        logger.info(
          `[pushActions] Purged ${expiredEndpoints.length} expired push subscriptions from database.`
        );
      } catch (purgeError) {
        logger.error(
          "[pushActions] Failed to batch purge expired push subscriptions:",
          purgeError
        );
      }
    }

    return {
      success: true,
      message: `পুশ নোটিফিকেশন ব্রডকাস্ট সম্পন্ন! (${sent} টি সফল, ${failed} টি ব্যর্থ/মেয়াদোত্তীর্ণ)`,
      stats: {
        total: subscribers.length,
        sent,
        failed,
        expired,
      },
    };
  } catch (error) {
    logger.error("[pushActions] sendPushBroadcastAction failed:", error);
    return {
      success: false,
      message: "পুশ নোটিফিকেশন ব্রডকাস্ট করার সময় একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।",
    };
  }
}

/**
 * Admin action: Send a test push notification to a device endpoint.
 */
export async function sendTestPushNotificationAction(
  endpoint: string
): Promise<{ success: boolean; message: string }> {
  return sendPushBroadcastAction({
    title: "টেস্ট নোটিফিকেশন - হেলথ ক্লাব",
    body: "এটি একটি লাইভ ওয়েব পুশ নোটিফিকেশন টেস্ট। আপনার ব্রাউজার নোটিফিকেশন সক্রিয় আছে!",
    url: "/admin/notifications",
    tag: "admin-test-push",
    targetAudience: "all",
    requireInteraction: true,
    testEndpoint: endpoint,
  });
}
