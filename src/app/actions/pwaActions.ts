"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { unstable_cache, updateTag } from "next/cache";
import { hasAdminPermission } from "@/lib/permissions";

const PWA_STATS_TAG = "admin-pwa-stats";

export interface PwaTelemetryPayload {
  deviceId: string;
  platform: string;
  browser?: string;
  deviceType?: string;
  isStandalone: boolean;
  userId?: string;
}

export interface PwaPromptPayload {
  deviceId: string;
  outcome: "shown" | "accepted" | "dismissed";
  platform?: string;
  browser?: string;
  deviceType?: string;
}

export interface PwaStatsData {
  totalInstalls: number;
  activeNow24h: number;
  activeWeekly7d: number;
  activeMonthly30d: number;
  inactive30dPlus: number;
  standaloneUsers: number;
  browserUsers: number;
  promptShownTotal: number;
  promptAcceptedTotal: number;
  promptDismissedTotal: number;
  conversionRate: number;
  platformBreakdown: Array<{ platform: string; count: number; percentage: number }>;
  browserBreakdown: Array<{ browser: string; count: number; percentage: number }>;
  deviceTypeBreakdown: Array<{ deviceType: string; count: number; percentage: number }>;
  recentDevices: Array<{
    id: string;
    userId: string | null;
    platform: string;
    browser: string | null;
    deviceType: string | null;
    isStandalone: boolean;
    installedAt: string;
    lastActiveAt: string;
    sessionCount: number;
    status: "active" | "inactive" | "browser";
  }>;
}

const DEFAULT_PWA_STATS: PwaStatsData = {
  totalInstalls: 0,
  activeNow24h: 0,
  activeWeekly7d: 0,
  activeMonthly30d: 0,
  inactive30dPlus: 0,
  standaloneUsers: 0,
  browserUsers: 0,
  promptShownTotal: 0,
  promptAcceptedTotal: 0,
  promptDismissedTotal: 0,
  conversionRate: 0,
  platformBreakdown: [],
  browserBreakdown: [],
  deviceTypeBreakdown: [],
  recentDevices: [],
};

/**
 * Records or updates client PWA session telemetry.
 * Safe public action (uses anonymous deviceId).
 */
export async function recordPwaSessionAction(payload: PwaTelemetryPayload): Promise<{ success: boolean }> {
  try {
    const { deviceId, platform, browser, deviceType, isStandalone, userId } = payload;
    if (!deviceId || typeof deviceId !== "string" || deviceId.trim().length === 0) {
      return { success: false };
    }

    const cleanDeviceId = deviceId.trim().slice(0, 128);
    const cleanPlatform = (platform || "Other").slice(0, 50);
    const cleanBrowser = browser ? browser.slice(0, 50) : null;
    const cleanDeviceType = deviceType ? deviceType.slice(0, 30) : null;
    const cleanUserId = userId ? userId.slice(0, 100) : null;
    const now = new Date();

    await prisma.pwaInstallation.upsert({
      where: { id: cleanDeviceId },
      create: {
        id: cleanDeviceId,
        platform: cleanPlatform,
        browser: cleanBrowser,
        deviceType: cleanDeviceType,
        isStandalone: Boolean(isStandalone),
        userId: cleanUserId,
        installedAt: isStandalone ? now : now,
        lastActiveAt: now,
        sessionCount: 1,
      },
      update: {
        platform: cleanPlatform,
        browser: cleanBrowser ?? undefined,
        deviceType: cleanDeviceType ?? undefined,
        isStandalone: Boolean(isStandalone),
        userId: cleanUserId ?? undefined,
        lastActiveAt: now,
        sessionCount: { increment: 1 },
      },
    });

    updateTag(PWA_STATS_TAG);
    return { success: true };
  } catch (error) {
    logger.error("[pwaActions] recordPwaSessionAction error:", error);
    return { success: false };
  }
}

/**
 * Records explicit PWA installation event (appinstalled or prompt accept).
 */
