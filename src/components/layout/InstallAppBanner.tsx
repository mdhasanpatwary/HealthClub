"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Download, Share2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSAL_KEY = "hc_app_prompt_dismissed_at";
const INSTALLED_KEY = "hc_app_installed";
const DISMISS_HOURS = 72;

export default function InstallAppBanner() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);

  useEffect(() => {
    // 1. Standalone / installed check
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true ||
      localStorage.getItem(INSTALLED_KEY) === "true";

    if (isStandalone) {
      return;
    }

    // 2. 72 Hours dismissal check
    const dismissedAt = localStorage.getItem(DISMISSAL_KEY);
    if (dismissedAt) {
      const elapsedMs = Date.now() - parseInt(dismissedAt, 10);
      const elapsedHours = elapsedMs / (1000 * 60 * 60);
      if (elapsedHours < DISMISS_HOURS) {
        return;
      }
    }

    // 3. Mobile screen check
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }

    // Listener for PWA installation prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (isMobile) {
        setIsVisible(true);
      }
    };

    // Listener for when app is installed
    const handleAppInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, "true");
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSAL_KEY, Date.now().toString());
    setIsVisible(false);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        localStorage.setItem(INSTALLED_KEY, "true");
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Check if iOS Safari
      const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
      if (isIos) {
        setShowIosTip(!showIosTip);
      } else {
        // Fallback for browsers that don't support beforeinstallprompt directly
        toast.info(
          t("pwa.iosInstructions") ||
            "আপনার ব্রাউজার মেনু থেকে 'Add to Home Screen' বা 'Install' বেছে নিন।"
        );
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
          aria-label="Close installation prompt"
          className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors z-10"
        >
          <X className="size-4" />
        </button>

        {/* iOS Instruction Tip Popover */}
        {showIosTip && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/40 rounded-xl text-xs text-emerald-100 flex items-start gap-2 animate-in fade-in zoom-in-95 duration-200">
            <Share2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
            <span className="leading-relaxed">
              {t("pwa.iosInstructions")}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 pr-6">
          {/* App Icon (Same as Website Header & Card Logo) */}
          <div className="relative size-12 shrink-0 rounded-xl bg-white border border-emerald-500/40 p-1 flex items-center justify-center shadow-md overflow-hidden">
            <Image
              src="/images/member-card-logo.png"
              alt="Health Club Logo"
              width={44}
              height={44}
              style={{ height: "auto" }}
              className="object-contain size-full"
            />
          </div>

          {/* App Info - Full text without clipping */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white tracking-wide leading-tight">
              {t("pwa.installTitle")}
            </h4>
            <p className="text-xs text-slate-300 leading-snug mt-1 break-words">
              {t("pwa.installDesc")}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-1">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 h-10 rounded-xl text-xs shadow-md border border-emerald-400/30 gap-2 justify-center"
          >
            <Download className="size-4" />
            <span>{t("pwa.installBtn")}</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
