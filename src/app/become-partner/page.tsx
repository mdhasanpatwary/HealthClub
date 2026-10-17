import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  QrCode,
  TrendingUp,
  Percent,
  PhoneCall,
  MapPin,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import PartnerRequestForm from "./PartnerRequestForm";
import BecomePartnerFaqAccordion from "./BecomePartnerFaqAccordion";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { buildBecomePartnerJsonLd } from "./becomePartnerSeo";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { toBanglaNums } from "@/lib/utils";

export const revalidate = false; // Pure static SSG (zero ISR writes)

export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = "পার্টনার হোন - হাসপাতাল ও ডায়াগনস্টিক নেটওয়ার্ক অনবোর্ডিং | হেলথ ক্লাব ফেনী";
  const pageDesc = "ফেনী সদরের অনুমোদিত বেসরকারি হাসপাতাল, ডায়াগনস্টিক সেন্টার, প্যাথলজি ল্যাব ও মডেল ফার্মেসির জন্য হেলথ ক্লাব পার্টনার অনবোর্ডিং পোর্টাল। পান নতুন পেশেন্ট প্রবাহ, ডিজিটাল কিউআর ভেরিফিকেশন ও ১০-৩০% মেম্বার ছাড় সুবিধা।";

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: `${SITE_URL}/become-partner`,
    },
    keywords: [
      "feni hospital partnership",
      "become partner hospital feni",
      "diagnostic center listing feni",
      "feni medical lab partnership",
      "ফেনী হাসপাতাল পার্টনারশিপ",
      "ডায়াগনস্টিক সেন্টার পার্টনার",
      "হেলথ ক্লাব পার্টনার আবেদন",
      "ফেনী প্যাথলজি ল্যাব অনবোর্ডিং",
      "হাসপাতাল ডিসকাউন্ট চুক্তি",
      "ফেনী মডেল ফার্মেসি পার্টনার",
    ],
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `${SITE_URL}/become-partner`,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default async function BecomePartnerPage() {
  const canonicalUrl = `${SITE_URL}/become-partner`;
  const jsonLdData = buildBecomePartnerJsonLd(canonicalUrl);
  const contact = await getCachedContactSettings();
  const hotline = contact.whatsapp || "01886763849";
  const hotlineDisplay = toBanglaNums(hotline);

  return (
    <div className="bg-background min-h-screen">
      <JsonLd data={jsonLdData} />

      {/* Hero Header Section */}
      <header className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-primary/5 via-background to-background py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-primary/20 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>স্বাস্থ্যসেবা প্রতিষ্ঠান ও ক্লিনিক্যাল পার্টনার অনবোর্ডিং</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            হেলথ ক্লাব পার্টনার নেটওয়ার্কে যুক্ত হোন{" "}
            <span className="text-primary">(হাসপাতাল ও ডায়াগনস্টিক)</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            ফেনী সদরের অনুমোদিত বেসরকারি হাসপাতাল, ডায়াগনস্টিক সেন্টার, প্যাথলজি ল্যাব ও মডেল ফার্মেসিকে আমাদের ভেরিফাইড মেম্বার পরিবারের সাথে যুক্ত করে নতুন রোগী প্রবাহ তৈরি করুন।
          </p>

          {/* Direct Answer Capsule (BLUF) */}
          <div className="mx-auto max-w-3xl p-4 sm:p-5 rounded-2xl bg-primary/10 border border-primary/25 text-left space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>পার্টনার অনবোর্ডিং নীতিমালা (BLUF)</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              হেলথ ক্লাবের প্রাতিষ্ঠানিক পার্টনারশিপ নেটওয়ার্ক ফেনী সদরের লাইসেন্সপ্রাপ্ত স্বাস্থ্যসেবা প্রতিষ্ঠানগুলোকে হাজারো কার্ডধারী মেম্বারদের কাছে সরাসরি অগ্রাধিকারী হিসেবে তুলে ধরে। মেম্বারদের নির্ধারিত <strong>১০% থেকে ৩০% ছাড়</strong> প্রদানের বিপরীতে প্রতিষ্ঠানগুলো পায় নিয়মিত নতুন পেশেন্ট ভলিউম এবং ডেডিকেটেড ডিজিটাল ড্যাশবোর্ডে <strong>কিউআর স্ক্যানারের মাধ্যমে তাৎক্ষণিক ভেরিফিকেশন</strong> সুবিধা।
            </p>
          </div>
        </div>
      </header>

      {/* Main Interactive Grid: Benefits & Application Form */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Institutional Benefits (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-primary tracking-widest uppercase font-mono">
                প্রাতিষ্ঠানিক অংশীদারিত্ব
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary dark:text-white">
                পার্টনারশিপের প্রাতিষ্ঠানিক সুবিধাসমূহ
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                হেলথ ক্লাবের সাথে চুক্তিবদ্ধ হলে আপনার প্রতিষ্ঠান কোনো মধ্যস্বত্বভোগী ছাড়াই ফেনী সদরের রোগী ও পরিবারের প্রথম পছন্দের স্বাস্থ্যকেন্দ্র হিসেবে পরিচিতি পায়।
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1.5 transition-all hover:border-primary/40">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">নতুন পেশেন্ট ভলিউম ও গ্রাহক প্রবাহ</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                  ফেনী সদর ও উপজেলার সকল রেজিস্টার্ড মেম্বার এবং তাদের পরিবারের কাছে আপনার প্রতিষ্ঠান সরাসরি প্রাথমিক চিকিৎসা ও টেস্ট সেন্টার হিসেবে প্রমোট হবে।
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1.5 transition-all hover:border-primary/40">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <QrCode className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">ডিজিটাল কিউআর কার্ড ভেরিফিকেশন</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                  পার্টনার ড্যাশবোর্ডে স্মার্টফোন বা ওয়েবক্যাম দিয়ে রোগীর কিউআর কোড স্ক্যান করে ১ সেকেন্ডেই কার্ডের মেয়াদ ও বৈধতা যাচাই করা সম্ভব।
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1.5 transition-all hover:border-primary/40">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Percent className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">১০-৩০% মেম্বার ছাড়ের সমন্বিত সুফল</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                  ল্যাব টেস্ট, রেডিওলজি স্ক্যান ও ইনডোর কেবিনের ক্যাপাসিটি অপটিমাইজেশন নিশ্চিত করে প্রতিষ্ঠানটির দীর্ঘমেয়াদী রাজস্ব ও সুনাম বৃদ্ধি পায়।
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1.5 transition-all hover:border-primary/40">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">ফ্রি ডিজিটাল ব্র্যান্ডিং ও প্ল্যাটফর্ম লিস্টিং</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                  হেলথ ক্লাব প্ল্যাটফর্ম, সার্চ ইঞ্জিন ডিরেক্টরি এবং সোশ্যাল মিডিয়ায় অফিসিয়াল পার্টনার ব্যাজসহ আপনার সেন্টারের ফ্রি প্রচার করা হয়।
                </p>
              </div>
            </div>

            {/* Support / Hotline Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-muted/60 border border-border/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <HelpCircle className="h-4 w-4 text-primary" />
                <span>পার্টনার রিলেশনশিপ হটলাইন</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                অনবোর্ডিং বা চুক্তিপত্র সংক্রান্ত যেকোনো সরাসরি আলোচনার জন্য কল করতে পারেন:
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:+880${hotline.replace(/^(880|88|0)/, "")}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-dark transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>+৮৮০ {hotlineDisplay}</span>
                </a>
                <Link
                  href="/partner-hospitals"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>বর্তমান পার্টনার তালিকা</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: React Hook Form + Zod (7 cols) */}
          <div className="lg:col-span-7">
            <PartnerRequestForm hotline={hotline} />
          </div>
        </div>

        {/* 3-Step Onboarding Process Guide */}
        <section aria-labelledby="onboarding-steps-heading" className="space-y-6 pt-4 border-t border-border/60">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-primary uppercase tracking-widest font-mono">সহজ ৩টি ধাপ</span>
            <h2 id="onboarding-steps-heading" className="font-heading text-xl sm:text-3xl font-bold text-secondary dark:text-white">
              কীভাবে হেলথ ক্লাব অফিশিয়াল পার্টনার হবেন?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              অনলাইন আবেদন জমা থেকে শুরু করে পার্টনার ড্যাশবোর্ড সক্রিয়করণ পর্যন্ত সম্পূর্ণ প্রক্রিয়াটি দ্রুত ও স্বচ্ছ।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2.5">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                ১
              </div>
              <h3 className="font-bold text-sm text-foreground">অনলাইন আবেদন ফর্ম পূরণ</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                প্রতিষ্ঠানের নাম, ধরণ, ফেনী সদরের ঠিকানা ও মেম্বারদের জন্য প্রস্তাবিত ১০-৩০% ডিসকাউন্ট উল্লেখ করে ফর্মটি জমা দিন।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2.5">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                ২
              </div>
              <h3 className="font-bold text-sm text-foreground">নথিপত্র যাচাই ও সমঝোতা চুক্তি (MoU)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                আমাদের রিলেশনশিপ অফিসার ট্রেড লাইসেন্স ও DGHS নিবন্ধন যাচাই করে সমঝোতা স্মারক স্বাক্ষর সম্পন্ন করবেন।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2.5">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                ৩
              </div>
              <h3 className="font-bold text-sm text-foreground">ড্যাশবোর্ড ও কিউআর স্ক্যানার অ্যাক্টিভেশন</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ডিজিটাল পার্টনার পোর্টালের লগইন বুঝে নিয়ে অফিসিয়াল ডিরেক্টরিতে পার্টনার ব্যাজসহ লাইভ হয়ে যান।
              </p>
            </div>
          </div>
        </section>

        {/* Geographic Scope & Compliance Notice Card */}
        <section className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-emerald-500/10 via-primary/5 to-transparent border border-primary/20 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            <MapPin className="h-4 w-4" />
            <span>ভৌগোলিক পরিধি ও উপজেলা পলিসি নোটিশ</span>
          </div>
          <h3 className="font-heading text-base sm:text-lg font-bold text-secondary dark:text-white">
            পার্টনার হাসপাতাল ও ল্যাব চুক্তি বর্তমানে ফেনী সদর (Feni Sadar) এলাকায় প্রযোজ্য
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            হেলথ ক্লাবের অফিশিয়াল চুক্তি ও পার্টনার ব্যাজ শুধুমাত্র ফেনী সদরে অবস্থিত বেসরকারি হাসপাতাল, ডায়াগনস্টিক সেন্টার ও মডেল ফার্মেসির জন্য কার্যকর। তবে দাগনভূঞা, ছাগলনাইয়া, সোনাগাজী, পরশুরাম ও ফুলগাজীসহ সমগ্র ফেনী জেলার রোগীরা ফেনী সদরের এই পার্টনার প্রতিষ্ঠানসমূহে সেবা গ্রহণ করে মেম্বার কার্ড প্রদর্শনে নিশ্চিত ১০-৩০% ছাড় পেয়ে থাকেন।
          </p>
        </section>

        {/* FAQ Section */}
        <BecomePartnerFaqAccordion />

        {/* Collaboration & Emergency Network CTA */}
        <CommunityNetworkCTA hotline={hotline} />
      </div>
    </div>
  );
}
