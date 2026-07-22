import { Check } from "lucide-react";

interface LandingBenefitsProps {
  t: (key: string) => string;
}

export function LandingBenefits({ t }: LandingBenefitsProps) {
  return (
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
  );
}
