import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_HBA1C_TEST_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে HbA1c ও ডায়াবেটিস টেস্টের খরচ এবং মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার শীর্ষ অনুমোদিত ডায়াগনস্টিক সেন্টার ও প্যাথলজি ল্যাবে এইচবিএ১সি (৩ মাসের গড় সুগার), ফাস্টিং সুগার, ওজিটিটি ও ডায়াবেটিক প্রোফাইলের নিয়মিত ফি বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের তালিকা।",
  titleEn: "HbA1c & Diabetes Blood Sugar Test Price Guide in Feni (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar clinical biochemistry and pathology laboratories.",
  tests: [
    // ১. গ্লাইকেটেড হিমোগ্লোবিন ও বেসিক গ্লুকোজ টেস্ট
    {
      testNameBn: "এইচবিএ১সি - ৩ মাসের গড় সুগার (HbA1c by HPLC Method)",
      testNameEn: "HbA1c (Glycated Hemoglobin) by NGSP/IFCC Certified HPLC Method",
      categoryBn: "ডায়াবেটিস নিয়ন্ত্রণ ও গড় সুগার",
      regularPriceRangeBn: "৳৭০০ - ৳১,১০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা (একই দিন)",
    },
    {
      testNameBn: "ফাস্টিং ব্লাড গ্লুকোজ (Fasting Blood Sugar - FBS / FBG)",
      testNameEn: "Fasting Blood Sugar (FBS) Automated Enzymatic Hexokinase Method",
      categoryBn: "বেসিক রক্তের গ্লুকোজ",
      regularPriceRangeBn: "৳৮০ - ৳১৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "খাবার ২ ঘণ্টা পরের সুগার (2 Hours Post-Breakfast / 2hABF / PPBS)",
      testNameEn: "2 Hours Postprandial Blood Glucose (2hABF / PPBS)",
      categoryBn: "খাবার পরবর্তী সুগার",
      regularPriceRangeBn: "৳৮০ - ৳১৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "র‍্যান্ডম ব্লাড সুগার (Random Blood Sugar - RBS)",
      testNameEn: "Random Blood Sugar (RBS) Quantitative Plasma Glucose",
      categoryBn: "তাৎক্ষণিক জরুরি সুগার",
      regularPriceRangeBn: "৳৮০ - ৳১৩০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩০ মিনিট - ১ ঘণ্টা",
    },

    // ২. বিশেষায়িত গ্লুকোজ টলারেন্স ও গর্ভকালীন ডায়াবেটিস
    {
      testNameBn: "ওরাল গ্লুকোজ টলারেন্স টেস্ট (OGTT - 75g Glucose 2-Hour)",
      testNameEn: "Oral Glucose Tolerance Test (OGTT - Fasting + 2h Post 75g Glucose)",
      categoryBn: "ডায়াবেটিস নিশ্চিতকরণ ও ওজিটিটি",
      regularPriceRangeBn: "৳৩০০ - ৳৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "গর্ভকালীন ডায়াবেটিস স্ক্রিনিং (GDM Profile - 3 Sample OGTT)",
      testNameEn: "Gestational Diabetes Mellitus (GDM) 3-Point Profile (Fasting + 1h + 2h)",
      categoryBn: "গর্ভকালীন বিশেষ প্রোফাইল",
      regularPriceRangeBn: "৳৪৫০ - ৳৭০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },

    // ৩. ডায়াবেটিক কমপ্লিকেশন ও অর্গান ড্যামেজ স্ক্রিনিং
    {
      testNameBn: "কমপ্লিট ডায়াবেটিক হেলথ প্যানেল (HbA1c + FBS + 2hABF + Lipid + Creatinine)",
      testNameEn: "Comprehensive Diabetic Health Profile (HbA1c + Glucose + Lipids + Renal)",
      categoryBn: "বার্ষিক ডায়াবেটিক চেকআপ কম্বো",
      regularPriceRangeBn: "৳১,৮০০ - ৳২,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা (একই দিন)",
    },
    {
      testNameBn: "ইউরিন মাইক্রোঅ্যালবুমিন ও এসিআর (Urine Microalbumin / ACR)",
      testNameEn: "Urine Microalbumin-to-Creatinine Ratio (ACR for Diabetic Nephropathy)",
      categoryBn: "ডায়াবেটিক কিডনি ড্যামেজ স্ক্রিনিং",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৫ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম সি-পেপটাইড (Serum C-Peptide by CLIA - Fasting)",
      testNameEn: "Serum Fasting C-Peptide (Endogenous Beta Cell Insulin Secretion Marker)",
      categoryBn: "ইনসুলিন নিঃসরণ সক্ষমতা পরিমাপ",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা (স্পেশালাইজড)",
    },
    {
      testNameBn: "ফাস্টিং সিরাম ইনসুলিন (Fasting Serum Insulin Level)",
      testNameEn: "Fasting Serum Insulin Quantitative Chemiluminescence Assay",
      categoryBn: "ইনসুলিন রেজিস্ট্যান্স মূল্যায়ন (HOMA-IR)",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা",
    },
    {
      testNameBn: "ইউরিন সুগার ও কিটোন বডিস (Urine Sugar & Ketone Bodies)",
      testNameEn: "Urinalysis for Glycosuria & Ketone Bodies (Diabetic Ketoacidosis Screen)",
      categoryBn: "কিটোঅ্যাসিডোসিস (DKA) মনিটরিং",
      regularPriceRangeBn: "৳১০০ - ৳২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ ঘণ্টা",
    },
    {
      testNameBn: "ডায়াবেটিক ফুট ও নিউরোপ্যাথি প্যানেল (HbA1c + ESR + Creatinine + Lipid)",
      testNameEn: "Diabetic Foot & Neuropathy Risk Assessment Laboratory Panel",
      categoryBn: "ডায়াবেটিক স্নায়ু ও ক্ষত স্ক্রিনিং",
      regularPriceRangeBn: "৳১,৪০০ - ৳২,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৫ ঘণ্টা",
    },
  ],
};
