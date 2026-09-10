import { getSessionUser } from "@/lib/session";
import {
  realtimeEmitter,
  RealtimeMemberNotificationPayload,
  RealtimeTransactionPayload,
  RealtimeAdminAlertPayload,
  RealtimeAccountStatusPayload,
} from "@/lib/realtimeEmitter";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Server-Sent Events (SSE) Route Handler for real-time notifications,
 * transactions, and administrative alerts.
 */
export async function GET(request: Request) {
  const session = await getSessionUser();

  // If no session exists, allow connection but only send public pings
  const role = session?.role;
  const userId = session?.userId;
  const partnerId = session?.partnerId || (role === "partner" ? userId : undefined);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let isClosed = false;

      const sendEvent = (event: string, data: unknown) => {
        if (isClosed) return;
        try {
          const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch {
          isClosed = true;
        }
      };

      // 1. Initial connection handshake
      sendEvent("connected", {
        authenticated: Boolean(session),
        role: role || "guest",
        timestamp: new Date().toISOString(),
      });

      // 2. Member notification listener
      const handleMemberNotification = (payload: RealtimeMemberNotificationPayload) => {
        if (role === "admin" || (role === "user" && payload.memberId === userId)) {
          sendEvent("notification", payload);
        }
      };

      // 3. Transaction listener
      const handleTransaction = (payload: RealtimeTransactionPayload) => {
        if (
          role === "admin" ||
          (role === "user" && payload.memberId === userId) ||
          ((role === "partner" || role === "partner_staff") &&
            partnerId &&
            payload.partnerId === partnerId)
        ) {
          sendEvent("transaction", payload);
        }
      };

      // 4. Admin alert listener
      const handleAdminAlert = (payload: RealtimeAdminAlertPayload) => {
        if (role === "admin") {
          sendEvent("admin_alert", payload);
        }
      };

      // 5. Account status listener (auto-logout on deletion/deactivation)
      const handleAccountStatus = (payload: RealtimeAccountStatusPayload) => {
        if (role === "admin" || (role === "user" && payload.memberId === userId)) {
          sendEvent("account_status", payload);
        }
      };

      realtimeEmitter.on("member_notification", handleMemberNotification);
      realtimeEmitter.on("transaction", handleTransaction);
      realtimeEmitter.on("admin_alert", handleAdminAlert);
      realtimeEmitter.on("account_status", handleAccountStatus);

      // 6. Periodic keepalive ping (every 25 seconds) to prevent proxy timeouts
      const pingInterval = setInterval(() => {
        sendEvent("ping", { time: Date.now() });
      }, 25000);

      // 7. Cleanup on disconnect
      const cleanup = () => {
        if (isClosed) return;
        isClosed = true;
        clearInterval(pingInterval);
        realtimeEmitter.off("member_notification", handleMemberNotification);
        realtimeEmitter.off("transaction", handleTransaction);
        realtimeEmitter.off("admin_alert", handleAdminAlert);
        realtimeEmitter.off("account_status", handleAccountStatus);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      };

      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering in NGINX
    },
  });
}
