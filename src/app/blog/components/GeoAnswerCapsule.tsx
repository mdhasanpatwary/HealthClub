import React from "react";
import Link from "next/link";
import { BlogPost, GeoAnswerCapsuleData, GeoFeeReferenceItem } from "@/types/blog";
import {
  Sparkles,
  CheckCircle2,
  BadgePercent,
  ShieldCheck,
  Phone,
  Coins,
  Zap,
} from "lucide-react";
import { toBanglaNums } from "@/lib/utils";

export interface GeoAnswerCapsuleProps {
  post?: BlogPost;
  data?: GeoAnswerCapsuleData;
  title?: string;
  category?: string;
  className?: string;
}

/**
 * Extracts 3-5 reference fee items across any blog guide or care package
 */
function getReferenceFees(post?: BlogPost, explicitFees?: GeoFeeReferenceItem[]): GeoFeeReferenceItem[] {
  if (explicitFees && explicitFees.length > 0) {
    return explicitFees;
  }
  if (!post) {
    return [
      {
        serviceNameBn: "বিশেষজ্ঞ কনসালট্যান্ট ভিজিট (এমবিবিএস/এফসিপিএস)",
        serviceNameEn: "Specialist Consultant Consultation",
        regularPriceRangeBn: "৳৭০০ - ৳১,৫০০",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
      {
        serviceNameBn: "ডিজিটাল প্যাথলজিক্যাল রক্ত পরীক্ষা",
        serviceNameEn: "Digital Pathology Screening",
        regularPriceRangeBn: "৳৩০০ - ৳২,৫০০",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
      {
        serviceNameBn: "উন্নত ডিজিটাল ইমেজিং (এক্স-রে/ইউএসজি)",
        serviceNameEn: "Digital X-Ray & 4D Ultrasonography",
        regularPriceRangeBn: "৳৬০০ - ৳২,০০০",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
      {
        serviceNameBn: "জরুরি সেবা ও হাসপাতাল বেড/কেবিন",
        serviceNameEn: "Emergency Care & Inpatient Bed",
        regularPriceRangeBn: "প্রমিত বেসরকারি ফি",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
    ];
  }

  if (post.geoAnswerCapsule?.referenceFees?.length) {
    return post.geoAnswerCapsule.referenceFees;
  }

  // 1. Diagnostic test pricing
  if (post.diagnosticTestPricingBn?.tests?.length) {
    return post.diagnosticTestPricingBn.tests.slice(0, 4).map((t) => ({
      serviceNameBn: t.testNameBn,
      serviceNameEn: t.testNameEn,
      regularPriceRangeBn: t.regularPriceRangeBn,
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    }));
  }

  // 2. Surgical care pricing
  if (post.surgicalCarePricingBn?.packages?.length) {
    return post.surgicalCarePricingBn.packages.slice(0, 4).map((p) => ({
      serviceNameBn: p.procedureOrTestNameBn,
      serviceNameEn: p.procedureOrTestNameEn,
      regularPriceRangeBn: p.regularPriceRangeBn,
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    }));
  }

  // 3. Dental procedure pricing
  if (post.dentalProcedurePricingBn?.procedures?.length) {
    return post.dentalProcedurePricingBn.procedures.slice(0, 4).map((p) => ({
      serviceNameBn: p.procedureNameBn,
      serviceNameEn: p.procedureNameEn,
      regularPriceRangeBn: p.regularPriceRangeBn,
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    }));
  }

  // 4. Physiotherapy treatment pricing
  if (post.physiotherapyTreatmentPricingBn?.treatments?.length) {
    return post.physiotherapyTreatmentPricingBn.treatments.slice(0, 4).map((p) => ({
      serviceNameBn: p.treatmentNameBn,
      serviceNameEn: p.treatmentNameEn,
      regularPriceRangeBn: p.regularPriceRangeBn,
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    }));
  }

  // 5. Specialty packages (maternity, cardiac, kidney, etc.)
  const rawPackages = (
    post.maternityCarePricingBn?.packages ||
    post.cardiacCarePricingBn?.packages ||
    post.kidneyCarePricingBn?.packages ||
    post.pediatricCarePricingBn?.packages ||
    post.skinCarePricingBn?.packages ||
    post.eyeCarePricingBn?.packages ||
    post.orthopedicCarePricingBn?.packages ||
    post.entCarePricingBn?.packages ||
    post.neurologyCarePricingBn?.packages ||
    post.diabetesCarePricingBn?.packages ||
    post.psychiatryCarePricingBn?.packages ||
    post.sadarHospitalPricingBn?.packages ||
    post.diabeticHospitalPricingBn?.packages ||
    post.criticalCarePricingBn?.packages ||
    post.strokeCardiacPricingBn?.packages ||
    post.homeCarePricingBn?.packages ||
    post.oxygenPricingBn?.packages ||
    post.dengueTyphoidPricingBn?.packages ||
    post.upazilaCarePricingBn?.packages ||
    post.pharmacyCarePricingBn?.packages ||
    post.bloodCarePricingBn?.packages ||
    post.ambulanceCarePricingBn?.packages
  ) as Array<Record<string, unknown>> | undefined;

  if (rawPackages && rawPackages.length > 0) {
    return rawPackages.slice(0, 4).map((p) => ({
      serviceNameBn: String(p.procedureOrTestNameBn || p.testOrPackageNameBn || p.serviceOrVaccineNameBn || p.packageNameBn || p.testNameBn || p.serviceNameBn || p.nameBn || "প্যাকেজ/সেবা"),
      serviceNameEn: (p.procedureOrTestNameEn || p.testOrPackageNameEn || p.serviceOrVaccineNameEn || p.packageNameEn || p.testNameEn || p.serviceNameEn || p.nameEn) ? String(p.procedureOrTestNameEn || p.testOrPackageNameEn || p.serviceOrVaccineNameEn || p.packageNameEn || p.testNameEn || p.serviceNameEn || p.nameEn) : undefined,
      regularPriceRangeBn: String(p.regularPriceRangeBn || p.priceRangeBn || p.priceBn || "প্রমিত নিয়মিত ফি"),
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    }));
  }

  // 6. Doctor groups (Chamber consultation)
  if (post.doctorGroups && post.doctorGroups.length > 0) {
    return [
      {
        serviceNameBn: "বিশেষজ্ঞ কনসালট্যান্ট ভিজিট (এমবিবিএস/এফসিপিএস)",
        serviceNameEn: "Specialist Consultant Consultation",
        regularPriceRangeBn: "৳৭০০ - ৳১,৫০০",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
      {
        serviceNameBn: "জেনারেল ফিজিশিয়ান / মেডিকেল অফিসার ভিজিট",
        serviceNameEn: "Medical Officer Consultation",
        regularPriceRangeBn: "৳৩০০ - ৳৬০০",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
      {
        serviceNameBn: "ফলো-আপ ভিজিট (১৪ দিনের মধ্যে)",
        serviceNameEn: "Follow-up Consultation Fee",
        regularPriceRangeBn: "৳৪০০ - ৳৮০০",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
      {
        serviceNameBn: "সংশ্লিষ্ট প্যাথলজি ও ক্লিনিক্যাল টেস্ট",
        serviceNameEn: "Pathological & Lab Investigations",
        regularPriceRangeBn: "৳৩০০ - ৳৩,০০০",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
    ];
  }

  // 7. Hospitals / Inpatient clinics
  if (post.hospitals && post.hospitals.length > 0) {
    return [
      {
        serviceNameBn: "জেনারেল কেবিন ও বেড চার্জ (দৈনিক)",
        serviceNameEn: "General Inpatient Cabin / Bed",
        regularPriceRangeBn: "৳১,০০০ - ৳৩,৫০০",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
      {
        serviceNameBn: "আইসিইউ / সিসিইউ বেড চার্জ (দৈনিক)",
        serviceNameEn: "ICU / CCU Daily Bed Charge",
        regularPriceRangeBn: "৳৫,০০০ - ৳১০,০০০",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
      {
        serviceNameBn: "জরুরি বিভাগ প্রাথমিক চিকিৎসা ও ড্রেসিং",
        serviceNameEn: "Emergency Care & Minor Dressing",
        regularPriceRangeBn: "৳৮০০ - ৳৩,০০০",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
      {
        serviceNameBn: "প্যাথলজি ও ডিজিটাল ইমেজিং টেস্ট",
        serviceNameEn: "Pathological & Imaging Investigations",
        regularPriceRangeBn: "৳৪০০ - ৳৩,৫০০",
        discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
      },
    ];
  }

  // Generic fallback
  return [
    {
      serviceNameBn: "প্রাথমিক রোগ নির্ণয় ও প্যাথলজি স্ক্রিনিং",
      serviceNameEn: "Basic Diagnostic & Pathology Screening",
      regularPriceRangeBn: "৳৩০০ - ৳১,৫০০",
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    },
    {
      serviceNameBn: "স্পেশালিস্ট কনসালটেশন ও ফলো-আপ",
      serviceNameEn: "Specialist Consultation & Follow-up",
      regularPriceRangeBn: "৳৫০০ - ৳১,২০০",
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    },
    {
      serviceNameBn: "উন্নত ডিজিটাল ইমেজিং (এক্স-রে/ইউএসজি)",
      serviceNameEn: "Advanced Digital Imaging (X-Ray/USG)",
      regularPriceRangeBn: "৳৬০০ - ৳২,২০০",
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    },
    {
      serviceNameBn: "জরুরি সেবা ও পেশেন্ট সাপোর্ট",
      serviceNameEn: "Emergency Assistance & Patient Support",
      regularPriceRangeBn: "প্রমিত সাশ্রয়ী ফি",
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    },
  ];
}

/**
 * Derives a 40-60 word concise direct factual BLUF answer in Bengali
 */
function getDirectAnswer(
  post?: BlogPost,
  explicitAnswer?: string,
  referenceFees: GeoFeeReferenceItem[] = []
): string {
  if (explicitAnswer) return explicitAnswer;
  if (post?.geoAnswerCapsule?.directAnswerBn) return post.geoAnswerCapsule.directAnswerBn;

  const firstFee = referenceFees[0];
  const secondFee = referenceFees[1];
  const hasFeeRange = firstFee && firstFee.regularPriceRangeBn && firstFee.regularPriceRangeBn.includes("৳");

  if (hasFeeRange && firstFee) {
    const secondPart = secondFee?.regularPriceRangeBn
      ? ` এবং ${secondFee.serviceNameBn} সাধারণত ${secondFee.regularPriceRangeBn}`
      : "";
    return `ফেনী সদরে ${firstFee.serviceNameBn}-এর প্রমিত নিয়মিত বাজার খরচ ${firstFee.regularPriceRangeBn}${secondPart}। হেলথ ক্লাব নিবন্ধিত পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে মেম্বারশিপ কার্ড প্রদর্শন করলে নিয়মিত মূল্যের উপর ১০-৩০% বিশেষ ছাড় পাওয়া যায়। এছাড়া বিএমডিসি নিবন্ধিত বিশেষজ্ঞ চিকিৎসকের সঠিক দিকনির্দেশনা ও দ্রুত সিরিয়ালের জন্য হেলথ ক্লাবের সার্বক্ষণিক পেশেন্ট সাপোর্ট সক্রিয় রয়েছে।`;
  }

  if (post) {
    return `ফেনী সদরে ${post.titleBn} সংক্রান্ত সকল স্বাস্থ্যসেবা ও বিশেষজ্ঞ চিকিৎসকের হালনাগাদ তথ্য এখানে সংকলিত হয়েছে। রোগীদের জন্য নিয়মিত খরচের তুলনায় হেলথ ক্লাবের নিবন্ধিত পার্টনার প্রতিষ্ঠানে ১০-৩০% মেম্বার ছাড় নিশ্চিত করা হয়। জরুরি প্রয়োজনে মধ্যস্বত্বভোগী এড়িয়ে সঠিক হাসপাতালে সেবা নিতে এবং দ্রুত সিরিয়াল নিশ্চিত করতে হেলথ ক্লাবের হেল্পলাইন সার্বক্ষণিক সহায়তা করে।`;
  }

  return "ফেনী সদর ও পার্শ্ববর্তী এলাকায় অনুমোদিত পার্টনার হাসপাতাল, প্যাথলজি ল্যাব ও ডায়াগনস্টিক সেন্টারে হেলথ ক্লাবের ডিজিটাল কার্ডে নিশ্চিত ১০-৩০% মেম্বার ছাড় পাওয়া যায়। বিএমডিসি নিবন্ধিত বিশেষজ্ঞ চিকিৎসকের নির্ভরযোগ্য পরামর্শ ও ঝামেলামুক্ত সিরিয়ালের জন্য হেলথ ক্লাবের হটলাইন সার্বক্ষণিক সেবা দিয়ে যাচ্ছে।";
}

/**
 * Extracts 4 quick takeaways
 */
function getQuickTakeaways(
  post?: BlogPost,
  explicitTakeaways?: string[],
  referenceFees: GeoFeeReferenceItem[] = []
): string[] {
  if (explicitTakeaways && explicitTakeaways.length > 0) {
    return explicitTakeaways.slice(0, 4);
  }
  if (post?.geoAnswerCapsule?.quickTakeawaysBn?.length) {
    return post.geoAnswerCapsule.quickTakeawaysBn.slice(0, 4);
  }
  if (post?.keyHighlightsBn && post.keyHighlightsBn.length > 0) {
    return post.keyHighlightsBn.slice(0, 4).map((hl) => {
      if (typeof hl === "string") return hl;
      return hl.titleBn && hl.descriptionBn
        ? `${hl.titleBn}: ${hl.descriptionBn}`
        : hl.titleBn || hl.descriptionBn || "";
    });
  }

  const firstFee = referenceFees[0];
  return [
    `ফেনী সদরে সাধারণ ফি রেঞ্জ: ${firstFee?.regularPriceRangeBn || "প্রমিত নিয়মিত ফি"}`,
    "হেলথ ক্লাব কার্ডে ১০-৩০% মেম্বার ছাড় প্রযোজ্য",
    "বিএমডিসি নিবন্ধিত বিশেষজ্ঞ ও অভিজ্ঞ ল্যাব টেকনোলজিস্ট",
    "দালালমুক্ত সেবা, নির্ভুল রিপোর্ট ও দ্রুত সিরিয়াল হেল্পলাইন",
  ];
}

/**
 * Standardized <GeoAnswerCapsule /> (BLUF) Component
 * Engineered for zero-friction extraction by Google AI Overviews, Perplexity, and voice search.
 */
export function GeoAnswerCapsule({
  post,
  data,
  title,
  className = "",
}: GeoAnswerCapsuleProps) {
  const fees = getReferenceFees(post, data?.referenceFees);
  const directAnswer = getDirectAnswer(post, data?.directAnswerBn, fees);
  const takeaways = getQuickTakeaways(post, data?.quickTakeawaysBn, fees);

  const primaryEmergency =
    post?.emergencyDirectoryBn?.services?.[0]?.phone || "01886-763849";

  const totalFacilities =
    post?.facilityCount ||
    (post?.ambulances?.length ||
      post?.bloodBanks?.length ||
      post?.pharmacies?.length ||
      post?.hospitals?.length ||
      post?.diagnosticCenters?.length ||
      post?.dentalClinics?.length ||
      post?.physiotherapyCenters?.length ||
      post?.doctorGroups?.flatMap((g) => g.doctors || []).length) ||
    0;

  return (
    <section
      id="geo-answer-capsule"
      aria-label="সরাসরি উত্তর ও মূল তথ্য (BLUF)"
      className={`geo-answer-capsule rounded-none sm:rounded-3xl border-0 sm:border-2 sm:border-primary/30 bg-transparent sm:bg-gradient-to-br sm:from-primary/10 sm:via-card sm:to-card p-0 sm:p-7 shadow-none sm:shadow-sm space-y-5 ${className}`}
    >
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-xs">
            <Zap className="h-4.5 w-4.5 fill-primary" />
          </div>
          <div>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-primary block font-mono">
              সরাসরি প্রশ্নোত্তর (BLUF) • জেনারেটিভ এআই ও ভয়েস সামারি
            </span>
            <h2 className="font-heading text-base sm:text-lg font-bold text-foreground">
              {title || "একনজরে মূল তথ্য ও খরচ সারসংক্ষেপ"}
            </h2>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            {totalFacilities > 0
              ? `${toBanglaNums(totalFacilities)}টি যাচাইকৃত প্রতিষ্ঠান`
              : "যাচাইকৃত তথ্য ২০২৬"}
          </span>
        </div>
      </div>

      {/* 40-60 Word Direct Factual Answer Capsule (BLUF) */}
      <div className="rounded-2xl bg-card/90 border border-primary/20 p-4 sm:p-5 text-sm sm:text-base text-foreground font-medium leading-relaxed shadow-2xs">
        <p className="text-foreground/95">{directAnswer}</p>
      </div>

      {/* Quick Takeaways Grid ("একনজরে গুরুত্বপূর্ণ তথ্য") */}
      {takeaways && takeaways.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>একনজরে গুরুত্বপূর্ণ তথ্য</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {takeaways.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-xl bg-card border border-border/80 p-3 text-xs sm:text-[13px] text-foreground/90 shadow-2xs hover:border-primary/40 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High-Contrast Reference Fee Table */}
      {fees && fees.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-primary" />
              <span>প্রমিত ফি রেঞ্জ ও মেম্বার ডিসকাউন্ট সূচক</span>
            </h3>
            <span className="text-[11px] text-muted-foreground font-medium">ফেনী সদর রেট</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/60 text-muted-foreground font-semibold">
                  <th scope="col" className="py-2.5 px-3.5 sm:px-4 min-w-[180px] sm:min-w-[200px]">সেবা বা পরীক্ষার নাম</th>
                  <th scope="col" className="py-2.5 px-3.5 sm:px-4 whitespace-nowrap">নিয়মিত ফি রেঞ্জ</th>
                  <th scope="col" className="py-2.5 px-3.5 sm:px-4 text-right whitespace-nowrap">হেলথ ক্লাব সুবিধা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {fees.map((fee, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3.5 sm:px-4 font-medium text-foreground min-w-[180px] sm:min-w-[200px]">
                      {fee.serviceNameBn}
                      {fee.serviceNameEn && (
                        <span className="block text-[11px] text-muted-foreground font-normal">
                          {fee.serviceNameEn}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 sm:px-4 font-mono font-medium text-foreground/90 whitespace-nowrap">
                      {fee.regularPriceRangeBn}
                    </td>
                    <td className="py-2.5 px-3.5 sm:px-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                        <BadgePercent className="h-3 w-3" />
                        {fee.discountBadgeBn || "১০-৩০% মেম্বার ছাড়"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Action & Clinical E-E-A-T Attribution */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/70 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <Link
            href="/editorial-policy"
            prefetch={false}
            className="hover:text-primary hover:underline transition-colors"
          >
            {data?.verifiedNoteBn || "হেলথ ক্লাব ক্লিনিক্যাল এডিটোরিয়াল বোর্ড কর্তৃক সরেজমিনে তথ্যের সত্যতা যাচাইকৃত (২০২৬)"}
          </Link>
        </div>

        <a
          href={`tel:${primaryEmergency.replace(/[^0-9]/g, "")}`}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
        >
          <Phone className="h-3.5 w-3.5" />
          <span>জরুরি হটলাইন: {primaryEmergency}</span>
        </a>
      </div>
    </section>
  );
}
