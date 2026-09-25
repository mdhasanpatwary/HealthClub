import { SITE_URL } from "@/lib/siteConfig";

interface HomepageSchemaParams {
  hotline?: string;
}

/**
 * Builds structured Schema.org JSON-LD definitions for the Homepage,
 * supporting SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO).
 */
export function getHomepageJsonLd({ hotline }: HomepageSchemaParams = {}) {
  const rawHotline = hotline ? hotline.replace(/[^0-9]/g, "") : "01700000000";
  const formattedTel = `+880${rawHotline.replace(/^(880|88|0)/, "")}`;

  return [
    // 1. EmergencyService & MedicalBusiness Schema (Essential Services Hub)
    {
      "@context": "https://schema.org",
      "@type": ["EmergencyService", "MedicalBusiness"],
      "@id": `${SITE_URL}/#emergency-service`,
      name: "হেলথ ক্লাব জরুরি স্বাস্থ্য সেবা ও ডিরেক্টরি (ফেনী)",
      url: `${SITE_URL}/emergency`,
      image: `${SITE_URL}/og-image.png`,
      telephone: formattedTel,
      priceRange: "Free / Public Service",
      areaServed: [
        "Feni Sadar",
        "Daganbhuiyan",
        "Chhagalnaiya",
        "Sonagazi",
        "Parshuram",
        "Fulgazi",
        "Feni, Bangladesh",
      ],
      availableService: [
        "Specialist Doctor & Chamber Directory",
        "Voluntary Blood Donor Matching",
        "24/7 ICU & AC Ambulance Dispatch",
        "Hospital ER & Oxygen Cylinder Coordination",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Trunk Road",
        addressLocality: "Feni",
        addressRegion: "Chittagong",
        postalCode: "3900",
        addressCountry: "BD",
      },
    },

    // 2. ItemList for Quick Services Hub
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "ফেনীর জরুরি স্বাস্থ্য সেবা ও ডিরেক্টরি",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ডাক্তার ও চেম্বার শিডিউল",
          url: `${SITE_URL}/consultants`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "জরুরি রক্তদাতা খুঁজুন",
          url: `${SITE_URL}/emergency?tab=donors`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "২৪/৭ জরুরি অ্যাম্বুলেন্স সেবা",
          url: `${SITE_URL}/emergency?tab=ambulances`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "হাসপাতাল ও অক্সিজেন সেবা",
          url: `${SITE_URL}/emergency?tab=hotlines`,
        },
      ],
    },

    // 3. Enhanced FAQPage Schema for Answer Engines (AEO)
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "হেলথ ক্লাব মেম্বারশিপ কীভাবে কাজ করে?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "হেলথ ক্লাব একটি মেম্বারশিপ ভিত্তিক স্বাস্থ্য সুবিধা প্ল্যাটফর্ম। আমাদের সদস্য হয়ে আপনি আমাদের পার্টনার হাসপাতাল, ডায়াগনস্টিক সেন্টার এবং ফার্মেসিতে ডিজিটাল আইডি কার্ড দেখিয়ে বিশেষ ছাড় পেতে পারেন।",
          },
        },
        {
          "@type": "Question",
          name: "আমি কীভাবে ডিসকাউন্ট বা ছাড় পেতে পারি?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "আমাদের অংশীদার স্বাস্থ্যসেবা কেন্দ্রে যাওয়ার পর বিল করার সময় আপনার ডিজিটাল মেম্বারশিপ আইডি কার্ডটি দেখান। হাসপাতাল কর্তৃপক্ষ কার্ডে থাকা কিউআর (QR) কোডটি স্ক্যান করে আপনার মেম্বারশিপের সত্যতা নিশ্চিত করবে এবং তাৎক্ষণিকভাবে আপনার বিলে ডিসকাউন্ট যোগ করে দেবে।",
          },
        },
        {
          "@type": "Question",
          name: "ফেনীতে জরুরি রক্তের প্রয়োজনে কীভাবে রক্তদাতা খুঁজে পাব?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "হেলথ ক্লাবের জরুরি রক্তদাতা ডিরেক্টরি (/emergency?tab=donors) থেকে রক্তের গ্রুপ (A+, B+, O+, AB+) ও উপজেলা সিলেক্ট করে ফেনীর ভেরিফাইড স্বেচ্ছাসেবী রক্তদাতাদের নম্বর পাওয়া যাবে এবং সরাসরি সম্পূর্ণ বিনামূল্যে কল করা যাবে।",
          },
        },
        {
          "@type": "Question",
          name: "ফেনীতে ২৪/৭ আইসিইউ বা এসি অ্যাম্বুলেন্স কীভাবে পাওয়া যাবে?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "হেলথ ক্লাবের অ্যাম্বুলেন্স ডিরেক্টরি (/emergency?tab=ambulances) থেকে ফেনী, ঢাকা ও চট্টগ্রাম রুটের জন্য ২৪ ঘণ্টা প্রস্তুত আইসিইউ, এসি, নন-এসি এবং ফ্রিজার অ্যাম্বুলেন্সের যাচাইকৃত চালক ও সার্ভিস প্রোভাইডারদের নম্বর পাওয়া যাবে।",
          },
        },
        {
          "@type": "Question",
          name: "ফেনীর বিশেষজ্ঞ ডাক্তারদের চেম্বার শিডিউল ও সিরিয়াল নম্বর কীভাবে পাব?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "হেলথ ক্লাবের কনসালট্যান্ট ডিরেক্টরি (/consultants)-তে মেডিসিন, হৃদরোগ, গাইনী, শিশু ও সার্জারিসহ সকল বিভাগের বিশেষজ্ঞ চিকিৎসকদের তালিকা, চেম্বার ভিজিটিং সময় এবং সরাসরি সিরিয়াল বুকিং হেল্পলাইন পাওয়া যাবে।",
          },
        },
        {
          "@type": "Question",
          name: "আমি কোথায় আমার মেম্বারশিপ ব্যবহার করতে পারব?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "আমাদের ওয়েবসাইটে থাকা 'পার্টনার হাসপাতাল' ডিরেক্টরিতে তালিকাভুক্ত সকল হাসপাতাল, ডায়াগনস্টিক সেন্টার এবং ফার্মেসিতে আপনি এই কার্ডটি ব্যবহার করতে পারবেন। পার্টনারদের তালিকা প্রতিনিয়ত বৃদ্ধি পাচ্ছে।",
          },
        },
        {
          "@type": "Question",
          name: "মেম্বারশিপের খরচ কত?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "বর্তমানে প্রথম ১০০ জন সদস্যের জন্য আমরা সম্পূর্ণ ফ্রি 'ফাউন্ডিং মেম্বারশিপ' দিচ্ছি, যা ১ বছরের জন্য ফ্রি থাকবে। পরবর্তীতে প্রিমিয়াম মেম্বারশিপের জন্য বাৎসরিক ৫০০ টাকা ফি প্রযোজ্য হবে।",
          },
        },
        {
          "@type": "Question",
          name: "পার্টনার হাসপাতালগুলো কীভাবে আমার কার্ড ভেরিফাই করবে?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "আপনার ডিজিটাল মেম্বারশিপ কার্ডে একটি অনন্য কিউআর (QR) কোড থাকবে। হাসপাতাল কর্তৃপক্ষ তাদের মোবাইল বা স্ক্যানার দিয়ে এই কিউআর কোডটি স্ক্যান করলে একটি সুরক্ষিত ভেরিফিকেশন পেজ খুলবে, যেখানে আপনার নাম, মেম্বার আইডি এবং মেম্বারশিপ স্ট্যাটাস (Active/Inactive) দেখা যাবে।",
          },
        },
        {
          "@type": "Question",
          name: "আমার কার্ড দিয়ে কি পরিবার বা আত্মীয়দের চিকিৎসার বিল পরিশোধ করে ডিসকাউন্ট পাওয়া যাবে?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "হ্যাঁ! হেলথ ক্লাবের একজন মেম্বার তার কার্ড ব্যবহার করে নিজের পুরো পরিবার এবং আত্মীয়-স্বজনদের চিকিৎসার বিল পরিশোধ করতে পারবেন এবং নির্ধারিত সকল ডিসকাউন্ট সুবিধা উপভোগ করতে পারবেন।",
          },
        },
      ],
    },
  ];
}
