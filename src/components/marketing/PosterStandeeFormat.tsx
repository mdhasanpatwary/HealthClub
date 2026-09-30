import React from "react";
import Image from "next/image";
import { Partner } from "@/services/db";
import { PosterThemeConfig, PosterCustomOptions, PosterQrTarget } from "@/types/poster";
import { PosterQrCode } from "./PosterQrCode";
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
  Globe, 
  CheckCircle2 
} from "lucide-react";

interface PosterStandeeFormatProps {
  partner: Partner;
  theme: PosterThemeConfig;
  options: PosterCustomOptions;
  qrTarget: PosterQrTarget;
  registrationUrl: string;
  profileUrl: string;
}

export function PosterStandeeFormat({
  partner,
  theme,
  options,
  qrTarget,
  registrationUrl,
  profileUrl,
}: PosterStandeeFormatProps) {
  const helpline = options.helpline || "01886-763849";
  const website = options.website || "healthclubfeni.com";
  const targetUrl = qrTarget === "profile" ? profileUrl : registrationUrl;

  return (
    <div
      className="standee-poster-document relative mx-auto bg-white text-slate-900 overflow-hidden shadow-2xl flex flex-col justify-between"
      style={{
        width: "148mm", // Standard A5 portrait or 5.8 x 8.3 inch table standee
        minHeight: "210mm",
        height: "210mm",
        padding: "12mm 14mm",
        boxSizing: "border-box",
      }}
    >
      {/* Standee Acrylic Border & Frame Guide */}
      <div 
        className="absolute inset-[6mm] border-2 rounded-xl pointer-events-none opacity-30"
        style={{ borderColor: theme.primary }}
      />
      {options.showCutMarks && (
        <div className="absolute inset-0 pointer-events-none border border-dashed border-slate-300 m-[2mm]" />
      )}

      {/* HEADER: Mini Health Club Branding */}
      <header className="relative z-10 flex items-center justify-between border-b pb-3" style={{ borderColor: theme.cardBorder }}>
        <div className="flex items-center gap-2.5">
          <div 
            className="h-10 w-10 rounded-xl p-1.5 flex items-center justify-center shadow-xs shrink-0"
            style={{ background: theme.primary }}
          >
            <Image
              src="/images/member-card-logo.webp"
              alt="Health Club Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight font-heading text-slate-900 leading-tight">
              হেলথ ক্লাব <span style={{ color: theme.primary }}>Health Club</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">
              অনুমোদিত পার্টনার স্বাস্থ্যসেবা কেন্দ্র
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText, borderColor: theme.cardBorder }}>
          <ShieldCheck className="h-3 w-3" />
          <span>ভেরিফাইড পার্টনার</span>
        </div>
      </header>

      {/* PARTNER TITLE */}
      <section className="relative z-10 my-2 text-center">
        <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          <Building2 className="h-3 w-3" />
          <span>ফেনী সদর</span>
        </div>
        <h2 className="text-xl font-black font-heading text-slate-900 leading-snug line-clamp-2">
          {partner.name}
        </h2>
        {options.showAddress && (
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
            {partner.address}
          </p>
        )}
      </section>

      {/* HERO DISCOUNT CALLOUT */}
      <section 
        className="relative z-10 my-2 p-3.5 rounded-xl text-center text-white shadow-md"
        style={{ background: theme.headerBg }}
      >
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="h-3 w-3" />
          <span>মেম্বারদের জন্য বিশেষ ছাড়</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight leading-tight">
          {options.customDiscountBadge || "হেলথ ক্লাব মেম্বারদের জন্য এখানে ১০-৩০% বিশেষ ছাড়"}
        </h3>
      </section>

      {/* CENTER LARGE QR CODE */}
      <section className="relative z-10 my-2 flex flex-col items-center justify-center">
        <div className="p-3 rounded-2xl border bg-slate-50 shadow-xs flex flex-col items-center" style={{ borderColor: theme.cardBorder }}>
          <PosterQrCode
            url={targetUrl}
            size={135}
            fgColor={theme.qrFg}
            label={qrTarget === "profile" ? "পার্টনার প্রোফাইল দেখুন" : "স্ক্যান করে এখনই মেম্বার হন"}
            subLabel="ক্যামেরা দিয়ে স্ক্যান করুন"
          />
        </div>

        {/* 3 Quick Bullets */}
        <div className="grid grid-cols-3 gap-2 mt-3 w-full text-center text-[10px]">
          <div className="p-1.5 rounded-lg border bg-white shadow-2xs" style={{ borderColor: theme.cardBorder }}>
            <span className="font-bold text-slate-900 block">ল্যাব ও প্যাথলজি</span>
            <span className="text-emerald-700 font-semibold">১০-৩০% ছাড়</span>
          </div>
          <div className="p-1.5 rounded-lg border bg-white shadow-2xs" style={{ borderColor: theme.cardBorder }}>
            <span className="font-bold text-slate-900 block">এক্স-রে ও ইমেজিং</span>
            <span className="text-emerald-700 font-semibold">মেম্বার সুবিধা</span>
          </div>
          <div className="p-1.5 rounded-lg border bg-white shadow-2xs" style={{ borderColor: theme.cardBorder }}>
            <span className="font-bold text-slate-900 block">ডাক্তার ভিজিট</span>
            <span className="text-emerald-700 font-semibold">অগ্রাধিকার সিরিয়াল</span>
          </div>
        </div>
      </section>

      {/* COUNTER INSTRUCTION NOTE */}
      <section className="relative z-10 my-1 text-center">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>{options.customNotice || "কাউন্টারে বিল পরিশোধের পূর্বে আপনার মেম্বার আইডি প্রদর্শন করুন"}</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 pt-2 border-t flex items-center justify-between text-[10px] text-slate-600" style={{ borderColor: theme.cardBorder }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-bold text-slate-900">
            <PhoneCall className="h-3 w-3" style={{ color: theme.primary }} />
            <span>{helpline}</span>
          </div>
          <div className="flex items-center gap-1 font-medium">
            <Globe className="h-3 w-3 text-slate-400" />
            <span>{website}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-slate-500 font-medium">
            হেলথ ক্লাব • ফেনী সদর
          </span>
        </div>
      </footer>
    </div>
  );
}
