"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MemberNotification } from "@/services/db";
import {
  getMemberNotificationsAction,
  markMemberNotificationReadAction,
  markAllMemberNotificationsReadAction,
  deleteMemberNotificationAction,
} from "@/app/actions/memberNotificationActions";
import { safeStorage } from "@/lib/safeStorage";
import { toast } from "sonner";
import { authStore } from "@/services/authStore";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import type { RealtimeMemberNotificationPayload } from "@/lib/realtimeEmitter";

const STORAGE_KEY = "hc_member_read_notifications";

// Module-level deduplication and short TTL cache to prevent duplicate concurrent queries
// when Header (desktop), Mobile Drawer, and DashboardWelcomeHeader mount simultaneously.
interface CachedMemberNotifications {
  data: Awaited<ReturnType<typeof getMemberNotificationsAction>>;
  timestamp: number;
}

const CACHE_TTL_MS = 5000; // 5-second cache
const inFlightRequests = new Map<string, Promise<Awaited<ReturnType<typeof getMemberNotificationsAction>>>>();
const cachedResults = new Map<string, CachedMemberNotifications>();
const recentlyToastedIds = new Set<string>();

function getCacheKey(unreadOnly?: boolean, type?: string): string {
  return `${unreadOnly ? "1" : "0"}_${type || "all"}`;
}

