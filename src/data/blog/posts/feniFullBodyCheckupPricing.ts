import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_FULL_BODY_CHECKUP_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে হোল বডি হেলথ চেকআপ ও এক্সিকিউটিভ প্যাকেজের বাজারদর ২০২৬",
  subtitleBn:
    "ফেনীর বেসরকারি ডায়াগনস্টিক সেন্টারে বেসিক, কমপ্রিহেনসিভ এক্সিকিউটিভ, কার্ডিয়াক, ডায়াবেটিস, সিনিয়র সিটিজেন ও নারী স্বাস্থ্য স্ক্রিনিং প্যাকেজের সাধারণ ফি এবং হেলথ ক্লাব মেম্বারদের ১০-৩০% নিশ্চিত ছাড়।",
  titleEn: "Full Body Health Checkup & Executive Packages Price Guide in Feni (2026)",
  subtitleEn:
    "Market benchmark charges for Basic, Comprehensive Executive, Cardiac, Diabetic, Senior Citizen, and Well-Woman screening packages in Feni Sadar with 10-30% Health Club member discounts.",
  tests: [
    // 1. Core General & Executive Wellness Packages
    {
      testNameBn: "বেসিক প্রিভেন্টিভ হেলথ চেকআপ (Basic Wellness Package - CBC, FBS, Creatinine, Urine R/M/E, Blood Group)",
      testNameEn: "Basic Preventive Wellness Package (CBC with ESR, Fasting Glucose, Serum Creatinine, Urine R/M/E, ABO/Rh)",
      categoryBn: "প্রিভেন্টিভ ওয়েলনেস প্যাকেজ",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "কমপ্রিহেনসিভ এক্সিকিউটিভ হেলথ চেকআপ (Comprehensive Executive Screening - সম্পূর্ণ অর্গান প্রোফাইল, USG ও ECG)",
      testNameEn: "Comprehensive Executive Health Checkup (Full Blood, Lipid, LFT, KFT, Electrolytes, Whole Abdomen USG, ECG & X-Ray)",
      categoryBn: "প্রিভেন্টিভ ওয়েলনেস প্যাকেজ",
      regularPriceRangeBn: "৳৪,৫০০ - ৳৭,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৬ - ৮ ঘণ্টা (একই দিনে ডেলিভারি)",
    },
    {
      testNameBn: "প্রবাসী ও প্রি-ডিপার্চার মেডিকেল ফিটনেস প্যাকেজ (Expat / Pre-Departure & Family Wellness Screening)",
      testNameEn: "Expat Pre-Departure & Family Fitness Package (Infectious Screen, VDRL, HBsAg, HCV, HIV, X-Ray, LFT, KFT)",
      categoryBn: "প্রিভেন্টিভ ওয়েলনেস প্যাকেজ",
      regularPriceRangeBn: "৳৩,২০০ - ৳৪,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১২ - ২৪ ঘণ্টা",
    },

    // 2. Specialized Chronic & Lifestyle Packages
    {
      testNameBn: "কার্ডিয়াক প্রিভেন্টিভ স্ক্রিনিং প্যাকেজ (Cardiac Health & Heart Risk - ইকোকার্ডিওগ্রাফি, ইসিজি, লিপিড প্রোফাইল)",
      testNameEn: "Cardiac Preventive Health Package (2D Echo Color Doppler, 12-Lead ECG, Fasting Lipid Profile, Troponin/CK-MB)",
      categoryBn: "বিশেষায়িত স্ক্রিনিং প্যাকেজ",
      regularPriceRangeBn: "৳৩,৮০০ - ৳৫,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "ডায়াবেটিস কমপ্লিট কেয়ার ও অর্গান মনিটরিং (Diabetic Comprehensive Care - HbA1c, Microalbumin, KFT, LFT)",
      testNameEn: "Complete Diabetic Care & Organ Screening (FBS, 2h ABF, HbA1c, Fasting Lipid, Serum Creatinine, Urine ACR)",
      categoryBn: "বিশেষায়িত স্ক্রিনিং প্যাকেজ",
      regularPriceRangeBn: "৳২,৫০০ - ৳৩,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "সিনিয়র সিটিজেন / প্রবীণ স্বাস্থ্য চেকআপ (Senior Citizen Geriatric Package - ক্যালসিয়াম, ইউএসজি ও অর্গান ফাংশন)",
      testNameEn: "Senior Citizen Geriatric Package (CBC, LFT, KFT, Serum Calcium, Electrolytes, USG Whole Abdomen with PVR, ECG)",
      categoryBn: "বিশেষায়িত স্ক্রিনিং প্যাকেজ",
      regularPriceRangeBn: "৳৫,২০০ - ৳৮,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৬ - ৮ ঘণ্টা",
    },
    {
      testNameBn: "ওয়েল-উইমেন / নারী স্বাস্থ্য স্ক্রিনিং (Well-Woman Preventive Screening - থাইরয়েড TSH, ক্যালসিয়াম, পেলভিক ইউএসজি)",
      testNameEn: "Well-Woman Preventive Health Package (CBC, TSH, FT4, Fasting Glucose, Calcium, Pelvic USG, Clinical Breast Survey)",
      categoryBn: "বিশেষায়িত স্ক্রিনিং প্যাকেজ",
      regularPriceRangeBn: "৳৩,৮০০ - ৳৬,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৬ - ৮ ঘণ্টা",
    },

    // 3. Organ-Specific Diagnostic Profiles
    {
      testNameBn: "থাইরয়েড ও মেটাবলিক স্ক্রিনিং প্যানেল (Thyroid & Endocrine Profile - TSH, FT3, FT4, ক্যালসিয়াম, লিপিড)",
      testNameEn: "Thyroid & Endocrine Metabolic Profile (TSH, FT3, FT4, Fasting Blood Sugar, Serum Lipid Profile, Calcium)",
      categoryBn: "অর্গান ফাংশন প্রোফাইল",
      regularPriceRangeBn: "৳২,২০০ - ৳৩,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "রেনাল / কিডনি প্রিভেন্টিভ স্ক্রিনিং (Renal Function Profile - ক্রিয়েটিনিন, ইউরিয়া, ইউরিক এসিড, ইলেক্ট্রোলাইটস, ইউএসজি)",
      testNameEn: "Renal Function & Kidney Health Profile (Serum Creatinine, Urea, Uric Acid, Electrolytes, Urine R/M/E, USG KUB)",
      categoryBn: "অর্গান ফাংশন প্রোফাইল",
      regularPriceRangeBn: "৳২,২০০ - ৳৩,৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৫ ঘণ্টা",
    },
    {
      testNameBn: "লিভার ও হেপাটোবিলিয়ারি স্ক্রিনিং (Liver Function Profile - বিলিরুবিন, এসজিপিটি, এসজিওটি, এলকেলাইন ফসফেটেজ)",
      testNameEn: "Liver Function & Hepatic Screening (Total Bilirubin, SGPT, SGOT, Alk Phosphatase, Total Protein, A/G Ratio, USG HBS)",
      categoryBn: "অর্গান ফাংশন প্রোফাইল",
      regularPriceRangeBn: "৳২,০০০ - ৳৩,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "হোল অ্যাবডোমেন আল্ট্রাসাউন্ড ও অর্গান স্ক্রিনিং (USG of Whole Abdomen with PVR - লিভার, পিত্তথলি, কিডনি, প্রোস্টেট/জরায়ু)",
      testNameEn: "Whole Abdomen Organ Ultrasound with PVR (Liver, Gallbladder, Pancreas, Spleen, Kidneys, Bladder, Pelvis)",
      categoryBn: "ইমেজিং ও কার্ডিও স্ক্রিনিং",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "প্রিভেন্টিভ ডিজিটাল চেস্ট এক্স-রে ও ১২-লিড ইসিজি (Digital Chest X-Ray P/A View & 12-Lead Resting ECG)",
      testNameEn: "Digital Chest X-Ray P/A View & 12-Lead Resting Electrocardiogram (ECG with Cardiologist Interpretation)",
      categoryBn: "ইমেজিং ও কার্ডিও স্ক্রিনিং",
      regularPriceRangeBn: "৳৮০০ - ৳১,৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
  ],
};
