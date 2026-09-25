"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Sparkles, X, Clock, ShieldCheck, ArrowRight, Filter } from "lucide-react";
import { DiagnosticTestPriceItem } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toBanglaNums } from "@/lib/utils";

interface MedicalTestPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    tests: DiagnosticTestPriceItem[];
  };
}

export function MedicalTestPriceTable({
  pricingData,
}: MedicalTestPriceTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Distinct category list
  const categories = useMemo(() => {
    const set = new Set<string>();
    pricingData.tests.forEach((t) => {
      if (t.categoryBn) set.add(t.categoryBn);
    });
    return Array.from(set);
  }, [pricingData.tests]);

  // Filtered test items
  const filteredTests = useMemo(() => {
    return pricingData.tests.filter((test) => {
      const matchesCategory =
        selectedCategory === "all" || test.categoryBn === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchBn = test.testNameBn.toLowerCase().includes(q);
      const matchEn = test.testNameEn.toLowerCase().includes(q);
      const matchCatBn = test.categoryBn.toLowerCase().includes(q);

      return matchBn || matchEn || matchCatBn;
    });
  }, [pricingData.tests, selectedCategory, searchQuery]);

  return (
    <section id="price-guide" className="scroll-mt-24 space-y-6">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>প্রমিত ডায়াগনস্টিক ও প্যাথলজি খরচ ডিরেক্টরি ২০২৬</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          ২. {pricingData.titleBn}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {pricingData.subtitleBn}
        </p>
      </div>

      {/* Interactive Controls: Search & Category Chips */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 space-y-4 shadow-xs">
        {/* Instant Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="টেস্টের নাম দিয়ে খুঁজুন (যেমন: CBC, MRI, CT, সুগার, আল্ট্রাসাউন্ড, থাইরয়েড)..."
            className="pl-10 pr-9 h-11 text-xs sm:text-sm rounded-xl bg-background border-border/80"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="সার্চ মুছুন"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips - Mobile Scrollable */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <Filter className="h-3.5 w-3.5" />
              <span>বিভাগ অনুযায়ী ফিল্টার করুন:</span>
            </span>
            <span className="font-semibold text-primary">
              {toBanglaNums(filteredTests.length)}টি টেস্ট পাওয়া গেছে (মোট {toBanglaNums(pricingData.tests.length)}টি)
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer border ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted border-border/60"
              }`}
            >
              সকল টেস্ট ({toBanglaNums(pricingData.tests.length)})
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted border-border/60"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tests Table */}
      {filteredTests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-3 bg-muted/20">
          <p className="text-sm font-medium text-foreground">
            আপনার সার্চের সাথে মিলে এমন কোনো ডায়াগনস্টিক টেস্ট পাওয়া যায়নি।
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="rounded-xl"
          >
            সকল ফিল্টার রিসেট করুন
          </Button>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex sm:hidden items-center justify-end text-[11px] text-muted-foreground px-1">
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true">↔</span>
              <span>সম্পূর্ণ তথ্য দেখতে ডানে-বামে স্ক্রোল করুন</span>
            </span>
          </div>
          <div className="relative overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/80 text-foreground font-bold border-b border-border/80">
                <tr>
                  <th scope="col" className="py-3.5 px-3 sm:px-4 min-w-[220px]">
                    পরীক্ষার নাম ও বিভাগ
                  </th>
                  <th scope="col" className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                    সাধারণ বাজারদর
                  </th>
                  <th scope="col" className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                    হেলথ ক্লাব মেম্বার সুবিধা
                  </th>
                  <th scope="col" className="py-3.5 px-3 sm:px-4 whitespace-nowrap text-center">
                    রিপোর্ট সময়
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTests.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-3 sm:px-4">
                      <span className="font-semibold text-foreground block">
                        {item.testNameBn}
                      </span>
                      <span className="text-[11px] text-muted-foreground inline-block mt-0.5">
                        {item.categoryBn}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap font-medium text-foreground">
                      {item.regularPriceRangeBn}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                      <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500/20 dark:text-emerald-300 border-0 font-bold text-[11px] sm:text-xs">
                        <ShieldCheck className="h-3 w-3 mr-1 shrink-0 inline" />
                        ১০-৩০% মেম্বার ছাড়
                      </Badge>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                        <span>{item.turnaroundTimeBn}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Membership Conversion Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>দালালি কমিশন মুক্ত সরাসরি ডায়াগনস্টিক মেম্বার ছাড়</span>
          </div>
          <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
            ফেনীর শীর্ষ ডায়াগনস্টিক সেন্টারে প্রতিটি টেস্টে ১০-৩০% মেম্বার ছাড় পান
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            আজই পরিবারের জন্য ডিজিটাল হেলথ ক্লাব কার্ড সংগ্রহ করে প্যাথলজি ও রেডিওলজি পরীক্ষায় নিশ্চিত ছাড় ও অগ্রাধিকার সেবা নিন।
          </p>
        </div>
        <Link
          href="/membership"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:gap-3 shrink-0 w-full sm:w-auto"
        >
          <span>মেম্বারশিপ কার্ড নিন</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