export async function recordPwaInstallAction(
  payload: Omit<PwaTelemetryPayload, "isStandalone">
): Promise<{ success: boolean }> {
  try {
    const { deviceId, platform, browser, deviceType, userId } = payload;
    if (!deviceId || typeof deviceId !== "string") {
      return { success: false };
    }

    const cleanDeviceId = deviceId.trim().slice(0, 128);
    const cleanPlatform = (platform || "Other").slice(0, 50);
    const cleanBrowser = browser ? browser.slice(0, 50) : null;
    const cleanDeviceType = deviceType ? deviceType.slice(0, 30) : null;
    const cleanUserId = userId ? userId.slice(0, 100) : null;
    const now = new Date();

    await prisma.pwaInstallation.upsert({
      where: { id: cleanDeviceId },
      create: {
        id: cleanDeviceId,
        platform: cleanPlatform,
        browser: cleanBrowser,
        deviceType: cleanDeviceType,
        isStandalone: true,
        userId: cleanUserId,
        installedAt: now,
        lastActiveAt: now,
        promptAccepted: 1,
        sessionCount: 1,
      },
      update: {
        platform: cleanPlatform,
        browser: cleanBrowser ?? undefined,
        deviceType: cleanDeviceType ?? undefined,
        isStandalone: true,
        userId: cleanUserId ?? undefined,
        installedAt: now,
        lastActiveAt: now,
        promptAccepted: { increment: 1 },
      },
    });

    updateTag(PWA_STATS_TAG);
    updateTag("admin-stats");
    return { success: true };
  } catch (error) {
    logger.error("[pwaActions] recordPwaInstallAction error:", error);
    return { success: false };
  }
}

/**
 * Records prompt display, acceptance, or dismissal funnel events.
 */
export async function recordPwaPromptAction(payload: PwaPromptPayload): Promise<{ success: boolean }> {
  try {
    const { deviceId, outcome, platform, browser, deviceType } = payload;
    if (!deviceId) return { success: false };

    const cleanDeviceId = deviceId.trim().slice(0, 128);
    const cleanPlatform = (platform || "Other").slice(0, 50);
    const cleanBrowser = browser ? browser.slice(0, 50) : null;
    const cleanDeviceType = deviceType ? deviceType.slice(0, 30) : null;
    const now = new Date();

    const isAccepted = outcome === "accepted";
    const isDismissed = outcome === "dismissed";
    const isShown = outcome === "shown";

    await prisma.pwaInstallation.upsert({
      where: { id: cleanDeviceId },
      create: {
        id: cleanDeviceId,
        platform: cleanPlatform,
        browser: cleanBrowser,
        deviceType: cleanDeviceType,
        isStandalone: isAccepted,
        promptShown: isShown ? 1 : 0,
        promptAccepted: isAccepted ? 1 : 0,
        promptDismissed: isDismissed ? 1 : 0,
        lastActiveAt: now,
        sessionCount: 1,
      },
      update: {
        promptShown: isShown ? { increment: 1 } : undefined,
        promptAccepted: isAccepted ? { increment: 1 } : undefined,
        promptDismissed: isDismissed ? { increment: 1 } : undefined,
        isStandalone: isAccepted ? true : undefined,
        lastActiveAt: now,
      },
    });

    updateTag(PWA_STATS_TAG);
    updateTag("admin-stats");
    return { success: true };
  } catch (error) {
    logger.error("[pwaActions] recordPwaPromptAction error:", error);
    return { success: false };
  }
}

/**
 * Cached SQL Aggregator for PWA Dashboard
 */
