"use client";

import React from "react";
import Link from "next/link";
import {
  PhoneCall, Calendar, Clock, MapPin, Building2,
  ShieldCheck, Info, ChevronRight
} from "lucide-react";
import { Doctor } from "@/services/db";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Locale } from "@/lib/i18n";
import { DoctorAvatar } from "./DoctorModals";
import { DoctorAvailabilityBadge, DoctorNoticeBanner } from "./DoctorAvailabilityBadge";
import { getUpazilaLabel } from "@/data/feniLocations";

interface DoctorCardProps {
  doctor: Doctor & { resolvedUpazila?: string };
  locale: Locale;
  isEn: boolean;
  t?: (key: string) => string;
  variant?: "directory" | "partner-roster";
  onDetailsClick?: (doc: Doctor) => void;
  onSerialClick: (doc: Doctor) => void;
}

export function DoctorCard({
  doctor: doc,
  locale,
  isEn,
  t,
  variant = "directory",
  onDetailsClick,
  onSerialClick,
}: DoctorCardProps) {
  const isDirectory = variant === "directory";

  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden rounded-2xl border-border/80 bg-card hover:shadow-lg transition-all duration-300 group hover:border-primary/40">
      <div className="p-3.5 sm:p-4 pb-2 sm:pb-2.5 space-y-2.5 sm:space-y-3 flex-1 flex flex-col justify-between">
        {/* Doctor Header (Image + Basic Info) */}
        <div className="flex items-start gap-3">
          <Link
            href={`/consultants/${encodeURIComponent(doc.slug || doc.id)}`}
            prefetch={false}
            tabIndex={-1}
            aria-hidden="true"
            className="shrink-0 hover:opacity-90 transition-opacity"
          >
            <DoctorAvatar
              src={doc.imageUrl}
              alt={doc.name}
              className="h-16 w-16 sm:h-18 sm:w-18"
            />
          </Link>
          <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
            <div className="min-w-0">
              <Link
                href={`/consultants/${encodeURIComponent(doc.slug || doc.id)}`}
                prefetch={false}
                className="font-heading font-bold text-sm sm:text-base text-secondary dark:text-white leading-snug line-clamp-2 hover:text-primary transition-colors"
                title={doc.name}
              >
                {doc.name}
              </Link>
            </div>
            <p
              className="text-[11px] sm:text-xs font-semibold text-primary leading-tight line-clamp-2 break-words"
              title={doc.specialty}
            >
              {doc.specialty}
            </p>
            <p
              className="text-[11px] sm:text-xs text-muted-foreground leading-tight line-clamp-2 h-[2.4em] overflow-hidden break-words"
              title={doc.degrees}
            >
              {doc.degrees}
            </p>
          </div>
        </div>

        {/* Designation & Availability Row */}
        <div className="flex flex-col gap-1.5">
          <div className="bg-muted/40 rounded-xl px-2.5 py-1.5 sm:py-2 text-xs text-muted-foreground min-h-10 flex items-center overflow-hidden">
            <p
              className="font-medium leading-tight line-clamp-2 overflow-hidden break-words"
              title={doc.designation}
            >
              {doc.designation || (isEn ? "Specialist Physician" : "বিশেষজ্ঞ চিকিৎসক")}
            </p>
          </div>
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <DoctorAvailabilityBadge doctor={doc} locale={locale} size="sm" />
            {doc.roomNo && (
              <span className="inline-flex items-center text-[10px] font-semibold text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-md border border-border/60">
                {isEn ? `Room ${doc.roomNo}` : `রুম #${doc.roomNo}`}
              </span>
            )}
            {isDirectory && doc.partnerId && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span>{isEn ? "Partner Chamber" : "পার্টনার চেম্বার"}</span>
              </span>
            )}
          </div>
        </div>

        {/* Notice Banner if present */}
        {doc.notice && (
          <DoctorNoticeBanner notice={doc.notice} locale={locale} compact />
        )}

        {/* Chamber Schedule & Address with Upazila Badge / Visiting Hours */}
        <div className="space-y-1 text-xs pt-0.5">
          {isDirectory && (
            <>
              <div className="flex items-center justify-between gap-2 text-foreground font-medium min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                  <span className="flex-1 truncate leading-snug" title={doc.chamberName}>
                    {doc.chamberName}
                  </span>
                </div>
                {doc.resolvedUpazila && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                    <MapPin className="h-2.5 w-2.5" />
                    {getUpazilaLabel(doc.resolvedUpazila, locale)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/80 shrink-0" />
                <span className="flex-1 truncate leading-snug" title={doc.chamberAddress}>
                  {doc.chamberAddress}
                </span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1.5 rounded-lg font-medium text-[11px] sm:text-xs overflow-hidden">
            <div className="inline-flex items-center gap-1.5 truncate min-w-0 flex-1">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate" title={doc.visitingDays}>
                {doc.visitingDays}
              </span>
            </div>
            {doc.consultationFee && (
              <span className="shrink-0 font-bold text-primary font-mono text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">
                {doc.consultationFee}
              </span>
            )}
            <span className="text-emerald-400/80 dark:text-emerald-600 shrink-0">•</span>
            <div className="inline-flex items-center gap-1.5 truncate shrink-0 max-w-[45%]">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate" title={doc.visitingHours}>
                {doc.visitingHours}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-border/60 bg-muted/20 p-2 sm:p-2.5 grid grid-cols-2 gap-2 mt-auto">
        {isDirectory ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDetailsClick?.(doc)}
              aria-label={`${t?.("consultants.button.details") || (isEn ? "Details" : "বিস্তারিত")} - ${doc.name}`}
              className="h-8 sm:h-9 text-xs font-semibold rounded-xl border-border/80 hover:bg-muted cursor-pointer"
            >
              <Info className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              {t?.("consultants.button.details") || (isEn ? "Details" : "বিস্তারিত")}
            </Button>
            <Button
              size="sm"
              onClick={() => onSerialClick(doc)}
              aria-label={`${t?.("consultants.button.serial") || (isEn ? "Call Serial" : "সিরিয়াল কল")} - ${doc.name}`}
              className="h-8 sm:h-9 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xs cursor-pointer"
            >
              <PhoneCall className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              {t?.("consultants.button.serial") || (isEn ? "Call Serial" : "সিরিয়াল কল")}
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              onClick={() => onSerialClick(doc)}
              aria-label={`${isEn ? "Book Serial" : "সিরিয়াল নিন"} - ${doc.name}`}
              className="h-8 sm:h-9 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xs cursor-pointer"
            >
              <PhoneCall className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              {isEn ? "Book Serial" : "সিরিয়াল নিন"}
            </Button>
            <Link
              href={`/consultants/${encodeURIComponent(doc.slug || doc.id)}`}
              aria-label={`${isEn ? "Profile" : "প্রোফাইল"} - ${doc.name}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "h-8 sm:h-9 text-xs font-semibold rounded-xl border-border/80 hover:bg-muted cursor-pointer flex items-center justify-center",
              })}
            >
              <span>{isEn ? "Profile" : "প্রোফাইল"}</span>
              <ChevronRight className="h-3.5 w-3.5 ml-1 text-muted-foreground" aria-hidden="true" />
            </Link>
          </>
        )}
      </div>
    </Card>
  );
}
