"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Hospital,
  ShieldAlert,
  Pill,
  HeartHandshake,
  MapPin,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Tag,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import { Doctor, Partner, Review, PartnerReviewStats } from "@/services/db";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatDiscount, formatNum } from "@/lib/i18n";
import HospitalFacilityBadges from "./HospitalFacilityBadges";
import HospitalDiscountsSection from "./HospitalDiscountsSection";
import HospitalDoctorRoster from "./HospitalDoctorRoster";
import HospitalContactSidebar from "./HospitalContactSidebar";
import HospitalGalleryModal from "./HospitalGalleryModal";
import ReviewSection from "@/components/reviews/ReviewSection";

interface HospitalProfileViewProps {
  partner: Partner;
  doctors: Doctor[];
  relatedPartners?: Partner[];
  initialStats?: PartnerReviewStats;
  initialReviews?: Review[];
}

export default function HospitalProfileView({
  partner,
  doctors,
  relatedPartners = [],
  initialStats,
  initialReviews,
}: HospitalProfileViewProps) {
  const { t, locale } = useLanguage();
  const isEn = locale === "en";
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const fallbackImage =
    partner.category === "hospital"
      ? "/images/placeholders/hospital.webp"
      : partner.category === "diagnostic"
      ? "/images/placeholders/diagnostic.webp"
      : "/images/placeholders/pharmacy.webp";

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "hospital":
        return isEn ? "Specialized Hospital" : "স্পেশালাইজড হাসপাতাল";
      case "diagnostic":
        return isEn ? "Diagnostic & Pathology Center" : "ডায়াগনস্টিক ও প্যাথলজি সেন্টার";
      case "pharmacy":
        return isEn ? "Model Pharmacy" : "মডেল ফার্মেসি";
      default:
        return isEn ? "Healthcare Partner" : "স্বাস্থ্যসেবা পার্টনার";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hospital":
        return <Hospital className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />;
      case "diagnostic":
        return <ShieldAlert className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-500" />;
      case "pharmacy":
        return <Pill className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />;
      default:
        return <HeartHandshake className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />;
    }
  };

  return (
    <div className="bg-background min-h-screen py-4 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto no-scrollbar py-0.5"
        >
          <Link
            href="/"
            className="hover:text-foreground transition-colors shrink-0"
          >
            {isEn ? "Home" : "হোম"}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <Link
            href="/partner-hospitals"
            className="hover:text-foreground transition-colors shrink-0"
          >
            {isEn ? "Partner Network" : "পার্টনার নেটওয়ার্ক"}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <span className="text-foreground font-semibold truncate max-w-[180px] sm:max-w-none">
            {partner.name}
          </span>
        </nav>

        {/* Back Link */}
        <div>
          <Link
            href="/partner-hospitals"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isEn ? "Back to Partner Network" : "সকল পার্টনার প্রতিষ্ঠানে ফিরে যান"}</span>
          </Link>
        </div>

        {/* Mobile-First Hero Card Banner */}
        <div className="rounded-3xl overflow-hidden border border-border/80 bg-card shadow-sm">
          {/* Top Cover Visual */}
          <div className="relative h-36 sm:h-52 md:h-60 w-full bg-slate-900 overflow-hidden">
            <Image
              src={partner.imageUrl || fallbackImage}
              alt={partner.name}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover opacity-70 filter brightness-90 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

            {/* Floating Badges on Top of Cover */}
            <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2 z-10">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-background/95 text-foreground backdrop-blur-md shadow-xs flex items-center gap-1.5 border border-border/60">
                  {getCategoryIcon(partner.category)}
                  <span>{getCategoryLabel(partner.category)}</span>
                </span>
                <span className="px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{isEn ? "Verified Partner" : "ভেরিফাইড পার্টনার"}</span>
                </span>
                {initialStats && initialStats.totalReviews > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-background/95 text-amber-600 dark:text-amber-400 backdrop-blur-md shadow-xs flex items-center gap-1 border border-border/60">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    <span>{formatNum(initialStats.averageRating, locale)}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      ({formatNum(initialStats.totalReviews, locale)} {t("reviews.totalReviews")})
                    </span>
                  </span>
                )}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsGalleryOpen(true)}
                className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-full text-[11px] sm:text-xs bg-background/95 hover:bg-background text-foreground backdrop-blur-md shadow-xs cursor-pointer border border-border/60 shrink-0"
              >
                <ImageIcon className="h-3.5 w-3.5 mr-1 text-primary" />
                <span>{isEn ? "Photos" : "ছবি গ্যালারি"}</span>
              </Button>
            </div>
          </div>

          {/* Partner Primary Info Bar Below Cover (Mobile-First Layout) */}
          <div className="p-4 sm:p-6 lg:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 bg-card border-t border-border/40">
            <div className="space-y-1.5 min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-secondary dark:text-white font-heading tracking-tight leading-snug">
                {partner.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                  <span className="leading-relaxed">{partner.address}</span>
                </span>
                {partner.workingHours && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground/80 font-medium">
                    <span>•</span>
                    <span>{partner.workingHours}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Highlight Discount Box */}
            <div className="shrink-0 bg-primary/10 dark:bg-primary/15 border border-primary/25 rounded-2xl p-3 sm:p-4 flex items-center justify-between md:justify-center gap-3 sm:gap-4 shadow-2xs">
              <div className="p-2 sm:p-2.5 rounded-xl bg-primary text-white shadow-xs shrink-0">
                <Tag className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] uppercase font-bold text-muted-foreground tracking-wider font-mono">
                  {isEn ? "Member Discount" : "মেম্বার ডিসকাউন্ট"}
                </p>
                <p className="text-base sm:text-xl font-black text-primary font-heading">
                  {formatDiscount(partner.discount, locale)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8 items-start">
          
          {/* Main Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* Section 1: Itemized Department Discounts */}
            <div className="p-4 sm:p-6 rounded-3xl border border-border/80 bg-card shadow-2xs">
              <HospitalDiscountsSection partner={partner} />
            </div>

            {/* Section 2: Facility Badges & Infrastructure */}
            <div className="p-4 sm:p-6 rounded-3xl border border-border/80 bg-card shadow-2xs">
              <HospitalFacilityBadges partner={partner} />
            </div>

            {/* Section 3: Resident Consultant Doctors Roster */}
            <div className="p-4 sm:p-6 rounded-3xl border border-border/80 bg-card shadow-2xs">
              <HospitalDoctorRoster doctors={doctors} partner={partner} />
            </div>

            {/* Section 4: Verified Member Reviews & Rating System */}
            <div className="p-4 sm:p-6 rounded-3xl border border-border/80 bg-card shadow-2xs">
              <ReviewSection
                partner={partner}
                initialStats={initialStats}
                initialReviews={initialReviews}
              />
            </div>

          </div>

          {/* Sidebar Right Column (1 Col) */}
          <div className="lg:col-span-1 sticky top-24">
            <HospitalContactSidebar
              partner={partner}
              relatedPartners={relatedPartners}
            />
          </div>

        </div>

      </div>

      {/* Lightbox Gallery Modal */}
      <HospitalGalleryModal
        partner={partner}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
