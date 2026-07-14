"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "হেলথ ক্লাব মেম্বারশিপ কীভাবে কাজ করে?",
    answer: "হেলথ ক্লাব একটি মেম্বারশিপ ভিত্তিক স্বাস্থ্য সুবিধা প্ল্যাটফর্ম। আমাদের সদস্য হয়ে আপনি আমাদের পার্টনার হাসপাতাল, ডায়াগনস্টিক সেন্টার এবং ফার্মেসীতে ডিজিটাল আইডি কার্ড দেখিয়ে বিশেষ ছাড় পেতে পারেন।"
  },
  {
    question: "আমি কীভাবে ডিসকাউন্ট বা ছাড় পেতে পারি?",
    answer: "আমাদের অংশীদার স্বাস্থ্যসেবা কেন্দ্রে যাওয়ার পর বিল করার সময় আপনার ডিজিটাল মেম্বারশিপ আইডি কার্ডটি দেখান। হাসপাতাল কর্তৃপক্ষ কার্ডে থাকা কিউআর (QR) কোডটি স্ক্যান করে আপনার মেম্বারশিপের সত্যতা নিশ্চিত করবে এবং তাৎক্ষণিকভাবে আপনার বিলে ডিসকাউন্ট যোগ করে দেবে।"
  },
  {
    question: "আমি কোথায় আমার মেম্বারশিপ ব্যবহার করতে পারব?",
    answer: "আমাদের ওয়েবসাইটে থাকা 'পার্টনার হাসপাতাল' ডিরেক্টরিতে তালিকাভুক্ত সকল হাসপাতাল, ডায়াগনস্টিক সেন্টার এবং ফার্মেসীতে আপনি এই কার্ডটি ব্যবহার করতে পারবেন। পার্টনারদের তালিকা প্রতিনিয়ত বৃদ্ধি পাচ্ছে।"
  },
  {
    question: "মেম্বারশিপের খরচ কত?",
    answer: "বর্তমানে প্রথম ১০০ জন সদস্যের জন্য আমরা সম্পূর্ণ ফ্রি 'ফাউন্ডিং মেম্বারশিপ' দিচ্ছি, যা ১ বছরের জন্য ফ্রি থাকবে। পরবর্তীতে একক মেম্বারশিপের জন্য বাৎসরিক ৫০০ টাকা এবং পারিবারিক মেম্বারশিপের জন্য বাৎসরিক ১৫০০ টাকা ফি প্রযোজ্য হবে।"
  },
  {
    question: "পার্টনার হাসপাতালগুলো কীভাবে আমার কার্ড ভেরিফাই করবে?",
    answer: "আপনার ডিজিটাল মেম্বারশিপ কার্ডে একটি অনন্য কিউআর (QR) কোড থাকবে। হাসপাতাল কর্তৃপক্ষ তাদের মোবাইল বা স্ক্যানার দিয়ে এই কিউআর কোডটি স্ক্যান করলে একটি সুরক্ষিত ভেরিফিকেশন পেজ খুলবে, যেখানে আপনার নাম, মেম্বার আইডি এবং মেম্বারশিপ স্ট্যাটাস (Active/Inactive) দেখা যাবে।"
  },
  {
    question: "আমার পরিবারের সদস্যরা কি আমার কার্ড ব্যবহার করতে পারবে?",
    answer: "আমাদের 'ফ্যামিলি মেম্বারশিপ' প্ল্যানের অধীনে আপনি আপনার পরিবারের একাধিক সদস্যকে যুক্ত করতে পারবেন এবং তারা প্রত্যেকেই নিজস্ব আইডি কার্ড পাবেন। তবে ব্যক্তিগত (Individual) কার্ডটি শুধুমাত্র কার্ডধারী ব্যক্তিই ব্যবহার করতে পারবেন।"
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="border border-border rounded-xl bg-background hover:bg-muted/30 transition-colors overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(idx)}
              className="w-full flex justify-between items-center p-5 text-left font-heading font-bold text-secondary dark:text-white text-base md:text-lg focus:outline-none"
              aria-expanded={isOpen}
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-primary shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
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
