import { UpazilaCarePackageItem } from "@/types/upazilaBlog";

export const FULGAZI_CARE_PRICING: {
  titleBn: string;
  subtitleBn: string;
  packages: UpazilaCarePackageItem[];
} = {
  titleBn: "ফুলগাজী উপজেলায় স্বাস্থ্যসেবা ও ডায়াগনস্টিক টেস্টের স্ট্যান্ডার্ড ফি তালিকা",
  subtitleBn:
    "ফুলগাজী ৫০ শয্যা উপজেলা সরকারি স্বাস্থ্য কমপ্লেক্সের ইউজার ফি এবং স্থানীয় বেসরকারি ক্লিনিকগুলোর স্ট্যান্ডার্ড বাজারদর তালিকা (ফেনী সদরের পার্টনার হাসপাতালে রেফারেল হলে হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড় পাওয়া যায়)।",
  packages: [
    {
      id: "ful-opd-ticket",
      categoryBn: "সরকারি সেবা",
      procedureOrTestNameBn: "উপজেলা স্বাস্থ্য কমপ্লেক্স বহির্বিভাগ (OPD) টিকেট",
      procedureOrTestNameEn: "Upazila Health Complex OPD Consultation Ticket",
      regularPriceRangeBn: "৳৩ - ৳১০",
      durationOrTurnaroundBn: "সকাল ৮:৩০ - দুপুর ২:৩০",
    },
    {
      id: "ful-specialist-visit",
      categoryBn: "প্রাইভেট চেম্বার",
      procedureOrTestNameBn: "ভিজিটিং বিশেষজ্ঞ চিকিৎসক কনসালটেশন ফি",
      procedureOrTestNameEn: "Visiting Specialist Doctor Consultation Fee",
      regularPriceRangeBn: "৳৫০০ - ৳৮০০",
      durationOrTurnaroundBn: "বিকেল ৩:০০ - রাত ৯:০০",
    },
    {
      id: "ful-cbc-test",
      categoryBn: "প্যাথলজি ও ল্যাব",
      procedureOrTestNameBn: "সম্পূর্ণ রক্তের পরীক্ষা (CBC with ESR)",
      procedureOrTestNameEn: "Complete Blood Count (CBC with ESR)",
      regularPriceRangeBn: "৳৩০০ - ৳৪৫০",
      durationOrTurnaroundBn: "২-৩ ঘণ্টার মধ্যে রিপোর্ট",
    },
    {
      id: "ful-digital-xray",
      categoryBn: "ইমেজিং ও এক্স-রে",
      procedureOrTestNameBn: "ডিজিটাল এক্স-রে (বুক বা হাড়ের জয়েন্ট)",
      procedureOrTestNameEn: "Digital X-Ray (Chest / Bone Joint)",
      regularPriceRangeBn: "৳৪০০ - ৳৭০০",
      durationOrTurnaroundBn: "৩০-৪৫ মিনিট",
    },
    {
      id: "ful-usg-abdomen",
      categoryBn: "ইমেজিং ও এক্স-রে",
      procedureOrTestNameBn: "পেটের আল্ট্রাসনোগ্রাফি (USG of Whole Abdomen)",
      procedureOrTestNameEn: "Ultrasonography of Whole Abdomen",
      regularPriceRangeBn: "৳৮০০ - ৳১,৪০০",
      durationOrTurnaroundBn: "১ ঘণ্টার মধ্যে রিপোর্ট",
    },
    {
      id: "ful-ecg-12lead",
      categoryBn: "কার্ডিয়াক টেস্ট",
      procedureOrTestNameBn: "১২-লিড ডিজিটাল ইসিজি (12-Lead ECG)",
      procedureOrTestNameEn: "12-Lead Digital ECG",
      regularPriceRangeBn: "৳২৫০ - ৳৪০০",
      durationOrTurnaroundBn: "তাৎক্ষণিক রিপোর্ট",
    },
    {
      id: "ful-blood-glucose",
      categoryBn: "প্যাথলজি ও ল্যাব",
      procedureOrTestNameBn: "রক্তের সুগার পরীক্ষা (FBS / 2HABF)",
      procedureOrTestNameEn: "Fasting Blood Sugar / 2HABF",
      regularPriceRangeBn: "৳১০০ - ৳১৮০",
      durationOrTurnaroundBn: "২০-৩০ মিনিট",
    },
    {
      id: "ful-lipid-profile",
      categoryBn: "প্যাথলজি ও ল্যাব",
      procedureOrTestNameBn: "লিপিড প্রোফাইল টেস্ট (Fasting Lipid Profile)",
      procedureOrTestNameEn: "Fasting Lipid Profile (Cholesterol, TG, HDL, LDL)",
      regularPriceRangeBn: "৳৭০০ - ৳১,১০০",
      durationOrTurnaroundBn: "৩-৪ ঘণ্টার মধ্যে রিপোর্ট",
    },
    {
      id: "ful-serum-creatinine",
      categoryBn: "প্যাথলজি ও ল্যাব",
      procedureOrTestNameBn: "সিরাম ক্রিয়েটিনিন কিডনি টেস্ট (Serum Creatinine)",
      procedureOrTestNameEn: "Serum Creatinine Kidney Function Test",
      regularPriceRangeBn: "৳৩০০ - ৳৪৫০",
      durationOrTurnaroundBn: "২ ঘণ্টা",
    },
    {
      id: "ful-normal-delivery",
      categoryBn: "প্রসূতি ও মাতৃত্ব",
      procedureOrTestNameBn: "নরমাল ডেলিভারি প্যাকেজ (উপজেলা প্রাইভেট ক্লিনিক)",
      procedureOrTestNameEn: "Normal Delivery Package (Private Clinic)",
      regularPriceRangeBn: "৳৩,৫০০ - ৳৫,৫০০",
      durationOrTurnaroundBn: "২৪ ঘণ্টা পর্যবেক্ষণ ও ছাড়পত্র",
    },
    {
      id: "ful-cesarean-package",
      categoryBn: "প্রসূতি ও মাতৃত্ব",
      procedureOrTestNameBn: "সিজারিয়ান অপারেশন প্যাকেজ (LUSCS Package)",
      procedureOrTestNameEn: "Cesarean Delivery Package (LUSCS)",
      regularPriceRangeBn: "৳১৪,০০০ - ৳২২,০০০",
      durationOrTurnaroundBn: "৩-৪ দিন ইনডোর কেবিন",
    },
    {
      id: "ful-minor-trauma-suture",
      categoryBn: "জরুরি সেবা",
      procedureOrTestNameBn: "জরুরি ক্ষতের ড্রেসিং ও সেলাই (Minor Trauma Suture)",
      procedureOrTestNameEn: "Emergency Wound Dressing & Suturing",
      regularPriceRangeBn: "৳৩০০ - ৳৭০০",
      durationOrTurnaroundBn: "জরুরি বিভাগে তাৎক্ষণিক",
    },
    {
      id: "ful-ambulance-sadar",
      categoryBn: "অ্যাম্বুলেন্স রেফারেল",
      procedureOrTestNameBn: "জরুরি এসি অ্যাম্বুলেন্স (ফুলগাজী ⇄ ফেনী সদর হাসপাতাল)",
      procedureOrTestNameEn: "Emergency AC Ambulance (Fulgazi to Feni Sadar)",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৫০০",
      durationOrTurnaroundBn: "১৮-২৫ মিনিট যাতায়াত সময়",
    },
  ],
};
