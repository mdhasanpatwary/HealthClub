import Link from "next/link";
import { Star, ShieldCheck, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingPricing() {
  const freePerks = [
    "হাসপাতাল ও টেস্টে ১০-২৫% নিশ্চিত ডিসকাউন্ট",
    "১টি কার্ডে পরিবার ও সকল আত্মীয়দের ডিসকাউন্ট কভারেজ",
    "ডিজিটাল মেম্বারশিপ কার্ড ও ভেরিফাইড কিউআর",
    "সম্পূর্ণ বিনামূল্যে মেম্বারশিপ (কোনো ফি নেই)",
  ];

  const premiumPerks = [
    "হাসপাতাল ও টেস্টে ১৫-৩০% সর্বোচ্চ ডিসকাউন্ট",
    "প্রাইওরিটি কাস্টমার সাপোর্ট ও হেল্পলাইন সেবা",
    "ডাক্তার চেম্বার ও সিরিয়ালে অগ্রাধিকার সুবিধা",
    "১টি কার্ডে পরিবার ও সকল আত্মীয়দের ডিসকাউন্ট কভারেজ",
    "প্রিমিয়াম ডিজিটাল মেম্বারশিপ কার্ড ও কিউআর",
  ];

  return (
    <section className="py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-14">
        <div className="text-center space-y-2 sm:space-y-4 max-w-2xl mx-auto">
          <span className="section-label">মেম্বারশিপ প্ল্যান</span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-secondary dark:text-white mt-2">
            আপনার প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            ফ্রি মেম্বারশিপে ১০-২৫% ছাড় এবং প্রিমিয়াম মেম্বারশিপে ১৫-৩০% ছাড় ও প্রায়োরিটি সুবিধা।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto items-stretch">
          {/* Plan 1: Free Membership */}
          <div className="relative bg-background dark:bg-slate-900 border-2 border-primary rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-xl shadow-primary/5">
            <div className="absolute -top-3.5 right-6 bg-emerald-800 dark:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              সবচেয়ে জনপ্রিয়
            </div>
            <div className="space-y-6">
              <div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 text-primary">
                  <Star className="h-5 w-5 fill-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">ফ্রি মেম্বারশিপ</h3>
                <p className="text-xs text-muted-foreground mt-1">চিকিৎসায় ১০-২৫% ডিসকাউন্ট উপভোগ করুন</p>
              </div>
              <div className="flex items-baseline gap-2 text-primary">
                <span className="text-5xl font-extrabold font-mono">৳০</span>
                <span className="text-sm font-semibold text-muted-foreground">/ সম্পূর্ণ ফ্রি</span>
              </div>
              <ul className="space-y-3 text-sm">
                {freePerks.map((item, i) => (
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
                <span>ফ্রি জয়েন করুন</span>
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
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">প্রিমিয়াম মেম্বারশিপ</h3>
                <p className="text-xs text-muted-foreground mt-1">১৫-৩০% সর্বোচ্চ ছাড় ও প্রায়োরিটি সাপোর্ট</p>
              </div>
              <div className="flex items-baseline gap-2 text-secondary dark:text-white">
                <span className="text-5xl font-extrabold font-mono">৳৫০০</span>
                <span className="text-sm text-muted-foreground font-semibold">/ বছর</span>
              </div>
              <ul className="space-y-3 text-sm">
                {premiumPerks.map((item, i) => (
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
                href="/register?plan=premium"
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    size: "lg",
                  }),
                  "w-full shadow-md font-bold transition-all hover:shadow-lg"
                )}
              >
                <span>প্রিমিয়াম মেম্বার হোন</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
