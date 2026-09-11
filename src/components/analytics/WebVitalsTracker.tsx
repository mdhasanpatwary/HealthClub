"use client";

import { useReportWebVitals } from "next/web-vitals";
import { logger } from "@/lib/logger";

export default function WebVitalsTracker() {
  useReportWebVitals((metric) => {
    // Log in development
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
