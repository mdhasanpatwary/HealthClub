"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        const btnId = `landing-faq-btn-${idx}`;
        const panelId = `landing-faq-ans-${idx}`;

        return (
          <div
            key={idx}
            className="border border-border rounded-xl bg-background hover:bg-muted/30 transition-colors overflow-hidden"
          >
            <button
              id={btnId}
              onClick={() => toggleFAQ(idx)}
              className="w-full flex justify-between items-center p-5 text-left font-heading font-bold text-secondary dark:text-white text-base md:text-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span>{faq.question}</span>
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
                isOpen ? "max-h-[500px] border-t border-border opacity-100 p-5" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
