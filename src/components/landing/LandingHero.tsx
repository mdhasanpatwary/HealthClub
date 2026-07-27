import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroCardWrapper from "./HeroCardWrapper";
import type { Member } from "@/services/db";

interface LandingHeroProps {
  sampleMember: Member;
  t: (key: string) => string;
}

export function LandingHero({ sampleMember, t }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-light/60 via-emerald-50/30 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-10 sm:py-20 lg:py-28">

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">

          {/* Left Content Column */}
          <div className="space-y-4 sm:space-y-7 lg:col-span-7 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 animate-fade-in shadow-sm">
              <Heart className="h-3.5 w-3.5 fill-primary" />
              {t("page.healthcareBenefitMembershipPlatform")}
            </span>

            <h1 className="font-heading text-4xl sm:text-5xl xl:text-6xl font-extrabold text-secondary dark:text-white leading-[1.12] tracking-tight">
              {t("page.healthcareIsNow")} <span className="gradient-text">{t("page.easyAndAffordable")}</span> {t("page.healthcareForYou")}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t("page.becomeAHealthClubMember")}
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="xl" className="w-full sm:w-auto">
                  {t("page.joinNowFree")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/partner-hospitals" className="w-full sm:w-auto">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  {t("page.partnerHospitals")}
                </Button>
              </Link>
            </div>

            {/* Feature Highlights (distinct from Stats grid below) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-border/80 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-bold text-secondary dark:text-white">
                  {t("page.100PercentFreeFounding")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-bold text-secondary dark:text-white">
                  {t("page.instantDigitalVerification")}
                </span>
              </div>

              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-bold text-secondary dark:text-white">
                  {t("page.validAcrossAllPartners")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Digital Card Visual Column */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroCardWrapper demoMember={sampleMember} />
          </div>

        </div>
      </div>
    </section>
  );
}
