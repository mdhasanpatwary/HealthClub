"use client";

import { useEffect, useRef, useId, useState } from "react";
import { authStore } from "@/services/authStore";
import {
  subscribeToRealtimeHub,
  isSubscriptionAuthenticated,
  isRealtimeConnected,
  type ListenerCallbacks,
} from "@/lib/realtimeHub";
import type {
  RealtimeMemberNotificationPayload,
  RealtimeTransactionPayload,
  RealtimeAdminAlertPayload,
} from "@/lib/realtimeEmitter";

export { isSubscriptionAuthenticated, isRealtimeConnected };

export interface UseRealtimeOptions {
  role?: "user" | "admin" | "partner" | "partner_staff";
  memberId?: string;
  partnerId?: string;
  enableSound?: boolean;
  enabled?: boolean;
  onNotification?: (payload: RealtimeMemberNotificationPayload) => void;
  onTransaction?: (payload: RealtimeTransactionPayload) => void;
  onAdminAlert?: (payload: RealtimeAdminAlertPayload) => void;
  onConnectionChange?: (isConnected: boolean) => void;
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
    onConnectionChange,
  } = options;

  const listenerId = useId();
  const [, setAuthTick] = useState(0);

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

  const [isConnected, setIsConnected] = useState<boolean>(() =>
    isRealtimeConnected(role, effectiveMemberId, effectivePartnerId)
  );

  // Re-evaluate on auth state changes (login, logout, switch account)
  useEffect(() => {
    const handleAuthChange = () => {
      setAuthTick((t) => t + 1);
      setIsConnected(isRealtimeConnected(role, effectiveMemberId, effectivePartnerId));
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [role, effectiveMemberId, effectivePartnerId]);

  const callbacksRef = useRef({
    onNotification,
    onTransaction,
    onAdminAlert,
    onConnectionChange,
    enableSound,
  });

  useEffect(() => {
    callbacksRef.current = {
      onNotification,
      onTransaction,
      onAdminAlert,
      onConnectionChange,
      enableSound,
    };
  }, [onNotification, onTransaction, onAdminAlert, onConnectionChange, enableSound]);

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
      onConnectionChange: (connected) => {
        setIsConnected(connected);
        callbacksRef.current.onConnectionChange?.(connected);
      },
    };

    const unsubscribe = subscribeToRealtimeHub(listener, {
      role,
      memberId: effectiveMemberId,
      partnerId: effectivePartnerId,
    });

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, [listenerId, role, effectiveMemberId, effectivePartnerId, enabled]);

  return { isConnected: enabled && isConnected };
}
