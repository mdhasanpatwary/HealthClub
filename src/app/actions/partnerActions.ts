"use server";

import { prisma } from "@/lib/prisma";
import { Partner } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { hashPassword } from "@/lib/crypto";
import { logger } from "@/lib/logger";
import { unstable_cache, updateTag } from "next/cache";
import { PaginatedResult } from "@/types/pagination";
import {
  addPartnerRequestAction as _addPartnerRequestAction,
  getPartnerRequestsAction as _getPartnerRequestsAction,
  getPaginatedPartnerRequestsAction as _getPaginatedPartnerRequestsAction,
  updatePartnerRequestStatusAction as _updatePartnerRequestStatusAction,
  loginPartnerAction as _loginPartnerAction,
  changePartnerPasswordAction as _changePartnerPasswordAction,
  requestPartnerPasswordResetAction as _requestPartnerPasswordResetAction,
  resetPartnerPasswordAction as _resetPartnerPasswordAction,
} from "./partnerRequestActions";
import {
  getPartnerTransactionsAction as _getPartnerTransactionsAction,
  addPartnerTransactionAction as _addPartnerTransactionAction,
} from "./partnerTransactionActions";
import { getPartnerAnalyticsAction as _getPartnerAnalyticsAction } from "./partnerAnalyticsActions";
import {
  getPartnerByIdAction as _getPartnerByIdAction,
  getDoctorsByPartnerIdAction as _getDoctorsByPartnerIdAction,
  getRelatedPartnersAction as _getRelatedPartnersAction,
} from "./partnerProfileQueryActions";

export async function getPartnerByIdAction(id: string) {
  return _getPartnerByIdAction(id);
}

export async function getDoctorsByPartnerIdAction(partnerId: string) {
  return _getDoctorsByPartnerIdAction(partnerId);
}

export async function getRelatedPartnersAction(
  category: string,
  currentId: string,
  limit?: number
) {
  return _getRelatedPartnersAction(category, currentId, limit);
}

export async function addPartnerRequestAction(...args: Parameters<typeof _addPartnerRequestAction>) {
  return _addPartnerRequestAction(...args);
}

export async function getPartnerRequestsAction() {
  return _getPartnerRequestsAction();
}

export async function getPaginatedPartnerRequestsAction(...args: Parameters<typeof _getPaginatedPartnerRequestsAction>) {
  return _getPaginatedPartnerRequestsAction(...args);
}

export async function updatePartnerRequestStatusAction(id: string, status: "approved" | "rejected") {
  return _updatePartnerRequestStatusAction(id, status);
}

export async function loginPartnerAction(identifier: string, password: string) {
  return _loginPartnerAction(identifier, password);
}

export async function changePartnerPasswordAction(currentPassword: string, newPassword: string) {
  return _changePartnerPasswordAction(currentPassword, newPassword);
}

export async function requestPartnerPasswordResetAction(email: string) {
  return _requestPartnerPasswordResetAction(email);
}

export async function resetPartnerPasswordAction(email: string, code: string, rawNewPassword: string) {
  return _resetPartnerPasswordAction(email, code, rawNewPassword);
}

const PARTNERS_TAG = "partners";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatPartner(p: any): Partner {
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
    upazila: p.upazila || "feni-sadar",
    createdAt: p.createdAt
      ? typeof p.createdAt === "string"
        ? p.createdAt
        : p.createdAt.toISOString()
      : undefined,
  };
}

export interface GetPaginatedPartnersAdminParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  upazila?: string;
}

export async function getPaginatedPartnersAdminAction(
  params?: GetPaginatedPartnersAdminParams
): Promise<PaginatedResult<Partner>> {
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
  const category = params?.category;
  const upazila = params?.upazila;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (category && category !== "all") {
    where.category = category;
  }
  if (upazila && upazila !== "all") {
    where.upazila = upazila;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { discount: { contains: search, mode: "insensitive" } },
      { logoText: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [totalItems, data] = await Promise.all([
      prisma.partner.count({ where }),
      prisma.partner.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
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
          upazila: true,
        },
      }),
    ]);

    return {
      data: data.map(formatPartner),
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    logger.error("Error in getPaginatedPartnersAdminAction:", error);
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize };
  }
}

// --- PARTNERS ACTIONS ---

export const getPartnersAction = unstable_cache(
  async (): Promise<Partner[]> => {
    try {
      const data = await prisma.partner.findMany({
        orderBy: { createdAt: "desc" },
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
          upazila: true,
          createdAt: true,
        },
      });

      return data.map(formatPartner);
    } catch (error) {
      logger.error("Error in getPartnersAction:", error);
      return [];
    }
  },
  ["partners-list"],
  { revalidate: 60, tags: [PARTNERS_TAG] }
);

