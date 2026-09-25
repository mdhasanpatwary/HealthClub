"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { X, Download, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getClientDeviceInfo } from "@/lib/pwaTelemetry";
import { recordPwaPromptAction, recordPwaInstallAction } from "@/app/actions/pwaActions";
import { trackEvent } from "@/lib/analytics";
import { logger } from "@/lib/logger";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSAL_KEY = "hc_app_prompt_dismissed_at";
const INSTALLED_KEY = "hc_app_installed";
const DISMISS_DAYS = 14;
const DISMISS_MS = DISMISS_DAYS * 24 * 60 * 60 * 1000;

function isPromptDismissed(): boolean {
  if (typeof window === "undefined") return true;

  try {
    // 1. Standalone / installed check
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true ||
      localStorage.getItem(INSTALLED_KEY) === "true";

    if (isStandalone) {
      return true;
    }

    // 2. Session check (ensures banner never reappears in the current session after dismissal)
    if (sessionStorage.getItem(DISMISSAL_KEY) === "true") {
      return true;
    }

    // 3. Persistent dismissal check (14 days)
    const dismissedAt = localStorage.getItem(DISMISSAL_KEY);
    if (dismissedAt) {
      const parsed = parseInt(dismissedAt, 10);
      if (!isNaN(parsed)) {
        const elapsedMs = Date.now() - parsed;
        if (elapsedMs < DISMISS_MS) {
          return true;
        }
      }
    }
  } catch {
    // In case storage access is restricted, default to not annoying the user
    return false;
  }

  return false;
}

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const hasLoggedShown = useRef(false);
  const isDismissedRef = useRef(false);

  useEffect(() => {
    // 1. Check if user already dismissed or installed the app
    if (isPromptDismissed()) {
      isDismissedRef.current = true;
      return;
    }

    // 2. Mobile screen check
    const isMobile = typeof window !== "undefined" && window.matchMedia?.("(max-width: 767px)").matches;
    if (isMobile) {
      requestAnimationFrame(() => {
        if (isDismissedRef.current || isPromptDismissed()) return;
        setIsVisible(true);
        if (!hasLoggedShown.current) {
          hasLoggedShown.current = true;
          const info = getClientDeviceInfo();
          if (info.deviceId) {
            recordPwaPromptAction({
              deviceId: info.deviceId,
              outcome: "shown",
              platform: info.platform,
              browser: info.browser,
              deviceType: info.deviceType,
            }).catch(() => {});
          }
        }
      });
    }

    // Listener for PWA installation prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Do NOT show banner if user already dismissed or installed the app
      if (isDismissedRef.current || isPromptDismissed()) {
        return;
      }

      if (isMobile) {
        setIsVisible(true);
        if (!hasLoggedShown.current) {
          hasLoggedShown.current = true;
          const info = getClientDeviceInfo();
          if (info.deviceId) {
            recordPwaPromptAction({
              deviceId: info.deviceId,
              outcome: "shown",
              platform: info.platform,
              browser: info.browser,
              deviceType: info.deviceType,
            }).catch(() => {});
          }
        }
      }
    };

    // Listener for when app is installed
    const handleAppInstalled = () => {
      isDismissedRef.current = true;
      try {
        localStorage.setItem(INSTALLED_KEY, "true");
      } catch {}
      setIsVisible(false);
      setDeferredPrompt(null);
      setIsInstalling(false);
      const info = getClientDeviceInfo();
      if (info.deviceId) {
        recordPwaInstallAction({
          deviceId: info.deviceId,
          platform: info.platform,
          browser: info.browser,
          deviceType: info.deviceType,
        }).catch(() => {});
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleDismiss = () => {
    isDismissedRef.current = true;
    try {
      sessionStorage.setItem(DISMISSAL_KEY, "true");
      localStorage.setItem(DISMISSAL_KEY, Date.now().toString());
    } catch {}
    setIsVisible(false);
    setDeferredPrompt(null);

    trackEvent("pwa_action", { action: "install_dismissed" });

    const info = getClientDeviceInfo();
    if (info.deviceId) {
      recordPwaPromptAction({
        deviceId: info.deviceId,
        outcome: "dismissed",
        platform: info.platform,
        browser: info.browser,
        deviceType: info.deviceType,
      }).catch(() => {});
    }
  };

  const handleInstallClick = async () => {
    if (isInstalling) return;
    setIsInstalling(true);

    const info = getClientDeviceInfo();

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          isDismissedRef.current = true;
          try {
            localStorage.setItem(INSTALLED_KEY, "true");
          } catch {}
          setIsVisible(false);
          trackEvent("pwa_action", { action: "install_accepted" });
          if (info.deviceId) {
            recordPwaInstallAction({
              deviceId: info.deviceId,
              platform: info.platform,
              browser: info.browser,
              deviceType: info.deviceType,
            }).catch(() => {});
          }
        } else {
          // If user dismissed the prompt dialog
          isDismissedRef.current = true;
          try {
            sessionStorage.setItem(DISMISSAL_KEY, "true");
            localStorage.setItem(DISMISSAL_KEY, Date.now().toString());
          } catch {}
          setIsVisible(false);
          trackEvent("pwa_action", { action: "install_dismissed" });
          if (info.deviceId) {
            recordPwaPromptAction({
              deviceId: info.deviceId,
              outcome: "dismissed",
              platform: info.platform,
              browser: info.browser,
              deviceType: info.deviceType,
            }).catch(() => {});
          }
        }
      } catch (err) {
        logger.error("PWA install error:", err);
        setIsVisible(false);
      } finally {
        setDeferredPrompt(null);
        setIsInstalling(false);
      }
    } else {
      // Check if iOS Safari
      const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
      if (isIos) {
        setShowIosTip(true);
        setIsInstalling(false);
      } else {
        // Fallback for browsers that don't support beforeinstallprompt directly
        toast.info(
          "Safari ব্রাউজারের Share (শেয়ার) বাটনে ট্যাপ করে 'Add to Home Screen' চাপুন"
        );
        isDismissedRef.current = true;
        try {
          sessionStorage.setItem(DISMISSAL_KEY, "true");
          localStorage.setItem(DISMISSAL_KEY, Date.now().toString());
        } catch {}
        setTimeout(() => {
          setIsVisible(false);
          setIsInstalling(false);
        }, 1500);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="App Install Banner"
      className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-50 p-3 sm:p-4 min-[992px]:hidden animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-slate-900/95 dark:bg-slate-900/95 text-white border border-slate-700/60 rounded-2xl p-4 shadow-2xl backdrop-blur-xl relative flex flex-col gap-3">
        {/* Top Close Button */}
        <button
          onClick={handleDismiss}
          disabled={isInstalling}
          aria-label="Close installation prompt"
          className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors z-10 disabled:opacity-50"
        >
          <X className="size-4" />
        </button>

        {/* iOS Instruction Tip Popover */}
        {showIosTip && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/40 rounded-xl text-xs text-emerald-100 flex items-start gap-2 animate-in fade-in zoom-in-95 duration-200">
            <Share2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
            <span className="leading-relaxed">
              Safari ব্রাউজারের Share (শেয়ার) বাটনে ট্যাপ করে &apos;Add to Home Screen&apos; চাপুন
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 pr-6">
          {/* App Icon (Same as Website Header & Card Logo) */}
          <div className="relative size-12 shrink-0 rounded-xl bg-white border border-emerald-500/40 p-1 flex items-center justify-center shadow-md overflow-hidden">
            <Image
              src="/images/member-card-logo.webp"
              alt="Health Club Logo"
              width={40}
              height={40}
              sizes="40px"
              className="size-10 object-contain"
            />
          </div>

          {/* App Info - Full text without clipping */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white tracking-wide leading-tight">
              হেলথ ক্লাব মোবাইল অ্যাপ
            </h4>
            <p className="text-xs text-slate-300 leading-snug mt-1 break-words">
              সহজে ডিসকাউন্ট পেতে হেলথ ক্লাব মোবাইল অ্যাপ ইনস্টল করুন
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-1">
          <Button
            onClick={handleInstallClick}
            disabled={isInstalling}
            size="sm"
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 h-10 rounded-xl text-xs shadow-md border border-emerald-500/30 gap-2 justify-center transition-all disabled:opacity-75"
          >
            {isInstalling ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            <span>
              {isInstalling ? "প্রসেসিং..." : "ইনস্টল করুন"}
            </span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
