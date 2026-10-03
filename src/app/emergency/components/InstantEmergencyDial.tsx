"use client";

import { PhoneCall, ShieldAlert, HeartPulse, Building2, Droplets, Wind, Truck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface QuickDialItem {
  id: string;
  titleBn: string;
  badgeBn: string;
  phone: string;
  descriptionBn: string;
  icon: typeof ShieldAlert;
  colorClass: {
    bg: string;
    text: string;
    border: string;
    btn: string;
  };
}

const TOP_EMERGENCY_CONTACTS: QuickDialItem[] = [
  {
    id: "national-emergency",
    titleBn: "জাতীয় জরুরি সেবা",
    badgeBn: "টোল-ফ্রি ২৪/৭",
    phone: "999",
    descriptionBn: "পুলিশ, ফায়ার সার্ভিস ও সরকারি জরুরি অ্যাম্বুলেন্স সহায়তা",
    icon: ShieldAlert,
    colorClass: {
      bg: "bg-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/25",
      btn: "bg-rose-600 hover:bg-rose-700 text-white",
    },
  },
  {
    id: "shastho-batayon",
    titleBn: "স্বাস্থ্য বাতায়ন",
    badgeBn: "সরকারি মেডিকেল ২৪/৭",
    phone: "16263",
    descriptionBn: "২৪ ঘণ্টা অভিজ্ঞ চিকিৎসকের নিকট থেকে সরাসরি স্বাস্থ্য পরামর্শ",
    icon: HeartPulse,
    colorClass: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/25",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  },
  {
    id: "feni-sadar-hospital",
    titleBn: "ফেনী ২৫০ শয্যা জেনারেল হাসপাতাল",
    badgeBn: "জরুরি বিভাগ",
    phone: "0331-74011",
    descriptionBn: "সদর হাসপাতাল জরুরি বিভাগ ও জরুরি চিকিৎসা সহায়তা",
    icon: Building2,
    colorClass: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/25",
      btn: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  },
  {
    id: "red-crescent-blood",
    titleBn: "রেড ক্রিসেন্ট রক্ত কেন্দ্র (ফেনী)",
    badgeBn: "ব্লাড ব্যাংক",
    phone: "01819-887766",
    descriptionBn: "জরুরি রক্তের মজুদ ও তাৎক্ষণিক ডোনার তথ্য সেবা",
    icon: Droplets,
    colorClass: {
      bg: "bg-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/25",
      btn: "bg-rose-600 hover:bg-rose-700 text-white",
    },
  },
  {
    id: "feni-oxygen-service",
    titleBn: "ফেনী জরুরি অক্সিজেন সিলিন্ডার",
    badgeBn: "২৪/৭ হোম ডেলিভারি",
    phone: "01815-998877",
    descriptionBn: "মেডিকেল অক্সিজেন সিলিন্ডার সরবরাহ ও তাৎক্ষণিক রিফিল সাপোর্ট",
    icon: Wind,
    colorClass: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-500/25",
      btn: "bg-cyan-600 hover:bg-cyan-700 text-white",
    },
  },
  {
    id: "feni-central-ambulance",
    titleBn: "ফেনী সেন্ট্রাল অ্যাম্বুলেন্স",
    badgeBn: "আইসিইউ ও এসি বহর",
    phone: "01876-077777",
    descriptionBn: "দ্রুত রোগী পরিবহন ও চট্টগ্রাম/ঢাকা রেফারেল সেবা",
    icon: Truck,
    colorClass: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/25",
      btn: "bg-amber-600 hover:bg-amber-700 text-white",
    },
  },
];

export function InstantEmergencyDial() {
  return (
    <section aria-labelledby="instant-dial-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <h2 id="instant-dial-heading" className="font-heading font-extrabold text-lg sm:text-xl text-foreground">
              তাৎক্ষণিক জরুরি ডায়াল (১ ক্লিকে কল করুন)
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            মেডিকেল ইমার্জেন্সিতে সরাসরি সেবা প্রদানকারীর ডেস্কে কথা বলুন। কোনো মধ্যস্বত্বভোগী নেই।
          </p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0 w-fit">
          লাইফ-সেভিং হটলাইন
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {TOP_EMERGENCY_CONTACTS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl bg-card border ${item.colorClass.border} hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 group`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`p-2 rounded-xl ${item.colorClass.bg} ${item.colorClass.text}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.colorClass.bg} ${item.colorClass.text}`}>
                    {item.badgeBn}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-foreground leading-snug">
                    {item.titleBn}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {item.descriptionBn}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40">
                <a
                  href={`tel:${item.phone.replace(/[^0-9]/g, "")}`}
                  onClick={() => {
                    trackEvent("emergency_dial", {
                      service_type: "hotline",
                      target_name: item.titleBn,
                      phone: item.phone,
                    });
                  }}
                  className={`w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-98 cursor-pointer ${item.colorClass.btn}`}
                >
                  <PhoneCall className="h-4 w-4 shrink-0 animate-bounce" />
                  <span>কল করুন: {item.phone}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
