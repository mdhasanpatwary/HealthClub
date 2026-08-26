"use client";

import { Eye, ExternalLink, Smartphone, Bell } from "lucide-react";
import { SmsSegmentCalculation } from "@/lib/sms";

interface BroadcastPreviewPanelProps {
  isBn: boolean;
  previewTab: "email" | "sms" | "in_app";
  setPreviewTab: (tab: "email" | "sms" | "in_app") => void;
  title: string;
  badge: string;
  message: string;
  actionUrl: string;
  actionText: string;
  smsStats: SmsSegmentCalculation;
}

export function BroadcastPreviewPanel({
  isBn,
  previewTab,
  setPreviewTab,
  title,
  badge,
  message,
  actionUrl,
  actionText,
  smsStats,
}: BroadcastPreviewPanelProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-4 shadow-xs sticky top-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">
            {isBn ? "লাইভ প্রিভিউ (Live Preview)" : "Live Message Preview"}
          </span>
        </div>

        {/* Preview Channel Tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setPreviewTab("email")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              previewTab === "email" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
            }`}
          >
            ইমেইল
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("sms")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              previewTab === "sms" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
            }`}
          >
            এসএমএস
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("in_app")}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              previewTab === "in_app" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground"
            }`}
          >
            ইন-অ্যাপ
          </button>
        </div>
      </div>

      {/* Email Preview Card */}
      {previewTab === "email" && (
        <div className="rounded-2xl border border-border overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs shadow-inner">
          <div className="bg-slate-900 text-white p-3 text-center border-b-2 border-primary">
            <p className="font-heading font-extrabold text-sm tracking-wide">
              হেলথ <span className="text-emerald-400">ক্লাব</span>
            </p>
            <p className="text-[9px] text-slate-400 font-mono mt-0.5">HEALTH CLUB OFFICIAL</p>
          </div>
          <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
            {badge && (
              <span className="inline-block bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {badge}
              </span>
            )}
            <h3 className="font-heading text-sm font-bold text-foreground leading-snug">
              {title || (isBn ? "ক্যাম্পেইন শিরোনাম এখানে প্রদর্শিত হবে" : "Campaign Headline Here")}
            </h3>
            <p className="text-[11px] font-medium text-muted-foreground">প্রিয় সদস্য,</p>
            <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
              {message || (isBn ? "বার্তার বিস্তারিত বক্তব্য এখানে রিয়েল-টাইমে প্রদর্শিত হবে..." : "Message content preview...")}
            </p>
            {actionText && (
              <div className="pt-2 text-center">
                <span className="inline-flex items-center gap-1 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs">
                  {actionText} <ExternalLink className="h-3 w-3 inline ml-1" />
                </span>
              </div>
            )}
          </div>
          <div className="bg-slate-100 dark:bg-slate-950 p-2.5 text-center text-[10px] text-muted-foreground border-t border-border">
            &copy; 2026 হেলথ ক্লাব &bull; ফেনী, বাংলাদেশ
          </div>
        </div>
      )}

      {/* SMS Preview Card */}
      {previewTab === "sms" && (
        <div className="p-4 bg-muted/40 rounded-2xl border border-border/80 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Smartphone className="h-3.5 w-3.5" />
              <span>প্রেরক: <strong>HealthClub</strong></span>
            </span>
            <span className="font-mono">{smsStats.charCount} chars</span>
          </div>
          <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-2xl rounded-tl-xs text-xs text-foreground whitespace-pre-line leading-relaxed">
            <p className="font-bold text-primary mb-1">{title || "শিরোনাম..."}</p>
            <p>{message || "এসএমএস টেক্সট এখানে প্রদর্শিত হবে..."}</p>
            {actionUrl && <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-mono">{actionUrl}</p>}
          </div>
        </div>
      )}

      {/* In-App Preview Card */}
      {previewTab === "in_app" && (
        <div className="p-3 bg-card rounded-2xl border border-primary/30 shadow-sm space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs text-foreground truncate">
                {title || "বিজ্ঞপ্তি শিরোনাম"}
              </p>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                {message || "ইন-অ্যাপ বার্তার সংক্ষিপ্ত বিবরণ..."}
              </p>
              <span className="text-[9px] font-mono text-muted-foreground mt-1 inline-block">এখনই &bull; হেলথ ক্লাব</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
