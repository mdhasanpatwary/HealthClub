import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PartnerDirectory from "@/components/ui/PartnerDirectory";
import SavingsCalculator from "@/components/ui/SavingsCalculator";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import FAQSection from "@/components/landing/FAQSection";
import ContactForm from "@/components/landing/ContactForm";
import { getHomepageStats, getHomepagePartners } from "@/lib/homepageData";
import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";
import type { Member } from "@/services/db";

import { LandingHero } from "@/components/landing/LandingHero";
import { LandingStats } from "@/components/landing/LandingStats";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingBenefits } from "@/components/landing/LandingBenefits";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingComparison } from "@/components/landing/LandingComparison";

export default async function Home() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const t = (key: string) => tServer(locale, key);

  // Single cached query for all homepage stats (4 counts → 1 SQL, 60s cache)
  const [stats, homepagePartners] = await Promise.all([
    getHomepageStats(),
    getHomepagePartners(3),
  ]);
  const { memberCount, hospitalCount, pharmacyCount } = stats;

  const remainingSeats = Math.max(0, 100 - memberCount);

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

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. HERO SECTION */}
      <LandingHero
        remainingSeats={remainingSeats}
        sampleMember={sampleMember}
        t={t}
        locale={locale}
      />

      {/* 2. STATS SECTION */}
      <LandingStats
        remainingSeats={remainingSeats}
        hospitalCount={hospitalCount}
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
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-3 text-center md:text-left">
              <span className="section-label">{t("page.partnerClinicsLabs")}</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
                {t("page.ourPartnerHospitalsDiagnostics")}
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                {t("page.getSpecialDiscountsAtTop")}
              </p>
            </div>
            <Link href="/partner-hospitals" className="shrink-0 self-center md:self-end">
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/5">
                {t("page.viewAllPartnersDetails")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <PartnerDirectory partners={homepagePartners} limit={3} showFilters={false} />
        </div>
      </section>

      {/* 7. SAVINGS CALCULATOR SECTION */}
      <section className="py-20 sm:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SavingsCalculator />
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="section-label">{t("page.memberTestimonials")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white mt-3">
              {t("page.ourMembersRealSavingsStories")}
            </h2>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* 9. WHY CHOOSE - COMPARISON TABLE */}
      <LandingComparison t={t} />

      {/* CTA BANNER */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary via-emerald-500 to-primary dark:from-primary-dark dark:via-emerald-600 dark:to-primary-dark animate-gradient relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {t("page.cta.title")}
          </h2>
          <p className="text-base sm:text-lg text-white/85 max-w-xl mx-auto">
            {t("page.cta.description")}
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-8 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              {t("page.cta.button")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="section-label">{t("page.questionsAnswers")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white mt-3">
              {t("page.frequentlyAskedQuestionsFaq")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("page.findTheAnswersToFrequently")}
            </p>
          </div>

          <FAQSection />
        </div>
      </section>

      {/* 11. CONTACT SECTION */}
      <section className="py-20 sm:py-28 bg-muted/40 dark:bg-slate-950/60 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="section-label">{t("page.contactUs")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white mt-3">
              {t("page.letUsKnowAnyQueries")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("page.havingTroubleUnderstandingMembershipBenefits")}
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

    </div>
  );
}