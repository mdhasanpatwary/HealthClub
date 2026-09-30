import { Doctor } from "@/services/db";
import { SITE_URL } from "@/lib/siteConfig";
import { DepartmentSeoConfig } from "@/data/doctorSeoData";
import { UpazilaSeoConfig } from "@/data/feniLocations";
import { GeoAnswerCapsuleData } from "@/types/blog";

export const DEFAULT_CONSULTANT_GEO_DATA: GeoAnswerCapsuleData = {
  directAnswerBn:
    "ফেনী সদর ও পার্শ্ববর্তী এলাকায় বিএমডিসি নিবন্ধিত বিশেষজ্ঞ চিকিৎসকদের চেম্বার কনসালটেশন ফি সাধারণত ৫০০ থেকে ১৫০০ টাকা। হেলথ ক্লাব মেম্বারদের জন্য রয়েছে দ্রুত সিরিয়াল সহায়তা এবং বিশেষজ্ঞ ডাক্তারের প্রেসক্রিপশন অনুযায়ী প্রয়োজনীয় প্যাথলজি টেস্ট ও ডিজিটাল ইমেজিংয়ে ১০% থেকে ৩০% পর্যন্ত বিশেষ ছাড় সুবিধা।",
  quickTakeawaysBn: [
    "মেডিসিন, সার্জারি, গাইনি, শিশু, অর্থোপেডিক ও কার্ডিওলজি বিশেষজ্ঞ ডিরেক্টরি",
    "সরাসরি চেম্বার সহকারী ও হাসপাতালের অফিসিয়াল সিরিয়াল হেল্পলাইন",
    "প্রেসক্রিপশন অনুযায়ী প্যাথলজি ও রেডিওলজি টেস্টে ১০-৩০% মেম্বার ছাড়",
    "বিএমডিসি নিবন্ধিত ও অভিজ্ঞ কনসালট্যান্টদের ভেরিফাইড শিডিউল",
  ],
  referenceFees: [
    {
      serviceNameBn: "বিশেষজ্ঞ কনসালট্যান্ট ভিজিট (এমবিবিএস/এফসিপিএস)",
      serviceNameEn: "Specialist Consultant Consultation",
      regularPriceRangeBn: "৳৭০০ - ৳১,৫০০",
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    },
    {
      serviceNameBn: "জেনারেল ফিজিশিয়ান / মেডিকেল অফিসার ভিজিট",
      serviceNameEn: "General Physician / Medical Officer",
      regularPriceRangeBn: "৳৩০০ - ৳৬০০",
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    },
    {
      serviceNameBn: "ফলো-আপ ভিজিট (১৪ দিনের মধ্যে)",
      serviceNameEn: "Follow-up Consultation Fee",
      regularPriceRangeBn: "৳৪০০ - ৳৮০০",
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    },
    {
      serviceNameBn: "প্রেসক্রিপশন প্যাথলজি ও ডায়াগনস্টিক টেস্ট",
      serviceNameEn: "Pathological & Diagnostic Investigations",
      regularPriceRangeBn: "৳৩০০ - ৳৩,০০০",
      discountBadgeBn: "১০-৩০% মেম্বার ছাড়",
    },
  ],
  verifiedNoteBn: "হেলথ ক্লাব ক্লিনিক্যাল এডিটোরিয়াল বোর্ড কর্তৃক চিকিৎসকদের বিএমডিসি রেজিস্ট্রেশন ও চেম্বার সময়সূচী যাচাইকৃত",
};

export interface ConsultantFaqItem {
  question: string;
  answer: string;
  questionEn?: string;
  answerEn?: string;
}

/**
 * Standard 7 conversational Q&As for the main consultants directory (/consultants)
 */
