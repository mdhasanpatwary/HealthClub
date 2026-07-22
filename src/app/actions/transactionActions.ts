"use server";

import { prisma } from "@/lib/prisma";
import { Transaction } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { isMemberTxAllowedAction } from "./systemSettingsActions";


// --- TRANSACTIONS ACTIONS ---

export async function getTransactionsAction(memberId?: string): Promise<Transaction[]> {
  const session = await getSessionUser();
  if (!session) return [];
  try {
    const data = await prisma.transaction.findMany({
      // If memberId is provided, filter at DB level — avoids fetching all rows
      where: memberId ? { memberId } : undefined,
      orderBy: { createdAt: "desc" },
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

  if (session.role !== "admin") {
    const isAllowed = await isMemberTxAllowedAction();
    if (!isAllowed) throw new Error("Unauthorized: Member transaction entry is disabled");

    if (session.userId !== tx.memberId) {
      throw new Error("Unauthorized: Cannot add transaction for another member");
    }
  }

  const newTxId = `tx_${crypto.randomUUID()}`;
  const now = new Date();


  try {
    const data = await prisma.$transaction(async (txPrisma) => {
      // 1. Create transaction
      const newTx = await txPrisma.transaction.create({
        data: {
          id: newTxId,
          memberId: tx.memberId,
          memberName: tx.memberName,
          partnerId: tx.partnerId,
          partnerName: tx.partnerName,
          amount: tx.amount,
          saved: tx.saved,
          date: now,
        },
      });

      // 2. Update member totalSaved
      await txPrisma.member.update({
        where: { id: tx.memberId },
        data: {
          totalSaved: {
            increment: tx.saved,
          },
        },
      });

      return newTx;
    });

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

export async function getStatsAction() {
  const defaultStats = {
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

  const session = await getSessionUser();
  if (!session || session.role !== "admin") return defaultStats;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [
      totalMembers,
      activeMembers,
      foundingMembers,
      premiumMembers,
      expiringMembers,
      newMembersThisMonth,
      partnerCount,
      partnerHospitals,
      partnerDiagnostics,
      partnerPharmacies,
      pendingPartnerRequests,
      pendingRenewals,
      contactMessagesCount,
      totalTransactions,
      thisMonthTransactions,
      totalSavedAgg,
      thisMonthSavedAgg,
      topPartnerGroups,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: "active" } }),
      prisma.member.count({ where: { tier: "founding" } }),
      prisma.member.count({ where: { tier: "premium" } }),
      prisma.member.count({
        where: {
          status: "active",
          expiryDate: { gte: now, lte: in30Days },
        },
      }),
      prisma.member.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.partner.count(),
      prisma.partner.count({ where: { category: "hospital" } }),
      prisma.partner.count({ where: { category: "diagnostic" } }),
      prisma.partner.count({ where: { category: "pharmacy" } }),
      prisma.partnerRequest.count({ where: { status: "pending" } }),
      prisma.member.count({ where: { renewalStatus: "pending" } }),
      prisma.contactMessage.count(),
      prisma.transaction.count(),
      prisma.transaction.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.member.aggregate({ _sum: { totalSaved: true } }),
      prisma.transaction.aggregate({
        _sum: { saved: true },
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.transaction.groupBy({
        by: ["partnerId", "partnerName"],
        _sum: { saved: true },
        _count: { id: true },
        orderBy: { _sum: { saved: "desc" } },
        take: 3,
      }),
    ]);

    const topPartners = topPartnerGroups.map((p) => ({
      id: p.partnerId,
      name: p.partnerName,
      totalSaved: p._sum.saved || 0,
      transactionCount: p._count.id || 0,
    }));

    const activePremiumCount = await prisma.member.count({
      where: { tier: "premium", status: "active" },
    });

    return {
      totalMembers,
      activeMembers,
      inactiveMembers: totalMembers - activeMembers,
      foundingMembers,
      premiumMembers,
      expiringMembers,
      newMembersThisMonth,
      partnerCount,
      partnerHospitals,
      partnerDiagnostics,
      partnerPharmacies,
      pendingPartnerRequests,
      pendingRenewals,
      contactMessagesCount,
      totalSaved: totalSavedAgg._sum.totalSaved || 0,
      thisMonthSaved: thisMonthSavedAgg._sum.saved || 0,
      totalTransactions,
      thisMonthTransactions,
      revenue: activePremiumCount * 500,
      topPartners,
    };
  } catch (error) {
    console.error("Error in getStatsAction:", error);
    return defaultStats;
  }
}

