import { SITE_URL } from "@/lib/siteConfig";

export interface BloodDonorRegisterFaqItem {
  question: string;
  answer: string;
}

export const BLOOD_DONOR_REGISTER_FAQS: BloodDonorRegisterFaqItem[] = [
  {
    question: "রক্তদানের জন্য শারীরিক যোগ্যতা ও শর্তাবলি কী কী?",
    answer: "১৮ থেকে ৬০ বছর বয়সী যেকোনো সুস্থ নারী ও পুরুষ রক্তদান করতে পারেন। ওজন ন্যূনতম ৫০ কেজি হতে হবে (নারীদের ক্ষেত্রে ৪৫-৫০ কেজি)। রক্তচাপ ও নাড়ির স্পন্দন স্বাভাবিক থাকতে হবে এবং হেপাটাইটিস, ম্যালেরিয়া বা বড় কোনো সংক্রামক ব্যাধি থাকা যাবে না।",
  },
  {
    question: "একজন সুস্থ ব্যক্তি কত দিন পর পর নিরাপদভাবে রক্ত দিতে পারেন?",
    answer: "একজন সুস্থ পুরুষ প্রতি ৩ মাস (৯০ দিন) পর পর এবং সুস্থ নারী প্রতি ৪ মাস (১২০ দিন) পর পর নিরাপদে রক্তদান করতে পারেন। নির্দিষ্ট সময় ব্যবধানে রক্ত দিলে শরীরের কোনো ক্ষতি হয় না, বরং অস্থিমজ্জা থেকে নতুন লোহিত রক্তকণিকা তৈরি ত্বরান্বিত হয়।",
  },
  {
    question: "হেলথ ক্লাবে রক্তদাতা হিসেবে নাম নিবন্ধন করতে কোনো ফি লাগে কি?",
    answer: "না, এটি ১০০% সম্পূর্ণ বিনামূল্যে পরিচালিত মানবকল্যাণমূলক স্বেচ্ছাসেবী উদ্যোগ। ফেনীর মুমূর্ষু রোগীর রক্ত সংকট নিরসনে রক্তদাতা বা গ্রহীতা কারও কাছ থেকেই কোনো ফি বা কমিশন গ্রহণ করা হয় না।",
  },
  {
    question: "নেগেটিভ বা বিরল রক্তের গ্রুপের (Rh-Negative) ডোনারদের গুরুত্ব কী?",
    answer: "O-, A-, B-, AB- এর মতো নেগেটিভ রক্তের গ্রুপগুলো অত্যন্ত বিরল ও সংকটপূর্ণ। আপনি নেগেটিভ রক্তের গ্রুপের অধিকারী হলে অতিসত্বর নিবন্ধনের অনুরোধ করা হচ্ছে, কারণ জরুরি অস্ত্রোপচার, সিজার ও থ্যালাসেমিয়া রোগীদের জন্য সময়মতো নেগেটিভ রক্ত পাওয়া জীবন-মৃত্যুর বিষয়।",
  },
  {
    question: "অনলাইনে ফর্ম জমা দেওয়ার কতক্ষণ পর তালিকায় নাম দেখা যাবে?",
    answer: "অনলাইন ফর্ম পূরণ অথবা WhatsApp-এ তথ্য পাঠানোর পর আমাদের স্বেচ্ছাসেবী দল ফোনে প্রাথমিক তথ্য যাচাই করে ১২ থেকে ২৪ ঘণ্টার মধ্যে ফেনী রক্তদাতা ডিরেক্টরিতে নাম ও নম্বর উন্মুক্ত করে দেয়।",
  },
  {
    question: "রক্তদাতার ফোন নম্বর কীভাবে ব্যবহৃত হয় এবং এর প্রাইভেসির নিশ্চয়তা কী?",
    answer: "রক্তদাতাদের ফোন নম্বর শুধুমাত্র জীবন বাঁচানোর উদ্দেশ্যে রোগীর স্বজন ও হাসপাতাল কর্তৃপক্ষের তাৎক্ষণিক যোগাযোগের জন্য সংরক্ষিত থাকে। কোনো ধরনের বাণিজ্যিক প্রচার, স্প্যাম বা অননুমোদিত কাজে নম্বর প্রকাশ করা হয় না।",
  },
];

export function buildBloodDonorRegisterJsonLd(canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebPage", "MedicalWebPage"],
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: "স্বেচ্ছাসেবী রক্তদাতা নিবন্ধন ফরম | ফেনী ব্লাড ডোনার নেটওয়ার্ক - হেলথ ক্লাব",
        description: "ফেনী জেলা ও সকল উপজেলার রক্তদাতাদের জন্য ১০০% ফ্রি ও নিরাপদ রক্তদাতা তালিকাভুক্তি পোর্টাল।",
        inLanguage: "bn-BD",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "হেলথ ক্লাব (Health Club)",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [
            "#blood-donor-register-summary",
            "#blood-donor-register-bluf",
            "#blood-donor-reg-faq",
          ],
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
            name: "রক্তদাতা ডিরেক্টরি",
            item: `${SITE_URL}/emergency/blood-donors`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "রক্তদাতা নিবন্ধন",
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "EmergencyService",
        name: "হেলথ ক্লাব ফেনী স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক",
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
        priceRange: "Free / Voluntary Public Service",
        description: "ফেনীর ৮টি গ্রুপের (A+, B+, O+, AB+) রক্তদাতাদের বিনামূল্যে ২৪/৭ জরুরি নেটওয়ার্কে যুক্ত হওয়ার প্ল্যাটফর্ম।",
      },
      {
        "@type": "HowTo",
        name: "কীভাবে হেলথ ক্লাব ডিরেক্টরিতে রক্তদাতা হিসেবে যুক্ত হবেন?",
        description: "সহজ ৩টি ধাপে ফেনী হেলথ ক্লাব জরুরি পোর্টালে রক্তদাতা হিসেবে নাম ও রক্তের গ্রুপ বিনামূল্যে যুক্ত করার নির্দেশিকা।",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "অনলাইন ফর্মে তথ্য পূরণ",
            text: "আপনার নাম, রক্তের গ্রুপ (A+/B+/O+/AB+), মোবাইল নম্বর, বর্তমান উপজেলা ও এলাকা প্রদান করুন।",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "শারীরিক সুস্থতা ও ফোন নম্বর যাচাই",
            text: "আমাদের জরুরি সমন্বয়ক টিম মোবাইল ফোনে যোগাযোগ করে প্রাথমিক তথ্য ও রক্তের গ্রুপ নিশ্চিত করবে।",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "ডিরেক্টরিতে ২৪/৭ উন্মুক্ত",
            text: "যাচাই শেষে ১২ থেকে ২৪ ঘণ্টার মধ্যে হেলথ ক্লাব রক্তদাতা ডিরেক্টরিতে আপনার তথ্য অন্তর্ভুক্ত হবে এবং রোগীর স্বজনরা সরাসরি যোগাযোগ করতে পারবেন।",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: BLOOD_DONOR_REGISTER_FAQS.map((faq) => ({
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
