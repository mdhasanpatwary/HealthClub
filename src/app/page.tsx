import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Heart, UserPlus, FileText, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import PartnerDirectory from "@/components/ui/PartnerDirectory";
import SavingsCalculator from "@/components/ui/SavingsCalculator";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import FAQSection from "@/components/landing/FAQSection";
import ContactForm from "@/components/landing/ContactForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/30 via-background to-background py-16 sm:py-24">
        
        {/* Background blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-light rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column (7 cols on large screens) */}
            <div className="space-y-6 lg:col-span-7 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <Heart className="h-3 w-3 fill-primary" />
                স্বাস্থ্য সুবিধা মেম্বারশিপ প্ল্যাটফর্ম
              </span>
              
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-secondary dark:text-white leading-tight">
                স্বাস্থ্য সেবা হোক <br className="hidden sm:inline" />
                <span className="text-primary bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">সহজ ও সাশ্রয়ী</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                হেলথ ক্লাবের সদস্য হয়ে যেকোনো পার্টনার হাসপাতালে শুধু ডিজিটাল মেম্বার কার্ড প্রদর্শন করে ফ্ল্যাট ১০% ডিসকাউন্ট উপভোগ করুন।
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold shadow-lg shadow-primary/20">
                    ফ্রি সদস্য হোন
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/partner-hospitals">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-secondary/10 text-secondary bg-white hover:bg-muted dark:bg-slate-800 dark:text-white dark:border-slate-700">
                    পার্টনার হাসপাতাল দেখুন
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/85 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-secondary font-mono">১০০+</p>
                  <p className="text-xs text-muted-foreground">প্রতিষ্ঠাতা সদস্য</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-secondary font-mono">১০+</p>
                  <p className="text-xs text-muted-foreground">পার্টনার হাসপাতাল</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-secondary font-mono">২০+</p>
                  <p className="text-xs text-muted-foreground">ডায়াগনস্টিক সেন্টার</p>
                </div>
              </div>
            </div>

            {/* Right Visual Column (5 cols on large screens) */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Premium digital card preview mock */}
              <div className="relative w-full max-w-sm aspect-[1.586/1] bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 shadow-2xl text-white border border-emerald-500/20 animate-pulse-slow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="flex items-center gap-1 text-primary">
                      <Heart className="h-4 w-4 fill-primary" />
                      <span className="font-heading text-sm font-bold text-white">হেলথ ক্লাব</span>
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono tracking-wider">FOUNDING MEMBERSHIP</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    Founding
                  </div>
                </div>

                <div className="flex justify-between items-end mt-8">
                  <div>
                    <p className="text-[8px] text-slate-500 font-mono">MEMBER NAME</p>
                    <p className="text-sm font-bold font-heading">মোঃ আশরাফুল আলম</p>
                    <p className="text-[10px] text-emerald-400 font-mono mt-1">ID: HC-2026-8910</p>
                  </div>
                  {/* Fake QR */}
                  <div className="bg-white p-1.5 rounded-lg border border-slate-700/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://healthclub.com.bd/verify/HC-2026-8910&color=0f172a&bgcolor=ffffff"
                      alt="Verify QR"
                      width={44}
                      height={44}
                      className="w-11 h-11"
                    />
                  </div>
                </div>

                <div className="flex justify-between border-t border-slate-700/40 pt-2.5 text-[8px] text-slate-400 mt-3 font-mono">
                  <span>JOINED: 2026-01-10</span>
                  <span>VALID THRU: 1 YEAR</span>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute top-[-15px] left-[15px] bg-white dark:bg-slate-800 text-secondary dark:text-white p-2.5 rounded-xl border border-border shadow-lg flex items-center gap-2 transform -rotate-6 animate-bounce-slow">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-xs font-bold">৳০ ১ বছর মেম্বারশিপ</span>
              </div>

              <div className="absolute bottom-[-15px] right-[10px] bg-white dark:bg-slate-800 text-secondary dark:text-white p-2.5 rounded-xl border border-border shadow-lg flex items-center gap-2 transform rotate-3 animate-bounce-slow delay-1000">
                <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <span className="text-primary text-[10px] font-bold">১০%</span>
                </div>
                <span className="text-xs font-bold">টেস্ট ডিসকাউন্ট সুবিধা</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="bg-muted py-12 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-background p-6 rounded-2xl border border-border text-center shadow-sm hover:shadow-md transition-all">
              <p className="text-3xl font-extrabold text-primary font-mono">১০০+</p>
              <h3 className="text-sm font-semibold text-secondary mt-1">ফাউন্ডিং মেম্বার সীমা</h3>
              <p className="text-xs text-muted-foreground mt-1">প্রথম ১০০ জন মেম্বারশিপ একদম ফ্রি পাবেন।</p>
            </div>

            <div className="bg-background p-6 rounded-2xl border border-border text-center shadow-sm hover:shadow-md transition-all">
              <p className="text-3xl font-extrabold text-primary font-mono">১০% ফ্ল্যাট</p>
              <h3 className="text-sm font-semibold text-secondary mt-1">মেডিকেল বিল সাশ্রয়</h3>
              <p className="text-xs text-muted-foreground mt-1">মেম্বার কার্ড শো করলে সকল মেডিকেল বিলে ১০% ছাড়।</p>
            </div>

            <div className="bg-background p-6 rounded-2xl border border-border text-center shadow-sm hover:shadow-md transition-all">
              <p className="text-3xl font-extrabold text-primary font-mono">১০+</p>
              <h3 className="text-sm font-semibold text-secondary mt-1">পার্টনার হাসপাতাল</h3>
              <p className="text-xs text-muted-foreground mt-1">ফেনীর নামকরা হাসপাতাল ও ডায়াগনস্টিক চুক্তিভুক্ত।</p>
            </div>

            <div className="bg-background p-6 rounded-2xl border border-border text-center shadow-sm hover:shadow-md transition-all">
              <p className="text-3xl font-extrabold text-primary font-mono">১০%</p>
              <h3 className="text-sm font-semibold text-secondary mt-1">মডেল ফার্মেসী</h3>
              <p className="text-xs text-muted-foreground mt-1">পার্টনার ফার্মেসী থেকে ঔষধ ক্রয়ে ১০% ছাড়।</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">ব্যবহার বিধি</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white">
              ৩টি সহজ ধাপে সেবা নিন
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              হেলথ ক্লাবের ডিজিটাল মেম্বারশিপ কার্ড ব্যবহার করে হাসপাতালে ডিসকাউন্ট নেওয়া একদম সহজ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="space-y-4 p-6 rounded-2xl bg-muted/40 border border-border/60 hover:border-primary/20 transition-colors relative group">
              <div className="h-12 w-12 rounded-full bg-primary-light text-primary font-heading text-xl font-bold flex items-center justify-center mx-auto border border-primary/20">
                ১
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">মেম্বার রেজিস্ট্রেশন</h3>
              <p className="text-sm text-muted-foreground">
                আপনার নাম, মোবাইল নম্বর এবং ইমেইল দিয়ে ফাউন্ডিং মেম্বার হিসেবে ফ্রী রেজিস্ট্রেশন সম্পন্ন করুন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 p-6 rounded-2xl bg-muted/40 border border-border/60 hover:border-primary/20 transition-colors relative group">
              <div className="h-12 w-12 rounded-full bg-primary-light text-primary font-heading text-xl font-bold flex items-center justify-center mx-auto border border-primary/20">
                ২
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">ডিজিটাল মেম্বার আইডি সংগ্রহ</h3>
              <p className="text-sm text-muted-foreground">
                মেম্বার ড্যাশবোর্ডে লগইন করে আপনার কিউআর কোড যুক্ত ডিজিটাল মেম্বারশিপ কার্ড ডাউনলোড করুন।
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 p-6 rounded-2xl bg-muted/40 border border-border/60 hover:border-primary/20 transition-colors relative group">
              <div className="h-12 w-12 rounded-full bg-primary-light text-primary font-heading text-xl font-bold flex items-center justify-center mx-auto border border-primary/20">
                ৩
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">হাসপাতালে ডিসকাউন্ট পান</h3>
              <p className="text-sm text-muted-foreground">
                পার্টনার হাসপাতালে চিকিৎসা বিল পে করার আগে আপনার ডিজিটাল কার্ডটি দেখিয়ে ডিসকাউন্ট উপভোগ করুন।
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MEMBERSHIP BENEFITS SECTION */}
      <section id="benefits" className="py-16 sm:py-24 bg-muted/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">মেম্বারশিপ সুবিধা</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white">
              মেম্বারদের জন্য এক্সক্লুসিভ সুবিধাসমূহ
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              হেলথ ক্লাব কার্ডের মাধ্যমে প্রতিটি মেম্বার এবং তাদের পরিবার পান মানসম্মত ও সাশ্রয়ী স্বাস্থ্যসেবা সুবিধা।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Benefit 1 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">হাসপাতাল ডিসকাউন্ট</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                পার্টনার হাসপাতালের যেকোনো বিল পরিশোধের সময় মেম্বার কার্ড শো করলে ফ্ল্যাট ১০% ডিসকাউন্ট।
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">ডায়াগনস্টিক ডিসকাউন্ট</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                রক্ত পরীক্ষা, এক্স-রে, এমআরআই, সিটি স্ক্যান সহ সকল প্যাথলজিক্যাল ও ইমেজিং টেস্টে ১০% ফ্ল্যাট ছাড়।
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">ডিজিটাল মেম্বারশিপ কার্ড</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                মোবাইলেই ডিজিটাল কার্ড সংরক্ষণ করে যেকোনো পার্টনার চিকিৎসাকেন্দ্রে সহজেই ছাড় উপভোগ করুন।
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">স্বাস্থ্য ক্যাম্প অ্যাক্সেস</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                দেশব্যাপী আমাদের ফ্রি হেলথ চেকআপ ক্যাম্প ও বিশেষ সচেতনতামূলক স্বাস্থ্য প্রোগ্রামে সরাসরি অংশগ্রহণ সুবিধা।
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">পারিবারিক সাশ্রয়</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                পরিবারের যেকোনো সদস্যের চিকিৎসার জন্য মেম্বারশিপ কার্ড প্রদর্শন করে তাৎক্ষণিক ১০% ছাড় দাবি করতে পারেন।
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">পারিবারিক কভারেজ</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                একটি মাত্র ফ্যামিলি মেম্বারশিপ সাবস্ক্রিপশন নিয়ে পরিবারের সকল সদস্যের স্বাস্থ্যসেবা বিল সাশ্রয় করুন।
              </p>
            </div>

            {/* Benefit 7 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">ভবিষ্যৎ স্বাস্থ্য সুবিধা</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                নতুন যেকোনো মেডিকেল অফার ও সরকারি-বেসরকারি চিকিৎসাকেন্দ্রের পার্টনারশিপ বেনিফিট স্বয়ংক্রিয়ভাবে আপডেট পাবেন।
              </p>
            </div>

            {/* Benefit 8 */}
            <div className="bg-background p-6 rounded-2xl border border-border hover:shadow-md transition-all space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-secondary">ফার্মেসী ডিসকাউন্ট অফার</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                নির্ধারিত ও নির্বাচিত কিছু স্বনামধন্য মডেল ফার্মেসীতে প্রয়োজনীয় ঔষধ কেনাকাটায় সরাসরি ১০% ফ্ল্যাট ছাড়।
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PRICING PLANS SECTION */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">মেম্বারশিপ প্ল্যান</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white">
              আপনার প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              আমরা প্রথম ১০০ মেম্বারকে দিচ্ছি ১ বছর ফ্রি প্রতিষ্ঠাতা স্ট্যাটাস।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* Plan 1: Founding (Highlighted) */}
            <div className="bg-gradient-to-b from-primary-light/50 to-background border-2 border-primary rounded-3xl p-8 relative flex flex-col justify-between shadow-xl ring-4 ring-primary/10">
              <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                সীমিত অফার
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-xl font-bold text-secondary">Founding Member</h3>
                  <p className="text-xs text-muted-foreground mt-1">প্রথম ১০০ জন ফাউন্ডিং মেম্বারশিপ পাবেন।</p>
                </div>
                <div className="flex items-baseline gap-1 text-secondary dark:text-white">
                  <span className="text-4xl font-extrabold font-mono">৳০</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ ১ বছর ফ্রি</span>
                </div>
                <ul className="space-y-3 text-sm text-secondary/80">
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>১ জন সদস্য কভারেজ</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>১ বছর মেম্বারশিপ</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>সকল পার্টনার হাসপাতালে ডিসকাউন্ট</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>ডিজিটাল মেম্বারশিপ কার্ড ও ভেরিফাইড কিউআর</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/register">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                    ফ্রি জয়েন করুন
                  </Button>
                </Link>
              </div>
            </div>

            {/* Plan 2: Individual */}
            <div className="bg-background border border-border rounded-3xl p-8 flex flex-col justify-between shadow-md">
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">Individual Membership</h3>
                  <p className="text-xs text-muted-foreground mt-1">একক সদস্যদের বাৎসরিক কার্ড ও সুবিধা।</p>
                </div>
                <div className="flex items-baseline gap-1 text-secondary dark:text-white">
                  <span className="text-4xl font-extrabold font-mono">৳৫০০</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ বাৎসরিক সাবস্ক্রিপশন</span>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>১ জন সদস্য কভারেজ</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>বাৎসরিক রিনিউয়াল সাপেক্ষে মেয়াদ বৃদ্ধি</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>সকল পার্টনার হাসপাতালে ডিসকাউন্ট</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>ডিজিটাল মেম্বারশিপ কার্ড ও ভেরিফাইড কিউআর</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/register?plan=individual">
                  <Button variant="outline" className="w-full border-border hover:bg-muted text-secondary dark:text-white">
                    প্ল্যান কিনুন
                  </Button>
                </Link>
              </div>
            </div>

            {/* Plan 3: Family */}
            <div className="bg-background border border-border rounded-3xl p-8 flex flex-col justify-between shadow-md relative">
              <div className="absolute top-4 right-4 bg-primary-light text-primary text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-primary/20">
                সেরা ভ্যালু
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">Family Membership</h3>
                  <p className="text-xs text-muted-foreground mt-1">পরিবারের একাধিক সদস্যদের যৌথ কার্ড সুবিধা।</p>
                </div>
                <div className="flex items-baseline gap-1 text-secondary dark:text-white">
                  <span className="text-4xl font-extrabold font-mono">৳১,৫০০</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ বাৎসরিক সাবস্ক্রিপশন</span>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-secondary dark:text-white font-semibold">অনূর্ধ্ব ৪ জন পরিবার সদস্য কভারেজ</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>সকল সদস্যদের জন্য আলাদা ডিজিটাল কার্ড</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>সকল পার্টনার হাসপাতালে ডিসকাউন্ট</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>পারিবারিক যৌথ কভারেজ ও বিল সাশ্রয়</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link href="/register?plan=family">
                  <Button variant="outline" className="w-full border-border hover:bg-muted text-secondary dark:text-white">
                    প্ল্যান কিনুন
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. PARTNER DIRECTORY PREVIEW */}
      <section className="py-16 sm:py-24 bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-extrabold text-primary tracking-widest uppercase">অংশীদার চিকিৎসাকেন্দ্র</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white">
                আমাদের পার্টনার হাসপাতাল ও ডায়াগনস্টিকসমূহ
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                হেলথ ক্লাবের সাথে চুক্তিবদ্ধ দেশের শীর্ষস্থানীয় হাসপাতাল ও ল্যাবগুলোতে বিশেষ ছাড়ের সুবিধা পান।
              </p>
            </div>
            <Link href="/partner-hospitals" className="shrink-0 self-center md:self-end">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-light">
                সকল পার্টনার ও ডিটেইলস দেখুন
              </Button>
            </Link>
          </div>

          {/* Directory showing only 3 cards without the categories filter layout */}
          <PartnerDirectory limit={3} showFilters={false} />

        </div>
      </section>

      {/* 7. SAVINGS CALCULATOR SECTION */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SavingsCalculator />
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="py-16 sm:py-24 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">মেম্বারদের অভিজ্ঞতা</span>
            <h2 className="font-heading text-3xl font-bold text-secondary dark:text-white">
              আমাদের সদস্যদের বাস্তব সঞ্চয়ের গল্প
            </h2>
          </div>

          <TestimonialCarousel />

        </div>
      </section>

      {/* 9. WHY CHOOSE - COMPARISON TABLE */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">তুলনামূলক বিবরণী</span>
            <h2 className="font-heading text-3xl font-bold text-secondary dark:text-white">
              হেলথ ক্লাব মেম্বারশিপের উপযোগিতা
            </h2>
            <p className="text-sm text-muted-foreground">
              সাধারণ চিকিৎসা ব্যয় এবং হেলথ ক্লাব মেম্বারশিপ মেয়াদের চিকিৎসা ব্যয়ের মধ্যে একটি স্পষ্ট তুলনা দেখুন।
            </p>
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-border shadow-md">
            <table className="w-full text-left border-collapse bg-background">
              <thead>
                <tr className="bg-secondary text-white font-heading text-sm sm:text-base border-b border-border">
                  <th className="p-4 md:p-5 font-semibold">সুবিধাসমূহ</th>
                  <th className="p-4 md:p-5 font-semibold text-slate-300">মেম্বারশিপ ছাড়া</th>
                  <th className="p-4 md:p-5 font-semibold text-primary">হেলথ ক্লাব মেম্বারশিপ সহ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs sm:text-sm text-secondary/80">
                <tr>
                  <td className="p-4 md:p-5 font-bold text-secondary">চিকিৎসা টেস্ট ফি (Diagnostic Expense)</td>
                  <td className="p-4 md:p-5">শতভাগ সম্পুর্ণ ফি প্রদান করতে হয়</td>
                  <td className="p-4 md:p-5 font-semibold text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    ১০% ফ্ল্যাট ডিসকাউন্ট সুবিধা
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:p-5 font-bold text-secondary">হাসপাতাল বেড ও ক্যাবিন চার্জ</td>
                  <td className="p-4 md:p-5">কোনো ছাড় ছাড়া নিয়মিত ভাড়া প্রযোজ্য</td>
                  <td className="p-4 md:p-5 font-semibold text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    ১০% ফ্ল্যাট ডিসকাউন্ট সুবিধা
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:p-5 font-bold text-secondary">২৪/৭ কাস্টমার সাপোর্ট হেল্পলাইন</td>
                  <td className="p-4 md:p-5">কোনো আলাদা গাইডলাইন বা সাপোর্ট ডেস্ক নেই</td>
                  <td className="p-4 md:p-5 font-semibold text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    মেডিকেল সাপোর্ট ও হাসপাতাল বুকিং অ্যাসিস্ট্যান্স
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 10. MOBILE APP PREVIEW (COMING SOON) */}
      <section className="py-16 sm:py-24 bg-muted/40 border-y border-border overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30">
                COMING SOON
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-secondary dark:text-white leading-tight">
                শীঘ্রই আসছে আমাদের <br />
                হেলথ ক্লাব মোবাইল অ্যাপ
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                মোবাইল অ্যাপের মাধ্যমে আপনার মেম্বারশিপ সার্ভিস হবে আরও গতিশীল। ডিজিটাল কার্ড দেখানো, পার্টনার হাসপাতাল খোঁজা এবং ডিসকাউন্ট ট্র্যাকিং করতে পারবেন এক ট্যাপেই।
              </p>
              
              <ul className="space-y-2 text-sm text-left max-w-md mx-auto lg:mx-0">
                <li className="flex items-center gap-2 text-secondary dark:text-slate-300 font-medium">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  ডিজিটাল মেম্বারশিপ আইডি কার্ড (অফলাইন ব্যবহারের সুবিধা)
                </li>
                <li className="flex items-center gap-2 text-secondary dark:text-slate-300 font-medium">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  নিকটস্থ পার্টনার হাসপাতালের ম্যাপ লোকেশন ও সার্চ
                </li>
                <li className="flex items-center gap-2 text-secondary dark:text-slate-300 font-medium">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  নিকটস্থ পার্টনার ডায়াগনস্টিক ও ল্যাব সার্চ
                </li>
                <li className="flex items-center gap-2 text-secondary dark:text-slate-300 font-medium">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  জমে থাকা মোট সঞ্চয় ও ডিসকাউন্টের বিবরণী ট্র্যাকিং
                </li>
              </ul>
            </div>

            {/* Right Visual (App Mockup) */}
            <div className="relative flex justify-center">
              
              {/* Phone Mockup Frame */}
              <div className="relative w-56 h-[440px] bg-slate-950 rounded-[32px] border-4 border-slate-800 shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-b-xl z-20" />
                
                {/* App Screen Content */}
                <div className="bg-slate-900 rounded-[22px] flex-1 flex flex-col justify-between p-3 text-white overflow-hidden relative">
                  
                  {/* App Header */}
                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <span className="font-bold text-primary flex items-center gap-0.5">
                      <Heart className="h-2.5 w-2.5 fill-primary text-primary" />
                      হেলথ ক্লাব
                    </span>
                    <span className="text-slate-400 font-mono">HC-1001</span>
                  </div>

                  {/* App Miniature Card */}
                  <div className="bg-gradient-to-br from-slate-950 to-emerald-950 rounded-lg p-2.5 border border-emerald-500/20 text-left my-2">
                    <p className="text-[6px] text-slate-500 font-mono">MEMBER NAME</p>
                    <p className="text-[10px] font-bold font-heading text-white truncate">মোঃ আব্দুর রহমান</p>
                    
                    {/* Mini QR */}
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-[8px] font-mono text-emerald-400">FOUNDING</span>
                      <div className="bg-white p-0.5 rounded-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=HC-1001&color=0f172a&bgcolor=ffffff"
                          alt="QR code"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* App Quick Menu */}
                  <div className="space-y-1.5 flex-1">
                    <p className="text-[8px] text-slate-500 font-bold text-left mb-1 uppercase tracking-wider">Features</p>
                    
                    <div className="bg-slate-800/80 p-2 rounded-lg text-left flex items-center gap-2">
                      <div className="h-5 w-5 bg-primary/20 text-primary flex items-center justify-center rounded-md shrink-0">
                        <span className="text-[8px] font-bold">🏥</span>
                      </div>
                      <span className="text-[9px] font-semibold">নিকটস্থ হাসপাতাল</span>
                    </div>

                    <div className="bg-slate-800/80 p-2 rounded-lg text-left flex items-center gap-2">
                      <div className="h-5 w-5 bg-indigo-500/20 text-indigo-500 flex items-center justify-center rounded-md shrink-0">
                        <span className="text-[8px] font-bold">🧪</span>
                      </div>
                      <span className="text-[9px] font-semibold">ল্যাব টেস্ট ছাড়</span>
                    </div>

                    <div className="bg-slate-800/80 p-2 rounded-lg text-left flex items-center gap-2">
                      <div className="h-5 w-5 bg-amber-500/20 text-amber-500 flex items-center justify-center rounded-md shrink-0">
                        <span className="text-[8px] font-bold">💊</span>
                      </div>
                      <span className="text-[9px] font-semibold">ডিসকাউন্ট ঔষধ</span>
                    </div>
                  </div>

                  {/* App Bottom nav */}
                  <div className="border-t border-slate-800 pt-1.5 flex justify-around text-[8px] text-slate-500">
                    <span className="text-primary font-bold">Home</span>
                    <span>Search</span>
                    <span>Profile</span>
                  </div>

                </div>

              </div>

              {/* Decorative Circle accents behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-primary/20 -z-10 animate-ping-slow" />

            </div>

          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">প্রশ্ন ও উত্তর</span>
            <h2 className="font-heading text-3xl font-bold text-secondary dark:text-white">
              সাধারণ জিজ্ঞাসা (FAQ)
            </h2>
            <p className="text-sm text-muted-foreground">
              হেলথ ক্লাব মেম্বারশিপ সার্ভিস নিয়ে সচরাচর জানতে চাওয়া প্রশ্নগুলোর উত্তর নিচে খুঁজে পাবেন।
            </p>
          </div>

          <FAQSection />

        </div>
      </section>

      {/* 12. CONTACT SECTION */}
      <section className="py-16 sm:py-24 bg-muted/30 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase">যোগাযোগ করুন</span>
            <h2 className="font-heading text-3xl font-bold text-secondary dark:text-white">
              আপনার যেকোনো জিজ্ঞাসা জানাতে পারেন
            </h2>
            <p className="text-sm text-muted-foreground">
              মেম্বারশিপ সুবিধা বুঝতে অসুবিধা হচ্ছে অথবা আপনি কি পার্টনার হতে চান? আমাদের মেসেজ পাঠান।
            </p>
          </div>

          <ContactForm />

        </div>
      </section>

    </div>
  );
}
