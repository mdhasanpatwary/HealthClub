import JsonLd from "@/components/seo/JsonLd";
import { AmbulanceDirectory } from "../components/AmbulanceDirectory";
import { EmergencyTabsNav } from "../components/EmergencyTabsNav";
import EmergencyFAQ, { FAQItem } from "@/components/emergency/EmergencyFAQ";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { Truck, ShieldCheck, PhoneCall, Activity, Wind, Snowflake } from "lucide-react";
import { getEmergencyDataAction } from "@/app/actions/emergencyAdminActions";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { toBanglaNums } from "@/lib/utils";
import { AMBULANCE_TYPES } from "@/data/emergencyData";
import {
  paginateAmbulances,
  DEFAULT_AMBULANCE_PAGE_SIZE,
} from "../utils/ambulancePagination";

export const revalidate = false; // Pure static SSG on base page, on-demand revalidated on emergency updates

interface EmergencyAmbulancesPageProps {
  searchParams?: Promise<{
    page?: string;
    type?: string;
    search?: string;
  }>;
}

export async function generateMetadata({ searchParams }: EmergencyAmbulancesPageProps) {
  const resolvedParams = (await searchParams) || {};
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10) || 1);
  const selectedType = (resolvedParams.type || "all").trim();
  const searchQuery = (resolvedParams.search || "").trim();

  const typeConfig = AMBULANCE_TYPES.find((t) => t.id.toLowerCase() === selectedType.toLowerCase());
  const typeSuffix = typeConfig ? ` (${typeConfig.nameBn})` : "";
  const pageSuffix = currentPage > 1 ? ` (পৃষ্ঠা ${toBanglaNums(currentPage)})` : "";

  const title = `ফেনী অ্যাম্বুলেন্স সার্ভিস নম্বর${typeSuffix}${pageSuffix} | হেলথ ক্লাব`;
  const description = `ফেনীর ২৪/৭ জরুরি অ্যাম্বুলেন্স সেবা${typeSuffix}: আইসিইউ (ICU), এসি, নন-এসি ও ফ্রিজার অ্যাম্বুলেন্স চালক ও সার্ভিসের সরাসরি ফোন নম্বর${pageSuffix}।`;

  const queryParams = new URLSearchParams();
  if (currentPage > 1) queryParams.set("page", String(currentPage));
  if (selectedType !== "all") queryParams.set("type", selectedType);

  const canonicalUrl = `${SITE_URL}/emergency/ambulances${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      "feni ambulance number",
      "feni ambulance service",
      "icu ambulance feni",
      "feni ac ambulance",
      "feni to dhaka ambulance fare",
      "feni emergency ambulance",
      "mohipal ambulance service",
      "ফেনী অ্যাম্বুলেন্স সেবা",
      "ফেনী এ্যাম্বুলেন্স সার্ভিস",
      "আইসিইউ অ্যাম্বুলেন্স ফেনী",
      "ফেনী এসি অ্যাম্বুলেন্স",
      "মহিপাল অ্যাম্বুলেন্স নম্বর",
      "ফেনী থেকে ঢাকা অ্যাম্বুলেন্স ভাড়া",
      "লাশবাহী ফ্রিজিং অ্যাম্বুলেন্স ফেনী",
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: DEFAULT_TWITTER_IMAGES,
    },
    robots: {
      index: !searchQuery,
      follow: true,
      googleBot: {
        index: !searchQuery,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function EmergencyAmbulancesPage({
  searchParams,
}: EmergencyAmbulancesPageProps) {
  const resolvedParams = (await searchParams) || {};
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10) || 1);
  const selectedType = (resolvedParams.type || "all").trim();
  const searchQuery = (resolvedParams.search || "").trim();

  const [{ ambulances }, contactSettings] = await Promise.all([
    getEmergencyDataAction(),
    getCachedContactSettings(),
  ]);

  const approvedAmbulances = ambulances.filter((a) => a.status !== "pending");

  const paginatedResult = paginateAmbulances(approvedAmbulances, {
    page: currentPage,
    pageSize: DEFAULT_AMBULANCE_PAGE_SIZE,
    type: selectedType,
    search: searchQuery,
  });

  const rawHotline = contactSettings.hotline.replace(/[^0-9]/g, "");
  const formattedTel = `+880${rawHotline.replace(/^(880|88|0)/, "")}`;

  const queryParams = new URLSearchParams();
  if (paginatedResult.currentPage > 1) {
    queryParams.set("page", String(paginatedResult.currentPage));
  }
  if (selectedType !== "all") queryParams.set("type", selectedType);

  const pageCanonicalUrl = `${SITE_URL}/emergency/ambulances${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const ambulanceFaqs: FAQItem[] = [
    {
      question: "ফেনীতে ২৪ ঘণ্টা আইসিইউ (ICU) বা ভেন্টিলেটর অ্যাম্বুলেন্স কীভাবে বুক করবেন?",
      answer: "ডিরেক্টরির তালিকা থেকে ফেনী সেন্ট্রাল অ্যাম্বুলেন্স (01876077777) বা মেদিনোভা অ্যাম্বুলেন্সের সরাসরি কল বাটনে চাপ দিয়ে রোগীর অবস্থা জানান। গুরুতর ও আশঙ্কাজনক রোগীর ক্ষেত্রে লাইফ-সাপোর্ট ও ভেন্টিলেটর সমৃদ্ধ ICU অ্যাম্বুলেন্সের জন্য অনুরোধ করুন।",
    },
    {
      question: "ফেনী থেকে ঢাকা বা চট্টগ্রাম অ্যাম্বুলেন্স ভাড়া আনুমানিক কত?",
      answer: "গাড়ির ধরণ ও দূরত্বের ওপর নির্ভর করে সাধারণ এসি অ্যাম্বুলেন্সে ফেনী থেকে ঢাকা আনুমানিক ৮,০০০-১২,০০০ টাকা এবং চট্টগ্রাম আনুমানিক ৪,০০০-৬,০০০ টাকা হতে পারে। জটিল রোগীর ক্ষেত্রে আইসিইউ (ICU) ভেন্টিলেটর সাপোর্টের কারণে ভাড়া আলাদা নির্ধারিত হয়।",
    },
    {
      question: "হেলথ ক্লাবের মাধ্যমে অ্যাম্বুলেন্স বুকিংয়ে কি কোনো বাড়তি ফি দিতে হয়?",
      answer: "না, হেলথ ক্লাব কোনো মধ্যস্বত্বভোগী বা ব্রোকারেজ ফি গ্রহণ করে না। সেবাগ্রহীতারা সরাসরি চালক বা অ্যাম্বুলেন্স কাউন্টারে কথা বলে ন্যায্য ভাড়ায় অ্যাম্বুলেন্স ভাড়া করতে পারেন।",
    },
    {
      question: "ফেনীতে কি ফ্রিজার বা লাশবাহী অ্যাম্বুলেন্সের সুবিধা পাওয়া যায়?",
      answer: "হ্যাঁ, হেলথ ক্লাবের অ্যাম্বুলেন্স ফিল্টারে 'ফ্রিজিং ক্যারিয়ার' অপশন নির্বাচন করে লাশ বহনের জন্য বিশেষায়িত শীতাতপ নিয়ন্ত্রিত ফ্রিজিং অ্যাম্বুলেন্সের চালকের সাথে সরাসরি যোগাযোগ করা সম্ভব।",
    },
    {
      question: "জরুরি মহাসড়ক দুর্ঘটনায় কোন অ্যাম্বুলেন্স সবচেয়ে দ্রুত পৌঁছাবে?",
      answer: "ঢাকা-চট্টগ্রাম মহাসড়কের মহিপাল পয়েন্ট সংলগ্ন মহিপাল হাইওয়ে অ্যাম্বুলেন্স সার্ভিস বা ফেনী সেন্ট্রাল অ্যাম্বুলেন্স সবচেয়ে দ্রুত সেবা প্রদান করতে সক্ষম।",
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
          name: "জরুরি অ্যাম্বুলেন্স",
          item: pageCanonicalUrl,
        },
      ],
    },

    // 2. EmergencyService Schema
    {
      "@context": "https://schema.org",
      "@type": ["EmergencyService", "MedicalBusiness", "LocalBusiness"],
      name: "ফেনী ২৪/৭ জরুরি অ্যাম্বুলেন্স সার্ভিস ও ড্রাইভার নেটওয়ার্ক",
      url: pageCanonicalUrl,
      logo: `${SITE_URL}/images/member-card-logo.webp`,
      description: "ফেনীর ২৪/৭ আইসিইউ, এসি, নন-এসি ও ফ্রিজিং অ্যাম্বুলেন্স সার্ভিসের সরাসরি ড্রাইভার যোগাযোগ নম্বর ও রুট ডিরেক্টরি।",
      areaServed: [
        "Feni Sadar",
        "Daganbhuiyan",
        "Chhagalnaiya",
        "Sonagazi",
        "Parshuram",
        "Fulgazi",
        "Dhaka-Chittagong Highway",
      ],
      telephone: formattedTel,
      priceRange: "Market Standard / Direct Negotiation",
      openingHours: "Mo-Su 00:00-23:59",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#ambulance-summary", "#ambulance-bluf", "#emergency-faq-heading"],
      },
    },

    // 3. ItemList for Ambulance Fleet
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "ফেনীর জরুরি অ্যাম্বুলেন্স ফ্লিট ও চালক তালিকা",
      itemListElement: paginatedResult.ambulances.map((amb, index) => ({
        "@type": "ListItem",
        position: (paginatedResult.currentPage - 1) * paginatedResult.pageSize + index + 1,
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

    // 4. FAQPage Schema for Voice & AEO
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: ambulanceFaqs.map((faq) => ({
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
      <header className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-primary/5 via-background to-background py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-2xs">
            <Truck className="h-3.5 w-3.5 animate-pulse" />
            <span>২৪/৭ ফেনী জরুরি অ্যাম্বুলেন্স বহর</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            ফেনী <span className="text-primary">জরুরি অ্যাম্বুলেন্স</span> সার্ভিস ও ড্রাইভার তালিকা
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            মুহূর্তেই ফেনী শহর, উপজেলা ও মহাসড়কের জন্য আইসিইউ, এসি ও ফ্রিজার অ্যাম্বুলেন্সের যাচাইকৃত চালক ও কন্ট্রোল রুমে সরাসরি কল করুন।
          </p>

          {/* Direct Answer Capsule (BLUF) */}
          <div
            id="ambulance-bluf"
            className="mx-auto max-w-3xl p-4 sm:p-5 rounded-2xl bg-primary/10 border border-primary/25 text-left space-y-2 shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>জরুরি তথ্য (Quick Answer):</span>
            </div>
            <p id="ambulance-summary" className="text-xs sm:text-sm text-foreground leading-relaxed font-medium">
              ফেনীতে জরুরি রোগী পরিবহনের জন্য ফেনী সেন্ট্রাল অ্যাম্বুলেন্স <strong>০১৮৭৬০৭৭৭৭৭</strong>, মেদিনোভা অ্যাম্বুলেন্স <strong>০১৮১৯৭৬৭৮৯১</strong>, এবং মহিপাল হাইওয়ে অ্যাম্বুলেন্স সার্বক্ষণিক প্রস্তুত থাকে। আশঙ্কাজনক রোগীর ক্ষেত্রে লাইফ সাপোর্ট ও ভেন্টিলেটরযুক্ত আইসিইউ (ICU) অ্যাম্বুলেন্সের জন্য অবিলম্বে অনুরোধ করুন।
            </p>
          </div>

          {/* Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Activity className="h-3.5 w-3.5 text-rose-600" />
              লাইফ সাপোর্ট ICU অ্যাম্বুলেন্স
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Wind className="h-3.5 w-3.5 text-emerald-600" />
              এসি ও নন-এসি ক্যারিয়ার
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Snowflake className="h-3.5 w-3.5 text-cyan-600" />
              ফ্রিজিং ডেড-বডি অ্যাম্বুলেন্স
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              দালালমুক্ত সরাসরি চালক নম্বর
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
        {/* Navigation Tabs */}
        <EmergencyTabsNav activeTab="ambulances" />

        {/* Ambulance Directory with Server-Side Pagination */}
        <section aria-labelledby="ambulance-directory-heading" className="space-y-4">
          <h2 id="ambulance-directory-heading" className="sr-only">
            ফেনী অ্যাম্বুলেন্স সেবা তালিকা ও ফিল্টার
          </h2>
          <AmbulanceDirectory
            ambulances={paginatedResult.ambulances}
            totalItems={paginatedResult.totalItems}
            totalPages={paginatedResult.totalPages}
            currentPage={paginatedResult.currentPage}
            pageSize={paginatedResult.pageSize}
            currentType={selectedType}
            currentSearch={searchQuery}
            counts={paginatedResult.counts}
          />
        </section>

        {/* Specialized Ambulance FAQ */}
        <EmergencyFAQ
          hotline={contactSettings.hotline}
          items={ambulanceFaqs}
          title="ফেনী অ্যাম্বুলেন্স সার্ভিস সম্পর্কিত সাধারণ প্রশ্ন"
          subtitle="আইসিইউ অ্যাম্বুলেন্স বুকিং, ঢাকা-চট্টগ্রাম রুট ভাড়া ও ফ্রিজিং অ্যাম্বুলেন্সের বিস্তারিত তথ্য।"
          badgeText="অ্যাম্বুলেন্স জিজ্ঞাসা (FAQ)"
        />

        {/* Community Network CTA */}
        <CommunityNetworkCTA hotline={contactSettings.hotline} />
      </div>
    </div>
  );
}
