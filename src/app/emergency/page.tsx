import JsonLd from "@/components/seo/JsonLd";
import { InstantEmergencyDial } from "./components/InstantEmergencyDial";
import { EmergencyTabsNav } from "./components/EmergencyTabsNav";
import EmergencyGuide from "@/components/emergency/EmergencyGuide";
import EmergencyProtocol from "@/components/emergency/EmergencyProtocol";
import EmergencyFAQ from "@/components/emergency/EmergencyFAQ";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import {
  Siren,
  ShieldCheck,
  HeartHandshake,
  PhoneCall,
  Heart,
  Truck,
  PhoneForwarded,
  ArrowRight,
} from "lucide-react";
import { getEmergencyDataAction } from "@/app/actions/emergencyAdminActions";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export const revalidate = false; // Pure static SSG (on-demand revalidated on emergency updates)

export async function generateMetadata() {
  return {
    title: "ফেনী রক্তদাতা, ২৪/৭ আইসিইউ অ্যাম্বুলেন্স ও জরুরি স্বাস্থ্য সেবা",
    description: "ফেনীর ২৪/৭ জরুরি স্বাস্থ্য সহায়তা: রক্তের গ্রুপভিত্তিক স্বেচ্ছাসেবী রক্তদাতা, আইসিইউ ও এসি অ্যাম্বুলেন্স নম্বর, জরুরি অক্সিজেন সিলিন্ডার এবং সদর হাসপাতাল মেডিকেল হটলাইন ডিরেক্টরি।",
    alternates: {
      canonical: `${SITE_URL}/emergency`,
    },
    keywords: [
      "feni blood donor",
      "blood donor in feni",
      "feni blood bank contact number",
      "feni blood bank",
      "feni blood donors directory",
      "feni emergency ambulance service",
      "feni ambulance number",
      "icu ambulance feni",
      "feni ambulance",
      "feni ambulance service",
      "feni oxygen cylinder",
      "emergency oxygen cylinder feni",
      "emergency oxygen supply feni",
      "ফেনী রক্তদাতা",
      "ফেনী ব্লাড ব্যাংক",
      "ফেনীর রক্তের গ্রুপ ডিরেক্টরি",
      "ফেনী অ্যাম্বুলেন্স সেবা",
      "ফেনী এ্যাম্বুলেন্স সার্ভিস",
      "আইসিইউ অ্যাম্বুলেন্স ফেনী",
      "ফেনী অক্সিজেন সিলিন্ডার সেবা",
      "ফেনী সদর হাসপাতাল জরুরি বিভাগ",
      "রেড ক্রিসেন্ট রক্ত কেন্দ্র ফেনী",
      "Feni 250 bed hospital emergency hotline",
      "Red Crescent blood bank Feni",
      "Health Club emergency directory",
      "Health Club Feni",
    ],
    openGraph: {
      title: "জরুরি স্বাস্থ্য সেবা, রক্তদাতা ও অ্যাম্বুলেন্স তালিকা (ফেনী) - হেলথ ক্লাব",
      description: "মুহূর্তেই রক্তের গ্রুপ অনুযায়ী ফেনীর স্বেচ্ছাসেবী রক্তদাতা, ২৪/৭ আইসিইউ অ্যাম্বুলেন্স, জরুরি অক্সিজেন ও মেডিকেল হটলাইনে সরাসরি যোগাযোগ করুন।",
      url: `${SITE_URL}/emergency`,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: "জরুরি স্বাস্থ্য সেবা ও রক্তদাতা ডিরেক্টরি - হেলথ ক্লাব ফেনী",
      description: "ফেনীর ভেরিফাইড রক্তদাতা, আইসিইউ অ্যাম্বুলেন্স, অক্সিজেন সিলিন্ডার ও হাসপাতালের জরুরি হটলাইন নম্বর।",
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

interface EmergencyPageProps {
  searchParams?: Promise<{ tab?: string }>;
}

export default async function EmergencyPage({ searchParams }: EmergencyPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const tab = resolvedSearchParams?.tab;

  if (tab === "hotlines") {
    permanentRedirect("/emergency/hotlines");
  } else if (tab === "ambulances") {
    permanentRedirect("/emergency/ambulances");
  } else if (tab === "donors") {
    permanentRedirect("/emergency/blood-donors");
  }

  const [{ bloodDonors, ambulances, hotlines }, contactSettings] = await Promise.all([
    getEmergencyDataAction(),
    getCachedContactSettings(),
  ]);
  const approvedDonors = bloodDonors.filter((d) => d.status !== "pending");
  const approvedAmbulances = ambulances.filter((a) => a.status !== "pending");

  const rawHotline = contactSettings.hotline.replace(/[^0-9]/g, "");
  const formattedTel = `+880${rawHotline.replace(/^(880|88|0)/, "")}`;

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
          name: "হোম",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "জরুরি স্বাস্থ্য সেবা",
          item: `${SITE_URL}/emergency`,
        },
      ],
    },

    // 2. EmergencyService & MedicalBusiness Schema
    {
      "@context": "https://schema.org",
      "@type": ["EmergencyService", "MedicalBusiness", "LocalBusiness"],
      name: "হেলথ ক্লাব জরুরি স্বাস্থ্য সেবা ও রক্তদাতা নেটওয়ার্ক (ফেনী)",
      url: `${SITE_URL}/emergency`,
      logo: `${SITE_URL}/images/member-card-logo.webp`,
      description: "ফেনীর ২৪/৭ জরুরি স্বাস্থ্য সহায়তা ডিরেক্টরি। রক্তের গ্রুপ অনুযায়ী ভেরিফাইড রক্তদাতা, আইসিইউ ও এসি অ্যাম্বুলেন্স, অক্সিজেন সিলিন্ডার এবং হাসপাতাল জরুরি হটলাইন।",
      areaServed: [
        "Feni Sadar",
        "Daganbhuiyan",
        "Chhagalnaiya",
        "Sonagazi",
        "Parshuram",
        "Fulgazi",
        "Feni, Bangladesh",
      ],
      geo: {
        "@type": "GeoCoordinates",
        latitude: "23.0159",
        longitude: "91.3976",
      },
      openingHours: "Mo-Su 00:00-23:59",
      telephone: formattedTel,
      priceRange: "Free / Public Service",
      availableService: [
        "Voluntary Blood Donor Matching",
        "24/7 Ambulance Dispatch",
        "Emergency Oxygen Cylinder Coordination",
        "Hospital ER Hotline Connection",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Trunk Road, Feni Sadar",
        addressLocality: "Feni",
        addressRegion: "Chittagong",
        postalCode: "3900",
        addressCountry: "BD",
      },
    },

    // 3. ItemList for Ambulance Fleet
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "ফেনীর জরুরি অ্যাম্বুলেন্স সেবা",
      itemListElement: approvedAmbulances.map((amb, index) => ({
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
      name: "ফেনীর জরুরি মেডিকেল ও সরকারি হটলাইন",
      itemListElement: hotlines.map((hotline, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "EmergencyService",
          name: hotline.titleBn,
          telephone: hotline.phone,
          description: hotline.descriptionBn || hotline.titleBn,
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
          name: "ফেনীতে জরুরি রক্তের প্রয়োজনে কীভাবে তাৎক্ষণিক রক্তদাতা ও ব্লাড ব্যাংক খুঁজে পাবেন?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "হেলথ ক্লাবের 'জরুরি সেবা' পেজে যান এবং রক্তের গ্রুপ ফিল্টার থেকে রোগীর প্রয়োজনীয় গ্রুপ (যেমন: A+, B+, O+, AB-) ও উপজেলা (ফেনী সদর, সোনাগাজী, দাগনভূঞা ইত্যাদি) নির্বাচন করুন। তালিকাভুক্ত ভেরিফাইড রক্তদাতার কার্ডে 'কল করুন' অথবা 'WhatsApp' বাটনে চাপ দিয়ে সরাসরি যোগাযোগ করুন। এছাড়া রেড ক্রিসেন্ট রক্ত কেন্দ্রের (01819-887766) সাথেও যোগাযোগ করতে পারেন।",
          },
        },
        {
          "@type": "Question",
          name: "ফেনীতে ২৪ ঘণ্টা আইসিইউ (ICU) বা এসি অ্যাম্বুলেন্স সার্ভিস কীভাবে বুক করবেন?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ডিরেক্টরির 'অ্যাম্বুলেন্স' ট্যাবে গিয়ে ফেনী সেন্ট্রাল অ্যাম্বুলেন্স (01876077777), মেদিনোভা, রবিন বা মহিপাল অ্যাম্বুলেন্স সার্ভিসের কল বাটনে চাপ দিয়ে সরাসরি ড্রাইভার বা ডেস্কে কথা বলুন। গুরুতর ও আশঙ্কাজনক রোগীর ক্ষেত্রে লাইফ-সাপোর্ট ও ভেন্টিলেটর সমৃদ্ধ ICU অ্যাম্বুলেন্সের জন্য অনুরোধ করুন।",
          },
        },
        {
          "@type": "Question",
          name: "ফেনীতে ২৪/৭ জরুরি মেডিকেল অক্সিজেন সিলিন্ডার সেবা কীভাবে পাওয়া যাবে?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "জরুরি হটলাইন সেকশনে থাকা 'ফেনী জরুরি অক্সিজেন সিলিন্ডার সেবা' নম্বরে (01815-998877) কল করুন। তারা তাৎক্ষণিক রিফিলিং, ফ্লো-মিটার, রেগুলেটর মাস্ক ও ফেনী শহর ও আশেপাশের এলাকায় দ্রুত হোম ডেলিভারি সাপোর্ট প্রদান করে।",
          },
        },
        {
          "@type": "Question",
          name: "ফেনী সদর হাসপাতালের জরুরি বিভাগ ও সরকারি স্বাস্থ্য বাতায়ন নম্বর কী?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ফেনী ২৫০ শয্যা জেনারেল হাসপাতালের জরুরি বিভাগের সরাসরি হটলাইন নম্বর 0331-74011। এছাড়া জাতীয় জরুরি স্বাস্থ্য পরামর্শের জন্য ১৬২৬৩ (স্বাস্থ্য বাতায়ন) এবং পুলিশ, ফায়ার সার্ভিস ও সরকারি অ্যাম্বুলেন্স সহায়তার জন্য ৯৯৯ সম্পূর্ণ টোল-ফ্রি ২৪/৭ চালু থাকে।",
          },
        },
        {
          "@type": "Question",
          name: "হেলথ ক্লাবে স্বেচ্ছাসেবী রক্তদাতা হিসেবে কীভাবে নাম তালিকাভুক্ত করবেন?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "জরুরি পেজের রক্তদাতা ট্যাবে থাকা 'রক্তদাতা হতে যুক্ত হোন' বাটনে ক্লিক করুন। আপনার নাম, রক্তের গ্রুপ, উপজেলা, মোবাইল নম্বর ও সর্বশেষ রক্তদানের তথ্য দিয়ে সাবমিট করলেই হেলথ ক্লাব ডিরেক্টরিতে আপনার নাম যুক্ত হবে।",
          },
        },
        {
          "@type": "Question",
          name: "ফেনীর জরুরি ডিরেক্টরি ব্যবহার করতে কি কোনো প্রকার ফি বা চার্জ লাগে?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "না, হেলথ ক্লাবের জরুরি স্বাস্থ্য ডিরেক্টরিটি জনস্বার্থে সম্পূর্ণ বিনামূল্যে উন্মুক্ত। রক্তদাতা, অ্যাম্বুলেন্স ড্রাইভার, অক্সিজেন সরবরাহকারী ও হাসপাতালের সাথে সরাসরি কোনো প্রকার মধ্যস্বত্বভোগী বা ব্রোকারেজ ফি ছাড়া যোগাযোগ করা যায়।",
          },
        },
      ],
    },

    // 6. HowTo Schema for Step-by-Step Emergency Response
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "মেডিকেল ইমার্জেন্সিতে তাৎক্ষণিক করণীয় ৪টি জীবনরক্ষাকারী পদক্ষেপ",
      description: "ফেনীতে জরুরি স্বাস্থ্য পরিস্থিতিতে অ্যাম্বুলেন্স আসার আগে বা হাসপাতালে যাওয়ার মুহূর্তে করণীয় ৪টি ধাপ।",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "১. শান্ত থাকুন ও রোগীর অবস্থা দ্রুত পর্যবেক্ষণ করুন",
          text: "রোগীর শ্বাস-প্রশ্বাস, জ্ঞান ও রক্তক্ষরণ হচ্ছে কিনা তা দ্রুত নিশ্চিত করুন। অতিরিক্ত আতঙ্কিত না হয়ে রোগীকে নিরাপদ ও সমতল স্থানে রাখুন।",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "২. তাৎক্ষণিক অ্যাম্বুলেন্স বা হটলাইনে সরাসরি কল দিন",
          text: "ফেনী সেন্ট্রাল অ্যাম্বুলেন্স বা জাতীয় জরুরি সেবা ৯৯৯ নম্বরে ফোন দিন। রোগীর সঠিক বর্তমান লোকেশন এবং সমস্যা স্পষ্টভাবে বলুন।",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "৩. রক্তের প্রয়োজনে ডোনারের সাথে যোগাযোগ করুন",
          text: "হেলথ ক্লাব ডিরেক্টরিতে রক্তের গ্রুপ ও উপজেলা নির্বাচন করে রক্তদাতার নম্বরে কল অথবা হোয়াটসঅ্যাপে দ্রুত বার্তা পাঠান।",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "৪. মেডিকেল রিপোর্ট প্রস্তুত রাখুন ও হাসপাতালে রওনা হোন",
          text: "রোগীর পূর্ববর্তী প্রেসক্রিপশন ও রিপোর্ট সাথে নিন। হেলথ ক্লাবের মেম্বারশিপ থাকলে পার্টনার হাসপাতালে জরুরি টেস্টে অগ্রাধিকার ও ডিসকাউন্ট নিশ্চিত করুন।",
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
            <span>২৪/৭ ফেনী জরুরি স্বাস্থ্য সহায়তা</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            ফেনী জরুরি স্বাস্থ্য সেবা ও <span className="text-rose-600 dark:text-rose-500">তাৎক্ষণিক সহায়তা কেন্দ্র</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            মুহূর্তেই রক্তের গ্রুপ অনুযায়ী স্বেচ্ছাসেবী রক্তদাতা, ২৪/৭ আইসিইউ ও এসি অ্যাম্বুলেন্স, জরুরি অক্সিজেন ও মেডিকেল হটলাইনে সরাসরি যোগাযোগ করুন।
          </p>

          {/* Quick Highlight Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              যাচাইকৃত রক্তদাতা
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <PhoneCall className="h-3.5 w-3.5 text-rose-600" />
              ২৪/৭ সরাসরি কল
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <HeartHandshake className="h-3.5 w-3.5 text-amber-600" />
              সম্পূর্ণ মধ্যস্বত্বভোগীমুক্ত
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 sm:space-y-14">
        {/* Navigation Tabs Bar */}
        <EmergencyTabsNav activeTab="overview" />

        {/* 3 Quick Action Pathway Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          <Link
            href="/emergency/blood-donors"
            prefetch={true}
            className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 hover:border-rose-500/40 transition-all duration-200 shadow-xs flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Heart className="h-5 w-5 fill-rose-500/20" />
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600">
                  {approvedDonors.length} জন ডোনার
                </span>
              </div>
              <h3 className="font-heading font-bold text-base text-foreground group-hover:text-rose-600 transition-colors">
                স্বেচ্ছাসেবী রক্তদাতা ডিরেক্টরি
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                রক্তের ৮টি গ্রুপ ও ফেনীর ৬টি উপজেলার ভেরিফাইড রক্তদাতাদের সাথে সরাসরি যোগাযোগ।
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-border/50 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>রক্তদাতা তালিকা দেখুন</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/emergency/ambulances"
            prefetch={true}
            className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-all duration-200 shadow-xs flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Truck className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {approvedAmbulances.length}টি অ্যাম্বুলেন্স
                </span>
              </div>
              <h3 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                ২৪/৭ জরুরি অ্যাম্বুলেন্স বহর
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                আইসিইউ, এসি, নন-এসি ও ফ্রিজিং অ্যাম্বুলেন্সের সরাসরি চালক ও কাউন্টার নম্বর।
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary">
              <span>অ্যাম্বুলেন্স বহর দেখুন</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/emergency/hotlines"
            prefetch={true}
            className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 hover:border-amber-500/40 transition-all duration-200 shadow-xs flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <PhoneForwarded className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                  {hotlines.length}টি হটলাইন
                </span>
              </div>
              <h3 className="font-heading font-bold text-base text-foreground group-hover:text-amber-600 transition-colors">
                জরুরি হটলাইন ও অক্সিজেন
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                সদর হাসপাতাল, অক্সিজেন সিলিন্ডার হোম ডেলিভারি, ফায়ার সার্ভিস ও ৯৯৯ হেল্পলাইন।
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-border/50 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>সকল হটলাইন দেখুন</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* 1. Instant Emergency Dial Section (1-Tap Direct Calls) */}
        <InstantEmergencyDial />

        {/* 2. Generative Engine Optimization (GEO) Healthcare Authority & Stats Guide */}
        <EmergencyGuide />

        {/* 3. Emergency 4-Step Life-Saving Action Protocol */}
        <EmergencyProtocol />

        {/* 4. Answer Engine Optimization (AEO) FAQ Section */}
        <EmergencyFAQ hotline={contactSettings.hotline} />

        {/* 5. Emergency Community Collaborations & Multi-Pathway CTA */}
        <CommunityNetworkCTA hotline={contactSettings.hotline} />

      </div>
    </div>
  );
}
