"use client";

import { useState } from "react";
import Image from "next/image";
import { Quote, Star, CheckCircle2, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  saved: string;
  facility: string;
  facilityLocation: string;
  facilityType: string;
  facilityLogo: string;
  memberId: string;
  story: string;
  avatar: string;
  image: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "মোঃ আশরাফুল আলম",
    location: "মহিপাল, ফেনী সদর",
    saved: "১০-৩০% মেম্বার ছাড়",
    facility: "আল-আকসা হাসপাতাল লিঃ ফেনী",
    facilityLocation: "খাজুরিয়া কোট বিল্ডিং, ট্রাংক রোড, ফেনী",
    facilityType: "অফিসিয়াল পার্টনার হাসপাতাল",
    facilityLogo: "/images/partners/al-aqsa-hospital.webp",
    memberId: "HC-1042",
    story: "বাবার হঠাৎ তীব্র অসুস্থতায় আল-আকসা হাসপাতালে ভর্তি করাতে হয়েছিল। হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড দেখানোতে অ্যাডমিশন ও টেস্টের মোট বিলে সরাসরি ১০-৩০% মেম্বার ছাড় পেয়েছি। সংকটের মুহূর্তে এত বড় সাশ্রয় আমাদের পরিবারের জন্য অনেক বড় সহায়তা।",
    avatar: "আ",
    image: "/images/testimonials/ashraful-alam.webp",
    rating: 5,
  },
  {
    id: 2,
    name: "বেগম সুফিয়া খাতুন",
    location: "রামপুর, ফেনী সদর",
    saved: "১০-৩০% ল্যাব টেস্ট ছাড়",
    facility: "লাইফ কেয়ার ডায়াগনস্টিক সেন্টার",
    facilityLocation: "গ্র্যান্ড ট্রাঙ্ক রোড (বড় জামে মসজিদের পূর্ব পাশে), ফেনী",
    facilityType: "অফিসিয়াল ডায়াগনস্টিক পার্টনার",
    facilityLogo: "/images/partners/life-care-diagnostic.webp",
    memberId: "HC-2189",
    story: "আমার ডায়াবেটিস ও থাইরয়েডের কারণে প্রতি মাসেই নিয়মিত রক্ত পরীক্ষা করাতে হয়। লাইফ কেয়ার ডায়াগনস্টিক সেন্টারে হেলথ ক্লাবের কার্ডে প্রতিবার ১০-৩০% ডিসকাউন্ট পাচ্ছি। রিপোর্টগুলো অত্যন্ত নির্ভুল ও দ্রুত সময়ে পাওয়া যায়, ফলে প্রতি মাসে অনেক টাকা সাশ্রয় হয়।",
    avatar: "সু",
    image: "/images/testimonials/sufia-khatun.webp",
    rating: 5,
  },
  {
    id: 3,
    name: "মোঃ সাকিবুল ইসলাম",
    location: "মিজান রোড, ফেনী সদর",
    saved: "১০-৩০% টেস্ট ডিসকাউন্ট",
    facility: "প্যাসিফিক হেলথ কেয়ার সেন্টার",
    facilityLocation: "জিরো পয়েন্ট, শহীদ শহীদুল্লাহ কায়সার সড়ক, ফেনী",
    facilityType: "অফিসিয়াল ডায়াগনস্টিক পার্টনার",
    facilityLogo: "/images/partners/pacific-health-care.webp",
    memberId: "HC-3504",
    story: "হঠাৎ ডেঙ্গুর লক্ষণ দেখা দিলে ডাক্তার জরুরি ব্লাড টেস্টের পরামর্শ দেন। জিরো পয়েন্টে প্যাসিফিক হেলথ কেয়ার সেন্টারে গিয়ে মেম্বার কার্ড দেখাতেই সরাসরি ১০-৩০% ছাড় পেয়েছি। দ্রুত রিপোর্ট ও কর্মীদের আন্তরিক ব্যবহারে আমি অত্যন্ত সন্তুষ্ট।",
    avatar: "সা",
    image: "/images/testimonials/sakibul-islam.webp",
    rating: 5,
  },
];

export default function TestimonialCarousel() {
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [logoError, setLogoError] = useState<Record<number, boolean>>({});

  return (
    <div className="w-full">
      {/* 3-Card Responsive Grid matching Blog Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {TESTIMONIALS.map((item) => {
          const hasCustomImage = item.image && !imgError[item.id];
          const hasLogo = item.facilityLogo && !logoError[item.id];

          return (
            <Card
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between gap-4">
                {/* Header: Member Profile, Rating & Savings Badge */}
                <div className="space-y-3">
                  {/* Top: Avatar & Member Info */}
                  <div className="flex items-center gap-3">
                    {/* Avatar / Photo Container */}
                    <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xs bg-muted">
                      {hasCustomImage ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 48px, 56px"
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          onError={() =>
                            setImgError((prev) => ({ ...prev, [item.id]: true }))
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-lg">
                          {item.avatar}
                        </div>
                      )}
                    </div>

                    {/* Member Name & Location */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading text-sm sm:text-base font-bold text-secondary dark:text-white leading-snug">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <span>{item.location}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-muted-foreground/80">
                          #{item.memberId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars, Verified Badge & Savings Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 ml-1">
                        <CheckCircle2 className="h-3 w-3" />
                        ভেরিফাইড
                      </span>
                    </div>

                    {/* Savings Badge */}
                    <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-600/10 dark:bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-600/25 whitespace-nowrap">
                      {item.saved}
                    </span>
                  </div>
                </div>

                {/* Middle: Testimonial Story Quote */}
                <div className="relative flex-1 py-1">
                  <Quote className="h-5 w-5 text-primary/30 mb-1" />
                  <p className="text-xs sm:text-sm leading-relaxed text-secondary/90 dark:text-slate-200 italic">
                    &ldquo;{item.story}&rdquo;
                  </p>
                </div>

                {/* Bottom Footer: Real Partner Facility Reference */}
                <div className="pt-2 border-t border-border/60">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-muted/40 dark:bg-slate-800/50 border border-border/60 transition-colors group-hover:bg-muted/70 dark:group-hover:bg-slate-800/80">
                    <div className="flex items-start gap-2.5">
                      {/* Facility Logo / Icon */}
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-border/70 bg-background flex items-center justify-center mt-0.5">
                        {hasLogo ? (
                          <Image
                            src={item.facilityLogo}
                            alt={item.facility}
                            fill
                            sizes="32px"
                            className="object-cover"
                            onError={() =>
                              setLogoError((prev) => ({ ...prev, [item.id]: true }))
                            }
                          />
                        ) : (
                          <Building2 className="w-4 h-4 text-primary" />
                        )}
                      </div>

                      {/* Facility Info */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <span className="text-xs font-bold text-secondary dark:text-white leading-tight">
                            {item.facility}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[9px] px-1.5 py-0 border-primary/30 text-primary shrink-0 bg-primary/5"
                          >
                            অফিসিয়াল পার্টনার
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {item.facilityLocation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

