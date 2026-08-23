"use client";

import { useState, useEffect, useCallback } from "react";
import { Partner } from "@/services/db";
import { PartnerAnalyticsData } from "@/types/partnerAnalytics";
import { getPartnerAnalyticsAction } from "@/app/actions/partnerActions";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { PartnerAnalyticsKpis } from "./PartnerAnalyticsKpis";
import { PartnerAnalyticsCharts } from "./PartnerAnalyticsCharts";
import { PartnerSettlementStatementsTable } from "./PartnerSettlementStatementsTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, BarChart2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PartnerAnalyticsTabProps {
  partner: Partner;
}

export function PartnerAnalyticsTab({ partner }: PartnerAnalyticsTabProps) {
  const { locale } = useLanguage();
  const isBn = locale === "bn";

  const [analytics, setAnalytics] = useState<PartnerAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPartnerAnalyticsAction();
      if (res.success && res.data) {
        setAnalytics(res.data);
      } else {
        setError(res.error || "অ্যানালিটিক্স লোড করতে ব্যর্থ হয়েছে।");
        toast.error(res.error || "অ্যানালিটিক্স লোড করতে ব্যর্থ হয়েছে।");
      }
    } catch {
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
      toast.error("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Quick Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-card border border-border/70 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <BarChart2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-secondary dark:text-white">
              {isBn ? "পার্টনার অ্যানালিটিক্স ও মাসিক সেটেলমেন্ট" : "Partner Analytics & Monthly Settlement"}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isBn
              ? "মাসিক রোগী ভলিউম, ডিসকাউন্ট ছাড় পরিসংখ্যান, পিক ভিজিটিং ডে এবং অফিশিয়াল বিলিং স্টেটমেন্ট রিপোর্ট।"
              : "Track monthly patient traffic, discount dispensation, peak visiting patterns, and download monthly statements."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
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
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && !analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
            <Button onClick={fetchAnalytics} variant="outline" size="sm" className="rounded-xl text-xs">
              {isBn ? "পুনরায় চেষ্টা করুন" : "Try Again"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Analytics Content */}
      {analytics && (
        <div className="space-y-6 sm:space-y-8">
          {/* 1. Top KPI Summary Cards */}
          <PartnerAnalyticsKpis analytics={analytics} locale={locale} />

          {/* 2. Charts & Peak Day Distribution */}
          <PartnerAnalyticsCharts
            monthlyTrends={analytics.monthlyTrends}
            dayDistributions={analytics.dayDistributions}
            locale={locale}
          />

          {/* 3. Monthly Settlement Statements Table */}
          <PartnerSettlementStatementsTable
            statements={analytics.settlementStatements}
            partner={partner}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
