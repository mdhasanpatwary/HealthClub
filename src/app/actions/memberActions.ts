"use server";

import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { Member, PublicMemberVerification } from "@/services/db";
import { hashPassword } from "@/lib/crypto";
import { getSessionUser, setSessionUser } from "@/lib/session";
import { sendOtpEmail } from "@/lib/mail";
import { logger } from "@/lib/logger";
import { telemetry } from "@/lib/telemetry";
import { SITE_URL } from "@/lib/siteConfig";
import { updateTag } from "next/cache";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_RULES,
} from "@/lib/rateLimit";
import {
  loginMemberAction as _loginMemberAction,
  loginAdminAction as _loginAdminAction,
  logoutUserAction as _logoutUserAction,
  verifyEmailOtpAction as _verifyEmailOtpAction,
  resendVerificationCodeAction as _resendVerificationCodeAction,
  requestPasswordResetAction as _requestPasswordResetAction,
  resetPasswordAction as _resetPasswordAction,
} from "./memberAuthActions";
import {
  getMembersAction as _getMembersAction,
  updateMemberStatusAction as _updateMemberStatusAction,
  updateMemberProfileAction as _updateMemberProfileAction,
} from "./memberAdminActions";

export async function loginMemberAction(...args: Parameters<typeof _loginMemberAction>) { return _loginMemberAction(...args); }
export async function loginAdminAction(...args: Parameters<typeof _loginAdminAction>) { return _loginAdminAction(...args); }
export async function logoutUserAction() { return _logoutUserAction(); }
export async function logoutMemberAction() { return _logoutUserAction(); }
export async function verifyEmailOtpAction(...args: Parameters<typeof _verifyEmailOtpAction>) { return _verifyEmailOtpAction(...args); }
export async function resendVerificationCodeAction(...args: Parameters<typeof _resendVerificationCodeAction>) { return _resendVerificationCodeAction(...args); }
export async function requestPasswordResetAction(...args: Parameters<typeof _requestPasswordResetAction>) { return _requestPasswordResetAction(...args); }
export async function resetPasswordAction(...args: Parameters<typeof _resetPasswordAction>) { return _resetPasswordAction(...args); }
export async function getMembersAction() { return _getMembersAction(); }
export async function updateMemberStatusAction(...args: Parameters<typeof _updateMemberStatusAction>) { return _updateMemberStatusAction(...args); }
export async function updateMemberProfileAction(...args: Parameters<typeof _updateMemberProfileAction>) { return _updateMemberProfileAction(...args); }

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "healthclubfeni@gmail.com";

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function stripSensitive(m: Member): Member {
  const safe = { ...m } as Partial<Member>;
  delete safe.password;
  delete safe.verificationCode;
  return safe as Member;
}

// --- MEMBERS ACTIONS ---

export async function addMemberAction(
  member: Omit<Member, "id" | "status" | "joinedDate" | "expiryDate" | "totalSaved"> & { password?: string }
): Promise<Member | { error: string }> {
  const ip = await getClientIp();
  const rateLimit = checkRateLimit(
    `register:${ip}`,
    RATE_LIMIT_RULES.REGISTRATION_PER_IP.limit,
    RATE_LIMIT_RULES.REGISTRATION_PER_IP.windowMs
  );
  if (!rateLimit.success) {
    return { error: rateLimit.message || "খুব বেশি রেজিস্ট্রেশন অনুরোধ করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।" };
  }

  const existingPhone = await prisma.member.findUnique({
    where: { phone: member.phone },
  });
  if (existingPhone) {
    return { error: "এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।" };
  }

  if (member.email) {
    if (member.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return { error: "এই ইমেইল অ্যাড্রেসটি দিয়ে সাধারণ অ্যাকাউন্ট তৈরি করা যাবে না।" };
    }
    const existingEmail = await prisma.member.findUnique({
      where: { email: member.email },
    });
    if (existingEmail) {
      return { error: "এই ইমেইল অ্যাড্রেসটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।" };
    }
  }

  const year = new Date().getFullYear();
  const rand = crypto.randomUUID().slice(0, 8).toUpperCase();
  const newId = `HC-${year}-${rand}`;
  
  const joined = new Date();
  const expiry = new Date();
  expiry.setFullYear(joined.getFullYear() + 1); // 1-year membership

  const rawPassword = member.password || "123456";
  const hashedPassword = hashPassword(rawPassword);
  const verificationCode = randomInt(100000, 1000000).toString();

  try {
    const m = await prisma.member.create({
      data: {
        id: newId,
        name: member.name,
        phone: member.phone,
        email: member.email || null,
        password: hashedPassword,
        tier: member.tier,
        status: "inactive",
        joinedDate: joined,
        expiryDate: expiry,
        qrCodeUrl: member.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${SITE_URL}/verify/${newId}`)}`,
        totalSaved: 0,
        address: member.address || null,
        birthDate: member.birthDate ? new Date(member.birthDate) : null,
        profession: member.profession || null,
        profilePictureUrl: member.profilePictureUrl || null,
        emailVerified: false,
        verificationCode,
        verificationCodeCreatedAt: new Date(),
      },
    });

    if (member.email) {
      const sent = await sendOtpEmail(member.email, verificationCode, member.name);
      if (!sent) {
        logger.error(`[SIGNUP] OTP email send failed for ${member.email}, member ${newId} created but unverified`);
        telemetry.captureEvent("otp_delivery_failed", { email: member.email, memberId: newId, flow: "signup_verification", tier: member.tier }, "error", { userId: newId, route: "addMemberAction", action: "signup_otp" });
      }
    }

    updateTag("admin-stats");

    return {
      ...m,
      email: m.email || undefined,
      joinedDate: formatDate(m.joinedDate),
      expiryDate: formatDate(m.expiryDate),
      address: m.address || undefined,
      birthDate: m.birthDate ? formatDate(m.birthDate) : undefined,
      profession: m.profession || undefined,
      profilePictureUrl: m.profilePictureUrl || undefined,
    } as Member;
  } catch (error: unknown) {
    logger.error("Error in addMemberAction:", error);
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002") {
      return { error: "এই মোবাইল নম্বর বা ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।" };
    }
    return { error: "রেজিস্ট্রেশন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" };
  }
}