export async function addPartnerAction(partner: Omit<Partner, "id">): Promise<Partner | { error: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return { error: "অননুমোদিত অ্যাক্সেস।" };

  const newPartnerId = `p_${crypto.randomUUID()}`;
  try {
    const p = await prisma.partner.create({
      data: {
        id: newPartnerId,
        name: partner.name,
        category: partner.category,
        address: partner.address,
        discount: partner.discount,
        phone: partner.phone,
        email: partner.email || null,
        password: hashPassword("123456"),
        logoText: partner.logoText,
        mapLink: partner.mapLink || null,
        imageUrl: partner.imageUrl || null,
        emergencyPhone: partner.emergencyPhone || null,
        workingHours: partner.workingHours || null,
        departmentDiscounts: partner.departmentDiscounts || null,
        upazila: partner.upazila || "feni-sadar",
      },
    });

    return formatPartner(p);
  } catch (error) {
    logger.error("Error in addPartnerAction:", error);
    return { error: "পার্টনার যোগ করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(PARTNERS_TAG);
    updateTag("homepage-partners");
  }
}

export async function updatePartnerAction(id: string, partner: Omit<Partner, "id">): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;

  try {
    await prisma.partner.update({
      where: { id },
      data: {
        name: partner.name,
        category: partner.category,
        address: partner.address,
        discount: partner.discount,
        phone: partner.phone,
        email: partner.email || null,
        logoText: partner.logoText,
        mapLink: partner.mapLink || null,
        imageUrl: partner.imageUrl || null,
        emergencyPhone: partner.emergencyPhone || null,
        workingHours: partner.workingHours || null,
        departmentDiscounts: partner.departmentDiscounts || null,
        upazila: partner.upazila || "feni-sadar",
      },
    });
    return true;
  } catch (error) {
    logger.error("Error in updatePartnerAction:", error);
    return false;
  } finally {
    updateTag(PARTNERS_TAG);
    updateTag("homepage-partners");
  }
}

export async function deletePartnerAction(id: string): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;

  try {
    await prisma.partner.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    logger.error("Error in deletePartnerAction:", error);
    return false;
  } finally {
    updateTag(PARTNERS_TAG);
    updateTag("homepage-partners");
  }
}

// --- PARTNER PROFILE ACTIONS (Self Management) ---

export async function getPartnerProfileAction(): Promise<{
  success: boolean;
  partner?: Partner;
  error?: string;
}> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  const partnerId = session.role === "partner_staff" ? session.partnerId || session.userId : session.userId;

  try {
    const data = await prisma.partner.findUnique({
      where: { id: partnerId },
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
        upazila: true,
      },
    });

    if (!data) {
      return { success: false, error: "পার্টনার খুঁজে পাওয়া যায়নি।" };
    }

    return {
      success: true,
      partner: formatPartner(data),
    };
  } catch (error) {
    logger.error("Error in getPartnerProfileAction:", error);
    return { success: false, error: "পার্টনার প্রোফাইল লোড করতে সমস্যা হয়েছে।" };
  }
}

export interface UpdatePartnerProfileInput {
  name: string;
  address: string;
  phone: string;
  discount: string;
  emergencyPhone?: string;
  workingHours?: string;
  logoText?: string;
  mapLink?: string;
  imageUrl?: string;
  departmentDiscounts?: string;
  upazila?: string;
}

export async function updatePartnerProfileAction(
  input: UpdatePartnerProfileInput
): Promise<{ success: boolean; partner?: Partner; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  if (!input.name?.trim() || !input.address?.trim() || !input.phone?.trim() || !input.discount?.trim()) {
    return { success: false, error: "প্রয়োজনীয় ফিল্ডগুলো পূরণ করুন।" };
  }

  try {
    const updated = await prisma.partner.update({
      where: { id: session.userId },
      data: {
        name: input.name.trim(),
        address: input.address.trim(),
        phone: input.phone.trim(),
        discount: input.discount.trim(),
        logoText: input.logoText?.trim() || input.name.trim().slice(0, 15),
        mapLink: input.mapLink?.trim() || null,
        imageUrl: input.imageUrl?.trim() || null,
        emergencyPhone: input.emergencyPhone?.trim() || null,
        workingHours: input.workingHours?.trim() || null,
        departmentDiscounts: input.departmentDiscounts || null,
        ...(input.upazila !== undefined && { upazila: input.upazila || "feni-sadar" }),
      },
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
        upazila: true,
      },
    });

    return {
      success: true,
      partner: formatPartner(updated),
    };
  } catch (error) {
    logger.error("Error in updatePartnerProfileAction:", error);
    return { success: false, error: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(PARTNERS_TAG);
    updateTag("homepage-partners");
  }
}

export async function getPartnerTransactionsAction() {
  return _getPartnerTransactionsAction();
}

export async function addPartnerTransactionAction(
  ...args: Parameters<typeof _addPartnerTransactionAction>
) {
  return _addPartnerTransactionAction(...args);
}

export async function getPartnerAnalyticsAction() {
  return _getPartnerAnalyticsAction();
}

export async function resetPartnerPasswordByAdminAction(
  partnerId: string,
  newPassword?: string
): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  const pass = newPassword && newPassword.trim().length >= 6 ? newPassword.trim() : "123456";

  try {
    const existing = await prisma.partner.findUnique({ where: { id: partnerId } });
    if (!existing) {
      return { success: false, message: "পার্টনার খুঁজে পাওয়া যায়নি।" };
    }

    const hashed = hashPassword(pass);
    await prisma.partner.update({
      where: { id: partnerId },
      data: { password: hashed },
    });

    return {
      success: true,
      message: `পাসওয়ার্ড সফলভাবে '${pass}'-এ রিসেট করা হয়েছে।`,
    };
  } catch (error) {
    logger.error("Error in resetPartnerPasswordByAdminAction:", error);
    return { success: false, message: "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।" };
  }
}
