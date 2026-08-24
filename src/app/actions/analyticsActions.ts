"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import {
  AdminRevenueAnalyticsData,
  RevenueKpis,
  MonthlyFinancialPoint,
  TopPartnerPerformance,
  RenewalRetentionMetrics,
  TierBreakdownMetrics,
} from "@/types/revenueAnalytics";

const BN_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

const EN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export async function getAdminRevenueAnalyticsAction(): Promise<{
  success: boolean;
  data?: AdminRevenueAnalyticsData;
  error?: string;
}> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস। কেবল অ্যাডমিন এই ডেটা দেখতে পারবেন।" };
  }

  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);

    // 1. Fetch system pricing settings & raw data in parallel
    const [
      pricingSettings,
      allMembers,
      allTransactions,
      allPartners,
    ] = await Promise.all([
      prisma.systemSetting.findMany({
        where: { key: { in: ["premium_fee", "founding_fee"] } },
      }),
      prisma.member.findMany({
        select: {
          id: true,
          tier: true,
          status: true,
          joinedDate: true,
          expiryDate: true,
          renewalStatus: true,
          createdAt: true,
        },
      }),
      prisma.transaction.findMany({
        orderBy: { date: "asc" },
        select: {
          id: true,
          memberId: true,
          partnerId: true,
          partnerName: true,
          amount: true,
          saved: true,
          date: true,
          createdAt: true,
        },
      }),
      prisma.partner.findMany({
        select: {
          id: true,
          name: true,
          category: true,
        },
      }),
    ]);

    // Parse fees
    const premiumFeeSetting = pricingSettings.find((s) => s.key === "premium_fee");
    const foundingFeeSetting = pricingSettings.find((s) => s.key === "founding_fee");
    const premiumFee = premiumFeeSetting ? parseInt(premiumFeeSetting.value, 10) || 500 : 500;
    const foundingFee = foundingFeeSetting ? parseInt(foundingFeeSetting.value, 10) || 0 : 0;

    // 2. Compute Member Stats & Tier Breakdowns
    let activePremiumCount = 0;
    let activeFoundingCount = 0;
    let totalRenewedCount = 0;
    let pendingRenewalsCount = 0;
    let expiredMembersCount = 0;

    const memberJoinMonthCounts: Record<string, { total: number; premium: number; founding: number }> = {};

    for (const m of allMembers) {
      const isPremium = m.tier === "premium";
      const isActive = m.status === "active";

      if (isActive) {
        if (isPremium) activePremiumCount++;
        else activeFoundingCount++;
      }

      if (m.renewalStatus === "approved") {
        totalRenewedCount++;
      } else if (m.renewalStatus === "pending") {
        pendingRenewalsCount++;
      }

      // Check if expired
      const expiry = new Date(m.expiryDate);
      if (expiry < now && m.status !== "active") {
        expiredMembersCount++;
      }

      // Group member joins by month
      const joinDate = new Date(m.createdAt || m.joinedDate);
      const mKey = `${joinDate.getFullYear()}-${String(joinDate.getMonth() + 1).padStart(2, "0")}`;
      if (!memberJoinMonthCounts[mKey]) {
        memberJoinMonthCounts[mKey] = { total: 0, premium: 0, founding: 0 };
      }
      memberJoinMonthCounts[mKey].total++;
      if (isPremium) memberJoinMonthCounts[mKey].premium++;
      else memberJoinMonthCounts[mKey].founding++;
    }

    const totalSubscriptionRevenue =
      activePremiumCount * premiumFee + activeFoundingCount * foundingFee;

    // 3. Aggregate Transactions & Monthly Buckets
    let totalMemberSavings = 0;
    let thisMonthMemberSavings = 0;
    let totalMedicalBilled = 0;
    let thisMonthMedicalBilled = 0;
    let thisMonthTransactions = 0;

    const partnerAggregates: Record<
      string,
      {
        partnerId: string;
        partnerName: string;
        totalBilled: number;
        totalSaved: number;
        transactionCount: number;
        uniquePatients: Set<string>;
      }
    > = {};

    // Generate month keys for at least past 6-12 months
    const monthBuckets: Record<
      string,
      {
        year: number;
        month: number;
        subscriptionRevenue: number;
        medicalBilled: number;
        memberSavings: number;
        transactionCount: number;
        newMembersCount: number;
        renewalsCount: number;
      }
    > = {};

    // Initialize past 6 months guaranteed
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth();
      const key = `${y}-${String(m + 1).padStart(2, "0")}`;
      monthBuckets[key] = {
        year: y,
        month: m,
        subscriptionRevenue: 0,
        medicalBilled: 0,
        memberSavings: 0,
        transactionCount: 0,
        newMembersCount: 0,
        renewalsCount: 0,
      };
    }

    // Populate new members in month buckets
    for (const [mKey, counts] of Object.entries(memberJoinMonthCounts)) {
      if (!monthBuckets[mKey]) {
        const [yStr, mStr] = mKey.split("-");
        const y = parseInt(yStr, 10);
        const m = parseInt(mStr, 10) - 1;
        monthBuckets[mKey] = {
          year: y,
          month: m,
          subscriptionRevenue: 0,
          medicalBilled: 0,
          memberSavings: 0,
          transactionCount: 0,
          newMembersCount: 0,
          renewalsCount: 0,
        };
      }
      monthBuckets[mKey].newMembersCount = counts.total;
      monthBuckets[mKey].subscriptionRevenue +=
        counts.premium * premiumFee + counts.founding * foundingFee;
    }

    // Populate transaction data
    for (const tx of allTransactions) {
      totalMedicalBilled += tx.amount;
      totalMemberSavings += tx.saved;

      const txDate = new Date(tx.date || tx.createdAt);
      if (txDate >= startOfCurrentMonth) {
        thisMonthMedicalBilled += tx.amount;
        thisMonthMemberSavings += tx.saved;
        thisMonthTransactions++;
      }

      // Monthly bucket
      const txKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, "0")}`;
      if (!monthBuckets[txKey]) {
        monthBuckets[txKey] = {
          year: txDate.getFullYear(),
          month: txDate.getMonth(),
          subscriptionRevenue: 0,
          medicalBilled: 0,
          memberSavings: 0,
          transactionCount: 0,
          newMembersCount: 0,
          renewalsCount: 0,
        };
      }
      monthBuckets[txKey].medicalBilled += tx.amount;
      monthBuckets[txKey].memberSavings += tx.saved;
      monthBuckets[txKey].transactionCount++;

      // Partner grouping
      if (!partnerAggregates[tx.partnerId]) {
        partnerAggregates[tx.partnerId] = {
          partnerId: tx.partnerId,
          partnerName: tx.partnerName,
          totalBilled: 0,
          totalSaved: 0,
          transactionCount: 0,
          uniquePatients: new Set<string>(),
        };
      }
      partnerAggregates[tx.partnerId].totalBilled += tx.amount;
      partnerAggregates[tx.partnerId].totalSaved += tx.saved;
      partnerAggregates[tx.partnerId].transactionCount++;
      partnerAggregates[tx.partnerId].uniquePatients.add(tx.memberId);
    }

    const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    const thisMonthSubscriptionRevenue =
      monthBuckets[currentMonthKey]?.subscriptionRevenue ?? (activePremiumCount * premiumFee);

    // 4. Partner Category Mapping & Performance List
    const partnerCategoryMap = new Map(allPartners.map((p) => [p.id, p.category]));

    const topPartners: TopPartnerPerformance[] = Object.values(partnerAggregates)
      .map((p) => {
        const category = partnerCategoryMap.get(p.partnerId) || "hospital";
        const avgSavingsRate =
          p.totalBilled > 0 ? Math.round((p.totalSaved / p.totalBilled) * 100) : 0;
        return {
          partnerId: p.partnerId,
          partnerName: p.partnerName,
          category,
          totalBilled: p.totalBilled,
          totalSaved: p.totalSaved,
          transactionCount: p.transactionCount,
          uniquePatients: p.uniquePatients.size,
          averageSavingsRate: avgSavingsRate,
        };
      })
      .sort((a, b) => b.totalSaved - a.totalSaved);

    // 5. Sorted Monthly Financial Points
    const sortedMonthKeys = Object.keys(monthBuckets).sort();
    const monthlyFinancials: MonthlyFinancialPoint[] = sortedMonthKeys.map((key) => {
      const b = monthBuckets[key];
      return {
        monthKey: key,
        monthLabelBn: `${BN_MONTHS[b.month]} ${b.year}`,
        monthLabelEn: `${EN_MONTHS[b.month]} ${b.year}`,
        year: b.year,
        month: b.month + 1,
        subscriptionRevenue: b.subscriptionRevenue,
        medicalBilled: b.medicalBilled,
        memberSavings: b.memberSavings,
        transactionCount: b.transactionCount,
        newMembersCount: b.newMembersCount,
        renewalsCount: b.renewalsCount,
      };
    });

    // 6. Renewal Retention Calculations
    const eligibleForRenewal = totalRenewedCount + expiredMembersCount + pendingRenewalsCount;
    const renewalRetentionRate =
      eligibleForRenewal > 0
        ? Math.round((totalRenewedCount / eligibleForRenewal) * 100)
        : allMembers.length > 0
        ? 100
        : 0;

    const renewalMetrics: RenewalRetentionMetrics = {
      totalEligible: eligibleForRenewal,
      renewedCount: totalRenewedCount,
      pendingCount: pendingRenewalsCount,
      expiredCount: expiredMembersCount,
      retentionRate: renewalRetentionRate,
    };

    const tierBreakdown: TierBreakdownMetrics = {
      foundingCount: activeFoundingCount,
      premiumCount: activePremiumCount,
      foundingRevenue: activeFoundingCount * foundingFee,
      premiumRevenue: activePremiumCount * premiumFee,
      foundingFee,
      premiumFee,
    };

    const totalTransactionsCount = allTransactions.length;
    const averageSavingPerTransaction =
      totalTransactionsCount > 0 ? Math.round(totalMemberSavings / totalTransactionsCount) : 0;
    const averageBillPerTransaction =
      totalTransactionsCount > 0 ? Math.round(totalMedicalBilled / totalTransactionsCount) : 0;

    const kpis: RevenueKpis = {
      totalSubscriptionRevenue,
      thisMonthSubscriptionRevenue,
      totalMemberSavings,
      thisMonthMemberSavings,
      totalMedicalBilled,
      thisMonthMedicalBilled,
      totalTransactions: totalTransactionsCount,
      thisMonthTransactions,
      activePremiumCount,
      activeFoundingCount,
      totalMembersCount: allMembers.length,
      renewalRetentionRate,
      totalRenewedCount,
      pendingRenewalsCount,
      expiredMembersCount,
      averageSavingPerTransaction,
      averageBillPerTransaction,
    };

    const data: AdminRevenueAnalyticsData = {
      kpis,
      monthlyFinancials,
      topPartners,
      renewalMetrics,
      tierBreakdown,
    };

    return { success: true, data };
  } catch (error) {
    logger.error("Error in getAdminRevenueAnalyticsAction:", error);
    return { success: false, error: "আর্থিক অ্যানালিটিক্স ডেটা লোড করতে ব্যর্থ হয়েছে।" };
  }
}
