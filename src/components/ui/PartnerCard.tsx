"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock, Hospital, ShieldAlert, Pill, HeartHandshake, Tag, ChevronRight } from "lucide-react";
import { Partner, DepartmentDiscount } from "@/services/db";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { formatDiscount, Locale } from "@/lib/i18n";
import { getUpazilaLabel } from "@/data/feniLocations";

interface PartnerCardProps {
  partner: Partner & { resolvedUpazila?: string };
  locale: Locale;
  t: (key: string) => string;
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

export default function PartnerCard({ partner, locale, t }: PartnerCardProps) {
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

  const mapUrl =
    partner.mapLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${partner.name}, ${partner.address}`
    )}`;

  let deptList: DepartmentDiscount[] = [];
  if (partner.departmentDiscounts) {
    try {
      const parsed = JSON.parse(partner.departmentDiscounts);
      if (Array.isArray(parsed)) deptList = parsed;
    } catch {}
  }

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border bg-card shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between p-0 py-0 gap-0">
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
      {deptList.length > 0 && (
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
      )}

      {/* Card Footer: Discount Rate & Action Buttons */}
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
              className:
                "h-8 px-2.5 text-xs font-semibold rounded-lg border-border/80 hover:bg-muted text-foreground gap-1",
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
              className:
                "h-8 w-8 text-muted-foreground hover:text-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
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
              className:
                "h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1.5 shadow-2xs",
            })}
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{t("ui.partnerdirectory.call")}</span>
          </a>
        </div>
      </div>
    </Card>
  );
}
