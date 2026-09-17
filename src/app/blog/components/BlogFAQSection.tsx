"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { BlogFAQItem } from "@/types/blog";

interface BlogFAQSectionProps {
  faqs: BlogFAQItem[];
  locale?: string;
}

export function BlogFAQSection({ faqs, locale = "bn" }: BlogFAQSectionProps) {
  const isEn = locale === "en";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq-section" className="scroll-mt-24 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <HelpCircle className="h-5 w-5" />
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          {isEn ? "Frequently Asked Questions (FAQ)" : "সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর"}
        </h2>
      </div>

      <div className="divide-y divide-border/60 rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const question = isEn ? faq.questionEn : faq.questionBn;
          const answer = isEn ? faq.answerEn : faq.answerBn;

          return (
            <div key={idx} className="transition-colors">
              <button
                type="button"
                id={`faq-question-${idx}`}
                aria-controls={`faq-answer-${idx}`}
                aria-expanded={isOpen}
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer group"
              >
                <h3 className="pr-4 font-heading text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {question}
                </h3>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              <div
                id={`faq-answer-${idx}`}
                role="region"
                aria-labelledby={`faq-question-${idx}`}
                className={`px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed transition-all duration-200 ${
                  isOpen ? "block animate-in fade-in-50" : "hidden"
                }`}
              >
                <p>{answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
