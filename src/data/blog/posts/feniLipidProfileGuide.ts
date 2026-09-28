import { BlogPost } from "@/types/blog";
import { FENI_LIPID_TEST_PRICING } from "./feniLipidPricing";
import {
  FENI_LIPID_COMPARISON_TABLE,
  FENI_LIPID_CENTERS,
} from "./feniLipidCenters";

export const FENI_LIPID_PROFILE_CHOLESTEROL_TEST_GUIDE: BlogPost = {
  slug: "feni-lipid-profile-cholesterol-test-guide",
  titleBn:
    "ফেনীতে লিপিড প্রোফাইল (রক্তে চর্বি/কোলেস্টেরল) টেস্ট খরচ, ফাস্টিং নিয়ম ও সেরা ল্যাব ২০২৬",
  titleEn:
    "Lipid Profile & Cholesterol Test Cost in Feni: Fasting Rules, Best Labs & Report Guide 2026",
  excerptBn:
    "ফেনীতে লিপিড প্রোফাইল রক্ত পরীক্ষার খরচ, ১০-১২ ঘণ্টা ফাস্টিং বা খালি পেটের নিয়ম, টোটাল কোলেস্টেরল, ভালো চর্বি (HDL), খারাপ চর্বি (LDL) ও ট্রাইগ্লিসারাইডের স্বাভাবিক মাত্রা, হার্ট অ্যাটাক ও স্ট্রোক ঝুঁকি প্রতিরোধ এবং হেলথ ক্লাবে ১০-৩০% মেম্বার ছাড়ের পূর্ণাঙ্গ গাইড।",
  excerptEn:
    "Comprehensive guide to lipid profile & cholesterol blood test in Feni: cost breakdown, 10-12 hour fasting instructions, normal reference ranges for Total Cholesterol, HDL, LDL & Triglycerides, cardiac risk evaluation, best labs, and 10-30% Health Club member discounts.",
  category: "diagnostic-guide",
  categoryNameBn: "ডায়াগনস্টিক ও ল্যাব গাইড",
  categoryNameEn: "Diagnostic & Lab Guide",
  publishedDate: "2026-03-28",
  modifiedDate: "2026-09-28",
  readTimeBn: "১২ মিনিট পাঠ",
  readTimeEn: "12 min read",
  author: {
    nameBn: "মেডিকেল এডিটোরিয়াল টিম",
    nameEn: "Medical Editorial Team",
    roleBn: "হেলথ ক্লাব কার্ডিওলজি ও প্যাথলজি রিসার্চ বিভাগ",
    roleEn: "Health Club Cardiology & Pathology Research Desk",
    avatarUrl: "/images/member-card-logo.webp",
  },
  coverImage: "/images/blog/best-diagnostic-centers-feni.webp",
  coverImageAlt:
    "Lipid Profile and Cholesterol Blood Test Cost, Fasting Rules and Labs in Feni 2026",
  tags: [
    "লিপিড প্রোফাইল টেস্ট খরচ ফেনী",
    "কোলেস্টেরল পরীক্ষা ফেনী",
    "ট্রাইগ্লিসারাইড টেস্ট ফেনী",
    "এইচডিএল এলডিএল পরীক্ষা ফেনী",
    "Lipid Profile Test Cost Feni",
    "Cholesterol Test Price Feni",
    "Triglycerides Test Feni",
    "Health Club Feni Pathology",
  ],
  metaKeywords: [
    "lipid profile test cost in feni",
    "cholesterol test price in feni",
    "lipid profile test price feni",
    "serum cholesterol test cost feni",
    "triglycerides test price feni",
    "hdl ldl cholesterol test feni",
    "lipid profile fasting rules feni",
    "best biochemistry lab in feni",
    "cardiologist in feni for high cholesterol",
    "ফেনীতে লিপিড প্রোফাইল টেস্ট খরচ",
    "রক্তে কোলেস্টেরল পরীক্ষা ফেনী",
    "লিপিড প্রোফাইল ফাস্টিং নিয়ম",
    "ট্রাইগ্লিসারাইড কমানোর উপায়",
    "এইচডিএল এলডিএল স্বাভাবিক মাত্রা",
    "ডায়াগনস্টিক সেন্টার ফেনী",
    "health club feni member discount",
    "statin test lipid profile feni",
  ],
  keyHighlightsBn: [
    "ফেনী সদরের শীর্ষ প্যাথলজি ল্যাবে ফুল অটোমেটেড অ্যানালাইজারে পূর্ণাঙ্গ লিপিড প্রোফাইল টেস্টের নিয়মিত ফি ৳৬০০ - ৳১,০০০ এবং একক কোলেস্টেরল ৳২০০ - ৳৩৫০।",
    "১০ থেকে ১২ ঘণ্টা ফাস্টিং নিয়ম: লিপিড প্রোফাইল টেস্টের জন্য রক্ত দেওয়ার পূর্বে ১০-১২ ঘণ্টা যেকোনো খাবার ও পানীয় বর্জন করে শুধু সাধারণ খাবার পানি পান করতে হয়।",
    "স্বাভাবিক মাত্রা (Reference Ranges): টোটাল কোলেস্টেরল < ২০০ mg/dL, ট্রাইগ্লিসারাইডস < ১৫০ mg/dL, এইচডিএল (ভালো চর্বি) > ৪০ mg/dL (পুরুষ) ও > ৫০ mg/dL (নারী), এবং এলডিএল (খারাপ চর্বি) < ১০০ mg/dL।",
    "কার্ডিয়াক রিস্ক রেশিও (Chol/HDL Ratio): রক্তে মোট কোলেস্টেরল ও এইচডিএলের অনুপাত ৪.৫-এর নিচে থাকা হৃদযন্ত্রের জন্য নিরাপদ; রেশিও ৫-এর বেশি হলে করোনারি আর্টারি ব্লকের ঝুঁকি বহুগুণ বেড়ে যায়।",
    "স্ট্যাটিন ঔষধের নিরাপত্তা স্ক্রিনিং: রক্তে চর্বি কমানোর ঔষধ (Atorvastatin বা Rosuvastatin) শুরু করার আগে লিভার এনজাইম (SGPT) ও কিডনি ফাংশন (Creatinine) বেসলাইন পরীক্ষা করে নেওয়া অপরিহার্য।",
    "স্ট্রোক ও হার্ট অ্যাটাক প্রতিরোধ: উচ্চ কোলেস্টেরল রক্তনালীতে প্লাক বা ব্লক তৈরি করে অ্যাথেরোস্ক্লেরোসিস সৃষ্টি করে, যা প্রাথমিক অবস্থায় কোনো বাহ্যিক লক্ষণ প্রকাশ করে না।",
    "সরকারি বনাম বেসরকারি সুবিধা: ফেনী ২৫০ শয্যা জেনারেল হাসপাতালে স্বল্প খরচে (৳২০০-৳৩০০) লিপিড পরীক্ষা করা যায়, তবে বেসরকারি ল্যাবগুলোতে ৩-৪ ঘণ্টায় বিস্তারিত ফ্র্যাকশন রিপোর্ট পাওয়া যায়।",
    "হেলথ ক্লাব ডিজিটাল মেম্বারদের জন্য ফেনী সদরের অনুমোদিত পার্টনার ডায়াগনস্টিক ল্যাবে লিপিড প্রোফাইলসহ সকল প্যাথলজি বিলে সরাসরি ১০% থেকে ৩০% নিশ্চিত মেম্বার ছাড়।",
  ],
  introParagraphsBn: [
    "লিপিড প্রোফাইল (Lipid Profile Panel) হলো রক্তের একটি অত্যন্ত গুরুত্বপূর্ণ বায়োকেমিক্যাল পরীক্ষা, যা মানবদেহে চর্বি বা লিপিডের সামগ্রিক ভারসাম্য এবং রক্ত সংবহনতন্ত্রের স্বাস্থ্য মূল্যায়ন করে। অনিয়ন্ত্রিত কোলেস্টেরল ও রক্তে উচ্চ চর্বির মাত্রা রক্তনালীর প্রাচীরে প্লাক (Plaque) জমিয়ে রক্ত চলাচলের পথ সরু করে ফেলে, যা চিকিৎসাবিজ্ঞানের ভাষায় অ্যাথেরোস্ক্লেরোসিস (Atherosclerosis) নামে পরিচিত। এর প্রত্যক্ষ পরিণতি হিসেবে উচ্চ রক্তচাপ, হার্ট অ্যাটাক, এনজাইনা (বুকে ব্যথা) এবং মস্তিষ্কে রক্তক্ষরণ বা ইস্কেমিক স্ট্রোকের ঝুঁকি মারাত্মকভাবে বৃদ্ধি পায়। সবচেয়ে বিপজ্জনক বিষয় হলো, রক্তে কোলেস্টেরল অতিরিক্ত বেড়ে গেলেও অধিকাংশ ক্ষেত্রে কোনো প্রাথমিক বাহ্যিক লক্ষণ বা উপসর্গ প্রকাশ পায় না।",
    "একটি পূর্ণাঙ্গ লিপিড প্রোফাইল রিপোর্টে সাধারণত পাঁচটি প্রধান প্যারামিটার বিশ্লেষণ করা হয়। প্রথমত, টোটাল কোলেস্টেরল (Total Cholesterol), যার নিরাপদ মাত্রা হলো ২০০ mg/dL-এর নিচে। দ্বিতীয়ত, ট্রাইগ্লিসারাইডস (Triglycerides), যা মূলত অতিরিক্ত শর্করা ও স্নেহজাতীয় খাদ্য থেকে লিভারে তৈরি হওয়া সাধারণ চর্বি; এর স্বাভাবিক মাত্রা ১৫০ mg/dL-এর নিচে থাকা বাঞ্ছনীয়। তৃতীয়ত, এইচডিএল কোলেস্টেরল (High-Density Lipoprotein বা 'ভালো চর্বি'), যা রক্তনালী থেকে অতিরিক্ত কোলেস্টেরল সংগ্রহ করে লিভারে ফিরিয়ে এনে শরীরকে রক্ষা করে। চতুর্থত, এলডিএল কোলেস্টেরল (Low-Density Lipoprotein বা 'খারাপ চর্বি'), যা ধমনীর দেয়ালে চর্বির স্তর তৈরি করে ব্লক সৃষ্টি করে এবং এর কাম্য মাত্রা ১০০ mg/dL-এর কম। পঞ্চমত, ভিএলডিএল (VLDL) এবং মোট কোলেস্টেরল ও এইচডিএলের আনুপাতিক ঝুঁকি রেশিও।",
    "লিপিড প্রোফাইল টেস্টের ফলাফলের নির্ভুলতা নিশ্চিত করতে সবচেয়ে গুরুত্বপূর্ণ শর্ত হলো সঠিক ফাস্টিং বা খালি পেটের নিয়ম মেনে চলা। রক্ত দেওয়ার পূর্বে রোগীকে অবশ্যই টানা ১০ থেকে ১২ ঘণ্টা কোনো প্রকার খাবার, দুধ, চা, কফি, জুস কিংবা অ্যালকোহল গ্রহণ থেকে বিরত থাকতে হবে। তবে এই ফাস্টিং সময়ে তৃষ্ণা মেটাতে পর্যাপ্ত পরিমাণ সাধারণ খাবার পানি পান করার কোনো বাধা নেই; বরং পর্যাপ্ত পানি পান করলে শিরা সহজে দৃশ্যমান হয় এবং রক্ত ড্র করা সহজ হয়। পরীক্ষার আগের রাতে অতিরিক্ত তেল-চর্বিযুক্ত ভোজ বা মিষ্টি খাবার পরিহার করা উচিত, কারণ তা ট্রাইগ্লিসারাইডের মাত্রাকে কৃত্রিমভাবে বাড়িয়ে দিতে পারে।",
    "ফেনী সদর শহরের আধুনিক অনুমোদিত ডায়াগনস্টিক সেন্টারগুলোতে বর্তমানে ফুল অটোমেটেড ক্লিনিক্যাল কেমিস্ট্রি অ্যানালাইজার ব্যবহার করে ডাইরেক্ট এনজাইমেটিক পদ্ধতিতে লিপিড প্রোফাইল পরীক্ষা করা হয়। এই অটোমেটেড প্রযুক্তিতে প্রতিটি ল্যাব প্যারামিটারের স্পেকট্রোফটোমেট্রিক রিডিং স্বয়ংক্রিয়ভাবে রেকর্ড হয় এবং প্রতিদিন সকালে সার্টিফাইড ক্যালিব্রেটর ও কোয়ালিটি কন্ট্রোল (QC) সিরাম রান করানোর মাধ্যমে মেশিনের নির্ভুলতা নিশ্চিত করা হয়। এর ফলে রোগীরা মাত্র ৩ থেকে ৪ ঘণ্টার মধ্যেই নির্ভরযোগ্য এবং প্যাথলজিস্ট কর্তৃক স্বাক্ষরিত কম্পিউটারাইজড রিপোর্ট সংগ্রহ করতে পারেন।",
    "ফেনী জেলার স্বাস্থ্যসেবায় হৃদরোগ ও হাইপারটেনশন ব্যবস্থাপনায় [ফেনীর সেরা কার্ডিওলজিস্ট ডাক্তার](/blog/best-cardiologists-in-feni), সাধারণ স্বাস্থ্য ও ডায়াবেটিস প্রতিরোধে [ফেনীর সেরা মেডিসিন ডাক্তার](/blog/best-medicine-doctors-in-feni), হার্টের সার্বিক পরীক্ষা ও ইকো-ইটিটির জন্য [কার্ডিয়াক ইসিজি ও ইকো টেস্ট গাইড](/blog/feni-cardiac-ecg-echo-ett-test-guide), ব্রেইন স্ট্রোক প্রতিরোধ ও জরুরি সেবায় [ফেনী স্ট্রোক ও কার্ডিয়াক কেয়ার](/blog/feni-stroke-cardiac-guide), বাৎসরিক স্বাস্থ্য মূল্যায়নে [হোল বডি হেলথ চেকআপ প্যাকেজ](/blog/full-body-health-checkup-packages-in-feni), সকল ল্যাব টেস্টের বাজারদরের জন্য [মেডিকেল টেস্ট মূল্যতালিকা](/blog/feni-medical-test-price-list), সাশ্রয়ী সরকারি সেবায় [ফেনী ২৫০ শয্যা জেনারেল হাসপাতাল](/blog/feni-sadar-hospital-guide), এবং নিয়মিত সকল টেস্টে সর্বোচ্চ ছাড় পেতে [ফেনী হেলথ ক্লাব মেম্বারশিপ গাইড](/blog/feni-health-club-membership-discount-guide) রোগীদের পূর্ণাঙ্গ ও নির্ভরযোগ্য গাইডলাইন প্রদান করে।",
    "ফেনী সদর শহরের অনুমোদিত ডায়াগনস্টিক সেন্টারগুলোতে পূর্ণাঙ্গ লিপিড প্রোফাইল টেস্টের নিয়মিত বাজার ফি সাধারণত ৬০০ থেকে ১,০০০ টাকা এবং একক কোলেস্টেরল ২০০ থেকে ৩৫০ টাকার মধ্যে হয়ে থাকে। তবে হেলথ ক্লাবের নিবন্ধিত ডিজিটাল মেম্বাররা ফেনী সদরের অনুমোদিত পার্টনার স্বাস্থ্যকেন্দ্রে (যেমন: প্যাসিফিক হেলথ কেয়ার সেন্টার, লাইফ কেয়ার ডায়াগনস্টিক সেন্টার, ইম্পেরিয়াল নিউরোকেয়ার, ফেনী ম্যাক্স ডায়াগনস্টিক ও আল-আকসা হাসপাতাল) মেম্বার কার্ড প্রদর্শন করে লিপিড প্রোফাইলসহ সকল রক্ত পরীক্ষায় সরাসরি ১০% থেকে ৩০% নিশ্চিত মেম্বার ছাড় (১০-৩০% মেম্বার ছাড়) পেয়ে থাকেন।",
  ],
  diagnosticComparisonTable: FENI_LIPID_COMPARISON_TABLE,
  diagnosticCenters: FENI_LIPID_CENTERS,
  diagnosticTestPricingBn: FENI_LIPID_TEST_PRICING,
  bookingGuideBn: {
    titleBn: "৪টি ধাপে লিপিড প্রোফাইল পরীক্ষার সঠিক ফাস্টিং ও স্যাম্পল ড্র গাইড",
    stepsBn: [
      {
        step: "১ম ধাপ: ফাস্টিং বা উপোসের সঠিক সময় গণনা (১০-১২ ঘণ্টা)",
        title: "রাতের খাবার রাত ৮টা থেকে ৯টার মধ্যে সম্পন্ন করে সকাল ৮টা-৯টায় ল্যাবে যাওয়া",
        desc: "লিপিড প্রোফাইলের জন্য সর্বোত্তম ফাস্টিং সময়কাল ১০ থেকে ১২ ঘণ্টা। ৮ ঘণ্টার কম উপোস থাকলে ট্রাইগ্লিসারাইড ভুল আসতে পারে এবং ১৪ ঘণ্টার বেশি উপোস থাকলেও ফলাফলে বিকৃতি ঘটতে পারে। ফাস্টিং চলাকালীন চা, কফি, পান বা সিগারেট সম্পূর্ণ পরিহার করুন।",
      },
      {
        step: "২য় ধাপ: ফাস্টিং অবস্থায় পর্যাপ্ত পানি পান ও ঔষধ গ্রহণ",
        title: "সাধারণ খাবার পানি প্রচুর পান করুন এবং চিকিৎসকের নির্দেশিত ঔষধ সেবন",
        desc: "উপোস থাকার সময় পানি পানে কোনো বাধা নেই। সকালে ১-২ গ্লাস সাধারণ পানি পান করলে রক্ত ঘন হওয়া রোধ হয় এবং ফ্লেবোটোমিস্টের জন্য শিরা পাওয়া সহজ হয়। রক্তচাপের নিয়মিত ঔষধ সকালে চিকিৎসকের পরামর্শ অনুযায়ী অল্প পানিতে সেবন করা যায়।",
      },
      {
        step: "৩য় ধাপ: হলুদ এসএসটি জেল টিউবে রক্ত সংগ্রহ ও বারকোড নিশ্চিতকরণ",
        title: "জীবাণুমুক্ত ডিসপোজেবল সিরিঞ্জ ও সিরাম সেপারেটর টিউব (SST) ব্যবহার",
        desc: "লিপিড পরীক্ষার জন্য সাধারণত হলুদ ক্যাপযুক্ত জেল ভ্যাকুটেইনার (SST Tube) ব্যবহার করা হয়, যা রক্ত জমাট বাঁধার পর সেন্ট্রিফিউজে সিরাম আলাদা করতে সহায়তা করে। টিউবে আপনার নাম ও ল্যাব বারকোড লাগানো হয়েছে কি না তা নিশ্চিত করুন।",
      },
      {
        step: "৪র্থ ধাপ: রক্ত ড্র-এর পর যত্ন, বিশ্রাম ও একই দিনে রিপোর্ট গ্রহণ",
        title: "তুলা দিয়ে ইনজেকশন পয়েন্ট ৫ মিনিট সোজা রেখে চেপে রাখা ও ফল সংগ্রহ",
        desc: "রক্ত নেওয়ার পর কনুই ভাঁজ না করে তুলা দিয়ে ৫ মিনিট সোজাভাবে চেপে রাখুন যাতে রক্তক্ষরণ বা কালশিটে না পড়ে। ফেনী সদরের আধুনিক অটোমেটেড ল্যাব থেকে ৩ থেকে ৪ ঘণ্টার মধ্যে বা অনলাইনের মাধ্যমে আপনার রিপোর্ট সংগ্রহ করুন।",
      },
    ],
  },
  selectionGuideBn: {
    titleBn: "ফেনীতে নির্ভরযোগ্য লিপিড ও বায়োকেমিস্ট্রি ল্যাব নির্বাচনের ৫টি মূল মাপকাঠি",
    pointsBn: [
      {
        title: "ফুল অটোমেটেড ক্লিনিক্যাল কেমিস্ট্রি অ্যানালাইজার প্রযুক্তি",
        desc: "ম্যানুয়াল বা সেমি-অটোমেটেড মেশিনে মানুষের ভুলের সম্ভাবনা থাকে। রোশ (Roche), ব্যাকম্যান কুলটার বা সমমানের স্বয়ংক্রিয় ক্লিনিক্যাল অ্যানালাইজার সমৃদ্ধ ল্যাব নির্বাচন করলে লিপিড ফ্র্যাকশনের শতভাগ নির্ভুল ফলাফল পাওয়া যায়।",
      },
      {
        title: "প্রতিদিন নিয়মিত কন্ট্রোল সিরাম রান ও ইন-হাউজ ক্যালিব্রেশন",
        desc: "বিশ্বমানের প্যাথলজি ল্যাবগুলো প্রতিদিন সকালে বাণিজ্যিক কন্ট্রোল সিরাম ব্যবহার করে মেশিনের সঠিকতা যাচাই করে। যে ল্যাব নিয়মিত কোয়ালিটি কন্ট্রোল (QC) রেকর্ড বজায় রাখে সেখান থেকেই রক্ত পরীক্ষা করানো উচিত।",
      },
      {
        title: "ডাইরেক্ট এনজাইমেটিক পদ্ধতিতে এইচডিএল ও এলডিএল পরিমাপ",
        desc: "কিছু সাধারণ ল্যাব কেবল টোটাল কোলেস্টেরল মেপে ফ্রিডওয়াল্ড ফর্মুলা দিয়ে এলডিএল ক্যালকুলেট করে, যা ট্রাইগ্লিসারাইড বেশি থাকলে ভুল মান দেখায়। ডাইরেক্ট এনজাইমেটিক মেথডে এলডিএল মাপা হয় এমন ল্যাব বেছে নিন।",
      },
      {
        title: "অভিজ্ঞ ক্লিনিক্যাল বায়োকেমিস্ট ও প্যাথলজিস্ট কর্তৃক রিপোর্ট যাচাই",
        desc: "লিপিড প্রোফাইলের মান অস্বাভাবিক এলে তা কোনো বিশেষজ্ঞ প্যাথলজিস্ট বা বায়োকেমিস্ট পর্যালোচনা করে ক্লিনিক্যাল কোরিলেশন করছেন কি না তা যাচাই করা অত্যন্ত জরুরি।",
      },
      {
        title: "হেলথ ক্লাব কার্ডে ১০-৩০% নিশ্চিত মেম্বার ছাড়ের সুবিধা",
        desc: "ফেনী সদরের অনুমোদিত পার্টনার ডায়াগনস্টিক সেন্টারে টেস্টের পূর্বে হেলথ ক্লাব ডিজিটাল মেম্বার কার্ড প্রদর্শন করে তাৎক্ষণিক ১০-৩০% মেম্বার ছাড় গ্রহণ করে চিকিৎসা খরচ উল্লেখযোগ্যভাবে সাশ্রয় করুন।",
      },
    ],
  },
  faqs: [
    {
      questionBn: "লিপিড প্রোফাইল (Lipid Profile) টেস্ট কী এবং এটি কেন করা হয়?",
      questionEn: "What is a lipid profile test and why is it performed?",
      answerBn:
        "লিপিড প্রোফাইল হলো একটি সমন্বিত রক্ত পরীক্ষা যা রক্তে বিভিন্ন ধরনের চর্বি বা লিপিডের (যেমন: টোটাল কোলেস্টেরল, ট্রাইগ্লিসারাইডস, এইচডিএল ভালো চর্বি ও এলডিএল খারাপ চর্বি) মাত্রা পরিমাপ করে। এটি হার্ট অ্যাটাক, উচ্চ রক্তচাপ, করোনারি আর্টারি ব্লক এবং মস্তিষ্কে স্ট্রোকের ঝুঁকি আগে থেকেই মূল্যায়ন করতে চিকিৎসকরা নির্দেশ করে থাকেন।",
      answerEn:
        "A lipid profile is a comprehensive blood panel measuring total cholesterol, triglycerides, HDL (good) and LDL (bad) cholesterol. It assesses the risk of coronary artery disease, atherosclerosis, heart attacks, and ischemic stroke.",
    },
    {
      questionBn: "লিপিড প্রোফাইল টেস্টের জন্য কতক্ষণ খালি পেটে (Fasting) থাকতে হয়?",
      questionEn: "How many hours of fasting is required for a lipid profile test?",
      answerBn:
        "লিপিড প্রোফাইল পরীক্ষার জন্য আদর্শ ফাস্টিং বা খালি পেটের সময়কাল হলো ১০ থেকে ১২ ঘণ্টা। রক্ত দেওয়ার আগের রাতে রাত ৮টা থেকে ৯টার মধ্যে স্বাভাবিক খাবার শেষ করে পরদিন সকালে ৮টা থেকে ৯টার মধ্যে রক্তের নমুনা দেওয়া সবচেয়ে উত্তম। ১০ ঘণ্টার কম বা ১৪ ঘণ্টার বেশি উপোস থাকলে ফলাফলে তারতম্য ঘটতে পারে।",
      answerEn:
        "An overnight fast of 10 to 12 hours is strictly recommended for an accurate lipid profile, especially for serum triglycerides. Fasting under 10 hours or exceeding 14 hours may distort lipoprotein fractionation readings.",
    },
    {
      questionBn: "ফাস্টিং বা খালি পেটে থাকার সময় কি সাধারণ পানি পান করা যাবে?",
      questionEn: "Can I drink plain water during the fasting period before the test?",
      answerBn:
        "হ্যাঁ, লিপিড প্রোফাইলের জন্য ফাস্টিং চলাকালীন যেকোনো সময় স্বাভাবিক খাবার পানি পান করা সম্পূর্ণ নিরাপদ এবং চিকিৎসাবিজ্ঞানসম্মত। তবে কোনো ধরনের চা, কফি, দুধ, শরবত, কোমল পানীয়, মিষ্টি বা শক্ত খাবার খাওয়া যাবে না। পর্যাপ্ত পানি পান করলে শিরা সহজে দৃশ্যমান হয় এবং রক্ত নেওয়া সহজ হয়।",
      answerEn:
        "Yes, drinking plain water is completely permitted and encouraged during fasting. It maintains hydration and facilitates smooth blood collection. However, tea, coffee, milk, juices, sugar, and tobacco must be strictly avoided.",
    },
    {
      questionBn: "রক্তে কোলেস্টেরল ও ট্রাইগ্লিসারাইডের স্বাভাবিক মাত্রা কত?",
      questionEn: "What are the standard normal reference ranges for cholesterol and triglycerides?",
      answerBn:
        "প্রাপ্তবয়স্কদের ক্ষেত্রে স্বাভাবিক মাত্রা: টোটাল কোলেস্টেরল < ২০০ mg/dL (২০০-২৩৯ ঝুঁকিপূর্ণ, ২৪০ বা বেশি অত্যন্ত উচ্চ); ট্রাইগ্লিসারাইডস < ১৫০ mg/dL (১৫০-১৯৯ বর্ডারলাইন, ২০০-৪৯৯ উচ্চ); ভালো কোলেস্টেরল (HDL) পুরুষদের > ৪০ mg/dL ও নারীদের > ৫০ mg/dL; এবং খারাপ কোলেস্টেরল (LDL) < ১০০ mg/dL।",
      answerEn:
        "Standard adult reference ranges: Total Cholesterol < 200 mg/dL; Triglycerides < 150 mg/dL; HDL (protective) > 40 mg/dL (men) and > 50 mg/dL (women); and LDL (atherogenic) < 100 mg/dL (or < 70 mg/dL for high-risk heart patients).",
    },
    {
      questionBn: "ভালো কোলেস্টেরল (HDL) এবং খারাপ কোলেস্টেরল (LDL)-এর মধ্যে পার্থক্য কী?",
      questionEn: "What is the difference between HDL and LDL cholesterol?",
      answerBn:
        "এইচডিএল (High-Density Lipoprotein)-কে ভালো কোলেস্টেরল বলা হয় কারণ এটি রক্তনালী থেকে অতিরিক্ত চর্বি তুলে নিয়ে লিভারে অপসারণের জন্য পাঠায়, যা হার্ট অ্যাটাকের ঝুঁকি কমায়। অপরদিকে এলডিএল (Low-Density Lipoprotein)-কে খারাপ কোলেস্টেরল বলা হয় কারণ এটি ধমনীর দেয়ালে জমে রক্ত চলাচল বন্ধ করে ব্লক বা প্লাক তৈরি করে।",
      answerEn:
        "HDL acts as a vascular scavenger, carrying excess cholesterol away from arterial walls back to the liver for excretion (cardioprotective). In contrast, LDL deposits lipid plaques inside arterial walls, narrowing blood vessels and triggering heart attacks.",
    },
    {
      questionBn: "লিপিড প্রোফাইল টেস্টের রিপোর্ট পেতে ফেনীতে কত সময় লাগে?",
      questionEn: "What is the turnaround time for a lipid profile report in Feni?",
      answerBn:
        "ফেনী সদর শহরের আধুনিক অনুমোদিত ডায়াগনস্টিক ল্যাবগুলোতে রক্তের নমুনা দেওয়ার পর ৩ থেকে ৪ ঘণ্টার মধ্যে পূর্ণাঙ্গ লিপিড প্রোফাইল রিপোর্ট পাওয়া যায়। অনেক সেন্টারে অনলাইনের মাধ্যমে বা রোগীর ফোনে এসএমএস পাঠিয়ে রিপোর্ট ডাউনলোডের লিংক সরবরাহ করা হয়।",
      answerEn:
        "In modern automated diagnostic laboratories across Feni Sadar, complete lipid profile reports are ready within 3 to 4 hours on the same day, accessible via printout or online lab portals.",
    },
    {
      questionBn: "কোলেস্টেরল বেশি এলে করণীয় কী এবং কোন বিশেষজ্ঞ ডাক্তারের পরামর্শ নেবেন?",
      questionEn: "What should you do if cholesterol is high and which specialist doctor to consult?",
      answerBn:
        "লিপিড প্রোফাইলে চর্বির মাত্রা বেশি এলে আতঙ্কিত না হয়ে একজন অভিজ্ঞ কার্ডিওলজিস্ট (হৃদরোগ বিশেষজ্ঞ) অথবা মেডিসিন বিশেষজ্ঞ ডাক্তারের পরামর্শ নেওয়া উচিত। ডাক্তার প্রয়োজন অনুযায়ী স্ট্যাটিন জাতীয় ঔষধ (যেমন অ্যাটোরভাস্ট্যাটিন/রসুভাস্ট্যাটিন) প্রেসক্রাইব করতে পারেন এবং তেল-চর্বিযুক্ত খাবার কমানো ও দৈনিক ৩০ মিনিট হাঁটার পরামর্শ দেবেন।",
      answerEn:
        "If your lipid profile is elevated, promptly consult a BMDC-registered cardiologist or medicine specialist in Feni. They will evaluate your 10-year ASCVD risk score, initiate lifestyle/dietary modifications, and prescribe statin therapy if indicated.",
    },
    {
      questionBn: "হেলথ ক্লাব মেম্বার কার্ডে ফেনীতে লিপিড প্রোফাইল টেস্টে কত ছাড় পাওয়া যায়?",
      questionEn: "What discount do Health Club members get on lipid profile tests in Feni?",
      answerBn:
        "হেলথ ক্লাবের নিবন্ধিত ডিজিটাল মেম্বাররা ফেনী সদর উপজেলার অনুমোদিত পার্টনার ডায়াগনস্টিক সেন্টার ও হাসপাতালে (যেমন: প্যাসিফিক হেলথ কেয়ার, লাইফ কেয়ার ডায়াগনস্টিক, ফেনী ম্যাক্স, আল-আকসা ও ইম্পেরিয়াল নিউরোকেয়ার) লিপিড প্রোফাইল, কোলেস্টেরল, ট্রাইগ্লিসারাইড, ব্লাড সুগার ও সকল প্যাথলজি টেস্টে সরাসরি ১০% থেকে ৩০% নিশ্চিত মেম্বার ছাড় (১০-৩০% মেম্বার ছাড়) পেয়ে থাকেন।",
      answerEn:
        "Health Club digital cardholders receive guaranteed 10% to 30% member discounts on lipid profile, cholesterol panels, cardiac markers, and all pathology investigations at contracted partner centers in Feni Sadar upon showing their card before billing.",
    },
  ],
  relatedSlugs: [
    "best-cardiologists-in-feni",
    "feni-cardiac-ecg-echo-ett-test-guide",
    "best-medicine-doctors-in-feni",
    "feni-stroke-cardiac-guide",
    "full-body-health-checkup-packages-in-feni",
    "feni-medical-test-price-list",
    "feni-health-club-membership-discount-guide",
    "best-diagnostic-centers-in-feni",
  ],
};
