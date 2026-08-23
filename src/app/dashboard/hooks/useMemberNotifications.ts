"use client";

import { useState, useEffect, useCallback } from "react";
import { MemberNotification } from "@/services/db";
import { dbStore } from "@/services/dbStore";
import { toast } from "sonner";

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
      const res = await dbStore.getMemberNotifications({
        unreadOnly,
        type,
      });

      setItems(res.items);
      setUnreadCount(res.unreadCount);
      setHighPriorityCount(res.highPriorityCount);
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
        fetchNotifications();
      }, autoRefreshInterval);
    }

    const handleWindowFocus = () => {
      fetchNotifications();
    };

    const handleCustomChange = () => {
      fetchNotifications();
    };

    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("member-notification-change", handleCustomChange);
    window.addEventListener("auth-change", handleCustomChange);

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("member-notification-change", handleCustomChange);
      window.removeEventListener("auth-change", handleCustomChange);
    };
  }, [fetchNotifications, autoRefreshInterval]);

  const markAsRead = useCallback(async (notificationId: string) => {
    // Optimistic UI update
    setItems((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      const res = await dbStore.markMemberNotificationRead(notificationId);
      if (!res.success) {
        fetchNotifications();
      } else {
        window.dispatchEvent(new Event("member-notification-change"));
      }
    } catch {
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    // Optimistic UI update
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    setHighPriorityCount(0);

    try {
      const res = await dbStore.markAllMemberNotificationsRead();
      if (res.success) {
        toast.success("সব বিজ্ঞপ্তি পঠিত হিসেবে চিহ্নিত করা হয়েছে।");
        window.dispatchEvent(new Event("member-notification-change"));
      } else {
        fetchNotifications();
      }
    } catch {
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    // Optimistic UI update
    setItems((prev) => prev.filter((n) => n.id !== notificationId));

    try {
      const res = await dbStore.deleteMemberNotification(notificationId);
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
  }, [fetchNotifications]);

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
