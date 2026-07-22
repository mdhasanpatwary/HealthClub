interface LandingHowItWorksProps {
  t: (key: string) => string;
}

export function LandingHowItWorks({ t }: LandingHowItWorksProps) {
  return (
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
  );
}
