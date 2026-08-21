"use client";

import { recordPwaSessionAction } from "@/app/actions/pwaActions";

const DEVICE_ID_KEY = "hc_pwa_device_id";
const SESSION_PINGED_KEY = "hc_pwa_session_pinged_at";
const INSTALLED_FLAG_KEY = "hc_app_installed";

export interface ClientDeviceInfo {
  deviceId: string;
  platform: string;
  browser: string;
  deviceType: "mobile" | "tablet" | "desktop";
  isStandalone: boolean;
}

/**
 * Generates a persistent anonymous device identifier.
 */
export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `dev_${crypto.randomUUID()}`;
    try {
      localStorage.setItem(DEVICE_ID_KEY, id);
    } catch {
      // Storage unavailable or quota exceeded
    }
  }
  return id;
}

/**
 * Detects current device environment details.
 */
export function getClientDeviceInfo(): ClientDeviceInfo {
  if (typeof window === "undefined") {
    return {
      deviceId: "",
      platform: "Other",
      browser: "Other",
      deviceType: "mobile",
      isStandalone: false,
    };
  }

  const userAgent = navigator.userAgent || "";
  const deviceId = getOrCreateDeviceId();

  // 1. Platform Detection
  let platform = "Other";
  if (/android/i.test(userAgent)) {
    platform = "Android";
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    platform = "iOS";
  } else if (/windows/i.test(userAgent)) {
    platform = "Windows";
  } else if (/macintosh|mac os x/i.test(userAgent)) {
    platform = "macOS";
  } else if (/linux/i.test(userAgent)) {
    platform = "Linux";
  }

  // 2. Browser Detection
  let browser = "Other";
  if (/samsungbrowser/i.test(userAgent)) {
    browser = "Samsung Internet";
  } else if (/edg/i.test(userAgent)) {
    browser = "Edge";
  } else if (/opr\//i.test(userAgent) || /opera/i.test(userAgent)) {
    browser = "Opera";
  } else if (/chrome|crios/i.test(userAgent)) {
    browser = "Chrome";
  } else if (/safari/i.test(userAgent) && !/chrome|crios|android/i.test(userAgent)) {
    browser = "Safari";
  } else if (/firefox|fxios/i.test(userAgent)) {
    browser = "Firefox";
  }

  // 3. Device Type Detection
  let deviceType: "mobile" | "tablet" | "desktop" = "desktop";
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(userAgent);
  const isMobile = /mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(userAgent);

  if (isTablet) {
    deviceType = "tablet";
  } else if (isMobile || window.innerWidth < 768) {
    deviceType = "mobile";
  }

  // 4. Standalone Mode Detection
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true ||
    localStorage.getItem(INSTALLED_FLAG_KEY) === "true";

  return {
    deviceId,
    platform,
    browser,
    deviceType,
    isStandalone,
  };
}

/**
 * Sends a lightweight telemetry heartbeat on app/session start.
 * Throttled to once every 4 hours or once per browser session.
 */
export async function sendPwaSessionPing(userId?: string): Promise<void> {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const lastPingStr = sessionStorage.getItem(SESSION_PINGED_KEY);
  if (lastPingStr) {
    const elapsed = now - parseInt(lastPingStr, 10);
    // Throttle to 4 hours in the same session
    if (elapsed < 4 * 60 * 60 * 1000) {
      return;
    }
  }

  const info = getClientDeviceInfo();
  if (!info.deviceId) return;

  try {
    sessionStorage.setItem(SESSION_PINGED_KEY, now.toString());
    await recordPwaSessionAction({
      deviceId: info.deviceId,
      platform: info.platform,
      browser: info.browser,
      deviceType: info.deviceType,
      isStandalone: info.isStandalone,
      userId,
    });
  } catch {
    // Fail silently so as not to interrupt user navigation
  }
}
