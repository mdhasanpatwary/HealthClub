import { SITE_URL } from "@/lib/siteConfig";

interface HomepageSchemaParams {
  isEn: boolean;
  t: (key: string) => string;
  hotline?: string;
}

/**
 * Builds structured Schema.org JSON-LD definitions for the Homepage,
 * supporting SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO).
 */
export function getHomepageJsonLd({ isEn, t, hotline }: HomepageSchemaParams) {
  const rawHotline = hotline ? hotline.replace(/[^0-9]/g, "") : "01700000000";
  const formattedTel = `+880${rawHotline.replace(/^(880|88|0)/, "")}`;

  return [
    // 1. WebSite & SearchAction Schema
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: isEn ? "Health Club Bangladesh" : "হেলথ ক্লাব (Health Club)",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/consultants?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },

    // 2. EmergencyService & MedicalBusiness Schema (Essential Services Hub)
    {
      "@context": "https://schema.org",
      "@type": ["EmergencyService", "MedicalBusiness"],
      name: isEn
        ? "Health Club Emergency & Essential Healthcare Directory Feni"
        : "হেলথ ক্লাব জরুরি স্বাস্থ্য সেবা ও ডিরেক্টরি (ফেনী)",
      url: `${SITE_URL}/emergency`,
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
        addressLocality: "Feni",
        addressRegion: "Chittagong",
        addressCountry: "BD",
      },
    },

    // 3. ItemList for Quick Services Hub
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: isEn
        ? "Essential Emergency & Healthcare Directory"
        : "ফেনীর জরুরি স্বাস্থ্য সেবা ও ডিরেক্টরি",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isEn ? "Specialist Doctors & Chamber Schedule" : "ডাক্তার ও চেম্বার শিডিউল",
          url: `${SITE_URL}/consultants`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: isEn ? "Voluntary Blood Donor Directory" : "জরুরি রক্তদাতা খুঁজুন",
          url: `${SITE_URL}/emergency?tab=donors`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: isEn ? "24/7 ICU & AC Emergency Ambulance Fleet" : "২৪/৭ জরুরি অ্যাম্বুলেন্স সেবা",
          url: `${SITE_URL}/emergency?tab=ambulances`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: isEn ? "Emergency Hospital Hotlines & Oxygen Supply" : "হাসপাতাল ও অক্সিজেন সেবা",
          url: `${SITE_URL}/emergency?tab=hotlines`,
        },
      ],
    },

    // 4. Enhanced FAQPage Schema for Answer Engines (AEO)
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: t("faq.q1"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a1"),
          },
        },
        {
          "@type": "Question",
          name: t("faq.q2"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a2"),
          },
        },
        {
          "@type": "Question",
          name: isEn
            ? "How do I find voluntary blood donors in Feni on Health Club?"
            : "ফেনীতে জরুরি রক্তের প্রয়োজনে কীভাবে রক্তদাতা খুঁজে পাব?",
          acceptedAnswer: {
            "@type": "Answer",
            text: isEn
              ? "Visit Health Club emergency blood directory at /emergency?tab=donors. You can filter voluntary blood donors by blood group (A+, B+, O+, AB+, etc.) and upazila across Feni and directly call them 24/7 without any broker or fees."
              : "হেলথ ক্লাবের জরুরি রক্তদাতা ডিরেক্টরি (/emergency?tab=donors) থেকে রক্তের গ্রুপ (A+, B+, O+, AB+) ও উপজেলা সিলেক্ট করে ফেনীর ভেরিফাইড স্বেচ্ছাসেবী রক্তদাতাদের নম্বর পাওয়া যাবে এবং সরাসরি সম্পূর্ণ বিনামূল্যে কল করা যাবে।",
          },
        },
        {
          "@type": "Question",
          name: isEn
            ? "How can I hire a 24/7 ICU or AC ambulance in Feni?"
            : "ফেনীতে ২৪/৭ আইসিইউ বা এসি অ্যাম্বুলেন্স কীভাবে পাওয়া যাবে?",
          acceptedAnswer: {
            "@type": "Answer",
            text: isEn
              ? "Check Health Club ambulance fleet at /emergency?tab=ambulances for verified contact numbers of 24/7 ICU, AC, Non-AC, and mortuary freezer ambulances covering Feni, Dhaka, and Chittagong routes."
              : "হেলথ ক্লাবের অ্যাম্বুলেন্স ডিরেক্টরি (/emergency?tab=ambulances) থেকে ফেনী, ঢাকা ও চট্টগ্রাম রুটের জন্য ২৪ ঘণ্টা প্রস্তুত আইসিইউ, এসি, নন-এসি এবং ফ্রিজার অ্যাম্বুলেন্সের যাচাইকৃত চালক ও সার্ভিস প্রোভাইডারদের নম্বর পাওয়া যাবে।",
          },
        },
        {
          "@type": "Question",
          name: isEn
            ? "How do I find specialist doctors and appointment serials in Feni?"
            : "ফেনীর বিশেষজ্ঞ ডাক্তারদের চেম্বার শিডিউল ও সিরিয়াল নম্বর কীভাবে পাব?",
          acceptedAnswer: {
            "@type": "Answer",
            text: isEn
              ? "Browse Health Club's doctor directory at /consultants to find verified specialist doctors across medicine, gynecology, cardiology, pediatrics, and surgery with visiting hours and direct appointment serial hotlines."
              : "হেলথ ক্লাবের কনসালট্যান্ট ডিরেক্টরি (/consultants)-তে মেডিসিন, হৃদরোগ, গাইনী, শিশু ও সার্জারিসহ সকল বিভাগের বিশেষজ্ঞ চিকিৎসকদের তালিকা, চেম্বার ভিজিটিং সময় এবং সরাসরি সিরিয়াল বুকিং হেল্পলাইন পাওয়া যাবে।",
          },
        },
        {
          "@type": "Question",
          name: t("faq.q3"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a3"),
          },
        },
        {
          "@type": "Question",
          name: t("faq.q4"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a4"),
          },
        },
        {
          "@type": "Question",
          name: t("faq.q5"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a5"),
          },
        },
        {
          "@type": "Question",
          name: t("faq.q6"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("faq.a6"),
          },
        },
      ],
    },
  ];
}
