"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  SerpAnalysisResult,
  SerpLengthMetric,
} from "@/lib/seo/serpValidator";

interface SerpAuditChecklistProps {
  analysis: SerpAnalysisResult;
  titleMetric: SerpLengthMetric;
  descMetric: SerpLengthMetric;
  activeLang: "bn" | "en";
}

export function SerpAuditChecklist({
  analysis,
  titleMetric,
  descMetric,
  activeLang,
}: SerpAuditChecklistProps) {
  const [filter, setFilter] = useState<"all" | "warn" | "pass">("all");

  const filteredRules = analysis.rules.filter((r) => {
    if (filter === "warn") return r.status === "warn" || r.status === "fail";
    if (filter === "pass") return r.status === "pass";
    return true;
  });

  const getMeterColor = (status: SerpLengthMetric["status"]) => {
    switch (status) {
      case "optimal":
        return "bg-emerald-500";
      case "short":
      case "long":
        return "bg-amber-500";
      case "truncated":
        return "bg-destructive";
    }
  };

  const titleProgress = Math.min(100, Math.round((titleMetric.length / 60) * 100));
  const descProgress = Math.min(100, Math.round((descMetric.length / 160) * 100));

  return (
    <div className="space-y-4">
      {/* Top Score Banner */}
      <div className="p-4 rounded-2xl border bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-background border flex flex-col items-center justify-center shrink-0 shadow-xs">
            <span className={`text-xl font-black ${analysis.statusColor}`}>
              {analysis.score}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase -mt-1">
              / 100
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">
                SERP টেকনিক্যাল রেটিং
              </h4>
              <Badge
                variant="outline"
                className={`text-[10px] font-extrabold px-1.5 py-0 ${
                  analysis.grade === "A+" || analysis.grade === "A"
                    ? "border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : analysis.grade === "B"
                    ? "border-amber-500/50 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                    : "border-destructive/50 bg-destructive/10 text-destructive"
                }`}
              >
                গ্রেড {analysis.grade}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {analysis.score >= 90
                ? "সার্চ ইঞ্জিন ও এআই রেফারেন্সের জন্য সম্পূর্ণ প্রস্তুত!"
                : "র‌্যাংকিং ও ক্লিকের হার বাড়াতে নিচের পরামর্শগুলো অনুসরণ করুন।"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs self-stretch sm:self-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{analysis.summary.passedCount} পাস</span>
          </div>
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{analysis.summary.warnCount} সতর্কতা</span>
          </div>
          {analysis.summary.failCount > 0 && (
            <div className="flex items-center gap-1 text-destructive font-semibold">
              <XCircle className="h-3.5 w-3.5" />
              <span>{analysis.summary.failCount} ত্রুটি</span>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Character & Pixel Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Title Meter */}
        <div className="p-3.5 rounded-xl border bg-background space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              শিরোনাম দৈর্ঘ্য ({activeLang === "bn" ? "বাংলা" : "English"})
            </span>
            <span className="font-mono text-muted-foreground text-[11px]">
              {titleMetric.length}/৬০ অক্ষর (~{titleMetric.pixelEstimate}px)
            </span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getMeterColor(titleMetric.status)}`}
              style={{ width: `${titleProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center justify-between">
            <span>লক্ষ্যমাত্রা: ৫০-৬০ অক্ষর</span>
            <span className="font-medium text-foreground">{titleMetric.labelBn}</span>
          </p>
        </div>

        {/* Description Meter */}
        <div className="p-3.5 rounded-xl border bg-background space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              মেটা সারাংশ ({activeLang === "bn" ? "বাংলা" : "English"})
            </span>
            <span className="font-mono text-muted-foreground text-[11px]">
              {descMetric.length}/১৬০ অক্ষর (~{descMetric.pixelEstimate}px)
            </span>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getMeterColor(descMetric.status)}`}
              style={{ width: `${descProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center justify-between">
            <span>লক্ষ্যমাত্রা: ১৪০-১৬০ অক্ষর</span>
            <span className="font-medium text-foreground">{descMetric.labelBn}</span>
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 pt-1 border-b pb-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            সব অডিট ({analysis.rules.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("warn")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filter === "warn"
                ? "bg-amber-500 text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            পরামর্শ ও সতর্কতা ({analysis.summary.warnCount + analysis.summary.failCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pass")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filter === "pass"
                ? "bg-emerald-600 text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            পাস হয়েছে ({analysis.summary.passedCount})
          </button>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
              rule.status === "pass"
                ? "bg-background border-border/70"
                : rule.status === "warn"
                ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-500/30"
                : "bg-destructive/5 border-destructive/30"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {rule.status === "pass" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : rule.status === "warn" ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive shrink-0" />
                )}
                <span className="font-bold text-foreground">
                  {rule.nameBn}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] shrink-0 ${
                  rule.status === "pass"
                    ? "border-emerald-500/40 text-emerald-600"
                    : rule.status === "warn"
                    ? "border-amber-500/40 text-amber-600"
                    : "border-destructive/40 text-destructive"
                }`}
              >
                {rule.status === "pass"
                  ? "পাস"
                  : rule.status === "warn"
                  ? "সতর্কতা"
                  : "ত্রুটি"}
              </Badge>
            </div>

            <p className="text-muted-foreground pl-6">
              {rule.messageBn}
            </p>

            {rule.recommendationBn && rule.status !== "pass" && (
              <div className="ml-6 mt-1 p-2 rounded-lg bg-background/80 border text-[11px] text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                <span>
                  <strong>পরামর্শ:</strong> {rule.recommendationBn}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
