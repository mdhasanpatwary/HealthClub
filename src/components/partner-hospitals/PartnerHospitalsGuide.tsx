"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";
import { Building2, FlaskConical, Pill, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

export default function PartnerHospitalsGuide() {
  const { t, locale } = useLanguage();

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

  return (
    <section aria-labelledby="partner-guide-heading" className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-8 space-y-6 shadow-xs">
        {/* Header */}
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
            <span>{locale === "en" ? "100% Genuine Partner Agreements" : "১০০% ভেরিফাইড চুক্তিভিত্তিক পার্টনার ডিসকাউন্ট"}</span>
          </div>
          <span>{locale === "en" ? "Serving Feni Sadar, Mohipal, Daganbhuiyan, Sonagazi, Chhagalnaiya, Parshuram & Fulgazi" : "ফেনী সদর, মহিপাল, দাগনভূঞা, সোনাগাজী, ছাগলনাইয়া, পরশুরাম ও ফুলগাজী জুড়ে বিস্তৃত"}</span>
        </div>
      </div>
    </section>
  );
}
