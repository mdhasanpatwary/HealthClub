"use client";

import { useState, useEffect } from "react";
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
  const { locale } = useLanguage();
  const [current, setCurrent] = useState(0);

  const testimonials: Testimonial[] = locale === "en" ? [
    {
      name: "Md. Ashraful Alam",
      location: "Mohipal, Feni",
      saved: "10% Bill Saved",
      story: "After my father's sudden stroke, we had to admit him to Popular Hospital. Showing the Health Club member card, we got a 10% discount (৳10,500) on the total bill. This membership is truly a great blessing for families like ours.",
      avatar: "A"
    },
    {
      name: "Begum Sufia Khatun",
      location: "Rampur, Feni",
      saved: "10% Lab Discount",
      story: "Due to my diabetes and blood pressure problems, I have to do lab tests every month. With the Health Club card, I now get a 10% discount on lab tests. The ৳300-400 saved each month covers my medicine expenses for the whole month.",
      avatar: "S"
    },
    {
      name: "Md. Sakibul Islam",
      location: "Student, Feni",
      saved: "10% Flat Discount",
      story: "Just before my exams, I suddenly got dengue fever. According to the doctor's prescription, I had to do some tests at LabAid. When paying the bill, I showed my Health Club digital card and got a flat 10% discount. For a student with a tight budget, this discount helped a lot.",
      avatar: "S"
    }
  ] : [
    {
      name: "মোঃ আশরাফুল আলম",
      location: "মহিপাল, ফেনী",
      saved: "১০% বিল সাশ্রয়",
      story: "আমার বাবার হঠাৎ স্ট্রোক করার পর পপুলার হাসপাতালে ভর্তি করতে হয়েছিল। হেলথ ক্লাব মেম্বার কার্ড দেখিয়ে আমরা মোট বিলে ১০% (১০,৫০০ টাকা) ডিসকাউন্ট পেয়েছি। আমাদের মত গ্রামীণ পরিবারের জন্য এই মেম্বারশিপটি সত্যিই একটি বড় আশীর্বাদ।",
      avatar: "আ"
    },
    {
      name: "বেগম সুফিয়া খাতুন",
      location: "রামপুর, ফেনী",
      saved: "১০% ল্যাব টেস্ট ছাড়",
      story: "আমার ডায়াবেটিস ও প্রেসারের সমস্যার কারণে প্রতি মাসে ল্যাব টেস্ট করাতে হয়। হেলথ ক্লাব কার্ডের মাধ্যমে আমি এখন ল্যাব টেস্টে ১০% ডিসকাউন্ট পাই। প্রতি মাসে যে ৩০০-৪০০ টাকা বাঁচে, তা দিয়ে আমার সারা মাসের ঔষধ কেনা হয়ে যায়।",
      avatar: "সু"
    },
    {
      name: "মোঃ সাকিবুল ইসলাম",
      location: "শিক্ষার্থী, ফেনী",
      saved: "১০% ফ্ল্যাট ডিসকাউন্ট",
      story: "পরীক্ষার আগে হঠাৎ করে আমার ডেঙ্গু জ্বর হয়েছিল। ডক্টরের প্রেসক্রিপশন অনুযায়ী কিছু টেস্ট করতে হয় ল্যাবএইডে। বিল পে করার সময় হেলথ ক্লাব ডিজিটাল কার্ড দেখানোতে সরাসরি ১০% ডিসকাউন্ট পেলাম। সীমিত বাজেটের শিক্ষার্থীর জন্য এই ছাড়টি অনেক উপকারে এসেছে।",
      avatar: "সা"
    }
  ];

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
    <div className="relative w-full max-w-3xl mx-auto px-2 sm:px-4 py-8">
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
