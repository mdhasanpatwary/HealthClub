"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/client/client";
import { Member } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { PaginatedResult } from "@/types/pagination";
import { hasAdminPermission } from "@/lib/permissions";
import { updateTag } from "next/cache";
import { ensureStorageUrl } from "@/services/storageService";
import { broadcastAccountStatus } from "@/lib/realtimeEmitter";

async function verifyMemberAdmin(permission: "manage_members" | "approve_renewals" = "manage_members"): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, permission);
}

import {
  MEMBER_SELECT_FIELDS,
  mapPrismaMember,
} from "@/lib/memberFormat";
import {
  getPaginatedRenewalsAction as _getPaginatedRenewalsAction,
  approveMemberRenewalAction as _approveMemberRenewalAction,
  rejectMemberRenewalAction as _rejectMemberRenewalAction,
} from "./memberRenewalActions";
export type { GetPaginatedRenewalsParams } from "./memberRenewalActions";

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
  if (!await verifyMemberAdmin("manage_members")) {
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

  const where: Prisma.MemberWhereInput = {};
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
        select: MEMBER_SELECT_FIELDS,
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

export async function getPaginatedRenewalsAction(...args: Parameters<typeof _getPaginatedRenewalsAction>) {
  return _getPaginatedRenewalsAction(...args);
}
export async function approveMemberRenewalAction(id: string) {
  return _approveMemberRenewalAction(id);
}
export async function rejectMemberRenewalAction(id: string) {
  return _rejectMemberRenewalAction(id);
}

export async function getMemberByIdOrPhoneAction(identifier: string): Promise<Member | null> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return null;
  const role = session.adminRole || "super_admin";
  if (!hasAdminPermission(role, "manage_members") && !hasAdminPermission(role, "manage_transactions")) {
    return null;
  }

  const trimmed = identifier.trim();
  if (!trimmed) return null;

  try {
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { id: { equals: trimmed, mode: "insensitive" } },
          { phone: { equals: trimmed } },
        ],
      },
      select: MEMBER_SELECT_FIELDS,
    });

    return member ? mapPrismaMember(member) : null;
  } catch (error) {
    logger.error("Error in getMemberByIdOrPhoneAction:", error);
    return null;
  }
}

export async function getMembersAction(): Promise<Member[]> {
  if (!await verifyMemberAdmin("manage_members")) return [];
  try {
    const data = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
      select: MEMBER_SELECT_FIELDS,
    });

    return data.map(mapPrismaMember);
  } catch (error) {
    logger.error("Error in getMembersAction:", error);
    return [];
  }
}

export async function updateMemberStatusAction(id: string, status: Member["status"]): Promise<boolean> {
  if (!await verifyMemberAdmin("manage_members")) return false;
  try {
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) return false;

    const updateData: Prisma.MemberUpdateInput = { status };

    if (status === "active") {
      const now = new Date();
      if (!member.joinedDate || isNaN(new Date(member.joinedDate).getTime())) {
        updateData.joinedDate = now;
      }
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
    if (status !== "active") {
      broadcastAccountStatus({ memberId: id, status: "deactivated" });
    }
    updateTag("admin-stats");
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
        ...(updates.profilePictureUrl !== undefined && { profilePictureUrl: (await ensureStorageUrl(updates.profilePictureUrl, "members", id)) || null }),
      },
    });
    updateTag("admin-stats");
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
  if (!await verifyMemberAdmin("manage_members")) {
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
        profilePictureUrl: (await ensureStorageUrl(member.profilePictureUrl, "members", id)) || null,
      },
    });
    updateTag("admin-stats");
    return true;
  } catch (error) {
    logger.error("Error in updateMemberAction:", error);
    return false;
  }
}

export async function deleteMemberAction(id: string): Promise<boolean> {
  if (!await verifyMemberAdmin("manage_members")) {
    logger.warn("Unauthorized attempt to delete member");
    return false;
  }
  try {
    await prisma.member.delete({
      where: { id },
    });
    broadcastAccountStatus({ memberId: id, status: "deleted" });
    updateTag("admin-stats");
    return true;
  } catch (error) {
    logger.error("Error in deleteMemberAction:", error);
    return false;
  }
}



/**
 * Fetch member profile picture on-demand when opening member view or edit dialog.
 * Keeps bulk pagination queries lightweight by excluding massive base64 payloads.
 */
export async function getMemberProfilePictureAction(id: string): Promise<string | null> {
  const isAuthorized = (await verifyMemberAdmin("manage_members")) || (await verifyMemberAdmin("approve_renewals"));
  if (!isAuthorized) return null;

  try {
    const member = await prisma.member.findUnique({
      where: { id },
      select: { profilePictureUrl: true },
    });
    return member?.profilePictureUrl || null;
  } catch (error) {
    logger.error("Error in getMemberProfilePictureAction:", error);
    return null;
  }
}

