/**
 * Telemetry and Exception Monitoring Utility.
 * Provides centralized error capturing for Server Actions, Client Components,
 * and Next.js Error Boundaries with Sentry/OpenTelemetry plug-and-play support.
 */

import { logger } from "@/lib/logger";

export interface TelemetryContext {
  userId?: string;
  role?: string;
  route?: string;
  action?: string;
  [key: string]: unknown;
}

export interface TelemetryBreadcrumb {
  category?: string;
  message: string;
  data?: Record<string, unknown>;
  level?: "info" | "warn" | "error" | "debug";
  timestamp?: number;
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

  /**
   * Captures and records a structured telemetry event (e.g. failure points, security events, payment disputes).
   */
  captureEvent(
    eventName: string,
    data?: Record<string, unknown>,
    level: "info" | "warn" | "error" = "info",
    context?: TelemetryContext
  ): void {
    const combinedContext = {
      ...(data && { data }),
      ...context,
    };

    if (level === "error") {
      logger.error(`[TELEMETRY_EVENT] ${eventName}`, undefined, combinedContext);
    } else if (level === "warn") {
      logger.warn(`[TELEMETRY_EVENT] ${eventName}`, combinedContext);
    } else {
      logger.info(`[TELEMETRY_EVENT] ${eventName}`, combinedContext);
    }

    if (typeof window !== "undefined") {
      try {
        const win = window as unknown as {
          Sentry?: {
            captureMessage: (msg: string, level?: string) => void;
            addBreadcrumb: (breadcrumb: Record<string, unknown>) => void;
          };
          gtag?: (command: string, action: string, params: Record<string, unknown>) => void;
        };

        if (win.Sentry) {
          if (typeof win.Sentry.addBreadcrumb === "function") {
            win.Sentry.addBreadcrumb({
              category: "telemetry_event",
              message: eventName,
              data: combinedContext,
              level,
            });
          }
          if (level === "error" && typeof win.Sentry.captureMessage === "function") {
            win.Sentry.captureMessage(`[Telemetry Event] ${eventName}`, "error");
          }
        }

        if (win.gtag && typeof win.gtag === "function") {
          win.gtag("event", eventName, {
            event_category: "telemetry",
            level,
            ...data,
            ...context,
          });
        }
      } catch (err) {
        logger.warn("Telemetry dispatch error:", err);
      }
    }
  },

  /**
   * Records a diagnostic breadcrumb for tracking the lifecycle of an action.
   */
  addBreadcrumb(breadcrumb: TelemetryBreadcrumb): void {
    const level = breadcrumb.level || "info";
    const crumb = {
      ...breadcrumb,
      timestamp: breadcrumb.timestamp || Date.now(),
    };

    if (level === "error") {
      logger.error(`[BREADCRUMB] ${crumb.category ? `[${crumb.category}] ` : ""}${crumb.message}`, undefined, crumb.data);
    } else if (level === "warn") {
      logger.warn(`[BREADCRUMB] ${crumb.category ? `[${crumb.category}] ` : ""}${crumb.message}`, crumb.data);
    } else {
      logger.debug(`[BREADCRUMB] ${crumb.category ? `[${crumb.category}] ` : ""}${crumb.message}`, crumb.data);
    }

    if (typeof window !== "undefined") {
      try {
        const win = window as unknown as {
          Sentry?: {
            addBreadcrumb: (b: Record<string, unknown>) => void;
          };
        };
        if (win.Sentry && typeof win.Sentry.addBreadcrumb === "function") {
          win.Sentry.addBreadcrumb({
            category: crumb.category || "custom",
            message: crumb.message,
            data: crumb.data,
            level: crumb.level || "info",
            timestamp: (crumb.timestamp || Date.now()) / 1000,
          });
        }
      } catch {
        // Ignore client breadcrumb dispatch errors
      }
    }
  },
};
