import Link from "next/link";
import {
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Clock,
  Activity,
  Wind,
  Truck,
  Snowflake,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AmbulanceReviewItem } from "@/types/ambulanceBlog";
import { BlogReviewCardWrapper } from "./BlogReviewCardWrapper";

interface AmbulanceReviewCardProps {
  ambulance: AmbulanceReviewItem;
}

export function AmbulanceReviewCard({
  ambulance,
}: AmbulanceReviewCardProps) {
  const name = ambulance.nameBn || ambulance.nameEn;
  const address = ambulance.addressBn || ambulance.addressEn;
  const typeName = ambulance.typeBn || ambulance.typeEn;
  const hubName = ambulance.hubBn || ambulance.hubEn;
  const description = ambulance.descriptionBn ||
    `${ambulance.nameBn} ফেনীর একটি জরুরি অ্যাম্বুলেন্স সেবা, যেখানে দ্রুত রোগী স্থানান্তর এবং অক্সিজেন সুবিধা পাওয়া যায়।`;

  const fleetDetails = ambulance.fleetDetailsBn;
  const servicesOffered = ambulance.servicesOfferedBn;
  const openHours = ambulance.openHoursBn;

  const sectionId = `ambulance-${ambulance.rank}`;

  return (
    <BlogReviewCardWrapper
      sectionId={sectionId}
      rank={ambulance.rank}
      partnerStatus={ambulance.partnerStatus}
    >
      {/* Header: Names + Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium border-border/80">
              {typeName}
            </Badge>

            <Badge
              variant="outline"
              className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 inline-flex items-center gap-1"
            >
              <MapPin className="h-3 w-3 text-primary shrink-0" />
              <span>{hubName}</span>
            </Badge>

            <Badge
              variant="outline"
              className="text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 inline-flex items-center gap-1"
            >
              <ShieldCheck className="h-3 w-3 text-sky-600" />
              <span>পাবলিক ডিরেক্টরি</span>
            </Badge>
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

        {/* Quick Capability Badges */}
        <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 shrink-0">
          {ambulance.is24x7 && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-bold">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              <span>২৪/৭ সার্বক্ষণিক স্ট্যান্ডবাই</span>
            </span>
          )}

          {ambulance.hasIcu && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-lg font-bold">
              <Activity className="h-3.5 w-3.5 text-rose-500" />
              <span>আইসিইউ ভেন্টিলেটর লাইফ সাপোর্ট</span>
            </span>
          )}

          {ambulance.hasOxygen && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-lg font-semibold">
              <Wind className="h-3.5 w-3.5 text-sky-600" />
              <span>সার্বক্ষণিক মেডিকেল অক্সিজেন</span>
            </span>
          )}

          {ambulance.freezingAmbulance && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-lg font-semibold">
              <Snowflake className="h-3.5 w-3.5 text-cyan-500" />
              <span>লাশবাহী ডিপ-ফ্রিজিং ভ্যান</span>
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pt-1">
        {description}
      </p>

      {/* Schedule & Operational Timing Banner */}
      <div className="rounded-xl border border-border/70 bg-muted/40 p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            পরিবহন পরিসীমা ও রুট কভারেজ
          </span>
          <span className="font-medium text-foreground flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-primary shrink-0" />
            <span>
              {ambulance.interDistrictCoverage
                ? "ফেনী, ঢাকা ও চট্টগ্রাম মহাসড়ক রুট"
                : "ফেনী পৌরসভা ও সকল উপজেলা"}
            </span>
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            কল ডেস্ক ও ডিউটি সময়সূচি
          </span>
          <span className="font-medium text-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{openHours}</span>
          </span>
        </div>
      </div>

      {/* Fleet Details & Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fleet Equipment & Specs */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>গাড়ির ধরন ও জরুরি চিকিৎসা সরঞ্জাম</span>
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/90">
            {fleetDetails.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Services Offered */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-rose-500" />
            <span>প্রধান রুট ও স্থানান্তর সেবা</span>
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/90">
            {servicesOffered.map((serv, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span>{serv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer: Contacts + Call to Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/70">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${ambulance.phone.replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{`ড্রাইভার কল করুন: ${ambulance.phone}`}</span>
            </a>

            {ambulance.hotline && ambulance.hotline !== ambulance.phone && (
              <a
                href={`tel:${ambulance.hotline.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-muted text-foreground/90 font-medium text-xs hover:bg-muted/80 transition-colors"
              >
                <span>{`হটলাইন: ${ambulance.hotline}`}</span>
              </a>
            )}

            {ambulance.emergencyContact && ambulance.emergencyContact !== ambulance.phone && (
              <a
                href={`tel:${ambulance.emergencyContact.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-muted text-foreground/90 font-medium text-xs hover:bg-muted/80 transition-colors"
              >
                <span>{`জরুরি: ${ambulance.emergencyContact}`}</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/emergency?tab=ambulances"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-semibold text-xs hover:bg-primary/20 transition-colors border border-primary/20"
          >
            <Search className="h-3.5 w-3.5" />
            <span>লাইভ অ্যাম্বুলেন্স তালিকা</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <span className="text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
            {ambulance.partnerDiscountBn || "পাবলিক ডিরেক্টরি (সরাসরি ড্রাইভার বুকিং)"}
          </span>
        </div>
      </div>
    </BlogReviewCardWrapper>
  );
}
