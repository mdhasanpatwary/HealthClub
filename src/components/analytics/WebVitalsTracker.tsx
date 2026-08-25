"use client";

import { useReportWebVitals } from "next/web-vitals";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { logger } from "@/lib/logger";

export default function WebVitalsTracker() {
  useReportWebVitals((metric) => {
    // 1. Send Core Web Vitals to GA4 if active
    if (typeof window !== "undefined" && typeof window.gtag === "function" && GA_MEASUREMENT_ID) {
      window.gtag("event", metric.name, {
        value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        metric_rating: metric.rating,
        non_interaction: true,
      });
    }

    // 2. Log in development
    if (process.env.NODE_ENV === "development") {
      logger.debug(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });
    }
  });

  return null;
}
