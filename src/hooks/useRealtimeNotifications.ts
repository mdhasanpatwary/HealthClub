"use client";

import { useEffect, useRef, useCallback } from "react";
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

  const onNotificationRef = useRef(onNotification);
  const onTransactionRef = useRef(onTransaction);
  const onAdminAlertRef = useRef(onAdminAlert);

  useEffect(() => {
    onNotificationRef.current = onNotification;
    onTransactionRef.current = onTransaction;
    onAdminAlertRef.current = onAdminAlert;
  }, [onNotification, onTransaction, onAdminAlert]);

  const handleNotification = useCallback(
    (payload: RealtimeMemberNotificationPayload) => {
      if (enableSound) {
        playNotificationSound();
      }
      onNotificationRef.current?.(payload);
      window.dispatchEvent(
        new CustomEvent("hc-realtime-notification", { detail: payload })
      );
    },
    [enableSound]
  );

  const handleTransaction = useCallback(
    (payload: RealtimeTransactionPayload) => {
      if (enableSound) {
        playNotificationSound();
      }
      onTransactionRef.current?.(payload);
      window.dispatchEvent(
        new CustomEvent("hc-realtime-transaction", { detail: payload })
      );
    },
    [enableSound]
  );

  const handleAdminAlert = useCallback(
    (payload: RealtimeAdminAlertPayload) => {
      if (enableSound) {
        playNotificationSound();
      }
      onAdminAlertRef.current?.(payload);
      window.dispatchEvent(
        new CustomEvent("hc-realtime-admin-alert", { detail: payload })
      );
    },
    [enableSound]
  );

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseClient();

    // ----------------------------------------------------
    // Mode A: Supabase Realtime Channels (if configured)
    // ----------------------------------------------------
    if (supabase) {
      const channelId = `hc_realtime_${role || "general"}_${memberId || partnerId || "all"}_${Date.now()}`;
      const channel = supabase.channel(channelId);

      // Listen on member_notifications table
      if (role === "admin" || role === "user") {
        channel.on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "member_notifications",
            ...(role === "user" && memberId ? { filter: `member_id=eq.${memberId}` } : {}),
          },
          (payload) => {
            if (!isMounted) return;
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
            if (row) {
              handleNotification({
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
      if (role === "admin" || role === "partner" || role === "partner_staff" || role === "user") {
        channel.on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "transactions",
            ...(role === "partner" && partnerId ? { filter: `partner_id=eq.${partnerId}` } : {}),
            ...(role === "user" && memberId ? { filter: `member_id=eq.${memberId}` } : {}),
          },
          (payload) => {
            if (!isMounted) return;
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
            if (row) {
              handleTransaction({
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

      channel.subscribe();

      return () => {
        isMounted = false;
        supabase.removeChannel(channel);
      };
    }

    // ----------------------------------------------------
    // Mode B: Built-in Server-Sent Events (SSE) Fallback
    // ----------------------------------------------------
    let eventSource: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    function connectSSE() {
      if (!isMounted) return;

      try {
        eventSource = new EventSource("/api/realtime");

        eventSource.addEventListener("notification", (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data) as RealtimeMemberNotificationPayload;
            handleNotification(data);
          } catch {
            // Ignore malformed JSON
          }
        });

        eventSource.addEventListener("transaction", (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data) as RealtimeTransactionPayload;
            handleTransaction(data);
          } catch {
            // Ignore malformed JSON
          }
        });

        eventSource.addEventListener("admin_alert", (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data) as RealtimeAdminAlertPayload;
            handleAdminAlert(data);
          } catch {
            // Ignore malformed JSON
          }
        });

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          if (isMounted && !reconnectTimer) {
            reconnectTimer = setTimeout(() => {
              reconnectTimer = null;
              connectSSE();
            }, 5000);
          }
        };
      } catch {
        // SSE not supported or blocked
      }
    }

    connectSSE();

    return () => {
      isMounted = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    };
  }, [role, memberId, partnerId, handleNotification, handleTransaction, handleAdminAlert]);
}
