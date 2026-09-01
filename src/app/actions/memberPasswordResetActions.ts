"use server";

import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";
import { sendPasswordResetEmail } from "@/lib/mail";
import { logger } from "@/lib/logger";
import { telemetry } from "@/lib/telemetry";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_RULES,
} from "@/lib/rateLimit";

const MAX_OTP_ATTEMPTS = 5;

export async function requestPasswordResetAction(email: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!email) {
      return { success: false, message: "অনুগ্রহ করে ইমেইল অ্যাড্রেসটি দিন।" };
    }

    const ip = await getClientIp();
    const cleanEmail = email.trim().toLowerCase();

    const rateLimit = checkRateLimit(
      `reset_req:${ip}:${cleanEmail}`,
      RATE_LIMIT_RULES.PASSWORD_RESET_REQ.limit,
      RATE_LIMIT_RULES.PASSWORD_RESET_REQ.windowMs
    );
    if (!rateLimit.success) {
      return { success: false, message: rateLimit.message };
    }

    const member = await prisma.member.findFirst({ where: { email } });
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
      telemetry.captureEvent("otp_delivery_failed", { email, memberId: member.id, flow: "password_reset" }, "error", { userId: member.id, route: "requestPasswordResetAction", action: "password_reset_otp" });
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

    const ip = await getClientIp();
    const cleanEmail = email.trim().toLowerCase();

    const rateLimit = checkRateLimit(
      `reset_confirm:${ip}:${cleanEmail}`,
      RATE_LIMIT_RULES.PASSWORD_RESET_CONFIRM.limit,
      RATE_LIMIT_RULES.PASSWORD_RESET_CONFIRM.windowMs
    );
    if (!rateLimit.success) {
      return { success: false, message: rateLimit.message };
    }

    const member = await prisma.member.findFirst({ where: { email } });
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
      telemetry.captureEvent("password_reset_failed", { email: cleanEmail, memberId: member.id, reason: "max_attempts_exceeded" }, "warn", { userId: member.id, route: "resetPasswordAction" });
      return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    const fifteenMinutes = 15 * 60 * 1000;
    if (Date.now() - new Date(member.verificationCodeCreatedAt).getTime() > fifteenMinutes) {
      telemetry.captureEvent("password_reset_failed", { email: cleanEmail, memberId: member.id, reason: "otp_expired" }, "warn", { userId: member.id, route: "resetPasswordAction" });
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
