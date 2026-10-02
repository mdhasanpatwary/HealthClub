"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, ArrowRight, Building2, Stethoscope } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface DoctorMemberBenefitHookProps {
  doctorName?: string;
  specialty?: string;
  variant?: "mobile-above-fold" | "sidebar";
  className?: string;
}

export function DoctorMemberBenefitHook({
  doctorName,
  specialty,
  variant = "mobile-above-fold",
  className = "",
}: DoctorMemberBenefitHookProps) {
  const isMobileAboveFold = variant === "mobile-above-fold";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-teal-500/10 p-4 sm:p-5 shadow-xs transition-all ${
        isMobileAboveFold ? "block lg:hidden" : "hidden lg:block"
      } ${className}`}
    >
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative space-y-3.5">
        {/* Header badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="h-6 w-6 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              মেম্বার সুবিধা • ফেনী সদর
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
            ১০০% ফ্রি কার্ড
          </span>
        </div>

        {/* Main Title & Contextual Hook */}
        <div className="space-y-1">
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-foreground leading-snug">
            {doctorName ? `${doctorName}-এর টেস্টে` : "ডাক্তার দেখানোর পর টেস্টে"}{" "}
            <span className="text-primary font-black">১০-৩০% মেম্বার ছাড়</span> চান?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {specialty ? `${specialty} কনসাল্টেশনের পর` : "ডাক্তার ভিজিটের পর"} প্রেসক্রিপশনের সকল প্যাথলজি ও ডায়াগনস্টিক টেস্টে ফেনী সদরের পার্টনার হাসপাতাল ও ল্যাবগুলোতে পান ১০-৩০% নিশ্চিত ডিসকাউন্ট।
          </p>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-1 gap-2 pt-0.5 text-xs text-foreground/90 font-medium">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-[11px] sm:text-xs">প্রেসক্রিপশন টেস্টে ১০-৩০% বিশেষ ছাড়</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-[11px] sm:text-xs">ফেনী সদরের শীর্ষ পার্টনার ডায়াগনস্টিক সেন্টারে কার্যকর</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">ডিজিটাল কার্ড সাথে থাকলেই ইনস্ট্যান্ট ডিসকাউন্ট</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex flex-col sm:flex-row gap-2">
          <Link
            href="/membership"
            onClick={() => {
              trackEvent("membership_funnel", {
                step: "serial_cta_click",
                source: isMobileAboveFold
                  ? `doctor_mobile_above_fold_${doctorName || "profile"}`
                  : `doctor_sidebar_${doctorName || "profile"}`,
              });
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-md shadow-primary/20 hover:shadow-primary/30"
          >
            <span>১ মিনিটে ফ্রি মেম্বার কার্ড নিন</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/partner-hospitals"
            className="inline-flex items-center justify-center py-2.5 px-3 rounded-xl border border-border bg-background/80 hover:bg-muted text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors text-center"
          >
            পার্টনার তালিকা
          </Link>
        </div>

        {/* Bottom micro-reassurance */}
        <p className="text-[10px] text-muted-foreground/85 text-center sm:text-left pt-0.5">
          ✓ কোনো প্রি-পেমেন্ট নেই • চেম্বার বা ল্যাব ভিজিটের পূর্বেই ফ্রি কার্ড সংগ্রহ করুন
        </p>
      </div>
    </div>
  );
}
