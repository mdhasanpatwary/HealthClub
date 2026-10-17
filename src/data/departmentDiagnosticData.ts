export interface DepartmentDiagnosticTestItem {
  slug: string;
  testNameBn: string;
  testNameEn: string;
  purposeBn: string;
  regularPriceRangeBn: string;
  memberDiscountBn: string;
  guideTitleBn: string;
  readTimeBn: string;
  badgeBn?: string;
}

export interface DepartmentDiagnosticOverview {
  departmentId: string;
  headlineBn: string;
  blufAnswerBn: string;
  tests: DepartmentDiagnosticTestItem[];
}

/**
 * Contextual diagnostic test pricing guides mapped to medical departments.
 * Strictly adheres to Health Club pricing rules:
 * - NO fixed discounted taka amounts
 * - Member benefits strictly display "১০-৩০% মেম্বার ছাড়"
 * - Realistic regular market price ranges for Feni Sadar private diagnostics
 */
export const DEPARTMENT_DIAGNOSTIC_GUIDES_MAP: Record<string, DepartmentDiagnosticOverview> = {
  orthopedics: {
    departmentId: "orthopedics",
    headlineBn: "অর্থোপেডিক ও হাড়-জোড়া চিকিৎসায় প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর",
    blufAnswerBn:
      "ফেনী সদরে হাড়ভাঙা, কোমর-মেরুদণ্ডের ব্যথা ও জয়েন্ট ইনজুরিতে অর্থোপেডিক চিকিৎসকরা সচরাচর ডিজিটাল এক্স-রে, ১.৫ টেসলা এমআরআই, সিটি স্ক্যান ও বিএমডি টেস্ট প্রেসক্রাইব করেন। হেলথ ক্লাব মেম্বার কার্ড দেখালে ফেনী সদরের অনুমোদিত পার্টনার ডায়াগনস্টিক সেন্টারে এসব পরীক্ষায় নিশ্চিত ১০-৩০% মেম্বার ছাড় পাওয়া যায়।",
    tests: [
      {
        slug: "feni-ct-scan-and-mri-test-price-guide",
        testNameBn: "১.৫ টেসলা এমআরআই ও সিটি স্ক্যান",
        testNameEn: "1.5T MRI & CT Scan (Spine & Joints)",
        purposeBn: "মেরুদণ্ডের পিএলআইডি ডিস্ক প্রোল্যাপ্স, স্নায়ু সংকোচন ও লিগামেন্ট টিয়ার নির্ণয়",
        regularPriceRangeBn: "৳৩,৫০০ - ৳৯,০০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "এমআরআই ও সিটি স্ক্যান খরচ গাইড",
        readTimeBn: "৮ মিনিট",
        badgeBn: "উন্নত ইমেজিং",
      },
      {
        slug: "feni-x-ray-digital-dr-cost-guide",
        testNameBn: "ডিজিটাল এক্স-রে (DR / CR)",
        testNameEn: "Digital X-Ray (Spine, Pelvis & Joints)",
        purposeBn: "হাড় ভাঙা, অস্থিসন্ধির বিচ্যুতি, সার্ভাইকাল ও লাম্বার স্পাইনের হাড়ের গঠন মূল্যায়ন",
        regularPriceRangeBn: "৳৫০০ - ৳১,৩০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "ডিজিটাল এক্স-রে খরচ গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "সর্বাধিক নির্দেশিত",
      },
      {
        slug: "feni-bone-mineral-density-bmd-test-guide",
        testNameBn: "বোন মিনারেল ডেনসিটি (BMD DEXA Scan)",
        testNameEn: "BMD DEXA Scan (Bone Density)",
        purposeBn: "হাড়ের ক্ষয়, অস্টিওপোরোসিস ঝুঁকি ও ক্যালসিয়াম ঘনত্বের টি-স্কোর নির্ণয়",
        regularPriceRangeBn: "৳২,০০০ - ৳৩,২০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "বিএমডি ডেক্সা স্ক্যান গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "হাড়ের ক্ষয় পরীক্ষা",
      },
      {
        slug: "feni-blood-test-cbc-cost-guide",
        testNameBn: "সিবিসি ও ইএসআর (CBC with ESR)",
        testNameEn: "CBC with ESR & Platelet Count",
        purposeBn: "হাড় বা জয়েন্টে ব্যাকটেরিয়াল ইনফেকশন, আর্থ্রাইটিস প্রদাহ ও রক্তশূন্যতা যাচাই",
        regularPriceRangeBn: "৳৩৫০ - ৳৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "সিবিসি ব্লাড টেস্ট গাইড",
        readTimeBn: "৫ মিনিট",
        badgeBn: "রুটিন ল্যাব",
      },
    ],
  },

  medicine: {
    departmentId: "medicine",
    headlineBn: "মেডিসিন ও ইন্টারনাল চিকিৎসায় প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর",
    blufAnswerBn:
      "ফেনীতে মেডিসিন বিশেষজ্ঞ চিকিৎসকের কাছে আসা রোগীদের গ্যাস্ট্রিক, দীর্ঘমেয়াদী পেটের জটিলতা, জন্ডিস, ডায়াবেটিস ও জ্বরে ভিডিও এন্ডোস্কোপি, হোল অ্যাবডোমেন আল্ট্রাসাউন্ড ও প্যাথলজি টেস্ট নির্দেশ করা হয়। হেলথ ক্লাব মেম্বাররা ফেনী সদরের পার্টনার ল্যাবগুলোতে প্রেসক্রিপশন টেস্টে ১০-৩০% মেম্বার ছাড় পান।",
    tests: [
      {
        slug: "feni-endoscopy-colonoscopy-test-cost-guide",
        testNameBn: "ভিডিও এন্ডোস্কোপি ও কোলনোস্কোপি",
        testNameEn: "Video Endoscopy & Colonoscopy",
        purposeBn: "পাকস্থলীর আলসার, রক্তক্ষরণ, দীর্ঘমেয়াদী এসিডিটি ও খাদ্যনালীর পর্যবেক্ষণ",
        regularPriceRangeBn: "৳২,২০০ - ৳৪,৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "এন্ডোস্কোপি টেস্ট খরচ গাইড",
        readTimeBn: "৮ মিনিট",
        badgeBn: "গ্যাস্ট্রোএন্টারোলজি",
      },
      {
        slug: "pregnancy-ultrasonography-4d-anomaly-scan-in-feni",
        testNameBn: "আল্ট্রাসনোগ্রাফি (USG of Whole Abdomen)",
        testNameEn: "USG of Whole Abdomen",
        purposeBn: "লিভারের ফ্যাটি পরিবর্তন, পিত্তথলির পাথর, প্লীহা ও কিডনির গঠনমূলক অবস্থা নির্ণয়",
        regularPriceRangeBn: "৳১,২০০ - ৳১,৬০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "আল্ট্রাসনোগ্রাফি টেস্ট গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "পেটের অঙ্গ পরীক্ষা",
      },
      {
        slug: "feni-blood-test-cbc-cost-guide",
        testNameBn: "সিবিসি রক্তের পরীক্ষা (CBC with ESR)",
        testNameEn: "CBC with 5-Part Differential & ESR",
        purposeBn: "জ্বর, ইনফেকশন, নিউট্রোফিল বৃদ্ধি, হিমোগ্লোবিনের মাত্রা ও রক্তশূন্যতা নিরূপণ",
        regularPriceRangeBn: "৳৩৫০ - ৳৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "সিবিসি ব্লাড টেস্ট গাইড",
        readTimeBn: "৫ মিনিট",
        badgeBn: "রুটিন ল্যাব",
      },
      {
        slug: "feni-liver-function-sgpt-test-guide",
        testNameBn: "লিভার ফাংশন টেস্ট (LFT - SGPT, SGOT, Bilirubin)",
        testNameEn: "Liver Function Test (LFT)",
        purposeBn: "জন্ডিস, ভাইরাল হেপাটাইটিস, ফ্যাটি লিভার ও লিভারের এনজাইম বৃদ্ধি পরীক্ষা",
        regularPriceRangeBn: "৳৭০০ - ৳১,২০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "লিভার ফাংশন টেস্ট গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "লিভার প্রোফাইল",
      },
    ],
  },

  cardiology: {
    departmentId: "cardiology",
    headlineBn: "কার্ডিওলজি ও হৃদরোগ চিকিৎসায় প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর",
    blufAnswerBn:
      "ফেনী জেলায় বুকে ব্যথা, উচ্চ রক্তচাপ ও হার্টের জটিলতায় ডিজিটাল ইসিজি, ২ডি কালার ডপলার ইকোকার্ডিওগ্রাম, লিপিড প্রোফাইল ও ট্রপোনিন-আই টেস্ট প্রধান পরীক্ষা। হেলথ ক্লাব মেম্বারশিপে ফেনী সদরের শীর্ষ কার্ডিয়াক ডায়াগনস্টিক সেন্টারে প্রতিটি পরীক্ষায় ১০-৩০% মেম্বার ছাড় কার্যকর থাকে।",
    tests: [
      {
        slug: "feni-cardiac-ecg-echo-ett-test-guide",
        testNameBn: "ডিজিটাল ১২-লিড ইসিজি ও ইটিটি",
        testNameEn: "Digital 12-Lead ECG & ETT",
        purposeBn: "বুকের ব্যথা, হার্টের রিদম ও অনিয়মিত স্পন্দন এবং কার্ডিয়াক ইস্কেমিয়া শনাক্তকরণ",
        regularPriceRangeBn: "৳৩০০ - ৳২,৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "ইসিজি ও ইটিটি টেস্ট গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "জরুরি কার্ডিয়াক",
      },
      {
        slug: "feni-echocardiogram-color-doppler-heart-test-guide",
        testNameBn: "কালার ডপলার ২ডি ইকোকার্ডিওগ্রাফি",
        testNameEn: "2D Echocardiogram with Color Doppler",
        purposeBn: "হার্টের ৪টি ভাল্বের কার্যক্ষমতা, দেয়ালের সংকোচন ও ইজেকশন ফ্র্যাকশন (EF) নির্ণয়",
        regularPriceRangeBn: "৳১,৫০০ - ৳২,২০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "কালার ডপলার ইকো গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "হার্ট ভাল্ব পরীক্ষা",
      },
      {
        slug: "feni-lipid-profile-cholesterol-test-guide",
        testNameBn: "লিপিড প্রোফাইল (রক্তে চর্বি ও কোলেস্টেরল)",
        testNameEn: "Fasting Lipid Profile (Cholesterol, TG, LDL)",
        purposeBn: "রক্তনালীতে চর্বি জমার ঝুঁকি, খারাপ কোলেস্টেরল (LDL) ও ট্রাইগ্লিসারাইড মাত্রা যাচাই",
        regularPriceRangeBn: "৳৮০০ - ৳১,২০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "লিপিড প্রোফাইল টেস্ট গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "কোলেস্টেরল ল্যাব",
      },
      {
        slug: "feni-stroke-cardiac-guide",
        testNameBn: "স্ট্রোক ও কার্ডিয়াক ইমার্জেন্সি কেয়ার",
        testNameEn: "Stroke & Cardiac Emergency Protocol",
        purposeBn: "হার্ট অ্যাটাক ও ব্রেন স্ট্রোকের গোল্ডেন আওয়ার আইসিইউ/সিসিইউ ও ল্যাব প্রটোকল",
        regularPriceRangeBn: "হাসপাতাল ভিত্তিক",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "স্ট্রোক ও হার্ট অ্যাটাক গাইড",
        readTimeBn: "৮ মিনিট",
        badgeBn: "জরুরি কেয়ার",
      },
    ],
  },

  gynecology: {
    departmentId: "gynecology",
    headlineBn: "গাইনি, প্রসূতি ও নারী স্বাস্থ্যসেবায় প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর",
    blufAnswerBn:
      "ফেনী সদরে গর্ভবতী মা ও নারীদের স্বাস্থ্য জটিলতায় প্রেগন্যান্সি আল্ট্রাসাউন্ড, ৪ডি অ্যানোমালি স্ক্যান, হরমোন প্যানেল ও প্যাপ স্মিয়ার টেস্ট প্রধান তদন্ত। হেলথ ক্লাব মেম্বাররা ফেনী সদরের পার্টনার হাসপাতাল ও মেটারনিটি ল্যাবে এসব প্রেসক্রিপশন টেস্টে নিশ্চিত ১০-৩০% মেম্বার ছাড় পান।",
    tests: [
      {
        slug: "pregnancy-ultrasonography-4d-anomaly-scan-in-feni",
        testNameBn: "প্রেগন্যান্সি আল্ট্রাসাউন্ড ও ৪ডি অ্যানোমালি স্ক্যান",
        testNameEn: "Pregnancy USG & 4D Anomaly Scan",
        purposeBn: "গর্ভস্থ শিশুর শারীরিক বৃদ্ধি, অঙ্গপ্রত্যঙ্গের গঠন ও জন্মগত ত্রুটি নিখুঁত পর্যবেক্ষণ",
        regularPriceRangeBn: "৳১,২০০ - ৳২,৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "প্রেগন্যান্সি ৪ডি আল্ট্রাসাউন্ড গাইড",
        readTimeBn: "৮ মিনিট",
        badgeBn: "গর্ভকালীন কেয়ার",
      },
      {
        slug: "feni-hormone-test-fertility-guide",
        testNameBn: "প্রজনন হরমোন ও ফার্টিলিটি প্রোফাইল",
        testNameEn: "Female Hormone Profile (FSH, LH, PRL, AMH)",
        purposeBn: "অনিয়মিত মাসিক, পলিসিস্টিক ওভারি (PCOS) ও বন্ধ্যাত্ব জটিলতার হরমোন স্তর যাচাই",
        regularPriceRangeBn: "৳১,২০০ - ৳৩,০০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "হরমোন ও ফার্টিলিটি টেস্ট গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "হরমোন বায়োকেমিস্ট্রি",
      },
      {
        slug: "feni-pap-smear-cervical-cancer-screening-guide",
        testNameBn: "প্যাপ স্মিয়ার ও এলবিসি টেস্ট",
        testNameEn: "Pap Smear & Liquid Based Cytology (LBC)",
        purposeBn: "জরায়ুমুখের ক্যানসার পূর্ববর্তী পরিবর্তন, প্রদাহ ও ইনফেকশন প্রাথমিক পর্যায়ে শনাক্তকরণ",
        regularPriceRangeBn: "৳৮০০ - ৳১,৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "প্যাপ স্মিয়ার স্ক্রিনিং গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "ক্যানসার স্ক্রিনিং",
      },
      {
        slug: "feni-blood-test-cbc-cost-guide",
        testNameBn: "সিবিসি ও রক্তের গ্রুপ (CBC & Grouping)",
        testNameEn: "CBC with Blood Group & Rh Typing",
        purposeBn: "গর্ভবতী মায়ের রক্তস্বল্পতা, ইনফেকশন ঝুঁকি ও ডেলিভারির পূর্ববর্তী রক্তের প্রস্তুতি",
        regularPriceRangeBn: "৳৩৫০ - ৳৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "সিবিসি ব্লাড টেস্ট গাইড",
        readTimeBn: "৫ মিনিট",
        badgeBn: "রুটিন স্ক্রিনিং",
      },
    ],
  },

  diabetes: {
    departmentId: "diabetes",
    headlineBn: "ডায়াবেটিস ও এন্ডোক্রিনোলজিতে প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর",
    blufAnswerBn:
      "ফেনী জেলায় রক্তে শর্করার মাত্রা ও ডায়াবেটিস ব্যবস্থাপনায় HbA1c, লিপিড প্রোফাইল, কিডনি স্ক্রিনিং ও থাইরয়েড টেস্ট অত্যন্ত গুরুত্বপূর্ণ। হেলথ ক্লাব মেম্বাররা নিয়মিত এসব ডায়াবেটিক ল্যাব পরীক্ষায় ফেনী সদরের পার্টনার ডায়াগনস্টিক সেন্টারে নিশ্চিত ১০-৩০% মেম্বার ছাড় পান।",
    tests: [
      {
        slug: "feni-hba1c-diabetes-test-guide",
        testNameBn: "HbA1c রক্তের সুগার টেস্ট",
        testNameEn: "HbA1c (Glycated Hemoglobin)",
        purposeBn: "বিগত ৩ মাসের গড় রক্তে শর্করার মাত্রা ও সুগার নিয়ন্ত্রণের সঠিক কার্যকারিতা পরীক্ষা",
        regularPriceRangeBn: "৳৬০০ - ৳৯০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "HbA1c ডায়াবেটিস টেস্ট গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "ডায়াবেটিস গোল্ড স্ট্যান্ডার্ড",
      },
      {
        slug: "feni-lipid-profile-cholesterol-test-guide",
        testNameBn: "ফাস্টিং লিপিড প্রোফাইল",
        testNameEn: "Fasting Lipid Profile",
        purposeBn: "ডায়াবেটিস রোগীদের রক্তে চর্বি বৃদ্ধি ও কার্ডিওভাসকুলার ঝুঁকির নিয়মিত পরিমাপ",
        regularPriceRangeBn: "৳৮০০ - ৳১,২০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "লিপিড প্রোফাইল টেস্ট গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "চর্বি পরীক্ষা",
      },
      {
        slug: "feni-thyroid-tsh-test-cost-guide",
        testNameBn: "থাইরয়েড হরমোন টেস্ট (TSH, FT4)",
        testNameEn: "Thyroid Profile (TSH & Free T4)",
        purposeBn: "হাইপোথাইরয়েডিজম, মেটাবলিজমের ধীরগতি ও হরমোনের তারতম্য নিরূপণ",
        regularPriceRangeBn: "৳৬০০ - ৳১,২০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "থাইরয়েড টেস্ট গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "হরমোন ল্যাব",
      },
      {
        slug: "feni-kidney-creatinine-urea-test-guide",
        testNameBn: "সিরাম ক্রিয়েটিনিন ও মাইক্রোএলবুমিন",
        testNameEn: "Serum Creatinine & Microalbumin",
        purposeBn: "ডায়াবেটিসজনিত কিডনির ছাঁকন ক্ষতি (ডায়াবেটিক নেফ্রোপ্যাথি) প্রাথমিক পর্যায়ে নির্ণয়",
        regularPriceRangeBn: "৳৩৫০ - ৳৮০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "কিডনি টেস্ট গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "কিডনি সুরক্ষা",
      },
    ],
  },

  nephrology: {
    departmentId: "nephrology",
    headlineBn: "কিডনি ও ইউরোলজিতে প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর",
    blufAnswerBn:
      "ফেনী সদরে কিডনির কার্যক্ষমতা যাচাই, ইউরিনারি ইনফেকশন ও পাথরের চিকিৎসায় সিরাম ক্রিয়েটিনিন, প্রস্রাব কালচার ও কেইউবি আল্ট্রাসাউন্ড প্রধান পরীক্ষা। হেলথ ক্লাব মেম্বাররা ফেনী সদরের পার্টনার সেন্টারে প্রতিটি টেস্টে ১০-৩০% নিশ্চিত মেম্বার ছাড় পান।",
    tests: [
      {
        slug: "feni-kidney-creatinine-urea-test-guide",
        testNameBn: "সিরাম ক্রিয়েটিনিন ও রক্তে ইউরিয়া (KFT)",
        testNameEn: "Serum Creatinine, Blood Urea & eGFR",
        purposeBn: "কিডনির রক্ত পরিশোধন ক্ষমতা ও ক্রনিক কিডনি ডিজিজ (CKD) স্টেজ মূল্যায়ন",
        regularPriceRangeBn: "৳৩৫০ - ৳৭০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "ক্রিয়েটিনিন ও কিডনি টেস্ট গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "রেনাল ফাংশন",
      },
      {
        slug: "feni-urine-re-culture-test-guide",
        testNameBn: "প্রস্রাব আর/ই ও কালচার সেনসিটিভিটি",
        testNameEn: "Urine Routine (R/E) & Culture Sensitivity (C/S)",
        purposeBn: "মূত্রনালীর ব্যাকটেরিয়াল ইনফেকশন (UTI), পুঁজ কোষ ও উপযুক্ত অ্যান্টিবায়োটিক নির্বাচন",
        regularPriceRangeBn: "৳৪০০ - ৳৮০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "প্রস্রাব ও কালচার টেস্ট গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "ইউটিআই পরীক্ষা",
      },
      {
        slug: "feni-semen-analysis-infertility-test-guide",
        testNameBn: "সিমেন অ্যানালাইসিস (শুক্রাণু পরীক্ষা)",
        testNameEn: "Semen Analysis (Count & Motility)",
        purposeBn: "পুরুষ প্রজনন স্বাস্থ্য, বীর্যে শুক্রাণুর সংখ্যা, সক্রিয়তা ও গঠনগত উর্বরতা পরীক্ষা",
        regularPriceRangeBn: "৳৫০০ - ৳৮০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "বীর্য পরীক্ষা ও ফার্টিলিটি গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "ফার্টিলিটি ল্যাব",
      },
      {
        slug: "feni-x-ray-digital-dr-cost-guide",
        testNameBn: "ডিজিটাল এক্স-রে কেইউবি (KUB)",
        testNameEn: "Digital X-Ray KUB (Kidney, Ureter, Bladder)",
        purposeBn: "কিডনি, মূত্রনালী ও মূত্রথলির ক্যালসিয়ামযুক্ত রেডিও-ওপেক পাথর শনাক্তকরণ",
        regularPriceRangeBn: "৳৬০০ - ৳৮৫০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "ডিজিটাল এক্স-রে খরচ গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "পাথর সনাক্তকরণ",
      },
    ],
  },

  surgery: {
    departmentId: "surgery",
    headlineBn: "জেনারেল ও ল্যাপারোস্কপিক সার্জারিতে প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর",
    blufAnswerBn:
      "ফেনী সদর ও ক্লিনিকে অপারেশন পূর্ববর্তী ফিটনেস, টিউমার ও পিত্তথলির পাথর নির্ণয়ে এফএনএসি বায়োপসি, আল্ট্রাসাউন্ড ও রক্ত পরীক্ষা আবশ্যক। হেলথ ক্লাব মেম্বাররা ফেনী সদরের পার্টনার ল্যাবগুলোতে প্রেসক্রিপশনের সকল পরীক্ষায় নিশ্চিত ১০-৩০% মেম্বার ছাড় পেয়ে থাকেন।",
    tests: [
      {
        slug: "feni-biopsy-fnac-tumor-test-guide",
        testNameBn: "এফএনএসি ও কোর বায়োপসি (FNAC & Biopsy)",
        testNameEn: "FNAC, Core Biopsy & Histopathology",
        purposeBn: "শরীরের যেকোনো স্থানের মাংসপিণ্ড, ফোলা গ্ল্যান্ড ও টিউমারের ক্যানসার কোষ পরীক্ষা",
        regularPriceRangeBn: "৳১,২০০ - ৳৩,০০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "এফএনএসি ও বায়োপসি টেস্ট গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "টিউমার বায়োপসি",
      },
      {
        slug: "feni-endoscopy-colonoscopy-test-cost-guide",
        testNameBn: "হাই-ডেফিনিশন এন্ডোস্কোপি ও কোলনোস্কোপি",
        testNameEn: "HD Video Endoscopy & Colonoscopy",
        purposeBn: "পিত্তথলি, হার্নিয়া ও খাদ্যনালীর জটিলতায় সার্জারির পূর্ববর্তী অভ্যন্তরীণ চিত্র",
        regularPriceRangeBn: "৳২,২০০ - ৳৪,৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "এন্ডোস্কোপি টেস্ট খরচ গাইড",
        readTimeBn: "৮ মিনিট",
        badgeBn: "সার্জিক্যাল ইমেজিং",
      },
      {
        slug: "pregnancy-ultrasonography-4d-anomaly-scan-in-feni",
        testNameBn: "ইউএসজি হোল অ্যাবডোমেন (USG of Abdomen)",
        testNameEn: "USG of Whole Abdomen for Gallstones & Hernia",
        purposeBn: "পিত্তথলির পাথর, অ্যাপেন্ডিসাইটিস প্রদাহ ও পেটের অন্যান্য অঙ্গের অপারেশন প্রস্তুতি",
        regularPriceRangeBn: "৳১,২০০ - ৳১,৬০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "আল্ট্রাসনোগ্রাফি টেস্ট গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "অ্যাবডোমেন ইউএসজি",
      },
      {
        slug: "feni-blood-test-cbc-cost-guide",
        testNameBn: "সার্জিক্যাল ফিটনেস রক্ত পরীক্ষা (CBC & Coagulation)",
        testNameEn: "CBC, Bleeding & Clotting Time (BT/CT)",
        purposeBn: "অ্যানেসথেসিয়া ও অপারেশনের সময় রক্তক্ষরণ প্রতিরোধ ও ইনফেকশন মূল্যায়ন",
        regularPriceRangeBn: "৳৪০০ - ৳৭০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "সিবিসি ব্লাড টেস্ট গাইড",
        readTimeBn: "৫ মিনিট",
        badgeBn: "ওটি ফিটনেস",
      },
    ],
  },

  dermatology: {
    departmentId: "dermatology",
    headlineBn: "চর্ম, এলার্জি ও যৌনরোগ চিকিৎসায় প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর",
    blufAnswerBn:
      "ফেনী জেলায় অ্যালার্জি, দীর্ঘস্থায়ী একজিমা, চুল পড়া ও স্কিন ইনফেকশনে সিরাম IgE, রক্তের সিবিসি ও স্কিন হিস্টোপ্যাথলজি টেস্ট নির্দেশ করা হয়। হেলথ ক্লাব মেম্বাররা ফেনী সদরের পার্টনার ডায়াগনস্টিক সেন্টারে এসব পরীক্ষায় ১০-৩০% মেম্বার ছাড় পান।",
    tests: [
      {
        slug: "feni-allergy-asthma-test-guide",
        testNameBn: "সিরাম টোটাল IgE ও অ্যালার্জি প্যানেল",
        testNameEn: "Serum Total IgE & Allergen Specific Panel",
        purposeBn: "চর্মরোগ, এলার্জিক রাইনাইটিস, আমবাত ও ডার্মাটাইটিসের মূল উৎস শনাক্তকরণ",
        regularPriceRangeBn: "৳১,২০০ - ৳২,৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "অ্যালার্জি ও অ্যাজমা টেস্ট গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "অ্যালার্জি প্যানেল",
      },
      {
        slug: "feni-blood-test-cbc-cost-guide",
        testNameBn: "সিবিসি ও পরম ইওসিনোফিল কাউন্ট (AEC)",
        testNameEn: "CBC with Absolute Eosinophil Count (AEC)",
        purposeBn: "রক্তে এলার্জিক তীব্রতা, সংক্রমণ মাত্রা ও ত্বকের প্রদাহের ব্যাপ্তি নিরূপণ",
        regularPriceRangeBn: "৳৩৫০ - ৳৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "সিবিসি ব্লাড টেস্ট গাইড",
        readTimeBn: "৫ মিনিট",
        badgeBn: "রক্তের এলার্জি",
      },
      {
        slug: "feni-biopsy-fnac-tumor-test-guide",
        testNameBn: "স্কিন পাঞ্চ বায়োপসি ও হিস্টোপ্যাথলজি",
        testNameEn: "Skin Punch Biopsy & Histopathology",
        purposeBn: "দীর্ঘমেয়াদী দুরারোগ্য চর্মরোগ, সোরিয়াসিস ও স্কিন টিউমারের নিখুঁত ডায়াগনসিস",
        regularPriceRangeBn: "৳১,৫০০ - ৳২,৮০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "বায়োপসি টেস্ট গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "ত্বক বায়োপসি",
      },
      {
        slug: "feni-hormone-test-fertility-guide",
        testNameBn: "হরমোন প্রোফাইল (Serum Testosterone / DHEA-S)",
        testNameEn: "Hormone Profile for Acne & Alopecia",
        purposeBn: "হরমোনের ভারসাম্যহীনতাজনিত তীব্র ব্রন ও অতিরিক্ত চুল পড়ার কারণ বিশ্লেষণ",
        regularPriceRangeBn: "৳১,২০০ - ৳২,৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "হরমোন টেস্ট গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "চুল ও ত্বক হরমোন",
      },
    ],
  },

  ent: {
    departmentId: "ent",
    headlineBn: "নাক, কান ও গলা (ENT) চিকিৎসায় প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর",
    blufAnswerBn:
      "ফেনী সদরে কানে কম শোনা, সাইনোসাইটিস ও টনসিলের সমস্যায় অডিওমেট্রি, ডিজিটাল পিএনএস এক্স-রে ও নেক গ্ল্যান্ড পরীক্ষা নির্দেশ করা হয়। হেলথ ক্লাব মেম্বাররা ফেনী সদরের অনুমোদিত পার্টনার সেন্টারে প্রতিটি টেস্টে নিশ্চিত ১০-৩০% মেম্বার ছাড় পান।",
    tests: [
      {
        slug: "feni-hearing-aid-audiometry-hearing-test-guide",
        testNameBn: "পিওর টোন অডিওমেট্রি (PTA Hearing Test)",
        testNameEn: "Pure Tone Audiometry (PTA) & Tympanometry",
        purposeBn: "কানের পর্দা ও অভ্যন্তরীণ স্নায়ুর শ্রবণক্ষমতা এবং বধিরতার মাত্রা নির্ধারণ",
        regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "শ্রবণ পরীক্ষা ও অডিওমেট্রি গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "শ্রবণ পরীক্ষা",
      },
      {
        slug: "feni-x-ray-digital-dr-cost-guide",
        testNameBn: "ডিজিটাল এক্স-রে পিএনএস (Digital PNS Water's View)",
        testNameEn: "Digital X-Ray PNS (Paranasal Sinuses)",
        purposeBn: "নাকের সাইনোসাইটিস ইনফেকশন, পলিপ ও নাকের হাড় বাঁকা (DNS) পর্যবেক্ষণ",
        regularPriceRangeBn: "৳৫০০ - ৳৭০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "ডিজিটাল এক্স-রে খরচ গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "সাইনাস এক্স-রে",
      },
      {
        slug: "feni-biopsy-fnac-tumor-test-guide",
        testNameBn: "গলার গ্ল্যান্ড এফএনএসি (Neck Lymph Node FNAC)",
        testNameEn: "Neck Lymph Node & Salivary Gland FNAC",
        purposeBn: "গলার ফুলে থাকা লিম্ফ নোড, থাইরয়েড নোডিউল ও লালাগ্রন্থির টিউমার পরীক্ষা",
        regularPriceRangeBn: "৳১,০০০ - ৳১,৮০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "এফএনএসি ও বায়োপসি গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "গলার গ্ল্যান্ড",
      },
      {
        slug: "feni-blood-test-cbc-cost-guide",
        testNameBn: "সিবিসি ও ইএসআর (CBC with ESR)",
        testNameEn: "CBC with ESR for Upper Respiratory Infections",
        purposeBn: "তীব্র টনসিলাইটিস, ফ্যারিনজাইটিস ও কানের ইনফেকশনে রক্তকোষের প্রদাহ মূল্যায়ন",
        regularPriceRangeBn: "৳৩৫০ - ৳৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "সিবিসি ব্লাড টেস্ট গাইড",
        readTimeBn: "৫ মিনিট",
        badgeBn: "ইনফেকশন মার্কার",
      },
    ],
  },

  neurology: {
    departmentId: "neurology",
    headlineBn: "নিউরোলজি ও মস্তিষ্কের চিকিৎসায় প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর",
    blufAnswerBn:
      "ফেনী সদরে ব্রেন স্ট্রোক, মৃগীরোগ, মাইগ্রেন ও নার্ভের ব্যথায় সিটি স্ক্যান, ১.৫ টেসলা এমআরআই ও ৩২-চ্যানেল ডিজিটাল ইইজি প্রধান তদন্ত। হেলথ ক্লাব মেম্বাররা ফেনী সদরের নিউরো ডায়াগনস্টিক সেন্টারে প্রতিটি পরীক্ষায় নিশ্চিত ১০-৩০% মেম্বার ছাড় পেয়ে থাকেন।",
    tests: [
      {
        slug: "feni-ct-scan-and-mri-test-price-guide",
        testNameBn: "ব্রেন সিটি স্ক্যান ও ১.৫ টেসলা এমআরআই",
        testNameEn: "Brain CT Scan & 1.5T MRI",
        purposeBn: "মস্তিষ্কে রক্তক্ষরণ, ইস্কেমিক স্ট্রোক, ব্রেন টিউমার ও তীব্র মাইগ্রেন নির্ণয়",
        regularPriceRangeBn: "৳৩,৫০০ - ৳৮,৫০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "সিটি স্ক্যান ও এমআরআই গাইড",
        readTimeBn: "৮ মিনিট",
        badgeBn: "নিউরো ইমেজিং",
      },
      {
        slug: "feni-eeg-brain-test-cost-guide",
        testNameBn: "৩২-চ্যানেল ডিজিটাল ইইজি (Digital EEG)",
        testNameEn: "32-Channel Digital EEG (Electroencephalogram)",
        purposeBn: "মৃগীরোগ (Epilepsy), খিঁচুনি, হঠাৎ অজ্ঞান হওয়া ও মস্তিষ্কের ইলেকট্রিক্যাল তরঙ্গ পরীক্ষা",
        regularPriceRangeBn: "৳১,৫০০ - ৳২,২০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "ডিজিটাল ইইজি ব্রেন টেস্ট গাইড",
        readTimeBn: "৭ মিনিট",
        badgeBn: "ব্রেন ওয়েভ টেস্ট",
      },
      {
        slug: "feni-lipid-profile-cholesterol-test-guide",
        testNameBn: "লিপিড প্রোফাইল ও রক্তে চর্বি পরীক্ষা",
        testNameEn: "Fasting Lipid Profile",
        purposeBn: "মস্তিষ্কের রক্তনালীতে চর্বি জমে স্ট্রোক ঝুঁকি তৈরি হওয়া প্রতিরোধে নিয়মিত স্ক্রিনিং",
        regularPriceRangeBn: "৳৮০০ - ৳১,২০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "লিপিড প্রোফাইল টেস্ট গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "স্ট্রোক রিস্ক",
      },
      {
        slug: "feni-kidney-creatinine-urea-test-guide",
        testNameBn: "সিরাম ইলেক্ট্রোলাইটস ও রেনাল প্রোফাইল",
        testNameEn: "Serum Electrolytes (Na, K, Cl) & Creatinine",
        purposeBn: "সোডিয়াম-পটাশিয়াম ভারসাম্যহীনতাজনিত মানসিক বিভ্রান্তি ও খিঁচুনি কারণ নির্ণয়",
        regularPriceRangeBn: "৳৮০০ - ৳১,২০০",
        memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
        guideTitleBn: "কিডনি ও ইলেক্ট্রোলাইটস গাইড",
        readTimeBn: "৬ মিনিট",
        badgeBn: "ইলেক্ট্রোলাইটস",
      },
    ],
  },
};

