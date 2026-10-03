"use client";

import { useState, useMemo } from "react";
import { EmergencyHotline } from "@/data/emergencyData";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShieldAlert, PhoneCall, Search, Building2, Wind, Droplets, Siren } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface HotlineDirectoryProps {
  initialHotlines?: EmergencyHotline[];
}

const CATEGORY_MAP: Record<string, { labelBn: string; icon: typeof ShieldAlert }> = {
  hospital: { labelBn: "হাসপাতাল", icon: Building2 },
  oxygen: { labelBn: "অক্সিজেন সেবা", icon: Wind },
  blood_bank: { labelBn: "রক্ত কেন্দ্র", icon: Droplets },
  fire_service: { labelBn: "ফায়ার সার্ভিস", icon: Siren },
  police: { labelBn: "পুলিশ / নিরাপত্তা", icon: ShieldAlert },
  government: { labelBn: "সরকারি হেল্পলাইন", icon: ShieldAlert },
};

export function HotlineDirectory({ initialHotlines = [] }: HotlineDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const hotlinesList = useMemo(() => initialHotlines ?? [], [initialHotlines]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    hotlinesList.forEach((h) => {
      if (h.category) set.add(h.category);
    });
    return Array.from(set);
  }, [hotlinesList]);

  const filteredHotlines = useMemo(() => {
    return hotlinesList.filter((h) => {
      const matchCat = selectedCategory === "all" || h.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        (h.titleBn && h.titleBn.toLowerCase().includes(q)) ||
        (h.titleEn && h.titleEn.toLowerCase().includes(q)) ||
        (h.phone && h.phone.includes(q)) ||
        (h.descriptionBn && h.descriptionBn.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [hotlinesList, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Screen Reader Live Announcement */}
      <div aria-live="polite" role="status" aria-atomic="true" className="sr-only">
        {filteredHotlines.length}টি জরুরি হটলাইন নম্বর পাওয়া গেছে
      </div>

      {/* Header Info Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-1">
        <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white flex items-center gap-2">
          <PhoneCall className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          ফেনীর জরুরি হটলাইন ও মেডিকেল হেল্পলাইন নম্বর
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          হাসপাতাল জরুরি বিভাগ, অক্সিজেন সিলিন্ডার হোম ডেলিভারি, ফায়ার সার্ভিস, পুলিশ ও সরকারি স্বাস্থ্য বাতায়ন নম্বরে এক ক্লিকে সরাসরি কল করুন।
        </p>
      </div>

      {/* Filters & Search */}
      <div className="space-y-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            role="button"
            aria-pressed={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground border border-border/50"
            }`}
          >
            সব হটলাইন ({hotlinesList.length})
          </button>
          {categories.map((cat) => {
            const catMeta = CATEGORY_MAP[cat];
            const label = catMeta?.labelBn || cat.replace("_", " ");
            const isSelected = selectedCategory === cat;
            return (
              <button
                type="button"
                role="button"
                key={cat}
                aria-pressed={isSelected}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="হাসপাতাল, অক্সিজেন, ফায়ার সার্ভিস বা জরুরি নম্বর দিয়ে খুঁজুন"
            placeholder="হাসপাতাল, অক্সিজেন, ফায়ার সার্ভিস বা জরুরি নম্বর দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9.5 h-10 bg-background text-sm rounded-xl border-border"
          />
        </div>
      </div>

      {/* Count Info */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-muted-foreground">
          মোট {filteredHotlines.length}টি জরুরি হেল্পলাইন নম্বর প্রদর্শিত
        </p>
      </div>

      {/* Hotlines Grid */}
      {filteredHotlines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHotlines.map((hotline) => {
            const catMeta = CATEGORY_MAP[hotline.category];
            const CatIcon = catMeta?.icon || ShieldAlert;
            const catLabel = catMeta?.labelBn || hotline.category.replace("_", " ");

            return (
              <Card
                key={hotline.id}
                className="border border-border/80 bg-background hover:border-amber-500/40 transition-all duration-300 shadow-xs flex flex-col justify-between"
              >
                <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      <CatIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{catLabel}</span>
                    </div>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-secondary dark:text-white">
                      {hotline.titleBn || hotline.titleEn}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {hotline.descriptionBn || hotline.descriptionEn}
                    </p>
                  </div>

                  <a
                    href={`tel:${hotline.phone}`}
                    onClick={() => {
                      trackEvent("emergency_dial", {
                        service_type: "hotline",
                        target_name: hotline.titleBn || hotline.titleEn,
                        phone: hotline.phone,
                      });
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.98]"
                    aria-label={`কল করুন: ${hotline.titleBn || hotline.titleEn} (${hotline.phone})`}
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>কল করুন: {hotline.phone}</span>
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-muted/40 rounded-2xl border border-dashed border-border space-y-2">
          <PhoneCall className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-muted-foreground">
            আপনার অনুসন্ধানের সাথে মিলে এমন কোনো হটলাইন নম্বর পাওয়া যায়নি।
          </p>
        </div>
      )}
    </div>
  );
}
