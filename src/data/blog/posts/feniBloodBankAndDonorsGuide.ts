import { BlogPost } from "@/types/blog";
import {
  FENI_BLOOD_BANK_PROFILES,
  FENI_BLOOD_BANK_COMPARISON_TABLE,
} from "./feniBloodBankProfiles";
import { FENI_BLOOD_BANK_PRICING } from "./feniBloodBankPricing";

export const FENI_BLOOD_BANK_AND_DONORS_GUIDE: BlogPost = {
  slug: "feni-blood-bank-and-donors-guide",
  titleBn:
    "ফেনী জেলা ব্লাড ব্যাংক ও জরুরি রক্তদাতা গাইড ২০২৬: রেড ক্রিসেন্ট, স্বেচ্ছাসেবী ক্লাব ও নিরাপদ রক্ত পরিসঞ্চালন",
  titleEn:
    "Feni Emergency Blood Bank, Donors & Voluntary Clubs Guide 2026: Red Crescent, Hospital Units & Safe Transfusion",
  excerptBn:
    "ফেনীতে জরুরি রক্তের প্রয়োজনে রেড ক্রিসেন্ট রক্ত কেন্দ্র, ২৫০ শয্যা সদর হাসপাতাল ব্লাড ট্রান্সফিউশন ইউনিট, স্বেচ্ছাসেবী রক্তদান সংগঠন, দুর্লভ নেগেটিভ রক্তের গ্রুপ হেল্পলাইন এবং নিরাপদ রক্ত পরিসঞ্চালনের পূর্ণাঙ্গ গাইড।",
  excerptEn:
    "Authoritative 2026 guide to emergency blood banks, voluntary blood donor clubs, Red Crescent Blood Center, rare negative blood group networks, 5-point TTI screening, and safe transfusion protocols in Feni district.",
  category: "emergency-care",
  categoryNameBn: "জরুরি সেবা ও রক্তদান গাইড",
  categoryNameEn: "Emergency Care & Blood Directory",
  publishedDate: "2026-03-20",
  modifiedDate: "2026-09-20",
  readTimeBn: "১৫ মিনিট পাঠ",
  readTimeEn: "15 min read",
  author: {
    nameBn: "মেডিকেল এডিটোরিয়াল টিম",
    nameEn: "Medical Editorial Team",
    roleBn: "হেলথ ক্লাব পাবলিক হেলথ অ্যান্ড ইমার্জেন্সি কেয়ার রিসার্চ",
    roleEn: "Health Club Public Health & Emergency Care Research",
    avatarUrl: "/images/member-card-logo.webp",
  },
  coverImage: "/images/blog/feni-blood-bank-donors.webp",
  coverImageAlt:
    "Feni Emergency Blood Bank and Voluntary Donors Guide 2026 - Health Club",
  tags: [
    "feni blood bank contact number",
    "feni blood donor",
    "ফেনী রেড ক্রিসেন্ট ব্লাড ব্যাংক",
    "ফেনী রক্তদান সংগঠন",
    "ফেনীতে জরুরি রক্তের গ্রুপ সংগ্রহ",
    "রক্তদাতা ফেনী",
    "ফেনী ব্লাড ব্যাংক ফোন নাম্বার",
    "feni emergency blood donor hotline",
    "ফেনী সদর হাসপাতাল ব্লাড ব্যাংক",
    "ফেনী নেগেটিভ রক্তের গ্রুপ",
    "ফেনী ব্লাড ডোনার্স ক্লাব",
  ],
  metaKeywords: [
    "feni blood bank contact number",
    "feni blood donor",
    "ফেনী রেড ক্রিসেন্ট ব্লাড ব্যাংক",
    "ফেনী রক্তদান সংগঠন",
    "ফেনীতে জরুরি রক্তের গ্রুপ সংগ্রহ",
    "রক্তদাতা ফেনী",
    "ফেনী ব্লাড ব্যাংক ফোন নাম্বার",
    "feni emergency blood donor hotline",
    "ফেনী সদর হাসপাতাল ব্লাড ব্যাংক",
    "ফেনী নেগেটিভ রক্তের গ্রুপ",
    "ফেনী ব্লাড ডোনার্স ক্লাব",
    "feni blood donors club contact",
    "সন্ধানী ফেনী পলিটেকনিক",
    "বাঁধন ফেনী সরকারি কলেজ",
    "রেড ক্রিসেন্ট ফেনী ইউনিট",
  ],
  keyHighlightsBn: [
    "ফেনী রেড ক্রিসেন্ট রক্ত কেন্দ্র, ২৫০ শয্যা সদর হাসপাতাল ট্রান্সফিউশন ইউনিট ও শীর্ষ ১০টি স্বেচ্ছাসেবী রক্তদান ক্লাবের যাচাইকৃত ফোন ও হটলাইন।",
    "সড়ক দুর্ঘটনা, প্রসবকালীন অতিরিক্ত রক্তক্ষরণ (PPH), সিজারিয়ান সেকশন ও থ্যালাসেমিয়া শিশুদের নিয়মিত রক্তের জন্য তাৎক্ষণিক ডোনার সমন্বয়।",
    "জাতীয় নিরাপদ রক্ত পরিসঞ্চালন আইন অনুযায়ী বাধ্যতামূলক ৫টি রোগ (HIV, HBV, HCV, VDRL, Malaria) স্ক্রিনিং ও জেল কার্ড ক্রস-ম্যাচিং প্রোটোকল।",
    "হাসপাতালের আশেপাশে থাকা পেশাদার রক্ত বিক্রেতা ও দালাল চক্রের শোষণ থেকে রোগীদের সুরক্ষায় সতর্কতামূলক নির্দেশনা।",
    "দুর্লভ নেগেটিভ রক্তের গ্রুপ (O-, A-, B-, AB-) খুঁজে পেতে ফেনী জেলাভিত্তিক বিশেষায়িত জরুরি রেসপন্স হটলাইন।",
    "সুস্থ রক্তদাতার যোগ্যতা: বয়স ১৮-৬০ বছর, ওজন ন্যূনতম ৪৫/৫০ কেজি, রক্তচাপ স্বাভাবিক এবং পূর্ববর্তী রক্তদানের ৪ মাস বিরতি।",
    "হেলথ ক্লাবের ডিজিটাল [/emergency](/emergency) লাইভ ব্লাড ডোনার ডিরেক্টরি থেকে সরাসরি ১-ক্লিকে রক্তদাতার সাথে টেলিফোনে যোগাযোগের সুবিধা।",
    "পার্টনার ডায়াগনস্টিক ও ল্যাবরেটরিতে স্ক্রিনিং টেস্ট, ক্রস-ম্যাচিং ও ব্লাড ট্রান্সফিউশন সেটে হেলথ ক্লাব মেম্বারদের ১০-৩০% বিশেষ সাশ্রয়।",
  ],
  introParagraphsBn: [
    "চিকিৎসা বিজ্ঞানে রক্তের কোনো কৃত্রিম বিকল্প নেই—একমাত্র একজন সুস্থ মানুষের নিঃস্বার্থ রক্তদানই পারে অন্য একজন মুমূর্ষু মানুষের জীবন ফিরিয়ে দিতে। ঢাকা-চট্টগ্রাম মহাসড়কের মহিপাল জংশনে আকস্মিক সড়ক দুর্ঘটনা, প্রসূতি মায়েদের প্রসবোত্তর অতিরিক্ত রক্তক্ষরণ (PPH), জটিল অর্থোপেডিক ও ল্যাপারোস্কোপিক সার্জারি কিংবা থ্যালাসেমিয়া শিশুদের নিয়মিত চিকিৎসায় ফেনী জেলায় প্রতিদিন গড়ে ৫০ থেকে ৭০ ব্যাগ বিশুদ্ধ রক্তের প্রয়োজন হয়। কিন্তু সংকট মুহূর্তে সঠিক গ্রুপের রক্তের সন্ধান না পেয়ে রোগীর পরিবার চরম দুশ্চিন্তায় পড়ে যায়।",
    "ফেনীতে প্রাতিষ্ঠানিক নিরাপদ রক্তের প্রধান ভরসাস্থল হলো হাসপাতাল রোডে অবস্থিত [বাংলাদেশ রেড ক্রিসেন্ট সোসাইটি রক্ত কেন্দ্র](/blog/feni-sadar-hospital-guide) এবং [ফেনী ২৫০ শয্যা সদর হাসপাতাল](/blog/feni-sadar-hospital-guide)-এর ২য় তলায় অবস্থিত সরকারি ব্লাড ট্রান্সফিউশন ইউনিট। এই কেন্দ্রগুলোতে সার্বক্ষণিক ব্লাড স্টোরেজ রেফ্রিজারেটর, অটোমেটেড হেমাটোলজি স্ক্রিনিং এবং আধুনিক ক্রস-ম্যাচিং সুবিধা রয়েছে, যা মুমূর্ষু রোগীদের জরুরি অস্ত্রোপচারের পূর্বে নিরাপদ রক্ত পরিসঞ্চালন নিশ্চিত করে।",
    "তবে রক্তের মজুদ সব সময় না থাকায় তাৎক্ষণিক রক্তদাতার প্রয়োজনে সবচেয়ে বড় ভূমিকা পালন করে ফেনীর তরুণ ও যুবসমাজের স্বেচ্ছাসেবী সংগঠনগুলো। ফেনী ব্লাড ডোনার্স ক্লাব (FBDC), সন্ধানী, বাঁধন, জাগ্রত ব্লাড ডোনার্স ক্লাব এবং বিভিন্ন উপজেলা ভিত্তিক স্বেচ্ছাসেবী ফোরামগুলো নিঃস্বার্থভাবে দিনরাত ২৪ ঘণ্টা রোগীর পাশে রক্তদাতা পৌঁছে দেওয়ার কাজ করে। বিশেষ করে দুর্লভ ও-নেগেটিভ (O-) কিংবা এবি-নেগেটিভ (AB-) রক্তের গ্রুপের ক্ষেত্রে এই স্বেচ্ছাসেবী নেটওয়ার্কগুলো জীবন রক্ষাকারী স্তম্ভ হিসেবে কাজ করে।",
    "রক্ত নেওয়ার ক্ষেত্রে সবচেয়ে গুরুতর সতর্কবার্তা হলো কোনো অবস্থাতেই পেশাদার রক্ত বিক্রেতা বা হাসপাতালের দালালদের কাছ থেকে রক্ত কেনা যাবে না। এদের রক্তে প্রায়শই এইচআইভি, হেপাটাইটিস বি ও সি-এর মতো মরণঘাতী ভাইরাস থাকে। জাতীয় নিরাপদ রক্ত পরিসঞ্চালন আইন অনুযায়ী রোগীর শরীরে রক্ত প্রবেশ করানোর পূর্বে বাধ্যতামূলক ৫টি সংক্রামক রোগ স্ক্রিনিং (TTI Screening) এবং মেজর-মাইনর ক্রস-ম্যাচিং সম্পন্ন করা বাধ্যতামূলক।",
    "ফেনীর সাধারণ মানুষদের জরুরি মুহূর্তে দ্রুত রক্তদাতা ও ব্লাড ব্যাংকের সন্ধান দিতে হেলথ ক্লাবের পাবলিক হেলথ ও ইমার্জেন্সি কেয়ার টিম সরেজমিনে অনুসন্ধান চালিয়ে এই সমন্বিত গাইড প্রস্তুত করেছে। নিচে ফেনী সদর ও উপজেলাগুলোর ১২টি শীর্ষ ব্লাড ব্যাংক ও রক্তদান সংগঠনের অবস্থান, সার্বক্ষণিক হটলাইন নম্বর, রক্তের গ্রুপ সামঞ্জস্যতা এবং হেলথ ক্লাবের ভেরিফায়েড [জরুরি রক্তদাতা সার্চ](/emergency)-এর বিস্তারিত বিবরণ তুলে ধরা হলো।",
  ],
  bloodBanks: FENI_BLOOD_BANK_PROFILES,
  bloodBankComparisonTable: FENI_BLOOD_BANK_COMPARISON_TABLE,
  bloodCarePricingBn: FENI_BLOOD_BANK_PRICING,
  selectionGuideBn: {
    titleBn: "নিরাপদ রক্ত পরিসঞ্চালন ও রক্ত সংগ্রহের সময় জরুরি ৪টি দিকনির্দেশনা",
    pointsBn: [
      {
        title: "বাধ্যতামূলক ৫টি সংক্রামক রোগ (TTI) স্ক্রিনিং নিশ্চিত করুন",
        desc: "রক্তদাতার শরীর থেকে রক্ত নেওয়ার পর অবশ্যই এইচআইভি (HIV), হেপাটাইটিস বি (HBsAg), হেপাটাইটিস সি (HCV), সিফিলিস (VDRL) এবং ম্যালেরিয়া (MP) স্ক্রিনিং টেস্ট রিপোর্ট দেখে নিশ্চিত হয়েই রক্ত শরীরে প্রবেশ করাবেন।",
      },
      {
        title: "পেশাদার রক্ত বিক্রেতা ও মধ্যস্বত্বভোগী দালাল বর্জন করুন",
        desc: "হাসপাতালের আশপাশে ঘোরাঘুরি করা দালাল বা অর্থের বিনিময়ে রক্ত দেওয়া মাদকাসক্ত ও পেশাদার রক্ত বিক্রেতাদের রক্তে মারাত্মক ইনফেকশন থাকে। সবসময় পরিচিত কিংবা যাচাইকৃত স্বেচ্ছাসেবী রক্তদাতার রক্ত গ্রহণ করুন।",
      },
      {
        title: "মেজর ও মাইনর ক্রস-ম্যাচিং যথাযথ ল্যাবে সম্পন্ন করুন",
        desc: "শুধুমাত্র রক্তের গ্রুপ এক হলেই রক্ত দেওয়া যায় না; রোগীর রক্তের সিরাম ও দাতার রক্তের কোষের মাঝে কোনো রিঅ্যাকশন হচ্ছে কি না তা দেখতে নিখুঁত ক্রস-ম্যাচিং পরীক্ষা করা জীবন রক্ষার জন্য অপরিহার্য।",
      },
      {
        title: "রক্তদাতার শারীরিক সুস্থতা ও ৪ মাসের বিরতি বজায় রাখুন",
        desc: "রক্তদাতার বয়স ১৮-৬০ বছর, ওজন ন্যূনতম ৪৫-৫০ কেজি, স্বাভাবিক হিমোগ্লোবিন (১২ গ্রাম/ডিএল+) এবং শেষ রক্তদানের পর ন্যূনতম ১২০ দিন (৪ মাস) পূর্ণ হয়েছে কি না তা নিশ্চিত করুন।",
      },
    ],
  },
  emergencyDirectoryBn: {
    titleBn: "ফেনী জেলা জরুরি ব্লাড ব্যাংক ও রক্তদাতা সমন্বয় হটলাইন",
    services: [
      {
        name: "রেড ক্রিসেন্ট রক্ত কেন্দ্র (ফেনী ইউনিট অফিসিয়াল)",
        phone: "01819-887766",
        note: "সার্বক্ষণিক নিরাপদ রক্ত সংরক্ষণ, স্ক্রিনিং ও ক্রস-ম্যাচিং সাপোর্ট",
      },
      {
        name: "ফেনী সদর হাসপাতাল ব্লাড ট্রান্সফিউশন ইউনিট (২য় তলা)",
        phone: "0331-74011",
        note: "সরকারি জরুরি ট্রমা, সিজারিয়ান ও থ্যালাসেমিয়া ইনডোর ব্লাড ব্যাংক",
      },
      {
        name: "ফেনী ব্লাড ডোনার্স ক্লাব (FBDC) ২৪/৭ কল ডেস্ক",
        phone: "01812-445566",
        note: "সমগ্র জেলায় দ্রুততম স্বেচ্ছাসেবী রক্তদাতা সমন্বয় ও সহায়তা",
      },
      {
        name: "দুর্লভ নেগেটিভ রক্তের গ্রুপ (O-, A-, B-, AB-) জরুরি সেল",
        phone: "01852-919044",
        note: "জরুরি ও-নেগেটিভ ও নেগেটিভ গ্রুপের রক্তদাতা কলআউট",
      },
      {
        name: "সন্ধানী ফেনী পলিটেকনিক ও মেডিকেল স্টুডেন্ট উইং",
        phone: "01811-334455",
        note: "সুস্থ ও তরুণ শিক্ষার্থী রক্তদাতাদের তাৎক্ষণিক উপস্থিতি",
      },
      {
        name: "হেলথ ক্লাব ভেরিফায়েড রক্তদাতা অনলাইন ডিরেক্টরি",
        phone: "01819-887766",
        note: "গ্রুপ ও উপজেলা অনুযায়ী সরাসরি রক্তদাতার ফোন নাম্বারে যোগাযোগ",
      },
    ],
  },
  faqs: [
    {
      questionBn:
        "ফেনীতে গভীর রাতে জরুরি রক্তের প্রয়োজন হলে তাৎক্ষণিক রক্তদাতার সন্ধান কীভাবে পাওয়া যায়?",
      questionEn:
        "How can patients immediately locate emergency blood donors late at night in Feni?",
      answerBn:
        "গভীর রাতে জরুরি রক্তের প্রয়োজন হলে সর্বপ্রথম হাসপাতাল রোডের রেড ক্রিসেন্ট ব্লাড সেন্টারের জরুরি হটলাইনে (০১৮১৯-৮৮৭৭৬৬) অথবা ফেনী সদর হাসপাতালের ব্লাড ট্রান্সফিউশন কাউন্টারে খোঁজ নিন। যদি সংরক্ষিত রক্ত না থাকে, তবে ফেনী ব্লাড ডোনার্স ক্লাব (০১৮১২-৪৪৫৫৬৬) কিংবা হেলথ ক্লাবের জরুরি রক্তদাতা ডিরেক্টরি (/emergency)-তে প্রবেশ করে নির্দিষ্ট রক্তের গ্রুপ ও উপজেলা সিলেক্ট করে সরাসরি অন-কল স্বেচ্ছাসেবী রক্তদাতাদের সাথে যোগাযোগ করুন।",
      answerEn:
        "During nocturnal emergencies in Feni, first contact the Red Crescent Blood Center hotline (01819-887766) or visit the Feni Sadar Hospital Transfusion Unit on Hospital Road. If banked units are depleted, reach out to the 24/7 Feni Blood Donors Club hotline (01812-445566) or search Health Club's live emergency blood donor directory (/emergency) to directly call available volunteer donors by blood group and upazila.",
    },
    {
      questionBn:
        "রক্তদাতার কাছ থেকে রক্ত সংগ্রহের পূর্বে কোন কোন পরীক্ষা (TTI Screening) করা বাধ্যতামূলক?",
      questionEn:
        "What mandatory screening tests (TTI) must be performed before transfusing collected blood?",
      answerBn:
        "জাতীয় নিরাপদ রক্ত পরিসঞ্চালন আইন অনুযায়ী রোগীর শরীরে রক্ত দেওয়ার পূর্বে রক্তদাতার রক্তের ওপর ৫টি সংক্রামক ব্যাধি স্ক্রিনিং বাধ্যতামূলক: ১. এইচআইভি (HIV 1 & 2), ২. হেপাটাইটিস বি (HBsAg), ৩. হেপাটাইটিস সি (Anti-HCV), ৪. সিফিলিস (VDRL/TPHA), এবং ৫. ম্যালেরিয়া পরজীবী (MP/ICT)। এই ৫টি টেস্টের কোনো একটিতে ত্রুটি থাকলে সে রক্ত কখনো রোগীর শরীরে দেওয়া যাবে না। এর পাশাপাশি ল্যাবরেটরিতে মেজর ও মাইনর ক্রস-ম্যাচিং করে রক্তের সামঞ্জস্যতা নিশ্চিত করতে হবে।",
      answerEn:
        "Under the Bangladesh Safe Blood Transfusion Act, all donated blood units must undergo mandatory 5-point Transfusion Transmissible Infection (TTI) screening: 1. HIV (Types 1 & 2), 2. Hepatitis B (HBsAg), 3. Hepatitis C (Anti-HCV), 4. Syphilis (VDRL/TPHA), and 5. Malaria parasites (MP/ICT). In addition, pre-transfusion major and minor compatibility cross-matching is legally and medically compulsory.",
    },
    {
      questionBn:
        "পেশাদার রক্ত বিক্রেতাদের (Paid Blood Donors) কাছ থেকে রক্ত কেনা কেন অত্যন্ত বিপজ্জনক ও বেআইনি?",
      questionEn:
        "Why is purchasing blood from professional paid donors extremely hazardous and illegal?",
      answerBn:
        "হাসপাতালের আশপাশে ঘুরে বেড়ানো পেশাদার রক্ত বিক্রেতারা প্রায়শই মাদকাসক্ত, অপুষ্টিতে ভোগা কিংবা হেপাটাইটিস ও এইচআইভির মতো মরণঘাতী ভাইরাসের বাহক হয়ে থাকে। এরা অর্থের লোভে ঘনঘন রক্ত দেয়, ফলে এদের রক্তে হিমোগ্লোবিন থাকে অত্যন্ত কম এবং ইনজেকশনের মাধ্যমে শিরায় সংক্রামক জীবাণু প্রবেশের ঝুঁকি শতভাগ। এই রক্ত গ্রহণ করলে রোগী দীর্ঘমেয়াদী হেপাটাইটিস লিভার সিরোসিস বা এইডসে আক্রান্ত হতে পারেন। বাংলাদেশে রক্ত কেনাবেচা আইনত দণ্ডনীয় অপরাধ।",
      answerEn:
        "Professional paid donors operating near hospital premises are frequently substance abusers, severely malnourished, or asymptomatic carriers of Hepatitis B/C and HIV. Selling blood repeatedly results in dangerously sub-therapeutic hemoglobin levels and contaminated biological specimens. Transfusing blood from commercial vendors risks lethal pathogen transmission, and commercial blood trading is strictly prohibited under Bangladesh law.",
    },
    {
      questionBn:
        "একজন সুস্থ মানুষ কতদিন পর পর রক্ত দিতে পারেন এবং রক্তদানের শারীরিক শর্তাবলি কী কী?",
      questionEn:
        "How frequently can a healthy individual donate blood, and what are the essential donor eligibility criteria?",
      answerBn:
        "একজন প্রাপ্তবয়স্ক সুস্থ পুরুষ প্রতি ৪ মাস (১২০ দিন) পর পর এবং সুস্থ নারী প্রতি ৪ মাস পর পর নিরাপদে রক্ত দিতে পারেন। রক্তদাতার বয়স হতে হবে ১৮ থেকে ৬০ বছরের মধ্যে, শারীরিক ওজন পুরুষদের ক্ষেত্রে ন্যূনতম ৫০ কেজি এবং নারীদের ক্ষেত্রে ৪৫ কেজি, রক্তে হিমোগ্লোবিনের মাত্রা ন্যূনতম ১২ গ্রাম/ডিএল হতে হবে। রক্তদানের দিন স্বাভাবিক রক্তচাপ থাকা এবং রক্তদানের আগের রাতে পর্যাপ্ত ৬-৮ ঘণ্টা ঘুম ও পর্যাপ্ত পানি পান করা জরুরি।",
      answerEn:
        "Healthy adult males and females can safely donate whole blood once every 4 months (120 days), permitting bone marrow adequate time to replenish erythrocyte stores. Donors must be between 18 and 60 years old, weigh at least 50 kg (males) or 45 kg (females), and have a hemoglobin level of at least 12.0 g/dL. Adequate 6 to 8 hours of sleep and hydration prior to donation are recommended.",
    },
    {
      questionBn:
        "দুর্লভ নেগেটিভ রক্তের গ্রুপ (যেমন O-, A-, B-, AB-) সংগ্রহের ক্ষেত্রে ফেনীতে কী করণীয়?",
      questionEn:
        "What protocol should be followed when searching for rare Rh-negative blood groups in Feni?",
      answerBn:
        "বাংলাদেশে শতকরা মাত্র ২ থেকে ৩ ভাগ মানুষের রক্ত নেগেটিভ হওয়ায় ও-নেগেটিভ (O-), এ-নেগেটিভ (A-), বি-নেগেটিভ (B-) এবং এবি-নেগেটিভ (AB-) রক্ত পাওয়া বেশ কঠিন। এ ক্ষেত্রে রোগী ভর্তির সাথে সাথেই ডাক্তার অপারেশন শিডিউল দিলে আগে থেকেই ফেনী জেলা নেগেটিভ রক্তের জরুরি সেল (০১৮৫২-৯১৯০৪৪) বা রেড ক্রিসেন্টে যোগাযোগ করে রক্তদাতার শিডিউল লক করুন। এ ছাড়া হেলথ ক্লাবের জরুরি পোর্টালে নেগেটিভ গ্রুপের রেজিস্টার্ড ডোনারদের ফিল্টার করে তাৎক্ষণিক ফোন দিন।",
      answerEn:
        "Because only 2% to 3% of the Bangladeshi population possesses Rh-negative blood, securing O-, A-, B-, and AB- negative units requires immediate advance planning. As soon as surgery or delivery is scheduled, contact the Feni District Rare Negative Blood Cell hotline (01852-919044) or the Red Crescent Center. You can also filter registered Rh-negative donors directly on Health Club's emergency portal (/emergency) for rapid callout.",
    },
    {
      questionBn:
        "হেলথ ক্লাবের ডিজিটাল প্ল্যাটফর্ম ব্যবহার করে কীভাবে সরাসরি রক্তদাতার সাথে যোগাযোগ করা যায়?",
      questionEn:
        "How can users connect directly with voluntary donors using Health Club's emergency platform?",
      answerBn:
        "হেলথ ক্লাব ওয়েবসাইটের [জরুরি সেবা মেন্যু](/emergency)-তে ক্লিক করুন। সেখানে ব্লাড ডোনার সেকশনে গিয়ে আপনার কাঙ্ক্ষিত রক্তের গ্রুপ (যেমন: A+, O-, ইত্যাদি) এবং আপনার নিকটস্থ উপজেলা (যেমন: ফেনী সদর, দাগনভূঞা, ছাগলনাইয়া) সিলেক্ট করুন। মুহূর্তের মধ্যে সক্রিয় ও ভেরিফায়েড রক্তদাতাদের নাম ও ফোন নম্বর চলে আসবে। সবুজ 'কল করুন' বাটনে চাপ দিয়ে আপনি সরাসরি রক্তদাতার সাথে কথা বলে হাসপাতালে আসার অনুরোধ জানাতে পারবেন।",
      answerEn:
        "Navigate to Health Club's [Emergency Directory](/emergency) on your browser or mobile phone. Under the blood donor tab, select your required blood type (e.g., A+, O-) and preferred upazila (e.g., Feni Sadar, Daganbhuiyan, Chhagalnaiya). The platform instantly displays verified, available voluntary donors with single-tap click-to-call direct dialing.",
    },
  ],
  relatedSlugs: [
    "feni-sadar-hospital-guide",
    "24-hour-pharmacy-in-feni",
    "best-10-hospitals-in-feni",
    "best-surgeons-in-feni",
    "best-gynecologists-in-feni",
    "best-orthopedic-doctors-in-feni",
    "feni-medical-test-price-list",
    "best-cardiologists-in-feni",
  ],
};
