"use client";

import { ShieldAlert } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export function MedicalDisclaimer() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  return (
    <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 sm:p-5 flex items-start gap-3.5 text-muted-foreground">
      <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="space-y-1 text-xs leading-relaxed">
        <p className="font-bold text-foreground">
          {isEn ? "Medical & Clinical Disclaimer (E-E-A-T Standard)" : "মেডিকেল ও স্বাস্থ্য তথ্য বিষয়ক সতর্কবার্তা"}
        </p>
        <p>
          {isEn
            ? "All health guides and advice on Health Club are compiled and verified by registered physicians for health literacy and awareness. These guidelines should never replace formal clinical diagnosis, prescription, or in-person emergency hospital care. In case of acute medical emergencies, immediately consult a registered specialist doctor or visit the nearest hospital emergency ward."
            : "হেলথ ক্লাবের সকল স্বাস্থ্য টিপস ও গাইড নিবন্ধিত চিকিৎসকদের পরামর্শ ও আন্তর্জাতিক মেডিকেল গাইডলাইনের ভিত্তিতে প্রস্তুতকৃত। এই তথ্যগুলো স্বাস্থ্য সচেতনতা বৃদ্ধির উদ্দেশ্যে তৈরি এবং এটি চিকিৎসকের সরাসরি প্রেসক্রিপশন বা ক্লিনিক্যাল ডায়াগনোসিসের বিকল্প নয়। জরুরি বা জটিল শারীরিক সমস্যায় অবিলম্বে বিশেষজ্ঞ ডাক্তারের পরামর্শ নিন অথবা নিকটস্থ হাসপাতালের জরুরি বিভাগে যোগাযোগ করুন।"}
        </p>
      </div>
    </div>
  );
}
