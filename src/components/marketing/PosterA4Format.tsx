import React from "react";
import Image from "next/image";
import { Partner } from "@/services/db";
import { PosterThemeConfig, PosterCustomOptions, PosterQrTarget } from "@/types/poster";
import { PosterQrCode } from "./PosterQrCode";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Stethoscope, 
  Microscope, 
  Activity, 
  Bed, 
  CheckCircle2, 
  PhoneCall, 
  Globe 
} from "lucide-react";

interface PosterA4FormatProps {
  partner: Partner;
  theme: PosterThemeConfig;
  options: PosterCustomOptions;
  qrTarget: PosterQrTarget;
  registrationUrl: string;
  profileUrl: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  hospital: "অনুমোদিত পার্টনার হাসপাতাল",
  diagnostic: "অনুমোদিত ডায়াগনস্টিক পার্টনার",
  pharmacy: "অনুমোদিত পার্টনার ফার্মেসি",
};

export function PosterA4Format({
  partner,
  theme,
  options,
  qrTarget,
  registrationUrl,
  profileUrl,
}: PosterA4FormatProps) {
  const categoryLabel = CATEGORY_LABELS[partner.category] || "অনুমোদিত পার্টনার স্বাস্থ্যসেবা কেন্দ্র";
  const helpline = options.helpline || "01886-763849";
  const website = options.website || "healthclubfeni.com";

  return (
    <div
      className="a4-poster-document relative mx-auto bg-white text-slate-900 overflow-hidden shadow-2xl flex flex-col justify-between"
      style={{
        width: "210mm",
        minHeight: "297mm",
        height: "297mm",
        padding: "16mm 18mm",
        boxSizing: "border-box",
      }}
    >
      {/* Outer Border Frame */}
      <div 
        className="absolute inset-[8mm] border-2 rounded-2xl pointer-events-none opacity-40"
        style={{ borderColor: theme.primary }}
      />
      
      {/* Decorative Corner Accents */}
      <div 
        className="absolute top-[8mm] left-[8mm] w-6 h-6 border-t-4 border-l-4 rounded-tl-xl pointer-events-none"
        style={{ borderColor: theme.primary }}
      />
      <div 
        className="absolute top-[8mm] right-[8mm] w-6 h-6 border-t-4 border-r-4 rounded-tr-xl pointer-events-none"
        style={{ borderColor: theme.primary }}
      />
      <div 
        className="absolute bottom-[8mm] left-[8mm] w-6 h-6 border-b-4 border-l-4 rounded-bl-xl pointer-events-none"
        style={{ borderColor: theme.primary }}
      />
      <div 
        className="absolute bottom-[8mm] right-[8mm] w-6 h-6 border-b-4 border-r-4 rounded-br-xl pointer-events-none"
        style={{ borderColor: theme.primary }}
      />

      {/* TOP HEADER: Health Club Branding */}
      <header className="relative z-10 flex items-center justify-between border-b pb-4 pt-1" style={{ borderColor: theme.cardBorder }}>
        <div className="flex items-center gap-3.5">
          <div 
            className="h-14 w-14 rounded-2xl p-2 flex items-center justify-center shadow-md shrink-0"
            style={{ background: theme.primary }}
          >
            <Image
              src="/images/member-card-logo.webp"
              alt="Health Club Logo"
              width={42}
              height={42}
              className="object-contain drop-shadow"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight font-heading text-slate-900">
                হেলথ ক্লাব <span style={{ color: theme.primary }}>Health Club</span>
              </h1>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              স্মার্ট ডিজিটাল স্বাস্থ্যসেবা ও ডিসকাউন্ট নেটওয়ার্ক • ফেনী সদর
            </p>
          </div>
        </div>

        <div className="text-right">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs border"
            style={{ 
              backgroundColor: theme.badgeBg, 
              color: theme.badgeText,
              borderColor: theme.cardBorder
            }}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>অফিসিয়াল পার্টনার নেটওয়ার্ক</span>
          </span>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            আইডি: HC-PTN-{partner.id.slice(-6).toUpperCase()}
          </p>
        </div>
      </header>

      {/* PARTNER SPOTLIGHT CARD */}
      <section className="relative z-10 my-4 p-5 rounded-2xl border text-center shadow-xs" style={{ backgroundColor: "#f8fafc", borderColor: theme.cardBorder }}>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}>
          <Building2 className="h-3.5 w-3.5" />
          <span>{categoryLabel}</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight font-heading text-slate-900">
          {partner.name}
        </h2>
        {options.showAddress && (
          <p className="text-sm text-slate-600 flex items-center justify-center gap-1.5 mt-1 font-medium">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <span>{partner.address}, ফেনী সদর</span>
          </p>
        )}
      </section>

      {/* HERO DISCOUNT BADGE */}
      <section 
        className="relative z-10 my-3 p-6 rounded-2xl text-center text-white shadow-lg overflow-hidden"
        style={{ background: theme.headerBg }}
      >
        <div className="relative z-10 space-y-1.5">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs uppercase tracking-wider">
            বিশেষ মেম্বার সুবিধা
          </div>
          <h3 className="text-3xl sm:text-4xl font-black font-heading leading-tight tracking-tight drop-shadow-xs">
            {options.customDiscountBadge || "হেলথ ক্লাব মেম্বারদের জন্য এখানে ১০-৩০% বিশেষ ছাড়"}
          </h3>
          <p className="text-sm font-medium text-emerald-100/90 tracking-wide">
            10-30% Special Discount for Verified Health Club Members
          </p>
        </div>
      </section>

      {/* BENEFITS COVERED GRID */}
      <section className="relative z-10 my-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border bg-white flex items-start gap-3 shadow-xs" style={{ borderColor: theme.cardBorder }}>
            <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}>
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">ডাক্তার কনসালটেশন</h4>
              <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                বিশেষজ্ঞ ডাক্তারদের ভিজিট ও চেম্বার সিরিয়ালে মেম্বার প্রাধান্য
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border bg-white flex items-start gap-3 shadow-xs" style={{ borderColor: theme.cardBorder }}>
            <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}>
              <Microscope className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">প্যাথলজি ও ল্যাব টেস্ট</h4>
              <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                রক্ত, প্রস্রাব ও বায়োকেমিক্যাল সকল রুটিন পরীক্ষায় ১০-৩০% ছাড়
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border bg-white flex items-start gap-3 shadow-xs" style={{ borderColor: theme.cardBorder }}>
            <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}>
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">ইমেজিং ও রেডিওলজি</h4>
              <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                ডিজিটাল এক্স-রে, ৪ডি আল্ট্রাসনোগ্রাম, ইসিজি ও ইকোকার্ডিওগ্রাম
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border bg-white flex items-start gap-3 shadow-xs" style={{ borderColor: theme.cardBorder }}>
            <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}>
              <Bed className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">ইনডোর ভর্তি ও কেবিন</h4>
              <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                ভর্তি ফি, কেবিন/বেড ভাড়া এবং জরুরি সহায়তায় বিশেষ ছাড়
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QR CODE & INSTANT REGISTRATION STEPS */}
      <section className="relative z-10 my-3 p-5 rounded-2xl border bg-slate-50/70 shadow-xs" style={{ borderColor: theme.cardBorder }}>
        <div className="flex items-center justify-between gap-6">
          {/* Instructions Column */}
          <div className="space-y-3 flex-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}>
                সহজ ৩টি ধাপ
              </span>
              <h4 className="text-lg font-extrabold font-heading text-slate-900 mt-1">
                মেম্বার হতে বা সেবা যাচাই করতে স্ক্যান করুন
              </h4>
            </div>

            <ol className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 text-white" style={{ backgroundColor: theme.primary }}>
                  ১
                </span>
                <span>স্মার্টফোনের ক্যামেরা দিয়ে ডানপাশের QR কোড স্ক্যান করুন</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 text-white" style={{ backgroundColor: theme.primary }}>
                  ২
                </span>
                <span>মোবাইল নম্বর ও নাম দিয়ে মাত্র ২ মিনিটে ডিজিটাল মেম্বারশিপ নিন</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 text-white" style={{ backgroundColor: theme.primary }}>
                  ৩
                </span>
                <span>বিলিং কাউন্টারে মেম্বার আইডি দেখিয়ে সাথে সাথে ১০-৩০% ছাড় উপভোগ করুন</span>
              </li>
            </ol>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{options.customNotice || "বিল পরিশোধের পূর্বে কাউন্টারে আপনার মেম্বার আইডি বা মোবাইল নম্বর দেখান"}</span>
            </div>
          </div>

          {/* QR Code Column */}
          <div className="shrink-0 flex items-center gap-4">
            {qrTarget === "dual" ? (
              <>
                <PosterQrCode
                  url={registrationUrl}
                  size={130}
                  fgColor={theme.qrFg}
                  label="মেম্বারশিপ নিন"
                  subLabel="রেজিস্ট্রেশন"
                />
                <PosterQrCode
                  url={profileUrl}
                  size={130}
                  fgColor={theme.qrFg}
                  label="পার্টনার ভেরিফাই"
                  subLabel="প্রোফাইল ও সেবা"
                />
              </>
            ) : (
              <PosterQrCode
                url={qrTarget === "profile" ? profileUrl : registrationUrl}
                size={160}
                fgColor={theme.qrFg}
                label={qrTarget === "profile" ? "পার্টনার প্রোফাইল ও তালিকা" : "মেম্বারশিপ নিন ও ছাড় পান"}
                subLabel="ক্যামেরা দিয়ে স্ক্যান করুন"
              />
            )}
          </div>
        </div>
      </section>

      {/* FOOTER: Helpline, Website & Authentication */}
      <footer className="relative z-10 pt-3 border-t flex items-center justify-between text-xs text-slate-600" style={{ borderColor: theme.cardBorder }}>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <PhoneCall className="h-4 w-4" style={{ color: theme.primary }} />
            <span>হেল্পলাইন: {helpline}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Globe className="h-4 w-4 text-slate-400" />
            <span>{website}</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-slate-500">
            হেলথ ক্লাব অনুমোদিত পার্টনার নেটওয়ার্ক • শুধুমাত্র ফেনী সদর
          </p>
          <p className="text-[9px] text-slate-400">
            শর্ত প্রযোজ্য • মুদ্রণ তারিখ: {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>
      </footer>
    </div>
  );
}
