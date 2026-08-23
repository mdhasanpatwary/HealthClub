"use server";

import { prisma } from "@/lib/prisma";
import { Member } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { PaginatedResult } from "@/types/pagination";
import { createMemberNotification } from "./memberNotificationActions";

// Helper to format Date objects as YYYY-MM-DD in local time (not UTC).
// Using toISOString() would shift the date to UTC, causing off-by-one errors
// for timezones ahead of UTC (e.g., BDT is UTC+6).
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPrismaMember(m: any): Member {
  return {
    id: m.id,
    name: m.name,
    phone: m.phone,
    email: m.email || "",
    tier: m.tier as Member["tier"],
    status: m.status as Member["status"],
    joinedDate: formatDate(m.joinedDate),
    expiryDate: formatDate(m.expiryDate),
    qrCodeUrl: m.qrCodeUrl || undefined,
    totalSaved: m.totalSaved,
    address: m.address || "",
    birthDate: m.birthDate ? formatDate(m.birthDate) : "",
    profession: m.profession || "",
    profilePictureUrl: m.profilePictureUrl || "",
    bkashSender: m.bkashSender || undefined,
    bkashTxnId: m.bkashTxnId || undefined,
    renewalStatus: m.renewalStatus || undefined,
    renewalBkashSender: m.renewalBkashSender || undefined,
    renewalBkashTxnId: m.renewalBkashTxnId || undefined,
  };
}

export interface GetPaginatedMembersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  tier?: string;
}

export async function getPaginatedMembersAction(
  params?: GetPaginatedMembersParams
): Promise<PaginatedResult<Member>> {
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
  const tier = params?.tier;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (status && status !== "all") {
    where.status = status;
  }
  if (tier && tier !== "all") {
    where.tier = tier;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
      { profession: { contains: search, mode: "insensitive" } },
      { id: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [totalItems, data] = await Promise.all([
      prisma.member.count({ where }),
      prisma.member.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          tier: true,
          status: true,
          joinedDate: true,
          expiryDate: true,
          qrCodeUrl: true,
          totalSaved: true,
          address: true,
          birthDate: true,
          profession: true,
          profilePictureUrl: true,
          bkashSender: true,
          bkashTxnId: true,
          renewalStatus: true,
          renewalBkashSender: true,
          renewalBkashTxnId: true,
        },
      }),
    ]);

    const members: Member[] = data.map(mapPrismaMember);

    return {
      data: members,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    logger.error("Error in getPaginatedMembersAction:", error);
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize };
  }
}

export interface GetPaginatedRenewalsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export async function getPaginatedRenewalsAction(
  params?: GetPaginatedRenewalsParams
): Promise<PaginatedResult<Member>> {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (status && status !== "all") {
    where.renewalStatus = status;
  } else {
    // Default to members who have requested renewal
    where.renewalStatus = { in: ["pending", "approved", "rejected"] };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { renewalBkashSender: { contains: search, mode: "insensitive" } },
      { renewalBkashTxnId: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [totalItems, data] = await Promise.all([
      prisma.member.count({ where }),
      prisma.member.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          tier: true,
          status: true,
          joinedDate: true,
          expiryDate: true,
          qrCodeUrl: true,
          totalSaved: true,
          address: true,
          birthDate: true,
          profession: true,
          profilePictureUrl: true,
          bkashSender: true,
          bkashTxnId: true,
          renewalStatus: true,
          renewalBkashSender: true,
          renewalBkashTxnId: true,
        },
      }),
    ]);

    const members: Member[] = data.map(mapPrismaMember);

    return {
      data: members,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    logger.error("Error in getPaginatedRenewalsAction:", error);
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize };
  }
}

export async function getMembersAction(): Promise<Member[]> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return [];
  try {
    // Select only needed columns — excludes password, verificationCode at DB level
    const data = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        tier: true,
        status: true,
        joinedDate: true,
        expiryDate: true,
        qrCodeUrl: true,
        totalSaved: true,
        address: true,
        birthDate: true,
        profession: true,
        profilePictureUrl: true,
        bkashSender: true,
        bkashTxnId: true,
        renewalStatus: true,
        renewalBkashSender: true,
        renewalBkashTxnId: true,
      },
    });

    return data.map(mapPrismaMember);
  } catch (error) {
    logger.error("Error in getMembersAction:", error);
    return [];
  }
}

export async function updateMemberStatusAction(id: string, status: Member["status"]): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  try {
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { status };

    if (status === "active") {
      const now = new Date();
      updateData.joinedDate = now;
      const expiry = new Date(now);
      expiry.setFullYear(now.getFullYear() + 1);
      updateData.expiryDate = expiry;
      updateData.renewalStatus = null;
      updateData.renewalBkashSender = null;
      updateData.renewalBkashTxnId = null;
    }

    await prisma.member.update({
      where: { id },
      data: updateData,
    });
    return true;
  } catch (error) {
    logger.error("Error in updateMemberStatusAction:", error);
    return false;
  }
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "healthclubfeni@gmail.com";

