"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const InstallAppBanner = dynamic(() => import("@/components/layout/InstallAppBanner"), {
  ssr: false,
});
const PushNotificationPrompt = dynamic(
  () => import("@/components/pwa/PushNotificationPrompt"),
  { ssr: false }
);
const PwaTracker = dynamic(() => import("@/components/pwa/PwaTracker"), {
  ssr: false,
});
const WebVitalsTracker = dynamic(
  () => import("@/components/analytics/WebVitalsTracker"),
  { ssr: false }
);
const Toaster = dynamic(() => import("sonner").then((m) => m.Toaster), {
  ssr: false,
});
const Analytics = dynamic(
  () => import("@vercel/analytics/react").then((m) => m.Analytics),
  { ssr: false }
);

/**
 * Defers PWA prompts, telemetry trackers, web vitals tracking, toaster, and analytics until
 * the main thread is completely idle after initial page load and user interactivity.
 */
export default function DeferredClientComponents() {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    // Schedule background components when the main thread is completely idle,
    // avoiding freezing the main thread on the user's first touch/click (preserves INP).
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleCallback = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
        () => setCanLoad(true),
        { timeout: 3500 }
      );
      return () => {
        if ("cancelIdleCallback" in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleCallback);
        }
      };
    } else {
      const timer = setTimeout(() => setCanLoad(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!canLoad) return null;

  return (
    <>
      <PwaTracker />
      <InstallAppBanner />
      <PushNotificationPrompt />
      <WebVitalsTracker />
      <Toaster richColors position="top-right" />
      <Analytics />
    </>
  );
}
