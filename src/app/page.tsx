import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import PartnerDirectory from "@/components/ui/PartnerDirectory";
import SavingsCalculator from "@/components/ui/SavingsCalculator";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import FAQSection from "@/components/landing/FAQSection";
import ContactForm from "@/components/landing/ContactForm";
import HeroCardWrapper from "@/components/landing/HeroCardWrapper";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { Locale, tServer, formatNum } from "@/lib/i18n";
import type { Member } from "@/services/db";

export default async function Home() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const t = (key: string) => tServer(locale, key);

  let memberCount = 100;
  let hospitalCount = 10;
  let diagnosticCount = 20;
  let pharmacyCount = 5;

  try {
    const [mCount, hCount, dCount, pCount] = await Promise.all([
      prisma.member.count({ where: { status: "active" } }),
      prisma.partner.count({ where: { category: "hospital" } }),
      prisma.partner.count({ where: { category: "diagnostic" } }),
      prisma.partner.count({ where: { category: "pharmacy" } })
    ]);
    memberCount = mCount;
    hospitalCount = hCount;
    diagnosticCount = dCount;
    pharmacyCount = pCount;
  } catch (error) {
    console.error("Error fetching stats from database:", error);
  }

  const remainingSeats = Math.max(0, 100 - memberCount);

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/40 via-emerald-50/20 to-background py-16 sm:py-24">

        {/* Background blobs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-light rounded-full blur-3xl opacity-60 -z-10" />
        <div className="absolute top-60 -left-40 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-3xl opacity-40 -z-10" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20 -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content Column (7 cols on large screens) */}
            <div className="space-y-6 lg:col-span-7 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <Heart className="h-3 w-3 fill-primary" />
                {t("page.healthcareBenefitMembershipPlatform")}
              </span>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-secondary dark:text-white leading-tight">
                {t("page.makeHealthcare")} <br className="hidden sm:inline" />
                <span className="text-primary bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                  {t("page.simpleAffordable")}
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t("page.becomeAHealthClubMember")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold shadow-lg shadow-primary/20">
                    {t("page.becomeAMemberForFree")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/partner-hospitals">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-secondary/10 text-secondary bg-white hover:bg-muted dark:bg-slate-800 dark:text-white dark:border-slate-700">
                    {t("page.viewPartnerHospitals")}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/85 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-secondary font-mono">
                    {formatNum(memberCount, locale)}+
                  </p>
                  <p className="text-xs text-muted-foreground">{t("page.foundingMembers")}</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-secondary font-mono">
                    {formatNum(hospitalCount, locale)}+
                  </p>
                  <p className="text-xs text-muted-foreground">{t("page.partnerHospitals")}</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-secondary font-mono">
                    {formatNum(diagnosticCount, locale)}+
                  </p>
                  <p className="text-xs text-muted-foreground">{t("page.diagnosticCenters")}</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-secondary font-mono">
                    {formatNum(pharmacyCount, locale)}+
                  </p>
                  <p className="text-xs text-muted-foreground">{t("page.partnerPharmacies")}</p>
                </div>
              </div>
            </div>

            {/* Right Visual Column (5 cols on large screens) */}
            <div className="lg:col-span-5 relative flex justify-center mt-4 lg:mt-0 py-10 px-4">

              {/* Decorative glow behind card */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-[1]">
                <div className="w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
              </div>

              {/* Premium digital card preview wrapper — uses the same MemberCard as the dashboard */}
              <HeroCardWrapper
                demoMember={{
                  id: "HC-2026-8910",
                  name: "মোঃ আশরাফুল আলম",
                  phone: "01700000000",
                  email: "ashraful@example.com",
                  tier: "founding",
                  status: "active",
                  joinedDate: "10-01-2026",
                  expiryDate: "10-01-2027",
                  totalSaved: 0,
                } as Member}
              />

              {/* Floating Badges — shown from sm breakpoint to prevent overflow on tiny phones */}
              <div
                className="hidden sm:flex absolute top-2 left-0 lg:-left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-secondary dark:text-white px-3 py-2 rounded-xl border border-border/60 shadow-xl items-center gap-2 animate-float z-10"
                style={{ '--float-rotate': '-3deg' } as React.CSSProperties}
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
                <span className="text-xs font-bold">{t("page.01YearMembership")}</span>
              </div>

              <div
                className="hidden sm:flex absolute bottom-2 right-0 lg:-right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-secondary dark:text-white px-3 py-2 rounded-xl border border-border/60 shadow-xl items-center gap-2 animate-float-delayed z-10"
                style={{ '--float-rotate': '2deg' } as React.CSSProperties}
              >
                <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <span className="text-primary text-[10px] font-bold">{t("page.10")}</span>
                </div>
                <span className="text-xs font-bold">{t("page.testDiscountBenefits")}</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="bg-muted py-12 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">

            <div className="bg-background p-6 rounded-2xl border border-border text-center shadow-sm hover:shadow-md transition-all">
              <p className="text-3xl font-extrabold text-primary font-mono">
                {t("page.seatsLeft").replace("{count}", formatNum(remainingSeats, locale))}
              </p>
              <h3 className="text-sm font-semibold text-secondary mt-1">{t("page.remainingSeats")}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {t("page.foundingMemberLimitLabel").replace("{count}", formatNum(100, locale))}
              </p>
            </div>

            <div className="bg-background p-6 rounded-2xl border border-border text-center shadow-sm hover:shadow-md transition-all">
              <p className="text-3xl font-extrabold text-primary font-mono">{t("page.10Flat")}</p>
              <h3 className="text-sm font-semibold text-secondary mt-1">{t("page.medicalBillSavings")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("page.flat10DiscountOnAll")}</p>
            </div>

            <div className="bg-background p-6 rounded-2xl border border-border text-center shadow-sm hover:shadow-md transition-all">
              <p className="text-3xl font-extrabold text-primary font-mono font-mono">
                {formatNum(hospitalCount, locale)}+
              </p>
              <h3 className="text-sm font-semibold text-secondary mt-1">{t("page.partnerHospitals")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("page.contractedWithRenownedHospitalsAnd")}</p>
            </div>

            <div className="bg-background p-6 rounded-2xl border border-border text-center shadow-sm hover:shadow-md transition-all">
              <p className="text-3xl font-extrabold text-primary font-mono">
                {formatNum(pharmacyCount, locale)}+
              </p>
              <h3 className="text-sm font-semibold text-secondary mt-1">{t("page.modelPharmacies")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("page.10DiscountOnMedicinePurchases")}</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">

          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">{t("page.howItWorks")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white">
              {t("page.getServicesIn3Simple")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("page.usingTheHealthClubDigital")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {/* Step 1 */}
            <div className="space-y-4 p-6 rounded-2xl bg-muted/40 border border-border/60 hover:border-primary/20 transition-colors relative group">
              <div className="h-12 w-12 rounded-full bg-primary-light text-primary font-heading text-xl font-bold flex items-center justify-center mx-auto border border-primary/20">
                {t("page.1")}
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">{t("page.memberRegistration")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("page.completeYourFreeRegistrationAs")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 p-6 rounded-2xl bg-muted/40 border border-border/60 hover:border-primary/20 transition-colors relative group">
              <div className="h-12 w-12 rounded-full bg-primary-light text-primary font-heading text-xl font-bold flex items-center justify-center mx-auto border border-primary/20">
                {t("page.2")}
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">{t("page.getDigitalMemberId")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("page.logInToTheMember")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 p-6 rounded-2xl bg-muted/40 border border-border/60 hover:border-primary/20 transition-colors relative group">
              <div className="h-12 w-12 rounded-full bg-primary-light text-primary font-heading text-xl font-bold flex items-center justify-center mx-auto border border-primary/20">
                {t("page.3")}
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">{t("page.getHospitalDiscount")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("page.showYourDigitalCardBefore")}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MEMBERSHIP BENEFITS SECTION */}
      <section id="benefits" className="py-16 sm:py-24 bg-muted/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">{t("page.membershipBenefits")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white">
              {t("page.exclusiveBenefitsForMembers")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("page.withTheHealthClubCard")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Benefit 1 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">{t("page.hospitalDiscount")}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("page.flat10DiscountWhenShowing")}
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">{t("page.diagnosticDiscount")}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("page.flat10OffOnAll")}
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">{t("page.digitalMembershipCard")}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("page.saveYourDigitalCardOn")}
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">{t("page.healthCampAccess")}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("page.directAccessToParticipateIn")}
              </p>
            </div>



            {/* Benefit 7 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">{t("page.futureHealthBenefits")}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("page.automaticallyReceiveUpdatesOnNew")}
              </p>
            </div>

            {/* Benefit 8 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">{t("page.pharmacyDiscountOffer")}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("page.flat10DirectDiscountOn")}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PRICING PLANS SECTION */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">{t("page.membershipPlans")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white">
              {t("page.chooseAPlanAccordingTo")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("page.weAreGivingTheFirst")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto">

            {/* Plan 1: Founding (Highlighted) */}
            <div className="bg-gradient-to-b from-primary-light/50 to-background border-2 border-primary rounded-3xl p-8 relative flex flex-col justify-between shadow-xl ring-4 ring-primary/10">
              <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                {t("page.limitedOffer")}
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-xl font-bold text-secondary">Founding Member</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t("page.theFirst100MembersWill")}</p>
                </div>
                <div className="flex items-baseline gap-1 text-secondary dark:text-white">
                  <span className="text-4xl font-extrabold font-mono">{t("page.0")}</span>
                  <span className="text-xs text-muted-foreground font-semibold">{t("page.1YearFree")}</span>
                </div>
                <ul className="space-y-3 text-sm text-secondary/80">
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("page.coverageForTheMemberFamily")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("page.1YearMembership")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("page.discountsAtAllPartnerHospitals")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("page.digitalMembershipCardVerifiedQr")}</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/register">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                    {t("page.joinForFree")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Plan 2: Premium */}
            <div className="bg-background border border-border rounded-3xl p-8 flex flex-col justify-between shadow-md">
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">Premium Membership</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t("page.annualCardAndBenefitsFor")}</p>
                </div>
                <div className="flex items-baseline gap-1 text-secondary dark:text-white">
                  <span className="text-4xl font-extrabold font-mono">{t("page.500")}</span>
                  <span className="text-xs text-muted-foreground font-semibold">{t("page.annualSubscription")}</span>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("page.coverageForTheMemberFamily")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("page.renewalOnAnAnnualBasis")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("page.discountsAtAllPartnerHospitals")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("page.digitalMembershipCardVerifiedQr")}</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/register?plan=premium">
                  <Button variant="outline" className="w-full border-border hover:bg-muted text-secondary dark:text-white">
                    {t("page.buyPlan")}
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. PARTNER DIRECTORY PREVIEW */}
      <section className="py-16 sm:py-24 bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-extrabold text-primary tracking-widest uppercase">{t("page.partnerClinicsLabs")}</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white">
                {t("page.ourPartnerHospitalsDiagnostics")}
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                {t("page.getSpecialDiscountsAtTop")}
              </p>
            </div>
            <Link href="/partner-hospitals" className="shrink-0 self-center md:self-end">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-light">
                {t("page.viewAllPartnersDetails")}
              </Button>
            </Link>
          </div>

          {/* Directory showing only 3 cards without the categories filter layout */}
          <PartnerDirectory limit={3} showFilters={false} />

        </div>
      </section>

      {/* 7. SAVINGS CALCULATOR SECTION */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SavingsCalculator />
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="py-16 sm:py-24 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">{t("page.memberTestimonials")}</span>
            <h2 className="font-heading text-3xl font-bold text-secondary dark:text-white">
              {t("page.ourMembersRealSavingsStories")}
            </h2>
          </div>

          <TestimonialCarousel />

        </div>
      </section>

      {/* 9. WHY CHOOSE - COMPARISON TABLE */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">{t("page.comparisonStatement")}</span>
            <h2 className="font-heading text-3xl font-bold text-secondary dark:text-white">
              {t("page.utilityOfHealthClubMembership")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("page.seeAClearComparisonBetween")}
            </p>
          </div>

          {/* Comparison Table — scrollable on mobile */}
          <div className="max-w-4xl mx-auto overflow-x-auto rounded-2xl border border-border shadow-md -webkit-overflow-scrolling-touch">
            <table className="w-full min-w-[580px] text-left border-collapse bg-background">
              <thead>
                <tr className="bg-secondary text-white font-heading text-sm sm:text-base border-b border-border">
                  <th className="p-4 md:p-5 font-semibold">{t("page.benefits")}</th>
                  <th className="p-4 md:p-5 font-semibold text-slate-300">{t("page.withoutMembership")}</th>
                  <th className="p-4 md:p-5 font-semibold text-primary">{t("page.withHealthClubMembership")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs sm:text-sm text-secondary/80">
                <tr>
                  <td className="p-4 md:p-5 font-bold text-secondary">{t("page.diagnosticTestFee")}</td>
                  <td className="p-4 md:p-5">{t("page.mustPay100FullFee")}</td>
                  <td className="p-4 md:p-5 font-semibold text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {t("page.flat10DiscountBenefit")}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:p-5 font-bold text-secondary">{t("page.hospitalBedCabinCharge")}</td>
                  <td className="p-4 md:p-5">{t("page.regularBedChargeAppliesWithout")}</td>
                  <td className="p-4 md:p-5 font-semibold text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {t("page.flat10DiscountBenefit")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 10. MOBILE APP PREVIEW (COMING SOON) */}
      <section className="py-16 sm:py-24 bg-muted/40 border-y border-border overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30">
                COMING SOON
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white leading-tight">
                {t("page.comingSoonOur")} <br />
                {t("page.healthClubMobileApp")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("page.yourMembershipServiceWillBe")}
              </p>

              <ul className="space-y-2 text-sm text-left max-w-md mx-auto lg:mx-0">
                <li className="flex items-center gap-2 text-secondary dark:text-slate-300 font-medium">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {t("page.digitalMembershipIdCardOffline")}
                </li>
                <li className="flex items-center gap-2 text-secondary dark:text-slate-300 font-medium">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {t("page.mapLocationSearchForNearest")}
                </li>
                <li className="flex items-center gap-2 text-secondary dark:text-slate-300 font-medium">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {t("page.nearestPartnerDiagnosticLabSearch")}
                </li>
                <li className="flex items-center gap-2 text-secondary dark:text-slate-300 font-medium">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {t("page.trackingOfTotalSavingsAnd")}
                </li>
              </ul>
            </div>

            {/* Right Visual (App Mockup) */}
            <div className="relative flex justify-center">

              {/* Phone Mockup Frame */}
              <div className="relative w-56 h-[440px] bg-slate-950 rounded-[32px] border-4 border-slate-800 shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-b-xl z-20" />

                {/* App Screen Content */}
                <div className="bg-slate-900 rounded-[22px] flex-1 flex flex-col justify-between p-3 text-white overflow-hidden relative">

                  {/* App Header */}
                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <span className="font-bold text-primary flex items-center gap-0.5">
                      <Heart className="h-2.5 w-2.5 fill-primary text-primary" />
                      {t("page.healthClub")}
                    </span>
                    <span className="text-slate-400 font-mono">HC-1001</span>
                  </div>

                  {/* App Miniature Card */}
                  <div className="bg-gradient-to-br from-slate-950 to-emerald-950 rounded-lg p-2.5 border border-emerald-500/20 text-left my-2">
                    <p className="text-[6px] text-slate-500 font-mono">MEMBER NAME</p>
                    <p className="text-[10px] font-bold font-heading text-white truncate">{t("page.mdAbdurRahman")}</p>

                    {/* Mini QR */}
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-[8px] font-mono text-emerald-400">FOUNDING</span>
                      <div className="bg-white p-0.5 rounded-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=HC-1001&color=0f172a&bgcolor=ffffff"
                          alt="QR code"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* App Quick Menu */}
                  <div className="space-y-1.5 flex-1">
                    <p className="text-[8px] text-slate-500 font-bold text-left mb-1 uppercase tracking-wider">Features</p>

                    <div className="bg-slate-800/80 p-2 rounded-lg text-left flex items-center gap-2">
                      <div className="h-5 w-5 bg-primary/20 text-primary flex items-center justify-center rounded-md shrink-0">
                        <span className="text-[8px] font-bold">🏥</span>
                      </div>
                      <span className="text-[9px] font-semibold">{t("page.nearestHospital")}</span>
                    </div>

                    <div className="bg-slate-800/80 p-2 rounded-lg text-left flex items-center gap-2">
                      <div className="h-5 w-5 bg-indigo-500/20 text-indigo-500 flex items-center justify-center rounded-md shrink-0">
                        <span className="text-[8px] font-bold">🧪</span>
                      </div>
                      <span className="text-[9px] font-semibold">{t("page.labTestOff")}</span>
                    </div>

                    <div className="bg-slate-800/80 p-2 rounded-lg text-left flex items-center gap-2">
                      <div className="h-5 w-5 bg-amber-500/20 text-amber-500 flex items-center justify-center rounded-md shrink-0">
                        <span className="text-[8px] font-bold">💊</span>
                      </div>
                      <span className="text-[9px] font-semibold">{t("page.discountMedicines")}</span>
                    </div>
                  </div>

                  {/* App Bottom nav */}
                  <div className="border-t border-slate-800 pt-1.5 flex justify-around text-[8px] text-slate-500">
                    <span className="text-primary font-bold">Home</span>
                    <span>Search</span>
                    <span>Profile</span>
                  </div>

                </div>

              </div>

              {/* Decorative Circle accents behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-primary/20 -z-10 animate-ping-slow" />

            </div>

          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">{t("page.questionsAnswers")}</span>
            <h2 className="font-heading text-3xl font-bold text-secondary dark:text-white">
              {t("page.frequentlyAskedQuestionsFaq")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("page.findTheAnswersToFrequently")}
            </p>
          </div>

          <FAQSection />

        </div>
      </section>

      {/* 12. CONTACT SECTION */}
      <section className="py-16 sm:py-24 bg-muted/30 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">{t("page.contactUs")}</span>
            <h2 className="font-heading text-3xl font-bold text-secondary dark:text-white">
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