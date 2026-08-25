"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Bell, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { getClientDeviceInfo } from "@/lib/pwaTelemetry";
import {
  getVapidPublicKeyAction,
  savePushSubscriptionAction,
} from "@/app/actions/pushNotificationActions";
import { trackEvent } from "@/lib/analytics";

const PROMPT_DISMISS_KEY = "hc_push_prompt_dismissed_at";
const REPROMPT_DAYS = 7;

/**
 * Converts a base64 string to a Uint8Array for PushManager subscription.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationPrompt() {
  const { locale } = useLanguage();
  const isBn = locale === "bn";

  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check support and existing subscription status on mount
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      return;
    }

    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        setIsSupported(true);
        setPermission(Notification.permission);

        if (sub) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
          // Check dismissal timestamp
          const dismissedAt = localStorage.getItem(PROMPT_DISMISS_KEY);
          if (dismissedAt) {
            const elapsedDays =
              (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
            if (elapsedDays < REPROMPT_DAYS) {
              return;
            }
          }
          // Delay display slightly for smooth page load
          if (Notification.permission === "default") {
            setIsVisible(true);
          }
        }
      })
      .catch(() => {
        setIsSubscribed(false);
      });
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(PROMPT_DISMISS_KEY, Date.now().toString());
    } catch {}
    setIsVisible(false);
  };

  const handleSubscribe = useCallback(async () => {
    if (!isSupported) {
      toast.error(
        isBn
          ? "আপনার ব্রাউজারে পুশ নোটিফিকেশন সমর্থন করে না।"
          : "Web Push is not supported on this browser."
      );
      return;
    }

    setLoading(true);
    try {
      // 1. Request permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        if (result === "denied") {
          toast.error(
            isBn
              ? "বিজ্ঞপ্তির অনুমতি প্রত্যাখ্যান করা হয়েছে। ব্রাউজার সেটিংসে গিয়ে অনুমতি দিন।"
              : "Notification permission was blocked in your browser settings."
          );
        }
        setIsVisible(false);
        return;
      }

      // 2. Fetch VAPID public key
      const keyRes = await getVapidPublicKeyAction();
      if (!keyRes.success || !keyRes.publicKey) {
        toast.error(
          keyRes.error ||
            (isBn
              ? "পুশ সার্ভারের সাথে যোগাযোগ ব্যর্থ হয়েছে।"
              : "Failed to connect to push server.")
        );
        return;
      }

      // 3. Register with PushManager
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const applicationServerKey = urlBase64ToUint8Array(keyRes.publicKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as BufferSource,
        });
      }

      // 4. Save to Database
      const json = subscription.toJSON();
      if (json.endpoint && json.keys?.p256dh && json.keys?.auth) {
        const info = getClientDeviceInfo();
        const saveRes = await savePushSubscriptionAction({
          endpoint: json.endpoint,
          p256dh: json.keys.p256dh,
          auth: json.keys.auth,
          platform: info.platform,
          userAgent: navigator.userAgent,
        });

        if (saveRes.success) {
          setIsSubscribed(true);
          setIsVisible(false);
          trackEvent("pwa_action", {
            action: "push_subscribed",
          });
          toast.success(
            isBn
              ? "🔔 পুশ নোটিফিকেশন সফলভাবে চালু করা হয়েছে!"
              : "🔔 Push notifications enabled successfully!"
          );
        } else {
          toast.error(saveRes.error || "সাবস্ক্রিপশন সেভ করা সম্ভব হয়নি।");
        }
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to enable notifications.";
      toast.error(
        isBn ? "নোটিফিকেশন সক্রিয় করতে সমস্যা হয়েছে।" : errorMsg
      );
    } finally {
      setLoading(false);
    }
  }, [isSupported, isBn]);

  if (!isSupported || !isVisible || isSubscribed || permission === "denied") {
    return null;
  }

  return (
    <aside
      aria-label="Web Push Notification Prompt"
      className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 max-w-sm w-[calc(100vw-1.5rem)] sm:w-96 animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="bg-card/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 sm:p-5 shadow-2xl relative flex flex-col gap-3.5 text-foreground ring-1 ring-primary/20">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close notification prompt"
          className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon & Details */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
            <Bell className="size-5.5 animate-bounce text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold tracking-tight text-foreground leading-snug">
              {isBn
                ? "জরুরি স্বাস্থ্য ও অফার অ্যালার্ট পান"
                : "Get Instant Health & Renewal Alerts"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              {isBn
                ? "রক্তদান ডাক, মেম্বারশিপ নবায়ন তাগাদা ও স্বাস্থ্য ক্যাম্পের তাৎক্ষণিক নোটিফিকেশন পেতে ব্রাউজার পুশ চালু করুন।"
                : "Receive browser notifications for blood drives, card renewal reminders, and hospital discount alerts."}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            disabled={loading}
            className="h-9 px-3 text-xs font-semibold rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {isBn ? "পরে মনে করান" : "Later"}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSubscribe}
            disabled={loading}
            className="h-9 px-4 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{isBn ? "সংযোগ হচ্ছে..." : "Connecting..."}</span>
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>{isBn ? "নোটিফিকেশন চালু করুন" : "Enable Alerts"}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default PushNotificationPrompt;
