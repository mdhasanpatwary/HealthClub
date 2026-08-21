"use server";

import { randomInt, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { Partner } from "@/services/db";
import { getSessionUser, setSessionUser } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { sendPasswordResetEmail } from "@/lib/mail";
import { logger } from "@/lib/logger";
import { updateTag } from "next/cache";
import { PaginatedResult } from "@/types/pagination";

const PARTNERS_TAG = "partners";
const MAX_PARTNER_OTP_ATTEMPTS = 5;

export interface PartnerRequest {
  id: string;
  orgName: string;
  category: 'hospital' | 'diagnostic' | 'pharmacy';
  address: string;
  discount: string;
  contactName: string | null;
  phone: string;
  email: string | null;
  status: 'pending' | 'approved' | 'rejected';
}

export interface GetPaginatedPartnerRequestsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  category?: string;
}

export async function getPaginatedPartnerRequestsAction(
  params?: GetPaginatedPartnerRequestsParams
): Promise<PaginatedResult<PartnerRequest>> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return {
      data: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: params?.pageSize || 10,
    };
  }

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim();
  const status = params?.status;
  const category = params?.category;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (status && status !== "all") {
    where.status = status;
  }
  if (category && category !== "all") {
    where.category = category;
  }
  if (search) {
    where.OR = [
      { orgName: { contains: search, mode: "insensitive" } },
      { contactName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [totalItems, data] = await Promise.all([
      prisma.partnerRequest.count({ where }),
      prisma.partnerRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const requests: PartnerRequest[] = data.map((d) => ({
      id: d.id,
      orgName: d.orgName,
      category: d.category as PartnerRequest["category"],
      address: d.address,
      discount: d.discount,
      contactName: d.contactName,
      phone: d.phone,
      email: d.email,
      status: d.status as PartnerRequest["status"],
    }));

    return {
      data: requests,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    logger.error("Error in getPaginatedPartnerRequestsAction:", error);
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize };
  }
}


export async function addPartnerRequestAction(req: Omit<PartnerRequest, "id" | "status">): Promise<PartnerRequest> {
  const id = `req_${crypto.randomUUID()}`;
  try {
    const data = await prisma.partnerRequest.create({
      data: {
        id,
        orgName: req.orgName,
        category: req.category,
        address: req.address,
        discount: req.discount,
        contactName: req.contactName || null,
        phone: req.phone,
        email: req.email || null,
        status: "pending"
      }
    });

    return {
      id: data.id,
      orgName: data.orgName,
      category: data.category as PartnerRequest["category"],
      address: data.address,
      discount: data.discount,
      contactName: data.contactName,
      phone: data.phone,
      email: data.email,
      status: data.status as PartnerRequest["status"]
    };
  } catch (error) {
    logger.error("Error in addPartnerRequestAction:", error);
    throw error;
  }
}

export async function getPartnerRequestsAction(): Promise<PartnerRequest[]> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return [];
  try {
    const data = await prisma.partnerRequest.findMany({
      orderBy: { createdAt: "desc" }
    });

    return data.map((d) => ({
      id: d.id,
      orgName: d.orgName,
      category: d.category as PartnerRequest["category"],
      address: d.address,
      discount: d.discount,
      contactName: d.contactName,
      phone: d.phone,
      email: d.email,
      status: d.status as PartnerRequest["status"]
    }));
  } catch (error) {
    logger.error("Error in getPartnerRequestsAction:", error);
    return [];
  }
}

export async function updatePartnerRequestStatusAction(id: string, status: "approved" | "rejected"): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    logger.warn("Unauthorized attempt to update partner request status");
    return false;
  }

  try {
    if (status === "approved") {
      const partnerId = `p_${crypto.randomUUID()}`;
      const tempPassword = randomBytes(4).toString("hex");
      const defaultPassword = hashPassword(tempPassword);

      await prisma.$transaction(async (tx) => {
        const req = await tx.partnerRequest.update({
          where: { id },
          data: { status: "approved" },
        });

        await tx.partner.create({
          data: {
            id: partnerId,
            name: req.orgName,
            category: req.category,
            address: req.address,
            discount: req.discount,
            phone: req.phone,
            email: req.email || null,
            password: defaultPassword,
            logoText: req.orgName.substring(0, 5),
          },
        });
      });
    } else {
      await prisma.partnerRequest.update({
        where: { id },
        data: { status: "rejected" },
      });
    }

    return true;
  } catch (error) {
    logger.error("Error in updatePartnerRequestStatusAction:", error);
    return false;
  } finally {
    try {
      updateTag(PARTNERS_TAG);
    } catch (err) {
      logger.warn("Failed to revalidate partners cache tag:", err);
    }
  }
}

