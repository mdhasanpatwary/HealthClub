"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { HEALTH_TIPS_FAQS } from "@/data/health-tips/healthTipsFaqs";

export function HealthTipsFAQ() {
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const [openId, setOpenId] = useState<string | null>("dengue-platelet-threshold");

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      aria-labelledby="health-tips-faq-heading"
      className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8"
    >
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>{isEn ? "Direct Medical Answers (AEO)" : "স্বাস্থ্য জিজ্ঞাসা ও সরাসরি উত্তর"}</span>
        </div>
        <h2
          id="health-tips-faq-heading"
          className="font-heading text-xl sm:text-3xl font-bold text-secondary dark:text-white tracking-tight"
        >
          {isEn
            ? "Frequently Asked Health & Medical Questions"
            : "জরুরি স্বাস্থ্য প্রশ্নোত্তর ও সাধারণ জিজ্ঞাসা"}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {isEn
            ? "Concise, doctor-verified answers to common healthcare, disease prevention, and first-aid queries."
            : "দৈনন্দিন রোগব্যাধি, লক্ষণ ও প্রাথমিক চিকিৎসা বিষয়ে বিশেষজ্ঞ চিকিৎসকদের নির্ভরযোগ্য প্রশ্নোত্তর।"}
        </p>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {HEALTH_TIPS_FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          const btnId = `healthtips-faq-btn-${faq.id}`;
          const panelId = `healthtips-faq-ans-${faq.id}`;

          return (
            <div
              key={faq.id}
              className="border border-border/80 rounded-2xl bg-card hover:border-primary/40 transition-all duration-200 shadow-xs overflow-hidden"
            >
              <button
                id={btnId}
                type="button"
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex justify-between items-center gap-3 p-4 sm:p-5 text-left font-heading font-bold text-secondary dark:text-white text-sm sm:text-base cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span className="leading-snug">{isEn ? faq.questionEn : faq.questionBn}</span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-primary shrink-0 transition-transform duration-300 ${
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
                    ? "max-h-[600px] border-t border-border/60 opacity-100 p-4 sm:p-5 pt-3 sm:pt-4 bg-muted/20"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {isEn ? faq.answerEn : faq.answerBn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
