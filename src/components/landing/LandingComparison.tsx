import { CheckCircle2 } from "lucide-react";

interface LandingComparisonProps {
  t: (key: string) => string;
}

export function LandingComparison({ t }: LandingComparisonProps) {
  return (
    <section className="py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">

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
              <tr className="hover:bg-muted/40 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 md:p-5 font-bold text-secondary dark:text-white">{t("page.partnerPharmacyDiscount")}</td>
                <td className="p-4 md:p-5">{t("page.noPharmacyDiscount")}</td>
                <td className="p-4 md:p-5 font-semibold text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {t("page.pharmacyDiscount5to10")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
