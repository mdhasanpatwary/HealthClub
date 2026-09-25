"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "ফেনীতে হাসপাতালে এবং মেডিকেল টেস্টে কীভাবে ডিসকাউন্ট পেতে পারি?",
    answer: "হেলথ ক্লাব (Health Club)-এর ডিজিটাল মেম্বারশিপ কার্ড ব্যবহার করে ফেনীর চুক্তিবদ্ধ সকল বেসরকারি হাসপাতাল, ক্লিনিক এবং ডায়াগনস্টিক সেন্টারে প্যাথলজি ল্যাব টেস্ট (রক্ত, হরমোন পরীক্ষা), ডিজিটাল এক্স-রে, আল্ট্রাসনোগ্রাম (USG), সিটি স্ক্যান এবং কেবিন ভাড়ায় ১০% থেকে ৩০% পর্যন্ত নিশ্চিত ডিসকাউন্ট পাওয়া যায়। বিলিং কাউন্টারে শুধু আপনার হেলথ ক্লাব মেম্বার আইডি বা কার্ডটি প্রদর্শন করলেই তাৎক্ষণিকভাবে বিল থেকে নির্ধারিত ছাড় পেয়ে যাবেন।",
  },
  {
    question: "ডায়াগনস্টিক সেন্টারে কোন কোন টেস্টে ছাড় পাওয়া যায়?",
    answer: "সকল প্রকার প্যাথলজি রক্ত পরীক্ষা (CBC, Lipid, HbA1c, Thyroid ইত্যাদি), ডিজিটাল এক্স-রে, আল্ট্রাসনোগ্রাম (USG), ইসিজি (ECG), ইকোকার্ডিওগ্রাফি, এন্ডোস্কোপি, সিটি স্ক্যান ও এমআরআই টেস্টে ১০% থেকে ৩০% পর্যন্ত ছাড় পাবেন।",
  },
  {
    question: "ফার্মেসিতে ওষুধ কেনার সময় কি ডিসকাউন্ট প্রযোজ্য?",
    answer: "হ্যাঁ, আমাদের তালিকাভুক্ত মডেল ফার্মেসি ও পার্টনার ওষুধের দোকানগুলোতে প্রেসক্রিপশন অনুযায়ী প্রয়োজনীয় ওষুধ ক্রয়ে হেলথ ক্লাব মেম্বার কার্ড দেখালে বিশেষ ছাড় পাওয়া যাবে।",
  },
  {
    question: "ফেনীর বাইরে কি এই মেম্বার কার্ড ব্যবহার করা যাবে?",
    answer: "হ্যাঁ, হেলথ ক্লাবের নেটওয়ার্কভুক্ত ঢাকা, চট্টগ্রাম সহ অন্যান্য জেলার পার্টনার হাসপাতাল ও ডায়াগনস্টিক ল্যাবেও আপনি একই সুবিধা উপভোগ করতে পারবেন।",
  },
  {
    question: "জরুরি প্রয়োজনে কীভাবে নিকটস্থ অ্যাম্বুলেন্স বা অক্সিজেন খুঁজে পাবো?",
    answer: "হেলথ ক্লাবের 'জরুরি সেবা' পেজ থেকে সরাসরি হটলাইনে কল করে ২৪/৭ আইসিইউ/এসি অ্যাম্বুলেন্স, ব্লাড ডোনার এবং অক্সিজেন সিলিন্ডার সহায়তা পাওয়া যাবে।",
  },
  {
    question: "ফেনীতে মেডিকেল টেস্ট ও প্যাথলজি ল্যাব টেস্টে কত টাকা সাশ্রয় হয়?",
    answer: "টেস্টের ধরন অনুযায়ী মেম্বাররা রুটিন প্যাথলজি, হরমোন টেস্ট, এক্স-রে, ৪ডি ইউএসজি, সিটি স্ক্যান এবং এমআরআই-তে ১৫% থেকে ৩০% পর্যন্ত ছাড় পান, যা প্রতিটি মেডিকেল চেকআপে উল্লেখযোগ্য আর্থিক সাশ্রয় নিশ্চিত করে।",
  },
];

export default function PartnerHospitalsFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section aria-labelledby="partner-faq-heading" className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>সাধারণ জিজ্ঞাসা</span>
        </div>
        <h2 id="partner-faq-heading" className="font-heading text-xl sm:text-3xl font-bold text-secondary dark:text-white tracking-tight">
          হাসপাতাল, ল্যাব টেস্ট ও ফার্মেসি ডিসকাউন্ট সম্পর্কিত প্রশ্নোত্তর
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ফেনীতে চিকিৎসা খরচ কমানো, ল্যাব টেস্ট ডিসকাউন্ট এবং ওষুধ কেনার নিয়ম সম্পর্কে বিস্তারিত জানুন।
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const btnId = `partner-faq-btn-${idx}`;
          const panelId = `partner-faq-ans-${idx}`;

          return (
            <div
              key={idx}
              className="border border-border/80 rounded-2xl bg-card hover:border-primary/40 transition-all duration-200 shadow-xs overflow-hidden"
            >
              <button
                id={btnId}
                type="button"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full flex justify-between items-center gap-3 p-4 sm:p-5 text-left font-heading font-bold text-secondary dark:text-white text-sm sm:text-base cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
              >
                <span className="leading-snug">{faq.question}</span>
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
