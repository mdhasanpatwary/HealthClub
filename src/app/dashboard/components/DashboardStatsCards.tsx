import { TrendingUp, Wallet, ReceiptText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNum, Locale } from "@/lib/i18n";
import { Transaction } from "@/services/db";

interface DashboardStatsCardsProps {
  totalSaved: number;
  totalSpent: number;
  transactions: Transaction[];
  t: (key: string) => string;
  locale: Locale;
}

export function DashboardStatsCards({
  totalSaved,
  totalSpent,
  transactions,
  t,
  locale,
}: DashboardStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

      <Card className="border-0 shadow-sm overflow-hidden bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 uppercase font-mono tracking-wider font-bold">{t("dashboard.stats.totalSavings")}</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums mt-2">৳{totalSaved.toLocaleString(locale === "en" ? "en-US" : "bn-BD")}</p>
              <p className="text-[11px] text-emerald-600/60 dark:text-emerald-400/60 mt-1">{t("dashboard.stats.totalSavingsDesc")}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/40 dark:to-slate-900">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 uppercase font-mono tracking-wider font-bold">{t("dashboard.stats.totalSpent")}</p>
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums mt-2">৳{totalSpent.toLocaleString(locale === "en" ? "en-US" : "bn-BD")}</p>
              <p className="text-[11px] text-blue-600/60 dark:text-blue-400/60 mt-1">{t("dashboard.stats.totalSpentDesc")}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-500/15 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm overflow-hidden bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/40 dark:to-slate-900">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-violet-600/70 dark:text-violet-400/70 uppercase font-mono tracking-wider font-bold">{t("dashboard.stats.totalTransactions")}</p>
              <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 font-mono tabular-nums mt-2">
                {formatNum(transactions.length, locale)} {t("dashboard.stats.transactionCountSuffix")}
              </p>
              <p className="text-[11px] text-violet-600/60 dark:text-violet-400/60 mt-1">{t("dashboard.stats.totalTransactionsDesc")}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-violet-500/15 dark:bg-violet-500/20 border border-violet-500/20 flex items-center justify-center">
              <ReceiptText className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
