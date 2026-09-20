import { AmbulancePackagePriceItem } from "@/types/ambulanceBlog";

export const FENI_AMBULANCE_PRICING: {
  titleBn: string;
  subtitleBn: string;
  packages: AmbulancePackagePriceItem[];
} = {
  titleBn: "ফেনী অ্যাম্বুলেন্স ভাড়া ও জরুরি অক্সিজেন সিলিন্ডারের প্রমিত মূল্যতালিকা ২০২৬",
  subtitleBn:
    "ঢাকা, চট্টগ্রাম ও স্থানীয় রুটে এসি, নন-এসি, আইসিইউ ভেন্টিলেটর এবং ফ্রিজিং লাশবাহী গাড়ির সাধারণ প্রমিত বাজারদর তালিকা; ফেনীর অ্যাম্বুলেন্স সেবাগুলো উন্মুক্ত জরুরি পাবলিক ডিরেক্টরি হিসেবে পরিচালিত হয় (সরাসরি চালকের সাথে কথা বলে প্রমিত ভাড়ায় দালালমুক্ত সেবা নিশ্চিত করুন)।",
  packages: [
    {
      procedureOrTestNameBn: "ফেনী ⇄ ঢাকা স্ট্যান্ডার্ড এসি অ্যাম্বুলেন্স (টয়োটা হাইয়েস)",
      procedureOrTestNameEn: "Feni to Dhaka Standard AC Ambulance (Toyota Hiace)",
      categoryBn: "ইন্টার-সিটি এক্সপ্রেস ট্রান্সফার (ঢাকা)",
      regularPriceRangeBn: "৳৮,০০০ - ৳১২,০০০",
      discountPercentageBn: "প্রমিত পাবলিক ভাড়া",
      durationOrTurnaroundBn: "ফেনী ⇄ ঢাকা (৪ - ৫ ঘণ্টা)",
    },
    {
      procedureOrTestNameBn: "ফেনী ⇄ ঢাকা আইসিইউ লাইফ সাপোর্ট অ্যাম্বুলেন্স (ভেন্টিলেটর ও প্যারামেডিক)",
      procedureOrTestNameEn: "Feni to Dhaka ICU Life Support Ambulance (Ventilator & Paramedic)",
      categoryBn: "লাইফ সাপোর্ট ও ক্রিটিক্যাল কেয়ার",
      regularPriceRangeBn: "৳১৮,০০০ - ৳২৫,০০০",
      discountPercentageBn: "প্রমিত পাবলিক ভাড়া",
      durationOrTurnaroundBn: "ফেনী ⇄ ঢাকা (নন-স্টপ লাইফ সাপোর্ট)",
    },
    {
      procedureOrTestNameBn: "ফেনী ⇄ চট্টগ্রাম স্ট্যান্ডার্ড এসি অ্যাম্বুলেন্স",
      procedureOrTestNameEn: "Feni to Chittagong Standard AC Ambulance",
      categoryBn: "ইন্টার-সিটি এক্সপ্রেস ট্রান্সফার (চট্টগ্রাম)",
      regularPriceRangeBn: "৳৫,০০০ - ৳৭,৫০০",
      discountPercentageBn: "প্রমিত পাবলিক ভাড়া",
      durationOrTurnaroundBn: "ফেনী ⇄ চট্টগ্রাম (২ - ২.৫ ঘণ্টা)",
    },
    {
      procedureOrTestNameBn: "ফেনী ⇄ চট্টগ্রাম কার্ডিয়াক ও আইসিইউ অ্যাম্বুলেন্স (মনিটর ও অক্সিজেন)",
      procedureOrTestNameEn: "Feni to Chittagong Cardiac & ICU Ambulance (Cardiac Monitor)",
      categoryBn: "লাইফ সাপোর্ট ও ক্রিটিক্যাল কেয়ার",
      regularPriceRangeBn: "৳১২,০০০ - ৳১৬,০০০",
      discountPercentageBn: "প্রমিত পাবলিক ভাড়া",
      durationOrTurnaroundBn: "ফেনী ⇄ চট্টগ্রাম (জরুরি কার্ডিয়াক মনিটরিং)",
    },
    {
      procedureOrTestNameBn: "ফেনী পৌরসভা লোকাল রোগী স্থানান্তর (বাসা ⇄ হাসপাতাল/ল্যাব)",
      procedureOrTestNameEn: "Feni Municipality Local Patient Transfer (Home to Clinic/Hospital)",
      categoryBn: "ফেনী পৌরসভা লোকাল ট্রিপ",
      regularPriceRangeBn: "৳৮০০ - ৳১,৫০০",
      discountPercentageBn: "প্রমিত পাবলিক ভাড়া",
      durationOrTurnaroundBn: "ফেনী পৌরসভা এলাকা (৩০ - ৪৫ মিনিট)",
    },
    {
      procedureOrTestNameBn: "উপজেলা (দাগনভূঞা/ছাগলনাইয়া/সোনাগাজী/পরশুরাম) ⇄ ফেনী সদর",
      procedureOrTestNameEn: "Upazila to Feni District Sadar Hospital Patient Transfer",
      categoryBn: "উপজেলা ও জেলা সদর সংযোগ",
      regularPriceRangeBn: "৳১,৮০০ - ৳৩,০০০",
      discountPercentageBn: "প্রমিত পাবলিক ভাড়া",
      durationOrTurnaroundBn: "উপজেলা ⇄ ফেনী সদর (৪৫ - ৬০ মিনিট)",
    },
    {
      procedureOrTestNameBn: "মেডিকেল অক্সিজেন সিলিন্ডার (১.৪ মি³ / ১৩৬০ লিটার) মাসিক ভাড়া + রেগুলেটর কিট",
      procedureOrTestNameEn: "Medical Oxygen Cylinder (1.4m³ / 1360L) Monthly Rental + Flowmeter Kit",
      categoryBn: "জরুরি অক্সিজেন সিলিন্ডার সেবা",
      regularPriceRangeBn: "৳২,০০০ - ৳৩,৫০০",
      discountPercentageBn: "প্রমিত পাবলিক ভাড়া",
      durationOrTurnaroundBn: "৩০ দিন মেয়াদ (হোম ইন্সটলেশন সহ)",
    },
    {
      procedureOrTestNameBn: "জরুরি অক্সিজেন সিলিন্ডার গ্যাস রিফিল ও হোম ডেলিভারি সার্ভিস",
      procedureOrTestNameEn: "Emergency Oxygen Cylinder Gas Refill & Rapid Home Delivery",
      categoryBn: "জরুরি অক্সিজেন সিলিন্ডার সেবা",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      discountPercentageBn: "প্রমিত পাবলিক ভাড়া",
      durationOrTurnaroundBn: "৩০ - ৪৫ মিনিটে হোম ডেলিভারি",
    },
    {
      procedureOrTestNameBn: "ফ্রিজিং লাশবাহী অ্যাম্বুলেন্স (ফেনী ⇄ ঢাকা শাহজালাল বিমানবন্দর / শহর)",
      procedureOrTestNameEn: "Freezing Mortuary Ambulance (Feni to Dhaka Airport / City)",
      categoryBn: "লাশবাহী ফ্রিজিং ভ্যান",
      regularPriceRangeBn: "৳১২,০০০ - ৳১৬,০০০",
      discountPercentageBn: "প্রমিত পাবলিক ভাড়া",
      durationOrTurnaroundBn: "ফেনী ⇄ ঢাকা (-৫°C থেকে -২০°C)",
    },
    {
      procedureOrTestNameBn: "ফ্রিজিং লাশবাহী অ্যাম্বুলেন্স (ফেনী ⇄ চট্টগ্রাম শাহ আমানত বিমানবন্দর / শহর)",
      procedureOrTestNameEn: "Freezing Mortuary Ambulance (Feni to Chittagong Airport / City)",
      categoryBn: "লাশবাহী ফ্রিজিং ভ্যান",
      regularPriceRangeBn: "৳৭,০০০ - ৳১০,০০০",
      discountPercentageBn: "প্রমিত পাবলিক ভাড়া",
      durationOrTurnaroundBn: "ফেনী ⇄ চট্টগ্রাম (-৫°C থেকে -২০°C)",
    },
  ],
};