async function fetchDedupedMemberNotifications(
  unreadOnly?: boolean,
  type?: string,
  force = false
) {
  const key = getCacheKey(unreadOnly, type);
  const now = Date.now();
  const cached = cachedResults.get(key);

  if (!force && cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  if (force) {
    cachedResults.delete(key);
  }

  let inFlight = inFlightRequests.get(key);
  if (!inFlight) {
    inFlight = getMemberNotificationsAction({ unreadOnly, type })
      .then((res) => {
        cachedResults.set(key, { data: res, timestamp: Date.now() });
        return res;
      })
      .finally(() => {
        inFlightRequests.delete(key);
      });
    inFlightRequests.set(key, inFlight);
  }

  return inFlight;
}

export function invalidateMemberNotificationsCache() {
  cachedResults.clear();
}

export interface UseMemberNotificationsOptions {
  autoRefreshInterval?: number; // In milliseconds (default 300000ms = 5m lazy heartbeat, 0 to disable)
  unreadOnly?: boolean;
  type?: string;
}

export function useMemberNotifications(options?: UseMemberNotificationsOptions) {
  const [items, setItems] = useState<MemberNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [highPriorityCount, setHighPriorityCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const lastFetchTimeRef = useRef<number>(0);

  const unreadOnly = options?.unreadOnly;
  const type = options?.type;
  // Default to 5-minute lazy heartbeat instead of aggressive 30s polling
  const autoRefreshInterval = options?.autoRefreshInterval ?? 300000;

  const fetchNotifications = useCallback(
    async (force = false) => {
      try {
        const res = await fetchDedupedMemberNotifications(unreadOnly, type, force);

        const localReadIds = new Set(safeStorage.getItem<string[]>(STORAGE_KEY, []) || []);

        // Extract server read IDs to keep local cache updated
        const serverReadIds = res.items.filter((item) => item.isRead).map((item) => item.id);
        if (serverReadIds.length > 0) {
          const currentLocal = safeStorage.getItem<string[]>(STORAGE_KEY, []) || [];
          const mergedCache = Array.from(new Set([...currentLocal, ...serverReadIds]));
          safeStorage.setItem(STORAGE_KEY, mergedCache);
        }

        // Merge server items with local read cache to prevent race-condition reverts
        const mergedItems = res.items.map((item) => {
          if (localReadIds.has(item.id)) {
            return { ...item, isRead: true };
          }
          return item;
        });

        const calculatedUnread = mergedItems.filter((i) => !i.isRead).length;
        const calculatedHighPriority = mergedItems.filter(
          (n) =>
            !n.isRead &&
            (n.type === "renewal_approved" ||
              n.type === "renewal_rejected" ||
              n.type === "expiring_soon")
        ).length;

        setItems(mergedItems);
        setUnreadCount(calculatedUnread);
        setHighPriorityCount(calculatedHighPriority);
        lastFetchTimeRef.current = Date.now();
      } catch {
        // Graceful fallback for non-fatal notification fetch errors
      } finally {
        setLoading(false);
      }
    },
    [unreadOnly, type]
  );

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        fetchNotifications(false);
      }
    });

    let timer: NodeJS.Timeout | null = null;
    if (autoRefreshInterval > 0) {
      timer = setInterval(() => {
        if (!isMounted) return;
        // Skip background polling if tab is hidden to eliminate idle database egress
        if (typeof document !== "undefined" && document.visibilityState === "hidden") {
          return;
        }
        fetchNotifications(false);
      }, autoRefreshInterval);
    }

    const MIN_FOCUS_REFETCH_INTERVAL_MS = 300000; // 5 minutes minimum between focus refetches

    const handleVisibilityOrFocus = () => {
      if (!isMounted) return;
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }
      const now = Date.now();
      // Only refetch on focus / visibilitychange if at least 5m elapsed since last fetch
      if (now - lastFetchTimeRef.current >= MIN_FOCUS_REFETCH_INTERVAL_MS) {
        lastFetchTimeRef.current = now;
        fetchNotifications(false);
      }
    };

    // Lightweight cross-instance state synchronization without querying the database
    const handleLocalRead = (e: Event) => {
      if (!isMounted) return;
      const notifId = (e as CustomEvent<string>).detail;
      if (!notifId) return;
      setItems((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleLocalAllRead = () => {
      if (!isMounted) return;
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      setHighPriorityCount(0);
    };

    const handleLocalDelete = (e: Event) => {
      if (!isMounted) return;
      const notifId = (e as CustomEvent<string>).detail;
      if (!notifId) return;
      setItems((prev) => prev.filter((n) => n.id !== notifId));
    };

    const handleAuthChange = () => {
      if (!isMounted) return;
      invalidateMemberNotificationsCache();
      fetchNotifications(true);
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("member-notification-local-read", handleLocalRead);
    window.addEventListener("member-notification-local-all-read", handleLocalAllRead);
    window.addEventListener("member-notification-local-delete", handleLocalDelete);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("member-notification-local-read", handleLocalRead);
      window.removeEventListener("member-notification-local-all-read", handleLocalAllRead);
      window.removeEventListener("member-notification-local-delete", handleLocalDelete);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [fetchNotifications, autoRefreshInterval]);

  // Real-time notification handler (Supabase Realtime / SSE)
  const currentMemberId = typeof window !== "undefined" ? authStore.getCurrentUser()?.id : undefined;

  const handleRealtimeNotification = useCallback(
    (payload: RealtimeMemberNotificationPayload) => {
      const incoming = payload.notification;
      const newNotif: MemberNotification = {
        id: incoming.id,
        memberId: payload.memberId,
        type: incoming.type as MemberNotification["type"],
        titleBn: incoming.titleBn,
        titleEn: incoming.titleEn,
        messageBn: incoming.messageBn,
        messageEn: incoming.messageEn,
        isRead: false,
        link: incoming.link,
        createdAt: incoming.createdAt,
      };

      invalidateMemberNotificationsCache();

      setItems((prev) => {
        if (prev.some((n) => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });

      setUnreadCount((prev) => prev + 1);

      const isHighPriority =
        newNotif.type === "renewal_approved" ||
        newNotif.type === "renewal_rejected" ||
        newNotif.type === "expiring_soon";

      if (isHighPriority) {
        setHighPriorityCount((prev) => prev + 1);
      }

      // Deduplicate toast notification if multiple bells are mounted
      if (!recentlyToastedIds.has(newNotif.id)) {
        recentlyToastedIds.add(newNotif.id);
        if (recentlyToastedIds.size > 100) {
          const oldest = recentlyToastedIds.values().next().value;
          if (oldest) recentlyToastedIds.delete(oldest);
        }
        toast.info(newNotif.titleBn || "নতুন বিজ্ঞপ্তি", {
          description: newNotif.messageBn,
        });
      }
    },
    []
  );

  useRealtimeNotifications({
    role: "user",
    memberId: currentMemberId,
    enableSound: true,
    onNotification: handleRealtimeNotification,
  });

  const markAsRead = useCallback(
    async (notificationId: string) => {
      // 1. Immediately persist to local read cache
      const currentRead = safeStorage.getItem<string[]>(STORAGE_KEY, []) || [];
      if (!currentRead.includes(notificationId)) {
        safeStorage.setItem(STORAGE_KEY, [...currentRead, notificationId]);
      }

      // 2. Optimistic UI update
      setItems((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      invalidateMemberNotificationsCache();

      // 3. Persist to server database
      try {
        await markMemberNotificationReadAction(notificationId);
      } catch {
        // Retain local read status even if network glitch occurs
      }

      // 4. Synchronize other mounted bell instances without querying database
      window.dispatchEvent(
        new CustomEvent("member-notification-local-read", { detail: notificationId })
      );
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    // 1. Persist all IDs to local read cache
    const allIds = items.map((item) => item.id);
    const currentRead = safeStorage.getItem<string[]>(STORAGE_KEY, []) || [];
    const merged = Array.from(new Set([...currentRead, ...allIds]));
    safeStorage.setItem(STORAGE_KEY, merged);

    // 2. Optimistic UI update
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    setHighPriorityCount(0);
    invalidateMemberNotificationsCache();

    // 3. Synchronize other mounted bell instances without querying database
    window.dispatchEvent(new Event("member-notification-local-all-read"));

    // 4. Persist to server database
    try {
      const res = await markAllMemberNotificationsReadAction();
      if (res.success) {
        toast.success("সব বিজ্ঞপ্তি পঠিত হিসেবে চিহ্নিত করা হয়েছে।");
      }
    } catch {
      // Local state remains read
    }
  }, [items]);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      // Optimistic UI update
      setItems((prev) => prev.filter((n) => n.id !== notificationId));
      invalidateMemberNotificationsCache();

      // Synchronize other mounted bell instances without querying database
      window.dispatchEvent(
        new CustomEvent("member-notification-local-delete", { detail: notificationId })
      );

      try {
        const res = await deleteMemberNotificationAction(notificationId);
        if (res.success) {
          toast.success("বিজ্ঞপ্তিটি মুছে ফেলা হয়েছে।");
        } else {
          toast.error(res.error || "বিজ্ঞপ্তি মুছে ফেলা সম্ভব হয়নি।");
          invalidateMemberNotificationsCache();
          fetchNotifications(true);
        }
      } catch {
        toast.error("বিজ্ঞপ্তি মুছে ফেলা সম্ভব হয়নি।");
        invalidateMemberNotificationsCache();
        fetchNotifications(true);
      }
    },
    [fetchNotifications]
  );

  return {
    items,
    unreadCount,
    highPriorityCount,
    loading,
    refresh: () => fetchNotifications(true),
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
