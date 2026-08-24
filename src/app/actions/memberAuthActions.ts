"use server";

import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { Member } from "@/services/db";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { setSessionUser, clearSessionUser } from "@/lib/session";
import { sendOtpEmail, sendPasswordResetEmail } from "@/lib/mail";
import { logger } from "@/lib/logger";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "healthclubfeni@gmail.com";
const MAX_OTP_ATTEMPTS = 5;

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

export async function loginMemberAction(
  identifier: string,
  passwordInput: string
): Promise<{ success: boolean; member?: Member; message?: string; error?: string }> {
  try {
    const isEmail = identifier.includes("@");
    let m = isEmail
      ? await prisma.member.findUnique({ where: { email: identifier } })
      : await prisma.member.findUnique({ where: { phone: identifier } });

    if (!m && !isEmail) {
      m = await prisma.member.findUnique({ where: { id: identifier } });
    }

    if (!m) {
      return { success: false, error: "INVALID_CREDENTIALS", message: "মেম্বারশিপ আইডি, ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়।" };
    }

    const isValid = verifyPassword(passwordInput, m.password);
    if (!isValid) {
      return { success: false, error: "INVALID_CREDENTIALS", message: "মেম্বারশিপ আইডি, ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়।" };
    }

    const safeMember = stripSensitive({
      ...m,
      email: m.email || undefined,
      joinedDate: formatDate(m.joinedDate),
      expiryDate: formatDate(m.expiryDate),
      address: m.address || undefined,
      birthDate: m.birthDate ? formatDate(m.birthDate) : undefined,
      profession: m.profession || undefined,
      profilePictureUrl: m.profilePictureUrl || undefined,
    } as Member);

    if (m.email && !m.emailVerified) {
      return { 
        success: true, 
        error: "PENDING_VERIFICATION",
        message: "আপনার ইমেইল ভেরিফাই করা হয়নি। অনুগ্রহ করে ইমেইল ভেরিফিকেশন সম্পন্ন করুন।",
        member: safeMember,
      };
    }

    await setSessionUser(safeMember.id, "user");

    return { success: true, member: safeMember };
  } catch (error) {
    logger.error("Error in loginMemberAction:", error);
    return { success: false, error: "SERVER_ERROR", message: "লগইন করতে সমস্যা হয়েছে।" };
  }
}

export async function loginAdminAction(identifier: string, passwordInput: string): Promise<Member | null> {
  try {
    const isEmail = identifier.includes("@");
    let m = isEmail
      ? await prisma.member.findUnique({ where: { email: identifier } })
      : await prisma.member.findUnique({ where: { phone: identifier } });

    if (!m && !isEmail) {
      m = await prisma.member.findUnique({ where: { id: identifier } });
    }

    if (!m || m.email !== ADMIN_EMAIL) return null;

    const isValid = verifyPassword(passwordInput, m.password);
    if (!isValid) return null;

    const safeMember = stripSensitive({
      ...m,
      email: m.email || undefined,
      joinedDate: formatDate(m.joinedDate),
      expiryDate: formatDate(m.expiryDate),
      address: m.address || undefined,
      birthDate: m.birthDate ? formatDate(m.birthDate) : undefined,
      profession: m.profession || undefined,
      profilePictureUrl: m.profilePictureUrl || undefined,
    } as Member);

    await setSessionUser(safeMember.id, "admin");
    return safeMember;
  } catch (error) {
    logger.error("Error in loginAdminAction:", error);
    return null;
  }
}

export async function logoutUserAction(): Promise<boolean> {
  try {
    await clearSessionUser();
    return true;
  } catch (error) {
    logger.error("Error in logoutUserAction:", error);
    return false;
  }
}

export const logoutMemberAction = logoutUserAction;

