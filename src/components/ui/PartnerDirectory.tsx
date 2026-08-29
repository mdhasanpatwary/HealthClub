"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Hospital, X } from "lucide-react";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { Partner } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { PartnerCardSkeleton } from "@/components/ui/skeleton";
import { FENI_UPAZILAS, detectUpazilaFromText } from "@/data/feniLocations";
import PartnerCard from "@/components/ui/PartnerCard";

interface PartnerDirectoryProps {
  partners?: Partner[];
  limit?: number;
  showFilters?: boolean;
}

export default function PartnerDirectory({ partners: initialPartners, limit, showFilters = true }: PartnerDirectoryProps) {
  const hasInitialData = Boolean(initialPartners && initialPartners.length > 0);
  const [partners, setPartners] = useState<Partner[]>(initialPartners ?? []);
  const [loading, setLoading] = useState(!hasInitialData);
  const [prevInitialPartners, setPrevInitialPartners] = useState(initialPartners);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(18);
  const { locale, t } = useLanguage();
  const isEn = locale === "en";

  if (initialPartners !== prevInitialPartners) {
    setPrevInitialPartners(initialPartners);
    if (initialPartners && initialPartners.length > 0) {
      setPartners(initialPartners);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }

  useEffect(() => {
    if (initialPartners && initialPartners.length > 0) {
      return;
    }
    let isMounted = true;
    getPartnersAction().then((data) => {
      if (!isMounted) return;
      if (data && data.length > 0) {
        setPartners(data);
      }
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [initialPartners]);

  // Precompute upazila for each partner
  const partnersWithUpazila = useMemo(() => {
    return partners.map((p) => ({
      ...p,
      resolvedUpazila: p.upazila || detectUpazilaFromText(p.address),
    }));
  }, [partners]);

  // Filter partners by name, address, category, or department discount tests (e.g. CBC, USG, X-Ray, etc.)
  const filteredPartners = useMemo(() => {
    return partnersWithUpazila.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.departmentDiscounts && p.departmentDiscounts.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchesUpazila = selectedUpazila === "all" || p.resolvedUpazila === selectedUpazila;

      return matchesSearch && matchesCategory && matchesUpazila;
    });
  }, [partnersWithUpazila, searchQuery, selectedCategory, selectedUpazila]);

  // Apply limit or pagination slice
  const displayedPartners = limit ? filteredPartners.slice(0, limit) : filteredPartners.slice(0, visibleCount);

  const categories = [
    { value: "all", label: t("ui.partnerdirectory.allCategories") },
    { value: "hospital", label: t("ui.partnerdirectory.hospital") },
    { value: "diagnostic", label: t("ui.partnerdirectory.diagnosticCenter") },
    { value: "pharmacy", label: t("ui.partnerdirectory.pharmacy") },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              aria-label={t("ui.partnerdirectory.searchByHospitalNameOr") || "Search partner hospitals"}
              placeholder={t("ui.partnerdirectory.searchByHospitalNameOr")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(18);
              }}
              className="pl-10 pr-10 border-border bg-background text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.value}
                  aria-pressed={selectedCategory === cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setVisibleCount(18);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedCategory === cat.value
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Upazila / Area Pills Bar */}
        {showFilters && (
          <div className="space-y-1.5 pt-1 border-t border-border/50">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-primary" />
                <span>{t("ui.partnerdirectory.locationUpazila")}</span>
              </span>
              {(selectedUpazila !== "all" || selectedCategory !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUpazila("all");
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setVisibleCount(18);
                  }}
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                >
                  {t("ui.partnerdirectory.resetFilters")}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap">
              {FENI_UPAZILAS.map((upz) => {
                const isSelected = selectedUpazila === upz.id;
                const count =
                  upz.id === "all"
                    ? partnersWithUpazila.length
                    : partnersWithUpazila.filter((p) => p.resolvedUpazila === upz.id).length;

                return (
                  <button
                    key={upz.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedUpazila(upz.id);
                      setVisibleCount(18);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-secondary text-white border-secondary shadow-2xs"
                        : "bg-background text-muted-foreground border-border/80 hover:bg-muted"
                    }`}
                  >
                    <span>{isEn ? upz.nameEn : upz.nameBn}</span>
                    {count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {Array.from({ length: limit || 6 }).map((_, i) => (
            <PartnerCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedPartners.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {displayedPartners.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                locale={locale}
                t={t}
              />
            ))}
          </div>

          {/* Load More Button */}
          {!limit && displayedPartners.length < filteredPartners.length && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold border-border hover:bg-muted cursor-pointer"
              >
                {t("ui.partnerdirectory.loadMorePartners")} ({formatNum(filteredPartners.length - displayedPartners.length, locale)} {t("partnerHospitals.button.remaining")})
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="p-8 sm:p-12 text-center rounded-2xl border-dashed border-2 border-border/80 bg-muted/10">
          <Hospital className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white mb-1">
            {t("ui.partnerdirectory.noPartnersFound")}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-4">
            {t("ui.partnerdirectory.noPartnersFoundDesc")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedUpazila("all");
            }}
            className="rounded-xl cursor-pointer"
          >
            {t("ui.partnerdirectory.viewAllPartners")}
          </Button>
        </Card>
      )}
    </div>
  );
}

