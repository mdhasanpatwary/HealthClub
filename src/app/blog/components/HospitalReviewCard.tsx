import Link from "next/link";
import {
  MapPin,
  Phone,
  Siren,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Bed,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HospitalReviewItem } from "@/types/blog";
import { BlogReviewCardWrapper } from "./BlogReviewCardWrapper";

interface HospitalReviewCardProps {
  hospital: HospitalReviewItem;
}

export function HospitalReviewCard({
  hospital,
}: HospitalReviewCardProps) {
  const name = hospital.nameBn || hospital.nameEn;
  const address = hospital.addressBn || hospital.addressEn;
  const typeName = hospital.typeBn || hospital.typeEn;
  const description = hospital.descriptionBn ||
    `${hospital.nameBn} ফেনীর একটি অন্যতম নির্ভরযোগ্য স্বাস্থ্যসেবা প্রতিষ্ঠান, যেখানে ইনডোর চিকিৎসা, বিশেষজ্ঞ ডাক্তারদের চেম্বার ও সার্বক্ষণিক সেবা প্রদান করা হয়।`;

  const sectionId = `hospital-${hospital.rank}`;

  return (
    <BlogReviewCardWrapper
      sectionId={sectionId}
      rank={hospital.rank}
      partnerStatus={hospital.partnerStatus}
    >
      {/* Header: Names + Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium border-border/80">
              {typeName}
            </Badge>

            {hospital.partnerStatus && (
              <Badge className="bg-emerald-600 dark:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-xs animate-pulse-subtle">
                <ShieldCheck className="h-3.5 w-3.5" />
                অফিসিয়াল পার্টনার হাসপাতাল
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

        {/* Quick Attribute Pills */}
        <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 shrink-0">
          {hospital.bedCountBn && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-muted px-2.5 py-1 rounded-lg font-medium text-foreground">
              <Bed className="h-3.5 w-3.5 text-muted-foreground" />
              {hospital.bedCountBn}
            </span>
          )}

          {hospital.icuAvailable && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-semibold">
              <CheckCircle2 className="h-3 w-3" />
              আইসিইউ (ICU) সুবিধা
            </span>
          )}

          {hospital.emergency24x7 && (
            <span className="inline-flex items-center gap-1 text-xs bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-lg font-semibold">
              <Siren className="h-3 w-3" />
              ২৪ ঘণ্টা জরুরি সেবা
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Partner Discount Highlight Box (If Health Club Partner) */}
      {hospital.partnerStatus && hospital.partnerDiscountBn && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                হেলথ ক্লাব সদস্য সুবিধা
              </span>
              <p className="text-sm font-semibold text-foreground">
                {hospital.partnerDiscountBn}
              </p>
            </div>
          </div>

          <Link
            href="/membership"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            ডিসকাউন্ট কার্ড নিন
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Key Facilities & Medical Specialties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/60 text-xs sm:text-sm">
        {/* Key Features */}
        <div className="space-y-2">
          <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            বিশেষ সুবিধাসমূহ
          </h4>
          <ul className="space-y-1.5 text-muted-foreground">
            {hospital.keyFeaturesBn.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0 mt-2" />
                <span className="leading-snug">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Doctor Specialties */}
        <div className="space-y-2">
          <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope className="h-4 w-4 text-primary" />
            প্রধান বিভাগ ও বিশেষজ্ঞ চেম্বার
          </h4>
          <div className="flex flex-wrap gap-2">
            {hospital.specialtiesBn.map((spec, idx) => (
              <span
                key={idx}
                className="bg-muted/80 text-foreground/90 px-2.5 py-1 rounded-md text-xs font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar: Direct Calls & External Links */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/60">
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Phone */}
          {hospital.phone && (
            <a
              href={`tel:${hospital.phone.replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>{hospital.phone}</span>
            </a>
          )}

          {/* Emergency Phone */}
          {hospital.emergencyPhone && (
            <a
              href={`tel:${hospital.emergencyPhone.replace(/[^0-9]/g, "")}`}
              aria-label={`জরুরি হেল্পলাইন ${name}: ${hospital.emergencyPhone}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors"
            >
              <Siren className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" />
              <span>{"জরুরি: "}{hospital.emergencyPhone}</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Google Maps Location Search */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              hospital.mapQuery || hospital.nameBn + " " + hospital.addressBn
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`গুগল ম্যাপ - ${name}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border/80 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>গুগল ম্যাপ</span>
          </a>

          {/* Hospital Profile / Details Link */}
          {(hospital.partnerProfileSlug || hospital.partnerStatus) && (
            <Link
              href={
                hospital.partnerProfileSlug
                  ? hospital.partnerProfileSlug.startsWith("/")
                    ? hospital.partnerProfileSlug
                    : `/partner-hospitals/${encodeURIComponent(hospital.partnerProfileSlug)}`
                  : "/partner-hospitals"
              }
              aria-label={`হাসপাতাল প্রোফাইল - ${name}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-xs transition-colors"
            >
              <span>হাসপাতাল প্রোফাইল</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </BlogReviewCardWrapper>
  );
}
