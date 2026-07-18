"use server";

import { prisma } from "@/lib/prisma";
import { Transaction } from "@/services/db";
import { getSessionUser } from "@/lib/session";


// --- TRANSACTIONS ACTIONS ---

export async function getTransactionsAction(): Promise<Transaction[]> {
  const session = await getSessionUser();
  if (!session) return [];
  try {
    const data = await prisma.transaction.findMany({
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
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
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
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return { totalMembers: 0, activeMembers: 0, partnerCount: 0, totalSaved: 0, totalTransactions: 0, revenue: 0 };
  try {
    const [totalMembers, activeMembers, partnerCount, totalTransactions, totalSavedAgg, premiumActiveCount] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: "active" } }),
      prisma.partner.count(),
      prisma.transaction.count(),
      prisma.member.aggregate({
        _sum: {
          totalSaved: true,
        },
      }),
      prisma.member.count({
        where: {
          tier: "premium",
          status: "active",
        },
      }),
    ]);

    return {
      totalMembers,
      activeMembers,
      partnerCount,
      totalSaved: totalSavedAgg._sum.totalSaved || 0,
      totalTransactions,
      revenue: premiumActiveCount * 500,
    };
  } catch (error) {
    console.error("Error in getStatsAction:", error);
    return {
      totalMembers: 0,
      activeMembers: 0,
      partnerCount: 0,
      totalSaved: 0,
      totalTransactions: 0,
      revenue: 0,
    };
  }
}
