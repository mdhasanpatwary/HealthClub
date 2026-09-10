import { getSupabaseClient } from "@/lib/supabaseClient";
import { playNotificationSound } from "@/lib/notificationSound";
import { authStore } from "@/services/authStore";
import type {
  RealtimeMemberNotificationPayload,
  RealtimeTransactionPayload,
  RealtimeAdminAlertPayload,
} from "@/lib/realtimeEmitter";

export type ChannelType = ReturnType<NonNullable<ReturnType<typeof getSupabaseClient>>["channel"]>;

export interface ListenerCallbacks {
  id: string;
  enableSound: boolean;
  onNotification?: (payload: RealtimeMemberNotificationPayload) => void;
  onTransaction?: (payload: RealtimeTransactionPayload) => void;
  onAdminAlert?: (payload: RealtimeAdminAlertPayload) => void;
  onAccountTerminated?: (payload: { memberId: string; status: string }) => void;
}

export interface SubscriptionEntry {
  key: string;
  role?: "user" | "admin" | "partner" | "partner_staff";
  memberId?: string;
  partnerId?: string;
  listeners: Map<string, ListenerCallbacks>;
  channel: ChannelType | null;
  eventSource: EventSource | null;
  teardownTimeout: ReturnType<typeof setTimeout> | null;
  reconnectTimeout: ReturnType<typeof setTimeout> | null;
}

// Module-level multiplexer to prevent duplicate channel creation,
// race condition errors on `channel.on(...)` after subscribe(),
// and excessive WebSocket connections when multiple bells mount.
const activeSubscriptions = new Map<string, SubscriptionEntry>();
const recentEventIds = new Set<string>();

function isDuplicateEvent(id?: string): boolean {
  if (!id) return false;
  if (recentEventIds.has(id)) return true;
  recentEventIds.add(id);
  if (recentEventIds.size > 200) {
    const oldest = recentEventIds.values().next().value;
    if (oldest) recentEventIds.delete(oldest);
  }
  return false;
}

export function getSubscriptionKey(role?: string, memberId?: string, partnerId?: string): string {
  return `${role || "general"}:${memberId || "all"}:${partnerId || "all"}`;
}

/**
 * Validates that the client is actively authenticated for the requested role and entity.
 * Prevents unauthorized or dormant/anonymous WebSocket connections from saturating Supabase limits.
 */
export function isSubscriptionAuthenticated(
  role?: "user" | "admin" | "partner" | "partner_staff",
  memberId?: string,
  partnerId?: string
): boolean {
  if (typeof window === "undefined" || !role) return false;

  if (role === "user") {
    if (!memberId || typeof memberId !== "string" || memberId.trim().length === 0 || memberId === "all") {
      return false;
    }
    const currentUser = authStore.getCurrentUser();
    return Boolean(currentUser && currentUser.id === memberId);
  }

  if (role === "partner" || role === "partner_staff") {
    if (!partnerId || typeof partnerId !== "string" || partnerId.trim().length === 0 || partnerId === "all") {
      return false;
    }
    const currentPartner = authStore.getCurrentPartner();
    const currentStaff = authStore.getCurrentStaff();
    return Boolean((currentPartner && currentPartner.id === partnerId) || currentStaff);
  }

  if (role === "admin") {
    const currentUser = authStore.getCurrentUser();
    return Boolean(currentUser && currentUser.role === "admin");
  }

  return false;
}

// 5-minute inactivity safeguard to prevent Supabase 200 concurrent connection exhaustion
const INACTIVE_DISCONNECT_DELAY_MS = 5 * 60 * 1000;
let dormancyTimer: ReturnType<typeof setTimeout> | null = null;
let isTabDormant = false;
let isDormancyListenerAttached = false;

function ensureDormancyListener() {
  if (typeof window === "undefined" || typeof document === "undefined" || isDormancyListenerAttached) {
    return;
  }
  isDormancyListenerAttached = true;
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("focus", handleWindowFocus);
  window.addEventListener("auth-change", handleAuthChange);
}

function handleVisibilityChange() {
  if (typeof document === "undefined") return;

  if (document.visibilityState === "hidden") {
    if (!dormancyTimer && !isTabDormant) {
      dormancyTimer = setTimeout(() => {
        dormancyTimer = null;
        isTabDormant = true;
        teardownAllSubscriptionsForDormancy();
      }, INACTIVE_DISCONNECT_DELAY_MS);
    }
  } else {
    if (dormancyTimer) {
      clearTimeout(dormancyTimer);
      dormancyTimer = null;
    }
    if (isTabDormant) {
      isTabDormant = false;
      reconnectAllDormantSubscriptions();
    }
  }
}

function handleWindowFocus() {
  if (typeof document !== "undefined" && document.visibilityState === "visible") {
    handleVisibilityChange();
  }
}

function handleAuthChange() {
  for (const entry of activeSubscriptions.values()) {
    if (!isSubscriptionAuthenticated(entry.role, entry.memberId, entry.partnerId)) {
      teardownEntryConnection(entry);
    }
  }
  checkAndDisconnectIdleSocket();
}

