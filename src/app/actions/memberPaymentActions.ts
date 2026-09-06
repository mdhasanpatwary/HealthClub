"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/client/client";
import { getSessionUser, setSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { telemetry } from "@/lib/telemetry";
import { updateTag } from "next/cache";
import { broadcastAdminAlert } from "@/lib/realtimeEmitter";

export interface MemberPaymentInfo {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: string;
  status: string;
  bkashTxnId?: string;
  bkashSender?: string;
}

export async function getMemberForPaymentAction(memberId: string): Promise<MemberPaymentInfo | null> {
  try {
    const cleanId = memberId.trim();
    if (!cleanId) return null;

    const m = await prisma.member.findUnique({
      where: { id: cleanId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        tier: true,
        status: true,
        bkashTxnId: true,
        bkashSender: true,
      },
    });
    if (!m) return null;

    // Verify session: only admin, the authenticated member themselves, or inactive/pending member loading payment info
    const session = await getSessionUser();
    const isAuthorized =
      (session && (session.role === "admin" || session.userId === cleanId)) ||
      m.status === "inactive" ||
      m.status === "pending_approval";

    if (!isAuthorized) {
      return null;
    }

    return {
      id: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email || undefined,
      tier: m.tier,
      status: m.status,
      bkashTxnId: m.bkashTxnId || undefined,
      bkashSender: m.bkashSender || undefined,
    };
  } catch (error) {
    logger.error("Error in getMemberForPaymentAction:", error);
    return null;
  }
}

export async function submitBkashPaymentAction(
  memberId: string,
  bkashSender: string,
  bkashTxnId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanId = memberId.trim();
    const cleanSender = bkashSender.trim();
    const cleanTxnId = bkashTxnId.trim().toUpperCase();

    if (cleanTxnId.length < 6 || cleanTxnId.length > 20) {
      telemetry.captureEvent(
        "payment_submission_invalid",
        {
          memberId: cleanId,
          bkashSender: cleanSender,
          bkashTxnId: cleanTxnId,
          reason: "invalid_txn_length",
        },
        "warn",
        { userId: cleanId, route: "submitBkashPaymentAction" }
      );
      return {
        success: false,
        error: "অবৈধ ট্রানজেকশন আইডি। ট্রানজেকশন আইডি ৬ থেকে ২০ অক্ষরের হতে হবে।",
      };
    }

    const member = await prisma.member.findUnique({
      where: { id: cleanId },
    });

    if (!member) {
      return {
        success: false,
        error: "সদস্য অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।",
      };
    }

    // Verify session: only admin, the authenticated member themselves, or inactive/pending member completing payment
    const session = await getSessionUser();
    const isAuthorized =
      (session && (session.role === "admin" || session.userId === cleanId)) ||
      member.status === "inactive" ||
      member.status === "pending_approval";

    if (!isAuthorized) {
      telemetry.captureEvent(
        "payment_submission_unauthorized",
        {
          targetMemberId: cleanId,
          callerSessionUserId: session?.userId || "unauthenticated",
          callerRole: session?.role || "none",
        },
        "warn",
        { userId: cleanId, route: "submitBkashPaymentAction" }
      );
      return {
        success: false,
        error: "অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে লগইন করুন।",
      };
    }

    // Check for duplicate bKash transaction IDs already submitted by another member
    const duplicateTxn = await prisma.member.findFirst({
      where: {
        OR: [{ bkashTxnId: cleanTxnId }, { renewalBkashTxnId: cleanTxnId }],
        NOT: { id: cleanId },
      },
      select: { id: true, name: true },
    });

    if (duplicateTxn) {
      telemetry.captureEvent(
        "payment_dispute",
        {
          disputeType: "duplicate_bkash_txn",
          submittedBy: cleanId,
          bkashSender: cleanSender,
          bkashTxnId: cleanTxnId,
          conflictsWithMemberId: duplicateTxn.id,
        },
        "warn",
        { userId: cleanId, route: "submitBkashPaymentAction" }
      );
      return {
        success: false,
        error: "এই বিকাশ ট্রানজেকশন আইডিটি ইতিমধ্যে অন্য একটি অ্যাকাউন্টে ব্যবহার করা হয়েছে।",
      };
    }

    await prisma.member.update({
      where: { id: cleanId },
      data: {
        bkashSender: cleanSender,
        bkashTxnId: cleanTxnId,
        status: "pending_approval",
      },
    });

    updateTag("admin-stats");

    // Maintain member session only if the caller is the member themselves
    // Never overwrite an admin session, and never issue a session to an unauthenticated caller
    if (session?.userId === cleanId && session?.role === "user") {
      await setSessionUser(cleanId, "user");
    }

    return { success: true };
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === "P2025") {
      return { success: false, error: "সদস্য অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।" };
    }
    logger.error("Error in submitBkashPaymentAction:", error);
    return {
      success: false,
      error: "পেমেন্ট তথ্য সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    };
  }
}

export async function requestRenewalAction(
  bkashSender: string,
  bkashTxnId: string,
  profession?: string
): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "user") {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const cleanSender = bkashSender?.trim() || "";
    const cleanTxnId = bkashTxnId?.trim().toUpperCase() || "";

    if (!cleanSender || !cleanTxnId) {
      telemetry.captureEvent(
        "payment_renewal_invalid",
        { memberId: session.userId, reason: "missing_fields" },
        "warn",
        { userId: session.userId, route: "requestRenewalAction" }
      );
      return { success: false, message: "বিকাশ নম্বর এবং ট্রানজেকশন আইডি দিন।" };
    }

    const duplicateTxn = await prisma.member.findFirst({
      where: {
        OR: [{ bkashTxnId: cleanTxnId }, { renewalBkashTxnId: cleanTxnId }],
        NOT: { id: session.userId },
      },
      select: { id: true },
    });

    if (duplicateTxn) {
      telemetry.captureEvent(
        "payment_dispute",
        {
          disputeType: "duplicate_renewal_txn",
          submittedBy: session.userId,
          bkashSender: cleanSender,
          bkashTxnId: cleanTxnId,
          conflictsWithMemberId: duplicateTxn.id,
        },
        "warn",
        { userId: session.userId, route: "requestRenewalAction" }
      );
    }

    const updateData: Prisma.MemberUpdateInput = {
      renewalStatus: "pending",
      renewalBkashSender: cleanSender,
      renewalBkashTxnId: cleanTxnId,
    };

    if (profession) {
      updateData.profession = profession;
    }

    await prisma.member.update({
      where: { id: session.userId },
      data: updateData,
    });

    updateTag("admin-stats");

    broadcastAdminAlert({
      category: "renewal",
      titleBn: "নতুন সদস্য নবায়ন আবেদন জমা পড়েছে",
      titleEn: "New Member Renewal Request Submitted",
      id: session.userId,
    });

    return { success: true, message: "রিনিউয়াল অনুরোধ সফলভাবে পাঠানো হয়েছে! এডমিন যাচাইয়ের পর অ্যাক্টিভ করা হবে।" };
  } catch (error) {
    logger.error("Error in requestRenewalAction:", error);
    return { success: false, message: "রিনিউয়াল অনুরোধ পাঠাতে সমস্যা হয়েছে।" };
  }
}
