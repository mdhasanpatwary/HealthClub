import { BroadcastAudienceType, BroadcastChannel } from "@/app/actions/broadcastActions";

export interface BroadcastPreset {
  id: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  iconName: string;
  category: "camp" | "discount" | "emergency" | "renewal" | "awareness";
  title: string;
  subject: string;
  badge: string;
  message: string;
  defaultAudience: BroadcastAudienceType;
  defaultChannels: BroadcastChannel[];
  actionUrl: string;
  actionText: string;
}

export const BROADCAST_PRESETS: BroadcastPreset[] = [
  {
    id: "free_health_camp",
    nameBn: "বিনামূল্যে স্বাস্থ্য ক্যাম্প",
    nameEn: "Free Health Camp",
    descriptionBn: "ফ্রি বিশেষজ্ঞ ডাক্তার ও ডায়াবেটিস পরীক্ষা ক্যাম্পের ঘোষণা",
    descriptionEn: "Announcement for free specialist camp and diabetes checkup",
    iconName: "Stethoscope",
    category: "camp",
    title: "বিনামূল্যে বিশেষজ্ঞ ডাক্তার কনসালটেশন ও স্বাস্থ্য ক্যাম্প",
    subject: "হেলথ ক্লাব আয়োজিত ফ্রি বিশেষজ্ঞ মেডিকেল ক্যাম্প ও হেলথ চেকআপ",
    badge: "ফ্রি স্বাস্থ্য ক্যাম্প",
    message:
      "প্রিয় সুধী,\n\nআসন্ন শুক্রবার হেলথ ক্লাবের উদ্যোগে ফেনী সেন্ট্রাল পয়েন্টে অনুষ্ঠিত হতে যাচ্ছে দিনব্যাপী 'ফ্রি বিশেষজ্ঞ স্বাস্থ্য ও ডায়াবেটিস পরীক্ষা ক্যাম্প'।\n\nক্যাম্পে উপস্থিত থাকবেন মেডিসিন, হৃদরোগ ও শিশু বিশেষজ্ঞ চিকিৎসকবৃন্দ। হেলথ ক্লাব মেম্বারদের জন্য রয়েছে অগ্রাধিকারমূলক সেবা ও ফ্রি প্রেসক্রিপশন সুবিধা।\n\nস্থান: মিজান রোড, ফেনী।\nসময়: সকাল ৯:০০ টা থেকে বিকেল ৪:০০ টা পর্যন্ত।",
    defaultAudience: "all_members",
    defaultChannels: ["email", "sms", "in_app"],
    actionUrl: "https://healthclubbd.org/consultants",
    actionText: "ক্যাম্প ও ডাক্তার তালিকা দেখুন",
  },
  {
    id: "new_hospital_discount",
    nameBn: "নতুন হাসপাতাল ডিসকাউন্ট",
    nameEn: "New Hospital Discount",
    descriptionBn: "নতুন পার্টনার হাসপাতাল বা ডায়াগনস্টিক সেন্টারের ছাড় ঘোষণা",
    descriptionEn: "Announce new partner hospital or pathology lab discount",
    iconName: "Building2",
    category: "discount",
    title: "নতুন পার্টনার হাসপাতাল যুক্ত হয়েছে — সকল পরীক্ষায় বিশেষ ছাড়!",
    subject: "হেলথ ক্লাবের নতুন পার্টনার হাসপাতাল ও ডায়াগনস্টিক সুবিধা",
    badge: "নতুন পার্টনার",
    message:
      "প্রিয় সদস্য,\n\nসুসংবাদ! হেলথ ক্লাব নেটওয়ার্কে নতুন চুক্তিবদ্ধ হয়েছে শীর্ষস্থানীয় আধুনিক চিকিৎসাকেন্দ্র।\n\nএখন থেকে আপনার ডিজিটাল হেলথ ক্লাব মেম্বারশিপ কার্ড প্রদর্শন করে প্যাথলজি, এক্স-রে, আল্ট্রাসনোগ্রাম ও সিটি স্ক্যানসহ সকল ইনডোর ও আউটডোর সেবায় সর্বোচ্চ ৩০% পর্যন্ত ক্যাশলেস ডিসকাউন্ট উপভোগ করতে পারবেন।\n\nকাউন্টার বা রিসেপশনে আপনার মেম্বার আইডি বা ডিজিটাল কার্ডের QR কোড দেখান।",
    defaultAudience: "active_members",
    defaultChannels: ["email", "sms", "in_app"],
    actionUrl: "https://healthclubbd.org/partner-hospitals",
    actionText: "পার্টনার তালিকা ও ছাড়ের হার দেখুন",
  },
  {
    id: "urgent_blood_appeal",
    nameBn: "জরুরি রক্তের আবেদন",
    nameEn: "Urgent Blood Appeal",
    descriptionBn: "মুমূর্ষু রোগীর জন্য তাৎক্ষণিক রক্তদাতার জরুরি আবেদন",
    descriptionEn: "Urgent appeal for emergency blood donors",
    iconName: "Droplet",
    category: "emergency",
    title: "জরুরি রক্তের আবেদন — একজন মুমূর্ষু রোগীর জন্য রক্ত প্রয়োজন",
    subject: "জরুরি আবেদন: রক্তের প্রয়োজন — ফেনী সদর হাসপাতাল",
    badge: "জরুরি রক্তদান",
    message:
      "জরুরি সতর্কতা:\n\nফেনী সদর হাসপাতালে ভর্তি একজন জরুরি রোগীর অপারেশনের জন্য জরুরী ভিত্তিতে ও-পজিটিভ (O+) রক্তের প্রয়োজন।\n\nআপনার বা পরিচিত কারো এই রক্তের গ্রুপ থাকলে অনুগ্রহ করে অবিলম্বে আমাদের জরুরি হটলাইনে বা রক্তদাতা কোঅর্ডিনেটরের সাথে যোগাযোগ করে জীবন বাঁচানোর মহৎ কাজে এগিয়ে আসুন।\n\nহটলাইন: +৮৮০ ১৮৮৬৭৬৩৮৪৯",
    defaultAudience: "blood_donors",
    defaultChannels: ["sms", "in_app"],
    actionUrl: "https://healthclubbd.org/emergency",
    actionText: "জরুরি রক্তদাতা নেটওয়ার্ক দেখুন",
  },
  {
    id: "renewal_reminder",
    nameBn: "মেম্বারশিপ নবায়ন রিমাইন্ডার",
    nameEn: "Membership Renewal Alert",
    descriptionBn: "মেয়াদোত্তীর্ণ বা আসন্ন নবায়নযোগ্য সদস্যদের জন্য নোটিশ",
    descriptionEn: "Reminder for expired or expiring members to renew",
    iconName: "RotateCcw",
    category: "renewal",
    title: "আপনার হেলথ ক্লাব মেম্বারশিপ নবায়ন করুন ও ডিসকাউন্ট সচল রাখুন",
    subject: "মেম্বারশিপ নবায়ন রিমাইন্ডার — হেলথ ক্লাব ফেনী",
    badge: "নবায়ন নোটিশ",
    message:
      "প্রিয় সদস্য,\n\nআপনার ডিজিটাল হেলথ কার্ডের মেয়াদ সমাপ্ত হতে চলেছে। নিরবচ্ছিন্নভাবে ৫০+ পার্টনার হাসপাতালে ডিসকাউন্ট, বিশেষজ্ঞ ডাক্তার সিরিয়াল ও জরুরি অ্যাম্বুলেন্স সেবা সচল রাখতে এখনই বার্ষিক মেম্বারশিপ নবায়ন সম্পন্ন করুন।\n\nঅনলাইনে বিকাশ বা ড্যাশবোর্ড থেকে সহজেই নবায়ন আবেদন জমা দিন।",
    defaultAudience: "inactive_members",
    defaultChannels: ["email", "sms", "in_app"],
    actionUrl: "https://healthclubbd.org/dashboard/renew",
    actionText: "অনলাইনে নবায়ন সম্পন্ন করুন",
  },
  {
    id: "seasonal_health_advisory",
    nameBn: "মৌসুমি স্বাস্থ্য সতর্কতা",
    nameEn: "Seasonal Health Advisory",
    descriptionBn: "ডেঙ্গু, ফ্লু বা তীব্র তাপপ্রবাহের স্বাস্থ্য সচেতনতা ও পরামর্শ",
    descriptionEn: "Dengue, flu or seasonal weather health advisory",
    iconName: "BookOpen",
    category: "awareness",
    title: "মৌসুমি রোগ প্রতিরোধে স্বাস্থ্য সচেতনতা ও ডাক্তারের বিশেষ পরামর্শ",
    subject: "স্বাস্থ্য সচেতনতা বার্তা — সুস্থ থাকুন সুরক্ষিত থাকুন",
    badge: "স্বাস্থ্য পরামর্শ",
    message:
      "প্রিয় সুধী,\n\nমৌসুমি ফ্লু ও ডেঙ্গু প্রতিরোধে পর্যাপ্ত বিশুদ্ধ পানি পান করুন, জমে থাকা পরিষ্কার পানি ধ্বংস করুন এবং জ্বরের লক্ষণ দেখা দিলে অ্যান্টিবায়োটিক না খেয়ে অভিজ্ঞ চিকিৎসকের পরামর্শ নিন।\n\nহেলথ ক্লাবের নিবন্ধিত ডাক্তারদের পূর্ণাঙ্গ পরামর্শ আর্টিকেল পড়তে নিচের লিঙ্কে ক্লিক করুন।",
    defaultAudience: "all_users",
    defaultChannels: ["email", "in_app"],
    actionUrl: "https://healthclubbd.org/health-tips",
    actionText: "স্বাস্থ্য টিপস ও গাইড পড়ুন",
  },
];