export const DEFAULT_CONSULTANTS_DIRECTORY_FAQS: ConsultantFaqItem[] = [
  {
    question: "ফেনীতে বিশেষজ্ঞ ডাক্তারের সিরিয়াল বা অ্যাপয়েন্টমেন্ট কীভাবে বুক করবেন?",
    answer: "হেলথ ক্লাব ডিরেক্টরিতে যেকোনো ডাক্তারের প্রোফাইলে 'সিরিয়াল কল করুন' বাটনে চাপ দিন। এতে সরাসরি সংশ্লিষ্ট হাসপাতাল ও চেম্বার কাউন্টারের অফিসিয়াল হটলাইন নাম্বার চলে আসবে। সেখানে কল করে কোনো প্রকার মধ্যস্বত্বভোগী বা বাড়তি ফি ছাড়াই আপনার সিরিয়াল নিশ্চিত করুন।",
  },
  {
    question: "ফেনীতে আজ কোন ডাক্তার চেম্বারে বসবেন তা কীভাবে জানব?",
    answer: "হেলথ ক্লাব ডিরেক্টরির প্রতিটি ডাক্তারের কার্ডে 'আজ চেম্বার খোলা' বা 'আজ চেম্বার বন্ধ' স্ট্যাটাস ব্যাজ এবং রোগী দেখার দিন ও সময় স্পষ্ট উল্লেখ থাকে। এছাড়া আপনার প্রয়োজনীয় বিভাগ (যেমন মেডিসিন, গাইনী, শিশু রোগ) নির্বাচন করে আজকের শিডিউল অনুযায়ী সহজেই ডাক্তার খুঁজে নিতে পারেন।",
  },
  {
    question: "ফেনীর ডাক্তারদের চেম্বার ও সময়সূচী কোথায় পাওয়া যাবে?",
    answer: "আমাদের ডিরেক্টরিতে ফেনীর এস.এস.কে রোড, ট্রাঙ্ক রোড, শহীদ শহীদুল্লা কায়সার সড়ক ও গ্র্যান্ড ট্রাঙ্ক রোডের সকল প্রধান ক্লিনিক ও ডায়াগনস্টিক সেন্টারের চিকিৎসকদের চেম্বার নাম, রুম নম্বর, রোগী দেখার দিন এবং সময়সূচী সম্পূর্ণ হালনাগাদ আকারে পাওয়া যায়।",
  },
  {
    question: "ফেনীর বিশেষজ্ঞ ডাক্তারদের কনসালটেশন ফি সাধারণত কত টাকা?",
    answer: "ফেনী সদর এলাকার অভিজ্ঞ ও বিএমডিসি নিবন্ধিত বিশেষজ্ঞ ডাক্তারদের চেম্বার কনসালটেশন বা ভিজিট ফি সাধারণত ৫০০ টাকা থেকে ১,৫০০ টাকা পর্যন্ত হয়ে থাকে। ফলো-আপ ভিজিটের ক্ষেত্রে (১৪ দিনের মধ্যে) ফি সাধারণত ৩০০ থেকে ৮০০ টাকা।",
  },
  {
    question: "ডাক্তার দেখানোর পর টেস্ট বা পরীক্ষায় হেলথ ক্লাব মেম্বাররা কী সুবিধা পান?",
    answer: "ডাক্তার দেখানোর পর চিকিৎসকের পরামর্শ অনুযায়ী সকল প্রয়োজনীয় ডায়াগনস্টিক পরীক্ষা (যেমন: রক্ত পরীক্ষা, ডিজিটাল এক্স-রে, আল্ট্রাসনোগ্রাম, ইকো, এমআরআই, সিটি স্ক্যান)-এ হেলথ ক্লাব মেম্বাররা পার্টনার হাসপাতাল ও ল্যাবগুলোতে ১০% থেকে ৩০% পর্যন্ত তাৎক্ষণিক ডিসকাউন্ট পান।",
  },
  {
    question: "শুক্রবার বা ছুটির দিনে ফেনীতে কোন কোন বিশেষজ্ঞ ডাক্তার বসেন?",
    answer: "শুক্রবার ফেনী সদরের প্রধান হাসপাতাল ও ডায়াগনস্টিক সেন্টারগুলোতে ঢাকা ও চট্টগ্রাম থেকে আগত ভিজিটিং প্রফেসর এবং স্থানীয় শীর্ষ বিশেষজ্ঞ চিকিৎসকরা বিশেষ চেম্বার পরিচালনা করেন। হেলথ ক্লাবের শুক্রবার ফিল্টার ব্যবহার করে এসব চিকিৎসকের তালিকা দেখা যাবে।",
  },
  {
    question: "চেম্বারে যাওয়ার পূর্বে কী প্রস্তুতি নেওয়া প্রয়োজন ও তথ্য কতটা নির্ভরযোগ্য?",
    answer: "আমাদের ডেডিকেটেড হেলথ টিম নিয়মিত হাসপাতাল ও চেম্বারগুলোর সাথে সরাসরি যোগাযোগ রেখে ডাক্তারদের সময়সূচি এবং সিরিয়াল নম্বর যাচাই করে। চেম্বারে যাওয়ার পূর্বে ফোনে সিরিয়াল নিশ্চিত করুন এবং রোগীর পূর্বের প্রেসক্রিপশন ও রিপোর্ট সাথে নিয়ে নির্ধারিত সময়ের ৩০ মিনিট পূর্বে উপস্থিত হোন।",
  },
];

