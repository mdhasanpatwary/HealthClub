"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MonthlyTrendPoint, DayDistribution } from "@/types/partnerAnalytics";
import { formatNum, Locale } from "@/lib/i18n";
import { BarChart3, CalendarDays, TrendingUp, Sparkles, UserCheck, Heart } from "lucide-react";

interface PartnerAnalyticsChartsProps {
  monthlyTrends: MonthlyTrendPoint[];
  dayDistributions: DayDistribution[];
  locale: Locale;
}

export function PartnerAnalyticsCharts({
  monthlyTrends,
  dayDistributions,
  locale,
}: PartnerAnalyticsChartsProps) {
  const isBn = locale === "bn";
  const [chartMetric, setChartMetric] = useState<"patients" | "discount">("patients");

  // Calculate max values for SVG bar chart scaling
  const maxPatientCount = Math.max(...monthlyTrends.map((m) => m.patientCount), 1);
  const maxDiscountAmount = Math.max(...monthlyTrends.map((m) => m.totalDiscount), 1);
  const maxDayCount = Math.max(...dayDistributions.map((d) => d.count), 1);

  // Peak day
  const peakDay = dayDistributions.reduce((prev, curr) =>
    curr.count > prev.count ? curr : prev,
    dayDistributions[0]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Monthly Trends Bar Chart (Spans 2 columns on lg) */}
      <Card className="lg:col-span-2 border-border/70 shadow-sm rounded-2xl bg-card">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <BarChart3 className="h-4 w-4" />
              </div>
              <CardTitle className="text-base sm:text-lg font-bold font-heading text-secondary dark:text-white">
                {isBn ? "মাসিক রোগী ভলিউম ও ডিসকাউন্ট ট্রেন্ড" : "Monthly Patient Volume & Savings Trend"}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {isBn
                ? "মাসভিত্তিক মোট রোগী সমাগম ও প্রদত্ত চিকিৎসা ছাড়ের তুলনামূলক চিত্র"
                : "Month-by-month patient visits and dispensed discounts comparison"}
            </CardDescription>
          </div>

          {/* Metric Selector Toggle */}
          <div className="flex items-center gap-1 bg-muted/70 dark:bg-slate-900/80 p-1 rounded-xl border border-border/60 self-start sm:self-auto">
            <Button
              type="button"
              variant={chartMetric === "patients" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartMetric("patients")}
              className={`h-7 px-2.5 text-xs font-semibold rounded-lg cursor-pointer ${
                chartMetric === "patients"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserCheck className="h-3 w-3 mr-1" />
              {isBn ? "রোগী সংখ্যা" : "Patients"}
            </Button>
            <Button
              type="button"
              variant={chartMetric === "discount" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartMetric("discount")}
              className={`h-7 px-2.5 text-xs font-semibold rounded-lg cursor-pointer ${
                chartMetric === "discount"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className="h-3 w-3 mr-1" />
              {isBn ? "ছাড় (৳)" : "Discount (৳)"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          {monthlyTrends.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              {isBn ? "কোনো ট্রেন্ড ডেটা পাওয়া যায়নি।" : "No trend data available."}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Responsive Chart Container */}
              <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 px-1 sm:px-2 border-b border-border/60">
                {monthlyTrends.map((trend) => {
                  const value =
                    chartMetric === "patients" ? trend.patientCount : trend.totalDiscount;
                  const maxValue =
                    chartMetric === "patients" ? maxPatientCount : maxDiscountAmount;
                  const heightPercent = maxValue > 0 ? Math.max((value / maxValue) * 100, 4) : 4;

                  return (
                    <div
                      key={trend.monthKey}
                      className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-20 border border-slate-700">
                        <p className="font-bold">{isBn ? trend.monthLabelBn : trend.monthLabelEn}</p>
                        <p className="text-emerald-400">
                          {chartMetric === "patients"
                            ? `${formatNum(trend.patientCount, locale)} ${isBn ? "জন রোগী" : "patients"}`
                            : `৳${formatNum(trend.totalDiscount, locale)} ${isBn ? "ছাড়" : "saved"}`}
                        </p>
                      </div>

                      {/* Value Label above Bar */}
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors mb-1.5 truncate max-w-full">
                        {chartMetric === "patients"
                          ? formatNum(value, locale)
                          : `৳${formatNum(value, locale)}`}
                      </span>

                      {/* Bar Pillar */}
                      <div className="w-full max-w-[48px] bg-muted/60 dark:bg-slate-800 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-xl transition-all duration-500 ease-out group-hover:brightness-110 ${
                            chartMetric === "patients"
                              ? "bg-gradient-to-t from-emerald-600 to-teal-400"
                              : "bg-gradient-to-t from-emerald-500 to-green-400"
                          }`}
                        />
                      </div>

                      {/* Month Label below Bar */}
                      <span className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-2 truncate max-w-full group-hover:text-secondary dark:group-hover:text-white transition-colors">
                        {isBn ? trend.monthLabelBn.split(" ")[0] : trend.monthLabelEn.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Insight Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>
                    {chartMetric === "patients"
                      ? isBn
                        ? "মোট রোগী পরিদর্শন সংখ্যা"
                        : "Total patient visits recorded"
                      : isBn
                      ? "প্রদত্ত মোট চিকিৎসা ডিসকাউন্ট"
                      : "Total medical discounts dispensed"}
                  </span>
                </div>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {isBn ? "রিয়েলটাইম আপডেট" : "Realtime Data"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Peak Visiting Days Breakdown (Day of Week Distribution) */}
      <Card className="border-border/70 shadow-sm rounded-2xl bg-card flex flex-col justify-between">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold font-heading text-secondary dark:text-white">
                {isBn ? "পিক ভিজিটিং ডে বিশ্লেষণ" : "Peak Visiting Days Analysis"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {isBn ? "সপ্তাহের দিনভিত্তিক রোগী সমাগম হার" : "Day-of-week patient traffic breakdown"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {dayDistributions.map((day) => {
              const isPeak = day.dayIndex === peakDay.dayIndex && day.count > 0;
              const barPercent = maxDayCount > 0 ? (day.count / maxDayCount) * 100 : 0;

              return (
                <div key={day.dayIndex} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className={isPeak ? "text-amber-600 dark:text-amber-400 font-bold" : "text-secondary dark:text-slate-200"}>
                        {isBn ? day.dayNameBn : day.dayNameEn}
                      </span>
                      {isPeak && (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[9px] px-1.5 py-0 font-bold">
                          <Sparkles className="h-2 w-2 mr-0.5 inline" />
                          {isBn ? "পিক ডে" : "Peak"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground font-mono">
                      <span>{formatNum(day.count, locale)} {isBn ? "জন" : "pts"}</span>
                      <span className="text-[11px] text-slate-400">({formatNum(day.percentage, locale)}%)</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-muted/60 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${barPercent}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPeak
                          ? "bg-gradient-to-r from-amber-500 to-amber-400"
                          : "bg-gradient-to-r from-emerald-600 to-teal-500"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Peak Day Card Highlight */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {isBn
                  ? `সর্বাধিক রোগী সমাগম: ${peakDay.dayNameBn}`
                  : `Busiest Day: ${peakDay.dayNameEn}`}
              </p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                {isBn
                  ? `মোট সেবাগ্রহীতার ${formatNum(peakDay.percentage, locale)}% রোগী ${peakDay.dayNameBn} সেবা গ্রহণ করেছেন।`
                  : `${formatNum(peakDay.percentage, locale)}% of all patients visited on ${peakDay.dayNameEn}.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
