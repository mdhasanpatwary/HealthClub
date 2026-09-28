import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_CBC_TEST_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে সিবিসি রক্তের পরীক্ষা ও হেমাটোলজি ল্যাব টেস্টের খরচ ও মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার শীর্ষ অনুমোদিত ডায়াগনস্টিক সেন্টার ও প্যাথলজি ল্যাবে সিবিসি, প্লাটিলেট ও আনুষঙ্গিক রক্ত পরীক্ষার সাধারণ বাজারদর বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের তালিকা।",
  titleEn: "Complete Blood Count (CBC) & Hematology Test Price Guide in Feni (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar pathology laboratories.",
  tests: [
    // ১. কমপ্লিট ব্লাড কাউন্ট ও রুটিন হেমাটোলজি
    {
      testNameBn: "সিবিসি ও ইএসআর (CBC with ESR - 5-Part Automated Analyzer)",
      testNameEn: "Complete Blood Count with ESR by 5-Part Differential Analyzer",
      categoryBn: "কমপ্লিট ব্লাড কাউন্ট ও ইনফ্লামেশন",
      regularPriceRangeBn: "৳৪০০ - ৳৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা (জরুরি ৩০-৪৫ মিনিট)",
    },
    {
      testNameBn: "সিবিসি রুটিন (CBC Routine - Complete Hemogram)",
      testNameEn: "Complete Blood Count Routine (Hb, RBC, WBC, Platelets, Indices)",
      categoryBn: "কমপ্লিট ব্লাড কাউন্ট",
      regularPriceRangeBn: "৳৩৫০ - ৳৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "প্লাটিলেট কাউন্ট ডেঙ্গু মনিটরিং (Platelet Count - Automated & Chamber)",
      testNameEn: "Platelet Count Quantitative Assay for Dengue Monitoring",
      categoryBn: "জরুরি হেমাটোলজি ও ডেঙ্গু কেয়ার",
      regularPriceRangeBn: "৳১৫০ - ৳২৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩০ - ৪৫ মিনিট (জরুরি স্ট্যাট)",
    },
    {
      testNameBn: "হিমোগ্লোবিন ও আরবিসি ইনডেক্স (Hb% with PCV, MCV, MCH, MCHC)",
      testNameEn: "Hemoglobin Concentration & Red Blood Cell Absolute Indices",
      categoryBn: "রক্তস্বল্পতা ও এনিমিয়া প্রোফাইল",
      regularPriceRangeBn: "৳২০০ - ৳৩৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ ঘণ্টা",
    },
    {
      testNameBn: "এরিথ্রোসাইট সেডিমেন্টেশন রেট (ESR - Westergren Automated)",
      testNameEn: "Erythrocyte Sedimentation Rate by Automated Westergren Method",
      categoryBn: "ইনফ্লামেটরি মার্কার",
      regularPriceRangeBn: "৳১০০ - ৳২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ১.৫ ঘণ্টা",
    },
    {
      testNameBn: "ডব্লিউবিসি টোটাল ও ডিফারেনশিয়াল কাউন্ট (TC, DC of WBC)",
      testNameEn: "Total & Differential White Blood Cell Count (TC, DC)",
      categoryBn: "ইনফেকশন ও ইমিউন রেসপন্স",
      regularPriceRangeBn: "৳২০০ - ৳৩০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ ঘণ্টা",
    },
    {
      testNameBn: "পেরিফেরাল ব্লাড ফিল্ম (PBF - Hematologist Microscopic Examination)",
      testNameEn: "Peripheral Blood Film / Smear Examination by Consultant Pathologist",
      categoryBn: "বিশেষায়িত হেমাটোলজি ও ব্লাড স্মিয়ার",
      regularPriceRangeBn: "৳৬০০ - ৳৯০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৮ ঘণ্টা (প্যাথলজিস্ট রিভিউ)",
    },
    {
      testNameBn: "রেটিকুলোসাইট কাউন্ট উইথ ইনডেক্স (Reticulocyte Count)",
      testNameEn: "Reticulocyte Count & Index for Bone Marrow Erythropoiesis",
      categoryBn: "বোন ম্যারো রেসপন্স",
      regularPriceRangeBn: "৳৩০০ - ৳৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৪ ঘণ্টা",
    },

    // ২. ইনফেকশন মার্কার ও আয়রন মেটাবলিজম
    {
      testNameBn: "সি-রিঅ্যাকটিভ প্রোটিন কোয়ান্টিটেটিভ (CRP Quantitative Assay)",
      testNameEn: "C-Reactive Protein (CRP) Quantitative Immunoturbidimetric Assay",
      categoryBn: "তীব্র ইনফেকশন ও ইনফ্লামেশন",
      regularPriceRangeBn: "৳৫০০ - ৳৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম ফেরিটিন (Serum Ferritin - Iron Storage Chemiluminescence)",
      testNameEn: "Serum Ferritin Quantitative Immunoassay for Iron Stores",
      categoryBn: "রক্তস্বল্পতা ও এনিমিয়া প্রোফাইল",
      regularPriceRangeBn: "৳৮০০ - ৳১,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "কমপ্লিট আয়রন প্রোফাইল (Serum Iron, TIBC, Transferrin Saturation)",
      testNameEn: "Total Iron Profile: Serum Iron, TIBC, UIBC & Saturation Index",
      categoryBn: "রক্তস্বল্পতা ও এনিমিয়া প্রোফাইল",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৮ ঘণ্টা",
    },
    {
      testNameBn: "হিমোগ্লোবিন ইলেক্ট্রোফোরেসিস (Hb Electrophoresis for Thalassemia)",
      testNameEn: "Capillary Hemoglobin Electrophoresis for Thalassemia Screening",
      categoryBn: "থ্যালাসেমিয়া ও হিমোগ্লোবিনোপ্যাথি",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ - ৪৮ ঘণ্টা",
    },

    // ৩. কোয়াগুলেশন ও প্রাক-অপারেশন টেস্ট
    {
      testNameBn: "ব্লিডিং টাইম ও ক্লটিং টাইম (BT & CT - Screening Coagulation)",
      testNameEn: "Bleeding Time (Duke/Ivy) & Clotting Time (Capillary Tube)",
      categoryBn: "প্রাক-অপারেশন কোয়াগুলেশন",
      regularPriceRangeBn: "৳১৫০ - ৳২৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩০ মিনিট",
    },
    {
      testNameBn: "প্রোথ্রম্বিন টাইম উইথ আইএনআর (PT with INR Coagulation Assay)",
      testNameEn: "Prothrombin Time with International Normalized Ratio (PT / INR)",
      categoryBn: "কোয়াগুলেশন ও হেপাটাইটিস কেয়ার",
      regularPriceRangeBn: "৳৬০০ - ৳৯৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "ব্লাড গ্রুপিং ও আরএইচ ফ্যাক্টর (ABO & Rh-D Blood Grouping)",
      testNameEn: "ABO Grouping & Rh-D Factor Typing with Forward & Reverse Agglutination",
      categoryBn: "ব্লাড টাইপিং ও ট্রান্সফিউশন",
      regularPriceRangeBn: "৳১০০ - ৳১৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ২০ মিনিট",
    },
  ],
};
