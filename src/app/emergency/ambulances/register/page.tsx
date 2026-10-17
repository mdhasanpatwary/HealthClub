import type { Metadata } from "next";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  HelpCircle,
  FileCheck2,
  ArrowRight,
  Activity,
  Wind,
  Snowflake,
  PhoneCall,
  HeartHandshake,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import AmbulanceRegistrationForm from "./AmbulanceRegistrationForm";
import { WhatsAppIcon } from "@/components/ui/SocialBrandIcons";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { getWhatsAppUniversalUrl } from "@/lib/whatsapp";
import { toBanglaNums } from "@/lib/utils";
import {
  buildAmbulanceRegisterJsonLd,
  AMBULANCE_REGISTER_FAQS,
} from "./ambulanceRegisterSeo";

export const revalidate = false; // Pure static SSG

export async function generateMetadata(): Promise<Metadata> {
  const ogTitle = "অ্যাম্বুলেন্স ও ড্রাইভার নিবন্ধন ফরম | ফেনী জরুরি অ্যাম্বুলেন্স তালিকাভুক্তি - হেলথ ক্লাব";
  const ogDesc = "ফেনী জেলা ও মহাসড়কের সকল অ্যাম্বুলেন্স চালক ও মালিকদের জন্য ১০০% ফ্রি অ্যাম্বুলেন্স তালিকাভুক্তি পোর্টাল। আপনার আইসিইউ, এসি বা ফ্রিজার গাড়ি যুক্ত করুন।";
  const canonicalUrl = `${SITE_URL}/emergency/ambulances/register`;

  return {
    title: "অ্যাম্বুলেন্স ও ড্রাইভার নিবন্ধন ফরম | ফেনী জরুরি অ্যাম্বুলেন্স তালিকাভুক্তি",
    description: "ফেনীর অ্যাম্বুলেন্স চালক ও মালিকদের জন্য ১০০% ফ্রি লিস্টিং পোর্টাল। আইসিইউ, এসি, নন-এসি ও ফ্রিজিং অ্যাম্বুলেন্সের স্ট্যান্ড লোকেশন ও ফোন নম্বর হেলথ ক্লাবে যুক্ত করুন।",
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      "ambulance registration feni",
      "ambulance driver enlistment",
      "ফেনী অ্যাম্বুলেন্স নিবন্ধন",
      "অ্যাম্বুলেন্স ড্রাইভার তালিকাভুক্তি",
      "মহিপাল অ্যাম্বুলেন্স নম্বর এন্ট্রি",
      "আইসিইউ অ্যাম্বুলেন্স যুক্ত করুন",
      "ফেনী এসি অ্যাম্বুলেন্স চালক",
      "freezer ambulance registration feni",
      "health club ambulance join",
    ],
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonicalUrl,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default async function AmbulanceRegistrationPage() {
  const contact = await getCachedContactSettings();
  const whatsappNumber = contact.whatsapp || "01886763849";
  const whatsappUrl = getWhatsAppUniversalUrl(
    whatsappNumber,
    "আমি ফেনীর একজন অ্যাম্বুলেন্স চালক/মালিক। হেলথ ক্লাবের জরুরি তালিকায় আমার গাড়ির তথ্য যুক্ত করতে চাই।"
  );
  const pageCanonicalUrl = `${SITE_URL}/emergency/ambulances/register`;
  const jsonLdData = buildAmbulanceRegisterJsonLd(pageCanonicalUrl);

  return (
    <div className="bg-background min-h-screen py-8 sm:py-14">
      <JsonLd data={jsonLdData} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">হোম</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/emergency" className="hover:text-primary transition-colors">জরুরি সেবা</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/emergency/ambulances" className="hover:text-primary transition-colors">জরুরি অ্যাম্বুলেন্স</Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-semibold">অ্যাম্বুলেন্স নিবন্ধন</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ফেনীর অ্যাম্বুলেন্স চালক ও মালিকদের জন্য ১০০% ফ্রি সেবা</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white tracking-tight">
            হেলথ ক্লাব জরুরি নেটওয়ার্কে আপনার অ্যাম্বুলেন্স তালিকাভুক্ত করুন
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            ফেনী সদর, মহিপাল ও ঢাকা-চট্টগ্রাম মহাসড়কের জরুরি রোগীদের দ্রুত সহায়তায় আপনার অ্যাম্বুলেন্স সেবা বিনামূল্যে ডিরেক্টরিতে যুক্ত করে সরাসরি রোগীদের ফোন কল পান।
          </p>
        </div>

        {/* Direct Answer Capsule (GEO Bottom Line Up Front) */}
        <div
          id="ambulance-register-bluf"
          className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border border-primary/20 max-w-3xl mx-auto"
        >
          <p id="ambulance-register-summary" className="text-xs sm:text-sm text-foreground/90 leading-relaxed text-center">
            <strong>সরাসরি উত্তর (BLUF):</strong> ফেনী সদর, মহিপাল ও উপজেলার যে কোনো বৈধ অ্যাম্বুলেন্স চালক বা প্রতিষ্ঠান সম্পূর্ণ বিনামূল্যে হেলথ ক্লাব জরুরি ডিরেক্টরিতে আইসিইউ, এসি, নন-এসি বা ফ্রিজার গাড়ি তালিকাভুক্ত করতে পারেন। অনলাইন ফর্ম বা হোয়াটসঅ্যাপে তথ্য পাঠানোর ১২-২৪ ঘণ্টার মধ্যে তথ্য যাচাই করে সেবাটি সর্বসাধারণের জন্য উন্মুক্ত করা হয়।
          </p>
        </div>

        {/* 3 Value Proposition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              ১০০% ফ্রি ও আজীবন লিস্টিং
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              অ্যাম্বুলেন্স তালিকাভুক্তির জন্য কোনো রেজিস্ট্রেশন ফি বা মাসিক কমিশন দিতে হয় না।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              গুগল ও AI সার্চে শীর্ষ অবস্থান
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              জরুরি মুহূর্তে ফেনী ও মহিপাল এলাকায় রোগী বা স্বজনরা অ্যাম্বুলেন্স সার্চ করলেই আপনার নম্বর পাবেন।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <PhoneCall className="h-5 w-5" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              দালালমুক্ত সরাসরি যাত্রী কল
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              কোনো ব্রোকার বা মধ্যস্বত্বভোগী নেই। রোগী ও তাদের অভিভাবকেরা সরাসরি আপনার নম্বরে কল দিয়ে ভাড়া নির্ধারণ করবেন।
            </p>
          </div>
        </div>

        {/* Alternative Fast-Track Option: WhatsApp Submission */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              <FileCheck2 className="h-4 w-4" />
              <span>সহজ বিকল্প পদ্ধতি</span>
            </div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-secondary dark:text-white">
              ফর্ম পূরণের সময় নেই? গাড়ির কার্ড বা তথ্য পাঠান WhatsApp-এ!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              আপনার অ্যাম্বুলেন্সের ভিজিটিং কার্ড বা ড্রাইভারের মোবাইল নম্বর ও গাড়ির ধরন লিখে আমাদের অফিসিয়াল WhatsApp-এ পাঠিয়ে দিন। আমাদের টিম তা সাজিয়ে যুক্ত করে দেবে।
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <WhatsAppIcon className="h-4 w-4 fill-white" />
            <span>WhatsApp-এ তথ্য পাঠান</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Supported Vehicle Types Guidelines */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="text-center space-y-1.5">
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white">
              যেসব ক্যাটাগরির অ্যাম্বুলেন্স তালিকাভুক্ত হতে পারে
            </h2>
            <p className="text-xs text-muted-foreground">
              রোগীর অবস্থা অনুযায়ী সঠিক গাড়ি নির্বাচন নিশ্চিত করতে আমরা ৪টি ক্যাটাগরিতে অ্যাম্বুলেন্স বিন্যস্ত করি
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs sm:text-sm">
                <Activity className="h-4 w-4" />
                <span>আইসিইউ (ICU) সাপোর্ট</span>
              </div>
              <p className="text-2xs sm:text-xs text-muted-foreground leading-relaxed">
                ভেন্টিলেটর, মনিটর, অক্সিজেন ও লাইফ সাপোর্ট সমৃদ্ধ জরুরি অ্যাম্বুলেন্স।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs sm:text-sm">
                <Wind className="h-4 w-4" />
                <span>এসি (AC) অ্যাম্বুলেন্স</span>
              </div>
              <p className="text-2xs sm:text-xs text-muted-foreground leading-relaxed">
                শীতাতপ নিয়ন্ত্রিত আধুনিক গাড়ি, যা ঢাকা বা চট্টগ্রামে রোগী পরিবহনে উপযোগী।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs sm:text-sm">
                <Truck className="h-4 w-4" />
                <span>নন-এসি ক্যারিয়ার</span>
              </div>
              <p className="text-2xs sm:text-xs text-muted-foreground leading-relaxed">
                ফেনী শহর ও স্থানীয় উপজেলার মধ্যে সাশ্রয়ী খরচে দ্রুত রোগী পরিবহনের বাহন।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs sm:text-sm">
                <Snowflake className="h-4 w-4" />
                <span>ফ্রিজিং ডেড-বডি ক্যারিয়ার</span>
              </div>
              <p className="text-2xs sm:text-xs text-muted-foreground leading-relaxed">
                মরদেহ সম্মানজনক ও সুরক্ষিত রাখতে বিশেষায়িত শীতাতপ ফ্রিজিং ভ্যান।
              </p>
            </div>
          </div>
        </div>

        {/* 3 Step Timeline */}
        <div className="space-y-4 max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white">
            কীভাবে আপনার অ্যাম্বুলেন্স তালিকাভুক্ত হবে?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-bold text-primary font-mono">ধাপ ১</span>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">তথ্য প্রদান</h3>
              <p className="text-2xs sm:text-xs text-muted-foreground">
                নিচের ফর্মে গাড়ির ধরন, চালকের নাম, স্ট্যান্ড লোকেশন ও মোবাইল নম্বর দিন।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-bold text-primary font-mono">ধাপ ২</span>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">ড্রাইভার যাচাই</h3>
              <p className="text-2xs sm:text-xs text-muted-foreground">
                রোগীর জরুরি নিরাপত্তা নিশ্চিত করতে আমাদের টিম ফোন করে লোকেশন যাচাই করবে।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-bold text-primary font-mono">ধাপ ৩</span>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">ডিরেক্টরিতে প্রকাশ</h3>
              <p className="text-2xs sm:text-xs text-muted-foreground">
                ১২-২৪ ঘণ্টার মধ্যে হেলথ ক্লাব জরুরি পোর্টালে আপনার অ্যাম্বুলেন্স লাইভ হবে।
              </p>
            </div>
          </div>
        </div>

        {/* Main Registration Form */}
        <div className="max-w-3xl mx-auto">
          <AmbulanceRegistrationForm />
        </div>

        {/* Fair Fare & Anti-Middleman Commitment Notice */}
        <div className="p-6 rounded-3xl bg-linear-to-r from-primary/10 via-card to-background border border-primary/20 max-w-3xl mx-auto space-y-3">
          <div className="flex items-center gap-2.5 text-primary font-bold text-sm sm:text-base">
            <HeartHandshake className="h-5 w-5" />
            <span>ন্যায্য ভাড়া নিশ্চয়তা ও দালালমুক্ত সেবার অঙ্গীকার</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            হেলথ ক্লাব কোনো মধ্যস্বত্বভোগী বা কমিশন গ্রহণ করে না। অ্যাম্বুলেন্স চালক বা মালিকরা মুমূর্ষু রোগীর সংকটকালে সরকারি ও যৌক্তিক ন্যায্য ভাড়া নেবেন—এই মানবিক দায়িত্ববোধে আমরা একত্রে কাজ করছি। যে কোনো অতিরিক্ত ভাড়া দাবি বা জিম্মিদশার অভিযোগ তদন্তসাপেক্ষে তালিকা বাতিল হতে পারে।
          </p>
        </div>

        {/* AEO FAQ Section */}
        <div id="ambulance-reg-faq" className="space-y-4 max-w-3xl mx-auto pt-6 border-t border-border/80">
          <div className="text-center space-y-1.5">
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white">
              সাধারণ জিজ্ঞাসা (Frequently Asked Questions)
            </h2>
            <p className="text-xs text-muted-foreground">
              অ্যাম্বুলেন্স তালিকাভুক্তি ও চালক নেটওয়ার্ক সম্পর্কিত প্রয়োজনীয় তথ্য
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {AMBULANCE_REGISTER_FAQS.map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 space-y-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-foreground">
                  প্রশ্ন: {faq.question}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  উত্তর: {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Assistance Help Box */}
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 text-center space-y-2 max-w-xl mx-auto">
          <HelpCircle className="h-6 w-6 text-primary mx-auto" />
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            কোনো তথ্যের জন্য সহায়তার প্রয়োজন?
          </h3>
          <p className="text-xs text-muted-foreground">
            আমাদের জরুরি সমন্বয়ক টিমের সাথে সরাসরি কথা বলতে কল করুন:{" "}
            <a href={`tel:${contact.hotline || "01886763849"}`} className="font-bold text-primary hover:underline">
              {toBanglaNums(contact.hotline || "01886763849")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
