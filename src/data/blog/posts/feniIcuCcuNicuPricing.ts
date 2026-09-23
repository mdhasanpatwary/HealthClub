import { CriticalCarePricingData } from "@/types/criticalCareBlog";

export const FENI_ICU_CCU_NICU_PRICING: CriticalCarePricingData = {
  titleBn: "ফেনীতে আইসিইউ, সিসিইউ, এনআইসিইউ বেড ও ভেন্টিলেটর ভাড়ার তালিকা ২০২৬",
  subtitleBn:
    "ফেনীর বেসরকারি হাসপাতালে জেনারেল আইসিইউ বেড, সিসিইউ কার্ডিয়াক মনিটরিং, এনআইসিইউ ইনকিউবেটর, মেকানিক্যাল ভেন্টিলেটর ও লাইফ সাপোর্টের সাধারণ খরচ এবং হেলথ ক্লাব মেম্বারদের ১০-৩০% নিশ্চিত ছাড়।",
  titleEn: "Feni ICU, CCU, NICU Bed Charges & Ventilator Price Guide (2026)",
  subtitleEn:
    "Market benchmark charges for adult ICU beds, coronary CCU units, neonatal NICU incubators, mechanical ventilators, and life support in Feni Sadar with 10-30% Health Club member discounts.",
  packages: [
    // 1. Adult Intensive Care (ICU) & High Dependency (HDU) Beds
    {
      serviceOrBedNameBn: "অ্যাডাল্ট আইসিইউ বেড চার্জ (Adult ICU Bed - মাল্টিপ্যারা মনিটর ও সেন্ট্রাল অক্সিজেনসহ)",
      serviceOrBedNameEn: "Adult ICU Bed Charge (Includes Multi-para Vital Monitor, Central O2 & Infusion Line)",
      categoryBn: "আইসিইউ বেড ও লাইফ সাপোর্ট",
      regularPriceRangeBn: "৳৪,০০০ - ৳৭,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "প্রতি ২৪ ঘণ্টা (১ দিন)",
    },
    {
      serviceOrBedNameBn: "ইনভেসিভ মেকানিক্যাল ভেন্টিলেটর সাপোর্ট (Invasive Mechanical Ventilator & Circuit Support)",
      serviceOrBedNameEn: "Invasive Mechanical Ventilator Support (Servo Ventilator, Circuit & Humidifier)",
      categoryBn: "আইসিইউ বেড ও লাইফ সাপোর্ট",
      regularPriceRangeBn: "৳৩,০০০ - ৳৬,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "প্রতি ২৪ ঘণ্টা (১ দিন)",
    },
    {
      serviceOrBedNameBn: "হাই ডিপেন্ডেন্সি ইউনিট বেড (HDU Bed - স্টেপ-ডাউন ক্রিটিক্যাল কেয়ার ও মনিটরিং)",
      serviceOrBedNameEn: "High Dependency Unit (HDU) Bed (Step-Down Monitored Bed & Post-Surgical Care)",
      categoryBn: "আইসিইউ বেড ও লাইফ সাপোর্ট",
      regularPriceRangeBn: "৳২,৫০০ - ৳৪,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "প্রতি ২৪ ঘণ্টা (১ দিন)",
    },

    // 2. Cardiac Critical Care (CCU)
    {
      serviceOrBedNameBn: "করোনারি কেয়ার ইউনিট বেড (Dedicated CCU Bed - হৃদরোগ মনিটরিং ও টেলিমেট্রি)",
      serviceOrBedNameEn: "Coronary Care Unit (CCU) Bed (Continuous Cardiac Telemetry, Defibrillator Ready)",
      categoryBn: "কার্ডিয়াক কেয়ার (CCU)",
      regularPriceRangeBn: "৳৪,০০০ - ৳৭,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "প্রতি ২৪ ঘণ্টা (১ দিন)",
    },
    {
      serviceOrBedNameBn: "জরুরি কার্ডিয়াক ডিফিব্রিলেশন ও থ্রম্বোলাইসিস মনিটরিং (Defibrillation & Stat MI Protocol)",
      serviceOrBedNameEn: "Emergency Cardiac Defibrillation & Thrombolysis Protocol Monitoring",
      categoryBn: "কার্ডিয়াক কেয়ার (CCU)",
      regularPriceRangeBn: "৳২,০০০ - ৳৩,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "প্রসিডিউর ভিত্তিক",
    },

    // 3. Neonatal Intensive Care (NICU)
    {
      serviceOrBedNameBn: "নবজাতক এনআইসিইউ ইনকিউবেটর বেড (Neonatal Incubator Bed - প্রিম্যাচিউর ও লো বার্থ ওয়েট বেবি)",
      serviceOrBedNameEn: "Neonatal Incubator Bed (Microprocessor Servo Incubator, SpO2 & Warming)",
      categoryBn: "নবজাতক নিবিড় পরিচর্যা (NICU)",
      regularPriceRangeBn: "৳৩,০০০ - ৳৫,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "প্রতি ২৪ ঘণ্টা (১ দিন)",
    },
    {
      serviceOrBedNameBn: "নবজাতকের জন্ডিস ফটোথেরাপি ডে-কেয়ার (Double-Surface Phototherapy with Eye Shield)",
      serviceOrBedNameEn: "Neonatal Jaundice Phototherapy (Double-Surface LED Phototherapy Day Care)",
      categoryBn: "নবজাতক নিবিড় পরিচর্যা (NICU)",
      regularPriceRangeBn: "৳১,৫০০ - ৳২,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "প্রতি ২৪ ঘণ্টা (১ দিন)",
    },
    {
      serviceOrBedNameBn: "রেডিয়েন্ট বেবি ওয়ার্মার ও নিওনেটাল রিসাসিটেশন (Radiant Baby Warmer & Neonatal Resuscitation)",
      serviceOrBedNameEn: "Radiant Baby Warmer & Resuscitation Suite (Thermal Regulation & O2 Blending)",
      categoryBn: "নবজাতক নিবিড় পরিচর্যা (NICU)",
      regularPriceRangeBn: "৳১,৮০০ - ৳৩,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "প্রতি ২৪ ঘণ্টা (১ দিন)",
    },

    // 4. Clinical Gas, Monitoring & Nursing Care
    {
      serviceOrBedNameBn: "সেন্ট্রাল পাইপলাইন মেডিকেল অক্সিজেন ও এইচএফএনসি (Central Pipeline O2 & High-Flow Nasal Cannula)",
      serviceOrBedNameEn: "Central Pipeline Medical Oxygen & High-Flow Nasal Cannula (HFNC)",
      categoryBn: "গ্যাস ও নার্সিং সেবা",
      regularPriceRangeBn: "৳১,২০০ - ৳২,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "প্রতি ২৪ ঘণ্টা (১ দিন)",
    },
    {
      serviceOrBedNameBn: "আর্টেরিয়াল ব্লাড গ্যাস ও জরুরি স্ট্যাট ইলেক্ট্রোলাইটস (ABG Analysis & Stat Serum Electrolytes)",
      serviceOrBedNameEn: "Arterial Blood Gas (ABG) Analysis & Stat Point-of-Care Electrolytes",
      categoryBn: "গ্যাস ও নার্সিং সেবা",
      regularPriceRangeBn: "৳১,২০০ - ৳২,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "তাৎক্ষণিক (Stat / ৩০ মিনিট)",
    },
    {
      serviceOrBedNameBn: "আইসিইউ স্পেশালিস্ট ও অন-কল কনসালট্যান্ট রাউন্ড ফি (Duty Intensivist / Specialist Doctor Round)",
      serviceOrBedNameEn: "Duty Intensivist / Anesthesiologist Specialist Clinical Round Fee",
      categoryBn: "গ্যাস ও নার্সিং সেবা",
      regularPriceRangeBn: "৳১,০০০ - ৳২,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "প্রতি রাউন্ড / দৈনিক",
    },
    {
      serviceOrBedNameBn: "ডেডিকেটেড ১:১ ক্রিটিক্যাল কেয়ার নার্সিং ও সাকশন (1:1 Dedicated Critical Care Nursing & Suction)",
      serviceOrBedNameEn: "Dedicated 1:1 Intensive Nursing Care, Vital Tracking & Tracheal Suction",
      categoryBn: "গ্যাস ও নার্সিং সেবা",
      regularPriceRangeBn: "৳১,২০০ - ৳২,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      stayOrDurationBn: "প্রতি ২৪ ঘণ্টা (১ দিন)",
    },
  ],
};
