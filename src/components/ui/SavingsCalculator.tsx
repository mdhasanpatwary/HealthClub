"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function SavingsCalculator() {
  const [expense, setExpense] = useState<number>(10000);
  const { locale, t } = useLanguage();

  // Computations
  const discountRate = 0.10; // Flat 10% discount
  const monthlySavings = Math.round(expense * discountRate);
  const yearlySavings = monthlySavings * 12;
  const individualPlanCost = 500;
  const netYearlySavings = yearlySavings - individualPlanCost;

  const localeCode = locale === "en" ? "en-US" : "bn-BD";

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border border-border/80 bg-background/50 backdrop-blur">
      <CardHeader className="text-center pb-4">
        <CardTitle className="font-heading text-2xl font-bold text-secondary">
          {t("ui.savingscalculator.savingsCalculator")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("ui.savingscalculator.seeHowMuchYouCan")}
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Slider Input */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-secondary">
              {t("ui.savingscalculator.yourEstimatedMonthlyMedicalExpenses")}
            </label>
            <span className="text-2xl font-bold text-primary font-mono">
              ৳{expense.toLocaleString(localeCode)} <span className="text-sm font-normal text-muted-foreground">{t("ui.savingscalculator.bdt")}</span>
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={expense}
            onChange={(e) => setExpense(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>{t("ui.savingscalculator.1000")}</span>
            <span>{t("ui.savingscalculator.25000")}</span>
            <span>{t("ui.savingscalculator.50000")}</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-muted/50 p-4 rounded-xl border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">{t("ui.savingscalculator.estimatedMonthlySavings")}</p>
            <p className="text-xl font-bold text-secondary font-mono">৳{monthlySavings.toLocaleString(localeCode)}</p>
          </div>

          <div className="bg-muted/50 p-4 rounded-xl border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">{t("ui.savingscalculator.totalAnnualSavings")}</p>
            <p className="text-xl font-bold text-secondary font-mono">৳{yearlySavings.toLocaleString(localeCode)}</p>
          </div>

          <div className="bg-primary-light/40 dark:bg-primary-dark/20 p-4 rounded-xl border border-primary/20 text-center">
            <p className="text-xs text-primary dark:text-primary-foreground font-semibold mb-1">{t("ui.savingscalculator.netAnnualSavings")}</p>
            <p className="text-2xl font-bold text-primary font-mono">৳{(netYearlySavings > 0 ? netYearlySavings : 0).toLocaleString(localeCode)}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{t("ui.savingscalculator.excluding500AnnualFee")}</p>
          </div>

        </div>

        {/* Call to Action */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground mb-4">
            {t("ui.savingscalculator.savingsAmountMayVaryBased")}
          </p>
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-medium px-8">
              {t("ui.savingscalculator.becomeAMemberTodayFree")}
            </Button>
          </Link>
        </div>

      </CardContent>
    </Card>
  );
}