/**
 * Returns 5–8 high-density conversational FAQs tailored to a specific medical department
 */
export function getHighDensityDepartmentFaqs(
  deptSeo: DepartmentSeoConfig
): ConsultantFaqItem[] {
  const existing: ConsultantFaqItem[] = (deptSeo.faqs || []).map((f) => ({
    question: f.qBn,
    answer: f.aBn,
    questionEn: f.qEn,
    answerEn: f.aEn,
  }));

  const existingQs = new Set(existing.map((f) => f.question.toLowerCase()));
  const deptName = deptSeo.nameBn;

  const supplemental: ConsultantFaqItem[] = [
    {
      question: `ফেনীতে ${deptName} বিশেষজ্ঞ ডাক্তারের সিরিয়াল কীভাবে পাওয়া যায়?`,
      answer: `হেলথ ক্লাবের ${deptName} ডিরেক্টরিতে তালিকাভুক্ত চিকিৎসকের প্রোফাইলে গিয়ে সরাসরি চেম্বারের অফিসিয়াল সিরিয়াল নাম্বারে কল করুন। কোনো প্রকার মধ্যস্বত্বভোগী বা বাড়তি ফি ছাড়াই বিনামূল্যে সিরিয়াল বুক করা যায়।`,
    },
    {
      question: `ফেনীতে ${deptName} বিশেষজ্ঞ চিকিৎসকের ভিজিট বা কনসালটেশন ফি কত?`,
      answer: `ফেনী সদরে ${deptName} বিশেষজ্ঞ চিকিৎসকদের চেম্বার ফি সাধারণত ৫০০ টাকা থেকে ১,৫০০ টাকার মধ্যে থাকে। বিএমডিসি নিবন্ধিত বিশেষজ্ঞ ও অধ্যাপকদের ভিজিট ফি চেম্বারের নিয়ম অনুযায়ী নির্ধারিত হয়।`,
    },
    {
      question: `${deptName} চিকিৎসকের পরামর্শে প্যাথলজি ও ডায়াগনস্টিক টেস্টে কি ছাড় পাওয়া যায়?`,
      answer: `হ্যাঁ, বিশেষজ্ঞ ডাক্তারের প্রেসক্রিপশন অনুযায়ী ফেনী সদরের পার্টনার ডায়াগনস্টিক সেন্টার ও প্যাথলজি ল্যাবগুলোতে হেলথ ক্লাব মেম্বাররা ১০% থেকে ৩০% পর্যন্ত তাৎক্ষণিক ছাড় সুবিধা পেয়ে থাকেন।`,
    },
    {
      question: `কখন একজন রোগীর দ্রুত ${deptName} বিশেষজ্ঞ চিকিৎসকের পরামর্শ নেওয়া উচিত?`,
      answer: `লক্ষণগুলো তীব্র আকার ধারণ করলে বা ঘরোয়া চিকিৎসায় না কমলে বিলম্ব না করে বিশেষজ্ঞ চিকিৎসকের শরণাপন্ন হওয়া জরুরি। দীর্ঘমেয়াদী জটিলতা এড়াতে সঠিক সময়ে রোগ নির্ণয় ও চিকিৎসা গ্রহণ করুন।`,
    },
    {
      question: `ফেনীর কোন কোন এলাকায় ${deptName} বিশেষজ্ঞ চিকিৎসকদের নিয়মিত চেম্বার রয়েছে?`,
      answer: `ফেনী শহরের এসএসকে রোড, ট্রাঙ্ক রোড, শহীদ শহীদুল্লা কায়সার সড়ক এবং হাসপাতাল রোডের প্রধান প্রাইভেট হাসপাতাল ও ডায়াগনস্টিক সেন্টারগুলোতে নিয়মিত চেম্বার অনুষ্ঠিত হয়।`,
    },
    {
      question: `চেম্বারে যাওয়ার সময় রোগীর কী কী কাগজপত্র বা মেডিকেল রিপোর্ট সাথে নেওয়া প্রয়োজন?`,
      answer: `রোগীর পূর্ববর্তী সকল প্রেসক্রিপশন, প্যাথলজি রিপোর্ট, এক্স-রে, সিটি স্ক্যান বা আল্ট্রাসাউন্ড ফিল্ম এবং নিয়মিত সেবন করা ওষুধের তালিকা সাথে রাখা আবশ্যক।`,
    },
  ];

  const result = [...existing];
  for (const item of supplemental) {
    if (result.length >= 7) break;
    if (!existingQs.has(item.question.toLowerCase())) {
      result.push(item);
      existingQs.add(item.question.toLowerCase());
    }
  }

  return result.slice(0, 8);
}

