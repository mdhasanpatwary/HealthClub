export interface RevenueKpis {
  totalSubscriptionRevenue: number;
  thisMonthSubscriptionRevenue: number;
  totalMemberSavings: number;
  thisMonthMemberSavings: number;
  totalMedicalBilled: number;
  thisMonthMedicalBilled: number;
  totalTransactions: number;
  thisMonthTransactions: number;
  activePremiumCount: number;
  activeFoundingCount: number;
  totalMembersCount: number;
  renewalRetentionRate: number;
  totalRenewedCount: number;
  pendingRenewalsCount: number;
  expiredMembersCount: number;
  averageSavingPerTransaction: number;
  averageBillPerTransaction: number;
}

export interface MonthlyFinancialPoint {
  monthKey: string; // "YYYY-MM"
  monthLabelBn: string;
  monthLabelEn: string;
  year: number;
  month: number;
  subscriptionRevenue: number;
  medicalBilled: number;
  memberSavings: number;
  transactionCount: number;
  newMembersCount: number;
  renewalsCount: number;
}

export interface TopPartnerPerformance {
  partnerId: string;
  partnerName: string;
  category: "hospital" | "diagnostic" | "pharmacy" | string;
  totalBilled: number;
  totalSaved: number;
  transactionCount: number;
  uniquePatients: number;
  averageSavingsRate: number;
}

export interface RenewalRetentionMetrics {
  totalEligible: number;
  renewedCount: number;
  pendingCount: number;
  expiredCount: number;
  retentionRate: number;
}

export interface TierBreakdownMetrics {
  foundingCount: number;
  premiumCount: number;
  foundingRevenue: number;
  premiumRevenue: number;
  foundingFee: number;
  premiumFee: number;
}

export interface AdminRevenueAnalyticsData {
  kpis: RevenueKpis;
  monthlyFinancials: MonthlyFinancialPoint[];
  topPartners: TopPartnerPerformance[];
  renewalMetrics: RenewalRetentionMetrics;
  tierBreakdown: TierBreakdownMetrics;
}
