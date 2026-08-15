"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building,
  Heart,
  DollarSign,
  UserCheck,
  UserX,
  Crown,
  Sparkles,
  CalendarCheck,
  AlertCircle,
  Building2,
  TrendingUp,
  Receipt,
  Award,
  Clock,
  ArrowRight,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export interface AdminStatsData {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  foundingMembers: number;
  premiumMembers: number;
  expiringMembers: number;
  newMembersThisMonth: number;
  partnerCount: number;
  partnerHospitals: number;
  partnerDiagnostics: number;
  partnerPharmacies: number;
  pendingPartnerRequests: number;
  pendingRenewals: number;
  contactMessagesCount: number;
  totalSaved: number;
  thisMonthSaved: number;
  totalTransactions: number;
  thisMonthTransactions: number;
  revenue: number;
  pwaInstalls?: number;
  pwaActive?: number;
  topPartners: Array<{
    id: string;
    name: string;
    totalSaved: number;
    transactionCount: number;
  }>;
}

interface AdminStatsGridProps {
  stats: AdminStatsData;
  onSelectTab?: (tab: string) => void;
}

export function AdminStatsGrid({ stats, onSelectTab }: AdminStatsGridProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const isBn = locale === "bn";

  const handleNavigate = (path: string, legacyTabName?: string) => {
    if (onSelectTab && legacyTabName) {
      onSelectTab(legacyTabName);
    } else {
      router.push(path);
    }
  };

  const hasPendingAlerts =
    stats.pendingPartnerRequests > 0 ||
    stats.pendingRenewals > 0;

  return (
    <div className="space-y-6">
      {/* 1. Actionable Pending Alerts Banner */}
      {hasPendingAlerts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.pendingPartnerRequests > 0 && (
            <Card
              onClick={() => handleNavigate("/admin/partner-requests", "partnerRequests")}
              className="cursor-pointer border-amber-300 dark:border-amber-700/50 bg-amber-500/10 hover:bg-amber-500/15 transition-all shadow-sm group"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-foreground">
                        {isBn ? "পেন্ডিং পার্টনার আবেদন" : "Pending Partner Requests"}
                      </span>
                      <Badge variant="destructive" className="bg-amber-600 hover:bg-amber-700 text-xs px-1.5 py-0">
                        {formatNum(stats.pendingPartnerRequests, locale)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      {isBn ? "পর্যালোচনা করতে ক্লিক করুন" : "Click to review"}
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {stats.pendingRenewals > 0 && (
            <Card
              onClick={() => handleNavigate("/admin/renewals", "renewals")}
              className="cursor-pointer border-indigo-300 dark:border-indigo-700/50 bg-indigo-500/10 hover:bg-indigo-500/15 transition-all shadow-sm group"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-foreground">
                        {isBn ? "নবায়ন আবেদন" : "Pending Renewals"}
                      </span>
                      <Badge className="bg-indigo-600 hover:bg-indigo-700 text-xs px-1.5 py-0">
                        {formatNum(stats.pendingRenewals, locale)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      {isBn ? "অনুমোদন ও আপডেট করুন" : "Approve renewal requests"}
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 2. Main High-Level Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Registered Members */}
        <Link href="/admin/members" className="block group">
          <Card className="border-border shadow-sm group-hover:shadow-md group-hover:border-indigo-300 dark:group-hover:border-indigo-800 transition-all h-full">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
                  {isBn ? "মোট সদস্য" : "Total Members"}
                </p>
                <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono">
                  {formatNum(stats.totalMembers, locale)}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                    <UserCheck className="h-3 w-3" />
                    {formatNum(stats.activeMembers, locale)} {isBn ? "সচল" : "active"}
                  </span>
                  {stats.inactiveMembers > 0 && (
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-0.5">
                      <UserX className="h-3 w-3" />
                      {formatNum(stats.inactiveMembers, locale)} {isBn ? "অচল" : "inactive"}
                    </span>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900 group-hover:scale-105 transition-transform">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Total Partner Facilities */}
        <Link href="/admin/partners" className="block group">
          <Card className="border-border shadow-sm group-hover:shadow-md group-hover:border-emerald-300 dark:group-hover:border-emerald-800 transition-all h-full">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
                  {isBn ? "পার্টনার নেটওয়ার্ক" : "Partner Network"}
                </p>
                <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono">
                  {formatNum(stats.partnerCount, locale)}
                </p>
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
                  <span className="font-semibold text-emerald-600">{formatNum(stats.partnerHospitals, locale)}</span> {isBn ? "হাসপাতাল" : "hosp"} •{" "}
                  <span className="font-semibold text-blue-600">{formatNum(stats.partnerDiagnostics, locale)}</span> {isBn ? "ল্যাব" : "diag"} •{" "}
                  <span className="font-semibold text-purple-600">{formatNum(stats.partnerPharmacies, locale)}</span> {isBn ? "ফার্মেসি" : "pharm"}
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900 group-hover:scale-105 transition-transform">
                <Building className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Total Medical Savings */}
        <Link href="/admin/transactions" className="block group">
          <Card className="border-border shadow-sm group-hover:shadow-md group-hover:border-emerald-300 dark:group-hover:border-emerald-800 transition-all h-full">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
                  {isBn ? "মোট চিকিৎসা ছাড়" : "Total Medical Savings"}
                </p>
                <p className="text-3xl font-extrabold text-primary font-mono">
                  ৳{formatNum(stats.totalSaved, locale)}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 pt-1">
                  <TrendingUp className="h-3 w-3" />
                  {isBn ? "এই মাসে সেভ:" : "This month:"} ৳{formatNum(stats.thisMonthSaved, locale)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/60 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                <Heart className="h-6 w-6 fill-primary/10" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Estimated Revenue */}
        <Link href="/admin/members" className="block group">
          <Card className="border-border shadow-sm group-hover:shadow-md group-hover:border-amber-300 dark:group-hover:border-amber-800 transition-all h-full">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider font-semibold">
                  {isBn ? "মেম্বারশিপ রাজস্ব" : "Est. Revenue"}
                </p>
                <p className="text-3xl font-extrabold text-secondary dark:text-white font-mono">
                  ৳{formatNum(stats.revenue, locale)}
                </p>
                <p className="text-[11px] text-muted-foreground pt-1">
                  {isBn ? "সক্রিয় প্রিমিয়াম ফি থেকে" : "From active premium tier"}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900 group-hover:scale-105 transition-transform">
                <DollarSign className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 3. Deep-Dive Sub-Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Tier & Membership Growth Analytics */}
        <Card className="border-border shadow-sm bg-card">
          <CardContent className="p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                {isBn ? "মেম্বারশিপ টিয়ার" : "Membership Tiers"}
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  {isBn ? "ফাউন্ডিং মেম্বার:" : "Founding:"}
                </span>
                <span className="font-bold font-mono text-foreground">{formatNum(stats.foundingMembers, locale)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5 text-indigo-500" />
                  {isBn ? "প্রিমিয়াম মেম্বার:" : "Premium:"}
                </span>
                <span className="font-bold font-mono text-foreground">{formatNum(stats.premiumMembers, locale)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CalendarCheck className="h-3.5 w-3.5 text-emerald-500" />
                  {isBn ? "চলতি মাসে নতুন:" : "This month:"}
                </span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">+{formatNum(stats.newMembersThisMonth, locale)}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                  {isBn ? "মেয়াদ শেষ হবে:" : "Expiring (30d):"}
                </span>
                <span className={`font-bold font-mono ${stats.expiringMembers > 0 ? "text-rose-600 dark:text-rose-400" : "text-foreground"}`}>
                  {formatNum(stats.expiringMembers, locale)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Volume Analytics */}
        <Card className="border-border shadow-sm bg-card">
          <CardContent className="p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                <Receipt className="h-4 w-4 text-blue-500" />
                {isBn ? "ট্রানজেকশন হিসাব" : "Transactions"}
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{isBn ? "মোট লেনদেন:" : "Total logged:"}</span>
                <span className="font-bold font-mono text-foreground">{formatNum(stats.totalTransactions, locale)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{isBn ? "চলতি মাসের:" : "This month:"}</span>
                <span className="font-bold font-mono text-blue-600 dark:text-blue-400">{formatNum(stats.thisMonthTransactions, locale)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">{isBn ? "চলতি মাসের ছাড়:" : "This mo saving:"}</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">৳{formatNum(stats.thisMonthSaved, locale)}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">{isBn ? "গড় ছাড়/এন্ট্রি:" : "Avg savings:"}</span>
                <span className="font-bold font-mono text-foreground">
                  ৳{formatNum(stats.totalTransactions > 0 ? Math.round(stats.totalSaved / stats.totalTransactions) : 0, locale)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PWA App Install Analytics Card */}
        <Link href="/admin/pwa" className="block group">
          <Card className="border-border shadow-sm bg-card group-hover:border-emerald-400 dark:group-hover:border-emerald-700 transition-all h-full">
            <CardContent className="p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-emerald-500" />
                  {isBn ? "PWA অ্যাপ ইনস্টল" : "PWA App Analytics"}
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold group-hover:underline flex items-center gap-0.5">
                  {isBn ? "ডিটেইলস" : "Details"}
                  <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">{isBn ? "সর্বমোট PWA ইনস্টল:" : "Total Installs:"}</span>
                  <span className="font-bold font-mono text-foreground">{formatNum(stats.pwaInstalls ?? 0, locale)}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {isBn ? "সক্রিয় PWA (৩০ দিন):" : "Active PWA (30d):"}
                  </span>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatNum(stats.pwaActive ?? 0, locale)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">{isBn ? "নিষ্ক্রিয়/আনইনস্টল:" : "Inactive/Uninstalled:"}</span>
                  <span className="font-bold font-mono text-slate-500">
                    {formatNum(Math.max(0, (stats.pwaInstalls ?? 0) - (stats.pwaActive ?? 0)), locale)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">{isBn ? "সক্রিয় রিটেনশন:" : "Active Retention:"}</span>
                  <span className="font-bold font-mono text-foreground">
                    {(stats.pwaInstalls ?? 0) > 0
                      ? `${Math.round(((stats.pwaActive ?? 0) / (stats.pwaInstalls ?? 1)) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Top Performing Partners by Savings */}
        <Card className="border-border shadow-sm bg-card">
          <CardContent className="p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                {isBn ? "শীর্ষ পার্টনার হাসপাতাল" : "Top Partner Facilities"}
              </h3>
            </div>

            {stats.topPartners && stats.topPartners.length > 0 ? (
              <div className="space-y-2 text-xs">
                {stats.topPartners.map((partner, index) => (
                  <div key={partner.id || index} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
                    <div className="flex items-center gap-2 truncate max-w-[130px]">
                      <span className="h-4 w-4 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-medium text-foreground truncate">{partner.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                        ৳{formatNum(partner.totalSaved, locale)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatNum(partner.transactionCount, locale)} {isBn ? "ট্রানজেকশন" : "txs"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">
                {isBn ? "এখনো ট্রানজেকশন এন্ট্রি হয়নি" : "No partner transaction data yet"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
