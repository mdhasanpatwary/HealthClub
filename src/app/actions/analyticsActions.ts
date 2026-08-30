"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { hasAdminPermission } from "@/lib/permissions";
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

interface SummaryStatsRow {
  total_members: bigint | number;
  active_premium_count: bigint | number;
  active_founding_count: bigint | number;
  total_renewed_count: bigint | number;
  pending_renewals_count: bigint | number;
  expired_members_count: bigint | number;
  total_transactions: bigint | number;
  total_medical_billed: bigint | number;
  total_member_savings: bigint | number;
  this_month_transactions: bigint | number;
  this_month_medical_billed: bigint | number;
  this_month_member_savings: bigint | number;
}

interface MonthlyMemberRow {
  month_key: string;
  total_count: bigint | number;
  premium_count: bigint | number;
  founding_count: bigint | number;
}

interface MonthlyRenewalRow {
  month_key: string;
  renewal_count: bigint | number;
}

interface MonthlyTransactionRow {
  month_key: string;
  medical_billed: bigint | number;
  member_savings: bigint | number;
  transaction_count: bigint | number;
}

interface PartnerPerformanceRow {
  partner_id: string;
  partner_name: string;
  category: string;
  total_billed: bigint | number;
  total_saved: bigint | number;
  transaction_count: bigint | number;
  unique_patients: bigint | number;
}

