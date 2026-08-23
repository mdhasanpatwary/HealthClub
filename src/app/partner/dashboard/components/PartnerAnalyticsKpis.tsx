"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PartnerAnalyticsData } from "@/types/partnerAnalytics";
import { formatNum, Locale } from "@/lib/i18n";
import {
  Users,
  Heart,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  CreditCard,
  Sparkles,
} from "lucide-react";

interface PartnerAnalyticsKpisProps {
  analytics: PartnerAnalyticsData;
  locale: Locale;
}

export function PartnerAnalyticsKpis({ analytics, locale }: PartnerAnalyticsKpisProps) {
  const isBn = locale === "bn";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Total Patients Served */}
      <Card className="border-border/70 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all rounded-2xl bg-card">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
              {isBn ? "মোট সেবাগ্রহীতা রোগী" : "Total Patients Served"}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-secondary dark:text-white font-mono">
              {formatNum(analytics.totalPatientsServed, locale)}
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <Users className="h-3 w-3" />
              <span>
                {formatNum(analytics.uniquePatientsCount, locale)} {isBn ? "জন স্বতন্ত্র সদস্য" : "unique members"}
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900 shrink-0">
            <Users className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Medical Discount Dispensed */}
      <Card className="border-border/70 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all rounded-2xl bg-card">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
              {isBn ? "মোট ছাড় প্রদান" : "Total Discount Given"}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-primary font-mono">
              ৳{formatNum(analytics.totalDiscountDispensed, locale)}
            </p>
            <div className="flex items-center gap-1 pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>
                {isBn ? "চলতি মাসে:" : "This month:"} ৳{formatNum(analytics.currentMonthDiscount, locale)}
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-100/60 dark:bg-emerald-950/60 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <Heart className="h-6 w-6 fill-primary/10" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Gross Billing Volume */}
      <Card className="border-border/70 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all rounded-2xl bg-card">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
              {isBn ? "গ্রস বিলিং ভলিউম" : "Gross Bill Volume"}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-secondary dark:text-white font-mono">
              ৳{formatNum(analytics.totalGrossBilled, locale)}
            </p>
            <div className="flex items-center gap-1 pt-1 text-[11px] text-muted-foreground font-medium">
              <CreditCard className="h-3 w-3" />
              <span>
                {isBn ? "গড় ছাড়/রোগী:" : "Avg discount/pt:"} ৳{formatNum(analytics.averageDiscountPerPatient, locale)}
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900 shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Peak Visiting Day */}
      <Card className="border-border/70 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all rounded-2xl bg-card">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
              {isBn ? "পিক ভিজিটিং ডে" : "Peak Visiting Day"}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xl sm:text-2xl font-bold text-secondary dark:text-white truncate">
                {isBn ? analytics.peakVisitingDay.dayNameBn : analytics.peakVisitingDay.dayNameEn}
              </p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] px-2 py-0 font-semibold">
                <Sparkles className="h-2.5 w-2.5 mr-1 inline" />
                {analytics.peakVisitingDay.count > 0
                  ? `${formatNum(analytics.peakVisitingDay.count, locale)} ${isBn ? "টি লেনদেন (" : "tx ("}${formatNum(analytics.peakVisitingDay.percentage, locale)}%)`
                  : (isBn ? "তথ্য নেই" : "No visits")}
              </Badge>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900 shrink-0">
            <CalendarCheck className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
