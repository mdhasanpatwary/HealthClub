"use client";

import { useState, useEffect, useCallback } from "react";
import { MemberNotification } from "@/services/db";
import {
  getMemberNotificationsAction,
  markMemberNotificationReadAction,
  markAllMemberNotificationsReadAction,
  deleteMemberNotificationAction,
} from "@/app/actions/memberNotificationActions";
import { safeStorage } from "@/lib/safeStorage";
import { toast } from "sonner";

const STORAGE_KEY = "hc_member_read_notifications";

export interface UseMemberNotificationsOptions {
  autoRefreshInterval?: number; // In milliseconds (default 30000ms = 30s)
  unreadOnly?: boolean;
  type?: string;
}

export function useMemberNotifications(options?: UseMemberNotificationsOptions) {
  const [items, setItems] = useState<MemberNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [highPriorityCount, setHighPriorityCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const unreadOnly = options?.unreadOnly;
  const type = options?.type;
  const autoRefreshInterval = options?.autoRefreshInterval ?? 30000;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getMemberNotificationsAction({
        unreadOnly,
        type,
      });

      const localReadIds = new Set(safeStorage.getItem<string[]>(STORAGE_KEY, []) || []);

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
    } catch {
      // Graceful fallback for non-fatal notification fetch errors
    } finally {
      setLoading(false);
    }
  }, [unreadOnly, type]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        fetchNotifications();
      }
    });

    let timer: NodeJS.Timeout | null = null;
    if (autoRefreshInterval > 0) {
      timer = setInterval(() => {
        if (isMounted) {
          fetchNotifications();
        }
      }, autoRefreshInterval);
    }

    const handleDataChange = () => {
      if (!isMounted) return;
      fetchNotifications();
    };

    window.addEventListener("focus", handleDataChange);
    window.addEventListener("member-notification-change", handleDataChange);
    window.addEventListener("auth-change", handleDataChange);

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
      window.removeEventListener("focus", handleDataChange);
      window.removeEventListener("member-notification-change", handleDataChange);
      window.removeEventListener("auth-change", handleDataChange);
    };
  }, [fetchNotifications, autoRefreshInterval]);

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

      // 3. Broadcast to other mounted instances
      window.dispatchEvent(new Event("member-notification-change"));

      // 4. Persist to server database
      try {
        await markMemberNotificationReadAction(notificationId);
      } catch {
        // Retain local read status even if network glitch occurs
      }
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

    // 3. Broadcast to other mounted instances
    window.dispatchEvent(new Event("member-notification-change"));

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

      try {
        const res = await deleteMemberNotificationAction(notificationId);
        if (res.success) {
          toast.success("বিজ্ঞপ্তিটি মুছে ফেলা হয়েছে।");
          window.dispatchEvent(new Event("member-notification-change"));
        } else {
          toast.error(res.error || "বিজ্ঞপ্তি মুছে ফেলা সম্ভব হয়নি।");
          fetchNotifications();
        }
      } catch {
        toast.error("বিজ্ঞপ্তি মুছে ফেলা সম্ভব হয়নি।");
        fetchNotifications();
      }
    },
    [fetchNotifications]
  );

  return {
    items,
    unreadCount,
    highPriorityCount,
    loading,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
