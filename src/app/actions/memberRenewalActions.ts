"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/client/client";
import { Member } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { PaginatedResult } from "@/types/pagination";
import { createMemberNotification } from "./memberNotificationActions";
import { hasAdminPermission } from "@/lib/permissions";
import { updateTag } from "next/cache";
import { MEMBER_SELECT_FIELDS, mapPrismaMember } from "@/lib/memberFormat";

async function verifyRenewalAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "approve_renewals");
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
  if (!(await verifyRenewalAdmin())) {
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

  const where: Prisma.MemberWhereInput = {};
  if (status && status !== "all") {
    where.renewalStatus = status;
  } else {
    // Default to members who have requested renewal
    where.renewalStatus = "pending";
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
    logger.error("Error in getPaginatedRenewalsAction:", error);
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize };
  }
}

export async function approveMemberRenewalAction(memberId: string): Promise<boolean> {
  if (!(await verifyRenewalAdmin())) {
    logger.warn("Unauthorized attempt to approve renewal");
    return false;
  }

  try {
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
      },
    });
    updateTag("admin-stats");

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
  if (!(await verifyRenewalAdmin())) {
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
      },
    });
    updateTag("admin-stats");

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
