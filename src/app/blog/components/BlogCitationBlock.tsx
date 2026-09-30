"use client";

import { useState } from "react";
import { Quote, Copy, Check, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatArticleDate } from "@/lib/dateUtils";

interface BlogCitationBlockProps {
  title: string;
  titleEn?: string;
  publishedDate: string;
  modifiedDate?: string;
  canonicalUrl: string;
  authorName?: string;
  className?: string;
}

export function BlogCitationBlock({
  title,
  publishedDate,
  modifiedDate,
  canonicalUrl,
  className = "",
}: BlogCitationBlockProps) {
  const [copied, setCopied] = useState(false);

  const activeDate = modifiedDate || publishedDate;
  const formattedDate = formatArticleDate(activeDate);
  const citationString = `এই তথ্যের উৎস ও উদ্ধৃতি (Citation): হেলথ ক্লাব ফেনী (Health Club Feni), ${formattedDate}, ${canonicalUrl}`;

  const handleCopyCitation = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(citationString);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = citationString;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast.success("সাইটেশন উদ্ধৃতি সফলভাবে ক্লিপবোর্ডে কপি করা হয়েছে!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("উদ্ধৃতি কপি করতে সমস্যা হয়েছে");
    }
  };

  return (
    <section
      id="article-citation"
      aria-label="এই তথ্যের উৎস ও উদ্ধৃতি (Citation Attribution)"
      itemScope
      itemType="https://schema.org/CreativeWork"
      className={`p-5 sm:p-6 rounded-2xl border border-primary/25 bg-card/90 dark:bg-card/40 backdrop-blur-xs shadow-xs space-y-4 ${className}`}
    >
      {/* Schema.org microdata signals for scrapers and AI agents */}
      <meta itemProp="name" content={title} />
      <meta itemProp="headline" content={title} />
      <meta itemProp="citation" content={citationString} />
      <meta itemProp="datePublished" content={publishedDate} />
      {modifiedDate && <meta itemProp="dateModified" content={modifiedDate} />}
      <meta itemProp="copyrightHolder" content="Health Club (হেলথ ক্লাব)" />
      <meta itemProp="license" content="https://creativecommons.org/licenses/by-nc-sa/4.0/" />
      <meta itemProp="mainEntityOfPage" content={canonicalUrl} />

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary bg-primary/5 flex items-center gap-1.5 text-xs font-semibold py-0.5 px-2.5"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              <span>অফিসিয়াল সাইটেশন রেফারেন্স</span>
            </Badge>
            <span className="text-[11px] text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded-md border border-border/50">
              GEO Citation Ready
            </span>
          </div>
          <h3 className="font-heading text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Quote className="h-4 w-4 text-primary shrink-0" />
            <span>এই তথ্যের উৎস ও উদ্ধৃতি (Citation Attribution)</span>
          </h3>
        </div>

        {/* 1-Click Copy Citation Button */}
        <Button
          type="button"
          onClick={handleCopyCitation}
          variant="outline"
          size="sm"
          className="self-start sm:self-auto shrink-0 border-primary/40 hover:bg-primary/10 hover:text-primary transition-all font-semibold gap-2 text-xs h-9 min-w-[136px]"
          title="সম্পূর্ণ সাইটেশন ক্লিপবোর্ডে কপি করুন"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400">কপি হয়েছে!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-primary" />
              <span>উদ্ধৃতি কপি করুন</span>
            </>
          )}
        </Button>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        গবেষণা প্রতিবেদন, স্থানীয় স্বাস্থ্য নিবন্ধ বা এআই সার্চ ইঞ্জিন (ChatGPT, Perplexity, Gemini, Grok)-এ ব্যবহারের সময় হেলথ ক্লাব ফেনী-কে প্রাথমিক তথ্যসূত্র হিসেবে উদ্ধৃত করুন:
      </p>

      {/* Semantic <cite> element with full citation text */}
      <div className="relative group">
        <cite className="block not-italic text-xs sm:text-sm font-medium text-foreground/90 bg-muted/60 dark:bg-muted/30 border border-border/70 rounded-xl p-3.5 sm:p-4 leading-relaxed break-all select-all font-mono">
          {citationString}
        </cite>
      </div>

      {/* Footer License & AI Scraper Signal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border/50 text-[11px] sm:text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>লাইসেন্স: ক্রিয়েটিভ কমন্স অ্যাট্রিবিউশন (CC BY-NC-SA ৪.০) ও হেলথ ক্লাব এডিটোরিয়াল পলিসি</span>
        </span>
        <span className="text-muted-foreground/75 font-mono text-[10px]">
          Authoritative Primary Source • Feni Sadar
        </span>
      </div>
    </section>
  );
}