const DEFAULT_DIAGNOSTIC_OVERVIEW: DepartmentDiagnosticOverview = {
  departmentId: "general",
  headlineBn: "ফেনীতে প্রয়োজনীয় ডায়াগনস্টিক ও ল্যাব টেস্টের বাজারদর তালিকা",
  blufAnswerBn:
    "ফেনী সদরের বেসরকারি ডায়াগনস্টিক সেন্টারে যেকোনো বিশেষজ্ঞ চিকিৎসকের প্রেসক্রিপশন নিয়ে টেস্ট করাতে আসলে হেলথ ক্লাব ডিজিটাল মেম্বার কার্ড দেখালে প্রতিটি প্যাথলজি ও রেডিওলজি পরীক্ষায় নিশ্চিত ১০-৩০% মেম্বার ছাড় পাওয়া যায়।",
  tests: [
    {
      slug: "feni-medical-test-price-list",
      testNameBn: "ফেনী মেডিকেল টেস্ট ও ডায়াগনস্টিক মূল্যতালিকা",
      testNameEn: "Feni Medical Test Price List (80+ Tests)",
      purposeBn: "রক্ত, প্রস্রাব, হরমোন, এক্স-রে, ইউএসজি ও এমআরআই সহ ৮০টি টেস্টের তুলনামূলক বাজারদর",
      regularPriceRangeBn: "৳২০০ - ৳৯,০০০",
      memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
      guideTitleBn: "৮০+ টেস্টের পূর্ণাঙ্গ মূল্যতালিকা",
      readTimeBn: "১৮ মিনিট",
      badgeBn: "পূর্ণাঙ্গ মূল্যতালিকা",
    },
    {
      slug: "feni-blood-test-cbc-cost-guide",
      testNameBn: "সিবিসি রক্তের পরীক্ষা (CBC with ESR)",
      testNameEn: "Complete Blood Count (CBC with ESR)",
      purposeBn: "যেকোনো অসুস্থতা, ইনফেকশন ও রক্তস্বল্পতায় প্রধান বেসলাইন প্যাথলজি পরীক্ষা",
      regularPriceRangeBn: "৳৩৫০ - ৳৫০০",
      memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
      guideTitleBn: "সিবিসি টেস্ট খরচ গাইড",
      readTimeBn: "৫ মিনিট",
      badgeBn: "রুটিন প্যাথলজি",
    },
    {
      slug: "pregnancy-ultrasonography-4d-anomaly-scan-in-feni",
      testNameBn: "আল্ট্রাসনোগ্রাফি (USG of Whole Abdomen)",
      testNameEn: "USG of Whole Abdomen",
      purposeBn: "পেটের অভ্যন্তরীণ অঙ্গপ্রত্যঙ্গ, লিভার, গলব্লাডার ও কিডনির আল্ট্রাসাউন্ড চিত্র",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৬০০",
      memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
      guideTitleBn: "আল্ট্রাসনোগ্রাফি টেস্ট গাইড",
      readTimeBn: "৭ মিনিট",
      badgeBn: "আল্ট্রাসাউন্ড",
    },
    {
      slug: "feni-x-ray-digital-dr-cost-guide",
      testNameBn: "ডিজিটাল এক্স-রে (Digital DR / CR X-Ray)",
      testNameEn: "Digital X-Ray (Chest & Bone)",
      purposeBn: "বুকের ফুসফুস, হাড় ও জয়েন্টের ডিজিটাল ইমেজিং ও আঘাত নিরূপণ",
      regularPriceRangeBn: "৳৫০০ - ৳১,৩০০",
      memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
      guideTitleBn: "ডিজিটাল এক্স-রে খরচ গাইড",
      readTimeBn: "৬ মিনিট",
      badgeBn: "ডিজিটাল রেডিওলজি",
    },
  ],
};

