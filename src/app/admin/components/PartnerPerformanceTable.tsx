"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TopPartnerPerformance } from "@/types/revenueAnalytics";
import { formatNum, Locale } from "@/lib/i18n";
import {
  Building2,
  Activity,
  Pill,
  Search,
  Trophy,
  Users,
  Percent,
} from "lucide-react";

interface PartnerPerformanceTableProps {
  partners: TopPartnerPerformance[];
  locale: Locale;
}

export function PartnerPerformanceTable({
  partners,
  locale,
}: PartnerPerformanceTableProps) {
  const isBn = locale === "bn";
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      p.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "hospital":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[11px] gap-1 font-semibold"
          >
            <Building2 className="h-3 w-3" />
            {isBn ? "হাসপাতাল" : "Hospital"}
          </Badge>
        );
      case "diagnostic":
        return (
          <Badge
            variant="outline"
            className="bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30 text-[11px] gap-1 font-semibold"
          >
            <Activity className="h-3 w-3" />
            {isBn ? "ডায়াগনস্টিক" : "Diagnostic"}
          </Badge>
        );
      case "pharmacy":
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[11px] gap-1 font-semibold"
          >
            <Pill className="h-3 w-3" />
            {isBn ? "ফার্মেসি" : "Pharmacy"}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[11px]">
            {category}
          </Badge>
        );
    }
  };

  return (
    <Card className="border-border/80 shadow-xs rounded-3xl bg-card">
      <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Trophy className="h-4 w-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold font-heading text-secondary dark:text-white">
              {isBn ? "শীর্ষ পার্টনার হাসপাতাল ও ডায়াগনস্টিক পারফরম্যান্স" : "Top Partner Hospitals & Clinic Rankings"}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            {isBn
              ? "সদস্যদের চিকিৎসা সাশ্রয় ও রোগী ভলিউমের ভিত্তিতে পার্টনারদের তুলনামূলক র‍্যাংকিং"
              : "Ranking of partner medical centers by total discount delivered and patient traffic"}
          </CardDescription>
        </div>

        {/* Filter Badges & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={isBn ? "হাসপাতাল খুঁজুন..." : "Search partner..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-muted/60 dark:bg-slate-900/80 p-1 rounded-xl border border-border/60">
            {["all", "hospital", "diagnostic", "pharmacy"].map((cat) => (
              <Button
                key={cat}
                type="button"
                variant={categoryFilter === cat ? "default" : "ghost"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
                className={`h-6 px-2 text-[11px] font-semibold rounded-lg ${
                  categoryFilter === cat
                    ? "bg-primary text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "all"
                  ? isBn
                    ? "সকল"
                    : "All"
                  : cat === "hospital"
                  ? isBn
                    ? "হাসপাতাল"
                    : "Hospitals"
                  : cat === "diagnostic"
                  ? isBn
                    ? "ডায়াগনস্টিক"
                    : "Diagnostics"
                  : isBn
                  ? "ফার্মেসি"
                  : "Pharmacies"}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 sm:p-6">
        {filteredPartners.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            {isBn ? "কোনো পার্টনার রেকর্ড পাওয়া যায়নি।" : "No partner data available matching criteria."}
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-muted/40 border-y border-border/50">
                  <tr>
                    <th className="py-3 px-4 font-bold">{isBn ? "র‍্যাংক ও পার্টনার" : "Rank & Partner"}</th>
                    <th className="py-3 px-4 font-bold">{isBn ? "ক্যাটাগরি" : "Category"}</th>
                    <th className="py-3 px-4 font-bold text-center">{isBn ? "রোগী লেনদেন" : "Visits"}</th>
                    <th className="py-3 px-4 font-bold text-right">{isBn ? "মোট বিলিং" : "Total Billed"}</th>
                    <th className="py-3 px-4 font-bold text-right">{isBn ? "মোট ডিসকাউন্ট সাশ্রয়" : "Total Saved"}</th>
                    <th className="py-3 px-4 font-bold text-center">{isBn ? "গড় ডিসকাউন্ট হার" : "Avg Discount"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 font-medium">
                  {filteredPartners.map((partner, index) => {
                    return (
                      <tr
                        key={partner.partnerId}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-6 w-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                                index === 0
                                  ? "bg-amber-500 text-white shadow-xs"
                                  : index === 1
                                  ? "bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                                  : index === 2
                                  ? "bg-amber-700/60 text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                                {partner.partnerName}
                              </p>
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-normal">
                                <Users className="h-3 w-3" />
                                {formatNum(partner.uniquePatients, locale)} {isBn ? "জন স্বতন্ত্র সদস্য" : "unique patients"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">{getCategoryBadge(partner.category)}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-foreground">
                          {formatNum(partner.transactionCount, locale)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-muted-foreground">
                          ৳{formatNum(partner.totalBilled, locale)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ৳{formatNum(partner.totalSaved, locale)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                            <Percent className="h-2.5 w-2.5" />
                            {formatNum(partner.averageSavingsRate, locale)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredPartners.map((partner, index) => (
                <div key={partner.partnerId} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{partner.partnerName}</h4>
                        <p className="text-[11px] text-muted-foreground">
                          {formatNum(partner.uniquePatients, locale)} {isBn ? "জন সদস্য সেবা নিয়েছেন" : "patients served"}
                        </p>
                      </div>
                    </div>
                    {getCategoryBadge(partner.category)}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs border-t border-border/40 font-mono">
                    <div className="p-2 rounded-xl bg-muted/40 text-center">
                      <span className="text-[10px] text-muted-foreground block font-sans">{isBn ? "মোট লেনদেন" : "Visits"}</span>
                      <span className="font-bold">{formatNum(partner.transactionCount, locale)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-muted/40 text-center">
                      <span className="text-[10px] text-muted-foreground block font-sans">{isBn ? "মোট বিল" : "Billed"}</span>
                      <span className="font-bold">৳{formatNum(partner.totalBilled, locale)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-emerald-700 dark:text-emerald-300">
                      <span className="text-[10px] block font-sans">{isBn ? "মোট সাশ্রয়" : "Saved"}</span>
                      <span className="font-bold">৳{formatNum(partner.totalSaved, locale)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
