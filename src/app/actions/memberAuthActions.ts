"use server";

import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { Member, AdminRole } from "@/services/db";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { setSessionUser, clearSessionUser } from "@/lib/session";
import { sendOtpEmail } from "@/lib/mail";
import { logger } from "@/lib/logger";
import { telemetry } from "@/lib/telemetry";
import {
  checkRateLimit,
  resetRateLimit,
  getClientIp,
  RATE_LIMIT_RULES,
} from "@/lib/rateLimit";
import {
  getPendingRegistration,
  updatePendingRegistrationAttempts,
  updatePendingRegistrationOtp,
  clearPendingRegistration,
} from "@/lib/pendingRegistration";
import { SITE_URL } from "@/lib/siteConfig";
import { updateTag } from "next/cache";

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
    const ip = await getClientIp();
    const cleanId = identifier.trim().toLowerCase();

    // 1. IP-level rate limiting (15 attempts / 10 mins)
    const ipLimit = checkRateLimit(
      `login_ip:${ip}`,
      RATE_LIMIT_RULES.LOGIN_PER_IP.limit,
      RATE_LIMIT_RULES.LOGIN_PER_IP.windowMs
    );
    if (!ipLimit.success) {
      return { success: false, error: "RATE_LIMITED", message: ipLimit.message };
    }

    // 2. Account-level rate limiting (5 attempts / 10 mins)
    const idLimit = checkRateLimit(
      `login_id:${cleanId}`,
      RATE_LIMIT_RULES.LOGIN_PER_IDENTIFIER.limit,
      RATE_LIMIT_RULES.LOGIN_PER_IDENTIFIER.windowMs
    );
    if (!idLimit.success) {
      return { success: false, error: "RATE_LIMITED", message: idLimit.message };
    }

    const isEmail = identifier.includes("@");
    let m = isEmail
      ? await prisma.member.findUnique({ where: { email: identifier } })
      : await prisma.member.findUnique({ where: { phone: identifier } });

    if (!m && !isEmail) {
      m = await prisma.member.findUnique({ where: { id: identifier } });
    }

    if (!m) {
      const adminExists = await prisma.adminUser.findFirst({
        where: {
          OR: [
            { email: cleanId },
            { phone: identifier.trim() },
            { id: identifier.trim() },
          ],
        },
      });
      if (adminExists) {
        return {
          success: false,
          error: "ADMIN_ACCOUNT",
          message: "এটি একটি এডমিন অ্যাকাউন্ট। এডমিন লগইন করতে /login/admin এ যান।",
        };
      }
      return { success: false, error: "INVALID_CREDENTIALS", message: "মেম্বারশিপ আইডি, ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়।" };
    }

    const isValid = verifyPassword(passwordInput, m.password);
    if (!isValid) {
      return { success: false, error: "INVALID_CREDENTIALS", message: "মেম্বারশিপ আইডি, ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়।" };
    }

    resetRateLimit(`login_id:${cleanId}`);

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
    const ip = await getClientIp();
    const normalizedIdentifier = identifier.trim().toLowerCase();

    // 1. IP-level rate limiting for admin login
    const ipLimit = checkRateLimit(
      `admin_login_ip:${ip}`,
      RATE_LIMIT_RULES.ADMIN_LOGIN_PER_IP.limit,
      RATE_LIMIT_RULES.ADMIN_LOGIN_PER_IP.windowMs
    );
    if (!ipLimit.success) {
      logger.warn(`Admin login rate limit exceeded for IP: ${ip}`);
      return null;
    }

    // 2. Account-level rate limiting for admin login
    const idLimit = checkRateLimit(
      `admin_login_id:${normalizedIdentifier}`,
      RATE_LIMIT_RULES.ADMIN_LOGIN_PER_IDENTIFIER.limit,
      RATE_LIMIT_RULES.ADMIN_LOGIN_PER_IDENTIFIER.windowMs
    );
    if (!idLimit.success) {
      logger.warn(`Admin login rate limit exceeded for identifier: ${normalizedIdentifier}`);
      return null;
    }

    const isEmail = identifier.includes("@");

    // 1. Search AdminUser table first
    let adminUser = isEmail
      ? await prisma.adminUser.findUnique({ where: { email: normalizedIdentifier } })
      : await prisma.adminUser.findUnique({ where: { phone: identifier.trim() } });

    if (!adminUser && !isEmail) {
      adminUser = await prisma.adminUser.findUnique({ where: { id: identifier.trim() } });
    }

    // 2. Auto-seed initial root super_admin if admin_users table is empty and credentials match existing admin
    if (!adminUser) {
      const totalAdminUsers = await prisma.adminUser.count();
      if (totalAdminUsers === 0 && (normalizedIdentifier === ADMIN_EMAIL.toLowerCase() || identifier.trim() === "01711112222")) {
        const existingMember = await prisma.member.findFirst({ where: { email: ADMIN_EMAIL } });
        const isValid = existingMember
          ? verifyPassword(passwordInput, existingMember.password)
          : passwordInput === "admin123" || passwordInput === "123456";

        if (isValid) {
          adminUser = await prisma.adminUser.create({
            data: {
              id: "admin_root",
              name: existingMember?.name || "Super Admin",
              email: ADMIN_EMAIL,
              phone: existingMember?.phone || "01711112222",
              password: existingMember ? existingMember.password : hashPassword(passwordInput),
              role: "super_admin",
              isActive: true,
              lastLoginAt: new Date(),
            },
          });
        }
      }
    }

    if (!adminUser || !adminUser.isActive) return null;

    const isValid = verifyPassword(passwordInput, adminUser.password);
    if (!isValid) return null;

    resetRateLimit(`admin_login_id:${normalizedIdentifier}`);

    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: { lastLoginAt: new Date() },
    });

    await setSessionUser(adminUser.id, "admin", {
      adminRole: adminUser.role as AdminRole,
      adminName: adminUser.name,
      adminEmail: adminUser.email,
    });

    const nowStr = formatDate(new Date());
    return {
      id: adminUser.id,
      name: adminUser.name,
      phone: adminUser.phone || "",
      email: adminUser.email,
      tier: "founding",
      status: "active",
      joinedDate: nowStr,
      expiryDate: "2099-12-31",
      totalSaved: 0,
      emailVerified: true,
      role: "admin",
      adminRole: adminUser.role as AdminRole,
    } as Member;
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
    const ip = await getClientIp();
    const cleanEmail = email?.trim().toLowerCase() || "";
    const cleanCode = code?.trim() || "";

    const rateLimit = checkRateLimit(
      `verify_otp:${ip}:${cleanEmail}`,
      RATE_LIMIT_RULES.OTP_VERIFY_PER_IP_ACCOUNT.limit,
      RATE_LIMIT_RULES.OTP_VERIFY_PER_IP_ACCOUNT.windowMs
    );
    if (!rateLimit.success) {
      return { success: false, message: rateLimit.message };
    }

    // 1. Primary Flow: Check active pending registration from HttpOnly cookie
    const pending = await getPendingRegistration();
    if (pending && pending.email.toLowerCase() === cleanEmail) {
      if (pending.attempts >= MAX_OTP_ATTEMPTS) {
        telemetry.captureEvent("otp_verification_failed", { email: cleanEmail, attempts: pending.attempts, reason: "max_attempts_exceeded" }, "warn", { route: "verifyEmailOtpAction" });
        return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
      }

      if (Date.now() > new Date(pending.expiresAt).getTime()) {
        telemetry.captureEvent("otp_verification_failed", { email: cleanEmail, reason: "otp_expired" }, "warn", { route: "verifyEmailOtpAction" });
        return { success: false, message: "ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন কোড পাঠান বা আবার রেজিস্ট্রেশন করুন।" };
      }

      if (pending.otpCode !== cleanCode) {
        const newAttempts = pending.attempts + 1;
        await updatePendingRegistrationAttempts(pending, newAttempts);
        const remaining = MAX_OTP_ATTEMPTS - newAttempts;
        if (remaining <= 0) {
          return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
        }
        return { success: false, message: `ভুল ওটিপি কোড। আর ${remaining}টি সুযোগ বাকি।` };
      }

      // OTP MATCHED! Insert Member record into Database
      const year = new Date().getFullYear();
      const rand = crypto.randomUUID().slice(0, 8).toUpperCase();
      const newId = `HC-${year}-${rand}`;
      const joined = new Date();
      const expiry = new Date();
      expiry.setFullYear(joined.getFullYear() + 1);

      const nextStatus = pending.tier === "founding" ? "active" : "inactive";

      const createdMember = await prisma.member.create({
        data: {
          id: newId,
          name: pending.name,
          phone: pending.phone,
          email: pending.email,
          password: pending.hashedPassword,
          tier: pending.tier,
          status: nextStatus,
          joinedDate: joined,
          expiryDate: expiry,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${SITE_URL}/verify/${newId}`)}`,
          totalSaved: 0,
          address: pending.address || null,
          birthDate: pending.birthDate ? new Date(pending.birthDate) : null,
          profession: pending.profession || null,
          profilePictureUrl: pending.profilePictureUrl || null,
          emailVerified: true,
          verificationCode: null,
          verificationCodeCreatedAt: null,
        },
      });

      await clearPendingRegistration();
      updateTag("admin-stats");

      const safeMember = stripSensitive({
        ...createdMember,
        email: createdMember.email || undefined,
        joinedDate: formatDate(createdMember.joinedDate),
        expiryDate: formatDate(createdMember.expiryDate),
        address: createdMember.address || undefined,
        birthDate: createdMember.birthDate ? formatDate(createdMember.birthDate) : undefined,
        profession: createdMember.profession || undefined,
        profilePictureUrl: createdMember.profilePictureUrl || undefined,
      } as Member);

      await setSessionUser(safeMember.id, "user");
      const requiresPayment = createdMember.tier === "premium" && createdMember.status === "inactive";

      return { success: true, member: safeMember, requiresPayment };
    }

    // 2. Fallback for legacy already-in-DB unverified members
    const member = await prisma.member.findFirst({ where: { email } });
    if (!member) {
      return { success: false, message: "ভেরিফিকেশন সেশন পাওয়া যায়নি বা মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার রেজিস্ট্রেশন করুন।" };
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
      telemetry.captureEvent("otp_verification_failed", { email: cleanEmail, memberId: member.id, attempts, reason: "max_attempts_exceeded" }, "warn", { userId: member.id, route: "verifyEmailOtpAction" });
      return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    const fifteenMinutes = 15 * 60 * 1000;
    if (Date.now() - new Date(member.verificationCodeCreatedAt).getTime() > fifteenMinutes) {
      telemetry.captureEvent("otp_verification_failed", { email: cleanEmail, memberId: member.id, reason: "otp_expired" }, "warn", { userId: member.id, route: "verifyEmailOtpAction" });
      return { success: false, message: "ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    if (storedCode !== cleanCode) {
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
    const ip = await getClientIp();
    const cleanEmail = email?.trim().toLowerCase() || "";

    const rateLimit = checkRateLimit(
      `resend_otp:${ip}:${cleanEmail}`,
      RATE_LIMIT_RULES.OTP_RESEND_PER_IP_ACCOUNT.limit,
      RATE_LIMIT_RULES.OTP_RESEND_PER_IP_ACCOUNT.windowMs
    );
    if (!rateLimit.success) {
      return { success: false, message: rateLimit.message };
    }

    // 1. Primary: Check pending registration cookie
    const pending = await getPendingRegistration();
    if (pending && pending.email.toLowerCase() === cleanEmail) {
      const code = randomInt(100000, 1000000).toString();
      await updatePendingRegistrationOtp(pending, code);
      const sent = await sendOtpEmail(pending.email, code, pending.name);
      if (!sent) {
        logger.error(`[RESEND OTP] Email send failed for pending ${pending.email}`);
        telemetry.captureEvent("otp_delivery_failed", { email: pending.email, flow: "resend_verification", tier: pending.tier }, "error", { route: "resendVerificationCodeAction", action: "resend_otp" });
        return { success: false, message: "ওটিপি কোড পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" };
      }
      return { success: true, message: "নতুন ওটিপি কোড পাঠানো হয়েছে!" };
    }

    // 2. Fallback for legacy DB member
    const member = await prisma.member.findFirst({ where: { email } });
    if (!member) {
      return { success: false, message: "ভেরিফিকেশন সেশন পাওয়া যায়নি বা মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার রেজিস্ট্রেশন করুন।" };
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
        telemetry.captureEvent("otp_delivery_failed", { email: member.email, memberId: member.id, flow: "resend_verification", tier: member.tier }, "error", { userId: member.id, route: "resendVerificationCodeAction", action: "resend_otp" });
        return { success: false, message: "ওটিপি কোড পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" };
      }
    }
    return { success: true, message: "নতুন ওটিপি কোড পাঠানো হয়েছে!" };
  } catch (error) {
    logger.error("Error in resendVerificationCodeAction:", error);
    return { success: false, message: "কোড পুনরায় পাঠাতে সমস্যা হয়েছে।" };
  }
}

import {
  requestPasswordResetAction as _requestPasswordResetAction,
  resetPasswordAction as _resetPasswordAction,
} from "./memberPasswordResetActions";

export async function requestPasswordResetAction(...args: Parameters<typeof _requestPasswordResetAction>) {
  return _requestPasswordResetAction(...args);
}

export async function resetPasswordAction(...args: Parameters<typeof _resetPasswordAction>) {
  return _resetPasswordAction(...args);
}
