"use server";

import { prisma } from "@/lib/prisma";
import { Partner } from "@/services/db";
import { getSessionUser, setSessionUser } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { logger } from "@/lib/logger";
import {
  checkRateLimit,
  resetRateLimit,
  getClientIp,
  RATE_LIMIT_RULES,
} from "@/lib/rateLimit";

type PartnerAuthFields = {
  id: string;
  name: string;
  category: string;
  address: string;
  discount: string;
  phone: string;
  email: string | null;
  logoText: string;
  mapLink: string | null;
  imageUrl: string | null;
  emergencyPhone: string | null;
  workingHours: string | null;
  departmentDiscounts: string | null;
  password: string | null;
};

function toPartner(p: PartnerAuthFields): Partner {
  return {
    id: p.id,
    name: p.name,
    category: p.category as Partner["category"],
    address: p.address,
    discount: p.discount,
    phone: p.phone,
    email: p.email || undefined,
    logoText: p.logoText,
    mapLink: p.mapLink || undefined,
    imageUrl: p.imageUrl || undefined,
    emergencyPhone: p.emergencyPhone || undefined,
    workingHours: p.workingHours || undefined,
    departmentDiscounts: p.departmentDiscounts || undefined,
  };
}

export async function loginPartnerAction(
  identifier: string,
  password: string
): Promise<{
  success: boolean;
  partner?: Partner;
  staff?: { id: string; name: string; deskName: string; role: string; username: string };
  error?: string;
}> {
  try {
    const ip = await getClientIp();

    const ipLimit = checkRateLimit(
      `partner_login_ip:${ip}`,
      RATE_LIMIT_RULES.PARTNER_LOGIN_PER_IP.limit,
      RATE_LIMIT_RULES.PARTNER_LOGIN_PER_IP.windowMs
    );
    if (!ipLimit.success) return { success: false, error: ipLimit.message };

    const cleanIdentifier = identifier?.trim();
    if (!cleanIdentifier || !password) {
      return { success: false, error: "মোবাইল নম্বর/ইউজারনেম এবং পাসওয়ার্ড দিন।" };
    }

    const idLimit = checkRateLimit(
      `partner_login_id:${cleanIdentifier.toLowerCase()}`,
      RATE_LIMIT_RULES.PARTNER_LOGIN_PER_IDENTIFIER.limit,
      RATE_LIMIT_RULES.PARTNER_LOGIN_PER_IDENTIFIER.windowMs
    );
    if (!idLimit.success) return { success: false, error: idLimit.message };

    // 1. Try matching primary partner hospital account
    const partnerAuthSelect = {
      id: true,
      name: true,
      category: true,
      address: true,
      discount: true,
      phone: true,
      email: true,
      logoText: true,
      mapLink: true,
      imageUrl: true,
      emergencyPhone: true,
      workingHours: true,
      departmentDiscounts: true,
      password: true,
    } as const;
    const partnerData = await prisma.partner.findFirst({
      where: { OR: [{ phone: cleanIdentifier }, { email: cleanIdentifier }] },
      select: partnerAuthSelect,
    });

    if (partnerData) {
      const isValid = partnerData.password
        ? verifyPassword(password, partnerData.password)
        : password === "123456";

      if (isValid) {
        if (!partnerData.password) {
          try {
            await prisma.partner.update({
              where: { id: partnerData.id },
              data: { password: hashPassword("123456") },
              select: { id: true },
            });
          } catch (e) {
            logger.warn("Failed to auto-persist partner default password:", e);
          }
        }

        resetRateLimit(`partner_login_id:${cleanIdentifier.toLowerCase()}`);
        await setSessionUser(partnerData.id, "partner");
        return { success: true, partner: toPartner(partnerData) };
      }
    }

    // 2. Try matching partner staff account
    const staffData = await prisma.partnerStaff.findFirst({
      where: { OR: [{ username: cleanIdentifier.toLowerCase() }, { phone: cleanIdentifier }] },
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        password: true,
        role: true,
        deskName: true,
        isActive: true,
        partnerId: true,
        updatedAt: true,
        partner: {
          select: {
            id: true,
            name: true,
            category: true,
            address: true,
            discount: true,
            phone: true,
            email: true,
            logoText: true,
            mapLink: true,
            imageUrl: true,
            emergencyPhone: true,
            workingHours: true,
            departmentDiscounts: true,
            password: true,
          },
        },
      },
    });

    if (staffData) {
      if (!staffData.isActive) {
        return {
          success: false,
          error: "এই স্টাফ অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। আপনার হাসপাতাল অ্যাডমিনের সাথে যোগাযোগ করুন।",
        };
      }

      const isValid = verifyPassword(password, staffData.password);
      if (isValid && staffData.partner) {
        resetRateLimit(`partner_login_id:${cleanIdentifier.toLowerCase()}`);
        await setSessionUser(staffData.partnerId, "partner_staff", {
          staffId: staffData.id,
          staffName: staffData.name,
          deskName: staffData.deskName,
          staffRole: (staffData.role as "cashier" | "manager") || "cashier",
          partnerId: staffData.partnerId,
          staffUpdatedAt: staffData.updatedAt.getTime(),
        });

        return {
          success: true,
          partner: toPartner(staffData.partner),
          staff: {
            id: staffData.id,
            name: staffData.name,
            deskName: staffData.deskName,
            role: staffData.role,
            username: staffData.username,
          },
        };
      }
    }

    return { success: false, error: "ভুল ইউজারনেম/মোবাইল নম্বর অথবা পাসওয়ার্ড।" };
  } catch (error) {
    logger.error("Error in loginPartnerAction:", error);
    return { success: false, error: "লগইন করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।" };
  }
}

export async function changePartnerPasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }
  if (!currentPassword || !newPassword) {
    return { success: false, message: "সকল তথ্য প্রদান করুন।" };
  }
  if (newPassword.length < 6) {
    return { success: false, message: "নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।" };
  }

  try {
    const partner = await prisma.partner.findUnique({
      where: { id: session.userId },
      select: { id: true, password: true },
    });
    if (!partner) return { success: false, message: "পার্টনার খুঁজে পাওয়া যায়নি।" };

    const isValid = partner.password
      ? verifyPassword(currentPassword, partner.password)
      : currentPassword === "123456";

    if (!isValid) {
      return {
        success: false,
        message: partner.password
          ? "বর্তমান পাসওয়ার্ডটি সঠিক নয়।"
          : "বর্তমান ডিফল্ট পাসওয়ার্ড (123456) সঠিক নয়।",
      };
    }

    const hashed = hashPassword(newPassword);
    await prisma.partner.update({
      where: { id: partner.id },
      data: { password: hashed },
      select: { id: true },
    });
    return { success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।" };
  } catch (error) {
    logger.error("Error in changePartnerPasswordAction:", error);
    return { success: false, message: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" };
  }
}
