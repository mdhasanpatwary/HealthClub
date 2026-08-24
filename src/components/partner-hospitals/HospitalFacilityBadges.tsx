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

interface HospitalFacilityBadgesProps {
  partner: Partner;
}

interface FacilityItem {
  id: string;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  icon: typeof ShieldAlert;
  colorClass: string;
  bgClass: string;
  isAvailable: boolean;
}

export default function HospitalFacilityBadges({ partner }: HospitalFacilityBadgesProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const isHospital = partner.category === "hospital";
  const isDiagnostic = partner.category === "diagnostic";
  const isPharmacy = partner.category === "pharmacy";

  const hospitalAndDiagnosticFacilities: FacilityItem[] = [
    {
      id: "emergency",
      nameBn: "২৪/৭ জরুরি বিভাগ",
      nameEn: "24/7 Emergency Care",
      descBn: "সার্বক্ষণিক জরুরি চিকিৎসা ও ট্রমা সেবা",
      descEn: "Round-the-clock emergency & trauma management",
      icon: ShieldAlert,
      colorClass: "text-red-600 dark:text-red-400",
      bgClass: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40",
      isAvailable: isHospital || Boolean(partner.emergencyPhone),
    },
    {
      id: "icu_ccu",
      nameBn: "আইসিইউ ও সসিসিইউ",
      nameEn: "ICU & CCU Units",
      descBn: "আধুনিক লাইফ সাপোর্ট ও কার্ডিয়াক মনিটরিং",
      descEn: "Modern life support & cardiac monitoring",
      icon: HeartPulse,
      colorClass: "text-rose-600 dark:text-rose-400",
      bgClass: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40",
      isAvailable: isHospital,
    },
    {
      id: "ambulance",
      nameBn: "জরুরি অ্যাম্বুলেন্স",
      nameEn: "Emergency Ambulance",
      descBn: "অন-কল দ্রুত রোগী স্থানান্তর ব্যবস্থা",
      descEn: "On-call patient transfer & oxygen support",
      icon: Truck,
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40",
      isAvailable: isHospital || Boolean(partner.emergencyPhone),
    },
    {
      id: "pathology",
      nameBn: "ডিজিটাল প্যাথলজি ল্যাব",
      nameEn: "Digital Pathology Lab",
      descBn: "স্বয়ংক্রিয় হরমোন ও বায়োকেমিস্ট্রি পরীক্ষা",
      descEn: "Automated hormone, blood & biochemistry tests",
      icon: Microscope,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40",
      isAvailable: isHospital || isDiagnostic,
    },
    {
      id: "imaging",
      nameBn: "ডিজিটাল এক্স-রে ও ইউএসজি",
      nameEn: "Digital X-Ray & 4D USG",
      descBn: "হাই-রেজোলিউশন ডায়াগনস্টিক ইমেজিং",
      descEn: "High-resolution 4D Ultrasonography & Imaging",
      icon: Activity,
      colorClass: "text-indigo-600 dark:text-indigo-400",
      bgClass: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/40",
      isAvailable: isHospital || isDiagnostic,
    },
    {
      id: "ot",
      nameBn: "মডার্ন অপারেশন থিয়েটার",
      nameEn: "Modern Operation Theater",
      descBn: "ল্যাপারোস্কপিক ও জেনারেল সার্জারি সুবিধা",
      descEn: "Laparoscopic, general & orthopedic surgery",
      icon: Sparkles,
      colorClass: "text-purple-600 dark:text-purple-400",
      bgClass: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/40",
      isAvailable: isHospital,
    },
    {
      id: "pharmacy_dept",
      nameBn: "ইন-হাউজ ফার্মেসি",
      nameEn: "In-House Pharmacy",
      descBn: "১০০% খাঁটি ও কোল্ড-চেইন সংরক্ষিত ঔষধ",
      descEn: "100% genuine & temperature-controlled medicine",
      icon: Pill,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40",
      isAvailable: isHospital,
    },
    {
      id: "consultation",
      nameBn: "বিশেষজ্ঞ কনসালটেশন",
      nameEn: "Specialist OPD Chambers",
      descBn: "নিয়মিত অভিজ্ঞ কনসালটেন্ট চিকিৎসকের সেবা",
      descEn: "Resident and visiting consultant chambers",
      icon: Stethoscope,
      colorClass: "text-teal-600 dark:text-teal-400",
      bgClass: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/40",
      isAvailable: isHospital || isDiagnostic,
    },
    {
      id: "cabins",
      nameBn: "এসি কেবিন ও ওয়ার্ড",
      nameEn: "AC Cabins & General Ward",
      descBn: "পরিচ্ছন্ন ও আরামদায়ক ইনডোর ভর্তি সুবিধা",
      descEn: "Hygienic private cabins & monitored wards",
      icon: BedDouble,
      colorClass: "text-sky-600 dark:text-sky-400",
      bgClass: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-900/40",
      isAvailable: isHospital,
    },
    {
      id: "facilities",
      nameBn: "ফ্রি ওয়াইফাই ও জেনারেটর",
      nameEn: "Generator & Wi-Fi",
      descBn: "নিরবচ্ছিন্ন বিদ্যুৎ ও অপেক্ষমান লাউঞ্জ",
      descEn: "24/7 power backup & comfortable waiting area",
      icon: Wifi,
      colorClass: "text-slate-600 dark:text-slate-400",
      bgClass: "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800",
      isAvailable: true,
    },
  ];

  const pharmacyFacilities: FacilityItem[] = [
    {
      id: "genuine_drugs",
      nameBn: "১০০% খাঁটি ও আসল ঔষধ",
      nameEn: "100% Genuine Medicines",
      descBn: "রেজিস্টার্ড ফার্মাসিউটিক্যালস কোম্পানির জেনুইন ঔষধ",
      descEn: "Authentic drugs sourced directly from authorized companies",
      icon: Pill,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40",
      isAvailable: true,
    },
    {
      id: "cold_chain",
      nameBn: "কোল্ড-চেইন সংরক্ষণ",
      nameEn: "Cold-Chain Temperature Control",
      descBn: "ইনসুলিন ও ভ্যাকসিনের সঠিক তাপমাত্রা নিয়ন্ত্রণ ব্যবস্থা",
      descEn: "Monitored refrigeration for insulin, vaccines & biotics",
      icon: ThermometerSnowflake,
      colorClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40",
      isAvailable: true,
    },
    {
      id: "pharmacist",
      nameBn: "অভিজ্ঞ ফার্মাসিস্ট পরামর্শ",
      nameEn: "Registered Pharmacist On Duty",
      descBn: "ঔষধ সেবনের সঠিক নিয়ম ও ডোজ নির্দেশনা",
      descEn: "Expert guidance on dosage, administration & safety",
      icon: UserCheck,
      colorClass: "text-teal-600 dark:text-teal-400",
      bgClass: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/40",
      isAvailable: true,
    },
    {
      id: "surgical",
      nameBn: "সার্জিক্যাল ও হেলথকেয়ার আইটেম",
      nameEn: "Surgical & Health Supplies",
      descBn: "বিপি মেশিন, গ্লুকোমিটার স্ট্রিপ ও সার্জিক্যাল সামগ্রী",
      descEn: "BP monitors, glucometer strips & surgical disposables",
      icon: PackageCheck,
      colorClass: "text-indigo-600 dark:text-indigo-400",
      bgClass: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/40",
      isAvailable: true,
    },
    {
      id: "invoicing",
      nameBn: "স্বচ্ছ কম্পিউটারাইজড বিলিং",
      nameEn: "Computerized Billing & Discount",
      descBn: "প্রতিটি ক্রয়ে মুদ্রিত ইনভয়েস ও মেম্বার ডিসকাউন্ট",
      descEn: "Printed receipts with itemized Health Club discount",
      icon: ReceiptText,
      colorClass: "text-purple-600 dark:text-purple-400",
      bgClass: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/40",
      isAvailable: true,
    },
    {
      id: "support",
      nameBn: "জরুরি সেবা ও সাপোর্ট",
      nameEn: "Direct Support & Guidance",
      descBn: "জরুরি ঔষধ প্রাপ্তির তথ্য ও সার্বক্ষণিক সহায়তা",
      descEn: "Availability check and quick phone support",
      icon: ShieldAlert,
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40",
      isAvailable: true,
    },
  ];

  const activeFacilities = isPharmacy
    ? pharmacyFacilities
    : hospitalAndDiagnosticFacilities.filter((f) => f.isAvailable);

  const sectionTitle = isPharmacy
    ? isEn ? "Pharmacy & Medicine Services" : "ফার্মেসি ও ঔষধ সেবার সুবিধাসমূহ"
    : isDiagnostic
    ? isEn ? "Diagnostic & Pathology Highlights" : "ডায়াগনস্টিক ও ল্যাব সুবিধাসমূহ"
    : isEn ? "Hospital & Facility Highlights" : "হাসপাতাল ও চিকিৎসাসেবার সুবিধাসমূহ";

  const sectionSubtitle = isPharmacy
    ? isEn ? "Verified medicine quality standards and services at this pharmacy" : "এই ফার্মেসিতে ঔষধ সংরক্ষণ ও গুণগত মান নিশ্চিতকরণ সুবিধাসমূহ"
    : isEn ? "Verified modern medical facilities available for patients" : "রোগীদের সেবায় প্রতিষ্ঠানের বিদ্যমান ভেরিফাইড চিকিৎসাসেবা সমূহ";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-secondary dark:text-white font-heading">
            {sectionTitle}
          </h2>
          <p className="text-xs text-muted-foreground">
            {sectionSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {activeFacilities.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.id}
              className={`p-3.5 rounded-2xl border ${f.bgClass} flex items-start gap-3 transition-all hover:shadow-xs`}
            >
              <div className={`p-2 rounded-xl bg-background dark:bg-slate-900 shadow-2xs shrink-0 ${f.colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
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
