"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, PhoneCall } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface FAQItem {
  question: string;
  answer: string;
}

export default function EmergencyFAQ() {
  const { t, locale } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

  const faqs: FAQItem[] = [
    { question: t("emergency.faq.q1"), answer: t("emergency.faq.a1") },
    { question: t("emergency.faq.q2"), answer: t("emergency.faq.a2") },
    { question: t("emergency.faq.q3"), answer: t("emergency.faq.a3") },
    { question: t("emergency.faq.q4"), answer: t("emergency.faq.a4") },
    { question: t("emergency.faq.q5"), answer: t("emergency.faq.a5") },
    { question: t("emergency.faq.q6"), answer: t("emergency.faq.a6") },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      aria-labelledby="emergency-faq-heading"
      className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8"
    >
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>{t("emergency.faq.badge")}</span>
        </div>
        <h2
          id="emergency-faq-heading"
          className="font-heading text-xl sm:text-3xl font-bold text-secondary dark:text-white tracking-tight"
        >
          {t("emergency.faq.title")}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t("emergency.faq.subtitle")}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const btnId = `emergency-faq-btn-${idx}`;
          const panelId = `emergency-faq-ans-${idx}`;

          return (
            <div
              key={idx}
              className="border border-border/80 rounded-2xl bg-card hover:border-rose-500/40 transition-all duration-200 shadow-xs overflow-hidden"
            >
              <button
                id={btnId}
                type="button"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex justify-between items-center gap-3 p-4 sm:p-5 text-left font-heading font-bold text-secondary dark:text-white text-sm sm:text-base cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-inset"
              >
                <span className="leading-snug">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-rose-600 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className={`transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "max-h-[500px] border-t border-border/60 opacity-100 p-4 sm:p-5 pt-3 sm:pt-4 bg-muted/20"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Contact Help Callout */}
      <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-foreground">
            {locale === "en"
              ? "Need urgent assistance or have questions?"
              : "জরুরি কোনো তথ্য জানতে বা সহায়তা প্রয়োজন?"}
          </h4>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            {locale === "en"
              ? "Contact the Health Club helpline 24/7."
              : "হেলথ ক্লাবের সেন্ট্রাল হেল্পলাইনে সার্বক্ষণিক কল করতে পারেন।"}
          </p>
        </div>
        <a
          href="tel:+8801886763849"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          <span>{locale === "en" ? "+880 1886763849" : "+৮৮০ ১৮৮৬৭৬৩৮৪৯"}</span>
        </a>
      </div>
    </section>
  );
}
