import { formatNum, Locale } from "@/lib/i18n";

interface LandingStatsProps {
  remainingSeats: number;
  hospitalCount: number;
  diagnosticCount: number;
  pharmacyCount: number;
  t: (key: string) => string;
  locale: Locale;
}

export function LandingStats({
  remainingSeats,
  hospitalCount,
  diagnosticCount,
  pharmacyCount,
  t,
  locale,
}: LandingStatsProps) {
  return (
    <section className="bg-background py-8 sm:py-14 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">

          {/* 1. Remaining Seats */}
          <div className="col-span-2 sm:col-span-1 relative bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 p-4 sm:p-6 rounded-2xl border border-primary/15 text-center hover-lift shadow-sm group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="text-3xl font-extrabold text-primary font-mono tabular-nums">
              {t("page.seatsLeft").replace("{count}", formatNum(remainingSeats, locale))}
            </p>
            <p className="text-sm font-bold text-secondary dark:text-white mt-1.5">{t("page.remainingSeats")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("page.foundingMemberLimitLabel").replace("{count}", formatNum(100, locale))}
            </p>
          </div>

          {/* 2. Medical Bill Savings */}
          <div className="relative bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 dark:from-emerald-500/10 dark:to-emerald-500/5 p-4 sm:p-6 rounded-2xl border border-emerald-500/15 text-center hover-lift shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{t("page.10Flat")}</p>
            <p className="text-sm font-bold text-secondary dark:text-white mt-1.5">{t("page.medicalBillSavings")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("page.flat10DiscountOnAll")}</p>
          </div>

          {/* 3. Partner Hospitals */}
          <div className="relative bg-gradient-to-br from-blue-500/5 to-blue-500/10 dark:from-blue-500/10 dark:to-blue-500/5 p-4 sm:p-6 rounded-2xl border border-blue-500/15 text-center hover-lift shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
              {formatNum(hospitalCount, locale)}+
            </p>
            <p className="text-sm font-bold text-secondary dark:text-white mt-1.5">{t("page.partnerHospitals")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("page.contractedHospitalsDesc")}</p>
          </div>

          {/* 4. Diagnostic Centers */}
          <div className="relative bg-gradient-to-br from-teal-500/5 to-teal-500/10 dark:from-teal-500/10 dark:to-teal-500/5 p-4 sm:p-6 rounded-2xl border border-teal-500/15 text-center hover-lift shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
            <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono tabular-nums">
              {formatNum(diagnosticCount, locale)}+
            </p>
            <p className="text-sm font-bold text-secondary dark:text-white mt-1.5">{t("page.diagnosticCenters")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("page.diagnosticCentersDesc")}</p>
          </div>

          {/* 5. Model Pharmacies */}
          <div className="relative bg-gradient-to-br from-violet-500/5 to-violet-500/10 dark:from-violet-500/10 dark:to-violet-500/5 p-4 sm:p-6 rounded-2xl border border-violet-500/15 text-center hover-lift shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 font-mono tabular-nums">
              {formatNum(pharmacyCount, locale)}+
            </p>
            <p className="text-sm font-bold text-secondary dark:text-white mt-1.5">{t("page.modelPharmacies")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("page.10DiscountOnMedicinePurchases")}</p>
          </div>

        </div>
      </div>
    </section>
  );
}
