/**
 * Safe LocalStorage and SessionStorage utilities.
 * Protects against:
 * 1. Corrupt JSON syntax errors
 * 2. Safari Private Browsing mode SecurityError
 * 3. Browser QuotaExceededError
 * 4. Server-Side Rendering (SSR) undefined window errors
 */

export const safeStorage = {
  /**
   * Safely retrieves and parses a JSON item from localStorage.
   * Falls back gracefully if missing, corrupted, or inaccessible.
   */
  getItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") {
      return fallback;
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null || raw === undefined) {
        return fallback;
      }
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[safeStorage] Failed to read/parse key "${key}", clearing key:`, err);
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Suppress secondary errors if storage is completely blocked
      }
      return fallback;
    }
  },

  /**
   * Safely serializes and sets a value in localStorage.
   * Returns true if successful, false if quota exceeded or blocked.
   */
  setItem(key: string, value: unknown): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn(`[safeStorage] Failed to write key "${key}":`, err);
      return false;
    }
  },

  /**
   * Safely removes an item from localStorage.
   */
  removeItem(key: string): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn(`[safeStorage] Failed to remove key "${key}":`, err);
    }
  },

  /**
   * Safely retrieves and parses a JSON item from sessionStorage.
   */
  getSessionItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") {
      return fallback;
    }
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw === null || raw === undefined) {
        return fallback;
      }
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[safeStorage] Failed to read/parse session key "${key}":`, err);
      return fallback;
    }
  },

  /**
   * Safely writes a value to sessionStorage.
   */
  setSessionItem(key: string, value: unknown): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      window.sessionStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn(`[safeStorage] Failed to write session key "${key}":`, err);
      return false;
    }
  },

  /**
   * Safely removes an item from sessionStorage.
   */
  removeSessionItem(key: string): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.sessionStorage.removeItem(key);
    } catch (err) {
      console.warn(`[safeStorage] Failed to remove session key "${key}":`, err);
    }
  },
};
