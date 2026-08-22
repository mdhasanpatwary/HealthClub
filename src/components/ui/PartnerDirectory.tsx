"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, MapPin, Phone, Hospital, ShieldAlert, Pill, HeartHandshake } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Partner } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatDiscount } from "@/lib/i18n";
import { PartnerCardSkeleton } from "@/components/ui/skeleton";

interface PartnerDirectoryProps {
  partners?: Partner[];
  limit?: number;
  showFilters?: boolean;
}

function PartnerCardBanner({
  partner,
  fallbackImage,
}: {
  partner: Partner;
  fallbackImage: string;
}) {
  const targetSrc = partner.imageUrl || fallbackImage;
  const [imgSrc, setImgSrc] = useState(targetSrc);
  const [prevTargetSrc, setPrevTargetSrc] = useState(targetSrc);

  if (targetSrc !== prevTargetSrc) {
    setPrevTargetSrc(targetSrc);
    setImgSrc(targetSrc);
  }

  return (
    <Image
      src={imgSrc}
      alt={partner.name}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      onError={() => setImgSrc(fallbackImage)}
      className="object-cover group-hover:scale-105 transition-transform duration-500"
    />
  );
}

export default function PartnerDirectory({ partners: initialPartners, limit, showFilters = true }: PartnerDirectoryProps) {
  const hasInitialData = Boolean(initialPartners && initialPartners.length > 0);
  const [partners, setPartners] = useState<Partner[]>(initialPartners ?? []);
  const [loading, setLoading] = useState(!hasInitialData);
  const [prevInitialPartners, setPrevInitialPartners] = useState(initialPartners);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(18);
  const { locale, t } = useLanguage();

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
    // Fallback client-side fetch if initialPartners is missing or empty
    let isMounted = true;
    dbStore.getPartners().then((data) => {
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

  // Filter partners
  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Apply limit or pagination slice
  const displayedPartners = limit ? filteredPartners.slice(0, limit) : filteredPartners.slice(0, visibleCount);

  const getCategoryFallbackImage = (category: string) => {
    switch (category) {
      case "hospital":
        return "/images/placeholders/hospital.webp";
      case "diagnostic":
        return "/images/placeholders/diagnostic.webp";
      case "pharmacy":
        return "/images/placeholders/pharmacy.webp";
      default:
        return "/images/placeholders/default.webp";
    }
  };

  const getCategoryIconSmall = (category: string) => {
    switch (category) {
      case "hospital":
        return <Hospital className="h-3.5 w-3.5 text-emerald-400" />;
      case "diagnostic":
        return <ShieldAlert className="h-3.5 w-3.5 text-indigo-400" />;
      case "pharmacy":
        return <Pill className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return <HeartHandshake className="h-3.5 w-3.5 text-emerald-400" />;
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
            aria-label={t("ui.partnerdirectory.searchByHospitalNameOr") || "Search partner hospitals"}
            placeholder={t("ui.partnerdirectory.searchByHospitalNameOr")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(18);
            }}
            className="pl-10 border-border bg-background"
          />
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
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${selectedCategory === cat.value
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {Array.from({ length: limit || 6 }).map((_, i) => (
            <PartnerCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedPartners.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {displayedPartners.map((partner) => {
              const mapUrl = partner.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${partner.name}, ${partner.address}`)}`;

              return (
                <Card key={partner.id} className="group relative overflow-hidden rounded-2xl border-border bg-card shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between">

                  {/* Full Image Banner with Overlay & Floating Info */}
                  <div className="relative h-52 sm:h-56 w-full bg-slate-900 overflow-hidden">
                    <PartnerCardBanner
                      partner={partner}
                      fallbackImage={getCategoryFallbackImage(partner.category)}
                    />

                    {/* Dark Gradient Overlay for optimal contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10 group-hover:from-slate-950/90 transition-opacity duration-300" />

                    {/* Floating Category Badge Top-Right */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-xs flex items-center gap-1.5">
                        {getCategoryIconSmall(partner.category)}
                        {getCategoryLabel(partner.category)}
                      </span>
                    </div>

                    {/* Floating Name & Address at bottom of image overlay */}
                    <div className="absolute bottom-3 left-4 right-4 z-10 space-y-1">
                      <h3 className="font-heading text-base sm:text-lg font-bold text-white drop-shadow-md line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                        {partner.name}
                      </h3>
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-emerald-300 transition-colors drop-shadow-sm w-fit"
                      >
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span className="line-clamp-1">{partner.address}</span>
                      </a>
                    </div>
                  </div>

                  {/* Card Footer: Discount Rate & Action Buttons (Location & Call) */}
                  <div className="p-3.5 sm:p-4 bg-background dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 border-t border-border/60">
                    <div className="shrink-0">
                      <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                        {t("ui.partnerdirectory.discountRate")}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-primary font-heading">
                        {formatDiscount(partner.discount, locale)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Location / View Map Icon Button */}
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t("ui.partnerdirectory.viewMap")}
                        aria-label={t("ui.partnerdirectory.viewMap")}
                        className={buttonVariants({
                          variant: "outline",
                          size: "icon",
                          className: "h-8 w-8 rounded-lg border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors cursor-pointer",
                        })}
                      >
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                      </a>

                      {/* Call Icon Button */}
                      <a
                        href={`tel:${partner.phone}`}
                        title={t("ui.partnerdirectory.call")}
                        aria-label={t("ui.partnerdirectory.call")}
                        className={buttonVariants({
                          variant: "default",
                          size: "icon",
                          className: "h-8 w-8 rounded-lg bg-primary hover:bg-primary-dark text-white shadow-xs transition-colors cursor-pointer",
                        })}
                      >
                        <Phone className="h-4 w-4 shrink-0" />
                      </a>
                    </div>
                  </div>

                </Card>
              );
            })}
          </div>

          {/* Load More Button */}
          {!limit && filteredPartners.length > visibleCount && (
            <div className="flex flex-col items-center justify-center pt-4 pb-2 space-y-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="rounded-2xl px-8 border-primary/30 text-primary hover:bg-primary hover:text-white font-semibold transition-all shadow-xs cursor-pointer"
              >
                {locale === "en"
                  ? `Load More Facilities (${filteredPartners.length - visibleCount} remaining)`
                  : `আরো প্রতিষ্ঠান দেখুন (বাকি ${filteredPartners.length - visibleCount} টি)`}
              </Button>
              <p className="text-xs text-muted-foreground">
                {locale === "en"
                  ? `Showing ${Math.min(visibleCount, filteredPartners.length)} of ${filteredPartners.length} facilities`
                  : `মোট ${filteredPartners.length} টি প্রতিষ্ঠানের মধ্যে ${Math.min(visibleCount, filteredPartners.length)} টি প্রদর্শিত হচ্ছে`}
              </p>
            </div>
          )}
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