export async function loginPartnerAction(
  identifier: string,
  password: string
): Promise<{ success: boolean; partner?: Partner; error?: string }> {
  try {
    if (!identifier || !password) {
      return { success: false, error: "মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড দিন।" };
    }

    const data = await prisma.partner.findFirst({
      where: {
        OR: [
          { phone: identifier },
          { email: identifier }
        ]
      }
    });

    if (!data) {
      return { success: false, error: "ভুল মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড।" };
    }

    if (!data.password) {
      return { success: false, error: "আপনার পাসওয়ার্ড সেট করা নেই। দয়া করে অ্যাডমিনের সাথে যোগাযোগ করুন।" };
    }

    const isValid = verifyPassword(password, data.password);
    if (!isValid) {
      return { success: false, error: "ভুল মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড।" };
    }

    await setSessionUser(data.id, "partner");

    return {
      success: true,
      partner: {
        id: data.id,
        name: data.name,
        category: data.category as Partner["category"],
        address: data.address,
        discount: data.discount,
        phone: data.phone,
        logoText: data.logoText,
        mapLink: data.mapLink || undefined,
        imageUrl: data.imageUrl || undefined,
      }
    };
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
      where: { id: session.userId }
    });

    if (!partner) {
      return { success: false, message: "পার্টনার খুঁজে পাওয়া যায়নি।" };
    }

    if (!partner.password) {
      return { success: false, message: "পূর্বে কোনো পাসওয়ার্ড সেট করা নেই। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।" };
    }

    const isValid = verifyPassword(currentPassword, partner.password);
    if (!isValid) {
      return { success: false, message: "বর্তমান পাসওয়ার্ডটি সঠিক নয়।" };
    }

    const hashed = hashPassword(newPassword);
    await prisma.partner.update({
      where: { id: partner.id },
      data: { password: hashed }
    });

    return { success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।" };
  } catch (error) {
    logger.error("Error in changePartnerPasswordAction:", error);
    return { success: false, message: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" };
  }
}

export async function requestPartnerPasswordResetAction(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!email) {
      return { success: false, message: "অনুগ্রহ করে ইমেইল অ্যাড্রেসটি দিন।" };
    }

    const partner = await prisma.partner.findFirst({
      where: { email }
    });

    if (!partner) {
      return { success: true, message: "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেট ওটিপি কোড পাঠানো হয়েছে।" };
    }

    const otp = randomInt(100000, 1000000).toString();
    await prisma.partner.update({
      where: { id: partner.id },
      data: {
        verificationCode: otp,
        verificationCodeCreatedAt: new Date(),
      }
    });

    sendPasswordResetEmail(partner.email || "", otp, partner.name).catch((err) => {
      logger.error("Failed to send partner password reset OTP email:", err);
    });

    return { success: true, message: "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেট ওটিপি কোড পাঠানো হয়েছে।" };
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
    if (!email || !code || !rawNewPassword) {
      return { success: false, message: "সব তথ্য প্রদান করুন।" };
    }

    const partner = await prisma.partner.findFirst({
      where: { email }
    });

    if (!partner) {
      return { success: false, message: "পার্টনার অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।" };
    }

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
      return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    const codeTime = new Date(partner.verificationCodeCreatedAt).getTime();
    const currentTime = new Date().getTime();
    const diffMinutes = (currentTime - codeTime) / (1000 * 60);

    if (diffMinutes > 15) {
      return { success: false, message: "ভেরিফিকেশন কোডের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার চেষ্টা করুন।" };
    }

    if (storedCode !== code) {
      const newAttempts = attempts + 1;
      await prisma.partner.update({
        where: { id: partner.id },
        data: { verificationCode: `attempts:${newAttempts}:${storedCode}` }
      });
      const remaining = MAX_PARTNER_OTP_ATTEMPTS - newAttempts;
      if (remaining <= 0) {
        return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
      }
      return { success: false, message: `ভুল ভেরিফিকেশন কোড। আর ${remaining}টি সুযোগ বাকি।` };
    }

    const hashedPassword = hashPassword(rawNewPassword);

    await prisma.partner.update({
      where: { id: partner.id },
      data: {
        password: hashedPassword,
        verificationCode: null,
        verificationCodeCreatedAt: null
      }
    });

    return { success: true, message: "পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে।" };
  } catch (error) {
    logger.error("Error in resetPartnerPasswordAction:", error);
    return { success: false, message: "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।" };
  }
}