/**
 * Returns 5–7 high-density conversational FAQs tailored to an upazila directory
 */
export function getHighDensityLocationFaqs(
  upzSeo: UpazilaSeoConfig
): ConsultantFaqItem[] {
  const upzName = upzSeo.nameBn;

  return [
    {
      question: `${upzName} থেকে ফেনী সদর হাসপাতালে ডাক্তার দেখাতে গেলে কীভাবে সুবিধা পাবো?`,
      answer: `${upzName} থেকে রোগীরা সহজে ফেনী সদর-ভিত্তিক বিশেষজ্ঞ ডাক্তারদের চেম্বার ও হাসপাতালের তালিকা দেখে ফোনে অগ্রিম সিরিয়াল নিশ্চিত করতে পারেন। এতে শহরে এসে দীর্ঘ লাইনে অপেক্ষা বা যাতায়াতের ভোগান্তি কমে।`,
    },
    {
      question: `${upzName} এলাকার রোগীরা কি টেস্ট বা প্যাথলজি পরীক্ষায় মেম্বার ছাড় পান?`,
      answer: `হ্যাঁ, ${upzName} এলাকার বাসিন্দারা হেলথ ক্লাব মেম্বার কার্ড ব্যবহার করে ফেনী সদরের সকল চুক্তিবদ্ধ পার্টনার ডায়াগনস্টিক ল্যাব ও হাসপাতালে ১০% থেকে ৩০% পর্যন্ত বিশেষ ছাড় পেয়ে থাকেন।`,
    },
    {
      question: `${upzName} থেকে জরুরি সিরিয়াল বা ডাক্তার অ্যাপয়েন্টমেন্ট কীভাবে বুক করবেন?`,
      answer: `হেলথ ক্লাব ডিরেক্টরি থেকে সংশ্লিষ্ট বিশেষজ্ঞ ডাক্তারের চেম্বার বা হাসপাতালের সরাসরি অফিসিয়াল সিরিয়াল নম্বরে কল দিয়ে তাৎক্ষণিকভাবে অ্যাপয়েন্টমেন্ট নিশ্চিত করা যায়।`,
    },
    {
      question: `${upzName} এলাকায় কি বিশেষজ্ঞ ডাক্তারদের নিয়মিত চেম্বার পাওয়া যায়?`,
      answer: `কিছু বিশেষজ্ঞ ডাক্তার নির্দিষ্ট দিনে ${upzName} উপজেলা সদরে রোগী দেখেন। তবে জটিল রোগ নির্ণয় ও চিকিৎসার ক্ষেত্রে রোগীরা দ্রুত ফেনী সদরের প্রধান সেন্টারগুলোতে রেফার্ড হন।`,
    },
    {
      question: `${upzName} থেকে জরুরি রোগী স্থানান্তরের জন্য ২৪ ঘণ্টা অ্যাম্বুলেন্স সেবা কীভাবে পাবো?`,
      answer: `হেলথ ক্লাবের জরুরি হটলাইনে সরাসরি কল করে ${upzName} থেকে ফেনী সদর বা ঢাকা-চট্টগ্রামগামী ২৪ ঘণ্টা আইসিইউ/এসি/নন-এসি অ্যাম্বুলেন্স সাপোর্ট পাওয়া যায়।`,
    },
    {
      question: `চেম্বারে আসার পূর্বে ${upzName} এলাকার রোগীদের কী প্রস্তুতি নেওয়া উচিত?`,
      answer: `ফোনে সিরিয়াল কনফার্ম করুন, পূর্বের প্রেসক্রিপশন ও রিপোর্ট সাথে নিন এবং ফেনী শহরের ট্রাফিক ও ভিড় বিবেচনায় নির্ধারিত সময়ের অন্তত ৩০-৪০ মিনিট পূর্বে চেম্বারে উপস্থিত হোন।`,
    },
  ];
}

