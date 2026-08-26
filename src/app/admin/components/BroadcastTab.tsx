"use client";

import { useState, useEffect } from "react";
import {
  Send,
  History,
  Users,
  Building2,
  Droplet,
  RefreshCw,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import {
  BroadcastAudienceCounts,
  BroadcastCampaignRecord,
  getBroadcastAudienceCountsAction,
  getBroadcastCampaignsAction,
} from "@/app/actions/broadcastActions";
import { BroadcastComposer } from "./broadcast/BroadcastComposer";
import { BroadcastHistoryList } from "./broadcast/BroadcastHistoryList";

export function BroadcastTab() {
  const { locale, t } = useLanguage();
  const isBn = locale === "bn";

  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [counts, setCounts] = useState<BroadcastAudienceCounts>({
    allMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    bloodDonors: 0,
    partners: 0,
    totalUniqueUsers: 0,
  });

  const [campaigns, setCampaigns] = useState<BroadcastCampaignRecord[]>([]);

  const loadData = async () => {
    try {
      const [audienceCounts, campaignList] = await Promise.all([
        getBroadcastAudienceCountsAction(),
        getBroadcastCampaignsAction(),
      ]);
      setCounts(audienceCounts);
      setCampaigns(campaignList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCampaignSent = (newCamp?: BroadcastCampaignRecord) => {
    if (newCamp) {
      setCampaigns((prev) => [newCamp, ...prev]);
      setActiveTab("history");
    } else {
      loadData();
    }
  };

  const handleCampaignDeleted = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center border-b border-border pb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t("admin.broadcast.title") || "ব্রডকাস্ট এসএমএস ও ইমেইল ক্যাম্পেইন ম্যানেজার"}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {t("admin.broadcast.desc") ||
              "ফ্রি হেলথ ক্যাম্প, নতুন ডিসকাউন্ট, জরুরি রক্তদান বা নোটিশ সকল সদস্য ও পার্টনারদের কাছে এক ক্লিকে সম্প্রচার করুন"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-xl cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw
              className={`h-4 w-4 text-muted-foreground ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reach */}
        <Card className="border-border shadow-xs bg-card rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase">
                {isBn ? "সর্বমোট নেটওয়ার্ক রিচ" : "Total Reach"}
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {formatNum(counts.totalUniqueUsers, locale)}
              </p>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                {isBn ? "সকল নিবন্ধিত ইউজার" : "all community users"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Active Members */}
        <Card className="border-border shadow-xs bg-card rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase">
                {isBn ? "সক্রিয় মেম্বারশিপ" : "Active Members"}
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {formatNum(counts.activeMembers, locale)}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {formatNum(counts.allMembers, locale)} {isBn ? "জনের মধ্যে" : "total"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Blood Donors */}
        <Card className="border-border shadow-xs bg-card rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase">
                {isBn ? "জরুরি রক্তদাতা" : "Blood Donors"}
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {formatNum(counts.bloodDonors, locale)}
              </p>
              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                {isBn ? "জরুরি এসএমএস নেটওয়ার্ক" : "emergency network"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
              <Droplet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Partners */}
        <Card className="border-border shadow-xs bg-card rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase">
                {isBn ? "পার্টনার চিকিৎসাকেন্দ্র" : "Partner Centers"}
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {formatNum(counts.partners, locale)}
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                {isBn ? "হাসপাতাল ও ল্যাব" : "hospitals & labs"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Control */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("compose")}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-initial shrink-0 ${
            activeTab === "compose"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Send className="h-4 w-4" />
          <span>{isBn ? "নতুন ক্যাম্পেইন সম্প্রচার" : "Compose & Blast"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-initial shrink-0 ${
            activeTab === "history"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <History className="h-4 w-4" />
          <span>{isBn ? "সম্প্রচার ইতিহাস ও রিপোর্ট" : "Campaign History"}</span>
          {campaigns.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-background/20 font-bold">
              {formatNum(campaigns.length, locale)}
            </span>
          )}
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === "compose" ? (
        <BroadcastComposer
          counts={counts}
          locale={locale}
          onCampaignSent={handleCampaignSent}
        />
      ) : (
        <BroadcastHistoryList
          campaigns={campaigns}
          locale={locale}
          onCampaignDeleted={handleCampaignDeleted}
        />
      )}
    </div>
  );
}
