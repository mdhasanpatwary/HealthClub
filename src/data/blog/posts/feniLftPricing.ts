import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_LFT_TEST_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে লিভার ফাংশন টেস্ট (LFT) ও হেপাটিক প্রোফাইলের খরচ ও মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার শীর্ষ অনুমোদিত ডায়াগনস্টিক সেন্টার ও প্যাথলজি ল্যাবে এসজিপিটি, এসজিওটি, বিলিরুবিন, অ্যালকালাইন ফসফেটেজ ও হেপাটাইটিস স্ক্রিনিংয়ের নিয়মিত বাজার ফি বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের তালিকা।",
  titleEn: "Liver Function Test (LFT, SGPT, Bilirubin) Price Guide in Feni (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar clinical chemistry and pathology laboratories.",
  tests: [
    // ১. কমপ্লিট লিভার ফাংশন টেস্ট ও এনজাইম প্যানেল
    {
      testNameBn: "কমপ্লিট লিভার ফাংশন টেস্ট (Complete LFT Profile - 8 Parameters)",
      testNameEn: "Complete Liver Function Test (SGPT, SGOT, Bilirubin Total/Direct, ALP, Total Protein, Albumin, Globulin, A/G Ratio)",
      categoryBn: "পূর্ণাঙ্গ লিভার প্রোফাইল",
      regularPriceRangeBn: "৳৮০০ - ৳১,৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা (একই দিন)",
    },
    {
      testNameBn: "এসজিপিটি / এএলটি (SGPT / ALT - Alanine Aminotransferase)",
      testNameEn: "Serum SGPT / ALT by Fully Automated UV-Kinetic IFCC Method",
      categoryBn: "হেপাটিক এনজাইম ও লিভার কোষ প্রদাহ",
      regularPriceRangeBn: "৳২০০ - ৳৩৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "এসজিওটি / এএসটি (SGOT / AST - Aspartate Aminotransferase)",
      testNameEn: "Serum SGOT / AST by Automated UV-Kinetic IFCC Method",
      categoryBn: "হেপাটিক ও সেলুলার এনজাইম",
      regularPriceRangeBn: "৳২০০ - ৳৩৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম বিলিরুবিন প্রোফাইল (Serum Bilirubin - Total, Direct & Indirect)",
      testNameEn: "Serum Bilirubin Total & Direct (Diazo Method) with Calculated Indirect",
      categoryBn: "জন্ডিস ও বিলিয়ারি নির্গমন",
      regularPriceRangeBn: "৳২৫০ - ৳৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },

    // ২. কোলেস্ট্যাসিস, প্রোটিন সংশ্লেষণ ও কোয়াগুলেশন টেস্ট
    {
      testNameBn: "সিরাম অ্যালকালাইন ফসফেটেজ (Serum Alkaline Phosphatase - ALP)",
      testNameEn: "Serum Alkaline Phosphatase (ALP) by Kinetic p-NPP Colorimetric Method",
      categoryBn: "পিত্তনালী ও হেপাটোবিলিয়ারি ব্লকেজ",
      regularPriceRangeBn: "৳২৫০ - ৳৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "গামা-গ্লুটামাইল ট্রান্সফারেজ (Serum Gamma-GT / GGT)",
      testNameEn: "Gamma-Glutamyl Transferase (GGT) by Automated Kinetic Assay",
      categoryBn: "বিলিয়ারি ট্র্যাক্ট ও অ্যালকোহলিক লিভার ইনজুরি",
      regularPriceRangeBn: "৳৩৫০ - ৳৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "টোটাল প্রোটিন, অ্যালবুমিন ও এ/জি রেশিও (Total Protein, Albumin & A/G Ratio)",
      testNameEn: "Serum Total Protein (Biuret) & Albumin (BCG) with A/G Ratio Calculation",
      categoryBn: "লিভারের সংশ্লেষণ ও পুষ্টি ক্ষমতা",
      regularPriceRangeBn: "৳৩০০ - ৳৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "প্রোথ্রম্বিন টাইম ও আইএনআর (Prothrombin Time with INR - PT/INR)",
      testNameEn: "Prothrombin Time (PT) and International Normalized Ratio (INR)",
      categoryBn: "লিভার রক্ত জমাট বাঁধার ফ্যাক্টর",
      regularPriceRangeBn: "৳৫০০ - ৳৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },

    // ৩. ভাইরাল হেপাটাইটিস স্ক্রিনিং ও ইমেজিং
    {
      testNameBn: "হেপাটাইটিস বি স্ক্রিনিং (HBsAg Screening - CLIA / Rapid Method)",
      testNameEn: "Hepatitis B Surface Antigen (HBsAg) Quantitative CLIA / Confirmatory ICT",
      categoryBn: "ভাইরাল হেপাটাইটিস স্ক্রিনিং",
      regularPriceRangeBn: "৳৩০০ - ৳৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "হেপাটাইটিস সি অ্যান্টিবডি স্ক্রিনিং (Anti-HCV Screening - CLIA / Rapid)",
      testNameEn: "Hepatitis C Virus Antibody (Anti-HCV) Chemiluminescent Immunoassay",
      categoryBn: "ভাইরাল হেপাটাইটিস স্ক্রিনিং",
      regularPriceRangeBn: "৳৪০০ - ৳৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "আল্ট্রাসোনোগ্রাম হোল অ্যাবডোমেন ও লিভার (USG of Whole Abdomen / HBS)",
      testNameEn: "Ultrasound of Whole Abdomen & Hepatobiliary System (Fatty Liver Grading)",
      categoryBn: "ফ্যাটি লিভার ও হেপাটোবিলিয়ারি ইমেজিং",
      regularPriceRangeBn: "৳৮০০ - ৳১,৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "কমপ্লিট জন্ডিস ও ফ্যাটি লিভার স্ক্রিনিং প্যানেল (Comprehensive Liver Care Package)",
      testNameEn: "Complete Liver Package: Full LFT (8 tests) + HBsAg + USG Whole Abdomen + CBC",
      categoryBn: "সমন্বিত লিভার ও জন্ডিস প্যাকেজ",
      regularPriceRangeBn: "৳২,২০০ - ৳৩,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৫ - ৬ ঘণ্টা (একই দিন)",
    },
  ],
};