/**
 * Returns contextual diagnostic overview and tests for a given department.
 */
export function getDepartmentDiagnosticData(departmentId?: string | null): DepartmentDiagnosticOverview {
  if (!departmentId) return DEFAULT_DIAGNOSTIC_OVERVIEW;
  const normalized = departmentId.trim().toLowerCase();

  // Aliases for related departments
  if (normalized === "nutrition") {
    return DEPARTMENT_DIAGNOSTIC_GUIDES_MAP.diabetes || DEFAULT_DIAGNOSTIC_OVERVIEW;
  }
  if (normalized === "hepatology") {
    return DEPARTMENT_DIAGNOSTIC_GUIDES_MAP.medicine || DEFAULT_DIAGNOSTIC_OVERVIEW;
  }
  if (normalized === "rheumatology") {
    return DEPARTMENT_DIAGNOSTIC_GUIDES_MAP.orthopedics || DEFAULT_DIAGNOSTIC_OVERVIEW;
  }
  if (normalized === "psychiatry") {
    return DEPARTMENT_DIAGNOSTIC_GUIDES_MAP.neurology || DEFAULT_DIAGNOSTIC_OVERVIEW;
  }
  if (normalized === "pediatrics") {
    return {
      departmentId: "pediatrics",
      headlineBn: "শিশু ও নবজাতক চিকিৎসায় প্রয়োজনীয় ডায়াগনস্টিক টেস্ট ও বাজারদর",
      blufAnswerBn:
        "ফেনীতে শিশুর তীব্র জ্বর, নিউমোনিয়া, রক্তশূন্যতা ও ইউটিআই নির্ণয়ে সিবিসি, ডিজিটাল চেস্ট এক্স-রে ও ইউরিন কালচার সচরাচর নির্দেশিত হয়। হেলথ ক্লাব মেম্বাররা ফেনী সদরের পার্টনার ল্যাবগুলোতে প্রতিটি পরীক্ষায় ১০-৩০% নিশ্চিত মেম্বার ছাড় পান।",
      tests: [
        {
          slug: "feni-blood-test-cbc-cost-guide",
          testNameBn: "সিবিসি ও পিবিএফ (CBC with PBF)",
          testNameEn: "CBC with Peripheral Blood Film",
          purposeBn: "শিশুর ইনফেকশন, নিউমোনিয়া জটিলতা, রক্তস্বল্পতা ও থ্যালাসেমিয়া স্ক্রিনিং",
          regularPriceRangeBn: "৳৪০০ - ৳৬০০",
          memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
          guideTitleBn: "সিবিসি রক্তের পরীক্ষা গাইড",
          readTimeBn: "৫ মিনিট",
          badgeBn: "শিশু প্যাথলজি",
        },
        {
          slug: "feni-urine-re-culture-test-guide",
          testNameBn: "প্রস্রাব আর/ই ও কালচার সেনসিটিভিটি",
          testNameEn: "Pediatric Urine R/E & Culture",
          purposeBn: "শিশুর বারবার জ্বর, প্রস্রাবে ব্যথা ও মূত্রনালীর ইনফেকশন (UTI) শনাক্তকরণ",
          regularPriceRangeBn: "৳৪০০ - ৳৮০০",
          memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
          guideTitleBn: "প্রস্রাব কালচার টেস্ট গাইড",
          readTimeBn: "৬ মিনিট",
          badgeBn: "ইউরিন পরীক্ষা",
        },
        {
          slug: "feni-x-ray-digital-dr-cost-guide",
          testNameBn: "ডিজিটাল চেস্ট এক্স-রে (Chest X-Ray Pediatric)",
          testNameEn: "Digital Chest X-Ray Pediatric View",
          purposeBn: "শিশুর নিউমোনিয়া, তীব্র ব্রঙ্কিওলাইটিস ও ফুসফুসে কফ জমার পরিমাপ",
          regularPriceRangeBn: "৳৫০০ - ৳৭০০",
          memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
          guideTitleBn: "ডিজিটাল এক্স-রে গাইড",
          readTimeBn: "৬ মিনিট",
          badgeBn: "চেস্ট রেডিওলজি",
        },
        {
          slug: "feni-medical-test-price-list",
          testNameBn: "ফেনী মেডিকেল টেস্ট ও ডায়াগনস্টিক মূল্যতালিকা",
          testNameEn: "Feni Medical Test Price List (80+ Tests)",
          purposeBn: "শিশুদের সার্বিক ল্যাব ও ডায়াগনস্টিক পরীক্ষার সমন্বিত রেট ও মেম্বার ছাড়",
          regularPriceRangeBn: "৳২০০ - ৳৯,০০০",
          memberDiscountBn: "১০-৩০% মেম্বার ছাড়",
          guideTitleBn: "৮০+ টেস্টের পূর্ণাঙ্গ মূল্যতালিকা",
          readTimeBn: "১৮ মিনিট",
          badgeBn: "সম্পূর্ণ রেট",
        },
      ],
    };
  }

  return DEPARTMENT_DIAGNOSTIC_GUIDES_MAP[normalized] || DEFAULT_DIAGNOSTIC_OVERVIEW;
}