function teardownAllSubscriptionsForDormancy() {
  for (const entry of activeSubscriptions.values()) {
    teardownEntryConnection(entry);
  }
  checkAndDisconnectIdleSocket();
}

function reconnectAllDormantSubscriptions() {
  for (const entry of activeSubscriptions.values()) {
    if (
      entry.listeners.size > 0 &&
      !entry.channel &&
      !entry.eventSource &&
      isSubscriptionAuthenticated(entry.role, entry.memberId, entry.partnerId)
    ) {
      initSubscription(entry);
    }
  }
}

function dispatchToListeners(
  entry: SubscriptionEntry,
  dedupeId: string | undefined,
  eventName: string,
  payload: unknown,
  notifyCallback: (listener: ListenerCallbacks) => void
) {
  if (isDuplicateEvent(dedupeId)) return;

  const shouldPlaySound = Array.from(entry.listeners.values()).some((l) => l.enableSound);
  if (shouldPlaySound) playNotificationSound();

  for (const listener of entry.listeners.values()) {
    try {
      notifyCallback(listener);
    } catch (err) {
      console.warn(`[Realtime] Error in ${eventName} callback:`, err);
    }
  }

  window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
}

function dispatchNotification(entry: SubscriptionEntry, payload: RealtimeMemberNotificationPayload) {
  dispatchToListeners(entry, payload.notification.id, "hc-realtime-notification", payload, (l) =>
    l.onNotification?.(payload)
  );
}

function dispatchTransaction(entry: SubscriptionEntry, payload: RealtimeTransactionPayload) {
  const eventId = `tx_${payload.transaction.id}_${payload.transaction.date}`;
  dispatchToListeners(entry, eventId, "hc-realtime-transaction", payload, (l) =>
    l.onTransaction?.(payload)
  );
}

function dispatchAdminAlert(entry: SubscriptionEntry, payload: RealtimeAdminAlertPayload) {
  const eventId = `alert_${payload.id || payload.category}_${payload.timestamp || ""}`;
  dispatchToListeners(entry, eventId, "hc-realtime-admin-alert", payload, (l) =>
    l.onAdminAlert?.(payload)
  );
}

function dispatchAccountTerminated(entry: SubscriptionEntry, payload: { memberId: string; status: string }) {
  for (const listener of entry.listeners.values()) {
    try {
      listener.onAccountTerminated?.(payload);
    } catch (err) {
      console.warn("[Realtime] Error in onAccountTerminated callback:", err);
    }
  }
  window.dispatchEvent(new CustomEvent("hc-account-terminated", { detail: payload }));
}

function connectSSE(entry: SubscriptionEntry) {
  if (entry.eventSource || typeof window === "undefined" || isTabDormant) return;

  try {
    const eventSource = new EventSource("/api/realtime");
    entry.eventSource = eventSource;

    eventSource.addEventListener("notification", (e) => {
      try { dispatchNotification(entry, JSON.parse(e.data)); } catch {}
    });
    eventSource.addEventListener("transaction", (e) => {
      try { dispatchTransaction(entry, JSON.parse(e.data)); } catch {}
    });
    eventSource.addEventListener("admin_alert", (e) => {
      try { dispatchAdminAlert(entry, JSON.parse(e.data)); } catch {}
    });
    eventSource.addEventListener("account_status", (e) => {
      try { dispatchAccountTerminated(entry, JSON.parse(e.data)); } catch {}
    });

    eventSource.onerror = () => {
      if (entry.eventSource) {
        entry.eventSource.close();
        entry.eventSource = null;
      }
      if (entry.listeners.size > 0 && !entry.reconnectTimeout && !isTabDormant) {
        entry.reconnectTimeout = setTimeout(() => {
          entry.reconnectTimeout = null;
          if (entry.listeners.size > 0 && !isTabDormant) {
            connectSSE(entry);
          }
        }, 5000);
      }
    };
  } catch {}
}

