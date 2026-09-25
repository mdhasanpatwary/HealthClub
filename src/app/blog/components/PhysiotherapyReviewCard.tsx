import Link from "next/link";
import {
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Activity,
  Clock,
  UserCheck,
  Home,
  Dna,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PhysiotherapyCenterReviewItem } from "@/types/blog";
import { BlogReviewCardWrapper } from "./BlogReviewCardWrapper";

interface PhysiotherapyReviewCardProps {
  center: PhysiotherapyCenterReviewItem;
}

export function PhysiotherapyReviewCard({
  center,
}: PhysiotherapyReviewCardProps) {
  const name = center.nameBn || center.nameEn;
  const address = center.addressBn || center.addressEn;
  const therapistName = center.doctorInChargeBn || center.doctorInChargeEn;
  const degrees = center.degreesBn || center.degreesEn;
  const visitingHours = center.visitingHoursBn;
  const description = center.descriptionBn ||
    `${center.nameBn} ফেনীর একটি বিশ্বস্ত ফিজিওথেরাপি ও রিহ্যাবিলিটেশন সেন্টার, যেখানে স্ট্রোক পরবর্তী প্যারালাইসিস, বাতের ব্যথা ও স্পোর্টস ইনজুরির আধুনিক চিকিৎসা দেওয়া হয়।`;

  const sectionId = `physio-${center.rank}`;

  return (
    <BlogReviewCardWrapper
      sectionId={sectionId}
      rank={center.rank}
      partnerStatus={center.partnerStatus}
    >
      {/* Header: Center Name + Status Badges + Address */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium border-border/80">
              ফিজিওথেরাপি ও রিহ্যাবিলিটেশন
            </Badge>

            {center.homeServiceAvailable && (
              <Badge variant="secondary" className="text-[11px] font-semibold flex items-center gap-1 bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20">
                <Home className="h-3 w-3" />
                <span>হোম সার্ভিস উপলব্ধ</span>
              </Badge>
            )}

            {center.partnerStatus && (
              <Badge className="bg-emerald-600 dark:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>অফিসিয়াল পার্টনার সেন্টার</span>
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

      {/* In-Charge Physiotherapist Box */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-heading text-sm sm:text-base font-bold text-foreground">
              {therapistName}
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed pt-0.5">
              {degrees}
            </div>
          </div>
        </div>

        {center.specialtiesBn && center.specialtiesBn.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:justify-end">
            {center.specialtiesBn.slice(0, 3).map((sp, idx) => (
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

      {/* Modern Equipment Highlights */}
      {center.equipmentHighlightsBn && center.equipmentHighlightsBn.length > 0 && (
        <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5">
          <h4 className="font-heading text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span>আধুনিক থেরাপিউটিক যন্ত্রপাতি ও প্রযুক্তি:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {center.equipmentHighlightsBn.map((equip, idx) => (
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

      {/* Conditions Treated & Services */}
      <div className="space-y-2.5">
        <h4 className="font-heading text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
          <Dna className="h-4 w-4 text-primary" />
          <span>প্রধান নিরাময়যোগ্য রোগ ও লক্ষণসমূহ:</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
          {center.conditionsTreatedBn.map((cond, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{cond}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Center Highlights */}
      {center.keyFeaturesBn && center.keyFeaturesBn.length > 0 && (
        <div className="space-y-2 rounded-xl bg-muted/20 border border-border/60 p-3.5">
          <div className="text-xs font-bold text-foreground">
            সেন্টারের বিশেষ সুবিধাসমূহ:
          </div>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {center.keyFeaturesBn.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Partner Discount Highlight Box */}
      {center.partnerStatus && center.partnerDiscountBn && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                হেলথ ক্লাব মেম্বারশিপ বিশেষ সুবিধা
              </span>
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                {center.partnerDiscountBn}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/membership"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs transition-colors"
            >
              <span>ডিসকাউন্ট কার্ড নিন</span>
            </Link>
            {center.partnerProfileSlug && (
              <Link
                href={`/partner-hospitals/${encodeURIComponent(center.partnerProfileSlug)}`}
                aria-label={`পার্টনার প্রোফাইল - ${name}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground text-xs font-medium transition-colors"
              >
                <span>পার্টনার প্রোফাইল</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Footer Contact & Action Buttons */}
      <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {center.phone.split(",").map((num, idx) => {
            const cleanNum = num.trim();
            return (
              <a
                key={idx}
                href={`tel:${cleanNum.replace(/[^0-9]/g, "")}`}
                aria-label={`কল করুন ${name}: ${cleanNum}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{cleanNum}</span>
              </a>
            );
          })}
        </div>

        {center.mapQuery && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              center.mapQuery
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`গুগল ম্যাপে লোকেশন - ${name}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>গুগল ম্যাপে লোকেশন</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
      </div>
    </BlogReviewCardWrapper>
  );
}
