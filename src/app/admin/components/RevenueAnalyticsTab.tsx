"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminRevenueAnalyticsData } from "@/types/revenueAnalytics";
import { getAdminRevenueAnalyticsAction } from "@/app/actions/analyticsActions";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { RevenueKpiCards } from "./RevenueKpiCards";
import { RevenueFinancialCharts } from "./RevenueFinancialCharts";
import { RenewalRetentionBreakdown } from "./RenewalRetentionBreakdown";
import { PartnerPerformanceTable } from "./PartnerPerformanceTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  RefreshCw,
  Download,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { exportToCsv } from "@/lib/exportUtils";

export function RevenueAnalyticsTab() {
  const { locale } = useLanguage();
  const isBn = locale === "bn";

  const [data, setData] = useState<AdminRevenueAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminRevenueAnalyticsAction();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        const errorMsg = res.error || "অ্যানালিটিক্স ডেটা লোড করতে সমস্যা হয়েছে।";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch {
      const errorMsg = "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportCsv = () => {
    if (!data) return;

    interface RevenueExportRow {
      month: string;
      subscriptionRevenue: number;
      medicalBilled: number;
      memberSavings: number;
      transactionCount: number;
      newMembersCount: number;
    }

    const rows: RevenueExportRow[] = data.monthlyFinancials.map((m) => ({
      month: m.monthLabelEn,
      subscriptionRevenue: m.subscriptionRevenue,
      medicalBilled: m.medicalBilled,
      memberSavings: m.memberSavings,
      transactionCount: m.transactionCount,
      newMembersCount: m.newMembersCount,
    }));

    exportToCsv<RevenueExportRow>(rows, "healthclub_revenue_report", [
      { header: "Month", accessor: "month" },
      { header: "Subscription Revenue (BDT)", accessor: "subscriptionRevenue" },
      { header: "Gross Medical Billed (BDT)", accessor: "medicalBilled" },
      { header: "Member Savings (BDT)", accessor: "memberSavings" },
      { header: "Patient Visits Count", accessor: "transactionCount" },
      { header: "New Members Registered", accessor: "newMembersCount" },
    ]);
    toast.success(isBn ? "আর্থিক রিপোর্ট CSV ডাউনলোড সম্পন্ন হয়েছে।" : "Revenue report exported to CSV successfully.");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-card border border-border/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-secondary dark:text-white">
              {isBn ? "আর্থিক ও রাজস্ব অ্যানালিটিক্স ড্যাশবোর্ড" : "Financial & Revenue Analytics"}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            {isBn
              ? "সদস্যপদ সাবস্ক্রিপশন রাজস্ব, বাৎসরিক নবায়ন রিটেনশন রেট, মাসিক ট্রানজ্যাকশন ভলিউম ও পার্টনার হাসপাতালের সেভিংস পারফরম্যান্স রিপোর্ট।"
              : "Track membership subscription revenue, renewal retention rates, monthly transaction volumes, and top-performing partner medical centers."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            disabled={loading}
            className="rounded-xl border-border text-xs font-semibold gap-1.5 cursor-pointer hover:bg-muted"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
            <span>{isBn ? "রিফ্রেশ" : "Refresh"}</span>
          </Button>

          {data && (
            <Button
              variant="default"
              size="sm"
              onClick={handleExportCsv}
              className="rounded-xl text-xs font-semibold gap-1.5 bg-primary hover:bg-primary-dark text-white cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isBn ? "রিপোর্ট এক্সপোর্ট" : "Export CSV"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && !data && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-80 w-full rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
          <Skeleton className="h-72 w-full rounded-3xl" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 rounded-3xl">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
            <Button onClick={fetchAnalytics} variant="outline" size="sm" className="rounded-xl text-xs">
              {isBn ? "পুনরায় চেষ্টা করুন" : "Try Again"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Data Loaded View */}
      {data && (
        <div className="space-y-6 sm:space-y-8">
          {/* 1. Main KPI Summary Cards */}
          <RevenueKpiCards kpis={data.kpis} locale={locale} />

          {/* 2. Visual Revenue & Transaction Charts */}
          <RevenueFinancialCharts
            monthlyFinancials={data.monthlyFinancials}
            locale={locale}
          />

          {/* 3. Tier Distribution & Renewal Pipeline */}
          <RenewalRetentionBreakdown
            renewalMetrics={data.renewalMetrics}
            tierBreakdown={data.tierBreakdown}
            locale={locale}
          />

          {/* 4. Top Performing Partner Hospitals & Clinics */}
          <PartnerPerformanceTable
            partners={data.topPartners}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
