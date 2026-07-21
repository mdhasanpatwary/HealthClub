"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingDown, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function SavingsCalculator() {
  const [expense, setExpense] = useState<number>(10000);
  const { locale, t } = useLanguage();

  const discountRate = 0.10;
  const annualExpense = expense * 12;
  const annualDiscount = Math.round(annualExpense * discountRate);
  const membershipFee = 500;
  const netSavings = Math.max(0, annualDiscount - membershipFee);

  const fmt = (n: number) =>
    n.toLocaleString(locale === "en" ? "en-US" : "bn-BD");

  const presets = [5000, 10000, 20000, 30000];

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10 space-y-2 sm:space-y-3 px-1">
        <span className="section-label">{t("ui.savingscalculator.savingsCalculator")}</span>
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary dark:text-white mt-2 sm:mt-3 leading-tight">
          {t("ui.savingscalculator.adjustSlider")}
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          {t("ui.savingscalculator.seeHowMuchYouCan")}
        </p>
      </div>

      {/* ── MOBILE LAYOUT: single unified card ── */}
      <div className="lg:hidden space-y-4">

        {/* Mobile: savings result at top so user sees it immediately */}
        <div className="bg-gradient-to-br from-primary/10 via-emerald-500/5 to-background dark:from-primary/15 dark:via-emerald-500/8 dark:to-slate-900 rounded-2xl border border-primary/25 p-5">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
            {t("ui.savingscalculator.youSaveLabel")}
          </p>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-4xl font-extrabold text-primary font-mono tabular-nums leading-none">
              ৳{fmt(netSavings)}
            </span>
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
          </div>
          <p className="text-[10px] text-muted-foreground">
            {t("ui.savingscalculator.excluding500AnnualFee")}
          </p>
        </div>

        {/* Mobile: slider card */}
        <div className="bg-background dark:bg-slate-900 rounded-2xl border border-border/80 p-5 space-y-5">

          {/* Expense display */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {t("ui.savingscalculator.monthlyExpenseLabel")}
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-secondary dark:text-white font-mono tabular-nums">
                ৳{fmt(expense)}
              </span>
              <span className="text-xs text-muted-foreground">{t("ui.savingscalculator.bdt")}</span>
            </div>
          </div>

          {/* Range slider — larger touch target on mobile */}
          <div className="space-y-2">
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={expense}
              onChange={(e) => setExpense(Number(e.target.value))}
              className="range-slider touch-pan-x"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono select-none">
              <span>{t("ui.savingscalculator.1000")}</span>
              <span>{t("ui.savingscalculator.25000")}</span>
              <span>{t("ui.savingscalculator.50000")}</span>
            </div>
          </div>

          {/* Preset chips — full-width rows on mobile for easy tapping */}
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground">{t("ui.savingscalculator.quickSelect")}</p>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((val) => (
                <button
                  key={val}
                  onClick={() => setExpense(val)}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all duration-150 cursor-pointer min-h-[44px] ${
                    expense === val
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-muted/60 text-muted-foreground border-border/60 active:bg-primary/10"
                  }`}
                >
                  ৳{fmt(val)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: breakdown receipt */}
        <div className="bg-background dark:bg-slate-900 rounded-2xl border border-border/80 p-5 space-y-0">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <TrendingDown className="h-3 w-3" />
            {t("ui.savingscalculator.breakdownTitle")}
          </p>

          {/* Rows */}
          <div className="font-mono text-xs space-y-0">
            <div className="flex items-center justify-between py-2.5 border-b border-dashed border-border/60">
              <span className="text-secondary/80 dark:text-slate-300">{t("ui.savingscalculator.annualExpenseRow")}</span>
              <span className="font-semibold text-secondary dark:text-white tabular-nums">৳{fmt(annualExpense)}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-dashed border-border/60">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{t("ui.savingscalculator.discountRow")}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">− ৳{fmt(annualDiscount)}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-border/60">
              <span className="text-rose-500 dark:text-rose-400">{t("ui.savingscalculator.membershipFeeRow")}</span>
              <span className="font-semibold text-rose-500 dark:text-rose-400 tabular-nums">− ৳{fmt(membershipFee)}</span>
            </div>
            <div className="flex items-center justify-between py-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 px-3 mt-2">
              <span className="font-bold text-primary text-xs">✅ {t("ui.savingscalculator.netSavingsRow")}</span>
              <span className="text-base font-extrabold text-primary tabular-nums">৳{fmt(netSavings)}</span>
            </div>
          </div>
        </div>

        {/* Mobile: Founding member + CTA */}
        <div className="flex items-start gap-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-primary">{t("ui.savingscalculator.freeForFoundingMember")}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {t("ui.savingscalculator.freeForFoundingMemberDesc")}
            </p>
          </div>
        </div>

        <Link href="/register">
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl btn-glow gap-2 text-base min-h-[52px]"
          >
            {t("ui.savingscalculator.becomeAMemberTodayFree")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* ── DESKTOP LAYOUT: two-column side-by-side ── */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6 items-stretch">

        {/* Left: Input Panel */}
        <div className="bg-background dark:bg-slate-900 rounded-3xl border border-border/80 p-7 space-y-8 shadow-sm flex flex-col justify-between">

          <div className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("ui.savingscalculator.monthlyExpenseLabel")}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-secondary dark:text-white font-mono tabular-nums">
                  ৳{fmt(expense)}
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  {t("ui.savingscalculator.bdt")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={expense}
                onChange={(e) => setExpense(Number(e.target.value))}
                className="range-slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono select-none">
                <span>{t("ui.savingscalculator.1000")}</span>
                <span>{t("ui.savingscalculator.25000")}</span>
                <span>{t("ui.savingscalculator.50000")}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{t("ui.savingscalculator.quickSelect")}</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((val) => (
                <button
                  key={val}
                  onClick={() => setExpense(val)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-150 cursor-pointer ${
                    expense === val
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-muted/60 text-muted-foreground border-border/60 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  ৳{fmt(val)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-4">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-primary">{t("ui.savingscalculator.freeForFoundingMember")}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {t("ui.savingscalculator.freeForFoundingMemberDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Receipt Breakdown */}
        <div className="bg-background dark:bg-slate-900 rounded-3xl border border-border/80 shadow-sm overflow-hidden flex flex-col">

          <div className="bg-gradient-to-br from-primary/10 via-emerald-500/5 to-transparent dark:from-primary/15 dark:via-emerald-500/10 p-7 border-b border-border/60">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              {t("ui.savingscalculator.youSaveLabel")}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-primary font-mono tabular-nums leading-none">
                ৳{fmt(netSavings)}
              </span>
              <CheckCircle2 className="h-6 w-6 text-primary mb-1" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("ui.savingscalculator.excluding500AnnualFee")}
            </p>
          </div>

          <div className="flex-1 p-6 space-y-0">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingDown className="h-3.5 w-3.5" />
              {t("ui.savingscalculator.breakdownTitle")}
            </p>

            <div className="space-y-0 font-mono text-sm">
              <div className="flex items-center justify-between py-3 border-b border-dashed border-border/60">
                <span className="text-secondary/80 dark:text-slate-300 text-sm">
                  {t("ui.savingscalculator.annualExpenseRow")}
                </span>
                <span className="font-semibold text-secondary dark:text-white tabular-nums">
                  ৳{fmt(annualExpense)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-dashed border-border/60">
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                  {t("ui.savingscalculator.discountRow")}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  − ৳{fmt(annualDiscount)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/60">
                <span className="text-rose-500 dark:text-rose-400 text-sm">
                  {t("ui.savingscalculator.membershipFeeRow")}
                </span>
                <span className="font-semibold text-rose-500 dark:text-rose-400 tabular-nums">
                  − ৳{fmt(membershipFee)}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 px-3 mt-2">
                <span className="font-bold text-primary text-base">
                  ✅ {t("ui.savingscalculator.netSavingsRow")}
                </span>
                <span className="text-xl font-extrabold text-primary tabular-nums">
                  ৳{fmt(netSavings)}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground pt-4 leading-relaxed">
              {t("ui.savingscalculator.savingsAmountMayVaryBased")}
            </p>
          </div>

          <div className="p-6 pt-0">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl btn-glow gap-2 text-base"
              >
                {t("ui.savingscalculator.becomeAMemberTodayFree")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
