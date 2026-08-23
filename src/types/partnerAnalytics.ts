import { Transaction } from "@/services/db";

export interface MonthlyTrendPoint {
  monthKey: string; // "2026-08"
  monthLabelBn: string; // "আগস্ট ২০২৬"
  monthLabelEn: string; // "August 2026"
  patientCount: number;
  uniquePatients: number;
  totalAmount: number;
  totalDiscount: number;
  netAmount: number;
}

export interface DayDistribution {
  dayIndex: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  dayNameBn: string;
  dayNameEn: string;
  count: number;
  percentage: number;
  totalAmount: number;
  totalDiscount: number;
}

export interface MonthlySettlementStatement {
  monthKey: string; // "2026-08"
  monthLabelBn: string;
  monthLabelEn: string;
  year: number;
  month: number;
  totalTransactions: number;
  uniquePatients: number;
  grossAmount: number;
  totalDiscountDispensed: number;
  netPatientPaid: number;
  status: "settled" | "recorded";
  transactions: Transaction[];
}

export interface PartnerAnalyticsData {
  totalPatientsServed: number;
  uniquePatientsCount: number;
  totalGrossBilled: number;
  totalDiscountDispensed: number;
  netPatientPaid: number;
  averageDiscountPerPatient: number;
  currentMonthPatients: number;
  currentMonthDiscount: number;
  lastMonthPatients: number;
  lastMonthDiscount: number;
  peakVisitingDay: {
    dayNameBn: string;
    dayNameEn: string;
    count: number;
    percentage: number;
  };
  monthlyTrends: MonthlyTrendPoint[];
  dayDistributions: DayDistribution[];
  settlementStatements: MonthlySettlementStatement[];
}
