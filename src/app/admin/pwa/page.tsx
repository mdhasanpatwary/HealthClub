"use client";

import Link from "next/link";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Smartphone,
  RotateCw,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";
import { usePwaAnalytics } from "./hooks/usePwaAnalytics";
import { PwaKpiCards } from "./components/PwaKpiCards";
import { PwaDistributionCards } from "./components/PwaDistributionCards";
import { PwaDevicesTable } from "./components/PwaDevicesTable";

export default function AdminPwaAnalyticsPage() {
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";
  const { loading, refreshing, stats, handleRefresh } = usePwaAnalytics(locale);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Header & Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link
              href="/admin"
              className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>{t("admin.nav.dashboard") || "ড্যাশবোর্ড"}</span>
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">
              {t("admin.pwa.title") || "PWA অ্যাপ অ্যানালিটিক্স"}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Smartphone className="h-6 w-6" />
            </div>
            <span>{t("admin.pwa.title") || "PWA অ্যাপ অ্যানালিটিক্স"}</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            {t("admin.pwa.desc") ||
              "প্রগ্রেসিভ ওয়েব অ্যাপের লাইভ ইনস্টল, সক্রিয় ডিভাইস ও প্ল্যাটফর্ম পরিসংখ্যান"}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "h-9 text-xs gap-1.5 border-border",
            })}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isBn ? "ড্যাশবোর্ডে ফিরে যান" : "Back to Dashboard"}</span>
          </Link>

          <Button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            size="sm"
            className="h-9 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
          >
            <RotateCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{t("admin.pwa.refresh") || "রিফ্রেশ"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Main Content Body */}
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <PwaKpiCards stats={stats} />

          {/* Distribution Breakdowns */}
          <PwaDistributionCards stats={stats} />

          {/* Detailed Devices & Activity Table */}
          <PwaDevicesTable devices={stats.recentDevices} />
        </div>
      )}
    </div>
  );
}
