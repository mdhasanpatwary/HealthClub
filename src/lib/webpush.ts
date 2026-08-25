import webpush from "web-push";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

export interface WebPushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  badgeCount?: number;
  data?: Record<string, unknown>;
  requireInteraction?: boolean;
}

const DEFAULT_VAPID_SUBJECT =
  process.env.VAPID_SUBJECT || "mailto:healthclubfeni@gmail.com";

let cachedVapidKeys: VapidKeys | null = null;
let isWebPushConfigured = false;

/**
 * Retrieves VAPID keys from environment variables or persistent system settings.
 * If neither exists, generates new standard VAPID keys and persists them in DB.
 */
export async function getOrGenerateVapidKeys(): Promise<VapidKeys> {
  // 1. Check in-memory cache
  if (cachedVapidKeys) {
    return cachedVapidKeys;
  }

  // 2. Check environment variables
  const envPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const envPrivate = process.env.VAPID_PRIVATE_KEY;

  if (envPublic && envPrivate) {
    cachedVapidKeys = {
      publicKey: envPublic.trim(),
      privateKey: envPrivate.trim(),
    };
    return cachedVapidKeys;
  }

  // 3. Check persistent system_settings in DB
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "vapid_keys" },
    });

    if (setting?.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (parsed.publicKey && parsed.privateKey) {
          cachedVapidKeys = {
            publicKey: parsed.publicKey,
            privateKey: parsed.privateKey,
          };
          return cachedVapidKeys;
        }
      } catch {
        // invalid json, regenerate
      }
    }

    // 4. Generate new VAPID keys and persist
    const generated = webpush.generateVAPIDKeys();
    const newKeys: VapidKeys = {
      publicKey: generated.publicKey,
      privateKey: generated.privateKey,
    };

    await prisma.systemSetting.upsert({
      where: { key: "vapid_keys" },
      create: {
        key: "vapid_keys",
        value: JSON.stringify(newKeys),
      },
      update: {
        value: JSON.stringify(newKeys),
      },
    });

    cachedVapidKeys = newKeys;
    return newKeys;
  } catch (error) {
    logger.error("[webpush] Error retrieving/generating VAPID keys:", error);
    // Fallback in-memory generated keys
    const fallback = webpush.generateVAPIDKeys();
    return {
      publicKey: fallback.publicKey,
      privateKey: fallback.privateKey,
    };
  }
}

/**
 * Ensures web-push is initialized with valid VAPID details.
 */
export async function configureWebPush(): Promise<VapidKeys> {
  const keys = await getOrGenerateVapidKeys();
  if (!isWebPushConfigured) {
    webpush.setVapidDetails(
      DEFAULT_VAPID_SUBJECT,
      keys.publicKey,
      keys.privateKey
    );
    isWebPushConfigured = true;
  }
  return keys;
}

/**
 * Dispatches a push notification to a single subscriber.
 * Automatically prunes expired endpoints (HTTP 404/410).
 */
export async function sendWebPushNotification(
  subscription: {
    endpoint: string;
    p256dh: string;
    auth: string;
  },
  payload: WebPushPayload
): Promise<{
  success: boolean;
  statusCode?: number;
  error?: string;
  expired?: boolean;
}> {
  try {
    await configureWebPush();

    const pushSubscription: webpush.PushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    const pushPayloadString = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || "/icons/icon-192.png",
      badge: payload.badge || "/icons/icon-192.png",
      url: payload.url || "/",
      tag: payload.tag || "general-notice",
      requireInteraction: payload.requireInteraction ?? false,
      data: {
        url: payload.url || "/",
        ...payload.data,
      },
    });

    const response = await webpush.sendNotification(
      pushSubscription,
      pushPayloadString,
      {
        TTL: 86400, // 24 hours
        urgency: "high",
      }
    );

    return {
      success: true,
      statusCode: response.statusCode,
    };
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as any;
    const statusCode = error?.statusCode;

    // Prune unsubscribed or expired endpoints (404 Not Found, 410 Gone)
    if (statusCode === 404 || statusCode === 410) {
      try {
        await prisma.pushSubscription.deleteMany({
          where: { endpoint: subscription.endpoint },
        });
        logger.info(
          `[webpush] Pruned dead push subscription (status ${statusCode}): ${subscription.endpoint.slice(0, 30)}...`
        );
      } catch (pruneErr) {
        logger.error("[webpush] Error pruning dead subscription:", pruneErr);
      }

      return {
        success: false,
        statusCode,
        error: "Subscription has expired or been revoked.",
        expired: true,
      };
    }

    logger.error("[webpush] sendWebPushNotification failed:", error?.message || error);
    return {
      success: false,
      statusCode,
      error: error?.message || "Failed to deliver push notification",
    };
  }
}
