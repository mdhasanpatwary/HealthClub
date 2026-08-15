"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface FAQItem {
  question: string;
  answer: string;
}

export default function ConsultantsFAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqs: FAQItem[] = [
    { question: t("consultants.faq.q1"), answer: t("consultants.faq.a1") },
    { question: t("consultants.faq.q2"), answer: t("consultants.faq.a2") },
    { question: t("consultants.faq.q3"), answer: t("consultants.faq.a3") },
    { question: t("consultants.faq.q4"), answer: t("consultants.faq.a4") },
    { question: t("consultants.faq.q5"), answer: t("consultants.faq.a5") },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section aria-labelledby="consultants-faq-heading" className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>{t("consultants.faq.badge")}</span>
        </div>
        <h2 id="consultants-faq-heading" className="font-heading text-xl sm:text-3xl font-bold text-secondary dark:text-white tracking-tight">
          {t("consultants.faq.title")}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t("consultants.faq.subtitle")}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-border/80 rounded-2xl bg-card hover:border-primary/40 transition-all duration-200 shadow-xs overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                className="w-full flex justify-between items-center gap-3 p-4 sm:p-5 text-left font-heading font-bold text-secondary dark:text-white text-sm sm:text-base cursor-pointer focus:outline-none"
              >
                <span className="leading-snug">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-primary shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id={`faq-answer-${idx}`}
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
    </section>
  );
}
