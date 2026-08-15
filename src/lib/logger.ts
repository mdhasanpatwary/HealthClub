/**
 * Structured application logger with environment-aware log levels and PII sanitization.
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
};

const currentLevel: LogLevel =
  process.env.NODE_ENV === "production" ? "WARN" : "DEBUG";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

/**
 * Strips sensitive keys like passwords, tokens, and secrets from logged data.
 */
function sanitizeData(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  const sanitized: Record<string, unknown> = {};
  const sensitiveKeys = ["password", "token", "code", "verificationcode", "secret", "cookie", "authorization"];

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object") {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export const logger = {
  debug(message: string, context?: unknown) {
    if (shouldLog("DEBUG")) {
      console.debug(`[DEBUG] ${message}`, context ? sanitizeData(context) : "");
    }
  },

  info(message: string, context?: unknown) {
    if (shouldLog("INFO")) {
      console.info(`[INFO] ${message}`, context ? sanitizeData(context) : "");
    }
  },

  warn(message: string, context?: unknown) {
    if (shouldLog("WARN")) {
      console.warn(`[WARN] ${message}`, context ? sanitizeData(context) : "");
    }
  },

  error(message: string, error?: unknown, context?: unknown) {
    if (shouldLog("ERROR")) {
      console.error(
        `[ERROR] ${message}`,
        error instanceof Error ? error.stack || error.message : error,
        context ? sanitizeData(context) : ""
      );
    }
  },

  fatal(message: string, error?: unknown, context?: unknown) {
    if (shouldLog("FATAL")) {
      console.error(
        `[FATAL] ${message}`,
        error instanceof Error ? error.stack || error.message : error,
        context ? sanitizeData(context) : ""
      );
    }
  },
};
