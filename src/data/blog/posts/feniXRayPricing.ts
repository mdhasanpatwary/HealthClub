import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_XRAY_TEST_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে ডিজিটাল এক্স-রে (DR / CR X-Ray) টেস্ট খরচ ও মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার শীর্ষ অনুমোদিত ডায়াগনস্টিক সেন্টার ও হাসপাতালে বুক, মেরুদণ্ড, হাত-পা ও হাড়ের ডিজিটাল এক্স-রে পরীক্ষার নিয়মিত বাজার ফি বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের তালিকা।",
  titleEn: "Digital X-Ray (DR / CR) Price Guide in Feni (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar digital radiography and medical imaging centers.",
  tests: [
    // ১. বুক ও সাইনাস রেডিওগ্রাফি
    {
      testNameBn: "বুকের ডিজিটাল এক্স-রে (Chest X-Ray P/A View - 1 Film)",
      testNameEn: "Chest Digital X-Ray Posteroanterior (P/A) View (Lungs & Heart Screening)",
      categoryBn: "বক্ষব্যাধি ও হার্ট স্ক্রিনিং",
      regularPriceRangeBn: "৳৩০০ - ৳৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ৩০ মিনিট",
    },
    {
      testNameBn: "বুকের এক্স-রে ২ ভিউ (Chest X-Ray P/A & Lateral Views - 2 Films)",
      testNameEn: "Chest Digital X-Ray P/A and Lateral Views (Pleural Effusion & Lesions)",
      categoryBn: "বক্ষব্যাধি ও ফুসফুস রোগ",
      regularPriceRangeBn: "৳৬০০ - ৳৯৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২০ - ৪০ মিনিট",
    },
    {
      testNameBn: "পিএনএস ওয়াটার্স ভিউ এক্স-রে (X-Ray PNS - Water's View for Sinusitis)",
      testNameEn: "X-Ray Paranasal Sinuses (PNS) Water's View (Maxillary & Frontal Sinus)",
      categoryBn: "ইএনটি ও সাইনাস পরীক্ষা",
      regularPriceRangeBn: "৳৩৫০ - ৳৫৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ৩০ মিনিট",
    },

    // ২. মেরুদণ্ড ও ঘাড়ের এক্স-রে (স্পাইন রেডিওলজি)
    {
      testNameBn: "ঘাড়ের এক্স-রে ২ ভিউ (X-Ray Cervical Spine A/P & Lateral)",
      testNameEn: "X-Ray Cervical Spine Anteroposterior & Lateral Views (Cervical Spondylosis)",
      categoryBn: "স্পাইন ও ঘাড়ের হাড়",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২০ - ৪০ মিনিট",
    },
    {
      testNameBn: "কোমরের এক্স-রে ২ ভিউ (X-Ray Lumbo-Sacral L/S Spine A/P & Lateral)",
      testNameEn: "X-Ray Lumbo-Sacral Spine A/P & Lateral Views (PLID, Disc Degeneration & Sciatica)",
      categoryBn: "স্পাইন ও কোমর ব্যথা",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২০ - ৪০ মিনিট",
    },
    {
      testNameBn: "পিঠের মেরুদণ্ড এক্স-রে (X-Ray Dorsal / Thoracic Spine A/P & Lateral)",
      testNameEn: "X-Ray Thoracic Spine A/P and Lateral Views (Spinal Curvature & Trauma)",
      categoryBn: "স্পাইন রেডিওলজি",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২০ - ৪০ মিনিট",
    },

    // ৩. হাড় ও অস্থিসন্ধি (অর্থোপেডিক ট্রমা ও জয়েন্ট)
    {
      testNameBn: "এক পায়ের হাঁটু এক্স-রে ২ ভিউ (X-Ray Single Knee Joint A/P & Lateral)",
      testNameEn: "X-Ray Single Knee Joint A/P & Lateral Views (Osteoarthritis & Meniscal Injury)",
      categoryBn: "অর্থোপেডিক ও হাঁটু জয়েন্ট",
      regularPriceRangeBn: "৳৩৫০ - ৳৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ৩০ মিনিট",
    },
    {
      testNameBn: "উভয় হাঁটু দাঁড়িয়ে ২ ভিউ (X-Ray Both Knees Standing A/P & Lateral)",
      testNameEn: "Weight-Bearing Digital X-Ray Both Knees Standing (Joint Space Loss Assessment)",
      categoryBn: "আর্থ্রাইটিস ও অস্টিওআর্থ্রাইটিস",
      regularPriceRangeBn: "৳৬০০ - ৳১,১০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২০ - ৪০ মিনিট",
    },
    {
      testNameBn: "পেলভিস ও উভয় হিপ জয়েন্ট (X-Ray Pelvis with Both Hips A/P View)",
      testNameEn: "X-Ray Pelvis with Both Hips A/P View (Hip Fracture, AVN & Dysplasia)",
      categoryBn: "পেলভিক ও হিপ জয়েন্ট",
      regularPriceRangeBn: "৳৪০০ - ৳৭০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ৩০ মিনিট",
    },
    {
      testNameBn: "কাঁধের জয়েন্ট এক্স-রে (X-Ray Shoulder Joint A/P & Axial / Lat)",
      testNameEn: "X-Ray Shoulder Joint A/P and Lateral Views (Dislocation & Rotator Cuff Calcification)",
      categoryBn: "শোল্ডার জয়েন্ট ও ট্রমা",
      regularPriceRangeBn: "৳৪০০ - ৳৭০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ৩০ মিনিট",
    },
    {
      testNameBn: "হাত, কব্জি ও কনুই জয়েন্ট ২ ভিউ (X-Ray Hand / Wrist / Elbow 2 Views)",
      testNameEn: "X-Ray Hand, Wrist or Elbow Joint 2 Views (Colles Fracture & Bone Trauma)",
      categoryBn: "হাড় ও ট্রমা ইনজুরি",
      regularPriceRangeBn: "৳৩৫০ - ৳৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ৩০ মিনিট",
    },
    {
      testNameBn: "গোড়ালি ও পায়ের পাতা ২ ভিউ (X-Ray Ankle / Foot Joint A/P & Lateral)",
      testNameEn: "X-Ray Ankle or Foot Joint 2 Views (Sprain, Calcaneal Spur & Stress Fracture)",
      categoryBn: "হাড় ও ট্রমা ইনজুরি",
      regularPriceRangeBn: "৳৩৫০ - ৳৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ৩০ মিনিট",
    },

    // ৪. পেট, মূত্রনালী ও বিশেষ রেডিওগ্রাফি
    {
      testNameBn: "পেটের এক্স-রে খাড়া ও শোয়া ভিউ (X-Ray Abdomen Plain / Erect View)",
      testNameEn: "X-Ray Abdomen Plain and Erect View (Intestinal Obstruction & Free Gas/Perforation)",
      categoryBn: "জরুরি পেট ও সার্জিক্যাল স্ক্রিনিং",
      regularPriceRangeBn: "৳৪০০ - ৳৭০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ৩০ মিনিট",
    },
    {
      testNameBn: "কেইউবি এক্স-রে (X-Ray KUB - Kidney, Ureter & Bladder)",
      testNameEn: "X-Ray KUB Plain (Radio-opaque Renal & Ureteric Calculi Detection)",
      categoryBn: "কিডনি পাথর ও মূত্রনালী",
      regularPriceRangeBn: "৳৪০০ - ৳৭০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১৫ - ৩০ মিনিট",
    },
    {
      testNameBn: "বেরিয়াম সলো / বেরিয়াম মিল বিশেষ স্টাডি (Barium Swallow / Meal Special Study)",
      testNameEn: "Fluoroscopic Contrast Barium Swallow or Barium Meal Follow-Through Study",
      categoryBn: "বিশেষায়িত কনট্রাস্ট রেডিওলজি",
      regularPriceRangeBn: "৳১,৫০০ - ৳২,৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১ - ২ ঘণ্টা",
    },
    {
      testNameBn: "জরুরি বেডসাইড পোর্টেবল ডিজিটাল এক্স-রে (Emergency Portable Bedside DR X-Ray)",
      testNameEn: "Emergency Bedside Portable Digital Radiography (ICU & Critical Ward Patient)",
      categoryBn: "আইসিইউ ও জরুরি বেডসাইড কেয়ার",
      regularPriceRangeBn: "৳৮০০ - ৳১,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২০ - ৪০ মিনিট",
    },
  ],
};
