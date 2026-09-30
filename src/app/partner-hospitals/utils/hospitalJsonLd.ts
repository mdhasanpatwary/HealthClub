import { Partner } from "@/services/db";
import { SITE_URL } from "@/lib/siteConfig";
import { PartnerCategorySeoConfig } from "@/data/partnerCategorySeoData";

export interface HospitalFaqItem {
  question: string;
  answer: string;
}

/**
 * Standard 7 conversational Q&As for the main partner hospitals hub (/partner-hospitals)
 */
export const DEFAULT_PARTNER_HOSPITALS_HUB_FAQS: HospitalFaqItem[] = [
  {
    question: "ফেনীতে হাসপাতালে এবং মেডিকেল টেস্টে কীভাবে ডিসকাউন্ট পেতে পারি?",
    answer: "হেলথ ক্লাব (Health Club)-এর ডিজিটাল মেম্বারশিপ কার্ড ব্যবহার করে ফেনীর চুক্তিবদ্ধ সকল বেসরকারি হাসপাতাল, ক্লিনিক এবং ডায়াগনস্টিক সেন্টারে প্যাথলজি ল্যাব টেস্ট (রক্ত, হরমোন পরীক্ষা), ডিজিটাল এক্স-রে, আল্ট্রাসনোগ্রাম (USG), সিটি স্ক্যান এবং কেবিন ভাড়ায় ১০% থেকে ৩০% পর্যন্ত নিশ্চিত ডিসকাউন্ট পাওয়া যায়। বিলিং কাউন্টারে শুধু আপনার হেলথ ক্লাব মেম্বার আইডি বা কার্ডটি প্রদর্শন করলেই তাৎক্ষণিকভাবে বিল থেকে নির্ধারিত ছাড় পেয়ে যাবেন।",
  },
  {
    question: "ডায়াগনস্টিক সেন্টারে কোন কোন টেস্টে ছাড় পাওয়া যায়?",
    answer: "সকল প্রকার প্যাথলজি রক্ত পরীক্ষা (CBC, Lipid, HbA1c, Thyroid ইত্যাদি), ডিজিটাল এক্স-রে, আল্ট্রাসনোগ্রাম (USG), ইসিজি (ECG), ইকোকার্ডিওগ্রাফি, এন্ডোস্কোপি, সিটি স্ক্যান ও এমআরআই টেস্টে ১০% থেকে ৩০% পর্যন্ত ছাড় পাবেন।",
  },
  {
    question: "ফার্মেসিতে ওষুধ কেনার সময় কি ডিসকাউন্ট প্রযোজ্য?",
    answer: "হ্যাঁ, আমাদের তালিকাভুক্ত মডেল ফার্মেসি ও পার্টনার ওষুধের দোকানগুলোতে প্রেসক্রিপশন অনুযায়ী প্রয়োজনীয় ওষুধ ক্রয়ে হেলথ ক্লাব মেম্বার কার্ড দেখালে বিশেষ ছাড় পাওয়া যাবে।",
  },
  {
    question: "ফেনীর বাইরে কি এই মেম্বার কার্ড ব্যবহার করা যাবে?",
    answer: "হ্যাঁ, হেলথ ক্লাবের নেটওয়ার্কভুক্ত ঢাকা, চট্টগ্রাম সহ অন্যান্য জেলার পার্টনার হাসপাতাল ও ডায়াগনস্টিক ল্যাবেও আপনি একই সুবিধা উপভোগ করতে পারবেন।",
  },
  {
    question: "জরুরি প্রয়োজনে কীভাবে নিকটস্থ অ্যাম্বুলেন্স বা অক্সিজেন খুঁজে পাবো?",
    answer: "হেলথ ক্লাবের 'জরুরি সেবা' পেজ থেকে সরাসরি হটলাইনে কল করে ২৪/৭ আইসিইউ/এসি অ্যাম্বুলেন্স, ব্লাড ডোনার এবং অক্সিজেন সিলিন্ডার সহায়তা পাওয়া যাবে।",
  },
  {
    question: "ফেনীতে মেডিকেল টেস্ট ও প্যাথলজি ল্যাব টেস্টে কত টাকা সাশ্রয় হয়?",
    answer: "টেস্টের ধরন অনুযায়ী মেম্বাররা রুটিন প্যাথলজি, হরমোন টেস্ট, এক্স-রে, ৪ডি ইউএসজি, সিটি স্ক্যান এবং এমআরআই-তে ১০% থেকে ৩০% পর্যন্ত ছাড় পান, যা প্রতিটি মেডিকেল চেকআপে উল্লেখযোগ্য আর্থিক সাশ্রয় নিশ্চিত করে।",
  },
  {
    question: "হাসপাতালে ভর্তির সময় বা কেবিন ভাড়ায় মেম্বাররা কী সুবিধা পান?",
    answer: "চুক্তিবদ্ধ পার্টনার প্রাইভেট হাসপাতালে ভর্তি রোগীদের জন্য সাধারণ কেবিন, এসি কেবিন এবং বেড ভাড়ায় ১০% থেকে ৩০% বিশেষ মেম্বার ছাড় প্রদান করা হয়। বিলিংয়ের পূর্বে মেম্বারশিপ কার্ড প্রদর্শনের মাধ্যমে এই সুবিধা কার্যকর হয়।",
  },
];

