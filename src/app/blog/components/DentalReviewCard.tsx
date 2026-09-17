import Link from "next/link";
import {
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Activity,
  Clock,
  UserCheck,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DentalClinicReviewItem } from "@/types/blog";
import { BlogReviewCardWrapper } from "./BlogReviewCardWrapper";

interface DentalReviewCardProps {
  clinic: DentalClinicReviewItem;
  locale?: string;
}

export function DentalReviewCard({
  clinic,
  locale = "bn",
}: DentalReviewCardProps) {
  const isEn = locale === "en";
  const name = isEn ? clinic.nameEn : clinic.nameBn;
  const address = isEn ? clinic.addressEn : clinic.addressBn;
  const doctorName = isEn ? clinic.doctorInChargeEn : clinic.doctorInChargeBn;
  const degrees = isEn ? clinic.degreesEn : clinic.degreesBn;
  const visitingHours = isEn
    ? clinic.visitingHoursEn || clinic.visitingHoursBn
    : clinic.visitingHoursBn;
  const description = isEn
    ? clinic.descriptionEn || clinic.descriptionBn
    : clinic.descriptionBn;

  const sectionId = `dental-${clinic.rank}`;

  return (
    <BlogReviewCardWrapper
      sectionId={sectionId}
      rank={clinic.rank}
      partnerStatus={clinic.partnerStatus}
      locale={locale}
    >
      {/* Header: Names + Badges + Address */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium border-border/80">
              {isEn ? "Dental Surgery & Clinic" : "ডেন্টাল সার্জারি ও ক্লিনিক"}
            </Badge>

            {clinic.partnerStatus && (
              <Badge className="bg-emerald-600 dark:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{isEn ? "Health Club Partner" : "অফিসিয়াল পার্টনার ডেন্টাল"}</span>
              </Badge>
            )}
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {name}
          </h3>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground pt-0.5">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>{address}</span>
          </div>
        </div>

        {/* Visiting Hours Pill */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border/60 shrink-0 self-start">
          <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="font-medium">{visitingHours}</span>
        </div>
      </div>

      {/* In-Charge Doctor Box */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-heading text-sm sm:text-base font-bold text-foreground">
              {doctorName}
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed pt-0.5">
              {degrees}
            </div>
          </div>
        </div>

        {clinic.specialtiesBn && clinic.specialtiesBn.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {clinic.specialtiesBn.slice(0, 2).map((sp, idx) => (
              <Badge key={idx} variant="secondary" className="text-[11px]">
                {sp}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
        {description}
      </p>

      {/* Equipment & Technology Highlights */}
      {clinic.equipmentHighlightsBn && clinic.equipmentHighlightsBn.length > 0 && (
        <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5">
          <h4 className="font-heading text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span>{isEn ? "Advanced Dental Tech & Equipment:" : "আধুনিক ডেন্টাল প্রযুক্তি ও যন্ত্রপাতি:"}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {clinic.equipmentHighlightsBn.map((equip, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs sm:text-sm text-foreground/85"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{equip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Procedures & Services */}
      <div className="space-y-2.5">
        <h4 className="font-heading text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-primary" />
          <span>{isEn ? "Available Dental Procedures:" : "বিশেষায়িত চিকিৎসা ও সেবাসমূহ:"}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
          {clinic.proceduresBn.map((proc, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{proc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sterilization Standard Note */}
      {clinic.sterilizationStandardBn && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 px-3.5 py-2.5 rounded-xl">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <span>
            <strong className="text-foreground">{isEn ? "Sterilization Standard: " : "জীবাণুমুক্তকরণ ব্যবস্থা: "}</strong>
            {clinic.sterilizationStandardBn}
          </span>
        </div>
      )}

      {/* Partner Discount Highlight Box */}
      {clinic.partnerStatus && clinic.partnerDiscountBn && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                {isEn ? "Health Club Member Benefit" : "হেলথ ক্লাব মেম্বারশিপ বিশেষ সুবিধা"}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                {clinic.partnerDiscountBn}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/membership"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs transition-colors"
            >
              <span>{isEn ? "Get Discount Card" : "ডিসকাউন্ট কার্ড নিন"}</span>
            </Link>
            {clinic.partnerProfileSlug && (
              <Link
                href={`/partner-hospitals/${encodeURIComponent(clinic.partnerProfileSlug)}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground text-xs font-medium transition-colors"
              >
                <span>{isEn ? "Partner Profile" : "পার্টনার প্রোফাইল"}</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Footer Contact & Action Buttons */}
      <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {clinic.phone.split(",").map((num, idx) => {
            const cleanNum = num.trim();
            return (
              <a
                key={idx}
                href={`tel:${cleanNum.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{cleanNum}</span>
              </a>
            );
          })}
        </div>

        {clinic.mapQuery && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              clinic.mapQuery
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>{isEn ? "View on Google Maps" : "গুগল ম্যাপে লোকেশন"}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </BlogReviewCardWrapper>
  );
}
