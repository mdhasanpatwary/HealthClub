import { BlogPost } from "@/types/blog";
import { FENI_DENGUE_TYPHOID_PRICING } from "./feniDengueTyphoidPricing";
import {
  FENI_DENGUE_TYPHOID_COMPARISON_TABLE,
  FENI_DENGUE_TYPHOID_PROVIDERS,
} from "./feniDengueTyphoidCenters";

export const FENI_DENGUE_TYPHOID_GUIDE: BlogPost = {
  slug: "dengue-and-typhoid-test-cost-management-guide-feni",
  titleBn:
    "ফেনীতে ডেঙ্গু ও টাইফয়েড জ্বর: টেস্ট খরচ, প্লাটিলেট মনিটরিং ও ভর্তি গাইড ২০২৬: এনএস১, সিবিসি, আইভি ফ্লুইড ও হাসপাতাল নিয়ম",
  titleEn:
    "Feni Dengue & Typhoid Fever Guide (2026) - NS1/CBC Testing, Platelet Monitoring, IV Fluid Protocols & Hospital Bed Charges",
  excerptBn:
    "ফেনীতে তীব্র জ্বর, ডেঙ্গু এনএস১ বা টাইফয়েড টেস্ট ও প্লাটিলেট কাউন্ট করাতে চাচ্ছেন? ডেঙ্গু ও টাইফয়েডের পার্থক্য, প্লাজমা লিকেজের বিপদচিহ্ন, সঠিক আইভি ফ্লুইড নিয়ম ও ফেনী সদরে হাসপাতাল ভর্তির পূর্ণাঙ্গ গাইড।",
  excerptEn:
    "Authoritative clinical and diagnostic guide to Dengue NS1 antigen, serial CBC platelet & hematocrit monitoring, plasma leakage warning signs, IV fluid management, and hospital admissions across Feni Sadar with 10-30% Health Club member discounts.",
  category: "emergency-care",
  categoryNameBn: "জরুরি সেবা ও সংক্রামক রোগ",
  categoryNameEn: "Emergency Care & Infectious Disease",
  publishedDate: "2026-03-24",
  modifiedDate: "2026-09-23",
  readTimeBn: "১৫ মিনিট পাঠ",
  readTimeEn: "15 min read",
  author: {
    nameBn: "মেডিকেল এডিটোরিয়াল টিম",
    nameEn: "Medical Editorial Team",
    roleBn: "হেলথ ক্লাব ইনফেকশাস ডিজিজ ও এপিডেমিওলজি রিসার্চ",
    roleEn: "Health Club Infectious Disease & Epidemiology Research",
    avatarUrl: "/images/member-card-logo.webp",
  },
  coverImage:
    "/images/blog/dengue-and-typhoid-test-cost-management-guide-feni.webp",
  coverImageAlt:
    "Feni Dengue and Typhoid Fever Testing and Hospital Admission Guide 2026 - Health Club",
  tags: [
    "ফেনীতে ডেঙ্গু টেস্ট খরচ",
    "প্লাটিলেট কাউন্ট টেস্ট",
    "ডেঙ্গু হলে স্যালাইন ও হাসপাতালে ভর্তি নিয়ম",
    "টাইফয়েড জ্বরের চিকিৎসা ফেনী",
    "Dengue Test Price Feni",
    "CBC Platelet Count Test Feni",
    "Typhoid Widal Test Feni",
  ],
  metaKeywords: [
    "dengue test price feni",
    "cbc platelet count test feni",
    "typhoid widal test feni",
    "ফেনীতে ডেঙ্গু টেস্ট খরচ",
    "প্লাটিলেট কাউন্ট টেস্ট",
    "ডেঙ্গু হলে স্যালাইন ও হাসপাতালে ভর্তি নিয়ম",
    "টাইফয়েড জ্বরের চিকিৎসা ফেনী",
    "dengue ns1 antigen cost feni",
    "typhidot test price feni",
    "feni sadar hospital dengue corner",
    "al aqsa hospital dengue admission",
    "platelet transfusion feni",
  ],
  keyHighlightsBn: [
    "ডেঙ্গু এনএস১ বনাম অ্যান্টিবডি টেস্টের সঠিক সময়: জ্বরের ১ম থেকে ৩য় দিনে এনএস১ (NS1) অ্যান্টিজেন এবং ৫ম দিন থেকে আইজিএম/আইজিজি (IgM/IgG) অ্যান্টিবডি টেস্ট করানো চিকিৎসাগতভাবে নির্ভুল।",
    "হেমাটোক্রিট (HCT) ও প্লাজমা লিকেজ মনিটরিং: ডেঙ্গুতে শুধু প্লাটিলেট নয়, হেমাটোক্রিট ২০% এর বেশি বৃদ্ধি পাওয়া মারাত্মক রক্তনালীর প্লাজমা লিকেজের প্রধান পূর্বলক্ষণ।",
    "লাল পতাকা বা বিপদচিহ্ন (Red Flag Signs): তীব্র পেটব্যথা, অবিরাম বমি, মাড়ি বা নাক দিয়ে রক্তপাত, চরম অস্থিরতা ও ব্লাড প্রেশার কমে যাওয়া দেখা দিলে অনতিবিলম্বে হাসপাতালে ভর্তি জরুরি।",
    "সঠিক আইভি ফ্লুইড বনাম ওভারহাইড্রেশন ঝুঁকি: চিকিৎসকের নির্দেশনা ছাড়া যত্রতত্র স্যালাইন দেওয়া নিষেধ; প্লাজমা লিকেজ ফেজ শেষ হলে স্যালাইন বন্ধ না করলে ফুসফুসে পানি জমে রোগী মারা যেতে পারেন।",
    "পেইনকিলার ও এনএসএআইডি (NSAID) সম্পূর্ণ নিষিদ্ধ: ডেঙ্গু সন্দেহে অ্যাসপিরিন, আইবুপ্রোফেন, ন্যাপ্রোক্সেন বা ডাইক্লোফেনাক সেবন করলে মারাত্মক অভ্যন্তরীণ রক্তক্ষরণ হতে পারে; কেবল প্যারাসিটামল প্রযোজ্য।",
    "টাইফয়েড ব্লাড কালচার গোল্ড স্ট্যান্ডার্ড: ওয়াইডাল টেস্টের চেয়ে জ্বরের প্রথম সপ্তাহে স্বয়ংক্রিয় ব্লাড কালচার অ্যান্টিবায়োটিক প্রতিরোধের যুগে সবচেয়ে নির্ভরযোগ্য পরীক্ষা।",
    "হেলথ ক্লাব মেম্বারদের নিশ্চিত আর্থিক সুবিধা: ফেনী সদরের চুক্তিবদ্ধ পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে ডেঙ্গু-টাইফয়েড টেস্ট ও ইনডোর বেডে নিশ্চিত ১০-৩০% মেম্বার ছাড়।",
  ],
  introParagraphsBn: [
    "বর্ষা ও বর্ষা-পরবর্তী মৌসুমে ফেনী জেলা জুড়ে ডেঙ্গু ও টাইফয়েড জ্বরের প্রকোপ আশঙ্কাজনকভাবে বৃদ্ধি পায়। এডিস এজিপ্টি মশার কামড়ে সংক্রামিত ডেঙ্গু ভাইরাস এবং দূষিত পানি ও খাবারের মাধ্যমে সংক্রামিত সালমোনেলা টাইফি ব্যাকটেরিয়া জনিত টাইফয়েড—উভয় রোগই তীব্র জ্বর নিয়ে আত্মপ্রকাশ করলেও এদের চিকিৎসার ধরন সম্পূর্ণ বিপরীত। ডেঙ্গু একটি সেলফ-লিমিটিং ভাইরাল সংক্রমণ যেখানে কোনো অ্যান্টিবায়োটিক কাজ করে না এবং মূল চিকিৎসা হলো নিখুঁত ফ্লুইড ও ভাইটালস ম্যানেজমেন্ট। অন্যদিকে টাইফয়েড একটি ব্যাকটেরিয়াল সিস্টেমিক ইনফেকশন, যার ক্ষেত্রে কালচার সংবেদনশীল সুনির্দিষ্ট অ্যান্টিবায়োটিক থেরাপির প্রয়োজন হয়। সচেতনতার অভাবে অনেক রোগী জ্বরের শুরুতে ফার্মেসি থেকে অতিরিক্ত অ্যান্টিবায়োটিক বা ক্ষতিকর ব্যথানাশক সেবন করে অভ্যন্তরীণ রক্তক্ষরণ ও কিডনি বিকলতার মতো জটিলতায় পড়েন।",
    "ডেঙ্গু টেস্ট ও প্লাটিলেট কাউন্টের ক্ষেত্রে সময়জ্ঞান অত্যন্ত সংবেদনশীল ক্লিনিক্যাল বিষয়। রোগীর শরীরে জ্বর আসার প্রথম ১ থেকে ৩ দিনের মধ্যে 'ডেঙ্গু এনএস১ অ্যান্টিজেন' (Dengue NS1 Ag) পরীক্ষা করালে সর্বোচ্চ নির্ভুলতা পাওয়া যায়। কিন্তু ৫ম দিনের পর রক্তে ভাইরাসের উপস্থিতি কমে গিয়ে অ্যান্টিবডি তৈরি হতে থাকে; ফলে এ সময়ে এনএস১ টেস্ট নেগেটিভ এলেও রোগী মারাত্মক ডেঙ্গুতে আক্রান্ত থাকতে পারেন। ৫ম দিন থেকে ডেঙ্গু আইজিএম (IgM) ও আইজিজি (IgG) অ্যান্টিবডি পরীক্ষা করা আদর্শ। এছাড়া ডেঙ্গু রোগীদের রক্তে প্লাটিলেটের স্বাভাবিক মাত্রা দেড় লাখ (১,৫০,০০০) থেকে সাড়ে চার লাখের নিচে নেমে যেতে পারে। তবে ক্লিনিক্যাল গবেষণায় দেখা গেছে, শুধু প্লাটিলেট কমে যাওয়া ডেঙ্গুর মৃত্যুর মূল কারণ নয়; মূল বিপদ হলো রক্তনালীর ছিদ্র বড় হয়ে প্লাজমা লিকেজ হওয়া। রক্তে হেমাটোক্রিট (Hematocrit / HCT) মাত্রা বেসলাইনের চেয়ে ২০% এর বেশি বেড়ে যাওয়া হলো মারাত্মক প্লাজমা লিকেজ ও ডেঙ্গু শক সিন্ড্রোমের প্রধান সতর্কবার্তা।",
    "ডেঙ্গু রোগীদের ক্ষেত্রে আইভি ফ্লুইড (স্যালাইন) প্রয়োগের নিয়ম অত্যন্ত সতর্কতার সাথে মেনে চলা আবশ্যক। সাধারণ ক্ষেত্রে মুখে খাবার স্যালাইন (ORS), ডাবের পানি, তাজা ফলের রস ও স্যুপ পর্যাপ্ত। কিন্তু রোগী যদি মুখে খাবার রাখতে না পারেন বা হেমাটোক্রিট দ্রুত বাড়তে থাকে, তবে হাসপাতালে নরমাল স্যালাইন (০.৯%) বা রিঙ্গার্স ল্যাকটেট আইভি ফ্লুইড হিসেবে শুরু করতে হয়। কখনোই ডিএনএস বা ডেক্সট্রোজ ওয়াটার দিয়ে শক রিকভারি করা যায় না। সবচেয়ে গুরুত্বপূর্ণ বিষয় হলো, প্লাজমা লিকেজের ক্রিটিক্যাল ফেজ সাধারণত ২৪ থেকে ৪৮ ঘণ্টা স্থায়ী হয়। লিকেজ বন্ধ হওয়ার পর অতিরিক্ত স্যালাইন চালিয়ে গেলে তা ফুসফুসে জমে মারাত্মক পালমোনারি এডিমা (ফুসফুসে পানি জমা) ও হৃদযন্ত্র বিকল করতে পারে। তাই হাসপাতালে ভর্তির মাধ্যমে প্রতি ৪-৬ ঘণ্টা পর পর রক্তচাপ, পালস প্রেশার ও প্রস্রাবের পরিমাণ (কমপক্ষে ০.৫ মিলি/কেজি/ঘণ্টা) মেপে স্যালাইনের গতি নিয়ন্ত্রণ করতে হয়।",
    "ফেনী সদর এলাকায় [আল-আকসা হাসপাতাল লিঃ](/blog/feni-icu-ccu-nicu-bed-charges-and-facilities-guide)-এর মতো অফিসিয়াল পার্টনার হাসপাতালে সার্বক্ষণিক জরুরি ডেঙ্গু ভর্তি, এইচডিইউ পর্যবেক্ষণ ও স্ট্যাট ল্যাব সুবিধা রয়েছে। এছাড়া প্যাসিফিক হেলথ কেয়ার, লাইফ কেয়ার, ইম্পেরিয়াল ও ফেনী ম্যাক্স সেন্টারে দ্রুততম সময়ে ৫-পার্ট অটোমেটেড সিবিসি প্লাটিলেট রিপোর্ট পাওয়া যায়। সরকারিভাবে নামমাত্র মূল্যে ডেঙ্গু পরীক্ষার জন্য [ফেনী ২৫০ শয্যা জেনারেল হাসপাতাল](/blog/feni-sadar-hospital-guide)-এ ডেঙ্গু কর্নার ও ডেডিকেটেড আইসোলেশন ওয়ার্ড সার্বক্ষণিক সচল রয়েছে। যেকোনো জরুরি রক্ত বা প্লাটিলেট প্রয়োজনে আমাদের [ফেনী ব্লাড ব্যাংক গাইড](/blog/feni-blood-bank-and-donors-guide) এবং স্থানান্তরে [২৪/৭ অ্যাম্বুলেন্স সেবা](/blog/feni-ambulance-and-oxygen-service-guide) সার্বক্ষণিক প্রস্তুত। হেলথ ক্লাব মেম্বাররা ফেনীর পার্টনার হাসপাতাল ও ডায়াগনস্টিকে টেস্ট ও ইনডোর বেডে নিশ্চিত ১০-৩০% মেম্বার ছাড় উপভোগ করেন।",
  ],
  comparisonTable: FENI_DENGUE_TYPHOID_COMPARISON_TABLE,
  hospitals: FENI_DENGUE_TYPHOID_PROVIDERS,
  dengueTyphoidPricingBn: FENI_DENGUE_TYPHOID_PRICING,
  bookingGuideBn: {
    titleBn: "৪টি ধাপে ফেনীতে জরুরি ডেঙ্গু-টাইফয়েড টেস্ট ও হাসপাতালে ভর্তির নিয়ম",
    stepsBn: [
      {
        step: "১ম ধাপ: জ্বরের দিন গণনা ও সঠিক পরীক্ষা নির্বাচন করুন",
        title: "১-৩ দিনে ডেঙ্গু এনএস১ ও সিবিসি; ৫ম দিন থেকে অ্যান্টিবডি ও টাইফয়েড কালচার",
        desc: "জ্বর শুরুর দিনক্ষণ হিসাব করে রেজিস্টার্ড ডাক্তারের পরামর্শে এনএস১ অ্যান্টিজেন ও ৫-পার্ট সিবিসি প্লাটিলেট টেস্ট করান।",
      },
      {
        step: "২য় ধাপ: প্লাটিলেট ও হেমাটোক্রিট (HCT) রিপোর্ট সতর্কতার সাথে বিশ্লেষণ",
        title: "প্লাটিলেট ১ লাখের নিচে নামলে এবং হেমাটোক্রিট বৃদ্ধি পেলে সতর্ক হোন",
        desc: "ল্যাব রিপোর্ট পাওয়ার পর শুধু প্লাটিলেট নয়, হেমাটোক্রিট বাড়ছে কিনা লক্ষ্য রাখুন এবং প্রতি ২৪ ঘণ্টায় ডাক্তারের কাছে রিপোর্ট প্রদর্শন করুন।",
      },
      {
        step: "৩য় ধাপ: কোনো বিপদচিহ্ন (Red Flags) দেখা দিলে তাৎক্ষণিক হাসপাতালে ভর্তি",
        title: "তীব্র পেটব্যথা, অবিরাম বমি বা রক্তপাতে জরুরি ওয়ার্ড বা কেবিন নিশ্চিত করুন",
        desc: "বিপদচিহ্ন দেখা দিলে বাসায় অপেক্ষা না করে ফেনী সদরের পার্টনার হাসপাতাল বা সদর হাসপাতালের ডেঙ্গু কর্নারে জরুরি ভর্তি হোন।",
      },
      {
        step: "৪র্থ ধাপ: মেম্বার কার্ড প্রদর্শন ও ১০-৩০% বিশেষ ছাড় উপভোগ",
        title: "ইনডোর বেড, নার্সিং ও প্যাথলজি টেস্টে ডিজিটাল হেলথ ক্লাব কার্ডের সুবিধা",
        desc: "আল-আকসা হাসপাতাল লিঃ ও প্যাসিফিক হেলথ কেয়ারসহ পার্টনার কেন্দ্রে কার্ড প্রদর্শন করে নির্ধারিত টেস্ট ও বেড চার্জে ১০-৩০% ছাড় নিশ্চিত করুন।",
      },
    ],
  },
  bookingGuideEn: {
    titleEn: "4 Simple Steps to Manage Dengue & Typhoid Testing and Hospital Admission in Feni",
    stepsEn: [
      {
        step: "Step 1: Calculate Fever Days & Select the Correct Diagnostic Modality",
        title: "Dengue NS1 Ag & CBC for Days 1-3; IgM/IgG Serology & Blood Culture for Day 5+",
        desc: "Identify the exact onset of fever and obtain physician-guided laboratory requisitions to avoid premature or delayed testing windows.",
      },
      {
        step: "Step 2: Monitor Serial Platelet Counts & Hematocrit (HCT) Hemoconcentration",
        title: "Identify thrombocytopenia alongside critical hematocrit elevation (>20%)",
        desc: "A rising hematocrit flags life-threatening plasma leakage. Correlate automated 5-part hematology results with clinical hemodynamics.",
      },
      {
        step: "Step 3: Immediate Hospital Admission Upon Emergence of Warning Signs",
        title: "Persistent vomiting, severe abdominal pain, or mucosal bleeding require STAT triage",
        desc: "Bypass home management immediately and admit the patient to accredited private fever wings (Al-Aqsa Hospital Ltd) or Sadar Hospital's Dengue Corner.",
      },
      {
        step: "Step 4: Present Health Club Digital Membership for 10-30% Discounts",
        title: "Claim guaranteed savings across inpatient beds, pathology, and monitoring",
        desc: "Show your active Health Club digital card upon admission or laboratory registration at accredited partner facilities across Feni Sadar.",
      },
    ],
  },
  selectionGuideBn: {
    titleBn: "নিরাপদ ডেঙ্গু ও টাইফয়েড ডায়াগনস্টিক ও হাসপাতাল নির্বাচনের ৪টি মানদণ্ড",
    pointsBn: [
      {
        title: "১. ৫-পার্ট অটোমেটেড হেমাটোলজি অ্যানালাইজার ও স্ট্যাট প্লাটিলেট টার্নঅ্যারাউন্ড",
        desc: "ল্যাবরেটরিতে আন্তর্জাতিক মানের ৫-পার্ট অটো সেল কাউন্টার রয়েছে কিনা এবং জরুরি প্রয়োজনে ৩০-৪৫ মিনিটের মধ্যে প্লাটিলেট রিপোর্ট পাওয়া যায় কিনা তা যাচাই করুন।",
      },
      {
        title: "২. ২৪ ঘণ্টা জরুরি আইভি ফ্লুইড মনিটরিং ও মেডিকেল অফিসার ব্যাকআপ",
        desc: "হাসপাতালে মধ্যরাতে ডেঙ্গু রোগীর ব্লাড প্রেশার ও পালস প্রেশার ড্রপ করলে তাৎক্ষণিক স্যালাইন টাইট্রেশন করার মতো সার্বক্ষণিক ডাক্তার ও নার্স উপস্থিত আছেন কিনা নিশ্চিত হোন।",
      },
      {
        title: "৩. আইসিইউ ও এইচডিইউ ক্রিটিক্যাল কেয়ার এবং ব্লাড ব্যাংক নেটওয়ার্ক",
        desc: "ডেঙ্গু শক সিন্ড্রোম বা তীব্র রক্তপাতের ক্ষেত্রে রোগীকে বাঁচানোর জন্য সেন্ট্রাল অক্সিজেন, এইচডিইউ/আইসিইউ এবং দ্রুত প্লাটিলেট সংগ্রহের ব্যবস্থা থাকা জরুরি।",
      },
      {
        title: "৪. সরকারি ডেঙ্গু কর্নার বা অনুমোদিত বেসরকারি পার্টনার হাসপাতালের স্বচ্ছতা",
        desc: "সরকারি জেনারেল হাসপাতালের ডেঙ্গু কর্নার অথবা হেলথ ক্লাবের চুক্তিবদ্ধ পার্টনার হাসপাতালে স্বচ্ছ বেড চার্জ ও ছাড়ের সুনির্দিষ্ট নীতিমালা দেখে সিদ্ধান্ত নিন।",
      },
    ],
  },
  emergencyDirectoryBn: {
    titleBn: "ফেনী জরুরি জ্বর, ডেঙ্গু ও টাইফয়েড ভর্তি এবং ল্যাব হটলাইন ২৪/৭ ডিরেক্টরি",
    services: [
      {
        name: "আল-আকসা হাসপাতাল লিঃ ফেনী (জরুরি ডেঙ্গু ভর্তি ও এইচডিইউ)",
        phone: "01815076266",
        note: "খাজুরিয়া কোট বিল্ডিং, ট্রাংক রোড। ২৪/৭ ফিভার কেয়ার, কেবিন ও মেম্বার ছাড়",
      },
      {
        name: "প্যাসিফিক হেলথ কেয়ার (স্ট্যাট সিবিসি ও ডেঙ্গু এলাইজা ল্যাব)",
        phone: "01819887766",
        note: "জিরো পয়েন্ট, এসএসকে রোড। ৫-পার্ট অটো সেল কাউন্টার ও মেম্বার ছাড়",
      },
      {
        name: "লাইফ কেয়ার ডায়াগনস্টিক (হোম ব্লাড স্যাম্পল কালেকশন)",
        phone: "01819112233",
        note: "এসএসকে রোড, ফেনী সদর। ডেঙ্গু এনএস১ ও সিবিসি হোম সার্ভিস ও মেম্বার ছাড়",
      },
      {
        name: "ফেনী ২৫০ শয্যা জেনারেল হাসপাতাল (সরকারি ডেঙ্গু কর্নার)",
        phone: "02334474011",
        note: "হাসপাতাল মোড়, জেল রোড। ডেডিকেটেড ডেঙ্গু ওয়ার্ড ও নামমাত্র সরকারি ফি",
      },
      {
        name: "ইম্পেরিয়াল নিউরোকেয়ার ও ডায়াগনস্টিক (ল্যাব ও স্পেশালিস্ট ওপিডি)",
        phone: "01819445566",
        note: "এসএসকে রোড, ফেনী সদর। ইলেক্ট্রোলাইটস ও মেডিসিন বিশেষজ্ঞ চেম্বার",
      },
      {
        name: "ফেনী ম্যাক্স ডায়াগনস্টিক সেন্টার (হেমাটোলজি ও বায়োকেমিস্ট্রি)",
        phone: "01819776655",
        note: "ট্রাংক রোড, ফেনী সদর। ওয়াইডাল, ডেঙ্গু সেরোলজি ও মেম্বার ছাড়",
      },
      {
        name: "রেড ক্রিসেন্ট ব্লাড ব্যাংক ফেনী (জরুরি প্লাটিলেট ও ফ্রেশ ব্লাড)",
        phone: "01819778899",
        note: "কোর্ট কম্পাউন্ড রোড। তীব্র রক্তপাতে জরুরি ফ্রেশ হোল ব্লাড সহায়তা",
      },
      {
        name: "ফেনী সেন্ট্রাল অ্যাম্বুলেন্স সার্ভিস (জরুরি রোগী স্থানান্তর)",
        phone: "01819000111",
        note: "তীব্র ডেঙ্গু শকে আক্রান্ত রোগীকে অক্সিজেনসহ দ্রুত হাসপাতালে পরিবহন",
      },
    ],
  },
  faqs: [
    {
      questionBn: "জ্বরের কততম দিনে ডেঙ্গু এনএস১ (NS1) অ্যান্টিজেন টেস্ট করালে সবচেয়ে সঠিক রিপোর্ট পাওয়া যায়?",
      questionEn: "On which day of fever is the Dengue NS1 antigen test most clinically accurate?",
      answerBn:
        "জ্বর শুরু হওয়ার ১ম থেকে ৩য় দিনের মধ্যে ডেঙ্গু এনএস১ টেস্ট করানো সবচেয়ে উত্তম। এ সময় রক্তে ভাইরাসের উপস্থিতি (ভিরিমিয়া) সবচেয়ে বেশি থাকে। জ্বর ৫ দিনের বেশি হয়ে গেলে রক্তে এনএস১ অ্যান্টিজেনের মাত্রা দ্রুত কমে যায় এবং অ্যান্টিবডি তৈরি হয়; ফলে ৫ম দিনের পর এনএস১ নেগেটিভ এলেও রোগীর ডেঙ্গু থাকতে পারে। ৫ম দিন থেকে ডেঙ্গু আইজিএম (IgM) ও আইজিজি (IgG) অ্যান্টিবডি টেস্ট করাতে হয়।",
      answerEn:
        "The Dengue NS1 antigen test demonstrates highest diagnostic sensitivity when performed during Days 1 to 3 of fever onset, coinciding with peak viremia. By Day 5, viral antigen levels clear rapidly as endogenous antibodies emerge; hence, a negative NS1 result past Day 4 does not rule out dengue. From Day 5 onwards, Dengue IgM and IgG antibody serology should be performed.",
    },
    {
      questionBn: "ডেঙ্গু হলে প্লাটিলেটের পাশাপাশি হেমাটোক্রিট (Hematocrit / HCT) পরীক্ষা করা কেন বেশি গুরুত্বপূর্ণ?",
      questionEn: "Why is monitoring Hematocrit (HCT) as critical as tracking platelet counts in Dengue fever?",
      answerBn:
        "অধিকাংশ মানুষ কেবল প্লাটিলেটের দিকে নজর দেন, কিন্তু ডেঙ্গুর প্রধান প্রাণঘাতী জটিলতা হলো রক্তনালী ছিদ্র হয়ে রক্তরস বা প্লাজমা বাইরে বেরিয়ে যাওয়া (Plasma Leakage)। প্লাজমা বেরিয়ে গেলে রক্ত ঘন হয়ে যায়, যা হেমাটোক্রিট (HCT) পরীক্ষার মাধ্যমে ধরা পড়ে। সাধারণ সুস্থ মানুষের চেয়ে হেমাটোক্রিট ২০% বা তার বেশি বেড়ে যাওয়া ডেঙ্গু শক সিন্ড্রোম ও অভ্যন্তরীণ রক্তক্ষরণের প্রধান পূর্বাভাস। তাই নিয়মিত সিবিসিতে প্লাটিলেট ও হেমাটোক্রিট দুটোই দেখতে হয়।",
      answerEn:
        "While public attention concentrates on thrombocytopenia, the primary lethal complication of severe dengue is vascular endothelial hyperpermeability causing plasma leakage. As intravascular volume leaks into third spaces, hemoconcentration occurs, reflected by elevated hematocrit. A greater than 20% rise in hematocrit from baseline is the cardinal herald of impending Dengue Shock Syndrome, necessitating strict serial CBC monitoring.",
    },
    {
      questionBn: "ডেঙ্গু রোগীদের কোন কোন বিপদচিহ্ন (Red Flag Signs) দেখা দিলে দেরি না করে তাৎক্ষণিক হাসপাতালে ভর্তি হতে হবে?",
      questionEn: "What critical warning signs (Red Flags) necessitate immediate hospital admission for a Dengue patient?",
      answerBn:
        "যদি রোগীর (১) তীব্র ও অবিরাম পেটব্যথা থাকে, (২) বারবার বমি হয় এবং মুখে কোনো তরল না রাখতে পারেন, (৩) নাক, দাঁতের মাড়ি বা কাশির সাথে রক্তপাত হয় কিংবা কালো পায়খানা হয়, (৪) চরম অস্থিরতা, ক্লান্তি বা রক্তচাপ অতিরিক্ত কমে যায়, (৫) পেটে বা বুকে পানি জমে, অথবা (৬) প্লাটিলেট দ্রুত ৫০,০০০ এর নিচে নেমে যায়—তবে মুহূর্তের দেরি না করে রোগীকে হাসপাতালে ভর্তি করতে হবে।",
      answerEn:
        "Immediate hospital admission is mandated if the patient develops: (1) severe, persistent abdominal pain, (2) refractory vomiting preventing oral rehydration, (3) mucosal bleeding (epistaxis, gingival bleed, melena, hematemesis), (4) clinical fluid accumulation (ascites, pleural effusion), (5) profound lethargy, restlessness, or narrowing pulse pressure (<20 mmHg), or (6) rapidly precipitating thrombocytopenia below 50,000/μL.",
    },
    {
      questionBn: "ডেঙ্গু জ্বরে আক্রান্ত রোগীকে ব্যথানাশক ওষুধ (NSAID) সেবন করালে কী মারাত্মক ক্ষতি হতে পারে?",
      questionEn: "What life-threatening clinical hazards arise from taking NSAID painkillers during Dengue fever?",
      answerBn:
        "ডেঙ্গু সন্দেহে কোনো অবস্থাতেই অ্যাসপিরিন, আইবুপ্রোফেন, ন্যাপ্রোক্সেন, মেফেনামিক এসিড কিংবা ডাইক্লোফেনাক জাতীয় ব্যথানাশক (NSAID) সেবন করা যাবে না। এসব ওষুধ রক্ত জমাট বাঁধার ক্ষমতা নষ্ট করে এবং পাকস্থলীর আবরণে ক্ষতের সৃষ্টি করে। ফলে রোগীর পেট ও অন্ত্রে মারাত্মক অভ্যন্তরীণ রক্তক্ষরণ (Internal Hemorrhage) হতে পারে। জ্বরের জন্য কেবল চিকিৎসকের পরামর্শে বয়স ও ওজন অনুযায়ী প্যারাসিটামল সেব্য।",
      answerEn:
        "Non-Steroidal Anti-Inflammatory Drugs (NSAIDs)—including aspirin, ibuprofen, naproxen, mefenamic acid, and diclofenac—are strictly contraindicated in dengue. NSAIDs induce platelet dysfunction and mucosal gastroduodenal erosions, precipitating catastrophic gastrointestinal bleeding in already thrombocytopenic patients. Fever must be managed strictly with calculated doses of paracetamol and tepid sponging.",
    },
    {
      questionBn: "বাসায় ডেঙ্গু রোগীকে অতিরিক্ত স্যালাইন বা আইভি ফ্লুইড দিলে কী বিপদ হতে পারে?",
      questionEn: "What medical hazards are caused by administering excessive IV fluids to Dengue patients without clinical monitoring?",
      answerBn:
        "ডেঙ্গুতে মুখে তরল খাওয়ানোই সেরা। চিকিৎসকের হিসাব ছাড়া যত্রতত্র শিরায় অতিরিক্ত স্যালাইন পুশ করলে মারাত্মক 'ফ্লুইড ওভারলোড' হয়। প্লাজমা লিকেজের ক্রিটিক্যাল ফেজ (সাধারণত ২৪-৪৮ ঘণ্টা) পার হয়ে যাওয়ার পর অতিরিক্ত তরল ফুসফুসের অ্যালভিওলাইতে ঢুকে 'পালমোনারি এডিমা' তৈরি করে, যার ফলে তীব্র শ্বাসকষ্ট ও হার্ট ফেইলিউরে রোগী মৃত্যুবরণ করতে পারেন। তাই আইভি ফ্লুইড অবশ্যই হাসপাতালে রক্তচাপ ও প্রস্রাবের পরিমাণ মেপে দেওয়া উচিত।",
      answerEn:
        "Indiscriminate, unmonitored intravenous fluid infusion poses grave risks of fluid overload. Once the 24- to 48-hour critical plasma-leakage window concludes, capillary integrity restores and reabsorption commences. Continued high-rate IV infusions precipitate acute pulmonary edema, pleural effusion, and congestive heart failure. IV hydration must be strictly titrated against hourly urine output (>0.5 ml/kg/hr) and hemodynamics in an inpatient setting.",
    },
    {
      questionBn: "টাইফয়েড জ্বর শনাক্তে ওয়াইডাল (Widal) টেস্টের সীমাবদ্ধতা কী এবং ব্লাড কালচার কেন সেরা?",
      questionEn: "What are the clinical limitations of the Widal test, and why is automated Blood Culture the diagnostic gold standard for Typhoid?",
      answerBn:
        "ওয়াইডাল টেস্টের সবচেয়ে বড় দুর্বলতা হলো এতে প্রচুর 'ফলস পজিটিভ' আসে। অতীতে টাইফয়েড হয়ে থাকলে বা অন্য কোনো সংক্রমণের কারণেও ওয়াইডাল টেস্ট পজিটিভ দেখাতে পারে। অন্যদিকে জ্বরের ১ম সপ্তাহে অ্যান্টিবায়োটিক শুরু করার আগে 'অটোমেটেড ব্লাড কালচার' করালে সালমোনেলা টাইফি ব্যাকটেরিয়া শনাক্ত হয় এবং কোন কোন অ্যান্টিবায়োটিক কার্যকর (সেনসিটিভ) তা নিশ্চিতভাবে জানা যায়। তাই টাইফয়েডের নির্ভুল চিকিৎসায় ব্লাড কালচার হলো আন্তর্জাতিক গোল্ড স্ট্যান্ডার্ড।",
      answerEn:
        "The Widal slide test is notorious for high false-positive rates due to cross-reacting baseline antibodies, past Salmonella exposure, or unrelated febrile illnesses. Conversely, automated Blood Culture & Sensitivity (Bactec), when drawn during the first week before empirical antimicrobial therapy, isolates live Salmonella enterica serovars and maps precise antibiotic susceptibility profiles, preventing antibiotic failure.",
    },
    {
      questionBn: "ডেঙ্গু ও টাইফয়েড রোগীর কি রক্তে প্লাটিলেট ট্রান্সফিউশন (প্লাটিলেট দেওয়া) সবসময় প্রয়োজন হয়?",
      questionEn: "Does every Dengue patient with low platelets require platelet transfusions?",
      answerBn:
        "না, প্লাটিলেট কমে গেলেই রক্ত বা প্লাটিলেট দিতে হয় না। বিশ্ব স্বাস্থ্য সংস্থার (WHO) আন্তর্জাতিক গাইডলাইন অনুযায়ী, কোনো সক্রিয় রক্তপাত না থাকলে প্লাটিলেট কাউন্ট ১০,০০০ থেকে ২০,০০০ এর নিচে নামলেও সাধারণত শুধু তরল ও স্যালাইন দিয়ে পর্যবেক্ষণ করা হয়। অযথা প্লাটিলেট দিলে অ্যালার্জিক রিঅ্যাকশন ও ফুসফুসে পানি জমার ঝুঁকি বাড়ে। তবে সক্রিয় দৃশ্যমান রক্তপাত থাকলে বা ইমার্জেন্সি সার্জারির প্রয়োজন হলে চিকিৎসকের সিদ্ধান্তে প্লাটিলেট ট্রান্সফিউশন করা হয়।",
      answerEn:
        "No. According to WHO clinical protocols, prophylactic platelet transfusion is generally unnecessary, even with counts dropping below 20,000/μL, provided there is no active bleeding and the patient remains hemodynamically stable. Routine platelet transfusions do not expedite recovery and increase risks of febrile transfusion reactions and fluid overload. Transfusions are reserved for significant overt mucosal hemorrhage or emergency surgical interventions.",
    },
    {
      questionBn: "হেলথ ক্লাবের ডিজিটাল মেম্বাররা ফেনীর পার্টনার হাসপাতাল ও ল্যাবে ডেঙ্গু-টাইফয়েড চিকিৎসায় কী ধরনের ছাড় পান?",
      questionEn: "What specific discounts and privileges do Health Club digital members receive for Dengue & Typhoid care in Feni?",
      answerBn:
        "হেলথ ক্লাবের নিবন্ধিত কার্ডধারীরা ফেনী সদরের চুক্তিবদ্ধ পার্টনার স্বাস্থ্যসেবা প্রতিষ্ঠানে (যেমন: আল-আকসা হাসপাতাল লিঃ, প্যাসিফিক হেলথ কেয়ার, লাইফ কেয়ার) ডেঙ্গু এনএস১, এলাইজা, সিবিসি প্লাটিলেট, টাইফিডট, কালচার টেস্ট এবং ইনডোর ওয়ার্ড ও কেবিন বেড ভাড়ায় নিশ্চিত ১০-৩০% মেম্বার ছাড় উপভোগ করেন।",
      answerEn:
        "Registered Health Club digital members receive guaranteed 10-30% discounts across Dengue NS1 antigen, ELISA serology, 5-part CBC platelet monitoring, Typhidot, automated blood cultures, and inpatient hospital bed rentals at verified partner institutions in Feni Sadar (such as Al-Aqsa Hospital Ltd and Pacific Health Care).",
    },
  ],
  relatedSlugs: [
    "feni-icu-ccu-nicu-bed-charges-and-facilities-guide",
    "home-sample-collection-and-nursing-service-in-feni",
    "feni-blood-bank-and-donors-guide",
    "feni-ambulance-and-oxygen-service-guide",
    "best-medicine-doctors-in-feni",
    "feni-sadar-hospital-guide",
    "feni-medical-test-price-list",
  ],
};
