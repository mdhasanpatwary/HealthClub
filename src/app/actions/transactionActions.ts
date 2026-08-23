"use server";

import { prisma } from "@/lib/prisma";
import { Transaction } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { isMemberTxAllowedAction } from "./systemSettingsActions";
import { unstable_cache, updateTag } from "next/cache";
import { PaginatedResult } from "@/types/pagination";
import { INITIAL_BLOOD_DONORS, INITIAL_AMBULANCES } from "@/data/emergencyData";
import { HEALTH_TIPS_ARTICLES } from "@/data/healthTipsData";
import { createMemberNotification } from "./memberNotificationActions";

const ADMIN_STATS_TAG = "admin-stats";

export interface GetPaginatedTransactionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  memberId?: string;
  partnerId?: string;
}

export async function getPaginatedTransactionsAction(
  params?: GetPaginatedTransactionsParams
): Promise<PaginatedResult<Transaction>> {
  const session = await getSessionUser();
  if (!session) {
    return {
      data: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: params?.pageSize || 10,
    };
  }

  // Non-admins can only view their own transactions
  if (session.role !== "admin") {
    if (!params?.memberId || session.userId !== params.memberId) {
      return {
        data: [],
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        pageSize: params?.pageSize || 10,
      };
    }
  }

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim();
  const memberId = params?.memberId;
  const partnerId = params?.partnerId;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (memberId) {
    where.memberId = memberId;
  }
  if (partnerId) {
    where.partnerId = partnerId;
  }
  if (search) {
    where.OR = [
      { memberName: { contains: search, mode: "insensitive" } },
      { memberId: { contains: search, mode: "insensitive" } },
      { partnerName: { contains: search, mode: "insensitive" } },
      { id: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [totalItems, data] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const transactions: Transaction[] = data.map((t) => ({
      id: t.id,
      memberId: t.memberId,
      memberName: t.memberName,
      partnerId: t.partnerId,
      partnerName: t.partnerName,
      amount: t.amount,
      saved: t.saved,
      date: t.date.toISOString(),
    }));

    return {
      data: transactions,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    logger.error("Error in getPaginatedTransactionsAction:", error);
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize };
  }
}



// --- TRANSACTIONS ACTIONS ---

export async function getTransactionsAction(memberId?: string): Promise<Transaction[]> {
  const session = await getSessionUser();
  if (!session) return [];

  // Security check: non-admins can only fetch their own transactions
  if (session.role !== "admin") {
    if (!memberId || session.userId !== memberId) {
      return [];
    }
  }
  try {
    const data = await prisma.transaction.findMany({
      // If memberId is provided, filter at DB level — avoids fetching all rows
      where: memberId ? { memberId } : undefined,
      orderBy: { createdAt: "desc" },
      // Limit to latest 100 for admin view (no memberId) to prevent unbounded growth
      ...(memberId ? {} : { take: 100 }),
    });

    return data.map((t) => ({
      id: t.id,
      memberId: t.memberId,
      memberName: t.memberName,
      partnerId: t.partnerId,
      partnerName: t.partnerName,
      amount: t.amount,
      saved: t.saved,
      date: t.date.toISOString(),
    }));
  } catch (error) {
    logger.error("Error in getTransactionsAction:", error);
    return [];
  }
}

export async function addTransactionAction(tx: Omit<Transaction, "id" | "date">): Promise<Transaction | { error: string }> {
  const session = await getSessionUser();
  if (!session) return { error: "অননুমোদিত অ্যাক্সেস।" };

  const billAmount = Number(tx.amount);
  if (isNaN(billAmount) || billAmount <= 0) {
    return { error: "সঠিক বিলের পরিমাণ ইনপুট দিন।" };
  }

  const rawSaved = Number(tx.saved);
  if (isNaN(rawSaved) || rawSaved < 0) {
    return { error: "সঠিক ছাড়ের পরিমাণ ইনপুট দিন।" };
  }

  // Enforce max 30% discount limit on platform transactions
  const maxAllowedSaved = Math.round(billAmount * 0.30);
  const validatedSaved = Math.min(rawSaved, maxAllowedSaved);

  if (session.role !== "admin") {
    const isAllowed = await isMemberTxAllowedAction();
    if (!isAllowed) return { error: "মেম্বার ট্রানজেকশন বর্তমানে অক্ষম করা আছে।" };

    if (session.userId !== tx.memberId) {
      return { error: "আপনি অন্য মেম্বারের জন্য ট্রানজেকশন যোগ করতে পারবেন না।" };
    }
  }

  // Verify member validity and active status
  const member = await prisma.member.findUnique({
    where: { id: tx.memberId },
    select: { id: true, name: true, status: true, expiryDate: true },
  });

  if (!member) {
    return { error: "মেম্বার খুঁজে পাওয়া যায়নি।" };
  }

  if (session.role !== "admin") {
    if (member.status !== "active") {
      return { error: "মেম্বারশিপটি সক্রিয় নয়।" };
    }
    const currentDate = new Date();
    const expiryDate = new Date(member.expiryDate);
    expiryDate.setHours(23, 59, 59, 999);
    if (expiryDate < currentDate) {
      return { error: "মেম্বারশিপ কার্ডের মেয়াদ শেষ হয়ে গেছে।" };
    }
  }

  const partner = await prisma.partner.findUnique({
    where: { id: tx.partnerId },
    select: { id: true, name: true },
  });

  if (!partner) {
    return { error: "পার্টনার খুঁজে পাওয়া যায়নি।" };
  }

  const newTxId = `tx_${crypto.randomUUID()}`;
  const now = new Date();

  try {
    const data = await prisma.$transaction(async (txPrisma) => {
      // 1. Create transaction
      const newTx = await txPrisma.transaction.create({
        data: {
          id: newTxId,
          memberId: member.id,
          memberName: member.name,
          partnerId: partner.id,
          partnerName: partner.name,
          amount: billAmount,
          saved: validatedSaved,
          date: now,
        },
      });

      // 2. Update member totalSaved
      await txPrisma.member.update({
        where: { id: member.id },
        data: {
          totalSaved: {
            increment: validatedSaved,
          },
        },
      });

      return newTx;
    });

    // Invalidate admin stats cache AFTER the DB write succeeds
    updateTag(ADMIN_STATS_TAG);

    // Send in-app notification to the member
    await createMemberNotification({
      memberId: member.id,
      type: "transaction_recorded",
      titleBn: "নতুন ডিসকাউন্ট ট্রানজেকশন যুক্ত হয়েছে",
      titleEn: "New Discount Transaction Recorded",
      messageBn: `"${partner.name}" এ ৳${billAmount} টাকার বিলে আপনি ৳${validatedSaved} সাশ্রয় করেছেন!`,
      messageEn: `You saved ৳${validatedSaved} on a ৳${billAmount} bill at "${partner.name}"!`,
      link: "/dashboard?tab=history",
    });

    return {
      id: data.id,
      memberId: data.memberId,
      memberName: data.memberName,
      partnerId: data.partnerId,
      partnerName: data.partnerName,
      amount: data.amount,
      saved: data.saved,
      date: data.date.toISOString(),
    };
  } catch (error) {
    logger.error("Error in addTransactionAction:", error);
    return { error: "ট্রানজেকশন সংরক্ষণ করতে সমস্যা হয়েছে।" };
  }
}

// --- ANALYTICS ACTION ---

const DEFAULT_STATS = {
  totalMembers: 0,
  activeMembers: 0,
  inactiveMembers: 0,
  foundingMembers: 0,
  premiumMembers: 0,
  expiringMembers: 0,
  newMembersThisMonth: 0,
  partnerCount: 0,
  partnerHospitals: 0,
  partnerDiagnostics: 0,
  partnerPharmacies: 0,
  pendingPartnerRequests: 0,
  pendingRenewals: 0,
  contactMessagesCount: 0,
  totalSaved: 0,
  thisMonthSaved: 0,
  totalTransactions: 0,
  thisMonthTransactions: 0,
  revenue: 0,
  pwaInstalls: 0,
  pwaActive: 0,
  doctorsCount: 0,
  activeDoctorsCount: 0,
  emergencyDonorsCount: 0,
  pendingDonorsCount: 0,
  ambulancesCount: 0,
  healthTipsCount: 0,
  topPartners: [] as Array<{ id: string; name: string; totalSaved: number; transactionCount: number }>,
};

/**
 * Cached inner function that runs queries and parses settings.
 * Cached for 60s and invalidated via the "admin-stats" tag on mutations.
 */
const getCachedAdminStats = unstable_cache(
  async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Single parameterized SQL query for all scalar counts & aggregates
    const [countsResult, topPartnerGroups, emergencySettings, healthTipsSetting] = await Promise.all([
      prisma.$queryRaw<
        Array<{
          total_members: bigint;
          active_members: bigint;
          inactive_members: bigint;
          founding_members: bigint;
          premium_members: bigint;
          expiring_members: bigint;
          new_members_this_month: bigint;
          partner_count: bigint;
          partner_hospitals: bigint;
          partner_diagnostics: bigint;
          partner_pharmacies: bigint;
          pending_partner_requests: bigint;
          pending_renewals: bigint;
          contact_messages_count: bigint;
          total_transactions: bigint;
          this_month_transactions: bigint;
          total_saved: bigint;
          this_month_saved: bigint;
          active_premium_count: bigint;
          pwa_installs: bigint;
          pwa_active: bigint;
          doctors_count: bigint;
          active_doctors_count: bigint;
        }>
      >`SELECT
          (SELECT COUNT(*) FROM members) AS total_members,
          (SELECT COUNT(*) FROM members WHERE status = 'active') AS active_members,
          (SELECT COUNT(*) FROM members WHERE status = 'inactive') AS inactive_members,
          (SELECT COUNT(*) FROM members WHERE tier = 'founding') AS founding_members,
          (SELECT COUNT(*) FROM members WHERE tier = 'premium') AS premium_members,
          (SELECT COUNT(*) FROM members WHERE status = 'active' AND expiry_date >= ${now} AND expiry_date <= ${in30Days}) AS expiring_members,
          (SELECT COUNT(*) FROM members WHERE created_at >= ${startOfMonth}) AS new_members_this_month,
          (SELECT COUNT(*) FROM partners) AS partner_count,
          (SELECT COUNT(*) FROM partners WHERE category = 'hospital') AS partner_hospitals,
          (SELECT COUNT(*) FROM partners WHERE category = 'diagnostic') AS partner_diagnostics,
          (SELECT COUNT(*) FROM partners WHERE category = 'pharmacy') AS partner_pharmacies,
          (SELECT COUNT(*) FROM partner_requests WHERE status = 'pending') AS pending_partner_requests,
          (SELECT COUNT(*) FROM members WHERE renewal_status = 'pending') AS pending_renewals,
          (SELECT COUNT(*) FROM contact_messages) AS contact_messages_count,
          (SELECT COUNT(*) FROM transactions) AS total_transactions,
          (SELECT COUNT(*) FROM transactions WHERE created_at >= ${startOfMonth}) AS this_month_transactions,
          (SELECT COALESCE(SUM(saved), 0) FROM transactions) AS total_saved,
          (SELECT COALESCE(SUM(saved), 0) FROM transactions WHERE created_at >= ${startOfMonth}) AS this_month_saved,
          (SELECT COUNT(*) FROM members WHERE tier = 'premium' AND status = 'active') AS active_premium_count,
          (SELECT COUNT(*) FROM pwa_installations WHERE is_standalone = TRUE) AS pwa_installs,
          (SELECT COUNT(*) FROM pwa_installations WHERE is_standalone = TRUE AND last_active_at >= ${past30Days}) AS pwa_active,
          (SELECT COUNT(*) FROM doctors) AS doctors_count,
          (SELECT COUNT(*) FROM doctors WHERE is_active = TRUE) AS active_doctors_count`,
      // 2. Top partners query
      prisma.transaction.groupBy({
        by: ["partnerId", "partnerName"],
        _sum: { saved: true },
        _count: { id: true },
        orderBy: { _sum: { saved: "desc" } },
        take: 3,
      }),
      // 3. Emergency settings
      prisma.systemSetting.findMany({
        where: { key: { in: ["emergency_donors", "emergency_ambulances"] } },
      }),
      // 4. Health tips settings
      prisma.systemSetting.findUnique({
        where: { key: "health_tips_articles" },
      }),
    ]);

    const row = countsResult[0];
    const totalMembers = Number(row?.total_members ?? 0);
    const activeMembers = Number(row?.active_members ?? 0);

    const topPartners = topPartnerGroups.map((p) => ({
      id: p.partnerId,
      name: p.partnerName,
      totalSaved: p._sum.saved || 0,
      transactionCount: p._count.id || 0,
    }));

    // Calculate Emergency Donors count & Pending Donors
    let emergencyDonorsCount = INITIAL_BLOOD_DONORS.length;
    let pendingDonorsCount = INITIAL_BLOOD_DONORS.filter((d) => d.status === "pending").length;
    const donorsSetting = emergencySettings.find((s) => s.key === "emergency_donors");
    if (donorsSetting?.value) {
      try {
        const parsed = JSON.parse(donorsSetting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          emergencyDonorsCount = parsed.length;
          pendingDonorsCount = parsed.filter((d: { status?: string }) => d.status === "pending").length;
        }
      } catch (e) {
        logger.error("Failed to parse emergency_donors stats", e);
      }
    }

    // Calculate Ambulances count
    let ambulancesCount = INITIAL_AMBULANCES.length;
    const ambSetting = emergencySettings.find((s) => s.key === "emergency_ambulances");
    if (ambSetting?.value) {
      try {
        const parsed = JSON.parse(ambSetting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          ambulancesCount = parsed.length;
        }
      } catch (e) {
        logger.error("Failed to parse emergency_ambulances stats", e);
      }
    }

    // Calculate Health Tips count
    let healthTipsCount = HEALTH_TIPS_ARTICLES.length;
    if (healthTipsSetting?.value) {
      try {
        const parsed = JSON.parse(healthTipsSetting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          healthTipsCount = parsed.length;
        }
      } catch (e) {
        logger.error("Failed to parse health_tips stats", e);
      }
    }

    return {
      totalMembers,
      activeMembers,
      inactiveMembers: Number(row?.inactive_members ?? 0),
      foundingMembers: Number(row?.founding_members ?? 0),
      premiumMembers: Number(row?.premium_members ?? 0),
      expiringMembers: Number(row?.expiring_members ?? 0),
      newMembersThisMonth: Number(row?.new_members_this_month ?? 0),
      partnerCount: Number(row?.partner_count ?? 0),
      partnerHospitals: Number(row?.partner_hospitals ?? 0),
      partnerDiagnostics: Number(row?.partner_diagnostics ?? 0),
      partnerPharmacies: Number(row?.partner_pharmacies ?? 0),
      pendingPartnerRequests: Number(row?.pending_partner_requests ?? 0),
      pendingRenewals: Number(row?.pending_renewals ?? 0),
      contactMessagesCount: Number(row?.contact_messages_count ?? 0),
      totalSaved: Number(row?.total_saved ?? 0),
      thisMonthSaved: Number(row?.this_month_saved ?? 0),
      totalTransactions: Number(row?.total_transactions ?? 0),
      thisMonthTransactions: Number(row?.this_month_transactions ?? 0),
      revenue: Number(row?.active_premium_count ?? 0) * 500,
      pwaInstalls: Number(row?.pwa_installs ?? 0),
      pwaActive: Number(row?.pwa_active ?? 0),
      doctorsCount: Number(row?.doctors_count ?? 0),
      activeDoctorsCount: Number(row?.active_doctors_count ?? 0),
      emergencyDonorsCount,
      pendingDonorsCount,
      ambulancesCount,
      healthTipsCount,
      topPartners,
    };
  },
  ["admin-stats"],
  { revalidate: 60, tags: [ADMIN_STATS_TAG] }
);

export async function getStatsAction() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return DEFAULT_STATS;

  try {
    return await getCachedAdminStats();
  } catch (error) {
    logger.error("Error in getStatsAction:", error);
    return DEFAULT_STATS;
  }
}

