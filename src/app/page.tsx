import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getHomepageStats, getHomepagePartners } from "@/lib/homepageData";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import { tServer } from "@/lib/i18n.server";
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
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const ogTitle = isEn
    ? "Health Club - Save Up to 30% on Healthcare & Hospital Bills"
    : "হেলথ ক্লাব - চিকিৎসা ব্যয়ে ৩০% পর্যন্ত ডিসকাউন্ট পান";

  const ogDescription = isEn
    ? "Join Health Club to get digital discount cards for hospitals, labs, pharmacies, and 24/7 directory of doctors, blood donors, and ambulances in Feni."
    : "নির্ধারিত হাসপাতাল ও ল্যাবে ডিসকাউন্ট কার্ড এবং ফেনীর বিশেষজ্ঞ ডাক্তার, রক্তদাতা ও অ্যাম্বুলেন্সের ২৪/৭ জরুরি তথ্য সেবা।";

  return {
    title: isEn
      ? "Health Club - Healthcare Discount Membership Platform in Bangladesh"
      : "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী | ডিজিটাল স্বাস্থ্য মেম্বারশিপ",
    description: isEn
      ? "Get instant discounts up to 30% on hospital admission, medical tests, labs, and pharmacies with Health Club digital membership card in Feni and Bangladesh."
      : "হেলথ ক্লাবের ডিজিটাল মেম্বারশিপ কার্ড দিয়ে পার্টনার হাসপাতাল, ডায়াগনস্টিক ল্যাব ও মডেল ফার্মেসিতে পান আকর্ষণীয় ডিসকাউন্ট ও সাশ্রয়ী চিকিৎসা।",
    alternates: {
      canonical: SITE_URL,
      languages: {
        "bn-BD": SITE_URL,
        "en-US": SITE_URL,
      },
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
      locale: isEn ? "en_US" : "bn_BD",
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
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";
  const t = (key: string) => tServer(locale, key);

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

  // Sample member data for the digital card visual in Hero
  const sampleMember: Member = {
    id: "HC-2026-F982A",
    name: locale === "en" ? "Md. Ashraful Alam" : "মোঃ আশরাফুল আলম",
    phone: "01712345678",
    email: "ashraful@example.com",
    tier: "founding",
    status: "active",
    joinedDate: "2026-01-15",
    expiryDate: "2027-01-15",
    totalSaved: 10500,
    address: locale === "en" ? "Mohipal, Feni" : "মহিপাল, ফেনী",
  };

  const homepageJsonLd = getHomepageJsonLd({
    isEn,
    t,
    hotline: contactSettings?.hotline,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={homepageJsonLd} />

      {/* 1. HERO SECTION */}
      <LandingHero
        sampleMember={sampleMember}
        t={t}
      />

      {/* 2. STATS SECTION */}
      <LandingStats
        remainingSeats={remainingSeats}
        hospitalCount={hospitalCount}
        diagnosticCount={diagnosticCount}
        pharmacyCount={pharmacyCount}
        t={t}
        locale={locale}
      />

      {/* 2.5 EMERGENCY & HEALTHCARE SERVICES HUB */}
      <LandingQuickServices
        doctorCount={doctorCount}
        bloodDonorCount={bloodDonorCount}
        ambulanceCount={ambulanceCount}
        t={t}
        locale={locale}
      />

      {/* 3. HOW IT WORKS SECTION */}
      <div className="content-auto">
        <LandingHowItWorks t={t} />
      </div>

      {/* 4. MEMBERSHIP BENEFITS SECTION */}
      <div className="content-auto">
        <LandingBenefits t={t} />
      </div>

      {/* 5. PRICING PLANS SECTION */}
      <div className="content-auto">
        <LandingPricing t={t} />
      </div>

      {/* 6. PARTNER DIRECTORY PREVIEW */}
      <section className="content-auto py-10 sm:py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2 sm:space-y-3 text-center md:text-left">
              <span className="section-label">{t("page.partnerClinicsLabs")}</span>
              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-1">
                {t("page.ourPartnerHospitalsDiagnostics")}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                {t("page.getSpecialDiscountsAtTop")}
              </p>
            </div>
            <Link
              href="/partner-hospitals"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-primary/40 text-primary hover:bg-primary/5 shrink-0 self-center md:self-end"
              )}
            >
              {t("page.viewAllPartnersDetails")}
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
            <span className="section-label">{t("page.memberTestimonials")}</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
              {t("page.ourMembersRealSavingsStories")}
            </h2>
          </div>

          <LazyTestimonialsSection />
        </div>
      </section>

      {/* 9. WHY CHOOSE - COMPARISON TABLE */}
      <div className="content-auto">
        <LandingComparison t={t} />
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
            {t("page.cta.title")}
          </h2>
          <p className="text-sm sm:text-lg text-white/85 max-w-xl mx-auto">
            {t("page.cta.description")}
          </p>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-white text-primary hover:bg-white/90 px-8 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            )}
          >
            {t("page.cta.button")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section id="faq" className="content-auto py-10 sm:py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
          <div className="text-center space-y-2 sm:space-y-3 max-w-xl mx-auto">
            <span className="section-label">{t("page.questionsAnswers")}</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
              {t("page.frequentlyAskedQuestionsFaq")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("page.findTheAnswersToFrequently")}
            </p>
          </div>

          <FAQSection t={t} />
        </div>
      </section>

      {/* 11. CONTACT SECTION */}
      <section className="content-auto py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
          <div className="text-center space-y-2 sm:space-y-3 max-w-xl mx-auto">
            <span className="section-label">{t("page.contactUs")}</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
              {t("page.letUsKnowAnyQueries")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("page.havingTroubleUnderstandingMembershipBenefits")}
            </p>
          </div>

          <LazyContactFormSection initialSettings={contactSettings} />
        </div>
      </section>

    </div>
  );
}