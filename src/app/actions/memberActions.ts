"use server";

import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { Member, PublicMemberVerification } from "@/services/db";
import { hashPassword } from "@/lib/crypto";
import { getSessionUser } from "@/lib/session";
import { sendOtpEmail } from "@/lib/mail";
import { SITE_URL } from "@/lib/siteConfig";
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

export async function loginMemberAction(
  identifier: string,
  passwordInput: string
) {
  return _loginMemberAction(identifier, passwordInput);
}

export async function loginAdminAction(identifier: string, passwordInput: string) {
  return _loginAdminAction(identifier, passwordInput);
}

export async function logoutUserAction() {
  return _logoutUserAction();
}

export async function logoutMemberAction() {
  return _logoutUserAction();
}

export async function verifyEmailOtpAction(email: string, code: string) {
  return _verifyEmailOtpAction(email, code);
}

export async function resendVerificationCodeAction(email: string) {
  return _resendVerificationCodeAction(email);
}

export async function requestPasswordResetAction(email: string) {
  return _requestPasswordResetAction(email);
}

export async function resetPasswordAction(
  email: string,
  code: string,
  rawNewPassword: string
) {
  return _resetPasswordAction(email, code, rawNewPassword);
}

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
): Promise<Member> {
  const existingPhone = await prisma.member.findUnique({
    where: { phone: member.phone },
  });
  if (existingPhone) {
    throw new Error("এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।");
  }

  if (member.email) {
    if (member.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      throw new Error("এই ইমেইল অ্যাড্রেসটি দিয়ে সাধারণ অ্যাকাউন্ট তৈরি করা যাবে না।");
    }
    const existingEmail = await prisma.member.findUnique({
      where: { email: member.email },
    });
    if (existingEmail) {
      throw new Error("এই ইমেইল অ্যাড্রেসটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।");
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
      sendOtpEmail(member.email, verificationCode, member.name).catch((err) => {
        console.error("Failed to send signup OTP email:", err);
      });
    }

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
    console.error("Error in addMemberAction:", error);
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002") {
      throw new Error("এই মোবাইল নম্বর বা ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।");
    }
    throw error;
  }
}

export async function getMembersAction() {
  return _getMembersAction();
}

export async function updateMemberStatusAction(id: string, status: "active" | "inactive") {
  return _updateMemberStatusAction(id, status);
}

export async function updateMemberProfileAction(
  ...args: Parameters<typeof _updateMemberProfileAction>
) {
  return _updateMemberProfileAction(...args);
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
    console.error("Error in getPublicMemberVerificationAction:", error);
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
    console.error("Error in getMemberByIdAction:", error);
    return null;
  }
}


export async function submitBkashPaymentAction(
  memberId: string,
  bkashSender: string,
  bkashTxnId: string
): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || (session.userId !== memberId && session.role !== "admin")) return false;
  try {
    await prisma.member.update({
      where: { id: memberId },
      data: {
        bkashSender,
        bkashTxnId,
        status: "pending_approval",
      },
    });
    return true;
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === "P2025") return false;
    console.error("Error in submitBkashPaymentAction:", error);
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
    if (!bkashSender || !bkashTxnId) {
      return { success: false, message: "বিকাশ নম্বর এবং ট্রানজেকশন আইডি দিন।" };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      renewalStatus: "pending",
      renewalBkashSender: bkashSender,
      renewalBkashTxnId: bkashTxnId,
    };

    if (profession) {
      updateData.profession = profession;
    }

    await prisma.member.update({
      where: { id: session.userId },
      data: updateData,
    });

    return { success: true, message: "রিনিউয়াল অনুরোধ সফলভাবে পাঠানো হয়েছে! এডমিন যাচাইয়ের পর অ্যাক্টিভ করা হবে।" };
  } catch (error) {
    console.error("Error in requestRenewalAction:", error);
    return { success: false, message: "রিনিউয়াল অনুরোধ পাঠাতে সমস্যা হয়েছে।" };
  }
}

export async function verifyMemberForPartnerAction(
  memberId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ success: boolean; member?: any; message?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
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
      return { success: false, message: "মেম্বারশিপ আইডি পাওয়া যায়নি।" };
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
    console.error("Error in verifyMemberForPartnerAction:", error);
    return { success: false, message: "মেম্বার যাচাই করতে সমস্যা হয়েছে।" };
  }
}
