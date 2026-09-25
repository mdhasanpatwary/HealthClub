"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star, CheckCircle2, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  saved: string;
  facility: string;
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
    location: "মহিপাল, ফেনী",
    saved: "১০-৩০% বিল সাশ্রয়",
    facility: "পপুলার হাসপাতাল, ফেনী",
    memberId: "HC-1042",
    story: "আমার বাবার হঠাৎ স্ট্রোক করার পর পপুলার হাসপাতালে ভর্তি করতে হয়েছিল। হেলথ ক্লাব মেম্বার কার্ড দেখিয়ে আমরা মোট বিলে ১০-৩০% ডিসকাউন্ট পেয়েছি। আমাদের মত গ্রামীণ পরিবারের জন্য এই মেম্বারশিপটি সত্যিই একটি বড় আশীর্বাদ।",
    avatar: "আ",
    image: "/images/testimonials/ashraful-alam.webp",
    rating: 5,
  },
  {
    id: 2,
    name: "বেগম সুফিয়া খাতুন",
    location: "রামপুর, ফেনী",
    saved: "১০-৩০% ল্যাব টেস্ট ছাড়",
    facility: "মডার্ন ডায়াগনস্টিক ও ল্যাব, ফেনী",
    memberId: "HC-2189",
    story: "আমার ডায়াবেটিস ও প্রেসারের সমস্যার কারণে প্রতি মাসে ল্যাব টেস্ট করাতে হয়। হেলথ ক্লাব কার্ডের মাধ্যমে আমি এখন ল্যাব টেস্টে ১০-৩০% ডিসকাউন্ট পাই। প্রতি মাসে যে টাকা বাঁচে, তা দিয়ে আমার সারা মাসের ঔষধ কেনা হয়ে যায়।",
    avatar: "সু",
    image: "/images/testimonials/sufia-khatun.webp",
    rating: 5,
  },
  {
    id: 3,
    name: "মোঃ সাকিবুল ইসলাম",
    location: "শিক্ষার্থী, ফেনী",
    saved: "১০-৩০% টেস্ট ডিসকাউন্ট",
    facility: "ল্যাবএইড ডায়াগনস্টিক, ফেনী",
    memberId: "HC-3504",
    story: "পরীক্ষার আগে হঠাৎ করে আমার ডেঙ্গু জ্বর হয়েছিল। ডক্টরের প্রেসক্রিপশন অনুযায়ী কিছু টেস্ট করতে হয় ল্যাবএইডে। বিল পে করার সময় হেলথ ক্লাব ডিজিটাল কার্ড দেখানোতে সরাসরি ১০-৩০% ডিসকাউন্ট পেলাম। সীমিত বাজেটের শিক্ষার্থীর জন্য এই ছাড়টি অনেক উপকারে এসেছে।",
    avatar: "সা",
    image: "/images/testimonials/sakibul-islam.webp",
    rating: 5,
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 45;

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  }, []);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Autoplay functionality with smooth pause on hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="relative max-w-4xl mx-auto px-2 sm:px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="সদস্যদের অভিজ্ঞতা"
    >
      {/* Decorative Quote Icon in background */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 -z-10 opacity-5 dark:opacity-10 pointer-events-none select-none">
        <Quote className="w-48 h-48 text-primary" />
      </div>

      <div className="overflow-hidden rounded-3xl p-1">
        <div
          className="flex transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {TESTIMONIALS.map((item, index) => {
            const hasCustomImage = item.image && !imgError[item.id];

            return (
              <div
                key={item.id}
                className="w-full shrink-0 px-2 sm:px-4"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${TESTIMONIALS.length}`}
              >
                <Card className="border border-border/80 bg-background/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl sm:rounded-3xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8 md:p-10">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                      {/* Avatar / Photo Container */}
                      <div className="relative shrink-0">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md bg-muted">
                          {hasCustomImage ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 80px, 96px"
                              className="object-cover object-top"
                              onError={() =>
                                setImgError((prev) => ({ ...prev, [item.id]: true }))
                              }
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-2xl">
                              {item.avatar}
                            </div>
                          )}
                        </div>

                        {/* Savings Badge */}
                        <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 bg-emerald-600 dark:bg-emerald-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm border-2 border-background flex items-center gap-1">
                          <span>{item.saved}</span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 space-y-4 text-center sm:text-left">
                        {/* Rating Stars & Verified Member Badge */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                          <div className="flex items-center gap-1">
                            {[...Array(item.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            ভেরিফাইড মেম্বার
                          </span>
                        </div>

                        {/* Story Quote */}
                        <p className="text-sm sm:text-base leading-relaxed text-secondary/90 dark:text-slate-200 italic font-normal">
                          &ldquo;{item.story}&rdquo;
                        </p>

                        {/* Member Identity & Facility Details */}
                        <div className="pt-1 border-t border-border/50">
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <div>
                              <h4 className="font-heading text-base font-bold text-secondary dark:text-white">
                                {item.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">{item.location}</p>
                            </div>

                            {/* Service Facility Pill */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 mt-1 sm:mt-0">
                              {item.facility && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-border/70">
                                  <Building2 className="h-3 w-3 text-primary" />
                                  <span>{item.facility}</span>
                                </span>
                              )}
                              {item.memberId && (
                                <span className="text-[10px] font-mono font-medium text-muted-foreground/90 bg-muted/40 px-1.5 py-0.5 rounded border border-border/50">
                                  #{item.memberId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Buttons & Progress Dots */}
      <div className="relative flex justify-center items-center mt-4 sm:mt-5 gap-4">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-background border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          aria-label="পূর্ববর্তী রিভিউ"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Indicators */}
        <div className="flex gap-2 items-center">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                idx === current ? "w-7 bg-primary shadow-xs" : "w-2 bg-border hover:bg-slate-400"
              }`}
              aria-label={`স্লাইড ${idx + 1}-এ যান`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-background border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          aria-label="পরবর্তী রিভিউ"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
