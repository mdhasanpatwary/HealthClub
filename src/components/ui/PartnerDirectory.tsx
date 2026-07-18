"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Phone, Hospital, ShieldAlert, Pill, HeartHandshake } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Partner } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatDiscount } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";

interface PartnerDirectoryProps {
  limit?: number;
  showFilters?: boolean;
}

export default function PartnerDirectory({ limit, showFilters = true }: PartnerDirectoryProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { locale, t } = useLanguage();

  useEffect(() => {
    dbStore.getPartners().then((data) => {
      setPartners(data);
      setLoading(false);
    });
  }, []);

  // Filter partners
  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Apply limit if specified
  const displayedPartners = limit ? filteredPartners.slice(0, limit) : filteredPartners;

  // Category Icon Renderer
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hospital":
        return <Hospital className="h-6 w-6 text-emerald-600" />;
      case "diagnostic":
        return <ShieldAlert className="h-6 w-6 text-indigo-600" />;
      case "pharmacy":
        return <Pill className="h-6 w-6 text-amber-600" />;
      default:
        return <HeartHandshake className="h-6 w-6 text-primary" />;
    }
  };

  // Category Label translation
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "hospital":
        return t("ui.partnerdirectory.hospital");
      case "diagnostic":
        return t("ui.partnerdirectory.diagnostic");
      case "pharmacy":
        return t("ui.partnerdirectory.pharmacy");
      default:
        return t("ui.partnerdirectory.healthcare");
    }
  };

  const categories = [
    { value: "all", label: t("ui.partnerdirectory.allCategories") },
    { value: "hospital", label: t("ui.partnerdirectory.hospital") },
    { value: "diagnostic", label: t("ui.partnerdirectory.diagnosticCenter") },
    { value: "pharmacy", label: t("ui.partnerdirectory.pharmacy") },
  ];

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("ui.partnerdirectory.searchByHospitalNameOr")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-border bg-background"
          />
        </div>

        {/* Category Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                  selectedCategory === cat.value
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit || 6 }).map((_, i) => (
            <Card key={i} className="border-border bg-background/50 backdrop-blur group flex flex-col justify-between h-[210px]">
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="space-y-2 mt-2">
                    <Skeleton className="h-5 w-3/4 animate-pulse" />
                    <Skeleton className="h-4 w-1/2 animate-pulse" />
                  </div>
                </div>
                <div className="pt-4 border-t border-border mt-4 flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayedPartners.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPartners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-lg transition-all duration-300 border-border bg-background/50 backdrop-blur group flex flex-col justify-between">
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Top Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
                      {getCategoryIcon(partner.category)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-border">
                      {getCategoryLabel(partner.category)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-lg font-bold text-secondary dark:text-white line-clamp-1">
                      {partner.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {partner.mapLink ? (
                        <a href={partner.mapLink} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary transition-all line-clamp-1">
                          {partner.address}
                        </a>
                      ) : (
                        <span className="line-clamp-1">{partner.address}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Discount & Call */}
                <div className="pt-4 border-t border-border mt-4 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                      {t("ui.partnerdirectory.discountRate")}
                    </p>
                    <p className="text-base font-bold text-primary font-heading">
                      {formatDiscount(partner.discount, locale)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {partner.mapLink && (
                      <a href={partner.mapLink} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-1 border-slate-200 dark:border-slate-800 text-muted-foreground hover:bg-muted">
                          <MapPin className="h-3.5 w-3.5" />
                          {t("ui.partnerdirectory.viewMap")}
                        </Button>
                      </a>
                    )}
                    <a href={`tel:${partner.phone}`}>
                      <Button variant="outline" size="sm" className="gap-1 border-primary text-primary hover:bg-primary-light">
                        <Phone className="h-3.5 w-3.5" />
                        {t("ui.partnerdirectory.call")}
                      </Button>
                    </a>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground text-sm">
            {t("ui.partnerdirectory.noPartnerHospitalOrLab")}
          </p>
        </div>
      )}

    </div>
  );
}
