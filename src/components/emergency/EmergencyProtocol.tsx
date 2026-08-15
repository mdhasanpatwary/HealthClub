"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";
import { ShieldAlert, Activity, PhoneCall, HeartPulse, FileText } from "lucide-react";

export default function EmergencyProtocol() {
  const { t, locale } = useLanguage();

  const steps = [
    {
      num: 1,
      icon: Activity,
      title: t("emergency.protocol.step1.title"),
      desc: t("emergency.protocol.step1.desc"),
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      num: 2,
      icon: PhoneCall,
      title: t("emergency.protocol.step2.title"),
      desc: t("emergency.protocol.step2.desc"),
      badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
    {
      num: 3,
      icon: HeartPulse,
      title: t("emergency.protocol.step3.title"),
      desc: t("emergency.protocol.step3.desc"),
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      num: 4,
      icon: FileText,
      title: t("emergency.protocol.step4.title"),
      desc: t("emergency.protocol.step4.desc"),
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
  ];

  return (
    <section
      aria-labelledby="emergency-protocol-heading"
      className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8"
    >
      <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-card to-card p-5 sm:p-8 space-y-6 shadow-xs">
        {/* Header */}
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{t("emergency.protocol.badge")}</span>
          </div>
          <h2
            id="emergency-protocol-heading"
            className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white tracking-tight"
          >
            {t("emergency.protocol.title")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("emergency.protocol.subtitle")}
          </p>
        </div>

        {/* 4-Step Protocol Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border/80 hover:border-rose-500/30 transition-all duration-200"
              >
                <div
                  className={`h-10 w-10 rounded-xl ${step.badgeColor} border flex items-center justify-center shrink-0`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs font-medium text-rose-950 dark:text-rose-200">
            {locale === "en"
              ? "For instant nationwide police, ambulance, or fire service dispatch, dial 999 toll-free."
              : "সার্বক্ষণিক পুলিশ, ফায়ার ও সরকারি অ্যাম্বুলেন্স সহায়তার জন্য বিনামূল্যে ৯৯৯ নম্বরে ডায়াল করুন।"}
          </p>
          <a
            href="tel:999"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>{locale === "en" ? "Call 999" : "৯৯৯ কল দিন"}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
