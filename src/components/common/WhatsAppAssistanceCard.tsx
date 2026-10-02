"use client";

import { useState, useEffect, useMemo } from "react";
import { PhoneCall, Sparkles, HelpCircle, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialBrandIcons";
import { getPublicContactSettingsAction } from "@/app/actions/systemSettingsActions";
import { cn, toBanglaNums } from "@/lib/utils";

export type AssistanceContext =
  | "register"
  | "verify_email"
  | "membership"
  | "payment"
  | "general";

export type AssistanceVariant = "banner" | "compact" | "card";

export interface WhatsAppAssistanceCardProps {
  context?: AssistanceContext;
  variant?: AssistanceVariant;
  whatsappNumber?: string;
  hotlineNumber?: string;
  userEmail?: string;
  title?: string;
  description?: string;
  className?: string;
}

const DEFAULT_SUPPORT_NUMBER = "01886763849";

export default function WhatsAppAssistanceCard({
  context = "register",
  variant = "compact",
  whatsappNumber,
  hotlineNumber,
  userEmail,
  title,
  description,
  className,
}: WhatsAppAssistanceCardProps) {
  const [resolvedWhatsapp, setResolvedWhatsapp] = useState<string>(
    whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || DEFAULT_SUPPORT_NUMBER
  );
  const [resolvedHotline, setResolvedHotline] = useState<string>(
    hotlineNumber || process.env.NEXT_PUBLIC_HOTLINE_PHONE || DEFAULT_SUPPORT_NUMBER
  );

  useEffect(() => {
    if (whatsappNumber && hotlineNumber) return;

    let isMounted = true;
    getPublicContactSettingsAction()
      .then((settings) => {
        if (!isMounted || !settings) return;
        if (!whatsappNumber && settings.whatsapp) {
          setResolvedWhatsapp(settings.whatsapp);
        }
        if (!hotlineNumber && settings.hotline) {
          setResolvedHotline(settings.hotline);
        }
      })
      .catch(() => {
        // Fallback numbers already initialized
      });

    return () => {
      isMounted = false;
    };
  }, [whatsappNumber, hotlineNumber]);

  const cleanWhatsapp = useMemo(() => {
    const raw = (resolvedWhatsapp || DEFAULT_SUPPORT_NUMBER).replace(/[^0-9]/g, "");
    return raw.replace(/^(880|88|0)/, "");
  }, [resolvedWhatsapp]);

  const cleanHotline = useMemo(() => {
    const raw = (resolvedHotline || DEFAULT_SUPPORT_NUMBER).replace(/[^0-9]/g, "");
    return raw.replace(/^(880|88|0)/, "");
  }, [resolvedHotline]);

  const defaultWhatsappMsg = useMemo(() => {
    switch (context) {
      case "register":
        return "আসসালামু আলাইকুম, আমি হেলথ ক্লাব মেম্বারশিপ রেজিস্ট্রেশন ফর্ম পূরণ ও ছবি আপলোডে সরাসরি সহায়তা চাই।";
      case "verify_email":
        return userEmail
          ? `আসসালামু আলাইকুম, আমি হেলথ ক্লাব মেম্বার রেজিস্ট্রেশনের ওটিপি (OTP) ভেরিফিকেশন কোড পেতে পারছি না। আমার ইমেইল: ${userEmail}। অনুগ্রহ করে ওটিপি বা অ্যাকাউন্ট সক্রিয়করণে সহায়তা করবেন।`
          : "আসসালামু আলাইকুম, আমি হেলথ ক্লাব মেম্বার রেজিস্ট্রেশনের ইমেইল ওটিপি (OTP) ভেরিফিকেশন কোড পেতে সহায়তা চাই।";
      case "membership":
        return "আসসালামু আলাইকুম, আমি হেলথ ক্লাব মেম্বারশিপ প্ল্যান ও ফেনী সদরে ১০-৩০% ডিসকাউন্ট সুবিধা সম্পর্কে জানতে ও মেম্বার হতে সহায়তা চাই।";
      case "payment":
        return "আসসালামু আলাইকুম, আমি হেলথ ক্লাব প্রিমিয়াম মেম্বারশিপ পেমেন্ট ও ট্রানজেকশন আইডি সংক্রান্ত সহায়তা চাই।";
      case "general":
      default:
        return "আসসালামু আলাইকুম, আমি হেলথ ক্লাব হেল্পলাইন থেকে মেম্বারশিপ সুবিধা ও সেবা সম্পর্কে তথ্য জানতে চাই।";
    }
  }, [context, userEmail]);

  const whatsappUrl = `https://wa.me/880${cleanWhatsapp}?text=${encodeURIComponent(defaultWhatsappMsg)}`;
  const hotlineTel = `+880${cleanHotline}`;
  const hotlineDisplay = toBanglaNums(`+880 ${cleanHotline}`);

  const contentConfig = useMemo(() => {
    switch (context) {
      case "register":
        return {
          badge: "হোয়াটসঅ্যাপ অনবোর্ডিং সাপোর্ট",
          title: title || "ফর্ম পূরণে কোনো সমস্যা হচ্ছে?",
          description:
            description ||
            "ছবি আপলোড, তথ্য পূরণ বা কোনো জটিলতায় সরাসরি হোয়াটসঅ্যাপে মেসেজ দিন। আমাদের টিম তাৎক্ষণিক সহায়তা করবে।",
          cta: "হোয়াটসঅ্যাপে হেল্প নিন",
        };
      case "verify_email":
        return {
          badge: "ওটিপি ভেরিফিকেশন হেল্প",
          title: title || "ইমেইল ওটিপি (OTP) পেতে সমস্যা হচ্ছে?",
          description:
            description ||
            "স্প্যাম বা প্রোমোশন ফোল্ডার চেক করেও ওটিপি না পেলে হোয়াটসঅ্যাপে যোগাযোগ করুন। আমাদের টিম সরাসরি অ্যাকাউন্ট সক্রিয় করতে সহায়তা করবে।",
          cta: "হোয়াটসঅ্যাপে ওটিপি সহায়তা",
        };
      case "membership":
        return {
          badge: "মেম্বারশিপ অ্যাসিস্ট্যান্স",
          title: title || "মেম্বারশিপ প্ল্যান নিয়ে কোনো প্রশ্ন আছে?",
          description:
            description ||
            "কোন প্ল্যানটি আপনার পরিবারের জন্য মানানসই অথবা ফেনী সদরের পার্টনার হাসপাতালে ১০-৩০% ডিসকাউন্ট কীভাবে পাবেন—তাৎক্ষণিক বুঝে নিন।",
          cta: "হোয়াটসঅ্যাপে পরামর্শ নিন",
        };
      case "payment":
        return {
          badge: "পেমেন্ট হেল্পলাইন",
          title: title || "পেমেন্ট সম্পন্ন করতে সমস্যা হচ্ছে?",
          description:
            description ||
            "বিকাশ ট্রানজেকশন আইডি বা পেমেন্ট ভেরিফিকেশনে যে কোনো সমস্যায় আমাদের হোয়াটসঅ্যাপে জানান।",
          cta: "হোয়াটসঅ্যাপে পেমেন্ট সাপোর্ট",
        };
      case "general":
      default:
        return {
          badge: "হেল্পলাইন সাপোর্ট",
          title: title || "সরাসরি সহায়তা প্রয়োজন?",
          description:
            description ||
            "মেম্বারশিপ, ডিসকাউন্ট বা ডাক্তার সিরিয়াল সংক্রান্ত যে কোনো তথ্য পেতে আমাদের হোয়াটসঅ্যাপে যোগাযোগ করুন।",
          cta: "হোয়াটসঅ্যাপে যোগাযোগ করুন",
        };
    }
  }, [context, title, description]);

  // Variant 1: Large interactive banner (e.g. for /membership page)
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-emerald-500/25 dark:border-emerald-500/20",
          "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 dark:from-emerald-950/40 dark:via-slate-900/70 dark:to-teal-950/30",
          "p-6 sm:p-8 shadow-xl",
          className
        )}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Sparkles className="h-3.5 w-3.5" />
              <span>{contentConfig.badge}</span>
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-bold text-secondary dark:text-white">
              {contentConfig.title}
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {contentConfig.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                অফিসিয়াল হেলথ ক্লাব সাপোর্ট
              </span>
              <span className="hidden sm:inline text-border">•</span>
              <a
                href={`tel:${hotlineTel}`}
                className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-mono"
              >
                <PhoneCall className="h-3.5 w-3.5 text-primary" />
                হটলাইন: {hotlineDisplay}
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col shrink-0 gap-3 w-full sm:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl",
                "bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base",
                "shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all duration-200 cursor-pointer"
              )}
              aria-label="অফিসিয়াল হেলথ ক্লাব হোয়াটসঅ্যাপ সহায়তায় যোগাযোগ করুন"
            >
              <WhatsAppIcon className="h-5 w-5 fill-current shrink-0" />
              <span>{contentConfig.cta}</span>
            </a>

            <a
              href={`tel:${hotlineTel}`}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-border/80",
                "bg-background/80 hover:bg-background text-secondary dark:text-white text-xs font-semibold",
                "transition-colors cursor-pointer sm:hidden md:inline-flex"
              )}
            >
              <PhoneCall className="h-3.5 w-3.5 text-muted-foreground" />
              <span>সরাসরি কল দিন</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Variant 2: Card standalone
  if (variant === "card") {
    return (
      <div
        className={cn(
          "rounded-3xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-950/20 p-5 sm:p-6 space-y-4",
          className
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{contentConfig.badge}</span>
          </div>
          <HelpCircle className="h-4 w-4 text-emerald-600/60 dark:text-emerald-400/60" />
        </div>

        <div className="space-y-1">
          <h4 className="font-heading text-base font-bold text-secondary dark:text-white">
            {contentConfig.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {contentConfig.description}
          </p>
        </div>

        <div className="pt-1 flex flex-col gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            aria-label="হোয়াটসঅ্যাপে হেল্প নিন"
          >
            <WhatsAppIcon className="h-4 w-4 fill-current shrink-0" />
            <span>{contentConfig.cta}</span>
          </a>

          <div className="text-center">
            <a
              href={`tel:${hotlineTel}`}
              className="text-[11px] text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center gap-1 font-mono transition-colors"
            >
              <PhoneCall className="h-3 w-3" />
              কল করতে পারেন: {hotlineDisplay}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Variant 3: Compact embedded banner (for registration & verify-email forms)
  return (
    <div
      className={cn(
        "rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] dark:bg-emerald-950/20 p-4 transition-all",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-heading text-xs font-bold text-secondary dark:text-white">
              {contentConfig.title}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed sm:max-w-md">
            {contentConfig.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
            aria-label="হোয়াটসঅ্যাপে সরাসরি সহায়তা নিন"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 fill-current shrink-0" />
            <span>{contentConfig.cta}</span>
          </a>

          <a
            href={`tel:${hotlineTel}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-border/70 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title={`কল করুন: ${hotlineDisplay}`}
            aria-label={`কল করুন: ${hotlineDisplay}`}
          >
            <PhoneCall className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
