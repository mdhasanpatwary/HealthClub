"use client";

import { useEffect } from "react";
import { getClientDeviceInfo, sendPwaSessionPing } from "@/lib/pwaTelemetry";
import { recordPwaInstallAction } from "@/app/actions/pwaActions";
import { dbStore } from "@/services/dbStore";

const INSTALLED_KEY = "hc_app_installed";

export default function PwaTracker() {
  useEffect(() => {
    // 1. Initial Session Ping
    const currentUser = dbStore.getCurrentUser();
    const currentPartner = dbStore.getCurrentPartner();
    const activeUserId = currentUser?.id || currentPartner?.id || undefined;

    sendPwaSessionPing(activeUserId);

    // 2. Global listener for native PWA installation event
    const handleAppInstalled = () => {
      try {
        localStorage.setItem(INSTALLED_KEY, "true");
      } catch {
        // storage disabled
      }

      const info = getClientDeviceInfo();
      if (info.deviceId) {
        recordPwaInstallAction({
          deviceId: info.deviceId,
          platform: info.platform,
          browser: info.browser,
          deviceType: info.deviceType,
          userId: activeUserId,
        }).catch((err) => {
          console.debug("[PwaTracker] install record error:", err);
        });
      }
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return null;
}
