import { UpazilaCarePackageItem } from "@/types/upazilaBlog";

export const PARSHURAM_FULGAZI_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn?: string;
  subtitleEn?: string;
  packages: UpazilaCarePackageItem[];
} = {
  titleBn: "পরশুরাম ও ফুলগাজীতে স্বাস্থ্যসেবা ও টেস্ট ফি তালিকা (২০২৬)",
  subtitleBn:
    "উত্তর ফেনীর সরকারি স্বাস্থ্য কমপ্লেক্সের ইউজার ফি এবং স্থানীয় বেসরকারি ক্লিনিকগুলোর স্ট্যান্ডার্ড বাজারদর তালিকা (সদরে রেফারেল চিকিৎসার জন্য ফেনী সদরের পার্টনার হাসপাতালগুলোতে হেলথ ক্লাব মেম্বার ছাড় প্রযোজ্য)।",
  titleEn: "Parshuram & Fulgazi Healthcare & Diagnostic Fee Benchmark (2026)",
  subtitleEn:
    "Official government OPD ticket charges vs. private clinic benchmark rates in Parshuram & Fulgazi upazilas.",
  packages: [
    {
      id: "pf-opd-ticket",
      categoryBn: "সরকারি সেবা",
      procedureOrTestNameBn: "উপজেলা স্বাস্থ্য কমপ্লেক্স বহির্বিভাগ (OPD) টিকেট",
      procedureOrTestNameEn: "Upazila Health Complex OPD Consultation Ticket",
      regularPriceRangeBn: "৳৩ - ৳১০",
      durationOrTurnaroundBn: "সকাল ৮:৩০ - দুপুর ২:৩০",
    },
    {
      id: "pf-specialist-visit",
      categoryBn: "প্রাইভেট চেম্বার",
      procedureOrTestNameBn: "ভিজিটিং বিশেষজ্ঞ চিকিৎসক কনসালটেশন ফি",
      procedureOrTestNameEn: "Visiting Specialist Doctor Consultation Fee",
      regularPriceRangeBn: "৳৫০০ - ৳৮০০",
      durationOrTurnaroundBn: "বিকেল ৩:০০ - রাত ৯:০০",
    },
    {
      id: "pf-cbc-test",
      categoryBn: "প্যাথলজি ও ল্যাব",
      procedureOrTestNameBn: "সম্পূর্ণ রক্তের পরীক্ষা (CBC with ESR)",
      procedureOrTestNameEn: "Complete Blood Count (CBC with ESR)",
      regularPriceRangeBn: "৳৩০০ - ৳৪৫০",
      durationOrTurnaroundBn: "২-৪ ঘণ্টার মধ্যে রিপোর্ট",
    },
    {
      id: "pf-digital-xray",
      categoryBn: "ইমেজিং ও এক্স-রে",
      procedureOrTestNameBn: "ডিজিটাল এক্স-রে (বুক বা হাড়ের জয়েন্ট)",
      procedureOrTestNameEn: "Digital X-Ray (Chest / Bone Joint)",
      regularPriceRangeBn: "৳৪০০ - ৳৭০০",
      durationOrTurnaroundBn: "৩০-৬০ মিনিট",
    },
    {
      id: "pf-usg-abdomen",
      categoryBn: "ইমেজিং ও এক্স-রে",
      procedureOrTestNameBn: "পেটের আল্ট্রাসনোগ্রাফি (USG of Whole Abdomen)",
      procedureOrTestNameEn: "Ultrasonography of Whole Abdomen",
      regularPriceRangeBn: "৳৮০০ - ৳১,৪০০",
      durationOrTurnaroundBn: "১-২ ঘণ্টার মধ্যে রিপোর্ট",
    },
    {
      id: "pf-ecg-12lead",
      categoryBn: "কার্ডিয়াক টেস্ট",
      procedureOrTestNameBn: "১২-লিড ডিজিটাল ইসিজি (12-Lead ECG)",
      procedureOrTestNameEn: "12-Lead Digital ECG",
      regularPriceRangeBn: "৳২৫০ - ৳৪০০",
      durationOrTurnaroundBn: "তাৎক্ষণিক রিপোর্ট",
    },
    {
      id: "pf-blood-glucose",
      categoryBn: "প্যাথলজি ও ল্যাব",
      procedureOrTestNameBn: "রক্তের সুগার পরীক্ষা (FBS / 2HABF)",
      procedureOrTestNameEn: "Fasting Blood Sugar / 2HABF",
      regularPriceRangeBn: "৳১০০ - ৳১৮০",
      durationOrTurnaroundBn: "৩০ মিনিট",
    },
    {
      id: "pf-lipid-profile",
      categoryBn: "প্যাথলজি ও ল্যাব",
      procedureOrTestNameBn: "লিপিড প্রোফাইল টেস্ট (Fasting Lipid Profile)",
      procedureOrTestNameEn: "Fasting Lipid Profile (Cholesterol, TG, HDL, LDL)",
      regularPriceRangeBn: "৳৭০০ - ৳১,১০০",
      durationOrTurnaroundBn: "৩-৫ ঘণ্টার মধ্যে রিপোর্ট",
    },
    {
      id: "pf-serum-creatinine",
      categoryBn: "প্যাথলজি ও ল্যাব",
      procedureOrTestNameBn: "সিরাম ক্রিয়েটিনিন কিডনি টেস্ট (Serum Creatinine)",
      procedureOrTestNameEn: "Serum Creatinine Kidney Function Test",
      regularPriceRangeBn: "৳৩০০ - ৳৪৫০",
      durationOrTurnaroundBn: "২-৩ ঘণ্টা",
    },
    {
      id: "pf-normal-delivery",
      categoryBn: "প্রসূতি ও মাতৃত্ব",
      procedureOrTestNameBn: "নরমাল ডেলিভারি সার্ভিস চার্জ (উপজেলা প্রাইভেট ক্লিনিক)",
      procedureOrTestNameEn: "Normal Delivery Package (Private Clinic)",
      regularPriceRangeBn: "৳৩,৫০০ - ৳৬,০০০",
      durationOrTurnaroundBn: "২৪ ঘণ্টা পর্যবেক্ষণ ও ছাড়পত্র",
    },
    {
      id: "pf-cesarean-package",
      categoryBn: "প্রসূতি ও মাতৃত্ব",
      procedureOrTestNameBn: "সিজারিয়ান অপারেশন প্যাকেজ (LUSCS Package)",
      procedureOrTestNameEn: "Cesarean Delivery Package (LUSCS)",
      regularPriceRangeBn: "৳১৫,০০০ - ৳২৫,০০০",
      durationOrTurnaroundBn: "৩-৪ দিন ইনডোর কেবিন",
    },
    {
      id: "pf-minor-trauma-suture",
      categoryBn: "জরুরি সেবা",
      procedureOrTestNameBn: "জরুরি ক্ষতের ড্রেসিং ও সেলাই (Minor Trauma Suture)",
      procedureOrTestNameEn: "Emergency Wound Dressing & Suturing",
      regularPriceRangeBn: "৳৩০০ - ৳৮০০",
      durationOrTurnaroundBn: "জরুরি বিভাগে তাৎক্ষণিক",
    },
    {
      id: "pf-ambulance-fulgazi",
      categoryBn: "অ্যাম্বুলেন্স রেফারেল",
      procedureOrTestNameBn: "জরুরি এসি অ্যাম্বুলেন্স (ফুলগাজী ⇄ ফেনী সদর হাসপাতাল)",
      procedureOrTestNameEn: "Emergency AC Ambulance (Fulgazi to Feni Sadar)",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৫০০",
      durationOrTurnaroundBn: "২০-৩০ মিনিট যাতায়াত সময়",
    },
    {
      id: "pf-ambulance-parshuram",
      categoryBn: "অ্যাম্বুলেন্স রেফারেল",
      procedureOrTestNameBn: "জরুরি এসি অ্যাম্বুলেন্স (পরশুরাম ⇄ ফেনী সদর হাসপাতাল)",
      procedureOrTestNameEn: "Emergency AC Ambulance (Parshuram to Feni Sadar)",
      regularPriceRangeBn: "৳১,৪০০ - ৳২,০০০",
      durationOrTurnaroundBn: "৩৫-৫০ মিনিট যাতায়াত সময়",
    },
  ],
};
