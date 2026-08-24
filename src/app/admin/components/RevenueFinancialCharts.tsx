"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonthlyFinancialPoint } from "@/types/revenueAnalytics";
import { formatNum, Locale } from "@/lib/i18n";
import {
  BarChart3,
  TrendingUp,
  Coins,
  HeartHandshake,
  Building2,
  Receipt,
  Sparkles,
} from "lucide-react";

interface RevenueFinancialChartsProps {
  monthlyFinancials: MonthlyFinancialPoint[];
  locale: Locale;
}

type ChartMetric = "revenue" | "savings" | "billed" | "transactions";

export function RevenueFinancialCharts({
  monthlyFinancials,
  locale,
}: RevenueFinancialChartsProps) {
  const isBn = locale === "bn";
  const [metric, setMetric] = useState<ChartMetric>("revenue");

  // Determine active metric values
  const getMetricValue = (m: MonthlyFinancialPoint): number => {
    switch (metric) {
      case "revenue":
        return m.subscriptionRevenue;
      case "savings":
        return m.memberSavings;
      case "billed":
        return m.medicalBilled;
      case "transactions":
        return m.transactionCount;
    }
  };

  const getMetricLabel = (): string => {
    switch (metric) {
      case "revenue":
        return isBn ? "সাবস্ক্রিপশন রাজস্ব (৳)" : "Subscription Revenue (৳)";
      case "savings":
        return isBn ? "সদস্য ডিসকাউন্ট সাশ্রয় (৳)" : "Member Savings (৳)";
      case "billed":
        return isBn ? "গ্রস মেডিকেল বিলিং (৳)" : "Gross Medical Billed (৳)";
      case "transactions":
        return isBn ? "রোগী লেনদেন সংখ্যা" : "Patient Visits";
    }
  };

  const getMetricGradient = (): string => {
    switch (metric) {
      case "revenue":
        return "bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400";
      case "savings":
        return "bg-gradient-to-t from-teal-600 via-teal-500 to-emerald-400";
      case "billed":
        return "bg-gradient-to-t from-blue-600 via-blue-500 to-indigo-400";
      case "transactions":
        return "bg-gradient-to-t from-purple-600 via-purple-500 to-pink-400";
    }
  };

  const values = monthlyFinancials.map(getMetricValue);
  const maxValue = Math.max(...values, 1);
  const totalMetricSum = values.reduce((sum, v) => sum + v, 0);

  // Identify peak month
  const peakMonth = monthlyFinancials.reduce((prev, curr) =>
    getMetricValue(curr) > getMetricValue(prev) ? curr : prev,
    monthlyFinancials[0] || null
  );

  return (
    <Card className="border-border/80 shadow-xs rounded-3xl bg-card">
      <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <BarChart3 className="h-4 w-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold font-heading text-secondary dark:text-white">
              {isBn ? "মাসিক আর্থিক ও রাজস্ব প্রবৃদ্ধি ট্রেন্ড" : "Monthly Financial & Growth Analytics"}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            {isBn
              ? "মাসভিত্তিক রাজস্ব আয়, সদস্য ডিসকাউন্ট বিতরণ ও ক্লিনিক্যাল বিলিং ভলিউমের সামগ্রিক পরিসংখ্যান"
              : "Month-by-month financial progression, subscription collections, and medical volume"}
          </CardDescription>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-muted/60 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-border/60">
          <Button
            type="button"
            variant={metric === "revenue" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMetric("revenue")}
            className={`h-8 px-3 text-xs font-semibold rounded-xl cursor-pointer ${
              metric === "revenue"
                ? "bg-primary text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Coins className="h-3 w-3 mr-1.5" />
            {isBn ? "রাজস্ব" : "Revenue"}
          </Button>

          <Button
            type="button"
            variant={metric === "savings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMetric("savings")}
            className={`h-8 px-3 text-xs font-semibold rounded-xl cursor-pointer ${
              metric === "savings"
                ? "bg-teal-600 text-white shadow-xs hover:bg-teal-700"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HeartHandshake className="h-3 w-3 mr-1.5" />
            {isBn ? "সাশ্রয়" : "Savings"}
          </Button>

          <Button
            type="button"
            variant={metric === "billed" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMetric("billed")}
            className={`h-8 px-3 text-xs font-semibold rounded-xl cursor-pointer ${
              metric === "billed"
                ? "bg-blue-600 text-white shadow-xs hover:bg-blue-700"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="h-3 w-3 mr-1.5" />
            {isBn ? "বিলিং" : "Billing"}
          </Button>

          <Button
            type="button"
            variant={metric === "transactions" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMetric("transactions")}
            className={`h-8 px-3 text-xs font-semibold rounded-xl cursor-pointer ${
              metric === "transactions"
                ? "bg-purple-600 text-white shadow-xs hover:bg-purple-700"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Receipt className="h-3 w-3 mr-1.5" />
            {isBn ? "লেনদেন" : "Visits"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {monthlyFinancials.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            {isBn ? "কোনো আর্থিক রেকর্ড পাওয়া যায়নি।" : "No financial timeline records found."}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart Area */}
            <div className="h-64 sm:h-76 w-full flex items-end justify-between gap-2 sm:gap-4 pt-10 pb-2 px-1 sm:px-3 border-b border-border/60">
              {monthlyFinancials.map((point) => {
                const val = getMetricValue(point);
                const heightPercent = maxValue > 0 ? Math.max((val / maxValue) * 100, 4) : 4;
                const isPeak = peakMonth && point.monthKey === peakMonth.monthKey && val > 0;

                return (
                  <div
                    key={point.monthKey}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                  >
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-20 border border-slate-700">
                      <p className="font-bold">{isBn ? point.monthLabelBn : point.monthLabelEn}</p>
                      <p className="text-emerald-400 font-mono">
                        {metric === "transactions"
                          ? `${formatNum(val, locale)} ${isBn ? "টি ভিজিট" : "visits"}`
                          : `৳${formatNum(val, locale)}`}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {isBn
                          ? `নতুন সদস্য: ${formatNum(point.newMembersCount, locale)} জন`
                          : `New: ${formatNum(point.newMembersCount, locale)} members`}
                      </p>
                    </div>

                    {/* Value above Bar */}
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-muted-foreground group-hover:text-primary transition-colors mb-2 truncate max-w-full">
                      {metric === "transactions"
                        ? formatNum(val, locale)
                        : `৳${formatNum(val, locale)}`}
                    </span>

                    {/* Bar Pillar */}
                    <div className="w-full max-w-[56px] bg-muted/50 dark:bg-slate-800/80 rounded-t-2xl overflow-hidden flex flex-col justify-end h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-2xl transition-all duration-500 ease-out group-hover:brightness-110 ${getMetricGradient()}`}
                      />
                    </div>

                    {/* Month Label */}
                    <div className="mt-2 text-center truncate max-w-full">
                      <span className="text-[10px] sm:text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors block truncate">
                        {isBn ? point.monthLabelBn.split(" ")[0] : point.monthLabelEn.slice(0, 3)}
                      </span>
                      {isPeak && (
                        <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 hidden sm:inline">
                          ★
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Insights Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>
                  {isBn
                    ? `সর্বমোট ${getMetricLabel()}: `
                    : `Total ${getMetricLabel()}: `}
                  <strong className="text-foreground font-mono">
                    {metric === "transactions"
                      ? `${formatNum(totalMetricSum, locale)} ${isBn ? "টি" : "items"}`
                      : `৳${formatNum(totalMetricSum, locale)}`}
                  </strong>
                </span>
              </div>

              {peakMonth && getMetricValue(peakMonth) > 0 && (
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {isBn
                      ? `শীর্ষ মাস: ${peakMonth.monthLabelBn} (${metric === "transactions" ? formatNum(getMetricValue(peakMonth), locale) : "৳" + formatNum(getMetricValue(peakMonth), locale)})`
                      : `Peak Month: ${peakMonth.monthLabelEn} (${metric === "transactions" ? formatNum(getMetricValue(peakMonth), locale) : "৳" + formatNum(getMetricValue(peakMonth), locale)})`}
                  </span>
                </div>
              )}

              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                {isBn ? "রিয়েলটাইম ড্যাশবোর্ড" : "Live Metrics"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
