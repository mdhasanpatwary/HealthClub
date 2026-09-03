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

const MAX_PARTNER_OTP_ATTEMPTS = 5;

export async function requestPartnerPasswordResetAction(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!email) return { success: false, message: "অনুগ্রহ করে ইমেইল অ্যাড্রেসটি দিন।" };

    const ip = await getClientIp();
    const cleanEmail = email.trim().toLowerCase();
    const rateLimit = checkRateLimit(
      `partner_reset_req:${ip}:${cleanEmail}`,
      RATE_LIMIT_RULES.PASSWORD_RESET_REQ.limit,
      RATE_LIMIT_RULES.PASSWORD_RESET_REQ.windowMs
    );
    if (!rateLimit.success) return { success: false, message: rateLimit.message };

    const partner = await prisma.partner.findFirst({
      where: { email: { equals: cleanEmail, mode: "insensitive" } },
    });
    if (!partner) {
      return { success: true, message: "যদি এই ইমেইলটি নিবন্ধিত থাকে, তবে ওটিপি কোড পাঠানো হয়েছে।" };
    }

    const otp = randomInt(100000, 1000000).toString();
    await prisma.partner.update({
      where: { id: partner.id },
      data: { verificationCode: otp, verificationCodeCreatedAt: new Date() },
    });

    const sent = await sendPasswordResetEmail(partner.email || "", otp, partner.name);
    if (!sent) {
      logger.error(`[PARTNER PASSWORD RESET] Email send failed for ${email}`);
      telemetry.captureEvent(
        "otp_delivery_failed",
        { email: cleanEmail, partnerId: partner.id, flow: "partner_password_reset" },
        "error",
        { userId: partner.id, route: "requestPartnerPasswordResetAction", action: "partner_password_reset_otp" }
      );
      return { success: false, message: "পাসওয়ার্ড রিসেট ওটিপি পাঠাতে সমস্যা হয়েছে। কিছুক্ষণ পর চেষ্টা করুন।" };
    }

    return { success: true, message: "যদি এই ইমেইলটি নিবন্ধিত থাকে, তবে ওটিপি কোড পাঠানো হয়েছে।" };
  } catch (error) {
    logger.error("Error in requestPartnerPasswordResetAction:", error);
    return { success: false, message: "পাসওয়ার্ড রিসেট অনুরোধ প্রক্রিয়া করতে সমস্যা হয়েছে।" };
  }
}

export async function resetPartnerPasswordAction(
  email: string,
  code: string,
  rawNewPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!email || !code || !rawNewPassword) return { success: false, message: "সব তথ্য প্রদান করুন।" };

    const ip = await getClientIp();
    const cleanEmail = email.trim().toLowerCase();
    const rateLimit = checkRateLimit(
      `partner_reset_confirm:${ip}:${cleanEmail}`,
      RATE_LIMIT_RULES.PASSWORD_RESET_CONFIRM.limit,
      RATE_LIMIT_RULES.PASSWORD_RESET_CONFIRM.windowMs
    );
    if (!rateLimit.success) return { success: false, message: rateLimit.message };

    const partner = await prisma.partner.findFirst({
      where: { email: { equals: cleanEmail, mode: "insensitive" } },
    });
    if (!partner) return { success: false, message: "পার্টনার অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।" };
    if (!partner.verificationCode || !partner.verificationCodeCreatedAt) {
      return { success: false, message: "রিসেট অনুরোধ পাওয়া যায়নি বা কোড ইতিমধ্যে ব্যবহৃত হয়েছে।" };
    }

    let storedCode = partner.verificationCode;
    let attempts = 0;
    const attemptMatch = storedCode.match(/^attempts:(\d+):(.+)$/);
    if (attemptMatch) {
      attempts = parseInt(attemptMatch[1], 10);
      storedCode = attemptMatch[2];
    }

    if (attempts >= MAX_PARTNER_OTP_ATTEMPTS) {
      telemetry.captureEvent(
        "partner_password_reset_failed",
        { email: cleanEmail, partnerId: partner.id, reason: "max_attempts_exceeded" },
        "warn",
        { userId: partner.id, route: "resetPartnerPasswordAction" }
      );
      return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    const diffMinutes = (Date.now() - new Date(partner.verificationCodeCreatedAt).getTime()) / (1000 * 60);
    if (diffMinutes > 15) {
      telemetry.captureEvent(
        "partner_password_reset_failed",
        { email: cleanEmail, partnerId: partner.id, reason: "otp_expired" },
        "warn",
        { userId: partner.id, route: "resetPartnerPasswordAction" }
      );
      return { success: false, message: "ভেরিফিকেশন কোডের মেয়াদ শেষ হয়ে গেছে। আবার চেষ্টা করুন।" };
    }

    if (storedCode !== code) {
      const newAttempts = attempts + 1;
      await prisma.partner.update({
        where: { id: partner.id },
        data: { verificationCode: `attempts:${newAttempts}:${storedCode}` },
      });
      const remaining = MAX_PARTNER_OTP_ATTEMPTS - newAttempts;
      if (remaining <= 0) return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। নতুন কোড পাঠান।" };
      return { success: false, message: `ভুল ভেরিফিকেশন কোড। আর ${remaining}টি সুযোগ বাকি।` };
    }

    const hashedPassword = hashPassword(rawNewPassword);
    await prisma.partner.update({
      where: { id: partner.id },
      data: { password: hashedPassword, verificationCode: null, verificationCodeCreatedAt: null },
    });

    return { success: true, message: "পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে।" };
  } catch (error) {
    logger.error("Error in resetPartnerPasswordAction:", error);
    return { success: false, message: "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।" };
  }
}
