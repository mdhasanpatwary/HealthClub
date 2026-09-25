import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getHomepageStats, getHomepagePartners } from "@/lib/homepageData";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import type { Member } from "@/services/db";
import JsonLd from "@/components/seo/JsonLd";
import { getHomepageJsonLd } from "@/lib/seo/homepageSchema";
import FAQSection from "@/components/landing/FAQSection";
import {
  LazyPartnerDirectorySection,
  LazySavingsCalculatorSection,
  LazyTestimonialsSection,
  LazyContactFormSection,
} from "@/components/landing/LazyLandingComponents";

import { LandingHero } from "@/components/landing/LandingHero";
import { LandingStats } from "@/components/landing/LandingStats";
import { LandingQuickServices } from "@/components/landing/LandingQuickServices";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingBenefits } from "@/components/landing/LandingBenefits";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingComparison } from "@/components/landing/LandingComparison";
import { LandingBlogSection } from "@/components/landing/LandingBlogSection";
import { getAllBlogPostsAction } from "@/app/actions/blogAdminActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export const revalidate = 86400; // 24-hour Incremental Static Regeneration (ISR)

export async function generateMetadata() {
  const ogTitle = "হেলথ ক্লাব - চিকিৎসা ব্যয়ে ৩০% পর্যন্ত ডিসকাউন্ট পান";
  const ogDescription = "নির্ধারিত হাসপাতাল ও ল্যাবে ডিসকাউন্ট কার্ড এবং ফেনীর বিশেষজ্ঞ ডাক্তার, রক্তদাতা ও অ্যাম্বুলেন্সের ২৪/৭ জরুরি তথ্য সেবা।";

  return {
    title: { absolute: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী | ডিজিটাল স্বাস্থ্য মেম্বারশিপ" },
    description: "হেলথ ক্লাবের ডিজিটাল মেম্বারশিপ কার্ড দিয়ে পার্টনার হাসপাতাল, ডায়াগনস্টিক ল্যাব ও মডেল ফার্মেসিতে পান আকর্ষণীয় ডিসকাউন্ট ও সাশ্রয়ী চিকিৎসা।",
    alternates: {
      canonical: SITE_URL,
    },
    keywords: [
      "feni doctor",
      "feni doctors info",
      "feni doctor list",
      "feni specialist doctor chamber",
      "feni doctor appointment serial",
      "feni hospital list",
      "feni hospital",
      "feni ambulance service",
      "feni ambulance number",
      "feni emergency ambulance 24/7",
      "icu ambulance feni",
      "feni blood donor",
      "feni blood donor contact number",
      "feni blood bank directory",
      "feni oxygen cylinder home delivery",
      "feni diagnostic center",
      "feni pharmacy",
      "feni medicine discount",
      "feni pathology test discount",
      "Health Club Feni",
      "হেলথ ক্লাব ফেনী",
      "ফেনী ডাক্তার",
      "ফেনী ডাক্তারদের তথ্য",
      "ফেনী বিশেষজ্ঞ ডাক্তার চেম্বার",
      "ফেনী ডাক্তার সিরিয়াল নম্বর",
      "ফেনী হাসপাতাল তালিকা",
      "ফেনী হাসপাতাল",
      "ফেনী এ্যাম্বুলেন্স সার্ভিস",
      "ফেনী জরুরি অ্যাম্বুলেন্স নম্বর",
      "ফেনী আইসিইউ অ্যাম্বুলেন্স",
      "ফেনী রক্তদাতা",
      "ফেনী ব্লাড ডোনার নম্বর",
      "ফেনী অক্সিজেন সিলিন্ডার সেবা",
      "ফেনী সদর হাসপাতাল জরুরি বিভাগ",
      "ফেনী ডায়াগনস্টিক সেন্টার",
      "ফেনী ফার্মেসি",
      "ফেনী ল্যাব টেস্ট",
      "স্বাস্থ্য কার্ড",
      "মেডিকেল ডিসকাউন্ট কার্ড",
    ],
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: SITE_URL,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default async function Home() {

  // Single cached query for all homepage stats & settings (60s cache)
  const [stats, homepagePartners, contactSettings] = await Promise.all([
    getHomepageStats(),
    getHomepagePartners(3),
    getCachedContactSettings(),
  ]);
  const {
    memberCount,
    foundingCount,
    hospitalCount,
    diagnosticCount,
    pharmacyCount,
    doctorCount,
    bloodDonorCount,
    ambulanceCount,
  } = stats;

  const remainingSeats = Math.max(0, 100 - (foundingCount ?? memberCount));
  const blogPosts = await getAllBlogPostsAction();

  // Sample member data for the digital card visual in Hero
  const sampleMember: Member = {
    id: "HC-2026-F982A",
    name: "মোঃ আশরাফুল আলম",
    phone: "01712345678",
    email: "ashraful@example.com",
    tier: "founding",
    status: "active",
    joinedDate: "2026-01-15",
    expiryDate: "2027-01-15",
    totalSaved: 10500,
    address: "মহিপাল, ফেনী",
  };

  const homepageJsonLd = getHomepageJsonLd({
    hotline: contactSettings?.hotline,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={homepageJsonLd} />

      {/* 1. HERO SECTION */}
      <LandingHero
        sampleMember={sampleMember}
      />

      {/* 2. STATS SECTION */}
      <LandingStats
        remainingSeats={remainingSeats}
        hospitalCount={hospitalCount}
        diagnosticCount={diagnosticCount}
        pharmacyCount={pharmacyCount}
      />

      {/* 2.5 EMERGENCY & HEALTHCARE SERVICES HUB */}
      <LandingQuickServices
        doctorCount={doctorCount}
        bloodDonorCount={bloodDonorCount}
        ambulanceCount={ambulanceCount}
      />

      {/* 3. HOW IT WORKS SECTION */}
      <div className="content-auto">
        <LandingHowItWorks />
      </div>

      {/* 4. MEMBERSHIP BENEFITS SECTION */}
      <div className="content-auto">
        <LandingBenefits />
      </div>

      {/* 5. PRICING PLANS SECTION */}
      <div className="content-auto">
        <LandingPricing />
      </div>

      {/* 6. PARTNER DIRECTORY PREVIEW */}
      <section className="content-auto py-10 sm:py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2 sm:space-y-3 text-center md:text-left">
              <span className="section-label">অংশীদার চিকিৎসাকেন্দ্র</span>
              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-1">
                আমাদের পার্টনার হাসপাতাল ও ডায়াগনস্টিকসমূহ
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                হেলথ ক্লাবের সাথে চুক্তিবদ্ধ দেশের শীর্ষস্থানীয় হাসপাতাল ও ল্যাবগুলোতে বিশেষ ছাড়ের সুবিধা পান।
              </p>
            </div>
            <Link
              href="/partner-hospitals"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-emerald-600/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shrink-0 self-center md:self-end"
              )}
            >
              সকল পার্টনার ও ডিটেইলস দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <LazyPartnerDirectorySection partners={homepagePartners} />
        </div>
      </section>

      {/* 7. SAVINGS CALCULATOR SECTION */}
      <section className="content-auto py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LazySavingsCalculatorSection />
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="content-auto py-10 sm:py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-8">
          <div className="text-center space-y-2 sm:space-y-3 max-w-xl mx-auto">
            <span className="section-label">মেম্বারদের অভিজ্ঞতা</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
              আমাদের সদস্যদের বাস্তব সঞ্চয়ের গল্প
            </h2>
          </div>

          <LazyTestimonialsSection />
        </div>
      </section>

      {/* 9. WHY CHOOSE - COMPARISON TABLE */}
      <div className="content-auto">
        <LandingComparison />
      </div>

      {/* CTA BANNER */}
      <section className="content-auto py-10 sm:py-20 bg-gradient-to-r from-primary via-emerald-500 to-primary dark:from-primary-dark dark:via-emerald-600 dark:to-primary-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6">
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            আজই হেলথ ক্লাবের সদস্য হন
          </h2>
          <p className="text-sm sm:text-lg text-white/85 max-w-xl mx-auto">
            বিনামূল্যে সদস্যতা নিন এবং নির্ধারিত হাসপাতাল ও ডায়াগনস্টিক সেন্টারে ১০-৩০% ছাড় উপভোগ করুন।
          </p>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-white text-primary hover:bg-white/90 px-8 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            )}
          >
            বিনামূল্যে যোগ দিন
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 9.5 HEALTHCARE BLOG & HOSPITAL GUIDES */}
      <div className="content-auto">
        <LandingBlogSection posts={blogPosts} />
      </div>

      {/* 10. FAQ SECTION */}
      <section id="faq" className="content-auto py-10 sm:py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
          <div className="text-center space-y-2 sm:space-y-3 max-w-xl mx-auto">
            <span className="section-label">প্রশ্ন ও উত্তর</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
              সাধারণ জিজ্ঞাসা (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              হেলথ ক্লাব মেম্বারশিপ সার্ভিস নিয়ে সচরাচর জানতে চাওয়া প্রশ্নগুলোর উত্তর নিচে খুঁজে পাবেন।
            </p>
          </div>

          <FAQSection />
        </div>
      </section>

      {/* 11. CONTACT SECTION */}
      <section className="content-auto py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
          <div className="text-center space-y-2 sm:space-y-3 max-w-xl mx-auto">
            <span className="section-label">যোগাযোগ করুন</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
              আপনার যেকোনো জিজ্ঞাসা জানাতে পারেন
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              মেম্বারশিপ সুবিধা বুঝতে অসুবিধা হচ্ছে অথবা আপনি কি পার্টনার হতে চান? আমাদের মেসেজ পাঠান।
            </p>
          </div>

          <LazyContactFormSection initialSettings={contactSettings} />
        </div>
      </section>

    </div>
  );
}