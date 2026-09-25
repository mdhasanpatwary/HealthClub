"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingDown, Sparkles, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function SavingsCalculator() {
  const [expense, setExpense] = useState<number>(10000);

  const discountRate = 0.10;
  const annualExpense = expense * 12;
  const annualDiscount = Math.round(annualExpense * discountRate);
  const membershipFee = 500;
  const netSavings = Math.max(0, annualDiscount - membershipFee);

  const fmt = (n: number) => n.toLocaleString("bn-BD");

  const presets = [5000, 10000, 20000, 30000];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10 space-y-2 sm:space-y-3 px-1">
        <span className="section-label">সেভিংস ক্যালকুলেটর</span>
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary dark:text-white mt-2 sm:mt-3 leading-tight">
          স্লাইডার ঘুরিয়ে আপনার বার্ষিক সম্ভাব্য সাশ্রয় দেখুন
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          আপনার পরিবারের প্রতি মাসের আনুমানিক চিকিৎসা খরচ নির্বাচন করুন এবং দেখুন হেলথ ক্লাব মেম্বার হিসেবে বছরে কত টাকা সাশ্রয় হতে পারে।
        </p>
      </div>

      {/* ── MOBILE LAYOUT: single unified card ── */}
      <div className="lg:hidden space-y-4">
        {/* Mobile: savings result at top so user sees it immediately */}
        <div className="bg-gradient-to-br from-primary/10 via-emerald-500/5 to-background dark:from-primary/15 dark:via-emerald-500/8 dark:to-slate-900 rounded-2xl border border-primary/25 p-5">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
            আপনার সম্ভাব্য বার্ষিক সাশ্রয়
          </p>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-4xl font-extrabold text-primary font-mono tabular-nums leading-none">
              ৳{fmt(netSavings)}
            </span>
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
          </div>
        </div>

        {/* Mobile: Expense input card */}
        <div className="bg-background dark:bg-slate-900 rounded-2xl border border-border/80 p-5 space-y-4 shadow-sm">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              মাসিক চিকিৎসা ব্যয়
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-secondary dark:text-white font-mono tabular-nums">
                ৳{fmt(expense)}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                টাকা / মাস
              </span>
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
              aria-label="মাসিক চিকিৎসা ব্যয়"
              aria-valuemin={1000}
              aria-valuemax={50000}
              aria-valuenow={expense}
              aria-valuetext={`৳${fmt(expense)} টাকা`}
              className="range-slider touch-pan-x"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono select-none">
              <span>৳১,০০০</span>
              <span>৳২৫,০০০</span>
              <span>৳৫০,০০০</span>
            </div>
          </div>

          {/* Preset chips */}
          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground">দ্রুত নির্বাচন:</p>
            <div className="grid grid-cols-4 gap-2">
              {presets.map((val) => (
                <button
                  key={val}
                  onClick={() => setExpense(val)}
                  aria-pressed={expense === val}
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
            হিসাবের বিবরণ (বাৎসরিক)
          </p>

          {/* Rows */}
          <div className="font-mono text-xs space-y-0">
            <div className="flex items-center justify-between py-2.5 border-b border-dashed border-border/60">
              <span className="text-secondary/80 dark:text-slate-300">আনুমানিক বাৎসরিক খরচ (১২ মাস)</span>
              <span className="font-semibold text-secondary dark:text-white tabular-nums">৳{fmt(annualExpense)}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-dashed border-border/60">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">মেম্বারশিপ সুবিধা (১০-৩০% ছাড়ের গড়)</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">− ৳{fmt(annualDiscount)}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-border/60">
              <span className="text-rose-500 dark:text-rose-400">মেম্বারশিপ কার্ড ফি</span>
              <span className="font-semibold text-rose-500 dark:text-rose-400 tabular-nums">− ৳{fmt(membershipFee)}</span>
            </div>
            <div className="flex items-center justify-between py-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 px-3 mt-2">
              <span className="font-bold text-primary text-xs">✅ নিট বার্ষিক সাশ্রয়</span>
              <span className="text-base font-extrabold text-primary tabular-nums">৳{fmt(netSavings)}</span>
            </div>
          </div>
        </div>

        {/* Mobile: Founding member + CTA */}
        <div className="flex items-start gap-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-primary">ফাউন্ডিং মেম্বারদের জন্য আজীবন ফ্রি!</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              প্রথম ব্যাচে নিবন্ধন করলে কোনো বাৎসরিক নবায়ন ফি নেই। আজীবন মেম্বারশিপ উপভোগ করুন।
            </p>
          </div>
        </div>

        <Link
          href="/register"
          className={buttonVariants({
            size: "xl",
            className: "w-full",
          })}
        >
          <span>আজই মেম্বার হয়ে সাশ্রয় শুরু করুন</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ── DESKTOP LAYOUT: two-column side-by-side ── */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Input Panel */}
        <div className="bg-background dark:bg-slate-900 rounded-3xl border border-border/80 p-7 space-y-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                মাসিক চিকিৎসা ব্যয়
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-secondary dark:text-white font-mono tabular-nums">
                  ৳{fmt(expense)}
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  টাকা / মাস
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
                aria-label="মাসিক চিকিৎসা ব্যয়"
                aria-valuemin={1000}
                aria-valuemax={50000}
                aria-valuenow={expense}
                aria-valuetext={`৳${fmt(expense)} টাকা`}
                className="range-slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono select-none">
                <span>৳১,০০০</span>
                <span>৳২৫,০০০</span>
                <span>৳৫০,০০০</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs text-muted-foreground">দ্রুত নির্বাচন:</p>
              <div className="flex gap-2">
                {presets.map((val) => (
                  <button
                    key={val}
                    onClick={() => setExpense(val)}
                    aria-pressed={expense === val}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all duration-150 cursor-pointer ${
                      expense === val
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    ৳{fmt(val)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-4">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-primary">ফাউন্ডিং মেম্বারদের জন্য আজীবন ফ্রি!</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                প্রথম ব্যাচে নিবন্ধন করলে কোনো বাৎসরিক নবায়ন ফি নেই। আজীবন মেম্বারশিপ উপভোগ করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Right: Output Receipt */}
        <div className="bg-background dark:bg-slate-900 rounded-3xl border border-border/80 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="p-7 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  সাশ্রয় প্রক্ষেপণ
                </p>
                <p className="font-heading text-lg font-bold text-secondary dark:text-white mt-0.5">
                  ১ বছরের আনুমানিক সাশ্রয়
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>

            <div className="font-mono space-y-0 text-sm">
              <div className="flex items-center justify-between py-3 border-b border-dashed border-border/60">
                <span className="text-muted-foreground">
                  আনুমানিক বাৎসরিক খরচ (১২ মাস)
                </span>
                <span className="font-semibold text-secondary dark:text-white tabular-nums">
                  ৳{fmt(annualExpense)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-dashed border-border/60">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  মেম্বারশিপ সুবিধা (১০-৩০% ছাড়ের গড়)
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  − ৳{fmt(annualDiscount)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/60">
                <span className="text-rose-500 dark:text-rose-400">
                  মেম্বারশিপ কার্ড ফি
                </span>
                <span className="font-semibold text-rose-500 dark:text-rose-400 tabular-nums">
                  − ৳{fmt(membershipFee)}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 px-3 mt-4">
                <span className="font-bold text-primary text-base">
                  ✅ নিট বার্ষিক সাশ্রয়
                </span>
                <span className="text-xl font-extrabold text-primary tabular-nums">
                  ৳{fmt(netSavings)}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground pt-4 leading-relaxed">
              * সাশ্রয়ের পরিমাণ হাসপাতাল, ডায়াগনস্টিক টেস্ট ও চিকিৎসাসেবার ধরণের ওপর নির্ভর করে কম বা বেশি হতে পারে।
            </p>
          </div>

          <div className="p-6 pt-0">
            <Link
              href="/register"
              className={buttonVariants({
                size: "xl",
                className: "w-full",
              })}
            >
              <span>আজই মেম্বার হয়ে সাশ্রয় শুরু করুন</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
