/**
 * Telemetry and Exception Monitoring Utility.
 * Provides centralized error capturing for Server Actions, Client Components,
 * and Next.js Error Boundaries with Sentry/OpenTelemetry plug-and-play support.
 */

import { logger } from "@/lib/logger";

interface TelemetryContext {
  userId?: string;
  role?: string;
  route?: string;
  action?: string;
  [key: string]: unknown;
}

export const telemetry = {
  /**
   * Captures and records an unexpected runtime exception.
   */
  captureException(error: unknown, context?: TelemetryContext): void {
    // 1. Structured console logging
    logger.error("Runtime exception captured by telemetry:", error, context);

    // 2. Client-side Sentry / monitoring hook if available on window
    if (typeof window !== "undefined") {
      try {
        const win = window as unknown as {
          Sentry?: {
            captureException: (err: unknown, extra?: { extra: Record<string, unknown> }) => void;
          };
          gtag?: (command: string, action: string, params: Record<string, unknown>) => void;
        };

        if (win.Sentry && typeof win.Sentry.captureException === "function") {
          win.Sentry.captureException(error, context ? { extra: context } : undefined);
        }

        // Send exception metric to GA4 if active
        if (win.gtag && typeof win.gtag === "function") {
          win.gtag("event", "exception", {
            description: error instanceof Error ? error.message : String(error),
            fatal: false,
            ...context,
          });
        }
      } catch (err) {
        logger.warn("Telemetry dispatch error:", err);
      }
    }
  },

  /**
   * Records a business or system message for monitoring.
   */
  captureMessage(message: string, level: "info" | "warn" | "error" = "info", context?: TelemetryContext): void {
    if (level === "error") {
      logger.error(message, undefined, context);
    } else if (level === "warn") {
      logger.warn(message, context);
    } else {
      logger.info(message, context);
    }
  },
};
