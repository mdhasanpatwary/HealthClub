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
    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      cleanup();
      setCanLoad(true);
    };

    const cleanup = () => {
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("touchstart", trigger);
      window.removeEventListener("click", trigger);
      window.removeEventListener("keydown", trigger);
    };

    window.addEventListener("scroll", trigger, { passive: true, once: true });
    window.addEventListener("touchstart", trigger, { passive: true, once: true });
    window.addEventListener("click", trigger, { passive: true, once: true });
    window.addEventListener("keydown", trigger, { passive: true, once: true });

    const timer = setTimeout(trigger, 7000);

    return () => {
      cleanup();
      clearTimeout(timer);
    };
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
