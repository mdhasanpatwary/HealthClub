import { EventEmitter } from "events";

export interface RealtimeMemberNotificationPayload {
  memberId: string;
  notification: {
    id: string;
    type: string;
    titleBn: string;
    titleEn: string;
    messageBn: string;
    messageEn: string;
    link?: string;
    createdAt: string;
  };
}

export interface RealtimeTransactionPayload {
  partnerId: string;
  memberId: string;
  transaction: {
    id: string;
    amount: number;
    saved: number;
    partnerName: string;
    memberName: string;
    date: string;
  };
}

export interface RealtimeAdminAlertPayload {
  category: "renewal" | "partner_request" | "message" | "transaction" | "member_new" | "review";
  titleBn: string;
  titleEn: string;
  id?: string;
  timestamp?: string;
}

declare global {
  var __hcRealtimeEmitter: EventEmitter | undefined;
}

function getRealtimeEmitter(): EventEmitter {
  if (!globalThis.__hcRealtimeEmitter) {
    const emitter = new EventEmitter();
    emitter.setMaxListeners(200);
    globalThis.__hcRealtimeEmitter = emitter;
  }
  return globalThis.__hcRealtimeEmitter;
}

export const realtimeEmitter = getRealtimeEmitter();

/**
 * Broadcast a new member notification to active listeners.
 */
export function broadcastMemberNotification(payload: RealtimeMemberNotificationPayload): void {
  try {
    realtimeEmitter.emit("member_notification", payload);
  } catch {
    // Graceful silent fallback
  }
}

/**
 * Broadcast a new transaction event to active listeners.
 */
export function broadcastTransaction(payload: RealtimeTransactionPayload): void {
  try {
    realtimeEmitter.emit("transaction", payload);
  } catch {
    // Graceful silent fallback
  }
}

/**
 * Broadcast an administrative event to active listeners.
 */
export function broadcastAdminAlert(payload: RealtimeAdminAlertPayload): void {
  try {
    realtimeEmitter.emit("admin_alert", {
      ...payload,
      timestamp: payload.timestamp || new Date().toISOString(),
    });
  } catch {
    // Graceful silent fallback
  }
}

export interface RealtimeAccountStatusPayload {
  memberId: string;
  status: "deleted" | "deactivated";
}

/**
 * Broadcast an account status event (e.g. deletion, suspension) to force real-time logout.
 */
export function broadcastAccountStatus(payload: RealtimeAccountStatusPayload): void {
  try {
    realtimeEmitter.emit("account_status", payload);
  } catch {
    // Graceful silent fallback
  }
}
