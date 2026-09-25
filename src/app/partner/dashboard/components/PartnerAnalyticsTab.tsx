"use client";

import { useState, useEffect, useCallback } from "react";
import { Partner } from "@/services/db";
import { PartnerAnalyticsData } from "@/types/partnerAnalytics";
import { getPartnerAnalyticsAction } from "@/app/actions/partnerActions";
import { PartnerAnalyticsKpis } from "./PartnerAnalyticsKpis";
import { PartnerAnalyticsCharts } from "./PartnerAnalyticsCharts";
import { PartnerSettlementStatementsTable } from "./PartnerSettlementStatementsTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, BarChart2 } from "lucide-react";
import { toast } from "sonner";

interface PartnerAnalyticsTabProps {
  partner: Partner;
}

export function PartnerAnalyticsTab({ partner }: PartnerAnalyticsTabProps) {
  const [analytics, setAnalytics] = useState<PartnerAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    try {
      const res = await getPartnerAnalyticsAction();
      if (res.success && res.data) {
        setAnalytics(res.data);
      } else {
        toast.error(res.error || "অ্যানালিটিক্স লোড করতে ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি, অনুগ্রহ করে আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadAnalytics();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [loadAnalytics]);

  const handleRefresh = async () => {
    setLoading(true);
    await loadAnalytics();
  };

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
              অ্যানালিটিক্স ও সেটেলমেন্ট রিপোর্ট
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            মাসিক লেনদেন প্রবণতা, সর্বোচ্চ সেবাদানের দিন এবং আর্থিক বিবরণী পর্যালোচনা করুন
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-xl border-border text-xs font-semibold gap-1.5 cursor-pointer hover:bg-muted"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
            <span>রিফ্রেশ</span>
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

      {/* Main Analytics Content */}
      {analytics && (
        <div className="space-y-6 sm:space-y-8">
          {/* 1. Top KPI Summary Cards */}
          <PartnerAnalyticsKpis analytics={analytics} />

          {/* 2. Charts & Peak Day Distribution */}
          <PartnerAnalyticsCharts
            monthlyTrends={analytics.monthlyTrends}
            dayDistributions={analytics.dayDistributions}
          />

          {/* 3. Monthly Settlement Statements Table */}
          <PartnerSettlementStatementsTable
            statements={analytics.settlementStatements}
            partner={partner}
          />
        </div>
      )}
    </div>
  );
}
