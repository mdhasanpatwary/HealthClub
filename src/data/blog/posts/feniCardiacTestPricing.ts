import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_CARDIAC_TEST_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে ইসিজি, ইকো, ইটিটি ও কার্ডিয়াক টেস্টের খরচ ও মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার শীর্ষ অনুমোদিত ডায়াগনস্টিক সেন্টার ও কার্ডিয়াক ল্যাবে নিয়মিত বাজারদর বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের পূর্ণাঙ্গ তালিকা।",
  titleEn: "Feni ECG, Echocardiogram, ETT & Cardiac Diagnostic Test Price Guide (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar heart diagnostic centers.",
  tests: [
    // ১. নন-ইনভেসিভ কার্ডিয়াক ইমেজিং ও স্ট্রেস টেস্ট
    {
      testNameBn: "১২-লিড ডিজিটাল রেস্টিং ইসিজি (12-Lead Digital Resting ECG)",
      testNameEn: "12-Lead Digital Resting ECG with Computerized Interpretation",
      categoryBn: "কার্ডিয়াক ইলেকট্রোফিজিওলজি ও রিদম",
      regularPriceRangeBn: "৳৩০০ - ৳৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ৩০ মিনিট (তাৎক্ষণিক রিপোর্ট)",
    },
    {
      testNameBn: "২ডি কালার ডপলার ইকোকার্ডিওগ্রাম (2D Color Doppler Echocardiogram - TTE)",
      testNameEn: "Transthoracic 2D Color Doppler Echocardiography",
      categoryBn: "নন-ইনভেসিভ কার্ডিয়াক ইমেজিং",
      regularPriceRangeBn: "৳২,২০০ - ৳৩,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩০ - ৪৫ মিনিট",
    },
    {
      testNameBn: "পেডিয়াট্রিক ও জন্মগত হৃদরোগ ইকো (Pediatric & Congenital Echocardiogram)",
      testNameEn: "Pediatric & Congenital Heart Defect Echocardiography",
      categoryBn: "শিশু হৃদরোগ ইমেজিং",
      regularPriceRangeBn: "৳২,৫০০ - ৳৪,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪৫ - ৬০ মিনিট",
    },
    {
      testNameBn: "৪ডি অ্যাডভান্সড ইকো ও মায়োকার্ডিয়াল স্ট্রেন (4D Advanced Echo & Strain Imaging)",
      testNameEn: "4D Echocardiography with Global Longitudinal Strain (GLS)",
      categoryBn: "উন্নত কার্ডিয়াক ইমেজিং",
      regularPriceRangeBn: "৳৩,৫০০ - ৳৫,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "কম্পিউটারাইজড ট্রেডমিল টেস্ট - ইটিটি (Computerized Exercise Tolerance Test - ETT / TMT)",
      testNameEn: "Computerized Treadmill Exercise Tolerance Test under Bruce Protocol",
      categoryBn: "কার্ডিয়াক স্ট্রেস টেস্ট",
      regularPriceRangeBn: "৳২,৫০০ - ৳৪,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা (রিকভারি সহ)",
    },
    {
      testNameBn: "২৪ ঘণ্টা ডিজিটাল হোল্টার ইসিজি মনিটরিং (24-Hour Ambulatory Holter ECG Monitoring)",
      testNameEn: "24-Hour Ambulatory Digital Holter ECG Rhythm Monitoring",
      categoryBn: "অ্যাম্বুলেটরি রিদম মনিটরিং",
      regularPriceRangeBn: "৳৩,০০০ - ৳৪,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা রেকর্ড + ১ দিন রিপোর্ট",
    },
    {
      testNameBn: "২৪ ঘণ্টা অ্যাম্বুলেটরি ব্লাড প্রেশার মনিটরিং (24-Hour Ambulatory BP Monitoring - ABPM)",
      testNameEn: "24-Hour Continuous Ambulatory Blood Pressure Monitoring (ABPM)",
      categoryBn: "অ্যাম্বুলেটরি প্রেশার মনিটরিং",
      regularPriceRangeBn: "৳২,০০০ - ৳৩,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা রেকর্ড + ১ দিন রিপোর্ট",
    },

    // ২. জরুরি কার্ডিয়াক বায়োমার্কার ও ব্লাড প্যানেল
    {
      testNameBn: "হাই-সেনসিটিভ ট্রোপোনিন-আই কোয়ান্টিটেটিভ (High-Sensitivity Troponin-I Quantitative)",
      testNameEn: "hs-cTnI Cardiac Biomarker for Acute Myocardial Infarction",
      categoryBn: "জরুরি কার্ডিয়াক বায়োমার্কার",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩০ - ৬০ মিনিট (জরুরি স্ট্যাট রিপোর্ট)",
    },
    {
      testNameBn: "সিকে-এমবি ও হার্ট এনজাইম প্যানেল (CK-MB & Cardiac Enzyme Panel)",
      testNameEn: "Creatine Kinase-MB Isoenzyme Quantitative Assay",
      categoryBn: "জরুরি কার্ডিয়াক বায়োমার্কার",
      regularPriceRangeBn: "৳৭০০ - ৳১,১০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম এনটি-প্রোবিএনপি হার্ট ফেইলিউর মার্কার (Serum NT-proBNP Biomarker)",
      testNameEn: "N-Terminal pro-B-type Natriuretic Peptide for Heart Failure",
      categoryBn: "কার্ডিয়াক ফাংশন বায়োমার্কার",
      regularPriceRangeBn: "৳২,৫০০ - ৳৩,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "সম্পূর্ণ লিপিড প্রোফাইল প্যানেল (Comprehensive Lipid Profile: TC, TG, HDL, LDL)",
      testNameEn: "Full Lipid Panel with Atherogenic Ratios",
      categoryBn: "কার্ডিওভাসকুলার রিস্ক প্যানেল",
      regularPriceRangeBn: "৳৮০০ - ৳১,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "ডিজিটাল চেস্ট এক্স-রে পি/এ ভিউ (Digital Chest X-Ray P/A View - Cardiomegaly Screen)",
      testNameEn: "Chest X-Ray P/A View for Cardiothoracic Ratio & Pulmonary Congestion",
      categoryBn: "রেডিওলজি ও কার্ডিওমেগালি",
      regularPriceRangeBn: "৳৪০০ - ৳৬৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩০ - ৪৫ মিনিট",
    },
    {
      testNameBn: "সিরাম ইলেক্ট্রোলাইটস ও সিরাম ক্রিয়েটিনিন (Serum Electrolytes & Creatinine)",
      testNameEn: "Serum Electrolytes (Na+, K+, Cl-) & Serum Creatinine for Cardiac Care",
      categoryBn: "বায়োকেমিস্ট্রি ও রেনাল সেফটি",
      regularPriceRangeBn: "৳৭৫০ - ৳১,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "হাই-সেনসিটিভ সি-রিঅ্যাক্টিভ প্রোটিন - এইচএস-সিআরপি (High-Sensitivity CRP)",
      testNameEn: "hs-CRP High-Sensitivity Marker for Vascular Inflammation",
      categoryBn: "কার্ডিওভাসকুলার ইনফ্ল্যামেশন",
      regularPriceRangeBn: "৳৮০০ - ৳১,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
  ],
};