const getCachedPwaStats = unstable_cache(
  async (): Promise<PwaStatsData> => {
    const now = new Date();
    const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const past7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const past30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [countsResult, platformsGroup, browsersGroup, deviceTypesGroup, recentRows] = await Promise.all([
      prisma.$queryRaw<
        Array<{
          total_devices: bigint;
          standalone_devices: bigint;
          browser_devices: bigint;
          active_24h: bigint;
          active_7d: bigint;
          active_30d: bigint;
          inactive_30d_plus: bigint;
          total_prompt_shown: bigint;
          total_prompt_accepted: bigint;
          total_prompt_dismissed: bigint;
        }>
      >`SELECT
          (SELECT COUNT(*) FROM pwa_installations) AS total_devices,
          (SELECT COUNT(*) FROM pwa_installations WHERE is_standalone = TRUE) AS standalone_devices,
          (SELECT COUNT(*) FROM pwa_installations WHERE is_standalone = FALSE) AS browser_devices,
          (SELECT COUNT(*) FROM pwa_installations WHERE is_standalone = TRUE AND last_active_at >= ${past24h}) AS active_24h,
          (SELECT COUNT(*) FROM pwa_installations WHERE is_standalone = TRUE AND last_active_at >= ${past7d}) AS active_7d,
          (SELECT COUNT(*) FROM pwa_installations WHERE is_standalone = TRUE AND last_active_at >= ${past30d}) AS active_30d,
          (SELECT COUNT(*) FROM pwa_installations WHERE is_standalone = TRUE AND last_active_at < ${past30d}) AS inactive_30d_plus,
          (SELECT COALESCE(SUM(prompt_shown), 0) FROM pwa_installations) AS total_prompt_shown,
          (SELECT COALESCE(SUM(prompt_accepted), 0) FROM pwa_installations) AS total_prompt_accepted,
          (SELECT COALESCE(SUM(prompt_dismissed), 0) FROM pwa_installations) AS total_prompt_dismissed`,

      prisma.pwaInstallation.groupBy({
        by: ["platform"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),

      prisma.pwaInstallation.groupBy({
        by: ["browser"],
        where: { browser: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),

      prisma.pwaInstallation.groupBy({
        by: ["deviceType"],
        where: { deviceType: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),

      prisma.pwaInstallation.findMany({
        orderBy: { lastActiveAt: "desc" },
        take: 50,
      }),
    ]);

    const row = countsResult[0];
    const totalDevices = Number(row?.total_devices ?? 0);
    const standaloneDevices = Number(row?.standalone_devices ?? 0);
    const browserDevices = Number(row?.browser_devices ?? 0);
    const activeNow24h = Number(row?.active_24h ?? 0);
    const activeWeekly7d = Number(row?.active_7d ?? 0);
    const activeMonthly30d = Number(row?.active_30d ?? 0);
    const inactive30dPlus = Number(row?.inactive_30d_plus ?? 0);
    const promptShownTotal = Number(row?.total_prompt_shown ?? 0);
    const promptAcceptedTotal = Number(row?.total_prompt_accepted ?? 0);
    const promptDismissedTotal = Number(row?.total_prompt_dismissed ?? 0);

    const totalDecisions = promptAcceptedTotal + promptDismissedTotal;
    const conversionRate = totalDecisions > 0 ? Math.round((promptAcceptedTotal / totalDecisions) * 100) : 0;

    const platformBreakdown = platformsGroup.map((p) => ({
      platform: p.platform || "Other",
      count: p._count.id,
      percentage: totalDevices > 0 ? Math.round((p._count.id / totalDevices) * 100) : 0,
    }));

    const browserBreakdown = browsersGroup.map((b) => ({
      browser: b.browser || "Other",
      count: b._count.id,
      percentage: totalDevices > 0 ? Math.round((b._count.id / totalDevices) * 100) : 0,
    }));

    const deviceTypeBreakdown = deviceTypesGroup.map((d) => ({
      deviceType: d.deviceType || "other",
      count: d._count.id,
      percentage: totalDevices > 0 ? Math.round((d._count.id / totalDevices) * 100) : 0,
    }));

    const recentDevices = recentRows.map((d) => {
      const isPast30Days = d.lastActiveAt.getTime() >= past30d.getTime();
      let status: "active" | "inactive" | "browser" = "browser";
      if (d.isStandalone) {
        status = isPast30Days ? "active" : "inactive";
      }

      return {
        id: d.id,
        userId: d.userId,
        platform: d.platform,
        browser: d.browser,
        deviceType: d.deviceType,
        isStandalone: d.isStandalone,
        installedAt: d.installedAt.toISOString(),
        lastActiveAt: d.lastActiveAt.toISOString(),
        sessionCount: d.sessionCount,
        status,
      };
    });

    return {
      totalInstalls: standaloneDevices,
      activeNow24h,
      activeWeekly7d,
      activeMonthly30d,
      inactive30dPlus,
      standaloneUsers: standaloneDevices,
      browserUsers: browserDevices,
      promptShownTotal,
      promptAcceptedTotal,
      promptDismissedTotal,
      conversionRate,
      platformBreakdown,
      browserBreakdown,
      deviceTypeBreakdown,
      recentDevices,
    };
  },
  ["admin-pwa-stats-cache"],
  { revalidate: 30, tags: [PWA_STATS_TAG] }
);

/**
 * Admin action to fetch PWA analytics.
 */
export async function getPwaStatsAction(): Promise<PwaStatsData> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin" || !hasAdminPermission(session.adminRole || "super_admin", "view_pwa")) {
    return DEFAULT_PWA_STATS;
  }

  try {
    return await getCachedPwaStats();
  } catch (error) {
    logger.error("[pwaActions] getPwaStatsAction error:", error);
    return DEFAULT_PWA_STATS;
  }
}
