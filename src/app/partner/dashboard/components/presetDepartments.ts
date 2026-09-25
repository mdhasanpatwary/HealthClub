export interface PresetDepartment {
  name: string;
  discount: string;
  description: string;
}

export const PRESET_DEPARTMENTS: PresetDepartment[] = [
  { name: "🧪 প্যাথলজি ল্যাব (Pathology)", discount: "25%", description: "সকল রুটিন রক্ত ও বায়োকেমিক্যাল টেস্ট" },
  { name: "🩻 রেডিওলজি ও ইমেজিং (Radiology)", discount: "20%", description: "এক্স-রে, আল্ট্রাসনোগ্রাম ও সিটি স্ক্যান" },
  { name: "🏥 কেবিন ও বেড ভাড়া (Cabin & Bed)", discount: "10%", description: "ইনডোর ভর্তি ও সাধারণ বেড ভাড়া" },
  { name: "💊 ফার্মেসি ও ওষুধ (Pharmacy)", discount: "5%", description: "সকল প্রয়োজনীয় প্রেসক্রিপশন মেডিসিন" },
  { name: "🩺 ডাক্তার ভিজিট (Doctor Visit)", discount: "15%", description: "বিশেষজ্ঞ চিকিৎসকের কনসালটেশন ফি" },
  { name: "🚑 এম্বুলেন্স সেবা (Ambulance)", discount: "10%", description: "জরুরি রোগী পরিবহন ও অক্সিজেন সুবিধা" },
  { name: "🦷 ডেন্টাল সেবা (Dental)", discount: "20%", description: "স্কেলিং, ফিলিং ও রুট ক্যানেল" },
  { name: "🔪 অপারেশন থিয়েটার / ওটি (OT)", discount: "15%", description: "মেজর ও মাইনর সার্জারি চার্জ" },
];

export function createDepartmentDiscountId(prefix = "dept") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
}
