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
    // In development mode on localhost, unregister any leftover service workers from production builds
    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
    }

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
