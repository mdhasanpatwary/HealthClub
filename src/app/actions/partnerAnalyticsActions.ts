"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { PartnerAnalyticsData, MonthlyTrendPoint, DayDistribution, MonthlySettlementStatement } from "@/types/partnerAnalytics";

const BN_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

const EN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_META = [
  { dayIndex: 0, dayNameBn: "রবিবার", dayNameEn: "Sunday" },
  { dayIndex: 1, dayNameBn: "সোমবার", dayNameEn: "Monday" },
  { dayIndex: 2, dayNameBn: "মঙ্গলবার", dayNameEn: "Tuesday" },
  { dayIndex: 3, dayNameBn: "বুধবার", dayNameEn: "Wednesday" },
  { dayIndex: 4, dayNameBn: "বৃহস্পতিবার", dayNameEn: "Thursday" },
  { dayIndex: 5, dayNameBn: "শুক্রবার", dayNameEn: "Friday" },
  { dayIndex: 6, dayNameBn: "শনিবার", dayNameEn: "Saturday" },
];

export async function getPartnerAnalyticsAction(): Promise<{
  success: boolean;
  data?: PartnerAnalyticsData;
  error?: string;
  errorKey?: string;
}> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।", errorKey: "partner.errors.unauthorized" };
  }

  const partnerId = session.role === "partner_staff" ? session.partnerId || session.userId : session.userId;

  try {
    const rawTransactions = await prisma.transaction.findMany({
      where: { partnerId },
      orderBy: { date: "desc" },
    });

    const transactions = rawTransactions.map((t) => ({
      id: t.id,
      memberId: t.memberId,
      memberName: t.memberName,
      partnerId: t.partnerId,
      partnerName: t.partnerName,
      amount: t.amount,
      saved: t.saved,
      date: t.date.toISOString(),
    }));

    const totalPatientsServed = transactions.length;
    const uniqueMembersSet = new Set(transactions.map((t) => t.memberId));
    const uniquePatientsCount = uniqueMembersSet.size;

    let totalGrossBilled = 0;
    let totalDiscountDispensed = 0;

    // Day of week buckets (0-6)
    const dayBuckets: { [key: number]: { count: number; totalAmount: number; totalDiscount: number } } = {
      0: { count: 0, totalAmount: 0, totalDiscount: 0 },
      1: { count: 0, totalAmount: 0, totalDiscount: 0 },
      2: { count: 0, totalAmount: 0, totalDiscount: 0 },
      3: { count: 0, totalAmount: 0, totalDiscount: 0 },
      4: { count: 0, totalAmount: 0, totalDiscount: 0 },
      5: { count: 0, totalAmount: 0, totalDiscount: 0 },
      6: { count: 0, totalAmount: 0, totalDiscount: 0 },
    };

    // Monthly groups
    const monthGroups: {
      [key: string]: {
        year: number;
        month: number;
        transactions: typeof transactions;
        members: Set<string>;
        gross: number;
        saved: number;
      };
    } = {};

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = prevMonthDate.getMonth();

    const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    const prevMonthKey = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}`;

    for (const tx of transactions) {
      totalGrossBilled += tx.amount;
      totalDiscountDispensed += tx.saved;

      const txDate = new Date(tx.date);
      const dayIdx = txDate.getDay();
      if (dayBuckets[dayIdx]) {
        dayBuckets[dayIdx].count += 1;
        dayBuckets[dayIdx].totalAmount += tx.amount;
        dayBuckets[dayIdx].totalDiscount += tx.saved;
      }

      const txYear = txDate.getFullYear();
      const txMonth = txDate.getMonth();
      const monthKey = `${txYear}-${String(txMonth + 1).padStart(2, "0")}`;

      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = {
          year: txYear,
          month: txMonth,
          transactions: [],
          members: new Set(),
          gross: 0,
          saved: 0,
        };
      }

      monthGroups[monthKey].transactions.push(tx);
      monthGroups[monthKey].members.add(tx.memberId);
      monthGroups[monthKey].gross += tx.amount;
      monthGroups[monthKey].saved += tx.saved;
    }

    const netPatientPaid = totalGrossBilled - totalDiscountDispensed;
    const averageDiscountPerPatient =
      totalPatientsServed > 0 ? Math.round(totalDiscountDispensed / totalPatientsServed) : 0;

    // Day distributions
    const dayDistributions: DayDistribution[] = DAYS_META.map((meta) => {
      const bucket = dayBuckets[meta.dayIndex];
      const percentage =
        totalPatientsServed > 0 ? Math.round((bucket.count / totalPatientsServed) * 100) : 0;
      return {
        dayIndex: meta.dayIndex,
        dayNameBn: meta.dayNameBn,
        dayNameEn: meta.dayNameEn,
        count: bucket.count,
        percentage,
        totalAmount: bucket.totalAmount,
        totalDiscount: bucket.totalDiscount,
      };
    });

    // Find peak visiting day
    let peakDay = dayDistributions[0];
    for (const d of dayDistributions) {
      if (d.count > peakDay.count) {
        peakDay = d;
      }
    }

    // Monthly trends (Last 6 to 12 months in chronological order)
    const sortedMonthKeys = Object.keys(monthGroups).sort();
    
    // Ensure at least current and recent months exist even if 0 transactions
    const trendKeys = [...sortedMonthKeys];
    if (!trendKeys.includes(currentMonthKey)) {
      trendKeys.push(currentMonthKey);
    }
    trendKeys.sort();

    const monthlyTrends: MonthlyTrendPoint[] = trendKeys.map((key) => {
      const parts = key.split("-");
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const group = monthGroups[key];

      const patientCount = group ? group.transactions.length : 0;
      const uniquePatients = group ? group.members.size : 0;
      const totalAmount = group ? group.gross : 0;
      const totalDiscount = group ? group.saved : 0;

      return {
        monthKey: key,
        monthLabelBn: `${BN_MONTHS[m]} ${y}`,
        monthLabelEn: `${EN_MONTHS[m]} ${y}`,
        patientCount,
        uniquePatients,
        totalAmount,
        totalDiscount,
        netAmount: totalAmount - totalDiscount,
      };
    });

    // Settlement statements (Descending order - most recent first)
    const settlementStatements: MonthlySettlementStatement[] = sortedMonthKeys
      .reverse()
      .map((key) => {
        const group = monthGroups[key];
        const m = group.month;
        const y = group.year;

        return {
          monthKey: key,
          monthLabelBn: `${BN_MONTHS[m]} ${y}`,
          monthLabelEn: `${EN_MONTHS[m]} ${y}`,
          year: y,
          month: m + 1,
          totalTransactions: group.transactions.length,
          uniquePatients: group.members.size,
          grossAmount: group.gross,
          totalDiscountDispensed: group.saved,
          netPatientPaid: group.gross - group.saved,
          status: "settled",
          transactions: group.transactions,
        };
      });

    const currentMonthGroup = monthGroups[currentMonthKey];
    const prevMonthGroup = monthGroups[prevMonthKey];

    const analyticsData: PartnerAnalyticsData = {
      totalPatientsServed,
      uniquePatientsCount,
      totalGrossBilled,
      totalDiscountDispensed,
      netPatientPaid,
      averageDiscountPerPatient,
      currentMonthPatients: currentMonthGroup ? currentMonthGroup.transactions.length : 0,
      currentMonthDiscount: currentMonthGroup ? currentMonthGroup.saved : 0,
      lastMonthPatients: prevMonthGroup ? prevMonthGroup.transactions.length : 0,
      lastMonthDiscount: prevMonthGroup ? prevMonthGroup.saved : 0,
      peakVisitingDay: {
        dayNameBn: peakDay.count > 0 ? peakDay.dayNameBn : "তথ্য নেই",
        dayNameEn: peakDay.count > 0 ? peakDay.dayNameEn : "No Data",
        count: peakDay.count,
        percentage: peakDay.percentage,
      },
      monthlyTrends,
      dayDistributions,
      settlementStatements,
    };

    return { success: true, data: analyticsData };
  } catch (error) {
    logger.error("Error in getPartnerAnalyticsAction:", error);
    return { success: false, error: "অ্যানালিটিক্স ডেটা লোড করতে সমস্যা হয়েছে।" };
  }
}
