/**
 * Safe Storage & Offline Persistence Utilities.
 * Protects against:
 * 1. Corrupt JSON syntax errors
 * 2. Safari Private Browsing mode SecurityError
 * 3. Browser QuotaExceededError
 * 4. Server-Side Rendering (SSR) undefined window errors
 * 5. Offline caching via IndexedDB with seamless LocalStorage fallback
 */

import type { Member } from "@/services/db";
import type { AmbulanceService, EmergencyHotline, BloodDonor } from "@/data/emergencyData";

// ---------------------------------------------------------------------------
// Synchronous LocalStorage & SessionStorage Wrapper
// ---------------------------------------------------------------------------

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
    } catch {
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
    } catch {
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
    } catch {
      // Storage unavailable or blocked
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
    } catch {
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
    } catch {
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
    } catch {
      // Storage unavailable or blocked
    }
  },
};

// ---------------------------------------------------------------------------
// IndexedDB Offline Storage Utility
// ---------------------------------------------------------------------------

const DB_NAME = "healthclub_offline_db";
const DB_VERSION = 1;
const STORE_NAME = "offline_cache";

const STORAGE_KEYS = {
  MEMBER_CARD: "hc_offline_member_card",
  EMERGENCY_DIR: "hc_offline_emergency_dir",
  META_SYNC: "hc_offline_sync_meta",
};

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return reject(new Error("IndexedDB not supported or unavailable"));
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } catch (err) {
      reject(err);
    }
  });
}

export const safeIndexedDB = {
  /**
   * Asynchronously retrieves an item from IndexedDB with fallback to localStorage.
   */
  async getItem<T>(key: string, fallback: T): Promise<T> {
    if (typeof window === "undefined") return fallback;

    try {
      const db = await openIndexedDB();
      return new Promise<T>((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);

        req.onsuccess = () => {
          if (req.result && req.result.value !== undefined) {
            resolve(req.result.value as T);
          } else {
            // Fallback to localStorage
            resolve(safeStorage.getItem<T>(key, fallback));
          }
        };

        req.onerror = () => {
          resolve(safeStorage.getItem<T>(key, fallback));
        };
      });
    } catch {
      return safeStorage.getItem<T>(key, fallback);
    }
  },

  /**
   * Asynchronously stores an item in IndexedDB and syncs to localStorage fallback.
   */
  async setItem<T>(key: string, value: T): Promise<boolean> {
    if (typeof window === "undefined") return false;

    // Always keep safeStorage updated as redundant fallback
    safeStorage.setItem(key, value);

    try {
      const db = await openIndexedDB();
      return new Promise<boolean>((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.put({ key, value, updatedAt: new Date().toISOString() });

        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch {
      return true; // LocalStorage fallback succeeded
    }
  },

  /**
   * Removes an item from IndexedDB and localStorage.
   */
  async removeItem(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    safeStorage.removeItem(key);

    try {
      const db = await openIndexedDB();
      return new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    } catch {
      // Ignored
    }
  },
};

// ---------------------------------------------------------------------------
// High-Level Domain Offline Helpers
// ---------------------------------------------------------------------------

export interface OfflineEmergencyDirectory {
  ambulances: AmbulanceService[];
  hotlines: EmergencyHotline[];
  bloodDonors?: BloodDonor[];
  lastSynced: string;
}

export interface OfflineSyncMetadata {
  memberCardLastSynced?: string;
  emergencyLastSynced?: string;
}

/**
 * Saves active member card to IndexedDB + LocalStorage for offline presentation.
 */
export async function saveOfflineMemberCard(member: Member): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const success = await safeIndexedDB.setItem<Member>(STORAGE_KEYS.MEMBER_CARD, member);

  const meta = await getOfflineSyncMetadata();
  await safeIndexedDB.setItem<OfflineSyncMetadata>(STORAGE_KEYS.META_SYNC, {
    ...meta,
    memberCardLastSynced: timestamp,
  });

  return success;
}

/**
 * Retrieves the offline cached member card.
 */
export async function getOfflineMemberCard(): Promise<Member | null> {
  return safeIndexedDB.getItem<Member | null>(STORAGE_KEYS.MEMBER_CARD, null);
}

/**
 * Caches emergency ambulance services, hotlines & donors for offline emergency calling.
 */
export async function saveOfflineEmergencyDirectory(data: {
  ambulances?: AmbulanceService[];
  hotlines?: EmergencyHotline[];
  bloodDonors?: BloodDonor[];
}): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const payload: OfflineEmergencyDirectory = {
    ambulances: data.ambulances || [],
    hotlines: data.hotlines || [],
    bloodDonors: data.bloodDonors || [],
    lastSynced: timestamp,
  };

  const success = await safeIndexedDB.setItem<OfflineEmergencyDirectory>(
    STORAGE_KEYS.EMERGENCY_DIR,
    payload
  );

  const meta = await getOfflineSyncMetadata();
  await safeIndexedDB.setItem<OfflineSyncMetadata>(STORAGE_KEYS.META_SYNC, {
    ...meta,
    emergencyLastSynced: timestamp,
  });

  return success;
}

/**
 * Retrieves offline cached emergency ambulance & hotline data.
 */
export async function getOfflineEmergencyDirectory(): Promise<OfflineEmergencyDirectory | null> {
  return safeIndexedDB.getItem<OfflineEmergencyDirectory | null>(STORAGE_KEYS.EMERGENCY_DIR, null);
}

/**
 * Retrieves offline sync metadata (timestamps).
 */
export async function getOfflineSyncMetadata(): Promise<OfflineSyncMetadata> {
  return safeIndexedDB.getItem<OfflineSyncMetadata>(STORAGE_KEYS.META_SYNC, {});
}
