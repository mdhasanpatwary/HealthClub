"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/client/client";
import { Partner } from "@/services/db";
import { getSessionUser, setSessionUser } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { logger } from "@/lib/logger";
import { updateTag } from "next/cache";
import { PaginatedResult } from "@/types/pagination";
import { hasAdminPermission } from "@/lib/permissions";
import {
  checkRateLimit,
  resetRateLimit,
  getClientIp,
  RATE_LIMIT_RULES,
} from "@/lib/rateLimit";

const PARTNERS_TAG = "partners";

async function verifyPartnerRequestAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "manage_partner_requests");
}

export interface PartnerRequest {
  id: string;
  orgName: string;
  category: "hospital" | "diagnostic" | "pharmacy";
  address: string;
  discount: string;
  contactName: string | null;
  phone: string;
  email: string | null;
  status: "pending" | "approved" | "rejected";
}

export interface GetPaginatedPartnerRequestsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  category?: string;
}

function toPartner(p: Prisma.PartnerGetPayload<object>): Partner {
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

function toPartnerRequest(d: Prisma.PartnerRequestGetPayload<object>): PartnerRequest {
  return {
    id: d.id,
    orgName: d.orgName,
    category: d.category as PartnerRequest["category"],
    address: d.address,
    discount: d.discount,
    contactName: d.contactName,
    phone: d.phone,
    email: d.email,
    status: d.status as PartnerRequest["status"],
  };
}

export async function getPaginatedPartnerRequestsAction(
  params?: GetPaginatedPartnerRequestsParams
): Promise<PaginatedResult<PartnerRequest>> {
  if (!await verifyPartnerRequestAdmin()) {
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize: params?.pageSize || 10 };
  }

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim();
  const status = params?.status;
  const category = params?.category;

  const where: Prisma.PartnerRequestWhereInput = {};
  if (status && status !== "all") where.status = status;
  if (category && category !== "all") where.category = category;
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

    return {
      data: data.map(toPartnerRequest),
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

export async function addPartnerRequestAction(
  req: Omit<PartnerRequest, "id" | "status">
): Promise<PartnerRequest> {
  const ip = await getClientIp();
  const rateLimit = checkRateLimit(
    `partner_req:${ip}`,
    RATE_LIMIT_RULES.PARTNER_REQUEST_PER_IP.limit,
    RATE_LIMIT_RULES.PARTNER_REQUEST_PER_IP.windowMs
  );
  if (!rateLimit.success) {
    throw new Error(rateLimit.message || "খুব বেশি পার্টনার আবেদন জমা দেওয়ার চেষ্টা করা হয়েছে।");
  }

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
        status: "pending",
      },
    });

    updateTag("admin-stats");

    return toPartnerRequest(data);
  } catch (error) {
    logger.error("Error in addPartnerRequestAction:", error);
    throw error;
  }
}

export async function getPartnerRequestsAction(): Promise<PartnerRequest[]> {
  if (!await verifyPartnerRequestAdmin()) return [];
  try {
    const data = await prisma.partnerRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return data.map(toPartnerRequest);
  } catch (error) {
    logger.error("Error in getPartnerRequestsAction:", error);
    return [];
  }
}

export async function updatePartnerRequestStatusAction(
  id: string,
  status: "approved" | "rejected"
): Promise<boolean> {
  if (!(await verifyPartnerRequestAdmin())) {
    logger.warn("Unauthorized attempt to update partner request status");
    return false;
  }

  try {
    if (status === "approved") {
      const partnerId = `p_${crypto.randomUUID()}`;
      const defaultPassword = hashPassword("123456");

      const success = await prisma.$transaction(async (tx) => {
        // 1. Atomically update only if status is currently "pending"
        const updated = await tx.partnerRequest.updateMany({
          where: { id, status: "pending" },
          data: { status: "approved" },
        });

        if (updated.count === 0) {
          logger.warn(`Partner request ${id} cannot be approved: record not found or status is not pending`);
          return false;
        }

        const req = await tx.partnerRequest.findUnique({
          where: { id },
        });

        if (!req) {
          logger.error(`Partner request ${id} unexpectedly missing after status update`);
          return false;
        }

        const partnerEmail = req.email?.trim().toLowerCase() || null;
        if (partnerEmail) {
          const existingPartner = await tx.partner.findUnique({
            where: { email: partnerEmail },
          });
          if (existingPartner) {
            logger.warn(`Cannot create partner for request ${id}: partner with email ${partnerEmail} already exists`);
            throw new Error("PARTNER_EMAIL_ALREADY_EXISTS");
          }
        }

        await tx.partner.create({
          data: {
            id: partnerId,
            name: req.orgName,
            category: req.category,
            address: req.address,
            discount: req.discount,
            phone: req.phone,
            email: partnerEmail,
            password: defaultPassword,
            logoText: req.orgName.substring(0, 5),
          },
        });

        return true;
      });

      if (!success) {
        return false;
      }
    } else {
      const updated = await prisma.partnerRequest.updateMany({
        where: { id, status: "pending" },
        data: { status: "rejected" },
      });

      if (updated.count === 0) {
        logger.warn(`Partner request ${id} cannot be rejected: record not found or status is not pending`);
        return false;
      }
    }

    return true;
  } catch (error) {
    logger.error("Error in updatePartnerRequestStatusAction:", error);
    return false;
  } finally {
    try {
      updateTag(PARTNERS_TAG);
      updateTag("admin-stats");
    } catch (err) {
      logger.warn("Failed to revalidate partners cache tag:", err);
    }
  }
}

export async function approvePartnerRequestAction(id: string): Promise<boolean> {
  return updatePartnerRequestStatusAction(id, "approved");
}

export async function rejectPartnerRequestAction(id: string): Promise<boolean> {
  return updatePartnerRequestStatusAction(id, "rejected");
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
    const partnerData = await prisma.partner.findFirst({
      where: { OR: [{ phone: cleanIdentifier }, { email: cleanIdentifier }] },
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
      include: { partner: true },
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
    const partner = await prisma.partner.findUnique({ where: { id: session.userId } });
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
    await prisma.partner.update({ where: { id: partner.id }, data: { password: hashed } });
    return { success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।" };
  } catch (error) {
    logger.error("Error in changePartnerPasswordAction:", error);
    return { success: false, message: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" };
  }
}

