import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { EmergencyDirectory } from "./components/EmergencyDirectory";
import EmergencyGuide from "@/components/emergency/EmergencyGuide";
import EmergencyProtocol from "@/components/emergency/EmergencyProtocol";
import EmergencyFAQ from "@/components/emergency/EmergencyFAQ";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { Siren, ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";
import { getEmergencyDataAction } from "@/app/actions/emergencyAdminActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn
      ? "24/7 Emergency Health Services, Blood Donors & Ambulances in Feni - Health Club"
      : "জরুরি স্বাস্থ্য সেবা, রক্তদাতা ও অ্যাম্বুলেন্স তালিকা (ফেনী) - হেলথ ক্লাব",
    description: isEn
      ? "24/7 emergency medical support in Feni: voluntary blood donor directory by blood group, ICU & AC ambulance phone numbers, emergency oxygen cylinders, and hospital ER hotlines."
      : "ফেনীর ২৪/৭ জরুরি স্বাস্থ্য সহায়তা: রক্তের গ্রুপ ও উপজেলাভিত্তিক রক্তদাতা তালিকা, আইসিইউ ও এসি অ্যাম্বুলেন্স নম্বর, জরুরি অক্সিজেন সিলিন্ডার এবং সদর হাসপাতাল মেডিকেল হটলাইন।",
    alternates: {
      canonical: `${SITE_URL}/emergency`,
      languages: {
        "bn-BD": `${SITE_URL}/emergency`,
        "en-US": `${SITE_URL}/emergency`,
      },
    },
    keywords: [
      "feni ambulance",
      "feni ambulance service",
      "Feni ambulance service",
      "ফেনী এ্যাম্বুলেন্স সার্ভিস",
      "ফেনী অ্যাম্বুলেন্স সেবা",
      "ambulance service feni",
      "ICU ambulance in Feni",
      "আইসিইউ অ্যাম্বুলেন্স ফেনী",
      "feni blood donor",
      "feni blood donors",
      "feni blood bank",
      "ফেনী রক্তদাতা",
      "ফেনী ব্লাড ব্যাংক",
      "ফেনীর রক্তের গ্রুপ ডিরেক্টরি",
      "Emergency oxygen cylinder Feni",
      "ফেনী অক্সিজেন সিলিন্ডার সেবা",
      "Feni 250 bed hospital emergency hotline",
      "ফেনী সদর হাসপাতাল জরুরি বিভাগ",
      "Red Crescent blood bank Feni",
      "রেড ক্রিসেন্ট রক্ত কেন্দ্র ফেনী",
      "Health Club emergency directory",
      "Health Club Feni",
    ],
    openGraph: {
      title: isEn
        ? "24/7 Emergency Health Services & Blood Directory in Feni - Health Club"
        : "জরুরি স্বাস্থ্য সেবা, রক্তদাতা ও অ্যাম্বুলেন্স তালিকা (ফেনী) - হেলথ ক্লাব",
      description: isEn
        ? "Instant access to voluntary blood donors in Feni, 24/7 ICU/AC ambulance contacts, oxygen cylinder supplies, and critical hospital hotlines."
        : "মুহূর্তেই রক্তের গ্রুপ অনুযায়ী ফেনীর স্বেচ্ছাসেবী রক্তদাতা, ২৪/৭ আইসিইউ অ্যাম্বুলেন্স, জরুরি অক্সিজেন ও মেডিকেল হটলাইনে সরাসরি যোগাযোগ করুন।",
      url: `${SITE_URL}/emergency`,
      siteName: "হেলথ ক্লাব (Health Club)",
      locale: isEn ? "en_US" : "bn_BD",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: isEn
        ? "24/7 Emergency Health Services & Blood Directory - Health Club Feni"
        : "জরুরি স্বাস্থ্য সেবা ও রক্তদাতা ডিরেক্টরি - হেলথ ক্লাব ফেনী",
      description: isEn
        ? "Find verified blood donors, ICU ambulances, oxygen cylinder delivery, and emergency hotlines in Feni."
        : "ফেনীর ভেরিফাইড রক্তদাতা, আইসিইউ অ্যাম্বুলেন্স, অক্সিজেন সিলিন্ডার ও হাসপাতালের জরুরি হটলাইন নম্বর।",
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

export default async function EmergencyPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";
  const t = (key: string) => tServer(locale, key);

  const { bloodDonors, ambulances, hotlines } = await getEmergencyDataAction();
  const approvedDonors = bloodDonors.filter((d) => d.status !== "pending");
  const approvedAmbulances = ambulances.filter((a) => a.status !== "pending");

  // Structured Data for SEO, AEO, and GEO Rich Snippets
  const jsonLdData = [
    // 1. BreadcrumbList Schema
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isEn ? "Home" : "হোম",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: isEn ? "Emergency Health Services" : "জরুরি স্বাস্থ্য সেবা",
          item: `${SITE_URL}/emergency`,
        },
      ],
    },

    // 2. EmergencyService & MedicalBusiness Schema
    {
      "@context": "https://schema.org",
      "@type": ["EmergencyService", "MedicalBusiness"],
      name: isEn
        ? "Health Club 24/7 Emergency Health Network Feni"
        : "হেলথ ক্লাব জরুরি স্বাস্থ্য সেবা ও রক্তদাতা নেটওয়ার্ক (ফেনী)",
      url: `${SITE_URL}/emergency`,
      logo: `${SITE_URL}/images/member-card-logo.png`,
      description: isEn
        ? "24/7 emergency medical directory in Feni, Bangladesh. Voluntary blood donor network, ICU/AC ambulances, oxygen supplies, and critical hospital ER dispatch."
        : "ফেনীর ২৪/৭ জরুরি স্বাস্থ্য সহায়তা ডিরেক্টরি। রক্তের গ্রুপ অনুযায়ী ভেরিফাইড রক্তদাতা, আইসিইউ ও এসি অ্যাম্বুলেন্স, অক্সিজেন সিলিন্ডার এবং হাসপাতাল জরুরি হটলাইন।",
      areaServed: [
        "Feni Sadar",
        "Daganbhuiyan",
        "Chhagalnaiya",
        "Sonagazi",
        "Parshuram",
        "Fulgazi",
        "Feni, Bangladesh",
      ],
      openingHours: "Mo-Su 00:00-24:00",
      telephone: "+8801886763849",
      priceRange: "Free / Public Service",
      availableService: [
        "Voluntary Blood Donor Matching",
        "24/7 Ambulance Dispatch",
        "Emergency Oxygen Cylinder Coordination",
        "Hospital ER Hotline Connection",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Feni",
        addressRegion: "Chittagong",
        addressCountry: "BD",
      },
    },

    // 3. ItemList for Ambulance Fleet
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: isEn ? "Ambulance Services in Feni" : "ফেনীর জরুরি অ্যাম্বুলেন্স সেবা",
      itemListElement: ambulances.map((amb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "EmergencyService",
          name: amb.name,
          telephone: amb.phone,
          description: `${amb.type} Ambulance Service in ${amb.location}`,
          areaServed: amb.location,
          openingHours: "Mo-Su 00:00-24:00",
        },
      })),
    },

    // 4. ItemList for Emergency Hotlines & Hospitals
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: isEn ? "Emergency Hotlines & Medical Centers in Feni" : "ফেনীর জরুরি মেডিকেল ও সরকারি হটলাইন",
      itemListElement: hotlines.map((hotline, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "EmergencyService",
          name: isEn ? hotline.titleEn : hotline.titleBn,
          telephone: hotline.phone,
          description: isEn ? hotline.descriptionEn : hotline.descriptionBn,
          areaServed: "Feni, Bangladesh",
        },
      })),
    },

    // 5. FAQPage Schema for AEO & Voice Search Engines
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: t("emergency.faq.q1"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("emergency.faq.a1"),
          },
        },
        {
          "@type": "Question",
          name: t("emergency.faq.q2"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("emergency.faq.a2"),
          },
        },
        {
          "@type": "Question",
          name: t("emergency.faq.q3"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("emergency.faq.a3"),
          },
        },
        {
          "@type": "Question",
          name: t("emergency.faq.q4"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("emergency.faq.a4"),
          },
        },
        {
          "@type": "Question",
          name: t("emergency.faq.q5"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("emergency.faq.a5"),
          },
        },
        {
          "@type": "Question",
          name: t("emergency.faq.q6"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("emergency.faq.a6"),
          },
        },
      ],
    },

    // 6. HowTo Schema for Step-by-Step Emergency Response
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: isEn
        ? "How to Handle a Medical Emergency in Feni Before Ambulance Arrival"
        : "মেডিকেল ইমার্জেন্সিতে তাৎক্ষণিক করণীয় ৪টি জীবনরক্ষাকারী পদক্ষেপ",
      description: isEn
        ? "Follow these essential 4 steps during a medical emergency in Feni before ambulance arrival."
        : "ফেনীতে জরুরি স্বাস্থ্য পরিস্থিতিতে অ্যাম্বুলেন্স আসার আগে বা হাসপাতালে যাওয়ার মুহূর্তে করণীয় ৪টি ধাপ।",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: t("emergency.protocol.step1.title"),
          text: t("emergency.protocol.step1.desc"),
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: t("emergency.protocol.step2.title"),
          text: t("emergency.protocol.step2.desc"),
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: t("emergency.protocol.step3.title"),
          text: t("emergency.protocol.step3.desc"),
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: t("emergency.protocol.step4.title"),
          text: t("emergency.protocol.step4.desc"),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={jsonLdData} />

      {/* Hero Header Section */}
      <header className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-primary/5 via-background to-background py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-bold border border-rose-500/20 shadow-2xs">
            <Siren className="h-3.5 w-3.5 animate-pulse text-rose-600" />
            <span>{isEn ? "24/7 Feni Emergency Medical Support" : "২৪/৭ ফেনী জরুরি স্বাস্থ্য সহায়তা"}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            {isEn ? (
              <>
                Emergency Healthcare & <span className="text-rose-600 dark:text-rose-500">Blood Directory</span>
              </>
            ) : (
              <>
                জরুরি স্বাস্থ্য সেবা ও <span className="text-rose-600 dark:text-rose-500">রক্তদাতা ডিরেক্টরি</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            {isEn
              ? "Instant access to voluntary blood donors in Feni, 24/7 ambulance services, emergency oxygen supplies, and critical medical hotlines."
              : "মুহূর্তেই রক্তের গ্রুপ অনুযায়ী ফেনীর স্বেচ্ছাসেবী রক্তদাতা, ২৪/৭ আইসিইউ অ্যাম্বুলেন্স, জরুরি অক্সিজেন ও মেডিকেল হটলাইনে সরাসরি যোগাযোগ করুন।"}
          </p>

          {/* Quick Highlight Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              {isEn ? "Verified Donors" : "যাচাইকৃত রক্তদাতা"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <PhoneCall className="h-3.5 w-3.5 text-rose-600" />
              {isEn ? "24/7 Direct Helpline" : "২৪/৭ সরাসরি কল"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <HeartHandshake className="h-3.5 w-3.5 text-amber-600" />
              {isEn ? "100% Free Public Service" : "সম্পূর্ণ মধ্যস্বত্বভোগীমুক্ত"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
        
        {/* 1. Interactive Directory Component (Blood Donors, Ambulances, Hotlines) */}
        <section aria-labelledby="emergency-directory-heading" className="space-y-4">
          <h2 id="emergency-directory-heading" className="sr-only">
            {isEn ? "Emergency Directory Search & Filters" : "জরুরি ডিরেক্টরি ও অনুসন্ধান"}
          </h2>
          <EmergencyDirectory
            initialBloodDonors={approvedDonors}
            initialAmbulances={approvedAmbulances}
            initialHotlines={hotlines}
          />
        </section>

        {/* 2. Generative Engine Optimization (GEO) Healthcare Authority & Stats Guide */}
        <EmergencyGuide />

        {/* 3. Emergency 4-Step Life-Saving Action Protocol */}
        <EmergencyProtocol />

        {/* 4. Answer Engine Optimization (AEO) FAQ Section */}
        <EmergencyFAQ />

        {/* 5. Emergency Community Collaborations & Multi-Pathway CTA */}
        <CommunityNetworkCTA />

      </div>
    </div>
  );
}
