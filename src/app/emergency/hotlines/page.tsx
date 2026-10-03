import JsonLd from "@/components/seo/JsonLd";
import { HotlineDirectory } from "../components/HotlineDirectory";
import { EmergencyTabsNav } from "../components/EmergencyTabsNav";
import EmergencyFAQ, { FAQItem } from "@/components/emergency/EmergencyFAQ";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { PhoneForwarded, ShieldAlert, PhoneCall, Building2, Wind } from "lucide-react";
import { getEmergencyDataAction } from "@/app/actions/emergencyAdminActions";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export const revalidate = false; // Pure static SSG (on-demand revalidated on emergency updates)

export async function generateMetadata() {
  return {
    title: "ফেনী জরুরি হটলাইন নম্বর ও ২৪/৭ সরকারি-বেসরকারি মেডিকেল হেল্পলাইন",
    description: "ফেনীর ২৪/৭ জরুরি হটলাইন ডিরেক্টরি: ফেনী ২৫০ শয্যা সদর হাসপাতাল জরুরি বিভাগ, জরুরি অক্সিজেন সিলিন্ডার হোম ডেলিভারি, রেড ক্রিসেন্ট ব্লাড ব্যাংক, ফায়ার সার্ভিস ও ৯৯৯ হেল্পলাইন।",
    alternates: {
      canonical: `${SITE_URL}/emergency/hotlines`,
    },
    keywords: [
      "feni emergency hotlines",
      "feni hospital emergency number",
      "feni sadar hospital phone number",
      "feni emergency oxygen cylinder",
      "feni fire service phone number",
      "red crescent feni contact",
      "ফেনী জরুরি হটলাইন",
      "ফেনী সদর হাসপাতাল জরুরি বিভাগ",
      "ফেনী হাসপাতাল ফোন নম্বর",
      "ফেনী অক্সিজেন সিলিন্ডার সেবা",
      "ফেনী ফায়ার সার্ভিস নম্বর",
      "রেড ক্রিসেন্ট রক্ত কেন্দ্র ফেনী",
      "জাতীয় জরুরি সেবা ৯৯৯ ফেনী",
      "স্বাস্থ্য বাতায়ন ১৬২৬৩",
    ],
    openGraph: {
      title: "ফেনী জরুরি হটলাইন ও মেডিকেল হেল্পলাইন ডিরেক্টরি - হেলথ ক্লাব",
      description: "মুহূর্তেই ফেনীর হাসপাতাল জরুরি বিভাগ, অক্সিজেন সিলিন্ডার হোম ডেলিভারি, ফায়ার সার্ভিস ও সরকারি জরুরি হেল্পলাইনে সরাসরি কল করুন।",
      url: `${SITE_URL}/emergency/hotlines`,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: "ফেনী জরুরি হটলাইন নম্বর ও হেল্পলাইন - হেলথ ক্লাব",
      description: "ফেনী সদর হাসপাতাল, অক্সিজেন সিলিন্ডার ও জরুরি সার্ভিসের ভেরিফাইড ফোন নম্বর ডিরেক্টরি।",
      images: DEFAULT_TWITTER_IMAGES,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function EmergencyHotlinesPage() {
  const [{ hotlines }, contactSettings] = await Promise.all([
    getEmergencyDataAction(),
    getCachedContactSettings(),
  ]);

  const rawHotline = contactSettings.hotline.replace(/[^0-9]/g, "");
  const formattedTel = `+880${rawHotline.replace(/^(880|88|0)/, "")}`;

  const hotlineFaqs: FAQItem[] = [
    {
      question: "ফেনী ২৫০ শয্যা জেনারেল হাসপাতালের জরুরি বিভাগের সরাসরি ফোন নম্বর কত?",
      answer: "ফেনী ২৫০ শয্যা জেনারেল হাসপাতালের জরুরি বিভাগের সরাসরি ২৪ ঘণ্টা হটলাইন নম্বর হলো 0331-74011। জরুরি যেকোনো দুর্ঘটনায় বা আশঙ্কাজনক পরিস্থিতিতে এখানে সার্বক্ষণিক মেডিকেল অফিসার ও জরুরি টিম দায়িত্ব পালন করেন।",
    },
    {
      question: "ফেনীতে জরুরি মেডিকেল অক্সিজেন সিলিন্ডার কীভাবে দ্রুত পাওয়া যায়?",
      answer: "জরুরি অক্সিজেন সিলিন্ডার সেবার হেল্পলাইন 01815-998877 নম্বরে কল করুন। তারা তাৎক্ষণিক রিফিলিং, ফ্লো-মিটার, রেগুলেটর মাস্ক ও ফেনী শহর ও আশেপাশের এলাকায় দ্রুত হোম ডেলিভারি নিশ্চিত করে।",
    },
    {
      question: "জাতীয় জরুরি সেবা ৯৯৯ ও স্বাস্থ্য বাতায়ন ১৬২৬৩-এর সুবিধা কী?",
      answer: "জাতীয় জরুরি সেবা ৯৯৯ সম্পূর্ণ টোল-ফ্রি ২৪/৭ জরুরি পুলিশ, সরকারি অ্যাম্বুলেন্স ও ফায়ার সার্ভিসের জন্য প্রযোজ্য। অপরদিকে স্বাস্থ্য বাতায়ন ১৬২৬৩ থেকে যেকোনো সময় ঘরে বসে অভিজ্ঞ চিকিৎসকদের জরুরি টেলিমেডিসিন পরামর্শ নেওয়া যায়।",
    },
    {
      question: "রেড ক্রিসেন্ট রক্ত কেন্দ্র ফেনীর জরুরি নম্বর কী?",
      answer: "ফেনী সদর হাসপাতাল রোডে অবস্থিত বাংলাদেশ রেড ক্রিসেন্ট সোসাইটি রক্ত কেন্দ্রের হটলাইন নম্বর 01819-887766। জরুরি রক্তের ব্যাগ সংগ্রহ বা ক্রসম্যাচিংয়ের জন্য সরাসরি যোগাযোগ করতে পারেন।",
    },
    {
      question: "ফেনী ফায়ার সার্ভিস ও সিভিল ডিফেন্সের জরুরি নম্বর কত?",
      answer: "ফেনী ফায়ার স্টেশনের সার্বক্ষণিক কন্ট্রোল রুম হটলাইন নম্বর 01730-336644। অগ্নিকাণ্ড বা যেকোনো উদ্ধার তৎপরতায় তাৎক্ষণিক সহায়তা পেতে কল করুন।",
    },
  ];

  const jsonLdData = [
    // 1. BreadcrumbList Schema
    {
      "@context": "https://schema.org",
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
          name: "জরুরি স্বাস্থ্য সেবা",
          item: `${SITE_URL}/emergency`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "জরুরি হটলাইন",
          item: `${SITE_URL}/emergency/hotlines`,
        },
      ],
    },

    // 2. EmergencyService Schema
    {
      "@context": "https://schema.org",
      "@type": ["EmergencyService", "MedicalBusiness", "LocalBusiness"],
      name: "ফেনী জরুরি হটলাইন ও মেডিকেল হেল্পলাইন ডিরেক্টরি",
      url: `${SITE_URL}/emergency/hotlines`,
      logo: `${SITE_URL}/images/member-card-logo.webp`,
      description: "ফেনী জেলার জরুরি সরকারি ও বেসরকারি হটলাইন ডিরেক্টরি: সদর হাসপাতাল জরুরি বিভাগ, অক্সিজেন সিলিন্ডার, ফায়ার সার্ভিস ও রেড ক্রিসেন্ট হেল্পলাইন।",
      areaServed: "Feni, Bangladesh",
      telephone: formattedTel,
      priceRange: "Free / Public Emergency Hotline",
      openingHours: "Mo-Su 00:00-23:59",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#hotlines-summary", "#hotlines-bluf", "#emergency-faq-heading"],
      },
    },

    // 3. ItemList for Emergency Hotlines
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "ফেনীর জরুরি হটলাইন ও হাসপাতাল হেল্পলাইন তালিকা",
      itemListElement: hotlines.map((hotline, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "EmergencyService",
          name: hotline.titleBn || hotline.titleEn,
          telephone: hotline.phone,
          description: hotline.descriptionBn || hotline.titleBn,
          areaServed: "Feni, Bangladesh",
          openingHours: "Mo-Su 00:00-24:00",
        },
      })),
    },

    // 4. FAQPage Schema for Voice & AEO
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: hotlineFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={jsonLdData} />

      {/* Hero Header Section */}
      <header className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-amber-500/5 via-background to-background py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-500/20 shadow-2xs">
            <ShieldAlert className="h-3.5 w-3.5 animate-pulse text-amber-600" />
            <span>২৪/৭ ফেনী জরুরি যোগাযোগ হেল্পলাইন</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            ফেনী <span className="text-amber-600 dark:text-amber-500">জরুরি হটলাইন</span> ও হেল্পলাইন ডিরেক্টরি
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            ফেনী সদর হাসপাতাল জরুরি বিভাগ, জরুরি অক্সিজেন সিলিন্ডার সরবরাহ, ফায়ার সার্ভিস, পুলিশ ও সরকারি স্বাস্থ্য বাতায়ন নম্বরে সরাসরি ১-ট্যাপে কল করুন।
          </p>

          {/* Direct Answer Capsule (BLUF - Bottom Line Up Front) for GEO & AEO */}
          <div
            id="hotlines-bluf"
            className="mx-auto max-w-3xl p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-left space-y-2 shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>জরুরি সারাংশ (Quick Answer):</span>
            </div>
            <p id="hotlines-summary" className="text-xs sm:text-sm text-foreground leading-relaxed font-medium">
              ফেনীতে যেকোনো জরুরি মুহূর্তে পুলিশের সহায়তার জন্য <strong>৯৯৯</strong>, সরকারি স্বাস্থ্য বাতায়ন ফ্রি ডাক্তারি পরামর্শের জন্য <strong>১৬২৬৩</strong>, ফেনী ২৫০ শয্যা জেনারেল হাসপাতালের জরুরি বিভাগের জন্য <strong>০৩৩১-৭৪০১১</strong>, এবং জরুরি অক্সিজেন সিলিন্ডার হোম ডেলিভারির জন্য <strong>০১৮১৫-৯৯৮৮৭৭</strong> নম্বরে সরাসরি যোগাযোগ করতে পারবেন।
            </p>
          </div>

          {/* Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              হাসপাতাল জরুরি বিভাগ
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Wind className="h-3.5 w-3.5 text-cyan-600" />
              অক্সিজেন সিলিন্ডার সরবরাহ
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <PhoneForwarded className="h-3.5 w-3.5 text-amber-600" />
              ১০০% সরাসরি কল
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
        {/* Navigation Tabs */}
        <EmergencyTabsNav activeTab="hotlines" />

        {/* Hotlines Directory */}
        <section aria-labelledby="hotlines-directory-heading" className="space-y-4">
          <h2 id="hotlines-directory-heading" className="sr-only">
            ফেনী জরুরি হটলাইন তালিকা ও ফিল্টার
          </h2>
          <HotlineDirectory initialHotlines={hotlines} />
        </section>

        {/* Specialized Hotline FAQ */}
        <EmergencyFAQ
          hotline={contactSettings.hotline}
          items={hotlineFaqs}
          title="ফেনীর জরুরি হটলাইন ও হেল্পলাইন সম্পর্কিত সাধারণ প্রশ্ন"
          subtitle="ফেনী হাসপাতাল জরুরি বিভাগ, অক্সিজেন সিলিন্ডার, রেড ক্রিসেন্ট ও সরকারি হটলাইন নম্বরের বিস্তারিত তথ্য।"
          badgeText="হটলাইন জিজ্ঞাসা (FAQ)"
        />

        {/* Community Network CTA */}
        <CommunityNetworkCTA hotline={contactSettings.hotline} />
      </div>
    </div>
  );
}
