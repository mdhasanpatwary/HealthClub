"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const { locale } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = locale === "en" ? [
    {
      question: "How does the Health Club membership work?",
      answer: "Health Club is a membership-based health benefit platform. By becoming a member, you can get special discounts at our partner hospitals, diagnostic centers, and pharmacies by showing your digital ID card."
    },
    {
      question: "How can I get the discount?",
      answer: "When paying the bill at our partner healthcare center, show your digital membership ID card. The hospital authority will scan the QR code on your card to verify your membership and instantly apply the discount to your bill."
    },
    {
      question: "Where can I use my membership?",
      answer: "You can use this card at all hospitals, diagnostic centers, and pharmacies listed in the 'Partner Hospitals' directory on our website. Our list of partners is growing constantly."
    },
    {
      question: "How much does the membership cost?",
      answer: "Currently, we are offering completely free 'Founding Membership' for the first 100 members, which is free for 1 year. Afterwards, the annual fee will be ৳500 for Individual membership."
    },
    {
      question: "How will partner hospitals verify my card?",
      answer: "Your digital membership card will have a unique QR code. When the hospital scans this QR code with their mobile or scanner, it will open a secure verification page showing your name, member ID, and membership status (Active/Inactive)."
    },
    {
      question: "Can someone else use my membership card?",
      answer: "No, the membership card is non-transferable and can only be used by the registered cardholder. Partner hospitals will verify your name and identity against the card during counter desk checks."
    }
  ] : [
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
      answer: "বর্তমানে প্রথম ১০০ জন সদস্যের জন্য আমরা সম্পূর্ণ ফ্রি 'ফাউন্ডিং মেম্বারশিপ' দিচ্ছি, যা ১ বছরের জন্য ফ্রি থাকবে। পরবর্তীতে একক মেম্বারশিপের জন্য বাৎসরিক ৫০০ টাকা ফি প্রযোজ্য হবে।"
    },
    {
      question: "পার্টনার হাসপাতালগুলো কীভাবে আমার কার্ড ভেরিফাই করবে?",
      answer: "আপনার ডিজিটাল মেম্বারশিপ কার্ডে একটি অনন্য কিউআর (QR) কোড থাকবে। হাসপাতাল কর্তৃপক্ষ তাদের মোবাইল বা স্ক্যানার দিয়ে এই কিউআর কোডটি স্ক্যান করলে একটি সুরক্ষিত ভেরিফিকেশন পেজ খুলবে, যেখানে আপনার নাম, মেম্বার আইডি এবং মেম্বারশিপ স্ট্যাটাস (Active/Inactive) দেখা যাবে।"
    },
    {
      question: "আমার কার্ড কি অন্য কেউ ব্যবহার করতে পারবে?",
      answer: "না, মেম্বারশিপ কার্ডটি হস্তান্তরযোগ্য নয়। এটি শুধুমাত্র কার্ডধারী নিবন্ধিত ব্যক্তিই ব্যবহার করতে পারবেন। পার্টনার স্বাস্থ্যসেবা কেন্দ্রে ভেরিফিকেশনের সময় কার্ডের তথ্যের সাথে আপনার পরিচয় যাচাই করা হবে।"
    }
  ];

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
