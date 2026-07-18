import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart, Check, Building2, Stethoscope, Pill, Users, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import PartnerDirectory from "@/components/ui/PartnerDirectory";
import SavingsCalculator from "@/components/ui/SavingsCalculator";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import FAQSection from "@/components/landing/FAQSection";
import ContactForm from "@/components/landing/ContactForm";
import HeroCardWrapper from "@/components/landing/HeroCardWrapper";
import { getHomepageStats, getHomepagePartners } from "@/lib/homepageData";
import { cookies } from "next/headers";
import { Locale, tServer, formatNum } from "@/lib/i18n";
import type { Member } from "@/services/db";

export default async function Home() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const t = (key: string) => tServer(locale, key);

  // Single cached query for all homepage stats (4 counts → 1 SQL, 60s cache)
  const [stats, homepagePartners] = await Promise.all([
    getHomepageStats(),
    getHomepagePartners(3),
  ]);
  const { memberCount, hospitalCount, diagnosticCount, pharmacyCount } = stats;

  const remainingSeats = Math.max(0, 100 - memberCount);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ──────────────────────────────────────────── */}
      {/* 1. HERO SECTION */}
      {/* ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-light/60 via-emerald-50/30 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-20 sm:py-28">

        {/* Animated background orbs */}
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-primary/8 dark:bg-primary/5 rounded-full blur-3xl -z-10 animate-gradient" />
        <div className="absolute top-48 -left-48 w-[500px] h-[500px] bg-emerald-200/50 dark:bg-emerald-900/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-100/60 dark:bg-emerald-950/30 rounded-full blur-3xl -z-10" />

        {/* Dot-grid pattern overlay */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, #16a34a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content Column */}
            <div className="space-y-7 lg:col-span-7 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 animate-fade-in shadow-sm">
                <Heart className="h-3.5 w-3.5 fill-primary" />
                {t("page.healthcareBenefitMembershipPlatform")}
              </span>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-secondary dark:text-white leading-[1.1] tracking-tight animate-fade-in-up">
                {t("page.makeHealthcare")}{" "}
                <br className="hidden sm:inline" />
                <span className="gradient-text">
                  {t("page.simpleAffordable")}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up delay-100">
                {t("page.becomeAHealthClubMember")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1 animate-fade-in-up delay-200">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold shadow-lg btn-glow rounded-xl px-7 gap-2"
                  >
                    {t("page.becomeAMemberForFree")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/partner-hospitals">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto rounded-xl px-7 border-border hover:bg-muted/60 font-semibold"
                  >
                    {t("page.viewPartnerHospitals")}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-6 border-t border-border/60 max-w-md mx-auto lg:mx-0 animate-fade-in-up delay-300">
                {[
                  { count: formatNum(memberCount, locale) + "+", label: t("page.foundingMembers"), icon: <Users className="h-4 w-4" /> },
                  { count: formatNum(hospitalCount, locale) + "+", label: t("page.partnerHospitals"), icon: <Building2 className="h-4 w-4" /> },
                  { count: formatNum(diagnosticCount, locale) + "+", label: t("page.diagnosticCenters"), icon: <Stethoscope className="h-4 w-4" /> },
                  { count: formatNum(pharmacyCount, locale) + "+", label: t("page.partnerPharmacies"), icon: <Pill className="h-4 w-4" /> },
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left group">
                    <p className="text-2xl sm:text-3xl font-extrabold text-secondary dark:text-white font-mono tabular-nums">
                      {stat.count}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-5 relative flex justify-center mt-4 lg:mt-0 py-10 px-4">

              {/* Glow behind card */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-[1]">
                <div className="w-80 h-80 bg-primary/15 dark:bg-primary/10 rounded-full blur-3xl animate-gradient" />
              </div>

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

              {/* Floating Badges */}
              <div
                className="hidden sm:flex absolute top-2 left-0 lg:-left-4 glass-card text-secondary dark:text-white px-3.5 py-2.5 rounded-2xl shadow-xl items-center gap-2 animate-float z-10"
                style={{ '--float-rotate': '-3deg' } as React.CSSProperties}
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold">{t("page.01YearMembership")}</span>
              </div>

              <div
                className="hidden sm:flex absolute bottom-2 right-0 lg:-right-4 glass-card text-secondary dark:text-white px-3.5 py-2.5 rounded-2xl shadow-xl items-center gap-2 animate-float-delayed z-10"
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

      {/* ──────────────────────────────────────────── */}
      {/* 2. STATS SECTION */}
      {/* ──────────────────────────────────────────── */}
      <section className="bg-background py-14 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">

            <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 p-6 rounded-2xl border border-primary/15 text-center hover-lift shadow-sm group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <p className="text-3xl font-extrabold text-primary font-mono tabular-nums">
                {t("page.seatsLeft").replace("{count}", formatNum(remainingSeats, locale))}
              </p>
              <h3 className="text-sm font-bold text-secondary dark:text-white mt-1.5">{t("page.remainingSeats")}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {t("page.foundingMemberLimitLabel").replace("{count}", formatNum(100, locale))}
              </p>
            </div>

            <div className="relative bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 dark:from-emerald-500/10 dark:to-emerald-500/5 p-6 rounded-2xl border border-emerald-500/15 text-center hover-lift shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{t("page.10Flat")}</p>
              <h3 className="text-sm font-bold text-secondary dark:text-white mt-1.5">{t("page.medicalBillSavings")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("page.flat10DiscountOnAll")}</p>
            </div>

            <div className="relative bg-gradient-to-br from-blue-500/5 to-blue-500/10 dark:from-blue-500/10 dark:to-blue-500/5 p-6 rounded-2xl border border-blue-500/15 text-center hover-lift shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
                {formatNum(hospitalCount, locale)}+
              </p>
              <h3 className="text-sm font-bold text-secondary dark:text-white mt-1.5">{t("page.partnerHospitals")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("page.contractedWithRenownedHospitalsAnd")}</p>
            </div>

            <div className="relative bg-gradient-to-br from-violet-500/5 to-violet-500/10 dark:from-violet-500/10 dark:to-violet-500/5 p-6 rounded-2xl border border-violet-500/15 text-center hover-lift shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 font-mono tabular-nums">
                {formatNum(pharmacyCount, locale)}+
              </p>
              <h3 className="text-sm font-bold text-secondary dark:text-white mt-1.5">{t("page.modelPharmacies")}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t("page.10DiscountOnMedicinePurchases")}</p>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── */}
      {/* 3. HOW IT WORKS SECTION */}
      {/* ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-muted/40 dark:bg-slate-950/60 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-14">

          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="section-label">{t("page.howItWorks")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white mt-3">
              {t("page.getServicesIn3Simple")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("page.usingTheHealthClubDigital")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative max-w-4xl mx-auto">

            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 z-0" />

            {[
              { step: t("page.1"), title: t("page.memberRegistration"), desc: t("page.completeYourFreeRegistrationAs") },
              { step: t("page.2"), title: t("page.getDigitalMemberId"), desc: t("page.logInToTheMember") },
              { step: t("page.3"), title: t("page.getHospitalDiscount"), desc: t("page.showYourDigitalCardBefore") },
            ].map((item, i) => (
              <div
                key={i}
                className="relative z-10 flex flex-col items-center text-center space-y-4 p-7 rounded-2xl bg-background dark:bg-slate-900 border border-border/80 hover:border-primary/30 hover-lift shadow-sm group"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-white font-heading text-xl font-bold flex items-center justify-center shadow-lg shadow-primary/20">
                  {item.step}
                </div>
                <h3 className="font-heading text-base font-bold text-secondary dark:text-white">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── */}
      {/* 4. MEMBERSHIP BENEFITS SECTION */}
      {/* ──────────────────────────────────────────── */}
      <section id="benefits" className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">

          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="section-label">{t("page.membershipBenefits")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white mt-3">
              {t("page.exclusiveBenefitsForMembers")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("page.withTheHealthClubCard")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {[
              { title: t("page.hospitalDiscount"), desc: t("page.flat10DiscountWhenShowing"), gradient: "from-emerald-500 to-green-600" },
              { title: t("page.diagnosticDiscount"), desc: t("page.flat10OffOnAll"), gradient: "from-blue-500 to-cyan-600" },
              { title: t("page.digitalMembershipCard"), desc: t("page.saveYourDigitalCardOn"), gradient: "from-violet-500 to-purple-600" },
              { title: t("page.healthCampAccess"), desc: t("page.directAccessToParticipateIn"), gradient: "from-rose-500 to-pink-600" },
              { title: t("page.futureHealthBenefits"), desc: t("page.automaticallyReceiveUpdatesOnNew"), gradient: "from-amber-500 to-orange-600" },
              { title: t("page.pharmacyDiscountOffer"), desc: t("page.flat10DirectDiscountOn"), gradient: "from-teal-500 to-emerald-600" },
            ].map((benefit, i) => (
              <div
                key={i}
                className="group relative bg-background dark:bg-slate-900 p-7 rounded-2xl border border-border/80 hover:border-primary/20 hover-lift shadow-sm overflow-hidden"
              >
                {/* Hover gradient wash */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/3 group-hover:to-emerald-500/3 transition-all duration-500 rounded-2xl" />
                <div className={`relative h-11 w-11 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  <Check className="h-5 w-5 text-white" />
                </div>
                <h3 className="relative font-heading text-base font-bold text-secondary dark:text-white mb-2">{benefit.title}</h3>
                <p className="relative text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── */}
      {/* 5. PRICING PLANS SECTION */}
      {/* ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">

          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="section-label">{t("page.membershipPlans")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white mt-3">
              {t("page.chooseAPlanAccordingTo")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("page.weAreGivingTheFirst")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto">

            {/* Plan 1: Founding (Highlighted) */}
            <div className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background dark:from-primary/15 dark:via-primary/8 dark:to-slate-900 border-2 border-primary rounded-3xl p-8 flex flex-col justify-between shadow-xl ring-4 ring-primary/10 overflow-hidden">
              {/* Background shimmer element */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-3xl" />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
                {t("page.limitedOffer")}
              </div>
              <div className="relative space-y-6">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                    <Star className="h-5 w-5 text-primary fill-primary/20" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">Founding Member</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t("page.theFirst100MembersWill")}</p>
                </div>
                <div className="flex items-baseline gap-2 text-secondary dark:text-white">
                  <span className="text-5xl font-extrabold font-mono">{t("page.0")}</span>
                  <span className="text-sm text-muted-foreground font-semibold">{t("page.1YearFree")}</span>
                </div>
                <ul className="space-y-3 text-sm">
                  {[
                    t("page.coverageForTheMemberFamily"),
                    t("page.1YearMembership"),
                    t("page.discountsAtAllPartnerHospitals"),
                    t("page.digitalMembershipCardVerifiedQr"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-secondary/80 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative pt-8">
                <Link href="/register">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl btn-glow py-3 text-base">
                    {t("page.joinForFree")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Plan 2: Premium */}
            <div className="bg-background dark:bg-slate-900 border border-border rounded-3xl p-8 flex flex-col justify-between shadow-md hover-lift">
              <div className="space-y-6">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <ShieldCheck className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">Premium Membership</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t("page.annualCardAndBenefitsFor")}</p>
                </div>
                <div className="flex items-baseline gap-2 text-secondary dark:text-white">
                  <span className="text-5xl font-extrabold font-mono">{t("page.500")}</span>
                  <span className="text-sm text-muted-foreground font-semibold">{t("page.annualSubscription")}</span>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {[
                    t("page.coverageForTheMemberFamily"),
                    t("page.renewalOnAnAnnualBasis"),
                    t("page.discountsAtAllPartnerHospitals"),
                    t("page.digitalMembershipCardVerifiedQr"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/register?plan=premium">
                  <Button variant="outline" className="w-full border-border hover:bg-muted text-secondary dark:text-white rounded-xl py-3 text-base font-semibold">
                    {t("page.buyPlan")}
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── */}
      {/* 6. PARTNER DIRECTORY PREVIEW */}
      {/* ──────────────────────────────────────────── */}
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
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/5 rounded-xl font-semibold gap-2">
                {t("page.viewAllPartnersDetails")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <PartnerDirectory partners={homepagePartners} limit={3} showFilters={false} />

        </div>
      </section>

      {/* ──────────────────────────────────────────── */}
      {/* 7. SAVINGS CALCULATOR SECTION */}
      {/* ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SavingsCalculator />
        </div>
      </section>

      {/* ──────────────────────────────────────────── */}
      {/* 8. TESTIMONIALS SECTION */}
      {/* ──────────────────────────────────────────── */}
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

      {/* ──────────────────────────────────────────── */}
      {/* 9. WHY CHOOSE - COMPARISON TABLE */}
      {/* ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="section-label">{t("page.comparisonStatement")}</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white mt-3">
              {t("page.utilityOfHealthClubMembership")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("page.seeAClearComparisonBetween")}
            </p>
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto overflow-x-auto rounded-2xl border border-border shadow-md">
            <table className="w-full min-w-[580px] text-left border-collapse bg-background dark:bg-slate-900">
              <thead>
                <tr className="bg-gradient-to-r from-secondary to-slate-800 text-white font-heading text-sm sm:text-base">
                  <th className="p-4 md:p-5 font-semibold rounded-tl-2xl">{t("page.benefits")}</th>
                  <th className="p-4 md:p-5 font-semibold text-slate-400">{t("page.withoutMembership")}</th>
                  <th className="p-4 md:p-5 font-semibold text-emerald-400 rounded-tr-2xl">{t("page.withHealthClubMembership")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs sm:text-sm text-secondary/80 dark:text-slate-300">
                <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">{t("page.diagnosticTestFee")}</td>
                  <td className="p-4 md:p-5">{t("page.mustPay100FullFee")}</td>
                  <td className="p-4 md:p-5 font-semibold text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {t("page.flat10DiscountBenefit")}
                  </td>
                </tr>
                <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">{t("page.hospitalBedCabinCharge")}</td>
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

      {/* ──────────────────────────────────────────── */}
      {/* 10. MOBILE APP PREVIEW */}
      {/* ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-7 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-amber-400/15 text-amber-600 dark:text-amber-300 border border-amber-400/25">
                COMING SOON
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white leading-tight">
                {t("page.comingSoonOur")} <br />
                <span className="gradient-text">{t("page.healthClubMobileApp")}</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                {t("page.yourMembershipServiceWillBe")}
              </p>

              <ul className="space-y-3 text-sm text-left max-w-md mx-auto lg:mx-0">
                {[
                  t("page.digitalMembershipIdCardOffline"),
                  t("page.mapLocationSearchForNearest"),
                  t("page.nearestPartnerDiagnosticLabSearch"),
                  t("page.trackingOfTotalSavingsAnd"),
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-secondary dark:text-slate-300 font-medium">
                    <div className="h-6 w-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Visual (App Mockup) */}
            <div className="relative flex justify-center">
              {/* Glow orb */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 bg-primary/10 dark:bg-primary/15 rounded-full blur-3xl animate-gradient" />
              </div>

              {/* Phone Mockup Frame */}
              <div className="relative w-56 h-[440px] bg-slate-950 rounded-[36px] border-[5px] border-slate-800 shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-950 rounded-b-xl z-20" />

                {/* App Screen Content */}
                <div className="bg-slate-900 rounded-[26px] flex-1 flex flex-col justify-between p-3 text-white overflow-hidden relative">

                  {/* App Header */}
                  <div className="flex justify-between items-center text-[10px] pt-2">
                    <span className="font-bold text-primary flex items-center gap-0.5">
                      <Heart className="h-2.5 w-2.5 fill-primary text-primary" />
                      {t("page.healthClub")}
                    </span>
                    <span className="text-slate-400 font-mono text-[9px]">HC-1001</span>
                  </div>

                  {/* App Miniature Card */}
                  <div className="bg-gradient-to-br from-slate-950 to-emerald-950 rounded-xl p-2.5 border border-emerald-500/20 text-left my-2">
                    <p className="text-[6px] text-slate-500 font-mono uppercase tracking-wide">Member Name</p>
                    <p className="text-[10px] font-bold font-heading text-white truncate">{t("page.mdAbdurRahman")}</p>

                    <div className="flex justify-between items-end mt-2">
                      <span className="text-[8px] font-mono text-emerald-400 font-bold">FOUNDING</span>
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
                    <p className="text-[8px] text-slate-500 font-bold text-left mb-1.5 uppercase tracking-wider">Features</p>

                    {[
                      { emoji: "🏥", label: t("page.nearestHospital"), color: "bg-primary/20 text-primary" },
                      { emoji: "🧪", label: t("page.labTestOff"), color: "bg-indigo-500/20 text-indigo-400" },
                      { emoji: "💊", label: t("page.discountMedicines"), color: "bg-amber-500/20 text-amber-400" },
                    ].map((feat, i) => (
                      <div key={i} className="bg-slate-800/80 p-2 rounded-lg text-left flex items-center gap-2">
                        <div className={`h-5 w-5 ${feat.color} flex items-center justify-center rounded-md shrink-0`}>
                          <span className="text-[8px] font-bold">{feat.emoji}</span>
                        </div>
                        <span className="text-[9px] font-semibold text-slate-200">{feat.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* App Bottom nav */}
                  <div className="border-t border-slate-800 pt-1.5 flex justify-around text-[8px] text-slate-500 mt-1">
                    <span className="text-primary font-bold">Home</span>
                    <span>Search</span>
                    <span>Profile</span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────── */}
      {/* CTA BANNER — before FAQ */}
      {/* ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary via-emerald-500 to-primary dark:from-primary-dark dark:via-emerald-600 dark:to-primary-dark animate-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            আজই হেলথ ক্লাবের সদস্য হন
          </h2>
          <p className="text-base sm:text-lg text-white/85 max-w-xl mx-auto">
            বিনামূল্যে সদস্যতা নিন এবং নির্ধারিত হাসপাতাল ও ডায়াগনস্টিক সেন্টারে ১০% ছাড় উপভোগ করুন।
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl px-8 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5"
            >
              বিনামূল্যে যোগ দিন
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────── */}
      {/* 11. FAQ SECTION */}
      {/* ──────────────────────────────────────────── */}
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

      {/* ──────────────────────────────────────────── */}
      {/* 12. CONTACT SECTION */}
      {/* ──────────────────────────────────────────── */}
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