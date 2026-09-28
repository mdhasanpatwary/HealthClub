import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_KIDNEY_TEST_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে সিরাম ক্রিয়েটিনিন ও কিডনি টেস্টের (RFT/KFT) খরচ ও মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার শীর্ষ অনুমোদিত ডায়াগনস্টিক সেন্টার ও প্যাথলজি ল্যাবে সিরাম ক্রিয়েটিনিন, ইউরিয়া, বিইউএন, ইউরিক অ্যাসিড, ইলেক্ট্রোলাইটস ও ইউরিন মাইক্রোঅ্যালবুমিনের নিয়মিত বাজার ফি বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের তালিকা।",
  titleEn: "Kidney Function & Creatinine Test Price Guide in Feni (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar clinical chemistry and nephrology laboratories.",
  tests: [
    // ১. প্রাথমিক কিডনি ফাংশন ও মেটাবলিক মার্কার
    {
      testNameBn: "সিরাম ক্রিয়েটিনিন টেস্ট (Serum Creatinine - Kinetic Jaffe / Enzymatic Method)",
      testNameEn: "Serum Creatinine by Fully Automated UV-Kinetic Jaffe or Enzymatic Method",
      categoryBn: "কিডনি ফিল্ট্রেশন ও মেটাবলিক বর্জ্য",
      regularPriceRangeBn: "৳২০০ - ৳৩৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম ইউরিয়া ও বিইউএন (Serum Urea & Blood Urea Nitrogen - BUN)",
      testNameEn: "Serum Urea & BUN by Automated Urease-GLDH Enzymatic Kinetic Method",
      categoryBn: "প্রোটিন মেটাবলিজম ও ইউরিয়া ক্লিয়ারেন্স",
      regularPriceRangeBn: "৳২০০ - ৳৩৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "কমপ্লিট রেনাল ফাংশন টেস্ট প্যানেল (Complete RFT / KFT Profile - 6 Parameters)",
      testNameEn: "Complete Kidney Profile: Creatinine, Urea, BUN, Uric Acid, Electrolytes & eGFR",
      categoryBn: "পূর্ণাঙ্গ কিডনি ফাংশন প্রোফাইল",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৫ ঘণ্টা (একই দিন)",
    },
    {
      testNameBn: "সিরাম ইউরিক অ্যাসিড (Serum Uric Acid - Hyperuricemia & Gout Screening)",
      testNameEn: "Serum Uric Acid by Automated Uricase-Peroxidase Enzymatic Method",
      categoryBn: "ইউরিক অ্যাসিড ও কিডনি পাথর ঝুঁকি",
      regularPriceRangeBn: "৳২৫০ - ৳৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },

    // ২. ইলেক্ট্রোলাইট, মিনারেল ও ফিল্ট্রেশন রেট
    {
      testNameBn: "সিরাম ইলেক্ট্রোলাইটস প্যানেল (Serum Electrolytes - Na+, K+, Cl-, HCO3-)",
      testNameEn: "Serum Electrolytes (Sodium, Potassium, Chloride, Bicarbonate) by ISE Method",
      categoryBn: "ইলেক্ট্রোলাইট ব্যালেন্স ও পটাশিয়াম",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম ক্যালসিয়াম ও ইনঅর্গানিক ফসফরাস (Serum Calcium & Phosphorus)",
      testNameEn: "Serum Calcium (Arsenazo III) & Inorganic Phosphorus (Molybdate UV)",
      categoryBn: "রেনাল বোন ডিজিজ ও মিনারেল কেয়ার",
      regularPriceRangeBn: "৳৫০০ - ৳৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "ই-জিএফআর ক্যালকুলেশন (Estimated Glomerular Filtration Rate - eGFR by CKD-EPI)",
      testNameEn: "eGFR Calculation based on Age, Sex & Creatinine (CKD-EPI Formula)",
      categoryBn: "কিডনি কার্যক্ষমতা ও সিকেডি স্টেজিং",
      regularPriceRangeBn: "৳১৫০ - ৳৩০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },

    // ৩. মূত্র পরীক্ষা, প্রোটিনুরিয়া ও ডায়াবেটিক নেফ্রোপ্যাথি
    {
      testNameBn: "ইউরিন আর/এম/ই টেস্ট (Urine Routine & Microscopic Examination)",
      testNameEn: "Urine R/M/E: Protein/Albumin, Sugar, Pus Cells, RBC, Casts & Crystals",
      categoryBn: "ইউরিনারি ইনফেকশন ও প্রোটিন লিকেজ",
      regularPriceRangeBn: "৳১০০ - ৳২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "ইউরিন মাইক্রোঅ্যালবুমিন ও এসিআর (Urine Spot Albumin-to-Creatinine Ratio - ACR)",
      testNameEn: "Urine Microalbumin & ACR by Automated Immuno-turbidimetry (Diabetic Nephropathy)",
      categoryBn: "ডায়াবেটিক নেফ্রোপ্যাথি ও প্রারম্ভিক ড্যামেজ",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "২৪ ঘণ্টার ইউরিনারি টোটাল প্রোটিন (24-Hour Urinary Total Protein - UTP)",
      testNameEn: "24-Hour Urine Total Protein & Volume Measurement (Pyrogallol Red Method)",
      categoryBn: "নেফ্রোটিক সিন্ড্রোম ও প্রোটিন ক্ষরণ",
      regularPriceRangeBn: "৳৪০০ - ৳৭০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা কালেকশন + ৩ ঘণ্টা",
    },

    // ৪. কিডনি আল্ট্রাসাউন্ড ও সমন্বিত স্ক্রিনিং প্যাকেজ
    {
      testNameBn: "আল্ট্রাসোনোগ্রাম কেইউবি ও প্রোস্টেট (USG of KUB & Prostate with PVR)",
      testNameEn: "USG of Kidney, Ureter, Bladder & Prostate with Post-Void Residual Volume",
      categoryBn: "কিডনি সাইজ, পাথর ও হাইড্রোনাফ্রোসিস",
      regularPriceRangeBn: "৳৮০০ - ৳১,৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "কমপ্লিট রেনাল প্রোটেকশন ও সিকেডি স্ক্রিনিং প্যাকেজ (Comprehensive Kidney Care)",
      testNameEn: "Complete Kidney Package: Serum Creatinine + Urea + Electrolytes + Uric Acid + Urine ACR + USG KUB + CBC",
      categoryBn: "সমন্বিত কিডনি সুরক্ষা ও চেকআপ প্যাকেজ",
      regularPriceRangeBn: "৳২,২০০ - ৳৩,৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৫ - ৬ ঘণ্টা (একই দিন)",
    },
  ],
};
