import Link from "next/link";
import { Stethoscope, CheckCircle2, ArrowLeft, ShieldCheck, Sparkles, MapPin } from "lucide-react";
import { DepartmentSeoConfig } from "@/data/doctorSeoData";
import { DEPT_ICONS } from "./consultantData";

interface DepartmentSeoHeroProps {
  seoConfig: DepartmentSeoConfig;
  locale: "bn" | "en";
  matchingDoctorsCount: number;
}

export default function DepartmentSeoHero({
  seoConfig,
  locale,
  matchingDoctorsCount,
}: DepartmentSeoHeroProps) {
  const isEn = locale === "en";
  const Icon = DEPT_ICONS[seoConfig.id] || Stethoscope;

  const badgeText = isEn ? seoConfig.heroBadgeEn : seoConfig.heroBadgeBn;
  const headline = isEn ? seoConfig.heroHeadlineEn : seoConfig.heroHeadlineBn;
  const description = isEn ? seoConfig.introDescriptionEn : seoConfig.introDescriptionBn;
  const clinicalScopes = isEn ? seoConfig.clinicalScopeEn : seoConfig.clinicalScopeBn;

  return (
    <section
      aria-labelledby="dept-seo-heading"
      className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-4 sm:p-7 md:p-8 shadow-sm transition-all"
    >
      {/* Decorative subtle background elements */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative space-y-4 sm:space-y-6">
        {/* Top bar: Back link + Department Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <Link
            href="/consultants"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isEn ? "All Specialties" : "সকল বিভাগ"}</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Icon className="h-3.5 w-3.5" />
            <span>{badgeText}</span>
          </div>
        </div>

        {/* Headline & Description */}
        <div className="space-y-2 max-w-4xl">
          <h1
            id="dept-seo-heading"
            className="font-heading text-xl sm:text-3xl md:text-4xl font-bold text-secondary dark:text-white tracking-tight leading-tight"
          >
            {headline}
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Quick Highlights / Clinical Care Scopes */}
        {clinicalScopes && clinicalScopes.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{isEn ? "Specialized Care Scopes in Feni" : "বিশেষায়িত চিকিৎসা সেবা ক্ষেত্র"}</span>
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {clinicalScopes.map((scope, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-card border border-border/80 text-foreground shadow-2xs"
                >
                  <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                  <span>{scope}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Trust Badges & Local Availability Footnote */}
        <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>
                {matchingDoctorsCount > 0
                  ? isEn
                    ? `${matchingDoctorsCount} Verified Specialists Listed`
                    : `${matchingDoctorsCount} জন বিএমডিসি নিবন্ধিত বিশেষজ্ঞ তালিকাভুক্ত`
                  : isEn
                  ? "Verified BMDC Specialists"
                  : "বিএমডিসি নিবন্ধিত বিশেষজ্ঞ"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary/80" />
              <span>{isEn ? "SSK Road, Trunk Road, Feni" : "এস.এস.কে রোড, ট্রাঙ্ক রোড, ফেনী"}</span>
            </div>
          </div>

          <Link
            href="/consultants"
            className="text-xs text-primary font-bold hover:underline cursor-pointer"
          >
            {isEn ? "Reset & View All Doctors →" : "রিসেট করে সকল ডাক্তার দেখুন →"}
          </Link>
        </div>
      </div>
    </section>
  );
}
