import Link from "next/link";
import {
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Activity,
  FileText,
  Home,
  Clock,
  FlaskConical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DiagnosticCenterReviewItem } from "@/types/blog";
import { BlogReviewCardWrapper } from "./BlogReviewCardWrapper";

interface DiagnosticReviewCardProps {
  center: DiagnosticCenterReviewItem;
}

export function DiagnosticReviewCard({
  center,
}: DiagnosticReviewCardProps) {
  const name = center.nameBn || center.nameEn;
  const address = center.addressBn || center.addressEn;
  const typeName = center.typeBn || center.typeEn;
  const description = center.descriptionBn ||
    `${center.nameBn} ফেনীর একটি বিশ্বস্ত ডায়াগনস্টিক সেন্টার, যেখানে নির্ভুল রোগ নির্ণয় ও আধুনিক প্যাথলজি পরীক্ষা সেবা প্রদান করা হয়।`;

  const sectionId = `diagnostic-${center.rank}`;

  return (
    <BlogReviewCardWrapper
      sectionId={sectionId}
      rank={center.rank}
      partnerStatus={center.partnerStatus}
    >
      {/* Header: Names + Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium border-border/80">
              {typeName}
            </Badge>

            {center.partnerStatus && (
              <Badge className="bg-emerald-600 dark:bg-emerald-700 text-white font-semibold flex items-center gap-1 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>অফিসিয়াল পার্টনার ল্যাব</span>
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
          {center.homeSampleCollection && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-semibold">
              <Home className="h-3.5 w-3.5" />
              <span>হোম কালেকশন সুবিধা</span>
            </span>
          )}

          {center.onlineReport && (
            <span className="inline-flex items-center gap-1 text-xs bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-lg font-semibold">
              <FileText className="h-3.5 w-3.5" />
              <span>অনলাইন রিপোর্ট পোর্টাল</span>
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
        {description}
      </p>

      {/* Equipment Highlights */}
      {center.equipmentHighlightsBn && center.equipmentHighlightsBn.length > 0 && (
        <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-2.5">
          <h4 className="font-heading text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span>আধুনিক ডায়াগনস্টিক প্রযুক্তি ও যন্ত্রপাতি:</span>
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

      {/* Key Features / Services */}
      <div className="space-y-2.5">
        <h4 className="font-heading text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>ল্যাবের প্রধান বৈশিষ্ট্য ও সেবাসমূহ:</span>
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
          {center.keyFeaturesBn.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Test Categories Tags */}
      {center.testCategoriesBn && center.testCategoriesBn.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-heading text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <FlaskConical className="h-3.5 w-3.5 text-primary" />
            <span>পরীক্ষার প্রধান বিভাগসমূহ</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {center.testCategoriesBn.map((category, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-xs bg-muted/80 text-foreground px-2.5 py-1 rounded-md border border-border/60"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Report Delivery Time Note */}
      {center.reportTimingBn && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-xl">
          <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>
            <strong className="text-foreground">রিপোর্ট ডেলিভারি: </strong>
            {center.reportTimingBn}
          </span>
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
          <a
            href={`tel:${center.phone.replace(/[^0-9]/g, "")}`}
            aria-label={`কল করুন ${name}: ${center.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{center.phone}</span>
          </a>

          {center.hotline && center.hotline !== center.phone && (
            <a
              href={`tel:${center.hotline.replace(/[^0-9]/g, "")}`}
              aria-label={`হটলাইন ${name}: ${center.hotline}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-foreground text-xs font-semibold transition-colors"
            >
              <span>{"হটলাইন: "}{center.hotline}</span>
            </a>
          )}
        </div>

        {center.mapQuery && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              center.mapQuery
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`গুগল ম্যাপে দেখুন - ${name}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>গুগল ম্যাপে দেখুন</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
      </div>
    </BlogReviewCardWrapper>
  );
}
