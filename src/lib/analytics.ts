/**
 * Unified Analytics and Event Tracking Engine for Health Club.
 * Dispatches strongly-typed events to Google Analytics 4 (GA4), Vercel Analytics,
 * and internal structured logging in development.
 */

import { logger } from "@/lib/logger";

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetIdOrEventName: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-T3YQYKGPY7";

export type AnalyticsEventName =
  | "emergency_dial"
  | "doctor_search"
  | "doctor_serial_click"
  | "hospital_search"
  | "hospital_contact_click"
  | "health_tool_used"
  | "health_report_downloaded"
  | "membership_funnel"
  | "health_tip_view"
  | "health_tip_feedback"
  | "pwa_action";

export interface AnalyticsEventParams {
  emergency_dial: {
    service_type: "blood_donor" | "ambulance" | "hotline" | "hospital";
    target_name: string;
    phone: string;
    upazila?: string;
  };
  doctor_search: {
    query?: string;
    specialty?: string;
    upazila?: string;
  };
  doctor_serial_click: {
    doctor_id: string;
    doctor_name: string;
    specialty?: string;
    hospital?: string;
    phone: string;
  };
  hospital_search: {
    query?: string;
    upazila?: string;
    category?: string;
  };
  hospital_contact_click: {
    partner_id: string;
    partner_name: string;
    upazila?: string;
    phone: string;
  };
  health_tool_used: {
    tool_name: "bmi" | "pregnancy_edd" | "bp_diabetes" | "calorie" | "water";
    result_status?: string;
  };
  health_report_downloaded: {
    report_type: string;
  };
  membership_funnel: {
    step: "view_pricing" | "register_submit" | "payment_submit" | "renew_submit";
    tier?: string;
    amount?: number;
  };
  health_tip_view: {
    slug: string;
    title: string;
    category: string;
  };
  health_tip_feedback: {
    slug: string;
    helpful: boolean;
  };
  pwa_action: {
    action: "prompt_shown" | "install_accepted" | "install_dismissed" | "push_subscribed";
  };
}

/**
 * Safely dispatches a typed analytics event.
 */
export function trackEvent<E extends AnalyticsEventName>(
  eventName: E,
  params: AnalyticsEventParams[E]
): void {
  if (typeof window === "undefined") return;

  try {
    // 1. Google Analytics 4 (gtag)
    if (typeof window.gtag === "function" && GA_MEASUREMENT_ID) {
      window.gtag("event", eventName, params as Record<string, unknown>);
    }

    // 2. Dev mode logger
    if (process.env.NODE_ENV === "development") {
      logger.debug(`[Analytics] ${eventName}`, params);
    }
  } catch (err) {
    logger.warn(`Failed to dispatch analytics event: ${eventName}`, err);
  }
}

/**
 * Dispatches page view event to GA4 on client-side route transitions.
 */
export function trackPageView(url: string, title?: string): void {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function" && GA_MEASUREMENT_ID) {
    window.gtag("event", "page_view", {
      page_location: url,
      page_title: title || document.title,
    });
  }
}