/**
 * Builds Schema.org JSON-LD for the Main Consultants Directory (/consultants)
 */
export function generateConsultantsDirectoryJsonLd(options: {
  pageUrl: string;
  doctors: Doctor[];
  faqItems?: ConsultantFaqItem[];
}): Record<string, unknown>[] {
  const { pageUrl, doctors, faqItems = DEFAULT_CONSULTANTS_DIRECTORY_FAQS } = options;

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "ফেনী ডাক্তার তালিকা ও সিরিয়াল বুকিং ডিরেক্টরি",
      description: "ফেনীর সকল হাসপাতালের বিশেষজ্ঞ ডাক্তারদের তালিকা, চেম্বার শিডিউল, রোগী দেখার সময়সূচী এবং সরাসরি সিরিয়াল নাম্বার ও অ্যাপয়েন্টমেন্ট তথ্য।",
      inLanguage: ["bn-BD", "en-US"],
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [
          ".geo-answer-capsule",
          ".faq-answer",
          "#overview",
          "#doctor-directory-heading",
          "#consultants-faq-heading",
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "হোম", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "ডাক্তার ও কনসালট্যান্টস", item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: "Health Club Specialist Doctors Network",
      url: pageUrl,
      description: "Directory of specialist doctors, consultants, chamber schedules, and appointment serial booking in Feni, Bangladesh.",
      areaServed: "Feni, Bangladesh",
      medicalSpecialty: [
        "Psychiatry", "Medicine", "Gastroenterology", "Vascular Surgery",
        "Orthopaedics", "Nephrology", "Hepatology", "Rheumatology",
        "Nutrition", "Gynaecology", "Pediatrics", "Cardiology",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Specialist Doctors in Feni",
      itemListElement: doctors.slice(0, 20).map((doc, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Physician",
          name: doc.name,
          image: doc.imageUrl || `${SITE_URL}/og-image.png`,
          medicalSpecialty: doc.specialty,
          jobTitle: doc.designation,
          telephone: doc.serialPhone,
          worksFor: {
            "@type": "MedicalOrganization",
            name: doc.chamberName,
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: doc.chamberAddress,
            addressLocality: "Feni",
            addressCountry: "BD",
          },
        },
      })),
    },
  ];
}

