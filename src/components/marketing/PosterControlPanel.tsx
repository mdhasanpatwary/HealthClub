"use client";

import React from "react";
import Link from "next/link";
import { Partner } from "@/services/db";
import { 
  PosterFormat, 
  PosterTheme, 
  PosterQrTarget, 
  PosterCustomOptions, 
  POSTER_THEMES 
} from "@/types/poster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Printer, 
  ExternalLink, 
  Building2, 
  Layers, 
  Palette, 
  QrCode, 
  SlidersHorizontal
} from "lucide-react";

interface PosterControlPanelProps {
  partners: Partner[];
  selectedPartner: Partner | null;
  onSelectPartner: (partner: Partner) => void;
  format: PosterFormat;
  onChangeFormat: (format: PosterFormat) => void;
  theme: PosterTheme;
  onChangeTheme: (theme: PosterTheme) => void;
  qrTarget: PosterQrTarget;
  onChangeQrTarget: (target: PosterQrTarget) => void;
  options: PosterCustomOptions;
  onChangeOptions: (updater: (prev: PosterCustomOptions) => PosterCustomOptions) => void;
  onPrint: () => void;
  zoom: number;
  onChangeZoom: (zoom: number) => void;
}

export function PosterControlPanel({
  partners,
  selectedPartner,
  onSelectPartner,
  format,
  onChangeFormat,
  theme,
  onChangeTheme,
  qrTarget,
  onChangeQrTarget,
  options,
  onChangeOptions,
  onPrint,
  zoom,
  onChangeZoom,
}: PosterControlPanelProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-6 print:hidden">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <h2 className="text-base font-bold font-heading text-secondary dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>পোস্টার ও কিউআর জেনারেটর কনফিগারেশন</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            চুক্তিভুক্ত পার্টনার স্বাস্থ্যসেবা কেন্দ্রের জন্য প্রিন্ট-রেডি ভেক্টর পোস্টার ও স্ট্যান্ড কার্ড তৈরি করুন
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedPartner && (
            <Link
              href={`/partner-hospitals/${selectedPartner.slug || selectedPartner.id}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-background"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>প্রোফাইল</span>
            </Link>
          )}

          <Button
            onClick={onPrint}
            className="bg-primary hover:bg-primary-dark text-white text-xs font-bold gap-2 px-4 shadow-sm cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>প্রিন্ট / PDF সংরক্ষণ</span>
          </Button>
        </div>
      </div>

      {/* Grid of Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Partner Selection */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span>পার্টনার প্রতিষ্ঠান নির্বাচন</span>
          </Label>
          <select
            value={selectedPartner?.id || ""}
            onChange={(e) => {
              const p = partners.find((item) => item.id === e.target.value);
              if (p) onSelectPartner(p);
            }}
            className="w-full text-xs h-9 rounded-lg border border-border bg-background px-3 font-medium text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category === "hospital" ? "হাসপাতাল" : p.category === "diagnostic" ? "ডায়াগনস্টিক" : "ফার্মেসি"})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-muted-foreground">
            শুধুমাত্র ফেনী সদর অনুমোদিত পার্টনার ({partners.length}টি প্রতিষ্ঠান)
          </p>
        </div>

        {/* 2. Format Selection */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span>পোস্টার ফরম্যাট ও সাইজ</span>
          </Label>
          <div className="grid grid-cols-2 gap-1.5 bg-muted/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onChangeFormat("a4")}
              className={`text-xs py-1.5 px-2 rounded-lg font-bold transition-all text-center ${
                format === "a4"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              A4 ওয়াল পোস্টার
            </button>
            <button
              type="button"
              onClick={() => onChangeFormat("standee")}
              className={`text-xs py-1.5 px-2 rounded-lg font-bold transition-all text-center ${
                format === "standee"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              টেবিল-টপ স্ট্যান্ডি
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {format === "a4" ? "দেয়ালে ঝোলানোর জন্য (২১০x২৯৭ মিমি)" : "ডেস্ক ও কাউন্টার এক্রিলিক স্ট্যান্ড (A5)"}
          </p>
        </div>

        {/* 3. Theme Selection */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-primary" />
            <span>কালার থিম ও প্রিভিউ</span>
          </Label>
          <select
            value={theme}
            onChange={(e) => onChangeTheme(e.target.value as PosterTheme)}
            className="w-full text-xs h-9 rounded-lg border border-border bg-background px-3 font-medium text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            {Object.values(POSTER_THEMES).map((t) => (
              <option key={t.id} value={t.id}>
                {t.nameBn}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-muted-foreground">
            কালার কোয়ালিটি ও লেজার প্রিন্টার অপ্টিমাইজড
          </p>
        </div>

        {/* 4. QR Code Target */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <QrCode className="h-3.5 w-3.5 text-primary" />
            <span>QR কোড গন্তব্য</span>
          </Label>
          <select
            value={qrTarget}
            onChange={(e) => onChangeQrTarget(e.target.value as PosterQrTarget)}
            className="w-full text-xs h-9 rounded-lg border border-border bg-background px-3 font-medium text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
          >
            <option value="registration">মেম্বারশিপ রেজিস্ট্রেশন QR</option>
            <option value="profile">পার্টনার প্রোফাইল ও শিডিউল QR</option>
            {format === "a4" && <option value="dual">উভয় QR কোড (রেজিস্ট্রেশন + প্রোফাইল)</option>}
          </select>
          <p className="text-[10px] text-muted-foreground">
            মোবাইল ক্যামেরা দিয়ে স্ক্যান করলে সরাসরি পেজে যাবে
          </p>
        </div>
      </div>

      {/* Advanced Customization Rows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-border/70">
        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">
            কাউন্টার নির্দেশিকা নোটিশ (ঐচ্ছিক)
          </Label>
          <Input
            value={options.customNotice || ""}
            placeholder="কাউন্টারে বিল পরিশোধের পূর্বে মেম্বার আইডি দেখান..."
            onChange={(e) =>
              onChangeOptions((prev) => ({ ...prev, customNotice: e.target.value }))
            }
            className="h-8 text-xs bg-background border-border"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">
            ডিসকাউন্ট হাইলাইট ব্যাজ
          </Label>
          <Input
            value={options.customDiscountBadge || ""}
            placeholder="হেলথ ক্লাব মেম্বারদের জন্য এখানে ১০-৩০% বিশেষ ছাড়"
            onChange={(e) =>
              onChangeOptions((prev) => ({ ...prev, customDiscountBadge: e.target.value }))
            }
            className="h-8 text-xs bg-background border-border"
          />
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 sm:pt-6">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-foreground">
              <input
                type="checkbox"
                checked={options.showAddress}
                onChange={(e) =>
                  onChangeOptions((prev) => ({ ...prev, showAddress: e.target.checked }))
                }
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>ঠিকানা দেখান</span>
            </label>

            {format === "standee" && (
              <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-foreground">
                <input
                  type="checkbox"
                  checked={options.showCutMarks}
                  onChange={(e) =>
                    onChangeOptions((prev) => ({ ...prev, showCutMarks: e.target.checked }))
                  }
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span>কাটিং গাইড</span>
              </label>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[11px] text-muted-foreground">জুম:</span>
            {[0.6, 0.8, 1].map((scale) => (
              <button
                key={scale}
                type="button"
                onClick={() => onChangeZoom(scale)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  zoom === scale
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {Math.round(scale * 100)}%
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
