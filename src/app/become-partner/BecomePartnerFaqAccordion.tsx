"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, CheckCircle } from "lucide-react";
import { BECOME_PARTNER_FAQS } from "./becomePartnerSeo";

export default function BecomePartnerFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="become-partner-faq-section"
      aria-labelledby="partner-onboarding-faq-heading"
      className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8"
    >
      {/* Section Header with BLUF Direct Answer Capsule */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>অনবোর্ডিং ও পার্টনারশিপ জিজ্ঞাসা</span>
        </div>
        <h2
          id="partner-onboarding-faq-heading"
          className="font-heading text-xl sm:text-3xl md:text-4xl font-bold text-secondary dark:text-white tracking-tight"
        >
          পার্টনারশিপ সংক্রান্ত সাধারণ প্রশ্ন ও উত্তর (FAQ)
        </h2>
        {/* Direct Answer Capsule (BLUF) */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/25 text-left max-w-3xl mx-auto shadow-2xs space-y-1">
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">
            <strong className="text-emerald-800 dark:text-emerald-300 font-bold">সংক্ষিপ্ত সারসংক্ষেপ:</strong> হেলথ ক্লাব প্রাতিষ্ঠানিক পার্টনারশিপ সম্পূর্ণ ফ্রি এবং চুক্তিটি বর্তমানে কেবল <strong>ফেনী সদর (Feni Sadar)</strong> এর হাসপাতাল, ল্যাব ও ফার্মেসির জন্য প্রযোজ্য। আবেদন জমার পর ২৪-৪৮ ঘণ্টার মধ্যে লাইসেন্স যাচাই ও সমঝোতা স্মারক (MoU) স্বাক্ষরিত হয় এবং প্রতিটি পার্টনারকে পৃথক ডিজিটাল ড্যাশবোর্ড ও কিউআর স্ক্যানার প্রদান করা হয়।
          </p>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {BECOME_PARTNER_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const btnId = `partner-faq-btn-${idx}`;
          const panelId = `partner-faq-ans-${idx}`;

          return (
            <div
              key={idx}
              className="border border-border/80 rounded-2xl bg-card hover:border-primary/40 transition-all duration-200 shadow-2xs overflow-hidden"
            >
              <button
                id={btnId}
                type="button"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex justify-between items-center gap-3 p-4 sm:p-5 text-left font-heading font-bold text-secondary dark:text-white text-sm sm:text-base cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              >
                <span className="flex items-center gap-2.5 leading-snug">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0 opacity-80" />
                  <span>{faq.question}</span>
                </span>
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
                <p className="faq-answer text-xs sm:text-sm leading-relaxed text-muted-foreground">
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