export async function updateMemberProfileAction(
  id: string,
  nameOrUpdates: string | Partial<Pick<Member, "name" | "phone" | "email" | "address" | "birthDate" | "profession" | "profilePictureUrl">>,
  phone?: string,
  email?: string,
  address?: string,
  birthDate?: string,
  profession?: string,
  profilePictureUrl?: string
): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || (session.userId !== id && session.role !== "admin")) return false;

  const updates = typeof nameOrUpdates === "object"
    ? nameOrUpdates
    : { name: nameOrUpdates, phone, email, address, birthDate, profession, profilePictureUrl };

  if (updates.email && updates.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && session.role !== "admin") {
    logger.warn(`[SECURITY] Prevented non-admin user ${id} from claiming ADMIN_EMAIL ${ADMIN_EMAIL}`);
    return false;
  }

  try {
    await prisma.member.update({
      where: { id },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.phone && { phone: updates.phone }),
        ...(updates.email !== undefined && { email: updates.email || null }),
        ...(updates.address !== undefined && { address: updates.address || null }),
        ...(updates.birthDate !== undefined && { birthDate: updates.birthDate ? new Date(updates.birthDate) : null }),
        ...(updates.profession !== undefined && { profession: updates.profession || null }),
        ...(updates.profilePictureUrl !== undefined && { profilePictureUrl: updates.profilePictureUrl || null }),
      },
    });
    return true;
  } catch (error) {
    logger.error("Error in updateMemberProfileAction:", error);
    return false;
  }
}

export async function updateMemberAction(
  id: string,
  member: {
    name: string;
    phone: string;
    email: string;
    tier: Member["tier"];
    address?: string;
    birthDate?: string;
    profession?: string;
    profilePictureUrl?: string;
  }
): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    logger.warn("Unauthorized attempt to update member");
    return false;
  }
  try {
    await prisma.member.update({
      where: { id },
      data: {
        name: member.name,
        phone: member.phone,
        email: member.email || null,
        tier: member.tier,
        address: member.address || null,
        birthDate: member.birthDate ? new Date(member.birthDate) : null,
        profession: member.profession || null,
        profilePictureUrl: member.profilePictureUrl || null,
      },
    });
    return true;
  } catch (error) {
    logger.error("Error in updateMemberAction:", error);
    return false;
  }
}

export async function deleteMemberAction(id: string): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    logger.warn("Unauthorized attempt to delete member");
    return false;
  }
  try {
    await prisma.member.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    logger.error("Error in deleteMemberAction:", error);
    return false;
  }
}

export async function approveMemberRenewalAction(memberId: string): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    logger.warn("Unauthorized attempt to approve renewal");
    return false;
  }

  try {
    // Only fetch the single column needed to compute the new expiry date
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { expiryDate: true },
    });

    if (!member) return false;

    const currentExpiry = new Date(member.expiryDate);
    const baseDate = currentExpiry < new Date() ? new Date() : currentExpiry;
    const newExpiry = new Date(baseDate);
    newExpiry.setFullYear(baseDate.getFullYear() + 1);

    await prisma.member.update({
      where: { id: memberId },
      data: {
        renewalStatus: "none",
        renewalBkashSender: null,
        renewalBkashTxnId: null,
        status: "active",
        expiryDate: newExpiry,
      }
    });

    const expDateBn = newExpiry.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const expDateEn = newExpiry.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    await createMemberNotification({
      memberId,
      type: "renewal_approved",
      titleBn: "মেম্বারশিপ নবায়ন অনুমোদিত হয়েছে",
      titleEn: "Membership Renewal Approved",
      messageBn: `আপনার মেম্বারশিপ সফলভাবে ১ বছরের জন্য নবায়ন করা হয়েছে। নতুন মেয়াদ: ${expDateBn}।`,
      messageEn: `Your membership has been successfully renewed for 1 year. New expiry: ${expDateEn}.`,
      link: "/dashboard",
    });

    return true;
  } catch (error) {
    logger.error("Error in approveMemberRenewalAction:", error);
    return false;
  }
}

export async function rejectMemberRenewalAction(memberId: string): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    logger.warn("Unauthorized attempt to reject renewal");
    return false;
  }

  try {
    await prisma.member.update({
      where: { id: memberId },
      data: {
        renewalStatus: "none",
        renewalBkashSender: null,
        renewalBkashTxnId: null,
      }
    });

    await createMemberNotification({
      memberId,
      type: "renewal_rejected",
      titleBn: "মেম্বারশিপ নবায়ন আবেদন বাতিল হয়েছে",
      titleEn: "Membership Renewal Request Rejected",
      messageBn: "আপনার মেম্বারশিপ নবায়ন আবেদনটি অনুমোদিত হয়নি। অনুগ্রহ করে বিকাশ ট্রানজেকশন তথ্য যাচাই করে পুনরায় আবেদন করুন।",
      messageEn: "Your membership renewal request was not approved. Please verify your payment transaction details and reapply.",
      link: "/dashboard/renew",
    });

    return true;
  } catch (error) {
    logger.error("Error in rejectMemberRenewalAction:", error);
    return false;
  }
}
