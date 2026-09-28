import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_THYROID_TEST_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে থাইরয়েড টেস্ট ও হরমোন পরীক্ষার খরচ ও মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার শীর্ষ অনুমোদিত ডায়াগনস্টিক সেন্টার ও প্যাথলজি ল্যাবে টিএসএইচ, ফ্রি টি৪, ফ্রি টি৩ ও অ্যান্টিবডি ল্যাব টেস্টের নিয়মিত ফি বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের তালিকা।",
  titleEn: "Thyroid Hormone Test (TSH, FT3, FT4) Price Guide in Feni (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar hormone and clinical chemistry laboratories.",
  tests: [
    // ১. থাইরয়েড বেসিক ও ফুল হরমোন প্রোফাইল
    {
      testNameBn: "সিরাম টিএসএইচ (Serum TSH - Thyroid Stimulating Hormone)",
      testNameEn: "Serum TSH by 3rd Generation Chemiluminescence Immunoassay (CLIA)",
      categoryBn: "বেসিক থাইরয়েড স্ক্রিনিং",
      regularPriceRangeBn: "৳৪০০ - ৳৬৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা (একই দিন)",
    },
    {
      testNameBn: "ফ্রি টি৪ - ফ্রি থাইরক্সিন (Free T4 / FT4 Direct Assay)",
      testNameEn: "Free Thyroxine (FT4) Quantitative Chemiluminescent Microparticle Assay",
      categoryBn: "সক্রিয় হরমোন ফ্র্যাকশন",
      regularPriceRangeBn: "৳৫০০ - ৳৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "ফ্রি টি৩ - ফ্রি ট্রাইআয়োডোথাইরোনিন (Free T3 / FT3 Direct Assay)",
      testNameEn: "Free Triiodothyronine (FT3) Chemiluminescent Quantitative Immunoassay",
      categoryBn: "সক্রিয় হরমোন ফ্র্যাকশন",
      regularPriceRangeBn: "৳৫০০ - ৳৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "কমপ্লিট থাইরয়েড হরমোন প্যানেল (TSH + FT3 + FT4 Combo)",
      testNameEn: "Complete Thyroid Profile Combo (TSH + Free T3 + Free T4 Panel)",
      categoryBn: "পূর্ণাঙ্গ থাইরয়েড প্রোফাইল",
      regularPriceRangeBn: "৳১,২০০ - ৳২,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৫ ঘণ্টা (একই দিন)",
    },
    {
      testNameBn: "টোটাল টি৩ (Serum Total T3 - Triiodothyronine)",
      testNameEn: "Total Triiodothyronine (Total T3) Automated Quantitative Assay",
      categoryBn: "টোটাল হরমোন পরিমাপ",
      regularPriceRangeBn: "৳৪০০ - ৳৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "টোটাল টি৪ (Serum Total T4 - Thyroxine)",
      testNameEn: "Total Thyroxine (Total T4) Automated Quantitative Immunoassay",
      categoryBn: "টোটাল হরমোন পরিমাপ",
      regularPriceRangeBn: "৳৪০০ - ৳৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "গর্ভকালীন থাইরয়েড মনিটরিং কম্বো (Maternal Thyroid - TSH + FT4)",
      testNameEn: "Antenatal / Maternal Thyroid Panel (High-Sensitivity TSH + FT4)",
      categoryBn: "গর্ভকালীন বিশেষ স্ক্রিনিং",
      regularPriceRangeBn: "৳৯০০ - ৳১,৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },

    // ২. অটোইমিউন থাইরয়েড ও বিশেষায়িত অ্যান্টিবডি টেস্ট
    {
      testNameBn: "অ্যান্টি-টিপিও অ্যান্টিবডি (Anti-TPO / Thyroid Peroxidase Antibody)",
      testNameEn: "Anti-Thyroid Peroxidase Antibody (Hashimoto's Autoimmune Screening)",
      categoryBn: "অটোইমিউন থাইরয়েডাইটিস",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা (স্পেশালাইজড)",
    },
    {
      testNameBn: "অ্যান্টি-থাইরোগ্লোবুলিন অ্যান্টিবডি (Anti-TG / Anti-Thyroglobulin)",
      testNameEn: "Anti-Thyroglobulin Antibody Quantitative Chemiluminescence Assay",
      categoryBn: "অটোইমিউন অ্যান্টিবডি",
      regularPriceRangeBn: "৳১,৩০০ - ৳১,৯০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম থাইরোগ্লোবুলিন (Serum Thyroglobulin / TG Level)",
      testNameEn: "Serum Thyroglobulin (TG) Quantitative Tumor & Remnant Marker",
      categoryBn: "থাইরয়েড টিউমার মার্কার",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৭০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ - ৪৮ ঘণ্টা",
    },

    // ৩. থাইরয়েড ইমেজিং ও সাইটোপ্যাথলজি ইনভেস্টিগেশন
    {
      testNameBn: "থাইরয়েড গ্ল্যান্ড আল্ট্রাসনোগ্রাফি (USG of Thyroid with Color Doppler)",
      testNameEn: "High-Resolution Thyroid Ultrasound with Color Doppler Vascularity",
      categoryBn: "থাইরয়েড সোনোগ্রাফি",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "থাইরয়েড নডিউল এফএনএসি (USG-Guided FNAC of Thyroid Nodule)",
      testNameEn: "Ultrasound-Guided Fine Needle Aspiration Cytology (FNAC) with Cytopathology",
      categoryBn: "সাইটোপ্যাথলজি বায়োপ্সি",
      regularPriceRangeBn: "৳১,৫০০ - ৳২,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ - ৪৮ ঘণ্টা",
    },
  ],
};
