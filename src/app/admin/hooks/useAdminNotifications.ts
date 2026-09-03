"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAdminNotificationsAction,
  markAdminNotificationReadAction,
  markAllAdminNotificationsReadAction,
  dismissAdminNotificationAction,
  clearAllAdminReadAction,
} from "@/app/actions/adminNotificationActions";
import type {
  AdminNotificationItem,
  AdminNotificationSummary,
  GetAdminNotificationsParams,
} from "@/app/actions/adminNotificationTypes";
import { safeStorage } from "@/lib/safeStorage";

const STORAGE_KEYS = {
  READ_IDS: "hc_admin_read_notifications",
  DISMISSED_IDS: "hc_admin_dismissed_notifications",
};

const DEFAULT_SUMMARY: AdminNotificationSummary = {
  items: [],
  unreadCount: 0,
  highPriorityCount: 0,
  pendingRenewalsCount: 0,
  pendingPartnerRequestsCount: 0,
  unreadMessagesCount: 0,
  expiringMembersCount: 0,
  newMembersCount: 0,
};

export interface UseAdminNotificationsOptions {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  unreadOnly?: boolean;
}

export function useAdminNotifications(options?: UseAdminNotificationsOptions) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AdminNotificationItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(options?.page || 1);
  const [pageSize, setPageSize] = useState(options?.pageSize || 10);
  const [category, setCategory] = useState(options?.category || "all");
  const [search, setSearch] = useState(options?.search || "");
  const [unreadOnly, setUnreadOnly] = useState(options?.unreadOnly || false);
  const [summary, setSummary] = useState<AdminNotificationSummary>(DEFAULT_SUMMARY);

  const [readIds, setReadIds] = useState<string[]>(() => {
    return safeStorage.getItem<string[]>(STORAGE_KEYS.READ_IDS, []) || [];
  });
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    return safeStorage.getItem<string[]>(STORAGE_KEYS.DISMISSED_IDS, []) || [];
  });

  // Load read and dismissed IDs from safeStorage
  const loadLocalStates = useCallback(() => {
    const savedRead = safeStorage.getItem<string[]>(STORAGE_KEYS.READ_IDS, []) || [];
    const savedDismissed = safeStorage.getItem<string[]>(STORAGE_KEYS.DISMISSED_IDS, []) || [];
    setReadIds(savedRead);
    setDismissedIds(savedDismissed);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const currentRead = safeStorage.getItem<string[]>(STORAGE_KEYS.READ_IDS, []) || [];
      const currentDismissed = safeStorage.getItem<string[]>(STORAGE_KEYS.DISMISSED_IDS, []) || [];

      const queryParams: GetAdminNotificationsParams = {
        page: currentPage,
        pageSize: pageSize,
        category: category,
        search: search,
        unreadOnly: unreadOnly,
        readIds: currentRead,
        dismissedIds: currentDismissed,
      };

      const result = await getAdminNotificationsAction(queryParams);

      // Extract all read IDs from server result to keep local cache in sync
      const serverReadIds = result.summary.items
        .filter((item) => item.isRead)
        .map((item) => item.id);
      if (serverReadIds.length > 0) {
        const mergedRead = Array.from(new Set([...currentRead, ...serverReadIds]));
        safeStorage.setItem(STORAGE_KEYS.READ_IDS, mergedRead);
        setReadIds(mergedRead);
      }

      setItems(result.items);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
      setSummary(result.summary);
    } catch {
      // Ignore notifications fetch failure silently
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, category, search, unreadOnly]);

  // Initial load & event subscriptions
  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadLocalStates();
        fetchNotifications();
      }
    });

    const handleDataChange = () => {
      if (!isMounted) return;
      loadLocalStates();
      fetchNotifications();
    };

    window.addEventListener("admin-data-change", handleDataChange);
    window.addEventListener("admin-notifications-change", handleDataChange);

    return () => {
      isMounted = false;
      window.removeEventListener("admin-data-change", handleDataChange);
      window.removeEventListener("admin-notifications-change", handleDataChange);
    };
  }, [fetchNotifications, loadLocalStates]);

  const readSet = useMemo(() => new Set(readIds), [readIds]);
  const dismissedSet = useMemo(() => new Set(dismissedIds), [dismissedIds]);

  // Calculate true unread count from summary items
  const unreadCount = useMemo(() => {
    return summary.items
      .filter((item) => !dismissedSet.has(item.id))
      .filter((item) => !readSet.has(item.id) && !item.isRead).length;
  }, [summary.items, dismissedSet, readSet]);

  const highPriorityCount = useMemo(() => {
    return summary.items
      .filter((item) => !dismissedSet.has(item.id))
      .filter((item) => item.severity === "high" && !readSet.has(item.id) && !item.isRead).length;
  }, [summary.items, dismissedSet, readSet]);

  const markAsRead = useCallback(
    async (id: string) => {
      // 1. Optimistic local update
      const currentRead = safeStorage.getItem<string[]>(STORAGE_KEYS.READ_IDS, []) || [];
      if (!currentRead.includes(id)) {
        const next = [...currentRead, id];
        safeStorage.setItem(STORAGE_KEYS.READ_IDS, next);
        setReadIds(next);
      }

      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );

      // 2. Persist to server database
      try {
        const res = await markAdminNotificationReadAction(id);
        if (res.success && res.readIds) {
          safeStorage.setItem(STORAGE_KEYS.READ_IDS, res.readIds);
          setReadIds(res.readIds);
        }
      } catch {
        // Local state remains read
      }

      // 3. Broadcast to other mounted instances
      window.dispatchEvent(new Event("admin-notifications-change"));
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    const allIds = summary.items.map((item) => item.id);
    const currentRead = safeStorage.getItem<string[]>(STORAGE_KEYS.READ_IDS, []) || [];
    const merged = Array.from(new Set([...currentRead, ...readIds, ...allIds]));
    setReadIds(merged);
    safeStorage.setItem(STORAGE_KEYS.READ_IDS, merged);
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      const res = await markAllAdminNotificationsReadAction(allIds);
      if (res.success && res.readIds) {
        safeStorage.setItem(STORAGE_KEYS.READ_IDS, res.readIds);
        setReadIds(res.readIds);
      }
    } catch {
      // Local state remains read
    }

    window.dispatchEvent(new Event("admin-notifications-change"));
  }, [summary.items, readIds]);

  const dismissNotification = useCallback(
    async (id: string) => {
      const currentDismissed = safeStorage.getItem<string[]>(STORAGE_KEYS.DISMISSED_IDS, []) || [];
      if (!currentDismissed.includes(id)) {
        const next = [...currentDismissed, id];
        safeStorage.setItem(STORAGE_KEYS.DISMISSED_IDS, next);
        setDismissedIds(next);
      }

      setItems((prev) => prev.filter((n) => n.id !== id));

      try {
        const res = await dismissAdminNotificationAction(id);
        if (res.success && res.dismissedIds) {
          safeStorage.setItem(STORAGE_KEYS.DISMISSED_IDS, res.dismissedIds);
          setDismissedIds(res.dismissedIds);
        }
      } catch {
        // Fallback to local state
      }

      window.dispatchEvent(new Event("admin-notifications-change"));
    },
    []
  );

  const clearAllRead = useCallback(async () => {
    const readItems = summary.items.filter((item) => readSet.has(item.id) || item.isRead);
    const toDismiss = readItems.map((item) => item.id);
    const currentDismissed = safeStorage.getItem<string[]>(STORAGE_KEYS.DISMISSED_IDS, []) || [];
    const merged = Array.from(new Set([...currentDismissed, ...dismissedIds, ...toDismiss]));
    setDismissedIds(merged);
    safeStorage.setItem(STORAGE_KEYS.DISMISSED_IDS, merged);
    setItems((prev) => prev.filter((item) => !merged.includes(item.id)));

    try {
      const res = await clearAllAdminReadAction();
      if (res.success && res.dismissedIds) {
        safeStorage.setItem(STORAGE_KEYS.DISMISSED_IDS, res.dismissedIds);
        setDismissedIds(res.dismissedIds);
      }
    } catch {
      // Fallback to local state
    }

    window.dispatchEvent(new Event("admin-notifications-change"));
  }, [summary.items, readSet, dismissedIds]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearch(q);
    setCurrentPage(1);
  }, []);

  const handleUnreadOnlyChange = useCallback((val: boolean) => {
    setUnreadOnly(val);
    setCurrentPage(1);
  }, []);

  return {
    loading,
    summary,
    items,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    unreadCount,
    highPriorityCount,
    readSet,
    category,
    search,
    unreadOnly,
    setCurrentPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    setCategory: handleCategoryChange,
    setSearch: handleSearchChange,
    setUnreadOnly: handleUnreadOnlyChange,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllRead,
    refetchNotifications: fetchNotifications,
  };
}
