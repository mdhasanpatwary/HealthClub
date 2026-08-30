import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PartnerDirectory from "@/components/ui/PartnerDirectory";
import { getHomepageStats, getHomepagePartners } from "@/lib/homepageData";
import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";
import type { Member } from "@/services/db";
import JsonLd from "@/components/seo/JsonLd";
import dynamic from "next/dynamic";
import {
  SavingsCalculatorSkeleton,
  TestimonialSkeleton,
  FAQSkeleton,
  ContactFormSkeleton,
} from "@/components/ui/skeleton";

const SavingsCalculator = dynamic(() => import("@/components/ui/SavingsCalculator"), {
  loading: () => <SavingsCalculatorSkeleton />,
});
const TestimonialCarousel = dynamic(() => import("@/components/ui/TestimonialCarousel"), {
  loading: () => <TestimonialSkeleton />,
});
const FAQSection = dynamic(() => import("@/components/landing/FAQSection"), {
  loading: () => <FAQSkeleton />,
});
const ContactForm = dynamic(() => import("@/components/landing/ContactForm"), {
  loading: () => <ContactFormSkeleton />,
});

import { LandingHero } from "@/components/landing/LandingHero";
import { LandingStats } from "@/components/landing/LandingStats";
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
    ? "Join Health Club to get digital discount card for hospitals, labs, and medicines."
    : "নির্ধারিত হাসপাতাল ও ল্যাবে ডিসকাউন্ট পেতে আজই হেলথ ক্লাবের মেম্বারশিপ সংগ্রহ করুন।";

  return {
    title: isEn
      ? "Health Club - Healthcare Discount Membership Platform in Bangladesh"
      : "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী | ডিজিটাল স্বাস্থ্য মেম্বারশিপ",
    description: isEn
      ? "Get instant discounts up to 30% on hospital admission, medical tests, labs, and pharmacies with Health Club digital membership card in Feni and Bangladesh."
      : "হেলথ ক্লাবের ডিজিটাল মেম্বারশিপ কার্ড দিয়ে পার্টনার হাসপাতাল, ডায়াগনস্টিক ল্যাব ও মডেল ফার্মেসিতে পান আকর্ষণীয় ডিসকাউন্ট ও সাশ্রয়ী চিকিৎসা।",
    alternates: {
      canonical: SITE_URL,
    },
    keywords: [
      "feni doctor",
      "feni doctors info",
      "feni doctor list",
      "feni hospital list",
      "feni hospital",
      "feni ambulance service",
      "feni ambulance",
      "feni blood donor",
      "feni diagnostic center",
      "feni pharmacy",
      "feni medicine discount",
      "feni pathology test discount",
      "Health Club Feni",
      "হেলথ ক্লাব ফেনী",
      "ফেনী ডাক্তার",
      "ফেনী ডাক্তারদের তথ্য",
      "ফেনী হাসপাতাল তালিকা",
      "ফেনী হাসপাতাল",
      "ফেনী এ্যাম্বুলেন্স সার্ভিস",
      "ফেনী রক্তদাতা",
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
  const t = (key: string) => tServer(locale, key);

  // Single cached query for all homepage stats (4 counts → 1 SQL, 60s cache)
  const [stats, homepagePartners] = await Promise.all([
    getHomepageStats(),
    getHomepagePartners(3),
  ]);
  const { memberCount, foundingCount, hospitalCount, diagnosticCount, pharmacyCount } = stats;

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

  // Structured FAQ JSON-LD for AEO / Answer Engine snippet optimization
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t("faq.q1"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.a1")
        }
      },
      {
        "@type": "Question",
        "name": t("faq.q2"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.a2")
        }
      },
      {
        "@type": "Question",
        "name": t("faq.q3"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.a3")
        }
      },
      {
        "@type": "Question",
        "name": t("faq.q4"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.a4")
        }
      },
      {
        "@type": "Question",
        "name": t("faq.q5"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.a5")
        }
      },
      {
        "@type": "Question",
        "name": t("faq.q6"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t("faq.a6")
        }
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={faqJsonLd} />

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

      {/* 3. HOW IT WORKS SECTION */}
      <LandingHowItWorks t={t} />

      {/* 4. MEMBERSHIP BENEFITS SECTION */}
      <LandingBenefits t={t} />

      {/* 5. PRICING PLANS SECTION */}
      <LandingPricing t={t} />

      {/* 6. PARTNER DIRECTORY PREVIEW */}
      <section className="py-10 sm:py-20 lg:py-28 bg-background">
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

          <PartnerDirectory partners={homepagePartners} limit={3} showFilters={false} />
        </div>
      </section>

      {/* 6.5 DOCTORS & CONSULTANTS DIRECTORY SPOTLIGHT */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-emerald-950/20 via-primary/5 to-slate-900/10 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-card border border-primary/20 shadow-md">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <Stethoscope className="h-3.5 w-3.5" />
                <span>{locale === "en" ? "Doctor & Serial Helpline" : "ডাক্তার ও সিরিয়াল হেল্পলাইন"}</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-secondary dark:text-white">
                {locale === "en"
                  ? "Looking for Specialist Doctors in Feni?"
                  : "ফেনীর বিশেষজ্ঞ ডাক্তার ও চেম্বার শিডিউল খুঁজছেন?"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                {locale === "en"
                  ? "Find qualified specialist doctors across all departments, check visiting hours at partner hospitals, and get direct appointment serial numbers."
                  : "পার্টনার হাসপাতাল ও শীর্ষ ডায়াগনস্টিক সেন্টারের সকল বিভাগের বিশেষজ্ঞ চিকিৎসকদের তালিকা দেখুন ও সরাসরি সিরিয়াল বুক করুন।"}
              </p>
            </div>
            <Link
              href="/consultants"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-primary hover:bg-primary-dark text-white rounded-2xl shadow-sm px-6 font-semibold shrink-0"
              )}
            >
              {locale === "en" ? "Browse Doctor Directory" : "ডাক্তারদের তালিকা দেখুন"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. SAVINGS CALCULATOR SECTION */}
      <section className="py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SavingsCalculator />
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="py-10 sm:py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-8">
          <div className="text-center space-y-2 sm:space-y-3 max-w-xl mx-auto">
            <span className="section-label">{t("page.memberTestimonials")}</span>
            <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
              {t("page.ourMembersRealSavingsStories")}
            </h2>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* 9. WHY CHOOSE - COMPARISON TABLE */}
      <LandingComparison t={t} />

      {/* CTA BANNER */}
      <section className="py-10 sm:py-20 bg-gradient-to-r from-primary via-emerald-500 to-primary dark:from-primary-dark dark:via-emerald-600 dark:to-primary-dark relative overflow-hidden">
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
      <section id="faq" className="py-10 sm:py-20 lg:py-28 bg-background">
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

          <FAQSection />
        </div>
      </section>

      {/* 11. CONTACT SECTION */}
      <section className="py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-t border-border/60">
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

          <ContactForm />
        </div>
      </section>

    </div>
  );
}