"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RevenueKpis } from "@/types/revenueAnalytics";
import { formatNum, Locale } from "@/lib/i18n";
import {
  Coins,
  HeartHandshake,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Users,
  CreditCard,
  Building2,
} from "lucide-react";

interface RevenueKpiCardsProps {
  kpis: RevenueKpis;
  locale: Locale;
}

export function RevenueKpiCards({ kpis, locale }: RevenueKpiCardsProps) {
  const isBn = locale === "bn";

  const cards = [
    {
      title: isBn ? "মোট সাবস্ক্রিপশন রাজস্ব" : "Total Subscription Revenue",
      value: `৳${formatNum(kpis.totalSubscriptionRevenue, locale)}`,
      icon: Coins,
      subtitle: isBn
        ? `চলতি মাসে: ৳${formatNum(kpis.thisMonthSubscriptionRevenue, locale)}`
        : `This Month: ৳${formatNum(kpis.thisMonthSubscriptionRevenue, locale)}`,
      badge: isBn ? "সক্রিয় সদস্য ফি" : "Active Member Fees",
      gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
      borderColor: "border-emerald-500/30",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      textColor: "text-emerald-700 dark:text-emerald-300",
    },
    {
      title: isBn ? "মোট সদস্য চিকিৎসা সাশ্রয়" : "Total Member Medical Savings",
      value: `৳${formatNum(kpis.totalMemberSavings, locale)}`,
      icon: HeartHandshake,
      subtitle: isBn
        ? `গড় সাশ্রয়: ৳${formatNum(kpis.averageSavingPerTransaction, locale)} / রোগী`
        : `Avg: ৳${formatNum(kpis.averageSavingPerTransaction, locale)} / patient`,
      badge: isBn
        ? `চলতি মাসে ৳${formatNum(kpis.thisMonthMemberSavings, locale)}`
        : `৳${formatNum(kpis.thisMonthMemberSavings, locale)} this mo`,
      gradient: "from-teal-500/15 via-teal-500/5 to-transparent",
      borderColor: "border-teal-500/30",
      iconBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
      textColor: "text-teal-700 dark:text-teal-300",
    },
    {
      title: isBn ? "গ্রস মেডিকেল বিলিং ভলিউম" : "Gross Medical Bill Volume",
      value: `৳${formatNum(kpis.totalMedicalBilled, locale)}`,
      icon: Building2,
      subtitle: isBn
        ? `মোট ${formatNum(kpis.totalTransactions, locale)} টি ডিসকাউন্ট লেনদেন`
        : `${formatNum(kpis.totalTransactions, locale)} total discount visits`,
      badge: isBn ? "হাসপাতাল টার্নওভার" : "Hospital Turnover",
      gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
      borderColor: "border-blue-500/30",
      iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: isBn ? "নবায়ন রিটেনশন রেট" : "Annual Renewal Retention Rate",
      value: `${formatNum(kpis.renewalRetentionRate, locale)}%`,
      icon: RotateCcw,
      subtitle: isBn
        ? `${formatNum(kpis.totalRenewedCount, locale)} জন সফল নবায়ন (${formatNum(kpis.pendingRenewalsCount, locale)} টি পেন্ডিং)`
        : `${formatNum(kpis.totalRenewedCount, locale)} renewed (${formatNum(kpis.pendingRenewalsCount, locale)} pending)`,
      badge: isBn ? "মেম্বারশিপ স্থায়িত্ব" : "Member Retention",
      gradient: "from-purple-500/15 via-purple-500/5 to-transparent",
      borderColor: "border-purple-500/30",
      iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
      textColor: "text-purple-700 dark:text-purple-300",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card
              key={idx}
              className={`relative overflow-hidden border ${card.borderColor} shadow-xs hover:shadow-md transition-all duration-200 bg-card`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} pointer-events-none`} />
              <CardContent className="p-5 relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground block">
                      {card.title}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-secondary dark:text-white tracking-tight">
                      {card.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-2xl ${card.iconBg} shadow-xs shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground truncate">
                    {card.subtitle}
                  </span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] shrink-0 bg-muted/80 ${card.textColor}`}>
                    {card.badge}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secondary Fast Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-muted/40 dark:bg-slate-900/50 border border-border/70 text-xs">
        <div className="flex items-center gap-2.5 px-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">{isBn ? "মোট নিবন্ধিত সদস্য" : "Total Members"}</p>
            <p className="font-bold font-mono text-foreground text-sm">
              {formatNum(kpis.totalMembersCount, locale)} {isBn ? "জন" : "members"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">{isBn ? "প্রিমিয়াম গ্রাহক" : "Premium Subscribers"}</p>
            <p className="font-bold font-mono text-foreground text-sm">
              {formatNum(kpis.activePremiumCount, locale)} {isBn ? "জন (পেইড)" : "paid"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">{isBn ? "ফাউন্ডিং সদস্য" : "Founding Members"}</p>
            <p className="font-bold font-mono text-foreground text-sm">
              {formatNum(kpis.activeFoundingCount, locale)} {isBn ? "জন" : "founding"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">{isBn ? "গড় মেডিকেল বিল" : "Avg Bill / Visit"}</p>
            <p className="font-bold font-mono text-foreground text-sm">
              ৳{formatNum(kpis.averageBillPerTransaction, locale)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
