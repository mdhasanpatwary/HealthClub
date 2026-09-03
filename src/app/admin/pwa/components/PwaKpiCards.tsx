"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  Smartphone,
  Clock,
  UserX,
  TrendingUp,
  Percent,
} from "lucide-react";
import type { PwaStatsData } from "@/app/actions/pwaActions";

interface PwaKpiCardsProps {
  stats: PwaStatsData;
}

export function PwaKpiCards({ stats }: PwaKpiCardsProps) {
  const { locale, t } = useLanguage();
  const isBn = locale === "bn";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total PWA Installs */}
      <Card className="border-border shadow-sm bg-card hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
              {t("admin.pwa.totalInstalls") || "সর্বমোট ইনস্টল"}
            </p>
            <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono">
              {formatNum(stats.totalInstalls, locale)}
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                <Smartphone className="h-3 w-3" />
                {formatNum(stats.standaloneUsers, locale)} {isBn ? "ডিভাইস" : "devices"}
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
            <Download className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Active PWA Installs (30 Days) */}
      <Card className="border-border shadow-sm bg-card hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
              {t("admin.pwa.activeInstalls") || "সক্রিয় ইনস্টল (৩০ দিন)"}
            </p>
            <p className="text-3xl font-extrabold text-primary font-mono">
              {formatNum(stats.activeMonthly30d, locale)}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {isBn ? "আজ:" : "24h:"} {formatNum(stats.activeNow24h, locale)}
              </span>
              <span>•</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                {isBn ? "৭ দিনে:" : "7d:"} {formatNum(stats.activeWeekly7d, locale)}
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/60 text-primary flex items-center justify-center border border-primary/20">
            <TrendingUp className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Inactive / Probable Uninstalls */}
      <Card className="border-border shadow-sm bg-card hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
              {t("admin.pwa.inactiveInstalls") || "সম্ভাব্য আনইনস্টল"}
            </p>
            <p className="text-3xl font-extrabold text-slate-700 dark:text-slate-300 font-mono">
              {formatNum(stats.inactive30dPlus, locale)}
            </p>
            <p className="text-[11px] text-slate-500 pt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {t("admin.pwa.inactiveDesc") || "৩০+ দিন কোনো সেশন নেই"}
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <UserX className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Prompt Funnel & Conversion Rate */}
      <Card className="border-border shadow-sm bg-card hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
              {t("admin.pwa.conversionRate") || "প্রম্পট কনভার্সন"}
            </p>
            <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono">
              {stats.conversionRate}%
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
              <span className="text-emerald-600 font-medium">
                +{formatNum(stats.promptAcceptedTotal, locale)} {isBn ? "গৃহীত" : "accepted"}
              </span>
              <span>•</span>
              <span className="text-rose-500 font-medium">
                {formatNum(stats.promptDismissedTotal, locale)} {isBn ? "বাতিল" : "dismissed"}
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
            <Percent className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
