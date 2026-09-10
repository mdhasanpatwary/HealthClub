"use client";

import { useEffect, useRef, useId, useState } from "react";
import { authStore } from "@/services/authStore";
import {
  subscribeToRealtimeHub,
  isSubscriptionAuthenticated,
  type ListenerCallbacks,
} from "@/lib/realtimeHub";
import type {
  RealtimeMemberNotificationPayload,
  RealtimeTransactionPayload,
  RealtimeAdminAlertPayload,
} from "@/lib/realtimeEmitter";

export { isSubscriptionAuthenticated };

export interface UseRealtimeOptions {
  role?: "user" | "admin" | "partner" | "partner_staff";
  memberId?: string;
  partnerId?: string;
  enableSound?: boolean;
  enabled?: boolean;
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
    enabled = true,
    onNotification,
    onTransaction,
    onAdminAlert,
  } = options;

  const listenerId = useId();
  const [, setAuthTick] = useState(0);

  // Re-evaluate on auth state changes (login, logout, switch account)
  useEffect(() => {
    const handleAuthChange = () => {
      setAuthTick((t) => t + 1);
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

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

  // Resolve effective entity IDs from authStore if not explicitly provided
  const effectiveMemberId =
    memberId ||
    (role === "user" && typeof window !== "undefined"
      ? authStore.getCurrentUser()?.id
      : undefined);

  const effectivePartnerId =
    partnerId ||
    ((role === "partner" || role === "partner_staff") && typeof window !== "undefined"
      ? authStore.getCurrentPartner()?.id
      : undefined);

  useEffect(() => {
    if (!enabled) return;

    const listener: ListenerCallbacks = {
      id: listenerId,
      get enableSound() {
        return callbacksRef.current.enableSound;
      },
      onNotification: (payload) => callbacksRef.current.onNotification?.(payload),
      onTransaction: (payload) => callbacksRef.current.onTransaction?.(payload),
      onAdminAlert: (payload) => callbacksRef.current.onAdminAlert?.(payload),
    };

    return subscribeToRealtimeHub(listener, {
      role,
      memberId: effectiveMemberId,
      partnerId: effectivePartnerId,
    });
  }, [listenerId, role, effectiveMemberId, effectivePartnerId, enabled]);
}
