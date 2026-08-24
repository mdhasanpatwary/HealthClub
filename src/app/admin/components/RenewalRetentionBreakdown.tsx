"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RenewalRetentionMetrics, TierBreakdownMetrics } from "@/types/revenueAnalytics";
import { formatNum, Locale } from "@/lib/i18n";
import {
  RotateCcw,
  CreditCard,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

interface RenewalRetentionBreakdownProps {
  renewalMetrics: RenewalRetentionMetrics;
  tierBreakdown: TierBreakdownMetrics;
  locale: Locale;
}

export function RenewalRetentionBreakdown({
  renewalMetrics,
  tierBreakdown,
  locale,
}: RenewalRetentionBreakdownProps) {
  const isBn = locale === "bn";

  const totalMembers = tierBreakdown.foundingCount + tierBreakdown.premiumCount;
  const premiumPercent =
    totalMembers > 0 ? Math.round((tierBreakdown.premiumCount / totalMembers) * 100) : 0;
  const foundingPercent =
    totalMembers > 0 ? Math.round((tierBreakdown.foundingCount / totalMembers) * 100) : 0;

  const totalRenewalEligible = Math.max(
    renewalMetrics.renewedCount + renewalMetrics.pendingCount + renewalMetrics.expiredCount,
    1
  );
  const renewedPercent = Math.round((renewalMetrics.renewedCount / totalRenewalEligible) * 100);
  const pendingPercent = Math.round((renewalMetrics.pendingCount / totalRenewalEligible) * 100);
  const expiredPercent = Math.round((renewalMetrics.expiredCount / totalRenewalEligible) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Membership Tier & Subscription Breakdown */}
      <Card className="border-border/80 shadow-xs rounded-3xl bg-card flex flex-col justify-between">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold font-heading text-secondary dark:text-white">
                {isBn ? "মেম্বারশিপ প্ল্যান ও রাজস্ব উৎস বিভাজন" : "Membership Tier Revenue Breakdown"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {isBn
                  ? "ফাউন্ডিং ও প্রিমিয়াম সদস্য সংখ্যার অনুপাত ও রাজস্ব অবদান"
                  : "Ratio of founding vs paid premium subscribers & subscription contribution"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Premium Tier Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                    {isBn ? "প্রিমিয়াম মেম্বারশিপ (পেইড)" : "Premium Tier (Paid)"}
                  </span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px] py-0">
                    ৳{formatNum(tierBreakdown.premiumFee, locale)} / {isBn ? "বছর" : "yr"}
                  </Badge>
                </div>
                <div className="font-mono text-muted-foreground">
                  <span className="text-foreground font-bold">{formatNum(tierBreakdown.premiumCount, locale)}</span> {isBn ? "জন" : "users"} ({formatNum(premiumPercent, locale)}%)
                </div>
              </div>
              <div className="h-2.5 w-full bg-muted/60 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${premiumPercent}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground pt-0.5">
                <span>{isBn ? "উৎপন্ন বার্ষিক রাজস্ব:" : "Annual Revenue Generated:"}</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ৳{formatNum(tierBreakdown.premiumRevenue, locale)}
                </span>
              </div>
            </div>

            {/* Founding Tier Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">
                    {isBn ? "ফাউন্ডিং মেম্বারশিপ" : "Founding Tier"}
                  </span>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30 text-[10px] py-0">
                    ৳{formatNum(tierBreakdown.foundingFee, locale)} / {isBn ? "বছর" : "yr"}
                  </Badge>
                </div>
                <div className="font-mono text-muted-foreground">
                  <span className="text-foreground font-bold">{formatNum(tierBreakdown.foundingCount, locale)}</span> {isBn ? "জন" : "users"} ({formatNum(foundingPercent, locale)}%)
                </div>
              </div>
              <div className="h-2.5 w-full bg-muted/60 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${foundingPercent}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500"
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground pt-0.5">
                <span>{isBn ? "উৎপন্ন বার্ষিক রাজস্ব:" : "Annual Revenue Generated:"}</span>
                <span className="font-mono font-bold text-foreground">
                  ৳{formatNum(tierBreakdown.foundingRevenue, locale)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="font-bold">{isBn ? "মোট সক্রিয় গ্রাহক নেটওয়ার্ক:" : "Total Active Subscribed Base:"}</span>
            </div>
            <span className="font-mono font-bold text-sm">
              {formatNum(totalMembers, locale)} {isBn ? "জন" : "members"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Renewal & Retention Pipeline */}
      <Card className="border-border/80 shadow-xs rounded-3xl bg-card flex flex-col justify-between">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-4 border-b border-border/40">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold font-heading text-secondary dark:text-white">
                  {isBn ? "নবায়ন পাইপলাইন ও রিটেনশন রেট" : "Renewal Pipeline & Retention Rate"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {isBn
                    ? "মেম্বারশিপ মেয়াদোত্তীর্ণ ও বাৎসরিক নবায়ন কার্যকারিতা"
                    : "Annual membership renewal status and conversion efficiency"}
                </CardDescription>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
              {formatNum(renewalMetrics.retentionRate, locale)}% {isBn ? "রিটেনশন" : "retention"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-3.5">
            {/* Status Item 1: Renewed */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-foreground">{isBn ? "অনুমোদিত ও সফল নবায়ন" : "Approved Renewals"}</p>
                  <p className="text-[11px] text-muted-foreground">{isBn ? "সফলভাবে পরবর্তী বছরের জন্য সম্প্রসারিত" : "Extended for another 1 year"}</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatNum(renewalMetrics.renewedCount, locale)}
                </span>
                <span className="text-[10px] text-muted-foreground block">({formatNum(renewedPercent, locale)}%)</span>
              </div>
            </div>

            {/* Status Item 2: Pending Renewals */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-foreground">{isBn ? "পর্যালোচনায় থাকা নবায়ন আবেদন" : "Pending Renewal Requests"}</p>
                  <p className="text-[11px] text-muted-foreground">{isBn ? "বিকাশ TrxID ভেরিফিকেশনের অপেক্ষায়" : "Awaiting bKash TrxID verification"}</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {formatNum(renewalMetrics.pendingCount, locale)}
                </span>
                <span className="text-[10px] text-muted-foreground block">({formatNum(pendingPercent, locale)}%)</span>
              </div>
            </div>

            {/* Status Item 3: Expired / Not Renewed */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs">
              <div className="flex items-center gap-2.5">
                <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <div>
                  <p className="font-bold text-foreground">{isBn ? "মেয়াদোত্তীর্ণ ও নিষ্ক্রিয়" : "Expired / Inactive"}</p>
                  <p className="text-[11px] text-muted-foreground">{isBn ? "১ বছর অতিবাহিত হয়েছে কিন্তু নবায়ন করা হয়নি" : "Overdue 1 year without renewal"}</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                  {formatNum(renewalMetrics.expiredCount, locale)}
                </span>
                <span className="text-[10px] text-muted-foreground block">({formatNum(expiredPercent, locale)}%)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              {isBn
                ? `হেলথ ক্লাবের গ্রাহক রিটেনশন স্বাস্থ্য অত্যন্ত সন্তোষজনক (${formatNum(renewalMetrics.retentionRate, locale)}%)। সময়মতো রিনিউয়াল রিমাইন্ডার এসএমএস প্রেরণ রিটেনশন হার আরও বৃদ্ধি করবে।`
                : `Health Club member retention is healthy at ${formatNum(renewalMetrics.retentionRate, locale)}%. Automated renewal reminders will further boost annual retention.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
