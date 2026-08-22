import Link from "next/link";
import { Star, ShieldCheck, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface LandingPricingProps {
  t: (key: string) => string;
}

export function LandingPricing({ t }: LandingPricingProps) {
  return (
    <section className="py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-14">

        <div className="text-center space-y-2 sm:space-y-4 max-w-2xl mx-auto">
          <span className="section-label">{t("page.membershipPlans")}</span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
            {t("page.chooseAPlanAccordingTo")}
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            {t("page.weAreGivingTheFirst")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto items-stretch">

          {/* Plan 1: Founding (Free) */}
          <div className="relative bg-background dark:bg-slate-900 border-2 border-primary rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-xl shadow-primary/5">
            <div className="absolute -top-3.5 right-6 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {t("page.mostPopular")}
            </div>
            <div className="space-y-6">
              <div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 text-primary">
                  <Star className="h-5 w-5 fill-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">{t("page.foundingMember")}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("page.specialOfferForFirst100Members")}</p>
              </div>
              <div className="flex items-baseline gap-2 text-primary">
                <span className="text-5xl font-extrabold font-mono">{t("page.0")}</span>
                <span className="text-sm font-semibold text-muted-foreground">{t("page.foreverFree")}</span>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  t("page.coverageForTheMemberFamily"),
                  t("page.lifetimeValidityFoundingMember"),
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
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className: "w-full",
                })}
              >
                <span>{t("page.joinForFree")}</span>
              </Link>
            </div>
          </div>

          {/* Plan 2: Premium */}
          <div className="bg-background dark:bg-slate-900 border border-border/80 rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-sm hover:border-primary/30 transition-all duration-300">
            <div className="space-y-6">
              <div>
                <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center mb-3">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">{t("page.premiumMember")}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("page.afterTheFirst100Founding")}</p>
              </div>
              <div className="flex items-baseline gap-2 text-secondary dark:text-white">
                <span className="text-5xl font-extrabold font-mono">{t("page.500")}</span>
                <span className="text-sm text-muted-foreground font-semibold">{t("page.year")}</span>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  t("page.coverageForTheMemberFamily"),
                  t("page.1YearMembership"),
                  t("page.discountsAtAllPartnerHospitals"),
                  t("page.digitalMembershipCardVerifiedQr"),
                  t("page.prioritySupportService"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8">
              <Link
                href="/register"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full",
                })}
              >
                <span>{t("page.getPremium")}</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
