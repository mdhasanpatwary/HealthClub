"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  Building2,
  FlaskConical,
  Pill,
  MapPin,
  Sparkles,
  CheckCircle2,
  CreditCard,
  Percent,
  Activity,
  FileCheck2,
} from "lucide-react";

export default function PartnerHospitalsGuide() {
  const { t, locale } = useLanguage();
  const isEn = locale === "en";

  const stats = [
    {
      icon: Building2,
      title: t("partnerHospitals.guide.stat1.title"),
      desc: t("partnerHospitals.guide.stat1.desc"),
      color: "text-primary bg-primary/10",
    },
    {
      icon: FlaskConical,
      title: t("partnerHospitals.guide.stat2.title"),
      desc: t("partnerHospitals.guide.stat2.desc"),
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    },
    {
      icon: Pill,
      title: t("partnerHospitals.guide.stat3.title"),
      desc: t("partnerHospitals.guide.stat3.desc"),
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    },
    {
      icon: MapPin,
      title: t("partnerHospitals.guide.stat4.title"),
      desc: t("partnerHospitals.guide.stat4.desc"),
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
  ];

  const popularTests = [
    {
      name: isEn ? "Complete Blood Count (CBC)" : "কমপ্লিট ব্লাড কাউন্ট (CBC)",
      dept: isEn ? "Pathology" : "প্যাথলজি",
      discount: isEn ? "20% - 30% Off" : "২০% - ৩০% ছাড়",
      note: isEn ? "Routine blood checkup & hemoglobin" : "রুটিন রক্ত ও হিমোগ্লোবিন পরীক্ষা",
    },
    {
      name: isEn ? "Lipid Profile & Liver Function" : "লিপিড প্রোফাইল ও লিভার টেস্ট",
      dept: isEn ? "Biochemistry" : "বায়োকেমিস্ট্রি",
      discount: isEn ? "20% - 30% Off" : "২০% - ৩০% ছাড়",
      note: isEn ? "Cholesterol, SGPT & Bilirubin" : "কোলেস্টেরল, এসজিপিটি ও বিলিরুবিন",
    },
    {
      name: isEn ? "Digital X-Ray & 4D USG" : "ডিজিটাল এক্স-রে ও ৪ডি ইউএসজি",
      dept: isEn ? "Radiology" : "রেডিওলজি",
      discount: isEn ? "15% - 25% Off" : "১৫% - ২৫% ছাড়",
      note: isEn ? "Chest X-ray & Pregnancy 4D USG" : "চেস্ট এক্স-রে ও প্রেগন্যান্সি আল্ট্রাসাউন্ড",
    },
    {
      name: isEn ? "CT Scan & MRI Investigations" : "সিটি স্ক্যান ও এমআরআই ইনভেস্টিগেশন",
      dept: isEn ? "Advanced Scans" : "অ্যাডভান্সড স্ক্যান",
      discount: isEn ? "15% - 20% Off" : "১৫% - ২০% ছাড়",
      note: isEn ? "Brain, spine & whole body imaging" : "ব্রেন, স্পাইন ও ফুল বডি সিটি/এমআরআই",
    },
    {
      name: isEn ? "HbA1c & Diabetes Screening" : "এইচবিএওয়ানসি ও ডায়াবেটিস স্ক্রিনিং",
      dept: isEn ? "Endocrinology" : "এন্ডোক্রাইনোলজি",
      discount: isEn ? "20% - 30% Off" : "২০% - ৩০% ছাড়",
      note: isEn ? "3-month average glucose control" : "৩ মাসের গড় সুগার ও রক্তের গ্লুকোজ",
    },
    {
      name: isEn ? "ECG & 2D Color Doppler Echo" : "ইসিজি ও ২ডি কালার ডপলার ইকো",
      dept: isEn ? "Cardiology" : "কার্ডিওলজি",
      discount: isEn ? "15% - 20% Off" : "১৫% - ২০% ছাড়",
      note: isEn ? "Heart rhythm & cardiovascular screen" : "হার্টের কার্যকারিতা ও ইকো পরীক্ষা",
    },
  ];

  const steps = [
    {
      icon: Building2,
      num: "1",
      title: t("partnerHospitals.guide.step1.title"),
      desc: t("partnerHospitals.guide.step1.desc"),
    },
    {
      icon: CreditCard,
      num: "2",
      title: t("partnerHospitals.guide.step2.title"),
      desc: t("partnerHospitals.guide.step2.desc"),
    },
    {
      icon: Percent,
      num: "3",
      title: t("partnerHospitals.guide.step3.title"),
      desc: t("partnerHospitals.guide.step3.desc"),
    },
  ];

  return (
    <section aria-labelledby="partner-guide-heading" className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* 1. Core Network Pillar Overview */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("partnerHospitals.guide.badge")}</span>
          </div>
          <h2 id="partner-guide-heading" className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white tracking-tight">
            {t("partnerHospitals.guide.title")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("partnerHospitals.guide.desc")}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-muted/30 border border-border/60 hover:bg-muted/50 transition-colors"
              >
                <div className={`h-9 w-9 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight">
                    {stat.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 text-primary font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isEn ? "100% Genuine Partner Agreements" : "১০০% ভেরিফাইড চুক্তিভিত্তিক পার্টনার ডিসকাউন্ট"}</span>
          </div>
          <span>{isEn ? "Serving Feni Sadar, Mohipal, Daganbhuiyan, Sonagazi, Chhagalnaiya, Parshuram & Fulgazi" : "ফেনী সদর, মহিপাল, দাগনভূঞা, সোনাগাজী, ছাগলনাইয়া, পরশুরাম ও ফুলগাজী জুড়ে বিস্তৃত"}</span>
        </div>
      </div>

      {/* 2. Popular Diagnostic Tests & Member Discount Rates Grid */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Activity className="h-3.5 w-3.5" />
            <span>{isEn ? "Pathology & Diagnostic Discounts" : "প্যাথলজি ও টেস্ট ডিসকাউন্ট"}</span>
          </div>
          <h3 className="font-heading text-base sm:text-xl font-bold text-secondary dark:text-white">
            {t("partnerHospitals.guide.testsTitle")}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("partnerHospitals.guide.testsDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {popularTests.map((test, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-muted/20 border border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {test.dept}
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {test.discount}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground pt-1">
                  {test.name}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  {test.note}
                </p>
              </div>
              <div className="pt-2 border-t border-border/40 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <FileCheck2 className="h-3 w-3" />
                <span>{isEn ? "Health Club Member Card Valid" : "হেলথ ক্লাব কার্ডে ছাড় প্রযোজ্য"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. How to Claim Discounts in 3 Steps */}
      <div className="rounded-3xl border border-border/80 bg-muted/30 p-5 sm:p-8 space-y-6">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <h3 className="font-heading text-base sm:text-xl font-bold text-secondary dark:text-white">
            {t("partnerHospitals.guide.howToTitle")}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isEn
              ? "Simple and fast procedure to avail healthcare and test discounts instantly."
              : "হাসপাতাল বা ল্যাব টেস্টে সরাসরি ছাড় পাওয়ার সহজ ও দ্রুত নিয়ম।"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2.5 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-heading text-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-muted-foreground/30">
                    0{step.num}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  {step.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

