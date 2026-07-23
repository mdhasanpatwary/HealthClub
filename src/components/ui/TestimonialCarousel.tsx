"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface Testimonial {
  name: string;
  location: string;
  saved: string;
  story: string;
  avatar: string;
}

export default function TestimonialCarousel() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const testimonials: Testimonial[] = useMemo(() => [
    {
      name: t("testimonial.1.name"),
      location: t("testimonial.1.location"),
      saved: t("testimonial.1.saved"),
      story: t("testimonial.1.story"),
      avatar: t("testimonial.1.avatar"),
    },
    {
      name: t("testimonial.2.name"),
      location: t("testimonial.2.location"),
      saved: t("testimonial.2.saved"),
      story: t("testimonial.2.story"),
      avatar: t("testimonial.2.avatar"),
    },
    {
      name: t("testimonial.3.name"),
      location: t("testimonial.3.location"),
      saved: t("testimonial.3.saved"),
      story: t("testimonial.3.story"),
      avatar: t("testimonial.3.avatar"),
    },
  ], [t]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="relative w-full max-w-3xl mx-auto px-2 sm:px-4 py-1 sm:py-4">
      {/* Slide Track */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((item, index) => (
            <div key={index} className="w-full shrink-0 px-1">
              <Card className="border border-border bg-background/50 backdrop-blur shadow-lg w-full">
                <CardContent className="p-4 sm:p-6 md:p-8 relative">

                  {/* Quote Icon */}
                  <Quote className="absolute right-4 top-4 h-8 w-8 sm:h-12 sm:w-12 text-primary/10 rotate-180" />

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">

                    {/* Avatar/Savings Badge */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary-light text-primary font-heading text-xl sm:text-2xl font-bold flex items-center justify-center border border-primary/20 shadow-inner">
                        {item.avatar}
                      </div>
                      <span className="mt-2 sm:mt-3 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 font-mono whitespace-nowrap">
                        {item.saved}
                      </span>
                    </div>

                    {/* Testimonial Story */}
                    <div className="text-center sm:text-left space-y-3">
                      <p className="text-sm sm:text-base md:text-lg leading-relaxed text-secondary italic font-normal">
                        &ldquo;{item.story}&rdquo;
                      </p>
                      <div>
                        <h4 className="font-heading text-sm sm:text-base font-bold text-secondary">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.location}</p>
                      </div>
                    </div>

                  </div>

                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="relative flex justify-center items-center mt-4 gap-4">

        {/* Arrow buttons - visible on all screens */}
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-background border border-border shadow-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? "w-6 bg-primary" : "w-2 bg-border hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-background border border-border shadow-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

      </div>
    </div>
  );
}
