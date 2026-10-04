import JsonLd from "@/components/seo/JsonLd";
import { BloodDonorDirectory } from "../components/BloodDonorDirectory";
import { EmergencyTabsNav } from "../components/EmergencyTabsNav";
import EmergencyFAQ, { FAQItem } from "@/components/emergency/EmergencyFAQ";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { Heart, ShieldCheck, PhoneCall, Droplets, UserCheck, HeartHandshake } from "lucide-react";
import { getEmergencyDataAction } from "@/app/actions/emergencyAdminActions";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { toBanglaNums } from "@/lib/utils";
import { UPAZILAS_FENI } from "@/data/emergencyData";
import {
  paginateBloodDonors,
  normalizeBloodGroup,
  DEFAULT_DONOR_PAGE_SIZE,
} from "../utils/bloodDonorPagination";

export const revalidate = false; // Pure static SSG on base page, on-demand revalidated on emergency updates

interface EmergencyBloodDonorsPageProps {
  searchParams?: Promise<{
    page?: string;
    group?: string;
    bloodGroup?: string;
    upazila?: string;
    search?: string;
  }>;
}

export async function generateMetadata({ searchParams }: EmergencyBloodDonorsPageProps) {
  const resolvedParams = (await searchParams) || {};
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10) || 1);
  const selectedGroup = normalizeBloodGroup(resolvedParams.bloodGroup || resolvedParams.group);
  const selectedUpazila = (resolvedParams.upazila || "all").trim();
  const searchQuery = (resolvedParams.search || "").trim();

  const upazilaObj = UPAZILAS_FENI.find((u) => u.id === selectedUpazila);
  const upazilaNameBn = upazilaObj && upazilaObj.id !== "all" ? ` ${upazilaObj.nameBn}` : "";
  const groupNameBn = selectedGroup !== "all" ? ` (${selectedGroup} রক্তের গ্রুপ)` : "";
  const pageSuffix = currentPage > 1 ? ` (পৃষ্ঠা ${toBanglaNums(currentPage)})` : "";

  const title = `ফেনী${upazilaNameBn} রক্তদাতা ডিরেক্টরি${groupNameBn}${pageSuffix} | হেলথ ক্লাব`;
  const description = `ফেনীর${upazilaNameBn} ভেরিফাইড স্বেচ্ছাসেবী রক্তদাতা ডিরেক্টরি${groupNameBn}: A+, B+, O+, AB+ সহ সকল গ্রুপের রক্তদাতাদের সরাসরি মোবাইল ও WhatsApp নম্বর${pageSuffix}।`;

  const queryParams = new URLSearchParams();
  if (currentPage > 1) queryParams.set("page", String(currentPage));
  if (selectedGroup !== "all") queryParams.set("group", selectedGroup);
  if (selectedUpazila !== "all") queryParams.set("upazila", selectedUpazila);

  const canonicalUrl = `${SITE_URL}/emergency/blood-donors${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      "feni blood donor",
      "blood donor in feni",
      "feni blood donors directory",
      "feni blood bank contact number",
      "feni blood bank",
      "o negative blood donor feni",
      "rare blood group feni",
      "ফেনী রক্তদাতা",
      "ফেনী ব্লাড ব্যাংক",
      "ফেনীর রক্তের গ্রুপ ডিরেক্টরি",
      "ফেনী রক্তদান সংগঠন",
      "রেড ক্রিসেন্ট রক্ত কেন্দ্র ফেনী",
      "ও নেগেটিভ রক্ত ফেনী",
      "ব্লাড ডোনার ফেনী",
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

export default async function EmergencyBloodDonorsPage({
  searchParams,
}: EmergencyBloodDonorsPageProps) {
  const resolvedParams = (await searchParams) || {};
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10) || 1);
  const selectedGroup = normalizeBloodGroup(resolvedParams.bloodGroup || resolvedParams.group);
  const selectedUpazila = (resolvedParams.upazila || "all").trim();
  const searchQuery = (resolvedParams.search || "").trim();

  const [{ bloodDonors }, contactSettings] = await Promise.all([
    getEmergencyDataAction(),
    getCachedContactSettings(),
  ]);

  const approvedDonors = bloodDonors.filter((d) => d.status !== "pending");

  const paginatedResult = paginateBloodDonors(approvedDonors, {
    page: currentPage,
    pageSize: DEFAULT_DONOR_PAGE_SIZE,
    group: selectedGroup,
    upazila: selectedUpazila,
    search: searchQuery,
  });

  const rawHotline = contactSettings.hotline.replace(/[^0-9]/g, "");
  const formattedTel = `+880${rawHotline.replace(/^(880|88|0)/, "")}`;

  const queryParams = new URLSearchParams();
  if (paginatedResult.currentPage > 1) {
    queryParams.set("page", String(paginatedResult.currentPage));
  }
  if (selectedGroup !== "all") queryParams.set("group", selectedGroup);
  if (selectedUpazila !== "all") queryParams.set("upazila", selectedUpazila);

  const pageCanonicalUrl = `${SITE_URL}/emergency/blood-donors${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const bloodDonorFaqs: FAQItem[] = [
    {
      question: "ফেনীতে জরুরি রক্তের প্রয়োজনে কীভাবে তাৎক্ষণিক রক্তদাতা পাবেন?",
      answer: "হেলথ ক্লাবের রক্তদাতা ডিরেক্টরিতে আপনার প্রয়োজনীয় রক্তের গ্রুপ (A+, B+, O+, AB- ইত্যাদি) ও উপজেলা সিলেক্ট করে সরাসরি কল অথবা হোয়াটসঅ্যাপ বাটনে চাপ দিয়ে ডোনারের সাথে যোগাযোগ করুন। এছাড়া রেড ক্রিসেন্ট ব্লাড সেন্টার ফেনীর হটলাইন 01819-887766-এ কল করতে পারেন।",
    },
    {
      question: "ফেনীতে নেগেটিভ রক্তের গ্রুপ (Rh-negative) সহজে কোথায় পাওয়া যায়?",
      answer: "নেগেটিভ গ্রুপের রক্ত বিরল হওয়ায় তাৎক্ষণিক রেড ক্রিসেন্ট ব্লাড সেন্টারে (01819-887766) খোঁজ নিন এবং হেলথ ক্লাবের ডিরেক্টরি থেকে O-, A-, B-, AB- ফিল্টার করে ফেনীর ভেরিফাইড নেগেটিভ রক্তদাতাদের সাথে যোগাযোগ করুন। এছাড়া জটিল অপারেশনের পূর্বেই রক্তের ব্যবস্থা রাখা উচিত।",
    },
    {
      question: "একজন সুস্থ ব্যক্তি কত দিন পর পর রক্ত দিতে পারেন?",
      answer: "১৮ থেকে ৬০ বছর বয়সী যেকোনো সুস্থ পুরুষ প্রতি ৩ মাস পর পর এবং নারী প্রতি ৪ মাস পর পর নিরাপদে রক্তদান করতে পারেন। রক্তদানের আগে ওজন ন্যূনতম ৪৫ কেজি এবং রক্তচাপ স্বাভাবিক থাকা আবশ্যক।",
    },
    {
      question: "হেলথ ক্লাবে স্বেচ্ছাসেবী রক্তদাতা হিসেবে নাম নিবন্ধন করতে কি কোনো ফি লাগে?",
      answer: "না, এটি সম্পূর্ণ মানবকল্যাণমূলক স্বেচ্ছাসেবী উদ্যোগ। যেকোনো রক্তদাতা 'রক্তদাতা হতে যুক্ত হোন' বাটনে ক্লিক করে বিনামূল্যে নিজের তথ্য নিবন্ধন করতে পারেন।",
    },
    {
      question: "রক্তদাতার সাথে যোগাযোগের সময় রোগীর স্বজনদের কী কী তথ্য জানানো প্রয়োজন?",
      answer: "রোগীর নাম, রোগ বা অপারেশনের ধরণ, হাসপাতালের নাম ও বেড নম্বর, প্রয়োজনীয় রক্তের গ্রুপের নাম, কয় ব্যাগ রক্ত লাগবে এবং কখন উপস্থিত হতে হবে তা রক্তদাতাকে স্পষ্টভাবে বুঝিয়ে বলুন।",
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
          name: "রক্তদাতা ডিরেক্টরি",
          item: pageCanonicalUrl,
        },
      ],
    },

    // 2. EmergencyService Schema
    {
      "@context": "https://schema.org",
      "@type": ["EmergencyService", "MedicalBusiness"],
      name: "ফেনী স্বেচ্ছাসেবী রক্তদাতা ডিরেক্টরি ও ব্লাড ডোনার নেটওয়ার্ক",
      url: pageCanonicalUrl,
      logo: `${SITE_URL}/images/member-card-logo.webp`,
      description: "ফেনীর সকল উপজেলার রক্তের গ্রুপ অনুযায়ী যাচাইকৃত রক্তদাতাদের সরাসরি মোবাইল ও হোয়াটসঅ্যাপ নম্বর ডিরেক্টরি।",
      areaServed: [
        "Feni Sadar",
        "Daganbhuiyan",
        "Chhagalnaiya",
        "Sonagazi",
        "Parshuram",
        "Fulgazi",
      ],
      telephone: formattedTel,
      priceRange: "Free / Voluntary Public Service",
      openingHours: "Mo-Su 00:00-23:59",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#donor-summary", "#donor-bluf", "#emergency-faq-heading"],
      },
    },

    // 3. FAQPage Schema for Voice & AEO
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: bloodDonorFaqs.map((faq) => ({
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
      <header className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-rose-500/5 via-background to-background py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-bold border border-rose-500/20 shadow-2xs">
            <Heart className="h-3.5 w-3.5 fill-rose-600/30 text-rose-600 animate-pulse" />
            <span>ফেনী স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            ফেনী <span className="text-rose-600 dark:text-rose-500">রক্তদাতা ডিরেক্টরি</span> ও ব্লাড ডোনার সার্চ
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            মুহূর্তেই রক্তের গ্রুপ অনুযায়ী ফেনীর ৬টি উপজেলার যাচাইকৃত রক্তদাতাদের সাথে সরাসরি ফোন বা হোয়াটসঅ্যাপে যোগাযোগ করুন।
          </p>

          {/* Direct Answer Capsule (BLUF) */}
          <div
            id="donor-bluf"
            className="mx-auto max-w-3xl p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-left space-y-2 shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>জরুরি তথ্য (Quick Answer):</span>
            </div>
            <p id="donor-summary" className="text-xs sm:text-sm text-foreground leading-relaxed font-medium">
              ফেনীতে জরুরি রক্তের প্রয়োজনে হেলথ ক্লাবের রক্তদাতা ডিরেক্টরিতে রক্তের গ্রুপ (<strong>A+, B+, O+, AB-</strong> ইত্যাদি) ও উপজেলা সিলেক্ট করে সরাসরি ভেরিফাইড ডোনারের মোবাইল ও হোয়াটসঅ্যাপে যোগাযোগ করা যায়। এছাড়া হাসপাতাল রোডে রেড ক্রিসেন্ট ব্লাড সেন্টার ফেনীর হটলাইন <strong>০১৮১৯-৮৮৭৭৬৬</strong> নম্বরে সার্বক্ষণিক যোগাযোগ করা সম্ভব।
            </p>
          </div>

          {/* Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Droplets className="h-3.5 w-3.5 text-rose-600" />
              ৮টি রক্তের গ্রুপ
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              যাচাইকৃত স্বেচ্ছাসেবী
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <HeartHandshake className="h-3.5 w-3.5 text-amber-600" />
              সম্পূর্ণ বিনামূল্যে সেবা
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              দালালমুক্ত সরাসরি যোগাযোগ
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
        {/* Navigation Tabs */}
        <EmergencyTabsNav activeTab="donors" />

        {/* Blood Donors Directory with Server-Side Pagination */}
        <section aria-labelledby="blood-donors-directory-heading" className="space-y-4">
          <h2 id="blood-donors-directory-heading" className="sr-only">
            ফেনী রক্তদাতা তালিকা ও রক্তের গ্রুপ ফিল্টার
          </h2>
          <BloodDonorDirectory
            donors={paginatedResult.donors}
            totalItems={paginatedResult.totalItems}
            totalPages={paginatedResult.totalPages}
            currentPage={paginatedResult.currentPage}
            pageSize={paginatedResult.pageSize}
            currentGroup={selectedGroup}
            currentUpazila={selectedUpazila}
            currentSearch={searchQuery}
          />
        </section>

        {/* Specialized Blood Donor FAQ */}
        <EmergencyFAQ
          hotline={contactSettings.hotline}
          items={bloodDonorFaqs}
          title="ফেনী রক্তদান ও রক্তদাতা ডিরেক্টরি সম্পর্কিত সাধারণ প্রশ্ন"
          subtitle="রক্তদানের যোগ্যতা, নেগেটিভ রক্তের গ্রুপ সংগ্রহ ও স্বেচ্ছাসেবী নিবন্ধনের নিয়মাবলি।"
          badgeText="রক্তদান জিজ্ঞাসা (FAQ)"
        />

        {/* Community Network CTA */}
        <CommunityNetworkCTA hotline={contactSettings.hotline} />
      </div>
    </div>
  );
}