export async function verifyEmailOtpAction(
  email: string,
  code: string
): Promise<{ success: boolean; member?: Member; message?: string; requiresPayment?: boolean }> {
  try {
    const member = await prisma.member.findFirst({
      where: { email },
    });

    if (!member) {
      return { success: false, message: "মেম্বার অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।" };
    }

    if (!member.verificationCode || !member.verificationCodeCreatedAt) {
      return { success: false, message: "ভেরিফিকেশন অনুরোধ পাওয়া যায়নি বা কোড ইতিমধ্যে ব্যবহৃত হয়েছে।" };
    }

    let storedCode = member.verificationCode;
    let attempts = 0;
    const attemptMatch = storedCode.match(/^attempts:(\d+):(.+)$/);
    if (attemptMatch) {
      attempts = parseInt(attemptMatch[1], 10);
      storedCode = attemptMatch[2];
    }

    if (attempts >= MAX_OTP_ATTEMPTS) {
      return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    const fifteenMinutes = 15 * 60 * 1000;
    if (Date.now() - new Date(member.verificationCodeCreatedAt).getTime() > fifteenMinutes) {
      return { success: false, message: "ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    if (storedCode !== code) {
      const newAttempts = attempts + 1;
      await prisma.member.update({
        where: { id: member.id },
        data: { verificationCode: `attempts:${newAttempts}:${storedCode}` },
      });
      const remaining = MAX_OTP_ATTEMPTS - newAttempts;
      if (remaining <= 0) {
        return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
      }
      return { success: false, message: `ভুল ওটিপি কোড। আর ${remaining}টি সুযোগ বাকি।` };
    }

    const nextStatus = member.tier === "founding" ? "active" : member.status;
    const updated = await prisma.member.update({
      where: { id: member.id },
      data: {
        status: nextStatus,
        emailVerified: true,
        verificationCode: null,
        verificationCodeCreatedAt: null,
      },
    });

    const safeMember = stripSensitive({
      ...updated,
      email: updated.email || undefined,
      joinedDate: formatDate(updated.joinedDate),
      expiryDate: formatDate(updated.expiryDate),
      address: updated.address || undefined,
      birthDate: updated.birthDate ? formatDate(updated.birthDate) : undefined,
      profession: updated.profession || undefined,
      profilePictureUrl: updated.profilePictureUrl || undefined,
    } as Member);

    await setSessionUser(safeMember.id, "user");

    const requiresPayment = updated.tier === "premium" && updated.status === "inactive" && !updated.bkashTxnId;

    return { success: true, member: safeMember, requiresPayment };
  } catch (error) {
    logger.error("Error in verifyEmailOtpAction:", error);
    return { success: false, message: "ইমেইল ভেরিফাই করতে সমস্যা হয়েছে।" };
  }
}

export async function resendVerificationCodeAction(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const member = await prisma.member.findFirst({
      where: { email },
    });

    if (!member) {
      return { success: false, message: "মেম্বার খুঁজে পাওয়া যায়নি।" };
    }

    const code = randomInt(100000, 1000000).toString();
    await prisma.member.update({
      where: { id: member.id },
      data: {
        verificationCode: code,
        verificationCodeCreatedAt: new Date(),
      },
    });

    if (member.email) {
      const sent = await sendOtpEmail(member.email, code, member.name);
      if (!sent) {
        logger.error(`[RESEND OTP] Email send failed for ${member.email}`);
        return { success: false, message: "ওটিপি কোড পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" };
      }
    }
    return { success: true, message: "নতুন ওটিপি কোড পাঠানো হয়েছে!" };
  } catch (error) {
    logger.error("Error in resendVerificationCodeAction:", error);
    return { success: false, message: "কোড পুনরায় পাঠাতে সমস্যা হয়েছে।" };
  }
}

export async function requestPasswordResetAction(email: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!email) {
      return { success: false, message: "অনুগ্রহ করে ইমেইল অ্যাড্রেসটি দিন।" };
    }

    const member = await prisma.member.findFirst({
      where: { email },
    });

    if (!member) {
      return { success: true, message: "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেট ওটিপি কোড পাঠানো হয়েছে।" };
    }

    const otp = randomInt(100000, 1000000).toString();
    await prisma.member.update({
      where: { id: member.id },
      data: {
        verificationCode: otp,
        verificationCodeCreatedAt: new Date(),
      },
    });

    const sent = await sendPasswordResetEmail(member.email || "", otp, member.name);
    if (!sent) {
      logger.error(`[PASSWORD RESET] Email send failed for ${email}`);
      return { success: false, message: "পাসওয়ার্ড রিসেট ওটিপি পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" };
    }

    return { success: true, message: "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেট ওটিপি কোড পাঠানো হয়েছে।" };
  } catch (error) {
    logger.error("Error in requestPasswordResetAction:", error);
    return { success: false, message: "পাসওয়ার্ড রিসেট অনুরোধ প্রক্রিয়া করতে সমস্যা হয়েছে।" };
  }
}

export async function resetPasswordAction(
  email: string,
  code: string,
  rawNewPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!email || !code || !rawNewPassword) {
      return { success: false, message: "সব তথ্য প্রদান করুন।" };
    }

    const member = await prisma.member.findFirst({
      where: { email },
    });

    if (!member) {
      return { success: false, message: "মেম্বার অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।" };
    }

    if (!member.verificationCode || !member.verificationCodeCreatedAt) {
      return { success: false, message: "রিসেট অনুরোধ পাওয়া যায়নি বা কোড ইতিমধ্যে ব্যবহৃত হয়েছে।" };
    }

    let storedCode = member.verificationCode;
    let attempts = 0;
    const attemptMatch = storedCode.match(/^attempts:(\d+):(.+)$/);
    if (attemptMatch) {
      attempts = parseInt(attemptMatch[1], 10);
      storedCode = attemptMatch[2];
    }

    if (attempts >= MAX_OTP_ATTEMPTS) {
      return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    const fifteenMinutes = 15 * 60 * 1000;
    if (Date.now() - new Date(member.verificationCodeCreatedAt).getTime() > fifteenMinutes) {
      return { success: false, message: "ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে (১৫ মিনিট পার হয়েছে)। অনুগ্রহ করে আবার নতুন কোড পাঠান।" };
    }

    if (storedCode !== code) {
      const newAttempts = attempts + 1;
      await prisma.member.update({
        where: { id: member.id },
        data: { verificationCode: `attempts:${newAttempts}:${storedCode}` },
      });
      const remaining = MAX_OTP_ATTEMPTS - newAttempts;
      if (remaining <= 0) {
        return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
      }
      return { success: false, message: `ভুল ওটিপি কোড। আর ${remaining}টি সুযোগ বাকি।` };
    }

    const hashedPassword = hashPassword(rawNewPassword);
    await prisma.member.update({
      where: { id: member.id },
      data: {
        password: hashedPassword,
        verificationCode: null,
        verificationCodeCreatedAt: null,
      },
    });

    return { success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!" };
  } catch (error) {
    logger.error("Error in resetPasswordAction:", error);
    return { success: false, message: "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।" };
  }
}
