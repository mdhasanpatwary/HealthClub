"use server";

import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { Member, PublicMemberVerification } from "@/services/db";
import { hashPassword } from "@/lib/crypto";
import { getSessionUser } from "@/lib/session";
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
  setPendingRegistration,
} from "@/lib/pendingRegistration";
import {
  memberRegistrationSchema,
  adminAddMemberSchema,
} from "@/lib/validations/member";

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
  const session = await getSessionUser();
  const isAdmin = session?.role === "admin";

  if (!isAdmin) {
    const rateLimit = checkRateLimit(
      `register:${ip}`,
      RATE_LIMIT_RULES.REGISTRATION_PER_IP.limit,
      RATE_LIMIT_RULES.REGISTRATION_PER_IP.windowMs
    );
    if (!rateLimit.success) {
      return { error: rateLimit.message || "খুব বেশি রেজিস্ট্রেশন অনুরোধ করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।" };
    }

    const parsed = memberRegistrationSchema.safeParse(member);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "সঠিক তথ্য দিন।" };
    }
  } else {
    const parsed = adminAddMemberSchema.safeParse(member);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || "সঠিক তথ্য দিন।" };
    }
  }

  if (member.email && member.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return { error: "এই ইমেইল অ্যাড্রেসটি দিয়ে সাধারণ অ্যাকাউন্ট তৈরি করা যাবে না।" };
  }

  try {
    const existingMember = await prisma.member.findFirst({
      where: {
        OR: [
          { phone: member.phone },
          ...(member.email ? [{ email: member.email }] : []),
        ],
      },
      select: { phone: true, email: true },
    });

    if (existingMember) {
      if (existingMember.phone === member.phone) {
        return { error: "এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।" };
      }
      if (member.email && existingMember.email?.toLowerCase() === member.email.toLowerCase()) {
        return { error: "এই ইমেইল অ্যাড্রেসটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।" };
      }
    }
  } catch (error: unknown) {
    logger.error("Error checking existing member in addMemberAction:", error);
    return { error: "ডাটাবেজ সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" };
  }

  const rawPassword = member.password || "123456";
  const hashedPassword = hashPassword(rawPassword);
  const verificationCode = randomInt(100000, 1000000).toString();

  // If Admin is adding a member directly, insert into database immediately as verified
  if (isAdmin) {
    const year = new Date().getFullYear();
    const rand = crypto.randomUUID().slice(0, 8).toUpperCase();
    const newId = `HC-${year}-${rand}`;
    const joined = new Date();
    const expiry = new Date();
    expiry.setFullYear(joined.getFullYear() + 1);

    try {
      const m = await prisma.member.create({
        data: {
          id: newId,
          name: member.name,
          phone: member.phone,
          email: member.email || null,
          password: hashedPassword,
          tier: member.tier,
          status: "active",
          joinedDate: joined,
          expiryDate: expiry,
          qrCodeUrl: member.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${SITE_URL}/verify/${newId}`)}`,
          totalSaved: 0,
          address: member.address || null,
          birthDate: member.birthDate ? new Date(member.birthDate) : null,
          profession: member.profession || null,
          profilePictureUrl: member.profilePictureUrl || null,
          emailVerified: true,
        },
      });

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
      logger.error("Error in addMemberAction (admin):", error);
      return { error: "সদস্য যোগ করতে সমস্যা হয়েছে।" };
    }
  }

  // Public User Registration: DO NOT insert into DB yet. Store in secure pending registration cookie and send OTP.
  try {
    if (!member.email) {
      return { error: "ইমেইল অ্যাড্রেস আবশ্যক।" };
    }

    await setPendingRegistration(
      {
        name: member.name,
        phone: member.phone,
        email: member.email,
        hashedPassword,
        tier: member.tier,
        address: member.address,
        birthDate: member.birthDate,
        profession: member.profession,
        profilePictureUrl: member.profilePictureUrl,
      },
      verificationCode
    );

    const sent = await sendOtpEmail(member.email, verificationCode, member.name);
    if (!sent) {
      logger.error(`[SIGNUP] OTP email send failed for ${member.email}`);
      telemetry.captureEvent(
        "otp_delivery_failed",
        { email: member.email, flow: "signup_verification", tier: member.tier },
        "error",
        { route: "addMemberAction", action: "signup_otp" }
      );
    }

    const now = new Date();
    const expiry = new Date();
    expiry.setFullYear(now.getFullYear() + 1);

    return {
      id: "PENDING",
      name: member.name,
      phone: member.phone,
      email: member.email,
      tier: member.tier,
      status: "inactive",
      joinedDate: formatDate(now),
      expiryDate: formatDate(expiry),
      totalSaved: 0,
      emailVerified: false,
    } as Member;
  } catch (error: unknown) {
    logger.error("Error in addMemberAction (public):", error);
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

export interface VerifiedPartnerMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: string;
  status: string;
  expiryDate: string;
  totalSaved: number;
  profilePictureUrl: string;
  isExpired: boolean;
}

export async function verifyMemberForPartnerAction(
  memberId: string
): Promise<{ success: boolean; member?: VerifiedPartnerMember; message?: string; errorKey?: string }> {
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
    return { success: false, message: "মেম্বার যাচাই করতে সমস্যা হয়েছে।", errorKey: "common.error.server" };
  }
}