/**
 * Builds Schema.org JSON-LD for a Department Category Directory (/consultants/department/[slug])
 */
export function generateConsultantDepartmentJsonLd(options: {
  pageUrl: string;
  deptSeo: DepartmentSeoConfig;
  deptDoctors: Doctor[];
}): Record<string, unknown>[] {
  const { pageUrl, deptSeo, deptDoctors } = options;
  const highDensityFaqs = getHighDensityDepartmentFaqs(deptSeo);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: deptSeo.metaTitleBn,
      description: deptSeo.metaDescriptionBn,
      inLanguage: ["bn-BD", "en-US"],
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [
          ".geo-answer-capsule",
          ".faq-answer",
          "#overview",
          "#dept-heading",
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "হোম", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "বিশেষজ্ঞ ডাক্তার", item: `${SITE_URL}/consultants` },
        { "@type": "ListItem", position: 3, name: deptSeo.nameBn, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: `${deptSeo.nameBn} - হেলথ ক্লাব ফেনী`,
      url: pageUrl,
      description: deptSeo.metaDescriptionBn,
      areaServed: {
        "@type": "City",
        name: "Feni",
        containedInPlace: {
          "@type": "Country",
          name: "Bangladesh",
        },
      },
      medicalSpecialty: deptSeo.medicalSpecialtySchema,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: highDensityFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Specialist Doctors in ${deptSeo.nameEn} (Feni)`,
      itemListElement: deptDoctors.slice(0, 15).map((doc, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Physician",
          name: doc.name,
          image: doc.imageUrl || `${SITE_URL}/og-image.png`,
          medicalSpecialty: doc.specialty,
          jobTitle: doc.designation,
          telephone: doc.serialPhone,
          worksFor: {
            "@type": "MedicalOrganization",
            name: doc.chamberName,
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: doc.chamberAddress,
            addressLocality: "Feni",
            addressCountry: "BD",
          },
        },
      })),
    },
  ];
}

/**
 * Builds Schema.org JSON-LD for an Upazila Location Directory (/consultants/location/[upazila])
 */
export function generateConsultantLocationJsonLd(options: {
  pageUrl: string;
  upzSeo: UpazilaSeoConfig;
  doctors: Doctor[];
}): Record<string, unknown>[] {
  const { pageUrl, upzSeo, doctors } = options;
  const highDensityFaqs = getHighDensityLocationFaqs(upzSeo);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: upzSeo.metaTitleBn,
      description: upzSeo.metaDescriptionBn,
      inLanguage: ["bn-BD", "en-US"],
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [
          ".geo-answer-capsule",
          ".faq-answer",
          "#overview",
          "#location-heading",
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "হোম", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "বিশেষজ্ঞ ডাক্তার", item: `${SITE_URL}/consultants` },
        { "@type": "ListItem", position: 3, name: upzSeo.nameBn, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: `${upzSeo.nameBn} ডাক্তার ও চেম্বার ডিরেক্টরি - হেলথ ক্লাব`,
      url: pageUrl,
      description: upzSeo.metaDescriptionBn,
      areaServed: upzSeo.nameEn,
      medicalSpecialty: ["General Medicine", "Cardiology", "Gynaecology", "Pediatrics", "Orthopaedics"],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: highDensityFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${upzSeo.nameBn} বিশেষজ্ঞ ডাক্তার তালিকা`,
      itemListElement: doctors.slice(0, 15).map((doc, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Physician",
          name: doc.name,
          medicalSpecialty: doc.specialty,
          telephone: doc.serialPhone,
          worksFor: {
            "@type": "MedicalOrganization",
            name: doc.chamberName,
          },
        },
      })),
    },
  ];
}
