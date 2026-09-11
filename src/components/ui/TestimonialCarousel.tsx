"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star, CheckCircle2, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/layout/LanguageProvider";

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

export default function TestimonialCarousel() {
  const { t, locale } = useLanguage();
  const isBn = locale === "bn";
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 45;

  const verifiedBadgeText = t("testimonial.verifiedMember", isBn ? "ভেরিফাইড মেম্বার" : "Verified Member");

  const testimonials: Testimonial[] = useMemo(() => [
    {
      id: 1,
      name: t("testimonial.1.name", isBn ? "মোঃ আশরাফুল আলম" : "Md. Ashraful Alam"),
      location: t("testimonial.1.location", isBn ? "মহিপাল, ফেনী" : "Mohipal, Feni"),
      saved: t("testimonial.1.saved", isBn ? "১০-৩০% বিল সাশ্রয়" : "10-30% Bill Saved"),
      facility: t("testimonial.1.facility", isBn ? "পপুলার হাসপাতাল, ফেনী" : "Popular Hospital, Feni"),
      memberId: t("testimonial.1.memberId", "HC-1042"),
      story: t(
        "testimonial.1.story",
        isBn
          ? "আমার বাবার হঠাৎ স্ট্রোক করার পর পপুলার হাসপাতালে ভর্তি করতে হয়েছিল। হেলথ ক্লাব মেম্বার কার্ড দেখিয়ে আমরা মোট বিলে ১০-৩০% ডিসকাউন্ট পেয়েছি। আমাদের মত গ্রামীণ পরিবারের জন্য এই মেম্বারশিপটি সত্যিই একটি বড় আশীর্বাদ।"
          : "After my father's sudden stroke, we had to admit him to Popular Hospital. Showing the Health Club member card, we got a 10-30% discount on the total bill. This membership is truly a great blessing for families like ours."
      ),
      avatar: t("testimonial.1.avatar", isBn ? "আ" : "A"),
      image: "/images/testimonials/ashraful-alam.webp",
      rating: 5,
    },
    {
      id: 2,
      name: t("testimonial.2.name", isBn ? "বেগম সুফিয়া খাতুন" : "Begum Sufia Khatun"),
      location: t("testimonial.2.location", isBn ? "রামপুর, ফেনী" : "Rampur, Feni"),
      saved: t("testimonial.2.saved", isBn ? "১০-৩০% ল্যাব টেস্ট ছাড়" : "10-30% Lab Discount"),
      facility: t("testimonial.2.facility", isBn ? "মডার্ন ডায়াগনস্টিক ও ল্যাব, ফেনী" : "Modern Diagnostic & Lab, Feni"),
      memberId: t("testimonial.2.memberId", "HC-2189"),
      story: t(
        "testimonial.2.story",
        isBn
          ? "আমার ডায়াবেটিস ও প্রেসারের সমস্যার কারণে প্রতি মাসে ল্যাব টেস্ট করাতে হয়। হেলথ ক্লাব কার্ডের মাধ্যমে আমি এখন ল্যাব টেস্টে ১০-৩০% ডিসকাউন্ট পাই। প্রতি মাসে যে টাকা বাঁচে, তা দিয়ে আমার সারা মাসের ঔষধ কেনা হয়ে যায়।"
          : "Due to my diabetes and blood pressure problems, I have to do lab tests every month. With the Health Club card, I now get a 10-30% discount on lab tests. The money saved each month covers my medicine expenses for the whole month."
      ),
      avatar: t("testimonial.2.avatar", isBn ? "সু" : "S"),
      image: "/images/testimonials/sufia-khatun.webp",
      rating: 5,
    },
    {
      id: 3,
      name: t("testimonial.3.name", isBn ? "মোঃ সাকিবুল ইসলাম" : "Md. Sakibul Islam"),
      location: t("testimonial.3.location", isBn ? "শিক্ষার্থী, ফেনী" : "Student, Feni"),
      saved: t("testimonial.3.saved", isBn ? "১০-৩০% টেস্ট ডিসকাউন্ট" : "10-30% Discount"),
      facility: t("testimonial.3.facility", isBn ? "ল্যাবএইড ডায়াগনস্টিক, ফেনী" : "LabAid Diagnostic, Feni"),
      memberId: t("testimonial.3.memberId", "HC-3504"),
      story: t(
        "testimonial.3.story",
        isBn
          ? "পরীক্ষার আগে হঠাৎ করে আমার ডেঙ্গু জ্বর হয়েছিল। ডক্টরের প্রেসক্রিপশন অনুযায়ী কিছু টেস্ট করতে হয় ল্যাবএইডে। বিল পে করার সময় হেলথ ক্লাব ডিজিটাল কার্ড দেখানোতে সরাসরি ১০-৩০% ডিসকাউন্ট পেলাম। সীমিত বাজেটের শিক্ষার্থীর জন্য এই ছাড়টি অনেক উপকারে এসেছে।"
          : "Just before my exams, I suddenly got dengue fever. According to the doctor's prescription, I had to do some tests at LabAid. When paying the bill, I showed my Health Club digital card and got a 10-30% discount. For a student with a tight budget, this discount helped a lot."
      ),
      avatar: t("testimonial.3.avatar", isBn ? "সা" : "S"),
      image: "/images/testimonials/sakibul-islam.webp",
      rating: 5,
    },
  ], [t, isBn]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);

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
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  // Auto-play with pause on hover/interaction
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length, isPaused]);

  return (
    <div
      className="relative w-full max-w-3xl mx-auto px-2 sm:px-4 py-1 sm:py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Track */}
      <div className="overflow-hidden select-none">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((item, index) => {
            const hasPhoto = Boolean(item.image && !imgError[item.id]);

            return (
              <div key={item.id || index} className="w-full shrink-0 px-1">
                <Card className="border border-border/80 bg-card/90 dark:bg-slate-900/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden hover:border-primary/40 transition-colors">
                  <CardContent className="p-5 sm:p-7 md:p-8 relative">
                    {/* Decorative Quote Mark */}
                    <Quote className="absolute right-4 top-4 h-10 w-10 sm:h-14 sm:w-14 text-primary/10 rotate-180 pointer-events-none" />

                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 items-center sm:items-start">
                      {/* Avatar & Badges Column */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className="relative group">
                          {/* Outer Glow Ring */}
                          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full p-1 ring-2 ring-primary/40 dark:ring-primary/50 shadow-md bg-gradient-to-tr from-primary/20 via-emerald-400/30 to-primary/10">
                            {hasPhoto ? (
                              <div className="relative h-full w-full rounded-full overflow-hidden bg-muted">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={80}
                                  height={80}
                                  sizes="(max-width: 640px) 64px, 80px"
                                  className="object-cover w-full h-full rounded-full"
                                  onError={() => setImgError((prev) => ({ ...prev, [item.id]: true }))}
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className="h-full w-full rounded-full bg-primary/15 text-primary font-heading text-xl sm:text-2xl font-bold flex items-center justify-center">
                                {item.avatar}
                              </div>
                            )}
                          </div>

                          {/* Verified Checkmark Shield Badge */}
                          <div
                            className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white p-1 rounded-full shadow-md ring-2 ring-background flex items-center justify-center"
                            title={verifiedBadgeText}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                          </div>
                        </div>

                        {/* Savings Badge */}
                        <span className="mt-2.5 inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20 whitespace-nowrap shadow-2xs">
                          {item.saved}
                        </span>
                      </div>

                      {/* Testimonial Story & Info */}
                      <div className="text-center sm:text-left space-y-3 flex-1 min-w-0">
                        {/* Rating Stars & Verified Pill */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <div className="flex items-center gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
                            {[...Array(item.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            {verifiedBadgeText}
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
          className="p-2 rounded-full bg-background border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Indicators */}
        <div className="flex gap-2 items-center">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                idx === current ? "w-7 bg-primary shadow-xs" : "w-2 bg-border hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-background border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
