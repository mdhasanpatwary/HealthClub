import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_URINE_TEST_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে প্রস্রাব পরীক্ষা (Urine R/E ও Culture) খরচ ও মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার শীর্ষ অনুমোদিত ডায়াগনস্টিক সেন্টার ও মাইক্রোবায়োলজি ল্যাবে ইউরিন রুটিন (R/M/E), ইউরিন কালচার অ্যান্ড সেনসিটিভিটি (C/S), মাইক্রোঅ্যালবুমিন ও ইউটিআই প্যানেলের নিয়মিত বাজার ফি বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের তালিকা।",
  titleEn: "Urine Routine (R/E) & Culture Test Price Guide in Feni (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar clinical pathology and microbiology laboratories.",
  tests: [
    // ১. রুটিন প্রস্রাব ও প্রাথমিক মাইক্রোস্কোপিক স্ক্রিনিং
    {
      testNameBn: "ইউরিন রুটিন ও মাইক্রোস্কোপিক পরীক্ষা (Urine R/M/E - Routine & Microscopic)",
      testNameEn: "Urine Routine & Microscopic Examination (Physical, Chemical & Microscopic)",
      categoryBn: "রুটিন প্রস্রাব স্ক্রিনিং",
      regularPriceRangeBn: "৳১০০ - ৳২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "অটোমেটেড ইউরিন স্ট্রিপ ও ফ্লো সাইটোমেট্রি (Automated Urine Analyzer Profile)",
      testNameEn: "Automated Urine Strip Analyzer with Flow Cytometry Particle Analysis",
      categoryBn: "স্বয়ংক্রিয় ইউরিন অ্যানালাইসিস",
      regularPriceRangeBn: "৳৩০০ - ৳৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "ইউরিন প্রেগন্যান্সি টেস্ট (Urine hCG Spot Card Test - UPT)",
      testNameEn: "Urine Rapid hCG Pregnancy Test Card (Qualitative Detection)",
      categoryBn: "প্রেগন্যান্সি নিশ্চিতকরণ",
      regularPriceRangeBn: "৳১০০ - ৳২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ৩০ মিনিট",
    },
    {
      testNameBn: "ইউরিন কিটোন বডিস টেস্ট (Urine Ketone Bodies - DKA Screening)",
      testNameEn: "Urine Ketone Test by Nitroprusside Strip / Rothera Test for Ketoacidosis",
      categoryBn: "ডায়াবেটিক এমার্জেন্সি স্ক্রিনিং",
      regularPriceRangeBn: "৳১০০ - ৳২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩০ মিনিট",
    },

    // ২. মাইক্রোবায়োলজি ও কালচার সেনসিটিভিটি
    {
      testNameBn: "ইউরিন কালচার অ্যান্ড সেনসিটিভিটি (Urine C/S - Culture & Antibiotic Sensitivity)",
      testNameEn: "Urine Culture & Sensitivity (Aerobic Colony Count with AST Panel)",
      categoryBn: "ইউটিআই জীবাণু ও অ্যান্টিবায়োটিক বাছাই",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪৮ - ৭২ ঘণ্টা (ইনকিউবেশন সময়)",
    },
    {
      testNameBn: "পেডিয়াট্রিক ইউরিন কালেকশন ব্যাগ আর/ই ও কালচার (Pediatric Urine Bag C/S)",
      testNameEn: "Pediatric Urine Bag Collection for Routine R/E and Culture Sensitivity",
      categoryBn: "শিশু ও নবজাতক ইউটিআই কেয়ার",
      regularPriceRangeBn: "৳৭৫০ - ৳১,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪৮ - ৭২ ঘণ্টা",
    },

    // ৩. কিডনি ক্ষতি, ডায়াবেটিস ও বিশেষায়িত প্রোটিন ক্ষরণ পরীক্ষা
    {
      testNameBn: "ইউরিন স্পট মাইক্রোঅ্যালবুমিন ও এসিআর (Spot Urine Microalbumin / ACR)",
      testNameEn: "Spot Urine Albumin-to-Creatinine Ratio (ACR) by Immunoturbidimetry",
      categoryBn: "ডায়াবেটিক কিডনি ড্যামেজ স্ক্রিনিং",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "২৪ ঘণ্টার প্রস্রাবে মোট প্রোটিন ক্ষরণ (24-Hour Urinary Total Protein - UTP)",
      testNameEn: "24-Hour Urinary Total Protein Quantitative Assay (Nephrotic Syndrome)",
      categoryBn: "নেফ্রোটিক সিন্ড্রোম ও প্রোটিনুরিয়া",
      regularPriceRangeBn: "৳৪০০ - ৳৭০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "২৪ ঘণ্টার ইউরিনারি ক্যালসিয়াম ও ইউরিক অ্যাসিড (24-Hour Urine Stone Risk)",
      testNameEn: "24-Hour Urinary Calcium, Uric Acid & Oxalate for Kidney Stone Evaluation",
      categoryBn: "কিডনি পাথর ঝুঁকি মূল্যায়ন",
      regularPriceRangeBn: "৳৬০০ - ৳১,১০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৬ - ৮ ঘণ্টা",
    },
    {
      testNameBn: "ইউরিন বেনস জোন্স প্রোটিন (Urine Bence Jones Protein - BJP)",
      testNameEn: "Urine Bence Jones Protein Test by Heat Coagulation / Electrophoresis",
      categoryBn: "মাল্টিপল মায়োলোমা স্ক্রিনিং",
      regularPriceRangeBn: "৳৪০০ - ৳৭০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },

    // ৪. সমন্বিত ইউটিআই ও রেনাল ডায়াগনস্টিক প্যাকেজ
    {
      testNameBn: "জরুরি ইউটিআই ডায়াগনস্টিক প্যানেল (Urine R/E + Urine C/S + Complete CBC)",
      testNameEn: "Urgent UTI Diagnostic Combo: Urine R/E, Urine Culture & Automated CBC with ESR",
      categoryBn: "সমন্বিত ইউটিআই ইনফেকশন প্যাকেজ",
      regularPriceRangeBn: "৳১,১০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪৮ - ৭২ ঘণ্টা (সিবিসি ও আর/ই ২ ঘণ্টায়)",
    },
    {
      testNameBn: "পুনরাবৃত্ত ইউটিআই ও কিডনি পাথর প্রোফাইল (Urine R/E + C/S + Creatinine + USG KUB)",
      testNameEn: "Recurrent UTI & Stone Workup: Urine R/E, C/S, Serum Creatinine & USG of KUB",
      categoryBn: "পূর্ণাঙ্গ রেনাল ও মূত্রনালী মূল্যায়ন",
      regularPriceRangeBn: "৳২,০০০ - ৳৩,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪৮ - ৭২ ঘণ্টা (আল্ট্রাসাউন্ড ও আর/ই একই দিনে)",
    },
  ],
};
