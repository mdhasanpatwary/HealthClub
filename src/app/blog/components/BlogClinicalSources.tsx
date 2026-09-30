import Link from "next/link";
import { BookOpen, ExternalLink, ShieldCheck, FileCheck, Award } from "lucide-react";
import { BlogPost, BlogClinicalSource } from "@/types/blog";
import { getBlogClinicalSources } from "../utils/blogClinicalSourcesUtils";
import { Badge } from "@/components/ui/badge";

interface BlogClinicalSourcesProps {
  sources?: BlogClinicalSource[];
  post?: BlogPost;
  className?: string;
}

function getOrgBadgeColor(org: string): string {
  const lower = org.toLowerCase();
  if (lower.includes("dghs") || lower.includes("স্বাস্থ্য অধিদপ্তর")) {
    return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25";
  }
  if (lower.includes("bmdc") || lower.includes("বিএমডিসি")) {
    return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25";
  }
  if (lower.includes("who") || lower.includes("হু")) {
    return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25";
  }
  if (lower.includes("heart") || lower.includes("হৃদরোগ")) {
    return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25";
  }
  return "bg-primary/10 text-primary border-primary/25";
}

export function BlogClinicalSources({
  sources,
  post,
  className = "",
}: BlogClinicalSourcesProps) {
  const activeSources = sources && sources.length > 0
    ? sources
    : (post ? getBlogClinicalSources(post) : []);

  if (!activeSources || activeSources.length === 0) {
    return null;
  }

  return (
    <section
      id="clinical-sources"
      aria-label="ক্লিনিক্যাল রেফারেন্স ও জাতীয় স্বাস্থ্য নির্দেশিকা"
      className={`rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/[0.02] p-5 sm:p-6 shadow-xs space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/30 text-primary bg-primary/5 flex items-center gap-1.5 text-xs font-semibold py-0.5 px-2.5"
          >
            <BookOpen className="h-3 w-3 text-primary" />
            <span>ক্লিনিক্যাল রেফারেন্স ও প্রমাণ (Evidence-Based)</span>
          </Badge>
          <Badge
            variant="outline"
            className="border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 hidden sm:flex items-center gap-1 text-[11px]"
          >
            <FileCheck className="h-3 w-3" />
            <span>DGHS / BMDC / WHO সমর্থিত</span>
          </Badge>
        </div>
        <h3 className="font-heading text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Award className="h-4 w-4 text-primary shrink-0" />
          <span>ক্লিনিক্যাল রেফারেন্স ও জাতীয় স্বাস্থ্য নির্দেশিকা</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          তথ্যের নির্ভরযোগ্যতা ও রোগীর সচেতনতার স্বার্থে এই গাইডের পরামর্শ ও ডায়াগনস্টিক তথ্যাদি নিচের জাতীয় ও আন্তর্জাতিক ক্লিনিক্যাল নির্দেশিকা অনুসরণে সংকলিত:
        </p>
      </div>

      {/* Grid of Verified Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {activeSources.map((source, idx) => (
          <div
            key={source.url + idx}
            className="rounded-xl border border-border/70 bg-muted/30 p-3.5 sm:p-4 flex flex-col justify-between hover:border-primary/40 hover:bg-muted/50 transition-all duration-200"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-[11px] font-medium py-0 px-2 border ${getOrgBadgeColor(source.organization)}`}
                >
                  {source.organization}
                </Badge>
                {source.yearOrEdition && (
                  <span className="text-[10px] text-muted-foreground font-mono bg-background/80 px-1.5 py-0.5 rounded border border-border/50">
                    {source.yearOrEdition}
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-foreground text-xs sm:text-sm leading-snug">
                  {source.titleBn}
                </h4>
                <p className="text-[11px] text-muted-foreground/80 font-medium pt-0.5 line-clamp-1">
                  {source.titleEn}
                </p>
              </div>

              {source.descriptionBn && (
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {source.descriptionBn}
                </p>
              )}
            </div>

            <div className="pt-3 mt-auto border-t border-border/40">
              <Link
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                title={`${source.titleEn} - অফিসিয়াল ওয়েবসাইট`}
              >
                <span>অফিসিয়াল নির্দেশিকা দেখুন</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="flex items-start gap-2 pt-2 border-t border-border/50 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <span>
          আমাদের ক্লিনিক্যাল রিসার্চ টিম ফেনীর ডায়াগনস্টিক পরীক্ষার ফি, প্রস্তুতি ও চিকিৎসকদের রোস্টার নিয়মিত জাতীয় চিকিৎসা প্রটোকল অনুযায়ী পর্যালোচনা ও হালনাগাদ করে থাকে।
        </span>
      </div>
    </section>
  );
}
