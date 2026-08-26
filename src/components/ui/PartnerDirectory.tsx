"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Phone, Clock, Hospital, ShieldAlert, Pill, HeartHandshake, Tag, ChevronRight, X } from "lucide-react";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { Partner, DepartmentDiscount } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatDiscount } from "@/lib/i18n";
import { PartnerCardSkeleton } from "@/components/ui/skeleton";
import { FENI_UPAZILAS, getUpazilaLabel, detectUpazilaFromText } from "@/data/feniLocations";

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

  // Filter partners
  const filteredPartners = useMemo(() => {
    return partnersWithUpazila.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchesUpazila = selectedUpazila === "all" || p.resolvedUpazila === selectedUpazila;

      return matchesSearch && matchesCategory && matchesUpazila;
    });
  }, [partnersWithUpazila, searchQuery, selectedCategory, selectedUpazila]);

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
              className="pl-10 pr-10 border-border bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
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
                        ? "bg-secondary text-white border-secondary shadow-xs"
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
            {displayedPartners.map((partner) => {
              const mapUrl = partner.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${partner.name}, ${partner.address}`)}`;

              return (
                <Card key={partner.id} className="group relative overflow-hidden rounded-2xl border-border bg-card shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between p-0 py-0 gap-0">
                  {/* Full Image Banner with Overlay & Floating Info */}
                  <div className="relative h-52 sm:h-56 w-full bg-slate-900 overflow-hidden">
                    <PartnerCardBanner
                      partner={partner}
                      fallbackImage={getCategoryFallbackImage(partner.category)}
                    />

                    {/* Dark Gradient Overlay for optimal contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10 group-hover:from-slate-950/90 transition-opacity duration-300" />

                    {/* Floating Upazila Badge Top-Left */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-emerald-400" />
                        {getUpazilaLabel(partner.resolvedUpazila, locale)}
                      </span>
                    </div>

                    {/* Floating Category Badge Top-Right */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-xs flex items-center gap-1.5">
                        {getCategoryIconSmall(partner.category)}
                        {getCategoryLabel(partner.category)}
                      </span>
                    </div>

                    {/* Floating Name & Address at bottom of image overlay */}
                    <div className="absolute bottom-3 left-4 right-4 z-10 space-y-1">
                      <Link href={`/partner-hospitals/${partner.id}`} className="block">
                        <h3 className="font-heading text-base sm:text-lg font-bold text-white drop-shadow-md line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                          {partner.name}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-emerald-300 transition-colors drop-shadow-sm w-fit"
                        >
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          <span className="line-clamp-1">{partner.address}</span>
                        </a>
                        {partner.workingHours && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                            <Clock className="h-3 w-3 text-emerald-400" />
                            {partner.workingHours}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Department Discounts Breakdown Pills (if configured) */}
                  {(() => {
                    let deptList: DepartmentDiscount[] = [];
                    if (partner.departmentDiscounts) {
                      try {
                        const parsed = JSON.parse(partner.departmentDiscounts);
                        if (Array.isArray(parsed)) deptList = parsed;
                      } catch {}
                    }
                    if (deptList.length === 0) return null;
                    return (
                      <div className="px-3.5 sm:px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/50 border-t border-border/40 space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Tag className="h-3 w-3 text-primary" />
                          {t("ui.partnerdirectory.departmentDiscounts")}
                        </p>
                        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                          {deptList.map((dept, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-background text-secondary dark:text-slate-200 border border-border px-2 py-0.5 rounded-md font-medium flex items-center gap-1 shadow-2xs"
                              title={dept.description}
                            >
                              <span>{dept.name}</span>
                              <strong className="text-primary font-mono font-bold">({dept.discount})</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Card Footer: Discount Rate & Action Buttons (Profile, Location & Call) */}
                  <div className="p-3.5 sm:p-4 bg-background dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 border-t border-border/60">
                    <div className="shrink-0">
                      <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                        {t("ui.partnerdirectory.discountRate")}
                      </p>
                      <p className="text-sm sm:text-base font-bold text-primary font-heading">
                        {formatDiscount(partner.discount, locale)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href={`/partner-hospitals/${partner.id}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "h-8 px-2.5 text-xs font-semibold rounded-lg border-border/80 hover:bg-muted text-foreground gap-1",
                        })}
                      >
                        <span>{t("ui.partnerdirectory.details")}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>

                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon",
                          className: "h-8 w-8 text-muted-foreground hover:text-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
                        })}
                        title="Google Map Location"
                        aria-label="Google Map Location"
                      >
                        <MapPin className="h-4 w-4" />
                      </a>

                      <a
                        href={`tel:${partner.phone}`}
                        className={buttonVariants({
                          variant: "default",
                          size: "sm",
                          className: "h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1.5 shadow-2xs",
                        })}
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>{t("ui.partnerdirectory.call")}</span>
                      </a>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Load More Button */}
          {!limit && displayedPartners.length < filteredPartners.length && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold border-border hover:bg-muted cursor-pointer"
              >
                {t("ui.partnerdirectory.loadMorePartners")} ({filteredPartners.length - displayedPartners.length} {t("consultants.button.remaining")})
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
