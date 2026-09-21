"use client";

import {
  ShieldAlert,
  Activity,
  HeartPulse,
  Truck,
  Stethoscope,
  Pill,
  Wifi,
  Sparkles,
  BedDouble,
  Microscope,
  CheckCircle2,
  ThermometerSnowflake,
  UserCheck,
  PackageCheck,
  ReceiptText,
} from "lucide-react";
import { Partner } from "@/services/db";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { getResolvedFacilities } from "@/lib/facilities";

interface HospitalFacilityBadgesProps {
  partner: Partner;
}

const FACILITY_STYLE_MAP: Record<
  string,
  { colorClass: string; bgClass: string; icon: typeof ShieldAlert }
> = {
  emergency: {
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40",
    icon: ShieldAlert,
  },
  icu_ccu: {
    colorClass: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40",
    icon: HeartPulse,
  },
  ambulance: {
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40",
    icon: Truck,
  },
  pathology: {
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40",
    icon: Microscope,
  },
  imaging: {
    colorClass: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/40",
    icon: Activity,
  },
  ot: {
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/40",
    icon: Sparkles,
  },
  pharmacy_dept: {
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40",
    icon: Pill,
  },
  consultation: {
    colorClass: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/40",
    icon: Stethoscope,
  },
  cabins: {
    colorClass: "text-sky-600 dark:text-sky-400",
    bgClass: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/40",
    icon: BedDouble,
  },
  facilities: {
    colorClass: "text-slate-600 dark:text-slate-400",
    bgClass: "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800",
    icon: Wifi,
  },
  dialysis: {
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40",
    icon: Activity,
  },
  nicu_picu: {
    colorClass: "text-rose-600 dark:text-rose-400",
    bgClass: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40",
    icon: HeartPulse,
  },
  blood_bank: {
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40",
    icon: ShieldAlert,
  },
  physiotherapy: {
    colorClass: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/40",
    icon: Sparkles,
  },
  genuine_drugs: {
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40",
    icon: Pill,
  },
  cold_chain: {
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40",
    icon: ThermometerSnowflake,
  },
  pharmacist: {
    colorClass: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/40",
    icon: UserCheck,
  },
  surgical: {
    colorClass: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/40",
    icon: PackageCheck,
  },
  invoicing: {
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/40",
    icon: ReceiptText,
  },
  support: {
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40",
    icon: ShieldAlert,
  },
};

const DEFAULT_STYLE = {
  colorClass: "text-emerald-600 dark:text-emerald-400",
  bgClass: "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30",
  icon: Sparkles,
};

export default function HospitalFacilityBadges({ partner }: HospitalFacilityBadgesProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const isDiagnostic = partner.category === "diagnostic";
  const isPharmacy = partner.category === "pharmacy";

  const activeFacilities = getResolvedFacilities(partner);

  const sectionTitle = isPharmacy
    ? isEn
      ? "Pharmacy & Medicine Services"
      : "ফার্মেসি ও ঔষধ সেবার সুবিধাসমূহ"
    : isDiagnostic
    ? isEn
      ? "Diagnostic & Pathology Highlights"
      : "ডায়াগনস্টিক ও ল্যাব সুবিধাসমূহ"
    : isEn
    ? "Hospital & Facility Highlights"
    : "হাসপাতাল ও চিকিৎসাসেবার সুবিধাসমূহ";

  const sectionSubtitle = isPharmacy
    ? isEn
      ? "Verified medicine quality standards and services at this pharmacy"
      : "এই ফার্মেসিতে ঔষধ সংরক্ষণ ও গুণগত মান নিশ্চিতকরণ সুবিধাসমূহ"
    : isEn
    ? "Verified modern medical facilities available for patients"
    : "রোগীদের সেবায় প্রতিষ্ঠানের বিদ্যমান ভেরিফাইড চিকিৎসাসেবা সমূহ";

  if (activeFacilities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-secondary dark:text-white font-heading">
            {sectionTitle}
          </h2>
          <p className="text-xs text-muted-foreground">{sectionSubtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {activeFacilities.map((f) => {
          const style = FACILITY_STYLE_MAP[f.id] || DEFAULT_STYLE;
          const Icon = style.icon;

          return (
            <div
              key={f.id}
              className={`p-3.5 rounded-2xl border ${style.bgClass} flex items-start gap-3 transition-all hover:shadow-xs`}
            >
              <div
                className={`p-2 rounded-xl bg-background dark:bg-slate-900 shadow-2xs shrink-0 ${style.colorClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground truncate font-heading">
                    {isEn ? f.nameEn : f.nameBn}
                  </h3>
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mt-0.5">
                  {isEn ? f.descEn : f.descBn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
