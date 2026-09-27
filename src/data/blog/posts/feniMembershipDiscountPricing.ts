import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_MEMBERSHIP_DISCOUNT_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে হেলথ ক্লাব মেম্বারশিপ কার্ডে সেবাসমূহ ও ১০-৩০% মেম্বার ছাড়ের তালিকা ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার অনুমোদিত পার্টনার হাসপাতাল, ডায়াগনস্টিক ল্যাব ও চিকিৎসাকেন্দ্রে নিয়মিত বাজারদর বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের বিবরণ।",
  titleEn: "Feni Health Club Membership Services & 10-30% Discount Price Guide (2026)",
  subtitleEn:
    "Comparative overview of regular diagnostic and hospital charges in Feni Sadar alongside 10-30% verified Health Club member discounts.",
  tests: [
    // ১. প্যাথলজি ও রুটিন রক্ত পরীক্ষা
    {
      testNameBn: "সিবিসি ও ইএসআর রক্ত পরীক্ষা (CBC with ESR - Complete Blood Count)",
      testNameEn: "Complete Blood Count with ESR (CBC with ESR)",
      categoryBn: "প্যাথলজি ও রক্ত পরীক্ষা",
      regularPriceRangeBn: "৳৩৫০ - ৳৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "ফাস্টিং ব্লাড সুগার ও ২ ঘণ্টা পর গ্লুকোজ (FBS & 2h ABF / Glucose)",
      testNameEn: "Fasting Blood Sugar & 2-Hour Postprandial Glucose (FBS & 2h ABF)",
      categoryBn: "প্যাথলজি ও রক্ত পরীক্ষা",
      regularPriceRangeBn: "৳২০০ - ৳৩৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "এইচবিএ১সি ডায়াবেটিস নিয়ন্ত্রণ পরীক্ষা (HbA1c - Glycated Hemoglobin)",
      testNameEn: "HbA1c Glycated Hemoglobin Test (3-Month Diabetes Average)",
      categoryBn: "প্যাথলজি ও রক্ত পরীক্ষা",
      regularPriceRangeBn: "৳৮০০ - ৳১,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "লিপিড প্রোফাইল - রক্তে চর্বির মাত্রা (Fasting Lipid Profile: Chol, TG, HDL, LDL)",
      testNameEn: "Fasting Lipid Profile (Total Cholesterol, Triglycerides, HDL, LDL)",
      categoryBn: "প্যাথলজি ও রক্ত পরীক্ষা",
      regularPriceRangeBn: "৳৯০০ - ৳১,৪০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৫ ঘণ্টা",
    },
    {
      testNameBn: "কিডনি ফাংশন টেস্ট - সিরাম ক্রিয়েটিনিন ও ইউরিক এসিড (Serum Creatinine & Uric Acid)",
      testNameEn: "Kidney Function Screening (Serum Creatinine & Uric Acid)",
      categoryBn: "প্যাথলজি ও রক্ত পরীক্ষা",
      regularPriceRangeBn: "৳৪৫০ - ৳৭৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "লিভার ফাংশন টেস্ট - এসজিপিটি ও বিলিরুবিন (SGPT / ALT & Total Bilirubin)",
      testNameEn: "Liver Function Test (SGPT/ALT, SGOT/AST & Bilirubin)",
      categoryBn: "প্যাথলজি ও রক্ত পরীক্ষা",
      regularPriceRangeBn: "৳৫০০ - ৳৮৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "থাইরয়েড হরমোন টেস্ট (TSH, Free T4 / T3 Thyroid Panel)",
      testNameEn: "Thyroid Function Panel (TSH, FT4, FT3)",
      categoryBn: "প্যাথলজি ও রক্ত পরীক্ষা",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "ইউরিন আর/এম/ই রুটিন মাইক্রোস্কোপিক পরীক্ষা (Urine Routine & Microscopic R/M/E)",
      testNameEn: "Urine Routine & Microscopic Examination (R/M/E)",
      categoryBn: "প্যাথলজি ও প্রস্রাব পরীক্ষা",
      regularPriceRangeBn: "৳১৫০ - ৳২৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },

    // ২. রেডিওলজি ও ক্লিনিক্যাল ইমেজিং
    {
      testNameBn: "হোল অ্যাবডোমেন আল্ট্রাসনোগ্রাম (Whole Abdomen USG with PVR)",
      testNameEn: "Whole Abdomen Ultrasonography with Post-Void Residual (USG)",
      categoryBn: "রেডিওলজি ও ইমেজিং",
      regularPriceRangeBn: "৳১,১০০ - ৳১,৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "তাৎক্ষণিক (৩০ - ৪৫ মিনিট)",
    },
    {
      testNameBn: "গর্ভকালীন আল্ট্রাসাউন্ড ও ৪ডি কালার ডপলার (Pregnancy USG & 4D Anomaly Scan)",
      testNameEn: "Pregnancy Ultrasound & 4D Color Doppler Anomaly Scan",
      categoryBn: "রেডিওলজি ও ইমেজিং",
      regularPriceRangeBn: "৳১,২০০ - ৳২,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "তাৎক্ষণিক (৩০ - ৫০ মিনিট)",
    },
    {
      testNameBn: "ডিজিটাল চেস্ট এক্স-রে - বুক ও ফুসফুস (Digital Chest X-Ray P/A View)",
      testNameEn: "Digital Chest X-Ray P/A View (High-Frequency DR System)",
      categoryBn: "রেডিওলজি ও ইমেজিং",
      regularPriceRangeBn: "৳৪৫০ - ৳৭০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩০ - ৬০ মিনিট",
    },
    {
      testNameBn: "১২-লিড ডিজিটাল ইসিজি হৃদযন্ত্র পরীক্ষা (12-Lead Digital Resting ECG)",
      testNameEn: "12-Lead Digital Electrocardiogram (Resting ECG)",
      categoryBn: "কার্ডিয়াক ও হৃদরোগ ডায়াগনস্টিক",
      regularPriceRangeBn: "৳৩৫০ - ৳৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "তাৎক্ষণিক (২০ - ৩০ মিনিট)",
    },
    {
      testNameBn: "২ডি ইকোকার্ডিওগ্রাম কালার ডপলার (2D Echo Color Doppler & Heart Valve Scan)",
      testNameEn: "2D Echocardiography with Color Doppler Imaging",
      categoryBn: "কার্ডিয়াক ও হৃদরোগ ডায়াগনস্টিক",
      regularPriceRangeBn: "৳২,২০০ - ৳৩,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },

    // ৩. হাসপাতাল ভর্তি, ডেন্টাল ও ফিজিওথেরাপি সেবা
    {
      testNameBn: "বেসরকারি হাসপাতাল নন-এসি ও এসি কেবিন দৈনিক ভাড়া (Private Hospital Cabin Rent)",
      testNameEn: "Private Hospital Inpatient Single AC/Non-AC Cabin Daily Rent",
      categoryBn: "হাসপাতাল ইনডোর ভর্তি ও কেবিন",
      regularPriceRangeBn: "৳১,৫০০ - ৳৩,৫০০ / দিন",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "ভর্তিকালীন সময় প্রযোজ্য",
    },
    {
      testNameBn: "দাঁতের আল্ট্রাসনিক স্কেলিং ও পলিশিং (Dental Ultrasonic Scaling & Polishing)",
      testNameEn: "Dental Full Mouth Ultrasonic Scaling & Polishing",
      categoryBn: "ডেন্টাল ও দন্তসেবা",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১টি সেশন (৩০ - ৪৫ মিনিট)",
    },
    {
      testNameBn: "ফিজিওথেরাপি ও রিহ্যাবিলিটেশন সেশন (Manual Therapy, Traction & Laser/SWD)",
      testNameEn: "Clinical Physiotherapy & Musculoskeletal Rehabilitation Session",
      categoryBn: "ফিজিওথেরাপি ও পুনর্বাসন",
      regularPriceRangeBn: "৳৫০০ - ৳১,০০০ / সেশন",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "প্রতি সেশন (৪০ - ৬০ মিনিট)",
    },
  ],
};
