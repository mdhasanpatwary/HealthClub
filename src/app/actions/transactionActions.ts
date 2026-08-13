"use server";

import { prisma } from "@/lib/prisma";
import { Transaction } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { isMemberTxAllowedAction } from "./systemSettingsActions";
import { unstable_cache, updateTag } from "next/cache";

const ADMIN_STATS_TAG = "admin-stats";


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
      date: t.date.toLocaleString("en-US", { hour12: true }),
    }));
  } catch (error) {
    console.error("Error in getTransactionsAction:", error);
    return [];
  }
}

export async function addTransactionAction(tx: Omit<Transaction, "id" | "date">): Promise<Transaction> {
  const session = await getSessionUser();
  if (!session) throw new Error("Unauthorized");

  const billAmount = Number(tx.amount);
  if (isNaN(billAmount) || billAmount <= 0) {
    throw new Error("Invalid bill amount");
  }

  const rawSaved = Number(tx.saved);
  if (isNaN(rawSaved) || rawSaved < 0) {
    throw new Error("Invalid savings amount");
  }

  // Enforce max 30% discount limit on platform transactions
  const maxAllowedSaved = Math.round(billAmount * 0.30);
  const validatedSaved = Math.min(rawSaved, maxAllowedSaved);

  if (session.role !== "admin") {
    const isAllowed = await isMemberTxAllowedAction();
    if (!isAllowed) throw new Error("Unauthorized: Member transaction entry is disabled");

    if (session.userId !== tx.memberId) {
      throw new Error("Unauthorized: Cannot add transaction for another member");
    }
  }

  // Verify member validity and active status
  const member = await prisma.member.findUnique({
    where: { id: tx.memberId },
    select: { id: true, name: true, status: true, expiryDate: true },
  });

  if (!member) {
    throw new Error("Member not found");
  }

  if (session.role !== "admin") {
    if (member.status !== "active") {
      throw new Error("Membership is not active");
    }
    const currentDate = new Date();
    const expiryDate = new Date(member.expiryDate);
    expiryDate.setHours(23, 59, 59, 999);
    if (expiryDate < currentDate) {
      throw new Error("Membership card has expired");
    }
  }

  const partner = await prisma.partner.findUnique({
    where: { id: tx.partnerId },
    select: { id: true, name: true },
  });

  if (!partner) {
    throw new Error("Partner not found");
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

    return {
      id: data.id,
      memberId: data.memberId,
      memberName: data.memberName,
      partnerId: data.partnerId,
      partnerName: data.partnerName,
      amount: data.amount,
      saved: data.saved,
      date: data.date.toLocaleString("en-US", { hour12: true }),
    };
  } catch (error) {
    console.error("Error in addTransactionAction:", error);
    throw error;
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
  topPartners: [] as Array<{ id: string; name: string; totalSaved: number; transactionCount: number }>,
};

/**
 * Cached inner function that runs 2 SQL queries instead of 19 Prisma calls.
 * Cached for 60s and invalidated via the "admin-stats" tag on mutations.
 */
const getCachedAdminStats = unstable_cache(
  async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // 1. Single parameterized SQL query for all scalar counts & aggregates (replaces 19 round-trips)
    const [countsResult, topPartnerGroups] = await Promise.all([
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
          (SELECT COUNT(*) FROM members WHERE tier = 'premium' AND status = 'active') AS active_premium_count`,
      // 2. Top partners query (groupBy is hard to inline in raw SQL cleanly)
      prisma.transaction.groupBy({
        by: ["partnerId", "partnerName"],
        _sum: { saved: true },
        _count: { id: true },
        orderBy: { _sum: { saved: "desc" } },
        take: 3,
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
    console.error("Error in getStatsAction:", error);
    return DEFAULT_STATS;
  }
}

