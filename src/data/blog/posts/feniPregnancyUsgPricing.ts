import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_PREGNANCY_USG_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে প্রেগন্যান্সি আল্ট্রাসোনোগ্রাফি, ৪ডি অ্যানোমালি ও কালার ডপলার টেস্টের বাজারদর ২০২৬",
  subtitleBn:
    "ফেনীর বেসরকারি ডায়াগনস্টিক সেন্টারে আর্লি প্রেগন্যান্সি, লেভেল-২ অ্যানোমালি স্ক্যান, ৪ডি লাইভ মোশন, ফিটাল কালার ডপলার ও টিভিএস টেস্টের সাধারণ ফি এবং হেলথ ক্লাব মেম্বারদের ১০-৩০% নিশ্চিত ছাড়।",
  titleEn: "Pregnancy Ultrasound, 4D Anomaly Scan & Color Doppler Price Guide in Feni (2026)",
  subtitleEn:
    "Market benchmark charges for Early Dating scans, Level-II Anomaly scans, 4D HD-Live USG, Fetal Doppler, and TVS in Feni Sadar with 10-30% Health Club member discounts.",
  tests: [
    // 1. First Trimester Scans
    {
      testNameBn: "আর্লি প্রেগন্যান্সি / ডেটিং আল্ট্রাসনোগ্রাম (Early Pregnancy / Dating Scan - ৬-১০ সপ্তাহ)",
      testNameEn: "Early Pregnancy / Dating Scan (6-10 Weeks - Gestational Sac & Viability)",
      categoryBn: "ফার্স্ট ট্রাইমিস্টার স্ক্যান",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা (জরুরি ক্ষেত্রে তাৎক্ষণিক)",
    },
    {
      testNameBn: "এনটি ও নেসাল বোন জেনেটিক স্ক্যান (NT & Nasal Bone Scan - ১১-১৩+৬ সপ্তাহ)",
      testNameEn: "Nuchal Translucency (NT) & Nasal Bone Genetic Scan (11-13+6 Weeks)",
      categoryBn: "ফার্স্ট ট্রাইমিস্টার স্ক্যান",
      regularPriceRangeBn: "৳১,৬০০ - ৳২,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "ট্রান্সভ্যাজাইনাল সনোগ্রাফি (TVS of Pregnancy - প্রাথমিক একটোপিক ও সারভিক্স পরিমাপ)",
      testNameEn: "Transvaginal Sonography of Pregnancy (TVS - Early Ectopic & Cervical Length)",
      categoryBn: "ফার্স্ট ট্রাইমিস্টার স্ক্যান",
      regularPriceRangeBn: "৳১,৫০০ - ৳২,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },

    // 2. Second Trimester Detailed Anomaly Scans
    {
      testNameBn: "৪ডি লাইভ মোশন ও এইচডি-লাইভ অ্যানোমালি স্ক্যান (4D Live Motion Anomaly Scan - ১৮-২২ সপ্তাহ)",
      testNameEn: "4D Live Motion & HD-Live Anomaly Scan (18-22 Weeks Golden Window)",
      categoryBn: "সেকেন্ড ট্রাইমিস্টার অ্যানোমালি স্ক্যান",
      regularPriceRangeBn: "৳৩,০০০ - ৳৪,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৪ ঘণ্টা (এইচডি কালার প্রিন্টসহ)",
    },
    {
      testNameBn: "স্ট্যান্ডার্ড ২ডি লেভেল-২ অ্যানোমালি স্ক্যান (Level-II Anomaly Scan - ১৮-২২ সপ্তাহ)",
      testNameEn: "Standard 2D Level-II Target Anomaly Scan (Detailed Anatomical Survey)",
      categoryBn: "সেকেন্ড ট্রাইমিস্টার অ্যানোমালি স্ক্যান",
      regularPriceRangeBn: "৳১,৮০০ - ৳২,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "ফিটাল ইকোকার্ডিওগ্রাফি (Fetal Echocardiography - ভ্রূণের হৃদযন্ত্রের বিস্তারিত গঠন)",
      testNameEn: "Fetal Echocardiography (Targeted 4-Chamber Heart & Great Vessels Evaluation)",
      categoryBn: "সেকেন্ড ট্রাইমিস্টার অ্যানোমালি স্ক্যান",
      regularPriceRangeBn: "৳৩,০০০ - ৳৪,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৫ ঘণ্টা",
    },

    // 3. Third Trimester Growth, BPP & Doppler
    {
      testNameBn: "গ্রোথ স্ক্যান ও বায়োফিজিক্যাল প্রোফাইল (Third Trimester Growth Scan & BPP - ২৮-৩৬ সপ্তাহ)",
      testNameEn: "Third Trimester Growth Scan & Biophysical Profile (BPP & AFI)",
      categoryBn: "থার্ড ট্রাইমিস্টার ও গ্রোথ মনিটরিং",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "ফিটাল কালার ডপলার স্টাডি (Fetal Color Doppler - আম্বিলিক্যাল ও সেরেব্রাল রক্তপ্রবাহ)",
      testNameEn: "Fetal Color Doppler Study (Umbilical & Middle Cerebral Artery Flow)",
      categoryBn: "থার্ড ট্রাইমিস্টার ও গ্রোথ মনিটরিং",
      regularPriceRangeBn: "৳২,৫০০ - ৳৩,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "টুইন / মাল্টিপল প্রেগন্যান্সি ডিটেইলড প্রোফাইল (Twin Pregnancy Detailed Monitoring)",
      testNameEn: "Twin / Multiple Pregnancy Detailed Profile (Growth Discordance & Amniotic Fluid)",
      categoryBn: "থার্ড ট্রাইমিস্টার ও গ্রোথ মনিটরিং",
      regularPriceRangeBn: "৳২,২০০ - ৳৩,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "টার্গেটেড ইন্টারভাল ফলো-আপ স্ক্যান (Targeted Follow-up USG - প্লাসেন্টা ও ওজন নিরীক্ষা)",
      testNameEn: "Targeted Interval Follow-up Scan (Placental Localization & Liquor Volume)",
      categoryBn: "থার্ড ট্রাইমিস্টার ও গ্রোথ মনিটরিং",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "হোল অ্যাবডোমেন উইথ প্রেগন্যান্সি প্রোফাইল (USG of Whole Abdomen with Pregnancy)",
      testNameEn: "Ultrasound of Whole Abdomen with Pregnancy Profile (Gallstone & Renal Check)",
      categoryBn: "বিশেষায়িত আল্ট্রাসনোগ্রাফি",
      regularPriceRangeBn: "৳১,৬০০ - ৳২,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
  ],
};
