import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_PAP_SMEAR_TEST_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে প্যাপ স্মিয়ার ও জরায়ুমুখের ক্যান্সার স্ক্রিনিং পরীক্ষার খরচ ও মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার অনুমোদিত ডায়াগনস্টিক সেন্টারে কনভেনশনাল প্যাপ স্মিয়ার, লিকুইড-বেসড সাইটোলজি (LBC), এইচপিভি ডিএনএ এবং ভিআইএ স্ক্রিনিং টেস্টের নিয়মিত ফি বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের তালিকা।",
  titleEn: "Pap Smear & Cervical Cancer Screening Test Price Guide in Feni (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar gynecology and pathology diagnostic centers.",
  tests: [
    {
      testNameBn: "কনভেনশনাল প্যাপ স্মিয়ার সাইটোলজি (Conventional Pap Smear Cytology)",
      testNameEn: "Conventional Pap Smear Cytopathology (Ayre Spatula & Cytobrush Cervical Smear)",
      categoryBn: "সাইটোপ্যাথলজি স্ক্রিনিং",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ - ৪৮ ঘণ্টা",
    },
    {
      testNameBn: "লিকুইড-বেসড সাইটোলজি (LBC / ThinPrep Pap Smear)",
      testNameEn: "Liquid-Based Cytology (LBC / ThinPrep Automated Cervical Screening)",
      categoryBn: "উচ্চতর অটোমেটেড সাইটোলজি",
      regularPriceRangeBn: "৳১,৫০০ - ৳২,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ দিন",
    },
    {
      testNameBn: "হাই-রিক্স এইচপিভি ডিএনএ পিসিআর (High-Risk HPV DNA PCR / Genotyping)",
      testNameEn: "High-Risk HPV DNA Real-Time PCR (Genotypes 16, 18 and high-risk panel)",
      categoryBn: "মলিকিউলার ও ভাইরাল ডিএনএ",
      regularPriceRangeBn: "৳২,৫০০ - ৳৪,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৫ দিন",
    },
    {
      testNameBn: "প্যাপ স্মিয়ার + এইচপিভি ডিএনএ কো-টেস্টিং প্যাকেজ (Co-Testing Bundle)",
      testNameEn: "Cervical Co-Testing Combined Profile (LBC Pap Smear + High-Risk HPV DNA)",
      categoryBn: "সমন্বিত কম্বো স্ক্রিনিং",
      regularPriceRangeBn: "৳৩,২০০ - ৳৫,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৫ দিন",
    },
    {
      testNameBn: "ভিআইএ স্ক্রিনিং টেস্ট (VIA Test - Visual Inspection with Acetic Acid)",
      testNameEn: "VIA Screening Test (Visual Inspection with 3-5% Acetic Acid / Sadar Hospital & Private)",
      categoryBn: "ক্লিনিক্যাল প্রাথমিক স্ক্রিনিং",
      regularPriceRangeBn: "৳০ - ৳৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "তাৎক্ষণিক (১৫ মিনিট)",
    },
    {
      testNameBn: "ভিডিও কলপোস্কোপি পরীক্ষা (Video Colposcopy with Acetic Acid & Schiller's Iodine)",
      testNameEn: "Digital Video Colposcopy Examination (Magnified Cervical & Vaginal Visual Evaluation)",
      categoryBn: "বিশেষায়িত গাইনি প্রসিডিউর",
      regularPriceRangeBn: "৳১,৫০০ - ৳২,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "তাৎক্ষণিক রিপোর্ট",
    },
    {
      testNameBn: "সার্ভাইকাল পাঞ্চ বায়োপ্সি ও হিস্টোপ্যাথলজি (Cervical Punch Biopsy & Histopathology)",
      testNameEn: "Colposcopy-Directed Cervical Punch Biopsy with Tissue Histopathology",
      categoryBn: "টিস্যু হিস্টোপ্যাথলজি",
      regularPriceRangeBn: "৳১,৮০০ - ৳৩,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৭ দিন",
    },
    {
      testNameBn: "এন্ডোসার্ভাইকাল কিউরেটেজ (Endocervical Curettage - ECC Tissue Analysis)",
      testNameEn: "Endocervical Curettage (ECC) with Microscopic Pathological Evaluation",
      categoryBn: "টিস্যু হিস্টোপ্যাথলজি",
      regularPriceRangeBn: "৳২,০০০ - ৳৩,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৫ - ৭ দিন",
    },
    {
      testNameBn: "ট্রান্সভ্যাজাইনাল আল্ট্রাসাউন্ড (TVS Ultrasound - Uterus & Adnexa Evaluation)",
      testNameEn: "Transvaginal Sonography (TVS) for Endometrial Thickness & Cervical Architecture",
      categoryBn: "পেলভিক সনোগ্রাফি",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "গাইনি বিশেষজ্ঞ স্পেকুলাম ও পেলভিক ক্লিনিক্যাল এক্সামিনেশন",
      testNameEn: "Clinical Pelvic & Cusco Speculum Examination by Specialist Gynecologist",
      categoryBn: "ক্লিনিক্যাল কনসালটেশন",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "তাৎক্ষণিক",
    },
    {
      testNameBn: "ভ্যাজাইনাল ডিসচার্জ স্মিয়ার ও গ্রাম স্টেন (Vaginal Discharge Gram Stain / Wet Mount)",
      testNameEn: "High Vaginal Swab (HVS) Gram Stain & Wet Mount (Bacterial Vaginosis, Candida, Trichomonas)",
      categoryBn: "মাইক্রোবায়োলজি স্মিয়ার",
      regularPriceRangeBn: "৳৩৫০ - ৳৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "কমপ্লিট ওয়েল-ওমেন সার্ভাইকাল হেলথ চেকআপ প্যাকেজ (Pap + TVS + CBC + Urine)",
      testNameEn: "Comprehensive Well-Woman Cervical Screening Package (Pap Smear, TVS USG, CBC, Urine R/E)",
      categoryBn: "প্রিভেন্টিভ স্ক্রিনিং প্যাকেজ",
      regularPriceRangeBn: "৳২,৮০০ - ৳৪,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ - ৪৮ ঘণ্টা",
    },
  ],
};