/**
 * Returns 6–8 high-density conversational FAQs tailored to a partner facility category
 */
export function getHighDensityPartnerCategoryFaqs(
  seo: PartnerCategorySeoConfig
): HospitalFaqItem[] {
  const existing: HospitalFaqItem[] = (seo.faqItems || []).map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  const existingQs = new Set(existing.map((f) => f.question.toLowerCase()));
  const catName = seo.nameBn;

  const supplemental: HospitalFaqItem[] = [
    {
      question: `ফেনী সদরে ${catName} সেবায় হেলথ ক্লাব মেম্বাররা কত শতাংশ ছাড় পান?`,
      answer: `ফেনী সদরের অনুমোদিত পার্টনার ${catName} প্রতিষ্ঠানগুলোতে হেলথ ক্লাব মেম্বাররা সেবার ধরনভেদে ১০% থেকে ৩০% পর্যন্ত তাৎক্ষণিক ছাড় সুবিধা উপভোগ করেন।`,
    },
    {
      question: `বিলিং কাউন্টারে ${catName} ছাড় কার্যকর করার নিয়ম কী?`,
      answer: `বিল পরিশোধ করার পূর্বে হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড অথবা মেম্বার আইডি কাউন্টারে প্রদর্শন করুন। কাউন্টার কর্মকর্তা তৎক্ষণাৎ মোট বিল থেকে নির্ধারিত মেম্বার ছাড় বাদ দিয়ে নেট বিল গ্রহণ করবেন।`,
    },
    {
      question: `উপজেলা থেকে রেফার্ড হওয়া রোগীরা কি ফেনী সদরের ${catName} প্রতিষ্ঠানে একই ছাড় পাবেন?`,
      answer: `হ্যাঁ, দাগনভূঞা, সোনাগাজী, ছাগলনাইয়া, পরশুরাম ও ফুলগাজী উপজেলা থেকে আগত সকল হেলথ ক্লাব মেম্বার ফেনী সদরের সেন্টারে এসে সমপরিমাণ ১০-৩০% মেম্বার ছাড় পাবেন।`,
    },
    {
      question: `জরুরি স্বাস্থ্য পরিস্থিতিতে কীভাবে নিকটস্থ সেন্টারের সাথে যোগাযোগ করবেন?`,
      answer: `হেলথ ক্লাব ডিরেক্টরিতে প্রতিটি প্রতিষ্ঠানের সরাসরি হটলাইন নাম্বার ও গুগল ম্যাপ লোকেশন যুক্ত রয়েছে। সরাসরি কলে দ্রুত যোগাযোগ করে সিরিয়াল ও বেড নিশ্চিত করা যায়।`,
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
 * Builds Schema.org JSON-LD for the Main Partner Hospitals Hub (/partner-hospitals)
 */
export function generatePartnerHospitalsHubJsonLd(options: {
  pageUrl: string;
  partners: Partner[];
  pageTitle?: string;
  pageDesc?: string;
}): Record<string, unknown>[] {
  const {
    pageUrl,
    partners,
    pageTitle = "ফেনী হাসপাতাল ও ডায়াগনস্টিক সেন্টার তালিকা | ১০-৩০% মেম্বার ডিসকাউন্ট",
    pageDesc = "ফেনীর শীর্ষ বেসরকারি হাসপাতাল, ডায়াগনস্টিক সেন্টার ও প্যাথলজি ল্যাবের তালিকা। হেলথ ক্লাব মেম্বার কার্ডে রক্ত পরীক্ষা, এক্স-রে, আল্ট্রাসাউন্ড, সিটি স্ক্যান ও কেবিন ভাড়ায় পান ১০% থেকে ৩০% নিশ্চিত ছাড়।",
  } = options;

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: pageTitle,
      description: pageDesc,
      inLanguage: ["bn-BD", "en-US"],
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [
          ".geo-answer-capsule",
          ".faq-answer",
          "#overview",
          "#partner-directory-heading",
          "#partner-faq-heading",
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "হোম", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টার", item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": ["MedicalBusiness", "MedicalOrganization"],
      name: "হেলথ ক্লাব পার্টনার হাসপাতাল ও ডায়াগনস্টিক নেটওয়ার্ক (ফেনী)",
      url: pageUrl,
      description: pageDesc,
      areaServed: [
        "Feni Sadar",
        "Daganbhuiyan",
        "Sonagazi",
        "Chhagalnaiya",
        "Parshuram",
        "Fulgazi",
        "Mohipal",
      ],
      medicalSpecialty: [
        "General Medical Services",
        "Diagnostic Pathology & Laboratory",
        "Radiology & Imaging",
        "Pharmacy & Prescription Medicine Discount",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: DEFAULT_PARTNER_HOSPITALS_HUB_FAQS.map((faq) => ({
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
      name: "Feni Partner Hospitals and Diagnostic Centers",
      itemListElement: partners.slice(0, 15).map((partner, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Hospital",
          name: partner.name,
          telephone: partner.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: partner.address,
            addressLocality: "Feni",
            addressRegion: "Chittagong",
            addressCountry: "BD",
          },
          url: `${SITE_URL}/partner-hospitals/${encodeURIComponent(partner.slug || partner.id)}`,
        },
      })),
    },
  ];
}

/**
 * Builds Schema.org JSON-LD for Partner Category Directory (/partner-hospitals/category/[type])
 */
export function generatePartnerCategoryJsonLd(options: {
  pageUrl: string;
  seo: PartnerCategorySeoConfig;
  categoryPartners: Partner[];
}): Record<string, unknown>[] {
  const { pageUrl, seo, categoryPartners } = options;
  const highDensityFaqs = getHighDensityPartnerCategoryFaqs(seo);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: seo.metaTitleBn,
      description: seo.metaDescriptionBn,
      inLanguage: ["bn-BD", "en-US"],
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [
          ".geo-answer-capsule",
          ".faq-answer",
          "#overview",
          "#partner-category-heading",
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "হোম", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "পার্টনার প্রতিষ্ঠান", item: `${SITE_URL}/partner-hospitals` },
        { "@type": "ListItem", position: 3, name: seo.nameBn, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": ["MedicalBusiness", "MedicalOrganization"],
      name: `হেলথ ক্লাব ${seo.h1TitleBn}`,
      url: pageUrl,
      description: seo.metaDescriptionBn,
      areaServed: "Feni Sadar, Feni, Bangladesh",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: highDensityFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: seo.h1TitleBn,
      itemListElement: categoryPartners.slice(0, 15).map((partner, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "MedicalOrganization",
          name: partner.name,
          telephone: partner.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: partner.address,
            addressLocality: "Feni",
            addressRegion: "Chittagong",
            addressCountry: "BD",
          },
          url: `${SITE_URL}/partner-hospitals/${encodeURIComponent(partner.slug || partner.id)}`,
        },
      })),
    },
  ];
}