export async function getAdminRevenueAnalyticsAction(): Promise<{
  success: boolean;
  data?: AdminRevenueAnalyticsData;
  error?: string;
}> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin" || !hasAdminPermission(session.adminRole || "super_admin", "view_analytics")) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস। অ্যানালিটিক্স ডেটা দেখার অনুমতি আপনার নেই।" };
  }

  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);

    // 1. Execute SQL aggregations & pricing queries concurrently in parallel
    const [
      pricingSettings,
      summaryStatsRows,
      monthlyMemberRows,
      monthlyRenewalRows,
      monthlyTransactionRows,
      partnerPerformanceRows,
    ] = await Promise.all([
      prisma.systemSetting.findMany({
        where: { key: { in: ["premium_fee", "founding_fee"] } },
      }),
      prisma.$queryRaw<SummaryStatsRow[]>`
        SELECT
          (SELECT COUNT(*) FROM members) AS total_members,
          (SELECT COUNT(*) FROM members WHERE tier = 'premium' AND status = 'active' AND expiry_date >= ${now}) AS active_premium_count,
          (SELECT COUNT(*) FROM members WHERE tier = 'founding' AND status = 'active' AND expiry_date >= ${now}) AS active_founding_count,
          (SELECT COUNT(*) FROM members WHERE expiry_date > (joined_date + INTERVAL '1 year') OR id IN (SELECT member_id FROM member_notifications WHERE type = 'renewal_approved')) AS total_renewed_count,
          (SELECT COUNT(*) FROM members WHERE renewal_status = 'pending') AS pending_renewals_count,
          (SELECT COUNT(*) FROM members WHERE expiry_date < ${now} AND (renewal_status IS NULL OR renewal_status != 'pending')) AS expired_members_count,
          (SELECT COUNT(*) FROM transactions) AS total_transactions,
          (SELECT COALESCE(SUM(amount), 0) FROM transactions) AS total_medical_billed,
          (SELECT COALESCE(SUM(saved), 0) FROM transactions) AS total_member_savings,
          (SELECT COUNT(*) FROM transactions WHERE COALESCE(date, created_at) >= ${startOfCurrentMonth}) AS this_month_transactions,
          (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE COALESCE(date, created_at) >= ${startOfCurrentMonth}) AS this_month_medical_billed,
          (SELECT COALESCE(SUM(saved), 0) FROM transactions WHERE COALESCE(date, created_at) >= ${startOfCurrentMonth}) AS this_month_member_savings
      `,
      prisma.$queryRaw<MonthlyMemberRow[]>`
        SELECT
          TO_CHAR(COALESCE(created_at, joined_date), 'YYYY-MM') AS month_key,
          COUNT(*) AS total_count,
          COUNT(*) FILTER (WHERE tier = 'premium') AS premium_count,
          COUNT(*) FILTER (WHERE tier = 'founding') AS founding_count
        FROM members
        WHERE COALESCE(created_at, joined_date) IS NOT NULL
        GROUP BY TO_CHAR(COALESCE(created_at, joined_date), 'YYYY-MM')
        ORDER BY month_key ASC
      `,
      prisma.$queryRaw<MonthlyRenewalRow[]>`
        SELECT
          TO_CHAR(created_at, 'YYYY-MM') AS month_key,
          COUNT(*) AS renewal_count
        FROM member_notifications
        WHERE type = 'renewal_approved' AND created_at IS NOT NULL
        GROUP BY TO_CHAR(created_at, 'YYYY-MM')
        ORDER BY month_key ASC
      `,
      prisma.$queryRaw<MonthlyTransactionRow[]>`
        SELECT
          TO_CHAR(COALESCE(date, created_at), 'YYYY-MM') AS month_key,
          COALESCE(SUM(amount), 0) AS medical_billed,
          COALESCE(SUM(saved), 0) AS member_savings,
          COUNT(*) AS transaction_count
        FROM transactions
        WHERE COALESCE(date, created_at) IS NOT NULL
        GROUP BY TO_CHAR(COALESCE(date, created_at), 'YYYY-MM')
        ORDER BY month_key ASC
      `,
      prisma.$queryRaw<PartnerPerformanceRow[]>`
        SELECT
          t.partner_id AS partner_id,
          COALESCE(p.name, MAX(t.partner_name)) AS partner_name,
          COALESCE(p.category, 'hospital') AS category,
          COALESCE(SUM(t.amount), 0) AS total_billed,
          COALESCE(SUM(t.saved), 0) AS total_saved,
          COUNT(t.id) AS transaction_count,
          COUNT(DISTINCT t.member_id) AS unique_patients
        FROM transactions t
        LEFT JOIN partners p ON t.partner_id = p.id
        GROUP BY t.partner_id, p.name, p.category
        ORDER BY total_saved DESC
      `,
    ]);

    // 2. Parse subscription fees
    const premiumFeeSetting = pricingSettings.find((s) => s.key === "premium_fee");
    const foundingFeeSetting = pricingSettings.find((s) => s.key === "founding_fee");
    const premiumFee = premiumFeeSetting ? parseInt(premiumFeeSetting.value, 10) || 500 : 500;
    const foundingFee = foundingFeeSetting ? parseInt(foundingFeeSetting.value, 10) || 0 : 0;

    // 3. Extract & safely cast summary KPIs
    const stats = summaryStatsRows[0] || ({} as Partial<SummaryStatsRow>);
    const totalMembers = Number(stats.total_members ?? 0);
    const activePremiumCount = Number(stats.active_premium_count ?? 0);
    const activeFoundingCount = Number(stats.active_founding_count ?? 0);
    const totalRenewedCount = Number(stats.total_renewed_count ?? 0);
    const pendingRenewalsCount = Number(stats.pending_renewals_count ?? 0);
    const expiredMembersCount = Number(stats.expired_members_count ?? 0);
    const totalTransactions = Number(stats.total_transactions ?? 0);
    const totalMedicalBilled = Number(stats.total_medical_billed ?? 0);
    const totalMemberSavings = Number(stats.total_member_savings ?? 0);
    const thisMonthTransactions = Number(stats.this_month_transactions ?? 0);
    const thisMonthMedicalBilled = Number(stats.this_month_medical_billed ?? 0);
    const thisMonthMemberSavings = Number(stats.this_month_member_savings ?? 0);

    const totalSubscriptionRevenue =
      activePremiumCount * premiumFee +
      activeFoundingCount * foundingFee +
      totalRenewedCount * premiumFee;

    // 4. Construct monthly financial buckets
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

    // Guarantee at least the past 6 months
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

    // Populate monthly member registration data
    for (const row of monthlyMemberRows) {
      const mKey = row.month_key;
      if (!mKey) continue;

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

      const totalJoins = Number(row.total_count ?? 0);
      const premJoins = Number(row.premium_count ?? 0);
      const foundJoins = Number(row.founding_count ?? 0);

      monthBuckets[mKey].newMembersCount = totalJoins;
      monthBuckets[mKey].subscriptionRevenue +=
        premJoins * premiumFee + foundJoins * foundingFee;
    }

    // Populate monthly renewal data
    for (const row of monthlyRenewalRows) {
      const rKey = row.month_key;
      if (!rKey) continue;

      if (!monthBuckets[rKey]) {
        const [yStr, mStr] = rKey.split("-");
        const y = parseInt(yStr, 10);
        const m = parseInt(mStr, 10) - 1;
        monthBuckets[rKey] = {
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

      const rCount = Number(row.renewal_count ?? 0);
      monthBuckets[rKey].renewalsCount += rCount;
      monthBuckets[rKey].subscriptionRevenue += rCount * premiumFee;
    }

    // Populate monthly transaction data
    for (const row of monthlyTransactionRows) {
      const txKey = row.month_key;
      if (!txKey) continue;

      if (!monthBuckets[txKey]) {
        const [yStr, mStr] = txKey.split("-");
        const y = parseInt(yStr, 10);
        const m = parseInt(mStr, 10) - 1;
        monthBuckets[txKey] = {
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

      monthBuckets[txKey].medicalBilled += Number(row.medical_billed ?? 0);
      monthBuckets[txKey].memberSavings += Number(row.member_savings ?? 0);
      monthBuckets[txKey].transactionCount += Number(row.transaction_count ?? 0);
    }

    const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    const thisMonthSubscriptionRevenue =
      monthBuckets[currentMonthKey]?.subscriptionRevenue ?? (activePremiumCount * premiumFee);

    // Format sorted monthly financials
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

    // 5. Format Top Partner Performance
    const topPartners: TopPartnerPerformance[] = partnerPerformanceRows.map((p) => {
      const totalBilled = Number(p.total_billed ?? 0);
      const totalSaved = Number(p.total_saved ?? 0);
      const transactionCount = Number(p.transaction_count ?? 0);
      const uniquePatients = Number(p.unique_patients ?? 0);
      const averageSavingsRate =
        totalBilled > 0 ? Math.round((totalSaved / totalBilled) * 100) : 0;

      return {
        partnerId: p.partner_id,
        partnerName: p.partner_name,
        category: p.category || "hospital",
        totalBilled,
        totalSaved,
        transactionCount,
        uniquePatients,
        averageSavingsRate,
      };
    });

    // 6. Renewal Retention Calculations
    const eligibleForRenewal = totalRenewedCount + expiredMembersCount + pendingRenewalsCount;
    const renewalRetentionRate =
      eligibleForRenewal > 0
        ? Math.round((totalRenewedCount / eligibleForRenewal) * 100)
        : totalMembers > 0
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

    const averageSavingPerTransaction =
      totalTransactions > 0 ? Math.round(totalMemberSavings / totalTransactions) : 0;
    const averageBillPerTransaction =
      totalTransactions > 0 ? Math.round(totalMedicalBilled / totalTransactions) : 0;

    const kpis: RevenueKpis = {
      totalSubscriptionRevenue,
      thisMonthSubscriptionRevenue,
      totalMemberSavings,
      thisMonthMemberSavings,
      totalMedicalBilled,
      thisMonthMedicalBilled,
      totalTransactions,
      thisMonthTransactions,
      activePremiumCount,
      activeFoundingCount,
      totalMembersCount: totalMembers,
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

