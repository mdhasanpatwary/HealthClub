import { cookies } from "next/headers";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { HealthTipsDirectory } from "./components/HealthTipsDirectory";
import { HealthTipsQuickMatrix } from "./components/HealthTipsQuickMatrix";
import { HealthTipsFAQ } from "./components/HealthTipsFAQ";
import { HEALTH_TIPS_FAQS } from "@/data/health-tips/healthTipsFaqs";
import { MedicalDisclaimer } from "./components/MedicalDisclaimer";
import { BookOpen, Stethoscope, ArrowRight, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getAllHealthTipsAction } from "@/app/actions/healthTipsAdminActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const ogTitle = isEn
    ? "Doctor-Verified Health Tips & Disease Prevention Guides | Health Club"
    : "ডাক্তারদের পরামর্শ ও স্বাস্থ্য গাইড | হেলথ ক্লাব";
  const ogDesc = isEn
    ? "Actionable medical advice, nutrition recommendations, and emergency first-aid protocols."
    : "নিয়মিত স্বাস্থ্য সচেতনতা, খাদ্যতালিকা ও বিভিন্ন রোগ প্রতিরোধের কার্যকরী চিকিৎসকের পরামর্শ।";

  return {
    title: isEn
      ? "Health Tips, Disease Prevention & Medical Guides - Health Club"
      : "স্বাস্থ্য টিপস, রোগ প্রতিরোধ ও মেডিকেল গাইড - হেলথ ক্লাব",
    description: isEn
      ? "Verified medical guides, diet charts for diabetes & hypertension, emergency stroke & cardiac symptoms, child immunity, and seasonal illness prevention by registered doctors."
      : "অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকদের পরামর্শ, ডায়াবেটিস ও উচ্চ রক্তচাপ নিয়ন্ত্রণ, ডেঙ্গু ও হিটস্ট্রোক প্রতিরোধ, হার্ট অ্যাটাক ও স্ট্রোকের লক্ষণ, পুষ্টিকর খাদ্যতালিকা ও স্বাস্থ্যকর জীবনযাপনের নির্ভরযোগ্য গাইড।",
    alternates: {
      canonical: `${SITE_URL}/health-tips`,
      languages: {
        "bn-BD": `${SITE_URL}/health-tips`,
        "en-US": `${SITE_URL}/health-tips`,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE_URL}/health-tips`,
      siteName: "হেলথ ক্লাব (Health Club)",
      locale: isEn ? "en_US" : "bn_BD",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: DEFAULT_TWITTER_IMAGES,
    },
    keywords: [
      "Health tips bangla",
      "স্বাস্থ্য টিপস",
      "ডায়াবেটিস নিয়ন্ত্রণ ও ডায়েট চার্ট",
      "উচ্চ রক্তচাপ কমানোর উপায়",
      "হার্ট অ্যাটাকের লক্ষণ ও ফার্স্ট এইড",
      "ডেঙ্গু জ্বর প্লাটিলেট চিকিৎসা",
      "স্ট্রোকের লক্ষণ FAST",
      "কিডনি ভালো রাখার নিয়ম",
      "ফ্যাটি লিভার দূর করার উপায়",
      "শিশুর রোগ প্রতিরোধ ক্ষমতা",
      "গ্যাস্ট্রিক ও এসিডিটি স্থায়ী সমাধান",
      "গর্ভকালীন যত্ন ও পুষ্টি",
      "থাইরয়েড হরমোন লক্ষণ",
      "হিটস্ট্রোক ফার্স্ট এইড",
      "Feni specialist doctors health guides",
      "Health Club medical blog",
    ],
  };
}

export default async function HealthTipsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const articles = await getAllHealthTipsAction();

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": isEn ? "Home" : "হোম",
          "item": SITE_URL,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": isEn ? "Health Tips" : "স্বাস্থ্য টিপস",
          "item": `${SITE_URL}/health-tips`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": isEn ? "Health Club Medical Guides & Disease Prevention Tips" : "হেলথ ক্লাব স্বাস্থ্য টিপস ও রোগ প্রতিরোধ নির্দেশিকা",
      "url": `${SITE_URL}/health-tips`,
      "description": isEn
        ? "Doctor-verified health advice, emergency symptom recognition, chronic disease management, and nutrition guidelines."
        : "রেজিস্টার্ড চিকিৎসকদের দ্বারা যাচাইকৃত স্বাস্থ্য টিপস, জরুরি প্রাথমিক চিকিৎসা ও রোগ প্রতিরোধ গাইড।",
      "about": [
        { "@type": "MedicalCondition", "name": "Dengue Fever" },
        { "@type": "MedicalCondition", "name": "Diabetes Mellitus" },
        { "@type": "MedicalCondition", "name": "Hypertension" },
        { "@type": "MedicalCondition", "name": "Myocardial Infarction" },
        { "@type": "MedicalCondition", "name": "Stroke" },
        { "@type": "MedicalCondition", "name": "Fatty Liver Disease" },
      ],
      "publisher": {
        "@type": "Organization",
        "name": "Health Club",
        "url": SITE_URL,
        "logo": `${SITE_URL}/icon.png`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": HEALTH_TIPS_FAQS.map((faq) => ({
        "@type": "Question",
        "name": isEn ? faq.questionEn : faq.questionBn,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": isEn ? faq.answerEn : faq.answerBn,
        },
      })),
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-16">
      <JsonLd data={jsonLdData} />

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-emerald-500/5 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-10 sm:py-16 border-b border-border/60">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{isEn ? "Doctor Verified Medical Knowledge Base" : "অভিজ্ঞ চিকিৎসকদের যাচাইকৃত স্বাস্থ্য গাইড"}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold text-secondary dark:text-white tracking-tight leading-tight">
            {isEn ? "Health Tips & Medical Care Guide" : "স্বাস্থ্য টিপস ও সুস্থ জীবনের নির্ভরযোগ্য গাইড"}
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Comprehensive medical articles, disease prevention protocols, dietary recommendations, and emergency first aid verified by registered doctors."
              : "নিয়মিত স্বাস্থ্য সচেতনতা, বিভিন্ন ক্রনিক রোগের প্রতিরোধ, ডায়েট চার্ট ও জরুরি ফার্স্ট এইড সম্পর্কে জেনে পরিবারসহ আজীবন সুস্থ থাকুন।"}
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Quick Emergency & Symptom Decision Matrix */}
        <HealthTipsQuickMatrix />

        {/* Directory & All Articles */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary dark:text-white">
              {isEn ? "All Health Guides & Articles" : "সকল স্বাস্থ্য আর্টিকেল ও গাইডসমূহ"}
            </h2>
          </div>
          <HealthTipsDirectory initialArticles={articles} />
        </div>

        {/* AEO / Voice Search Direct Answers FAQ Section */}
        <HealthTipsFAQ />

        {/* Doctor Consultation CTA Card */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-500/15 via-primary/10 to-transparent border border-primary/25 p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-secondary dark:text-white">
                {isEn ? "Need In-Person Specialist Doctor Advice?" : "বিশেষজ্ঞ ডাক্তারের পরামর্শ প্রয়োজন?"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                {isEn
                  ? "Explore chamber schedules of leading specialist consultants in Feni and get exclusive discounts on consultations and lab tests."
                  : "ফেনীর সেরা স্পেশালিস্ট ডাক্তারদের চেম্বার শিডিউল দেখুন এবং হেলথ ক্লাব মেম্বারশিপ কার্ডে ডাক্তার ভিজিট ও প্যাথলজি টেস্টে আকর্ষণীয় ছাড় পান।"}
              </p>
            </div>
          </div>
          <Link
            href="/consultants"
            className={buttonVariants({
              className: "shrink-0 w-full sm:w-auto font-bold h-11 px-6 rounded-xl cursor-pointer",
            })}
          >
            <span>{isEn ? "Find Specialist Doctors" : "ডাক্তারদের তালিকা দেখুন"}</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Medical E-E-A-T Disclaimer */}
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
