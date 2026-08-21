"use client";

import { useState, useEffect, useCallback } from "react";
import { getPwaStatsAction, PwaStatsData } from "@/app/actions/pwaActions";
import { toast } from "sonner";

const DEFAULT_PWA_STATS: PwaStatsData = {
  totalInstalls: 0,
  activeNow24h: 0,
  activeWeekly7d: 0,
  activeMonthly30d: 0,
  inactive30dPlus: 0,
  standaloneUsers: 0,
  browserUsers: 0,
  promptShownTotal: 0,
  promptAcceptedTotal: 0,
  promptDismissedTotal: 0,
  conversionRate: 0,
  platformBreakdown: [],
  browserBreakdown: [],
  deviceTypeBreakdown: [],
  recentDevices: [],
};

export function usePwaAnalytics(locale: "bn" | "en") {
  const isBn = locale === "bn";
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<PwaStatsData>(DEFAULT_PWA_STATS);

  const fetchStats = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const data = await getPwaStatsAction();
      setStats(data);
      if (isManualRefresh) {
        toast.success(isBn ? "PWA পরিসংখ্যান আপডেট হয়েছে" : "PWA stats refreshed");
      }
    } catch {
      toast.error(isBn ? "অ্যানালিটিক্স লোড করতে সমস্যা হয়েছে" : "Failed to load analytics");
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  }, [isBn]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) fetchStats(false);
    });

    const handleDataChange = () => {
      fetchStats(false);
    };

    window.addEventListener("admin-data-change", handleDataChange);
    return () => {
      isMounted = false;
      window.removeEventListener("admin-data-change", handleDataChange);
    };
  }, [fetchStats]);

  const handleManualRefresh = () => {
    fetchStats(true);
  };

  return {
    loading,
    refreshing,
    stats,
    handleRefresh: handleManualRefresh,
  };
}