function initSubscription(entry: SubscriptionEntry) {
  if (isTabDormant) return;
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const safeKey = entry.key.replace(/[^a-zA-Z0-9_-]/g, "_");
      const uniqueTopic = `hc_rt_${safeKey}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const channel = supabase.channel(uniqueTopic);

      // Listen on member_notifications table
      if (entry.role === "admin" || entry.role === "user") {
        channel.on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "member_notifications",
            ...(entry.role === "user" && entry.memberId ? { filter: `member_id=eq.${entry.memberId}` } : {}),
          },
          (payload) => {
            const row = payload.new as Record<string, unknown>;
            if (row && typeof row.id === "string") {
              dispatchNotification(entry, {
                memberId: String(row.member_id || ""),
                notification: {
                  id: String(row.id),
                  type: String(row.type || "system_announcement"),
                  titleBn: String(row.title_bn || ""),
                  titleEn: String(row.title_en || ""),
                  messageBn: String(row.message_bn || ""),
                  messageEn: String(row.message_en || ""),
                  link: row.link ? String(row.link) : undefined,
                  createdAt: String(row.created_at || new Date().toISOString()),
                },
              });
            }
          }
        );
      }

      // Listen on members table for deletion or suspension of the active user
      if (entry.role === "user" && entry.memberId) {
        channel.on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "members",
            filter: `id=eq.${entry.memberId}`,
          },
          () => {
            dispatchAccountTerminated(entry, { memberId: entry.memberId || "", status: "deleted" });
          }
        );
        channel.on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "members",
            filter: `id=eq.${entry.memberId}`,
          },
          (payload) => {
            const row = payload.new as Record<string, unknown>;
            if (row && row.status && row.status !== "active") {
              dispatchAccountTerminated(entry, { memberId: entry.memberId || "", status: "deactivated" });
            }
          }
        );
      }

      // Listen on transactions table
      if (
        entry.role === "admin" ||
        entry.role === "partner" ||
        entry.role === "partner_staff" ||
        entry.role === "user"
      ) {
        channel.on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "transactions",
            ...(entry.role === "partner" && entry.partnerId ? { filter: `partner_id=eq.${entry.partnerId}` } : {}),
            ...(entry.role === "user" && entry.memberId ? { filter: `member_id=eq.${entry.memberId}` } : {}),
          },
          (payload) => {
            const row = payload.new as Record<string, unknown>;
            if (row && typeof row.id === "string") {
              dispatchTransaction(entry, {
                partnerId: String(row.partner_id || ""),
                memberId: String(row.member_id || ""),
                transaction: {
                  id: String(row.id),
                  amount: Number(row.amount || 0),
                  saved: Number(row.saved || 0),
                  partnerName: String(row.partner_name || ""),
                  memberName: String(row.member_name || ""),
                  date: String(row.date || ""),
                },
              });
            }
          }
        );
      }

      channel.subscribe((status, err) => {
        if (err || status === "CHANNEL_ERROR") {
          console.warn("[Realtime] Supabase subscription status:", status, err || "");
          connectSSE(entry);
        }
      });

      entry.channel = channel;
    } catch (err) {
      console.warn("[Realtime] Error initializing Supabase channel:", err);
      connectSSE(entry);
    }
  } else {
    connectSSE(entry);
  }

  if (entry.role === "admin" && !entry.eventSource) {
    connectSSE(entry);
  }
}

function teardownEntryConnection(entry: SubscriptionEntry) {
  if (entry.reconnectTimeout) {
    clearTimeout(entry.reconnectTimeout);
    entry.reconnectTimeout = null;
  }
  if (entry.channel) {
    try {
      const supabase = getSupabaseClient();
      supabase?.removeChannel(entry.channel);
    } catch {}
    entry.channel = null;
  }
  if (entry.eventSource) {
    try {
      entry.eventSource.close();
    } catch {}
    entry.eventSource = null;
  }
}

function teardownEntry(entry: SubscriptionEntry) {
  if (entry.teardownTimeout) {
    clearTimeout(entry.teardownTimeout);
    entry.teardownTimeout = null;
  }
  teardownEntryConnection(entry);
}

function checkAndDisconnectIdleSocket() {
  let hasActiveChannel = false;
  for (const entry of activeSubscriptions.values()) {
    if (entry.channel || entry.eventSource) {
      hasActiveChannel = true;
      break;
    }
  }
  if (!hasActiveChannel) {
    try {
      const supabase = getSupabaseClient();
      supabase?.realtime?.disconnect?.();
    } catch {}
  }
}

export function subscribeToRealtimeHub(
  listener: ListenerCallbacks,
  options: {
    role?: "user" | "admin" | "partner" | "partner_staff";
    memberId?: string;
    partnerId?: string;
  }
): () => void {
  ensureDormancyListener();

  // Validate authentication before initiating any channel or socket connection
  if (!isSubscriptionAuthenticated(options.role, options.memberId, options.partnerId)) {
    return () => {};
  }

  const key = getSubscriptionKey(options.role, options.memberId, options.partnerId);

  let entry = activeSubscriptions.get(key);
  if (!entry) {
    entry = {
      key,
      role: options.role,
      memberId: options.memberId,
      partnerId: options.partnerId,
      listeners: new Map(),
      channel: null,
      eventSource: null,
      teardownTimeout: null,
      reconnectTimeout: null,
    };
    activeSubscriptions.set(key, entry);
    entry.listeners.set(listener.id, listener);
    if (!isTabDormant) {
      initSubscription(entry);
    }
  } else {
    if (entry.teardownTimeout) {
      clearTimeout(entry.teardownTimeout);
      entry.teardownTimeout = null;
    }
    entry.listeners.set(listener.id, listener);
    if (!entry.channel && !entry.eventSource && !isTabDormant) {
      initSubscription(entry);
    }
  }

  return () => {
    const currentEntry = activeSubscriptions.get(key);
    if (!currentEntry) return;

    currentEntry.listeners.delete(listener.id);

    if (currentEntry.listeners.size === 0) {
      if (currentEntry.teardownTimeout) {
        clearTimeout(currentEntry.teardownTimeout);
      }
      currentEntry.teardownTimeout = setTimeout(() => {
        if (currentEntry.listeners.size === 0) {
          teardownEntry(currentEntry);
          activeSubscriptions.delete(key);
          checkAndDisconnectIdleSocket();
        }
      }, 1500);
    }
  };
}
