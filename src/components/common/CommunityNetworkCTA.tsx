"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Heart, Building2, PhoneCall, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { BloodDonorRegisterDialog } from "@/app/emergency/components/BloodDonorRegisterDialog";
import { AmbulanceRegisterDialog } from "@/app/emergency/components/AmbulanceRegisterDialog";

export default function CommunityNetworkCTA() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false);

  return (
    <section
      aria-labelledby="community-network-heading"
      className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pt-6"
    >
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto px-4">
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          {isEn ? "Community Collaboration" : "জরুরি স্বাস্থ্য সহায়তা নেটওয়ার্ক"}
        </Badge>
        <h2
          id="community-network-heading"
          className="font-heading text-xl sm:text-3xl md:text-4xl font-bold text-secondary dark:text-white"
        >
          {isEn
            ? "Join Feni's Life-Saving Emergency Network"
            : "ফেনীর জরুরি স্বাস্থ্য নেটওয়ার্কে অংশীদার হোন"}
        </h2>
        <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
          {isEn
            ? "Whether you operate an ambulance, donate blood, or manage a healthcare clinic—connect with Health Club to help patients across Feni."
            : "আপনি অ্যাম্বুলেন্স চালক, রক্তদাতা কিংবা স্বাস্থ্যসেবা প্রতিষ্ঠান যাই হোন না কেন—সবার জন্য রয়েছে আলাদা ডেডিকেটেড যুক্ত হওয়ার সুবিধা।"}
        </p>
      </div>

      {/* 3 Dedicated Pathway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-4">
        {/* 1. Ambulance Operators */}
        <Card className="border border-border/80 bg-gradient-to-b from-primary/5 via-card to-card hover:border-primary/40 hover:shadow-md transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden">
          <CardContent className="p-5 sm:p-6 space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                  <Truck className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-2xs font-bold text-primary border-primary/30">
                  {isEn ? "Ambulance Operator" : "অ্যাম্বুলেন্স চালক/মালিক"}
                </Badge>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-secondary dark:text-white">
                  {isEn ? "List Your Ambulance" : "অ্যাম্বুলেন্স তালিকাভুক্ত করুন"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isEn
                    ? "Register your ICU, AC, or Non-AC ambulance to receive direct 24/7 patient dispatch calls across Feni."
                    : "ফেনীর ২৪/৭ জরুরি অ্যাম্বুলেন্স তালিকায় আপনার গাড়ির ধরন, স্ট্যান্ড ও ফোন নম্বর যুক্ত করুন।"}
                </p>
              </div>

              <ul className="text-2xs sm:text-xs text-muted-foreground space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{isEn ? "Free public directory listing" : "সম্পূর্ণ ফ্রি তালিকাভুক্তি"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{isEn ? "Direct call without middlemen" : "দালালমুক্ত সরাসরি রোগীর কল"}</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setIsAmbulanceModalOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl mt-2"
            >
              <Truck className="mr-2 h-4 w-4" />
              {isEn ? "Add Ambulance" : "অ্যাম্বুলেন্স যুক্ত করুন"}
            </Button>
          </CardContent>
        </Card>

        {/* 2. Blood Donors & Clubs */}
        <Card className="border border-border/80 bg-gradient-to-b from-rose-500/5 via-card to-card hover:border-rose-500/40 hover:shadow-md transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden">
          <CardContent className="p-5 sm:p-6 space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shadow-2xs">
                  <Heart className="h-6 w-6 fill-rose-500/20" />
                </div>
                <Badge variant="outline" className="text-2xs font-bold text-rose-600 border-rose-500/30">
                  {isEn ? "Blood Donor / Club" : "রক্তদাতা / ব্লাড ব্যাংক"}
                </Badge>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-secondary dark:text-white">
                  {isEn ? "Join Blood Donor Network" : "রক্তদাতা নেটওয়ার্কে যোগ দিন"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isEn
                    ? "Join as a voluntary blood donor or list your club hotline to save lives of critical patients in Feni."
                    : "জরুরি রক্তের প্রয়োজনে মুমূর্ষু রোগীর পাশে দাঁড়াতে রক্তদাতা হিসেবে নাম ও রক্তের গ্রুপ নিবন্ধন করুন।"}
                </p>
              </div>

              <ul className="text-2xs sm:text-xs text-muted-foreground space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>{isEn ? "Group & upazila-wise matching" : "উপজেলা অনুযায়ী দ্রুত কল পাওয়া"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>{isEn ? "100% voluntary & humanitarian" : "১০০% মানবিক ও সেবামূলক"}</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setIsDonorModalOpen(true)}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl mt-2"
            >
              <Heart className="mr-2 h-4 w-4 fill-white" />
              {isEn ? "Become a Donor" : "রক্তদাতা হিসেবে যুক্ত হোন"}
            </Button>
          </CardContent>
        </Card>

        {/* 3. Healthcare Providers & Partners */}
        <Card className="border border-border/80 bg-gradient-to-b from-blue-500/5 via-card to-card hover:border-blue-500/40 hover:shadow-md transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden">
          <CardContent className="p-5 sm:p-6 space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shadow-2xs">
                  <Building2 className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-2xs font-bold text-blue-600 border-blue-500/30">
                  {isEn ? "Healthcare Provider" : "হাসপাতাল / ল্যাব / ফার্মেসি"}
                </Badge>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-secondary dark:text-white">
                  {isEn ? "Partner as Provider" : "অফিসিয়াল পার্টনার হোন"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isEn
                    ? "Connect your hospital, diagnostic lab, or pharmacy with Health Club members through discounts & benefits."
                    : "হেলথ ক্লাবের পার্টনার নেটওয়ার্কে যুক্ত হয়ে ক্লাবের মেম্বারদের বিশেষ ছাড় ও সেবা প্রদান করুন।"}
                </p>
              </div>

              <ul className="text-2xs sm:text-xs text-muted-foreground space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>{isEn ? "Promote to 100+ verified members" : "১০০+ নিয়মিত মেম্বারদের কাছে প্রচার"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>{isEn ? "Digital verification portal" : "ডিজিটাল কিউআর কার্ড ভেরিফিকেশন"}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/become-partner"
              className={buttonVariants({
                variant: "outline",
                className: "w-full border-blue-500/30 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold rounded-xl mt-2",
              })}
            >
              <span>{isEn ? "Partner Application" : "পার্টনার আবেদন ফরম"}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Support & Direct Inquiries Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-muted/60 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mx-4">
        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm font-bold text-secondary dark:text-white">
            {isEn ? "Need custom assistance or information?" : "অন্য কোনো সহায়তা বা তথ্য প্রয়োজন?"}
          </p>
          <p className="text-2xs sm:text-xs text-muted-foreground">
            {isEn
              ? "Our emergency support coordinator is available 24/7 for assistance."
              : "আমাদের জরুরি সমন্বয়ক টিমের সাথে সরাসরি কথা বলতে পারেন।"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:+8801886763849"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>{isEn ? "+880 1886763849" : "+৮৮০ ১৮৮৬৭৬৩৮৪৯"}</span>
          </a>
          <Link
            href="/contact"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "text-xs font-semibold rounded-xl",
            })}
          >
            {isEn ? "Contact Us" : "যোগাযোগ পেইজ"}
          </Link>
        </div>
      </div>

      {/* Modals */}
      <BloodDonorRegisterDialog open={isDonorModalOpen} onOpenChange={setIsDonorModalOpen} />
      <AmbulanceRegisterDialog open={isAmbulanceModalOpen} onOpenChange={setIsAmbulanceModalOpen} />
    </section>
  );
}
