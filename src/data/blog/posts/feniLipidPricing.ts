import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_LIPID_TEST_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে লিপিড প্রোফাইল ও রক্তে চর্বি পরীক্ষার খরচ ও মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার শীর্ষ অনুমোদিত ডায়াগনস্টিক সেন্টার ও প্যাথলজি ল্যাবে লিপিড প্রোফাইল, কোলেস্টেরল, ট্রাইগ্লিসারাইড ও কার্ডিয়াক ল্যাব টেস্টের নিয়মিত ফি বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের তালিকা।",
  titleEn: "Lipid Profile & Cholesterol Test Price Guide in Feni (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar clinical chemistry laboratories.",
  tests: [
    // ১. পূর্ণাঙ্গ লিপিড প্রোফাইল ও উপাদানসমূহ
    {
      testNameBn: "লিপিড প্রোফাইল কমপ্লিট প্যানেল (Lipid Profile Complete - Fasting)",
      testNameEn: "Complete Lipid Panel (Total Chol, HDL, LDL, VLDL, Triglycerides, Ratio)",
      categoryBn: "পূর্ণাঙ্গ লিপিড প্রোফাইল",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা (একই দিন)",
    },
    {
      testNameBn: "সিরাম টোটাল কোলেস্টেরল (Serum Total Cholesterol - Enzymatic)",
      testNameEn: "Serum Total Cholesterol by Automated Enzymatic Colorimetric Assay",
      categoryBn: "কোলেস্টেরল স্ক্রিনিং",
      regularPriceRangeBn: "৳২০০ - ৳৩৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম ট্রাইগ্লিসারাইডস (Serum Triglycerides - Fasting)",
      testNameEn: "Serum Triglycerides (Fasting 10-12 hrs) by GPO-PAP Method",
      categoryBn: "রক্তে চর্বির মাত্রা",
      regularPriceRangeBn: "৳২৫০ - ৳৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "এইচডিএল কোলেস্টেরল - ভালো চর্বি (HDL Cholesterol Direct Assay)",
      testNameEn: "High-Density Lipoprotein (HDL-C) Direct Immunoinhibition Assay",
      categoryBn: "কার্ডিও-প্রোটেক্টিভ লিপোপ্রোটিন",
      regularPriceRangeBn: "৳৩০০ - ৳৪৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "এলডিএল কোলেস্টেরল - খারাপ চর্বি (LDL Cholesterol Direct Enzymatic)",
      testNameEn: "Low-Density Lipoprotein (LDL-C) Direct Homogeneous Enzymatic Assay",
      categoryBn: "এথেরোস্ক্লেরোসিস রিস্ক মার্কার",
      regularPriceRangeBn: "৳৩০০ - ৳৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "ভিএলডিএল ও কোলেস্টেরল/এইচডিএল রেশিও (VLDL & Chol/HDL Risk Ratio)",
      testNameEn: "Very Low-Density Lipoprotein (VLDL) & Total Chol to HDL Ratio",
      categoryBn: "কার্ডিয়াক রিস্ক রেশিও",
      regularPriceRangeBn: "৳২৫০ - ৳৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ ঘণ্টা",
    },

    // ২. উন্নত কার্ডিওভাসকুলার ও ইনফ্লামেশন মার্কার
    {
      testNameBn: "হাই-সেনসিটিভিটি সিআরপি (hs-CRP - High-Sensitivity Cardiac CRP)",
      testNameEn: "High-Sensitivity C-Reactive Protein (hs-CRP) for Cardiac Risk",
      categoryBn: "কার্ডিয়াক ইনফ্লামেশন মার্কার",
      regularPriceRangeBn: "৳৮০০ - ৳১,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "অ্যাপোলিপোপ্রোটিন এ১ ও বি প্যানেল (Apo-A1 & Apo-B Panel)",
      testNameEn: "Apolipoprotein A1 & Apolipoprotein B Quantitative Immunoturbidimetric",
      categoryBn: "উন্নত এথেরোজেনিক মার্কার",
      regularPriceRangeBn: "৳১,৫০০ - ৳২,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা (স্পেশালাইজড)",
    },
    {
      testNameBn: "লিপোপ্রোটিন (এ) কোয়ান্টিটেটিভ [Lipoprotein(a) / Lp(a)]",
      testNameEn: "Lipoprotein(a) Quantitative Serum Assay for Hereditary Cardiac Risk",
      categoryBn: "বংশগত হার্ট অ্যাটাক রিস্ক",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা",
    },

    // ৩. স্ট্যাটিন থেরাপি মনিটরিং ও ডায়াবেটিক ডিসলিপিডিমিয়া প্যাকেজ
    {
      testNameBn: "স্ট্যাটিন থেরাপি মনিটরিং প্যানেল (Lipid Profile + SGPT/ALT + Creatinine)",
      testNameEn: "Statin Safety Monitoring Panel (Lipid Profile + SGPT + Serum Creatinine)",
      categoryBn: "ঔষধ সেবনকারী সেফটি প্রোফাইল",
      regularPriceRangeBn: "৳১,১০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "ডায়াবেটিক ডিসলিপিডিমিয়া কম্বো (Lipid Profile + FBS + HbA1c)",
      testNameEn: "Diabetic Dyslipidemia Combo (Lipid Profile + Fasting Glucose + HbA1c)",
      categoryBn: "ডায়াবেটিস ও হৃদরোগ কম্বো",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৯০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "কার্ডিয়াক ট্রোপোনিন আই কোয়ান্টিটেটিভ (Troponin I - Stat)",
      testNameEn: "Cardiac Troponin I Quantitative Chemiluminescence (Stat Chest Pain)",
      categoryBn: "জরুরি হার্ট অ্যাটাক মার্কার",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪৫ মিনিট - ১ ঘণ্টা (জরুরি)",
    },
  ],
};
