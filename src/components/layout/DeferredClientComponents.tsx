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
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (
        window as Window & {
          requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
          cancelIdleCallback: (id: number) => void;
        }
      ).requestIdleCallback(() => setCanLoad(true), { timeout: 3000 });

      return () => {
        if ("cancelIdleCallback" in window) {
          (
            window as Window & {
              cancelIdleCallback: (id: number) => void;
            }
          ).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(() => setCanLoad(true), 2500);
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
