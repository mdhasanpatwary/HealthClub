"use client";

import { useEffect, useRef, useId } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { playNotificationSound } from "@/lib/notificationSound";
import type {
  RealtimeMemberNotificationPayload,
  RealtimeTransactionPayload,
  RealtimeAdminAlertPayload,
} from "@/lib/realtimeEmitter";

export interface UseRealtimeOptions {
  role?: "user" | "admin" | "partner" | "partner_staff";
  memberId?: string;
  partnerId?: string;
  enableSound?: boolean;
  onNotification?: (payload: RealtimeMemberNotificationPayload) => void;
  onTransaction?: (payload: RealtimeTransactionPayload) => void;
  onAdminAlert?: (payload: RealtimeAdminAlertPayload) => void;
}

type ChannelType = ReturnType<NonNullable<ReturnType<typeof getSupabaseClient>>["channel"]>;

interface ListenerCallbacks {
  id: string;
  enableSound: boolean;
  onNotification?: (payload: RealtimeMemberNotificationPayload) => void;
  onTransaction?: (payload: RealtimeTransactionPayload) => void;
  onAdminAlert?: (payload: RealtimeAdminAlertPayload) => void;
}

interface SubscriptionEntry {
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
// and excessive WebSocket connections when multiple bells (desktop/mobile) mount.
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

function getSubscriptionKey(role?: string, memberId?: string, partnerId?: string): string {
  return `${role || "general"}:${memberId || "all"}:${partnerId || "all"}`;
}

function dispatchNotification(entry: SubscriptionEntry, payload: RealtimeMemberNotificationPayload) {
  if (isDuplicateEvent(payload.notification.id)) {
    return;
  }

  let shouldPlaySound = false;
  for (const listener of entry.listeners.values()) {
    if (listener.enableSound) {
      shouldPlaySound = true;
      break;
    }
  }

  if (shouldPlaySound) {
    playNotificationSound();
  }

  for (const listener of entry.listeners.values()) {
    try {
      listener.onNotification?.(payload);
    } catch (err) {
      console.warn("[Realtime] Error in onNotification callback:", err);
    }
  }

  window.dispatchEvent(
    new CustomEvent("hc-realtime-notification", { detail: payload })
  );
}

function dispatchTransaction(entry: SubscriptionEntry, payload: RealtimeTransactionPayload) {
  const eventId = `tx_${payload.transaction.id}_${payload.transaction.date}`;
  if (isDuplicateEvent(eventId)) {
    return;
  }

  let shouldPlaySound = false;
  for (const listener of entry.listeners.values()) {
    if (listener.enableSound) {
      shouldPlaySound = true;
      break;
    }
  }

  if (shouldPlaySound) {
    playNotificationSound();
  }

  for (const listener of entry.listeners.values()) {
    try {
      listener.onTransaction?.(payload);
    } catch (err) {
      console.warn("[Realtime] Error in onTransaction callback:", err);
    }
  }

  window.dispatchEvent(
    new CustomEvent("hc-realtime-transaction", { detail: payload })
  );
}

function dispatchAdminAlert(entry: SubscriptionEntry, payload: RealtimeAdminAlertPayload) {
  const eventId = `alert_${payload.id || payload.category}_${payload.timestamp || ""}`;
  if (isDuplicateEvent(eventId)) {
    return;
  }

  let shouldPlaySound = false;
  for (const listener of entry.listeners.values()) {
    if (listener.enableSound) {
      shouldPlaySound = true;
      break;
    }
  }

  if (shouldPlaySound) {
    playNotificationSound();
  }

  for (const listener of entry.listeners.values()) {
    try {
      listener.onAdminAlert?.(payload);
    } catch (err) {
      console.warn("[Realtime] Error in onAdminAlert callback:", err);
    }
  }

  window.dispatchEvent(
    new CustomEvent("hc-realtime-admin-alert", { detail: payload })
  );
}

function connectSSE(entry: SubscriptionEntry) {
  if (entry.eventSource || typeof window === "undefined") return;

  try {
    const eventSource = new EventSource("/api/realtime");
    entry.eventSource = eventSource;

    eventSource.addEventListener("notification", (event) => {
      try {
        const data = JSON.parse(event.data) as RealtimeMemberNotificationPayload;
        dispatchNotification(entry, data);
      } catch {
        // Ignore malformed payload
      }
    });

    eventSource.addEventListener("transaction", (event) => {
      try {
        const data = JSON.parse(event.data) as RealtimeTransactionPayload;
        dispatchTransaction(entry, data);
      } catch {
        // Ignore malformed payload
      }
    });

    eventSource.addEventListener("admin_alert", (event) => {
      try {
        const data = JSON.parse(event.data) as RealtimeAdminAlertPayload;
        dispatchAdminAlert(entry, data);
      } catch {
        // Ignore malformed payload
      }
    });

    eventSource.onerror = () => {
      if (entry.eventSource) {
        entry.eventSource.close();
        entry.eventSource = null;
      }
      if (entry.listeners.size > 0 && !entry.reconnectTimeout) {
        entry.reconnectTimeout = setTimeout(() => {
          entry.reconnectTimeout = null;
          if (entry.listeners.size > 0) {
            connectSSE(entry);
          }
        }, 5000);
      }
    };
  } catch {
    // SSE not supported or blocked
  }
}

function initSubscription(entry: SubscriptionEntry) {
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
            const row = payload.new as {
              id: string;
              member_id: string;
              type: string;
              title_bn: string;
              title_en: string;
              message_bn: string;
              message_en: string;
              link?: string;
              created_at: string;
            };
            if (row && row.id) {
              dispatchNotification(entry, {
                memberId: row.member_id,
                notification: {
                  id: row.id,
                  type: row.type,
                  titleBn: row.title_bn,
                  titleEn: row.title_en,
                  messageBn: row.message_bn,
                  messageEn: row.message_en,
                  link: row.link,
                  createdAt: row.created_at,
                },
              });
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
            const row = payload.new as {
              id: string;
              partner_id: string;
              member_id: string;
              amount: number;
              saved: number;
              partner_name: string;
              member_name: string;
              date: string;
            };
            if (row && row.id) {
              dispatchTransaction(entry, {
                partnerId: row.partner_id,
                memberId: row.member_id,
                transaction: {
                  id: row.id,
                  amount: row.amount,
                  saved: row.saved,
                  partnerName: row.partner_name,
                  memberName: row.member_name,
                  date: row.date,
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
    // Mode B: SSE Fallback when Supabase client is not available
    connectSSE(entry);
  }

  // Admin alerts are server-emitted events that flow over SSE
  if (entry.role === "admin" && !entry.eventSource) {
    connectSSE(entry);
  }
}

function teardownEntry(entry: SubscriptionEntry) {
  if (entry.teardownTimeout) {
    clearTimeout(entry.teardownTimeout);
    entry.teardownTimeout = null;
  }
  if (entry.reconnectTimeout) {
    clearTimeout(entry.reconnectTimeout);
    entry.reconnectTimeout = null;
  }

  if (entry.channel) {
    try {
      const supabase = getSupabaseClient();
      supabase?.removeChannel(entry.channel);
    } catch {
      // Ignore teardown errors
    }
    entry.channel = null;
  }

  if (entry.eventSource) {
    try {
      entry.eventSource.close();
    } catch {
      // Ignore
    }
    entry.eventSource = null;
  }
}

function subscribeToRealtimeHub(
  listener: ListenerCallbacks,
  options: {
    role?: "user" | "admin" | "partner" | "partner_staff";
    memberId?: string;
    partnerId?: string;
  }
): () => void {
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
    initSubscription(entry);
  } else {
    if (entry.teardownTimeout) {
      clearTimeout(entry.teardownTimeout);
      entry.teardownTimeout = null;
    }
    entry.listeners.set(listener.id, listener);
  }

  return () => {
    const currentEntry = activeSubscriptions.get(key);
    if (!currentEntry) return;

    currentEntry.listeners.delete(listener.id);

    if (currentEntry.listeners.size === 0) {
      if (currentEntry.teardownTimeout) {
        clearTimeout(currentEntry.teardownTimeout);
      }
      // Delay teardown to prevent connection thrashing across React StrictMode or fast navigation
      currentEntry.teardownTimeout = setTimeout(() => {
        if (currentEntry.listeners.size === 0) {
          teardownEntry(currentEntry);
          activeSubscriptions.delete(key);
        }
      }, 1500);
    }
  };
}

export function useRealtimeNotifications(options: UseRealtimeOptions = {}) {
  const {
    role,
    memberId,
    partnerId,
    enableSound = true,
    onNotification,
    onTransaction,
    onAdminAlert,
  } = options;

  const listenerId = useId();

  const callbacksRef = useRef({
    onNotification,
    onTransaction,
    onAdminAlert,
    enableSound,
  });

  useEffect(() => {
    callbacksRef.current = {
      onNotification,
      onTransaction,
      onAdminAlert,
      enableSound,
    };
  }, [onNotification, onTransaction, onAdminAlert, enableSound]);

  useEffect(() => {
    const listener: ListenerCallbacks = {
      id: listenerId,
      get enableSound() {
        return callbacksRef.current.enableSound;
      },
      onNotification: (payload) => callbacksRef.current.onNotification?.(payload),
      onTransaction: (payload) => callbacksRef.current.onTransaction?.(payload),
      onAdminAlert: (payload) => callbacksRef.current.onAdminAlert?.(payload),
    };

    return subscribeToRealtimeHub(listener, { role, memberId, partnerId });
  }, [listenerId, role, memberId, partnerId]);
}
