"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, PhoneCall } from "lucide-react";
import { toBanglaNums } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface EmergencyFAQProps {
  hotline?: string;
}

export default function EmergencyFAQ({ hotline }: EmergencyFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

  const rawHotline = (hotline || process.env.NEXT_PUBLIC_HOTLINE_PHONE || "01886763849").replace(/[^0-9]/g, "");
  const normalizedHotline = rawHotline.replace(/^(880|88|0)/, "");
  const hotlineTel = `+880${normalizedHotline}`;
  const hotlineDisplay = toBanglaNums(`+880 ${normalizedHotline}`);

  const faqs: FAQItem[] = [
    {
      question: "ফেনীতে জরুরি রক্তের প্রয়োজনে কীভাবে তাৎক্ষণিক রক্তদাতা ও ব্লাড ব্যাংক খুঁজে পাবেন?",
      answer: "হেলথ ক্লাবের 'জরুরি সেবা' পেজে যান এবং রক্তের গ্রুপ ফিল্টার থেকে রোগীর প্রয়োজনীয় গ্রুপ (যেমন: A+, B+, O+, AB-) ও উপজেলা (ফেনী সদর, সোনাগাজী, দাগনভূঞা ইত্যাদি) নির্বাচন করুন। তালিকাভুক্ত ভেরিফাইড রক্তদাতার কার্ডে 'কল করুন' অথবা 'WhatsApp' বাটনে চাপ দিয়ে সরাসরি যোগাযোগ করুন। এছাড়া রেড ক্রিসেন্ট রক্ত কেন্দ্রের (01819-887766) সাথেও যোগাযোগ করতে পারেন।",
    },
    {
      question: "ফেনীতে ২৪ ঘণ্টা আইসিইউ (ICU) বা এসি অ্যাম্বুলেন্স সার্ভিস কীভাবে বুক করবেন?",
      answer: "ডিরেক্টরির 'অ্যাম্বুলেন্স' ট্যাবে গিয়ে ফেনী সেন্ট্রাল অ্যাম্বুলেন্স (01876077777), মেদিনোভা, রবিন বা মহিপাল অ্যাম্বুলেন্স সার্ভিসের কল বাটনে চাপ দিয়ে সরাসরি ড্রাইভার বা ডেস্কে কথা বলুন। গুরুতর ও আশঙ্কাজনক রোগীর ক্ষেত্রে লাইফ-সাপোর্ট ও ভেন্টিলেটর সমৃদ্ধ ICU অ্যাম্বুলেন্সের জন্য অনুরোধ করুন।",
    },
    {
      question: "ফেনীতে ২৪/৭ জরুরি মেডিকেল অক্সিজেন সিলিন্ডার সেবা কীভাবে পাওয়া যাবে?",
      answer: "জরুরি হটলাইন সেকশনে থাকা 'ফেনী জরুরি অক্সিজেন সিলিন্ডার সেবা' নম্বরে (01815-998877) কল করুন। তারা তাৎক্ষণিক রিফিলিং, ফ্লো-মিটার, রেগুলেটর মাস্ক ও ফেনী শহর ও আশেপাশের এলাকায় দ্রুত হোম ডেলিভারি সাপোর্ট প্রদান করে।",
    },
    {
      question: "ফেনী সদর হাসপাতালের জরুরি বিভাগ ও সরকারি স্বাস্থ্য বাতায়ন নম্বর কী?",
      answer: "ফেনী ২৫০ শয্যা জেনারেল হাসপাতালের জরুরি বিভাগের সরাসরি হটলাইন নম্বর 0331-74011। এছাড়া জাতীয় জরুরি স্বাস্থ্য পরামর্শের জন্য ১৬২৬৩ (স্বাস্থ্য বাতায়ন) এবং পুলিশ, ফায়ার সার্ভিস ও সরকারি অ্যাম্বুলেন্স সহায়তার জন্য ৯৯৯ সম্পূর্ণ টোল-ফ্রি ২৪/৭ চালু থাকে।",
    },
    {
      question: "হেলথ ক্লাবে স্বেচ্ছাসেবী রক্তদাতা হিসেবে কীভাবে নাম তালিকাভুক্ত করবেন?",
      answer: "জরুরি পেজের রক্তদাতা ট্যাবে থাকা 'রক্তদাতা হতে যুক্ত হোন' বাটনে ক্লিক করুন। আপনার নাম, রক্তের গ্রুপ, উপজেলা, মোবাইল নম্বর ও সর্বশেষ রক্তদানের তথ্য দিয়ে সাবমিট করলেই হেলথ ক্লাব ডিরেক্টরিতে আপনার নাম যুক্ত হবে।",
    },
    {
      question: "ফেনীর জরুরি ডিরেক্টরি ব্যবহার করতে কি কোনো প্রকার ফি বা চার্জ লাগে?",
      answer: "না, হেলথ ক্লাবের জরুরি স্বাস্থ্য ডিরেক্টরিটি জনস্বার্থে সম্পূর্ণ বিনামূল্যে উন্মুক্ত। রক্তদাতা, অ্যাম্বুলেন্স ড্রাইভার, অক্সিজেন সরবরাহকারী ও হাসপাতালের সাথে সরাসরি কোনো প্রকার মধ্যস্বত্বভোগী বা ব্রোকারেজ ফি ছাড়া যোগাযোগ করা যায়।",
    },
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
          <span>সাধারণ জরুরি জিজ্ঞাসা (FAQ)</span>
        </div>
        <h2
          id="emergency-faq-heading"
          className="font-heading text-xl sm:text-3xl font-bold text-secondary dark:text-white tracking-tight"
        >
          ফেনী রক্তদাতা, অ্যাম্বুলেন্স ও জরুরি স্বাস্থ্য সেবা সম্পর্কিত প্রশ্নোত্তর
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ফেনীতে রক্তদাতা সন্ধান, ব্লাড ব্যাংক কন্টাক্ট নম্বর, অ্যাম্বুলেন্স সেবা, অক্সিজেন সিলিন্ডার ও জরুরি মেডিকেল হটলাইন সম্পর্কিত তথ্যাবলি।
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
            জরুরি কোনো তথ্য জানতে বা সহায়তা প্রয়োজন?
          </h4>
          <p className="text-[11px] sm:text-xs text-muted-foreground">
            হেলথ ক্লাবের সেন্ট্রাল হেল্পলাইনে সার্বক্ষণিক কল করতে পারেন।
          </p>
        </div>
        <a
          href={`tel:${hotlineTel}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          <span>{hotlineDisplay}</span>
        </a>
      </div>
    </section>
  );
}

