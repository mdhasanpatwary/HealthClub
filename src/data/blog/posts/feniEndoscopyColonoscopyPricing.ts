import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_ENDOSCOPY_COLONOSCOPY_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে এন্ডোস্কোপি, কোলনোস্কোপি ও গ্যাস্ট্রোএন্টারোলজি টেস্টের খরচ ও মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার শীর্ষ অনুমোদিত ডায়াগনস্টিক সেন্টার ও গ্যাস্ট্রো সেন্টারে নিয়মিত বাজারদর বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের পূর্ণাঙ্গ তালিকা।",
  titleEn: "Feni Endoscopy, Colonoscopy & Gastroenterology Diagnostic Test Price Guide (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar diagnostic centers.",
  tests: [
    // ১. আপার জিআই এন্ডোস্কোপি ও খাদ্যনালী পরীক্ষা
    {
      testNameBn: "ভিডিও আপার জিআই এন্ডোস্কোপি - সাধারণ (Upper GI Endoscopy with Throat Spray)",
      testNameEn: "Upper Gastrointestinal Video Endoscopy (Local Anesthetic Spray)",
      categoryBn: "আপার জিআই এন্ডোস্কোপি",
      regularPriceRangeBn: "৳২,৫০০ - ৳৩,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা (তাৎক্ষণিক ছবি ও রিপোর্ট)",
    },
    {
      testNameBn: "ব্যথাহীন এন্ডোস্কোপি - আইভি সেডেশন সহ (Painless Endoscopy with Conscious Sedation)",
      testNameEn: "Painless Upper GI Endoscopy with Short IV Sedation",
      categoryBn: "আপার জিআই এন্ডোস্কোপি",
      regularPriceRangeBn: "৳৪,০০০ - ৳৫,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা (রিকভারি সহ)",
    },
    {
      testNameBn: "এন্ডোস্কোপিক বায়োপ্সি ও হিস্টোপ্যাথলজি (Endoscopic Tissue Biopsy & Histopathology)",
      testNameEn: "Endoscopic Mucosal Biopsy with Histopathology Examination",
      categoryBn: "আপার জিআই এন্ডোস্কোপি",
      regularPriceRangeBn: "৳১,৫০০ - ৳২,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৭ দিন",
    },
    {
      testNameBn: "এইচ. পাইলোরি ব্যাকটেরিয়া র‍্যাপিড ইউরিয়েজ টেস্ট (Endoscopic Rapid Urease Test - RUT)",
      testNameEn: "Helicobacter Pylori Rapid Urease Test (RUT / CLO Test)",
      categoryBn: "আপার জিআই এন্ডোস্কোপি",
      regularPriceRangeBn: "৳৮০০ - ৳১,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩০ মিনিট - ১ ঘণ্টা",
    },
    {
      testNameBn: "এন্ডোস্কোপিক ভ্যারিসিয়াল ব্যান্ড লাইগেশন (EVL - Esophageal Variceal Banding)",
      testNameEn: "Endoscopic Variceal Ligation (EVL for Liver Cirrhosis)",
      categoryBn: "থেরাপিউটিক এন্ডোস্কোপি",
      regularPriceRangeBn: "৳৮,০০০ - ৳১৪,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "ডে-কেয়ার / ইনডোর ভর্তি",
    },

    // ২. লোয়ার জিআই কোলনোস্কোপি ও অন্ত্র পরীক্ষা
    {
      testNameBn: "ফুল ভিডিও কোলনোস্কোপি - সাধারণ (Full Colonoscopy with Cecal Intubation)",
      testNameEn: "Complete Lower Gastrointestinal Video Colonoscopy",
      categoryBn: "লোয়ার জিআই কোলনোস্কোপি",
      regularPriceRangeBn: "৳৫,৫০০ - ৳৭,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "ব্যথাহীন কোলনোস্কোপি - অ্যানেস্থেসিয়া সহ (Painless Colonoscopy under Monitored Anesthesia)",
      testNameEn: "Painless Video Colonoscopy under MAC / General Anesthesia",
      categoryBn: "লোয়ার জিআই কোলনোস্কোপি",
      regularPriceRangeBn: "৳৭,৫০০ - ৳১০,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা (রিকভারি সহ)",
    },
    {
      testNameBn: "শর্ট কোলনোস্কোপি / সিগময়েডোস্কোপি (Flexible Sigmoidoscopy)",
      testNameEn: "Flexible Sigmoidoscopy (Lower Bowel & Rectum Screening)",
      categoryBn: "লোয়ার জিআই কোলনোস্কোপি",
      regularPriceRangeBn: "৳৩,০০০ - ৳৪,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "এন্ডোস্কোপিক পলিপেক্টমি ও বায়োপ্সি (Endoscopic Polypectomy with Snare Cautery)",
      testNameEn: "Endoscopic Colon Polypectomy with Histopathology",
      categoryBn: "থেরাপিউটিক কোলনোস্কোপি",
      regularPriceRangeBn: "৳৬,০০০ - ৳১১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "ডে-কেয়ার / ৫ - ৭ দিন হিস্টোপ্যাথলজি",
    },

    // ৩. গ্যাস্ট্রোএন্টারোলজি ও লিভার সহযোগী ডায়াগনস্টিক টেস্ট
    {
      testNameBn: "হোল অ্যাবডোমেন কালার আল্ট্রাসনোগ্রাম (Whole Abdomen Ultrasound - Liver, Gallbladder & Pancreas)",
      testNameEn: "Whole Abdomen USG with Hepatobiliary & Pancreatic Evaluation",
      categoryBn: "রেডিওলজি ও সোনোলজি",
      regularPriceRangeBn: "৳১,১০০ - ৳১,৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "তাৎক্ষণিক (৩০ - ৪৫ মিনিট)",
    },
    {
      testNameBn: "লিভার ফাংশন টেস্ট প্যানেল (LFT: SGPT, SGOT, Total Bilirubin, Alkaline Phosphatase)",
      testNameEn: "Comprehensive Liver Function Test (LFT Panel)",
      categoryBn: "বায়োকেমিস্ট্রি ও লিভার প্যানেল",
      regularPriceRangeBn: "৳৮০০ - ৳১,৩০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম অ্যামাইলেজ ও সিরাম লাইপেজ (Serum Amylase & Lipase - Pancreatitis Markers)",
      testNameEn: "Pancreatic Enzyme Markers (Serum Amylase & Serum Lipase)",
      categoryBn: "বায়োকেমিস্ট্রি ও অগ্ন্যাশয় প্যানেল",
      regularPriceRangeBn: "৳১,২০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "মল পরীক্ষা - স্টুল আর/এম/ই ও ওকাল্ট ব্লাড (Stool R/M/E with Fecal Occult Blood Test - FOBT)",
      testNameEn: "Stool Routine Examination with Fecal Occult Blood Screening",
      categoryBn: "প্যাথলজি ও মল পরীক্ষা",
      regularPriceRangeBn: "৳৩৫০ - ৳৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "হেপাটাইটিস বি ও সি ভাইরাস স্ক্রিনিং (HBsAg & Anti-HCV Screening)",
      testNameEn: "Viral Hepatitis Panel (HBsAg Confirmatory & Anti-HCV)",
      categoryBn: "সেরোলজি ও লিভার ইনফেকশন",
      regularPriceRangeBn: "৳৬০০ - ৳১,১০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৩ ঘণ্টা",
    },
  ],
};
