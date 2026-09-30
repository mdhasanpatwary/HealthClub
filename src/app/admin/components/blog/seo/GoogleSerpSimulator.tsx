"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Monitor,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
  Star,
  Globe,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blog";
import { SerpLengthMetric } from "@/lib/seo/serpValidator";

interface GoogleSerpSimulatorProps {
  post: Partial<BlogPost>;
  titleMetric: SerpLengthMetric;
  descMetric: SerpLengthMetric;
  activeLang: "bn" | "en";
  onLangChange: (lang: "bn" | "en") => void;
}

export function GoogleSerpSimulator({
  post,
  titleMetric,
  descMetric,
  activeLang,
  onLangChange,
}: GoogleSerpSimulatorProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [showTruncationGuide, setShowTruncationGuide] = useState(true);

  const title = (activeLang === "bn" ? post.titleBn : post.titleEn) || "স্বাস্থ্যসেবা গাইড - হেলথ ক্লাব ফেনী";
  const excerpt = (activeLang === "bn" ? post.excerptBn : post.excerptEn) ||
    "ফেনীতে বিশেষজ্ঞ ডাক্তার সিরিয়াল, টেস্ট ফি তালিকা এবং হেলথ ক্লাব মেম্বারদের জন্য ১০-৩০% বিশেষ ছাড় সম্পর্কিত সম্পূর্ণ তথ্য।";
  const slug = post.slug || "healthcare-guide-feni";
  const faqs = post.faqs || [];

  const displayTitle = titleMetric.status === "truncated" && showTruncationGuide
    ? title.slice(0, 58) + "..."
    : title;

  const displayExcerpt = descMetric.status === "truncated" && showTruncationGuide
    ? (device === "mobile" ? excerpt.slice(0, 120) + "..." : excerpt.slice(0, 155) + "...")
    : excerpt;

  const primarySearchQuery = activeLang === "bn"
    ? (post.metaKeywords?.[0] || post.titleBn?.slice(0, 30) || "ফেনী হাসপাতাল ডাক্তার সিরিয়াল")
    : (post.metaKeywords?.find((k) => /[a-zA-Z]/.test(k)) || post.titleEn?.slice(0, 30) || "best doctors in feni");

  return (
    <div className="space-y-4">
      {/* Top Device & Language Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-muted/40 border border-border">
        <div className="flex items-center gap-1.5 bg-background p-1 rounded-lg border">
          <Button
            type="button"
            variant={device === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDevice("desktop")}
            className="h-7 px-2.5 text-xs font-semibold gap-1.5"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>ডেস্কটপ ভিউ</span>
          </Button>
          <Button
            type="button"
            variant={device === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDevice("mobile")}
            className="h-7 px-2.5 text-xs font-semibold gap-1.5"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>মোবাইল ভিউ</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-background p-1 rounded-lg border">
            <Button
              type="button"
              variant={activeLang === "bn" ? "default" : "ghost"}
              size="sm"
              onClick={() => onLangChange("bn")}
              className="h-7 px-2.5 text-xs font-bold"
            >
              বাংলা (BN)
            </Button>
            <Button
              type="button"
              variant={activeLang === "en" ? "default" : "ghost"}
              size="sm"
              onClick={() => onLangChange("en")}
              className="h-7 px-2.5 text-xs font-bold"
            >
              English (EN)
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowTruncationGuide(!showTruncationGuide)}
            className="h-7 px-2 text-xs font-medium gap-1"
            title="গুগলের আসল ট্রাঙ্কেশন অন/অফ করুন"
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>{showTruncationGuide ? "আসল সিমুলেশন" : "ফুল টেক্সট"}</span>
          </Button>
        </div>
      </div>

      {/* Simulated Search Bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-background border shadow-xs max-w-xl mx-auto sm:mx-0">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-xs text-foreground font-medium truncate">
          {primarySearchQuery}
        </span>
        <div className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
          <Globe className="h-3 w-3 text-primary" />
          <span>google.com</span>
        </div>
      </div>

      {/* Google Result Frame */}
      <div className="flex justify-center sm:justify-start">
        <div
          className={`transition-all bg-card border rounded-2xl p-4 sm:p-5 shadow-xs ${
            device === "mobile"
              ? "w-full max-w-[380px] border-emerald-500/30 ring-4 ring-emerald-500/5"
              : "w-full max-w-2xl"
          }`}
        >
          {/* Google Meta / Site Identity */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-medium text-foreground flex items-center gap-1">
                <span>Health Club BD</span>
                <span className="text-muted-foreground text-[10px]">·</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ভেরিফাইড পার্টনার নেটওয়ার্ক
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground font-mono truncate">
                https://healthclubbd.org › blog › {slug}
              </div>
            </div>
          </div>

          {/* SERP Title */}
          <div className="mt-1">
            <h3
              className={`font-normal text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug ${
                device === "mobile" ? "text-[17px]" : "text-[20px]"
              }`}
            >
              {displayTitle}
            </h3>
            {titleMetric.status === "truncated" && showTruncationGuide && (
              <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5">
                <Info className="h-2.5 w-2.5" />
                <span>শিরোনাম ৬০ অক্ষরের বেশি হওয়ায় গুগলে কাটা পড়বে।</span>
              </p>
            )}
          </div>

          {/* Star Rating Rich Snippet Simulation */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
            <div className="flex items-center text-amber-500 dark:text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-foreground text-[11px]">৪.৯</span>
            <span className="text-[11px]">· ১২৮+ রিভিউ</span>
            <span className="text-[11px]">· ১০-৩০% মেম্বার ছাড়</span>
          </div>

          {/* Description Snippet + Thumbnail (Mobile) */}
          <div className="mt-2 flex gap-3 items-start">
            <div className="flex-1 text-[13px] leading-relaxed text-[#4d5156] dark:text-[#bdc1c6]">
              <span className="text-[11px] text-muted-foreground font-medium mr-1.5">
                {post.publishedDate ? `${post.publishedDate} — ` : "আজ — "}
              </span>
              <span>{displayExcerpt}</span>
            </div>

            {/* Mobile Cover Image Thumbnail in SERP */}
            {device === "mobile" && post.coverImage && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border bg-muted">
                <Image
                  src={post.coverImage}
                  alt={post.coverImageAlt || title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
          </div>

          {/* FAQ Accordion Rich Snippet */}
          {faqs.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-border/70 space-y-1.5">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>গুগল FAQPage ড্রপডাউন রিচ স্নিপেট</span>
              </div>

              {faqs.slice(0, 3).map((faq, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                const qText = activeLang === "bn" ? faq.questionBn : faq.questionEn;
                const aText = activeLang === "bn" ? faq.answerBn : faq.answerEn;

                return (
                  <div
                    key={idx}
                    className="border border-border/60 rounded-lg overflow-hidden bg-muted/20"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-foreground flex items-center justify-between gap-2 hover:bg-muted/40 transition-colors"
                    >
                      <span className="line-clamp-1">{qText || `প্রশ্ন #${idx + 1}`}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-2.5 pt-1 text-[12px] text-muted-foreground leading-relaxed border-t border-border/40">
                        {aText || "উত্তর প্রদান করা হয়নি।"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Sitelinks Bar */}
          <div className="mt-3 pt-2.5 border-t border-border/50 flex flex-wrap gap-2 text-[11px] text-primary">
            <span className="hover:underline cursor-pointer">মেম্বারশিপ সুবিধা</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">ডাক্তার তালিকা</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">হাসপাতাল রিভিউ</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">১০-৩০% ছাড়</span>
          </div>
        </div>
      </div>
    </div>
  );
}
