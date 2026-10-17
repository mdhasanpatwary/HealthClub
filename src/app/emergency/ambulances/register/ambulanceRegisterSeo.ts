import { SITE_URL } from "@/lib/siteConfig";

export interface AmbulanceRegisterFaqItem {
  question: string;
  answer: string;
}

export const AMBULANCE_REGISTER_FAQS: AmbulanceRegisterFaqItem[] = [
  {
    question: "হেলথ ক্লাব ডিরেক্টরিতে অ্যাম্বুলেন্স তালিকাভুক্তির ফি কত?",
    answer: "এটি ১০০% সম্পূর্ণ ফ্রি। ফেনীর রোগী ও অ্যাম্বুলেন্স চালকদের সহায়তার জন্য কোনো প্রকার রেজিস্ট্রেশন ফি বা মাসিক কমিশন নেওয়া হয় না।",
  },
  {
    question: "রেজিস্ট্রেশন করার কতক্ষণ পর অ্যাম্বুলেন্স লাইভ দেখা যাবে?",
    answer: "ফর্ম বা WhatsApp-এ তথ্য জমা দেওয়ার পর আমাদের টিম মোবাইল কল করে চালক ও গাড়ির সত্যতা যাচাই করে ১২ থেকে ২৪ ঘণ্টার মধ্যে তালিকায় যুক্ত করে দেয়।",
  },
  {
    question: "অনলাইন ফর্ম পূরণ ছাড়া কি WhatsApp-এ তথ্য পাঠানো যাবে?",
    answer: "হ্যাঁ, আপনার ভিজিটিং কার্ড বা অ্যাম্বুলেন্সের তথ্য সরাসরি আমাদের অফিসিয়াল WhatsApp নম্বরে (+880 1886763849) পাঠিয়ে দিলে আমাদের টিম যুক্ত করে দেবে।",
  },
  {
    question: "ফেনী ছাড়া কি ঢাকা বা চট্টগ্রামের দূরপাল্লার অ্যাম্বুলেন্স যুক্ত হতে পারবে?",
    answer: "হ্যাঁ, ফেনী থেকে ঢাকা, চট্টগ্রাম বা যেকোনো দূরপাল্লার রুটে চলাচলকারী আইসিইউ, এসি ও ফ্রিজার অ্যাম্বুলেন্স সেবা স্বাচ্ছন্দ্যে কভারেজ উল্লেখ করে যুক্ত হতে পারে।",
  },
  {
    question: "অ্যাম্বুলেন্সের ভাড়ার বিষয়ে হেলথ ক্লাবের পলিসি কী?",
    answer: "হেলথ ক্লাব কোনো মধ্যস্বত্বভোগী কমিশন গ্রহণ করে না। সেবাগ্রহীতা ও চালক সরাসরি ফোনে কথা বলে সরকার নির্ধারিত বা বাজারভিত্তিক ন্যায্য ভাড়া নির্ধারণ করবেন।",
  },
];

export function buildAmbulanceRegisterJsonLd(canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: "অ্যাম্বুলেন্স ও ড্রাইভার নিবন্ধন ফরম | ফেনী জরুরি অ্যাম্বুলেন্স তালিকাভুক্তি",
        description: "ফেনী জেলা ও মহাসড়কের সকল অ্যাম্বুলেন্স চালক ও মালিকদের জন্য সম্পূর্ণ ফ্রি অ্যাম্বুলেন্স তালিকাভুক্তি পোর্টাল।",
        inLanguage: "bn-BD",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "হেলথ ক্লাব (Health Club)",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "হোম",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "জরুরি সেবা",
            item: `${SITE_URL}/emergency`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "জরুরি অ্যাম্বুলেন্স",
            item: `${SITE_URL}/emergency/ambulances`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "অ্যাম্বুলেন্স নিবন্ধন",
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "EmergencyService",
        name: "হেলথ ক্লাব ফেনী অ্যাম্বুলেন্স নেটওয়ার্ক রেজিস্ট্রেশন",
        url: canonicalUrl,
        serviceArea: {
          "@type": "AdministrativeArea",
          name: "Feni District, Bangladesh",
        },
        provider: {
          "@type": "Organization",
          name: "হেলথ ক্লাব (Health Club)",
          url: SITE_URL,
        },
        description: "ফেনীর আইসিইউ, এসি, নন-এসি ও ফ্রিজিং অ্যাম্বুলেন্স চালক ও মালিকদের জন্য বিনামূল্যে ২৪/৭ জরুরি নেটওয়ার্কে যুক্ত হওয়ার প্ল্যাটফর্ম।",
      },
      {
        "@type": "HowTo",
        name: "কীভাবে হেলথ ক্লাব ডিরেক্টরিতে অ্যাম্বুলেন্স তালিকাভুক্ত করবেন?",
        description: "সহজ ৩টি ধাপে ফেনী হেলথ ক্লাব জরুরি পোর্টালে অ্যাম্বুলেন্স ও চালকের নম্বর বিনামূল্যে যুক্ত করার নির্দেশিকা।",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "অনলাইন ফর্মে তথ্য পূরণ",
            text: "অ্যাম্বুলেন্স প্রতিষ্ঠানের নাম, চালকের নাম, গাড়ির ধরন (এসি/নন-এসি/আইসিইউ/ফ্রিজার), স্ট্যান্ডের ঠিকানা ও ২৪/৭ মোবাইল নম্বর দিন।",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "ড্রাইভার ও স্ট্যান্ড ভেরিফিকেশন",
            text: "আমাদের জরুরি সমন্বয়ক টিম মোবাইল নম্বরে কল করে গাড়ির স্ট্যান্ড লোকেশন ও প্রাথমিক তথ্য যাচাই করবে।",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "ডিরেক্টরিতে ২৪/৭ উন্মুক্ত",
            text: "যাচাই শেষে ১২ থেকে ২৪ ঘণ্টার মধ্যে হেলথ ক্লাব জরুরি অ্যাম্বুলেন্স বহরে যুক্ত হয়ে সরাসরি রোগীদের ফোন কল পেতে শুরু করবেন।",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: AMBULANCE_REGISTER_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}
