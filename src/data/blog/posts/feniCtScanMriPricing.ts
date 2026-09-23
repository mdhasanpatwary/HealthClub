import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_CT_SCAN_MRI_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে ১২৮-স্লাইস সিটি স্ক্যান ও ১.৫ টেসলা এমআরআই টেস্টের সাধারণ বাজারদর ২০২৬",
  subtitleBn:
    "ফেনীর বেসরকারি ডায়াগনস্টিক ও হাসপাতালসমূহে ব্রেন, স্পাইন, চেস্ট এইচআরসিটি, হোল অ্যাবডোমেন ও জয়েন্ট ইমেজিংয়ের সাধারণ রেট এবং হেলথ ক্লাব মেম্বারদের ১০-৩০% নিশ্চিত ছাড়।",
  titleEn: "Feni 128-Slice CT Scan & 1.5T MRI Test Cost Guide (2026)",
  subtitleEn:
    "Market benchmark prices for Brain, Spine, Chest HRCT, Whole Abdomen, and Musculoskeletal MRI/CT scans in Feni Sadar with 10-30% Health Club member discounts.",
  tests: [
    // 128-Slice Multi-Detector CT Scans
    {
      testNameBn: "১২৮-স্লাইস ব্রেন সিটি স্ক্যান প্লেইন (128-Slice CT Scan of Brain Plain - স্ট্রোক ও হেড ট্রমা)",
      testNameEn: "128-Slice CT Scan of Brain (Plain - Acute Stroke & Trauma)",
      categoryBn: "১২৮-স্লাইস সিটি স্ক্যান",
      regularPriceRangeBn: "৳৪,০০০ - ৳৫,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৪ ঘণ্টা (জরুরি ট্রমা ৩০ মিনিট)",
    },
    {
      testNameBn: "ব্রেন সিটি স্ক্যান উইথ কনট্রাস্ট (CT Scan of Brain with IV Contrast - টিউমার ও ভাস্কুলার লেশন)",
      testNameEn: "CT Scan of Brain with IV Contrast (Contrast-Enhanced CE-CT)",
      categoryBn: "১২৮-স্লাইস সিটি স্ক্যান",
      regularPriceRangeBn: "৳৫,৫০০ - ৳৭,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "এইচআরসিটি চেস্ট / ফুসফুস (HRCT of Chest / Lungs - হাই-রেজোলিউশন ফুসফুস ও নিউমোনিয়া)",
      testNameEn: "High-Resolution CT of Chest / Lungs (HRCT Chest)",
      categoryBn: "১২৮-স্লাইস সিটি স্ক্যান",
      regularPriceRangeBn: "৳৫,৫০০ - ৳৭,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "হোল অ্যাবডোমেন ট্রিপল ফেজ সিটি স্ক্যান (CT Whole Abdomen Dynamic Triple Phase - লিভার ও প্যানক্রিয়াস)",
      testNameEn: "CT Whole Abdomen Dynamic Triple Phase (Contrast Enhanced)",
      categoryBn: "১২৮-স্লাইস সিটি স্ক্যান",
      regularPriceRangeBn: "৳৮,৫০০ - ৳১১,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১২ - ২৪ ঘণ্টা",
    },
    {
      testNameBn: "নন-কনট্রাস্ট সিটি কেইউবি / সিটি ইউরোগ্রাম (NCCT KUB - কিডনি ও ইউরেটার ৩ডি পাথর নির্ণয়)",
      testNameEn: "Non-Contrast CT KUB / Urogram (Stone Localization & HU Density)",
      categoryBn: "১২৮-স্লাইস সিটি স্ক্যান",
      regularPriceRangeBn: "৳৫,০০০ - ৳৬,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "সিটি স্ক্যান - সার্ভাইকাল / লাম্বার স্পাইন (CT Scan of Cervical or Lumbar Spine - হাড়ের ফ্র্যাকচার)",
      testNameEn: "CT Scan of Cervical / Lumbar Spine (Bone Architecture & Trauma)",
      categoryBn: "১২৮-স্লাইস সিটি স্ক্যান",
      regularPriceRangeBn: "৳৪,৫০০ - ৳৬,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "সিটি স্ক্যান - পিএনএস সাইনাস (CT Scan of Paranasal Sinuses - PNS Coronal & Axial View)",
      testNameEn: "CT Scan of PNS (Paranasal Sinuses Coronal & Axial)",
      categoryBn: "১২৮-স্লাইস সিটি স্ক্যান",
      regularPriceRangeBn: "৳৪,০০০ - ৳৫,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৫ ঘণ্টা",
    },
    {
      testNameBn: "সিটি এনজিওগ্রাম - ব্রেন ও ক্যারোটিড ভেসেল (CT Angiogram Brain & Carotid - এনুরিজম ও আর্টারি ব্লকেজ)",
      testNameEn: "CT Angiography of Brain & Carotid Arteries (Aneurysm & Stenosis)",
      categoryBn: "ভাস্কুলার ও বিশেষায়িত ইমেজিং",
      regularPriceRangeBn: "৳৯,০০০ - ৳১২,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১২ - ২৪ ঘণ্টা",
    },

    // 1.5 Tesla Superconducting MRI Scans
    {
      testNameBn: "১.৫ টেসলা এমআরআই - ব্রেইন প্লেইন (1.5T MRI of Brain Plain - স্ট্রোক, মাইগ্রেন ও এপিলেপ্সি)",
      testNameEn: "1.5 Tesla Superconducting MRI of Brain (Plain Protocol)",
      categoryBn: "১.৫ টেসলা এমআরআই",
      regularPriceRangeBn: "৳৭,৫০০ - ৳৯,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১২ - ২৪ ঘণ্টা",
    },
    {
      testNameBn: "১.৫ টেসলা ব্রেন এমআরআই উইথ গ্যাডোলিনিয়াম কনট্রাস্ট (1.5T MRI of Brain with IV Contrast)",
      testNameEn: "1.5 Tesla MRI of Brain with IV Gadolinium Contrast",
      categoryBn: "১.৫ টেসলা এমআরআই",
      regularPriceRangeBn: "৳৯,৫০০ - ৳১২,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা",
    },
    {
      testNameBn: "১.৫ টেসলা এমআরআই - লাম্বার স্পাইন (1.5T MRI of Lumbar Spine - L/S PLID, ডিস্ক প্রোল্যাপ্স ও সায়াটিকা)",
      testNameEn: "1.5 Tesla MRI of Lumbar-Sacral Spine (L/S Spine PLID & Sciatica)",
      categoryBn: "১.৫ টেসলা এমআরআই",
      regularPriceRangeBn: "৳৭,৫০০ - ৳৯,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১২ - ২৪ ঘণ্টা",
    },
    {
      testNameBn: "১.৫ টেসলা এমআরআই - সার্ভাইকাল স্পাইন (1.5T MRI of Cervical Spine - ঘাড় ব্যথা ও নার্ভ রুট কম্প্রেশন)",
      testNameEn: "1.5 Tesla MRI of Cervical Spine (C-Spine Spondylosis & Radiculopathy)",
      categoryBn: "১.৫ টেসলা এমআরআই",
      regularPriceRangeBn: "৳৭,৫০০ - ৳৯,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১২ - ২৪ ঘণ্টা",
    },
    {
      testNameBn: "১.৫ টেসলা এমআরআই - হাঁটু বা কাঁধ জয়েন্ট (1.5T MRI of Knee / Shoulder - এসিএল ও মেনিসকাস ইনজুরি)",
      testNameEn: "1.5 Tesla MRI of Knee or Shoulder Joint (Ligament, Tendon & Meniscus Tear)",
      categoryBn: "১.৫ টেসলা এমআরআই",
      regularPriceRangeBn: "৳৮,০০০ - ৳১০,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা",
    },
    {
      testNameBn: "১.৫ টেসলা এমআরসিপি (1.5T MRCP - পিত্তনালী, গলব্লাডার ও অগ্ন্যাশয় ম্যাগনেটিক রেজোন্যান্স)",
      testNameEn: "1.5 Tesla MRCP (Magnetic Resonance Cholangiopancreatography)",
      categoryBn: "১.৫ টেসলা এমআরআই",
      regularPriceRangeBn: "৳৯,০০০ - ৳১১,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ ঘণ্টা",
    },
    {
      testNameBn: "১.৫ টেসলা সম্পূর্ণ স্পাইন স্ক্রিনিং (1.5T Whole Spine MRI Screening - সার্ভাইকাল, ডরসাল ও লাম্বার)",
      testNameEn: "1.5 Tesla Whole Spine MRI Screening (Cervical, Dorsal & Lumbar)",
      categoryBn: "১.৫ টেসলা এমআরআই",
      regularPriceRangeBn: "৳১২,০০০ - ৳১৬,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ - ৩৬ ঘণ্টা",
    },

    // Pre-Contrast Safety Evaluation Panel
    {
      testNameBn: "কনট্রাস্ট পূর্ববর্তী কিডনি নিরাপত্তা পরীক্ষা (Serum Creatinine & eGFR Clearance Panel)",
      testNameEn: "Pre-Contrast Renal Safety Evaluation (Serum Creatinine & eGFR)",
      categoryBn: "কনট্রাস্ট পূর্ববর্তী নিরাপত্তা পরীক্ষা",
      regularPriceRangeBn: "৳৪০০ - ৳৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টার মধ্যে দ্রুত রিপোর্ট",
    },
  ],
};