export async function getPublicMemberVerificationAction(
  memberId: string
): Promise<PublicMemberVerification | null> {
  try {
    const m = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        tier: true,
        status: true,
        expiryDate: true,
      },
    });
    if (!m) return null;

    const expiryDate = new Date(m.expiryDate);
    expiryDate.setHours(23, 59, 59, 999);
    const isExpired = expiryDate < new Date();

    return {
      id: m.id,
      name: m.name,
      tier: m.tier,
      status: m.status,
      expiryDate: formatDate(m.expiryDate),
      isExpired,
    };
  } catch (error) {
    logger.error("Error in getPublicMemberVerificationAction:", error);
    return null;
  }
}

export async function getMemberByIdAction(idOrPhone: string): Promise<Member | null> {
  const session = await getSessionUser();
  if (!session) return null;

  try {
    let m = await prisma.member.findUnique({
      where: { id: idOrPhone },
    });

    if (!m) {
      m = await prisma.member.findUnique({
        where: { phone: idOrPhone },
      });
    }

    if (!m && idOrPhone.includes("@")) {
      m = await prisma.member.findUnique({
        where: { email: idOrPhone },
      });
    }

    if (!m) return null;

    if (session.role !== "admin" && session.userId !== m.id) {
      return null;
    }

    return stripSensitive({
      ...m,
      email: m.email || undefined,
      joinedDate: formatDate(m.joinedDate),
      expiryDate: formatDate(m.expiryDate),
      address: m.address || undefined,
      birthDate: m.birthDate ? formatDate(m.birthDate) : undefined,
      profession: m.profession || undefined,
      profilePictureUrl: m.profilePictureUrl || undefined,
    } as Member);
  } catch (error) {
    logger.error("Error in getMemberByIdAction:", error);
    return null;
  }
}


export async function getMemberForPaymentAction(memberId: string): Promise<{
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: string;
  status: string;
  bkashTxnId?: string;
  bkashSender?: string;
} | null> {
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
): Promise<boolean> {
  try {
    const cleanId = memberId.trim();
    const cleanSender = bkashSender.trim();
    const cleanTxnId = bkashTxnId.trim().toUpperCase();

    if (cleanTxnId.length < 6 || cleanTxnId.length > 20) {
      telemetry.captureEvent("payment_submission_invalid", { memberId: cleanId, bkashSender: cleanSender, bkashTxnId: cleanTxnId, reason: "invalid_txn_length" }, "warn", { userId: cleanId, route: "submitBkashPaymentAction" });
      return false;
    }

    const member = await prisma.member.findUnique({
      where: { id: cleanId },
    });

    if (!member) return false;

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
    }

    // Verify permission: session match or pending/inactive member completing payment
    const session = await getSessionUser();
    const isAuthorized =
      session?.role === "admin" ||
      session?.userId === cleanId ||
      member.status === "inactive" ||
      member.status === "pending_approval";

    if (!isAuthorized) return false;

    await prisma.member.update({
      where: { id: cleanId },
      data: {
        bkashSender: cleanSender,
        bkashTxnId: cleanTxnId,
        status: "pending_approval",
      },
    });

    updateTag("admin-stats");

    // Set session user so user stays logged in
    await setSessionUser(cleanId, "user");

    return true;
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === "P2025") return false;
    logger.error("Error in submitBkashPaymentAction:", error);
    return false;
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
      telemetry.captureEvent("payment_renewal_invalid", { memberId: session.userId, reason: "missing_fields" }, "warn", { userId: session.userId, route: "requestRenewalAction" });
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
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

    return { success: true, message: "রিনিউয়াল অনুরোধ সফলভাবে পাঠানো হয়েছে! এডমিন যাচাইয়ের পর অ্যাক্টিভ করা হবে।" };
  } catch (error) {
    logger.error("Error in requestRenewalAction:", error);
    return { success: false, message: "রিনিউয়াল অনুরোধ পাঠাতে সমস্যা হয়েছে।" };
  }
}

export async function verifyMemberForPartnerAction(
  memberId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ success: boolean; member?: any; message?: string; errorKey?: string }> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।", errorKey: "partner.errors.unauthorized" };
  }

  try {
    const data = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        tier: true,
        status: true,
        expiryDate: true,
        totalSaved: true,
        profilePictureUrl: true,
      },
    });

    if (!data) {
      return { success: false, message: "মেম্বারশিপ আইডি পাওয়া যায়নি।", errorKey: "partner.errors.memberNotFound" };
    }

    const expiryDate = new Date(data.expiryDate);
    expiryDate.setHours(23, 59, 59, 999);
    const isExpired = expiryDate < new Date();

    return {
      success: true,
      member: {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email || "",
        tier: data.tier,
        status: data.status,
        expiryDate: formatDate(data.expiryDate),
        totalSaved: data.totalSaved,
        profilePictureUrl: data.profilePictureUrl || "",
        isExpired,
      },
    };
  } catch (error) {
    logger.error("Error in verifyMemberForPartnerAction:", error);
    return { success: false, message: "মেম্বার যাচাই করতে সমস্যা হয়েছে。", errorKey: "common.error.server" };
  }
}
