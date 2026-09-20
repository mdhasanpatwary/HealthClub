import Link from "next/link";
import {
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Clock,
  Moon,
  Snowflake,
  Truck,
  Pill,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PharmacyReviewItem } from "@/types/pharmacyBlog";
import { BlogReviewCardWrapper } from "./BlogReviewCardWrapper";

interface PharmacyReviewCardProps {
  pharmacy: PharmacyReviewItem;
  locale?: string;
}

export function PharmacyReviewCard({
  pharmacy,
  locale = "bn",
}: PharmacyReviewCardProps) {
  const isEn = locale === "en";
  const name = isEn ? pharmacy.nameEn : pharmacy.nameBn;
  const address = isEn ? pharmacy.addressEn : pharmacy.addressBn;
  const typeName = isEn ? pharmacy.typeEn : pharmacy.typeBn;
  const hubName = isEn ? pharmacy.hubEn : pharmacy.hubBn;
  const description = isEn
    ? pharmacy.descriptionEn ||
      `${pharmacy.nameEn} is a verified pharmaceutical dispensing facility located at ${pharmacy.addressEn}, Feni, providing emergency medicines, insulin cold-chain storage, and home delivery support.`
    : pharmacy.descriptionBn;

  const keyFeatures = isEn
    ? pharmacy.keyFeaturesEn || pharmacy.keyFeaturesBn
    : pharmacy.keyFeaturesBn;

  const serviceHighlights = isEn
    ? pharmacy.serviceHighlightsEn || pharmacy.serviceHighlightsBn
    : pharmacy.serviceHighlightsBn;

  const deliveryAreas = isEn
    ? pharmacy.deliveryAreasEn || pharmacy.deliveryAreasBn
    : pharmacy.deliveryAreasBn;

  const openHours = isEn
    ? pharmacy.openHoursEn || pharmacy.openHoursBn
    : pharmacy.openHoursBn;

  const nightServiceType = isEn
    ? pharmacy.nightServiceTypeEn || pharmacy.nightServiceTypeBn
    : pharmacy.nightServiceTypeBn;

  const sectionId = `pharmacy-${pharmacy.rank}`;

  return (
    <BlogReviewCardWrapper
      sectionId={sectionId}
      rank={pharmacy.rank}
      partnerStatus={pharmacy.partnerStatus}
      locale={locale}
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

            {pharmacy.partnerStatus && (
              <Badge className="bg-emerald-600 dark:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{isEn ? "Health Club Partner" : "অফিসিয়াল পার্টনার ফার্মেসি"}</span>
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
          {pharmacy.is24x7 ? (
            <span className="inline-flex items-center gap-1.5 text-xs bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-lg font-bold">
              <Moon className="h-3.5 w-3.5" />
              <span>{isEn ? "24/7 Night Service" : "২৪/৭ সার্বক্ষণিক নাইট সার্ভিস"}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg font-semibold">
              <Clock className="h-3.5 w-3.5" />
              <span>{openHours}</span>
            </span>
          )}

          {pharmacy.coldChainStorage && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-lg font-semibold">
              <Snowflake className="h-3.5 w-3.5" />
              <span>{isEn ? "Insulin Cold Chain (2°-8°C)" : "ইনসুলিন কোল্ড চেইন (২°-৮° সে.)"}</span>
            </span>
          )}

          {pharmacy.homeDelivery && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-semibold">
              <Truck className="h-3.5 w-3.5" />
              <span>{isEn ? "Emergency Home Delivery" : "জরুরি হোম ডেলিভারি"}</span>
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pt-1">
        {description}
      </p>

      {/* Night Service & Timing Bar */}
      <div className="rounded-xl border border-border/70 bg-muted/40 p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            {isEn ? "Night Service Access" : "নাইট কাউন্টার ও সার্ভিস সুবিধা"}
          </span>
          <span className="font-medium text-foreground flex items-center gap-1.5">
            <Moon className="h-4 w-4 text-primary shrink-0" />
            <span>{nightServiceType}</span>
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            {isEn ? "Regular Schedule" : "সাধারণ সময়সূচি"}
          </span>
          <span className="font-medium text-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span>{openHours}</span>
          </span>
        </div>
      </div>

      {/* Key Features & Service Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Features */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>{isEn ? "Key Facilities & Features" : "প্রধান সুবিধা ও বৈশিষ্ট্য"}</span>
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/90">
            {keyFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Service Highlights */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Pill className="h-3.5 w-3.5 text-primary" />
            <span>{isEn ? "Medicine & Device Specialities" : "বিশেষায়িত ওষুধ ও ডিভাইস সরবরাহ"}</span>
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/90">
            {serviceHighlights.map((serv, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0 mt-1.5" />
                <span>{serv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Delivery Areas */}
      {deliveryAreas && deliveryAreas.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            {isEn ? "Emergency Home Delivery Coverage" : "হোম ডেলিভারি সেবা কভারেজ এলাকা"}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {deliveryAreas.map((area, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-muted text-foreground/80 border border-border/60"
              >
                <Truck className="h-3 w-3 text-muted-foreground" />
                <span>{area}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer: Contacts + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/70">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${pharmacy.phone.replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{isEn ? `Call: ${pharmacy.phone}` : `কল করুন: ${pharmacy.phone}`}</span>
            </a>

            {pharmacy.hotline && (
              <a
                href={`tel:${pharmacy.hotline.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-foreground/90 font-medium text-xs hover:bg-muted/80 transition-colors"
              >
                <span>{isEn ? `Alt: ${pharmacy.hotline}` : `হটলাইন: ${pharmacy.hotline}`}</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pharmacy.partnerStatus && pharmacy.partnerProfileSlug && (
            <Link
              href={`/partner-hospitals/${encodeURIComponent(pharmacy.partnerProfileSlug)}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>{isEn ? "View Partner Profile" : "পার্টনার প্রোফাইল দেখুন"}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}

          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {pharmacy.partnerDiscountBn || "১০-৩০% মেম্বার ছাড়"}
          </span>
        </div>
      </div>
    </BlogReviewCardWrapper>
  );
}
