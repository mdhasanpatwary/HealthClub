"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/client/client";
import { getSessionUser } from "@/lib/session";
import { hashPassword } from "@/lib/crypto";
import { logger } from "@/lib/logger";
import { updateTag } from "next/cache";
import { PaginatedResult } from "@/types/pagination";
import { hasAdminPermission } from "@/lib/permissions";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_RULES,
} from "@/lib/rateLimit";
import { broadcastAdminAlert } from "@/lib/realtimeEmitter";
import { generatePartnerSlug, resolveUniquePartnerSlug } from "@/lib/slugify";
import {
  sendPartnerApplicationConfirmationEmail,
  sendPartnerApprovalEmail,
} from "@/lib/mail";

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

const PARTNER_REQUEST_SELECT_FIELDS = {
  id: true,
  orgName: true,
  category: true,
  address: true,
  discount: true,
  contactName: true,
  phone: true,
  email: true,
  status: true,
  createdAt: true,
} as const;

type PrismaPartnerRequestRecord = Prisma.PartnerRequestGetPayload<{
  select: typeof PARTNER_REQUEST_SELECT_FIELDS;
}>;

export interface GetPaginatedPartnerRequestsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  category?: string;
}

function toPartnerRequest(d: PrismaPartnerRequestRecord | Prisma.PartnerRequestGetPayload<object>): PartnerRequest {
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
        select: PARTNER_REQUEST_SELECT_FIELDS,
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
): Promise<{ success: boolean; data?: PartnerRequest; error?: string }> {
  const ip = await getClientIp();
  const rateLimit = checkRateLimit(
    `partner_req:${ip}`,
    RATE_LIMIT_RULES.PARTNER_REQUEST_PER_IP.limit,
    RATE_LIMIT_RULES.PARTNER_REQUEST_PER_IP.windowMs
  );
  if (!rateLimit.success) {
    return {
      success: false,
      error: rateLimit.message || "খুব বেশি পার্টনার আবেদন জমা দেওয়ার চেষ্টা করা হয়েছে।",
    };
  }

  const cleanEmail = req.email?.trim().toLowerCase() || null;
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return {
      success: false,
      error: "অনুগ্রহ করে একটি সঠিক অফিসিয়াল ইমেইল অ্যাড্রেস প্রদান করুন।",
    };
  }

  // Check if a partner already exists with this email or phone
  const existingPartner = await prisma.partner.findFirst({
    where: { OR: [{ email: cleanEmail }, { phone: req.phone.trim() }] },
  });
  if (existingPartner) {
    return {
      success: false,
      error: "এই ইমেইল অথবা মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি পার্টনার অ্যাকাউন্ট নিবন্ধিত রয়েছে।",
    };
  }

  const id = `req_${crypto.randomUUID()}`;
  const partnerId = `p_${crypto.randomUUID()}`;
  const defaultPassword = hashPassword("123456");

  try {
    const partnerSlug = await resolveUniquePartnerSlug(
      prisma,
      generatePartnerSlug(req.orgName)
    );

    const [data] = await prisma.$transaction([
      prisma.partnerRequest.create({
        data: {
          id,
          orgName: req.orgName,
          category: req.category,
          address: req.address,
          discount: req.discount,
          contactName: req.contactName || null,
          phone: req.phone,
          email: cleanEmail,
          status: "pending",
        },
      }),
      prisma.partner.create({
        data: {
          id: partnerId,
          slug: partnerSlug,
          name: req.orgName,
          category: req.category,
          address: req.address,
          discount: req.discount,
          phone: req.phone,
          email: cleanEmail,
          password: defaultPassword,
          logoText: req.orgName.substring(0, 5),
          isPartner: true,
        },
      }),
    ]);

    updateTag("admin-stats");
    updateTag(PARTNERS_TAG);

    broadcastAdminAlert({
      category: "partner_request",
      titleBn: `নতুন পার্টনার আবেদন: ${req.orgName}`,
      titleEn: `New Partner Request: ${req.orgName}`,
      id,
    });

    try {
      await sendPartnerApplicationConfirmationEmail({
        to: cleanEmail,
        orgName: req.orgName,
        category: req.category,
        contactName: req.contactName || undefined,
        phone: req.phone,
        address: req.address,
        discount: req.discount,
        requestId: id,
        initialPassword: "123456",
      });
    } catch (mailError) {
      logger.error("[PARTNER APPLICATION] Failed to send confirmation email:", mailError);
    }

    return { success: true, data: toPartnerRequest(data) };
  } catch (error) {
    logger.error("Error in addPartnerRequestAction:", error);
    return {
      success: false,
      error: "পার্টনার আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    };
  }
}

export async function getPartnerRequestsAction(): Promise<PartnerRequest[]> {
  if (!await verifyPartnerRequestAdmin()) return [];
  try {
    const data = await prisma.partnerRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: PARTNER_REQUEST_SELECT_FIELDS,
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
      let approvedPartnerInfo: { email: string; orgName: string; phone: string } | null = null;

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
        let existingPartner = null;
        if (partnerEmail) {
          existingPartner = await tx.partner.findFirst({
            where: { OR: [{ email: partnerEmail }, { phone: req.phone }] },
          });
        }

        if (!existingPartner) {
          const partnerSlug = await resolveUniquePartnerSlug(
            tx,
            generatePartnerSlug(req.orgName)
          );

          await tx.partner.create({
            data: {
              id: partnerId,
              slug: partnerSlug,
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
        }

        if (partnerEmail) {
          approvedPartnerInfo = { email: partnerEmail, orgName: req.orgName, phone: req.phone };
        }

        return true;
      });

      if (!success) {
        return false;
      }

      if (approvedPartnerInfo) {
        try {
          await sendPartnerApprovalEmail({
            to: (approvedPartnerInfo as { email: string; orgName: string; phone: string }).email,
            orgName: (approvedPartnerInfo as { email: string; orgName: string; phone: string }).orgName,
            phone: (approvedPartnerInfo as { email: string; orgName: string; phone: string }).phone,
          });
        } catch (emailError) {
          logger.error("[PARTNER APPROVAL] Failed to send approval email:", emailError);
        }
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

    try {
      updateTag(PARTNERS_TAG);
      updateTag("admin-stats");
    } catch (err) {
      logger.warn("Failed to revalidate partners cache tag:", err);
    }

    return true;
  } catch (error) {
    logger.error("Error in updatePartnerRequestStatusAction:", error);
    return false;
  }
}

export async function approvePartnerRequestAction(id: string): Promise<boolean> {
  return updatePartnerRequestStatusAction(id, "approved");
}

export async function rejectPartnerRequestAction(id: string): Promise<boolean> {
  return updatePartnerRequestStatusAction(id, "rejected");
}


