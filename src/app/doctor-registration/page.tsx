import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck2,
  ArrowRight,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import DoctorRegistrationForm from "./DoctorRegistrationForm";
import { WhatsAppIcon } from "@/components/ui/SocialBrandIcons";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { getWhatsAppUniversalUrl } from "@/lib/whatsapp";
import { toBanglaNums } from "@/lib/utils";

export const revalidate = false; // Pure static SSG

export async function generateMetadata(): Promise<Metadata> {
  const ogTitle = "ডাক্তার ও চেম্বার নিবন্ধন ফর্ম | ফেনী ডাক্তার তালিকাভুক্তি - হেলথ ক্লাব";
  const ogDesc = "ফেনীর সকল হাসপাতালের বিশেষজ্ঞ চিকিৎসকদের জন্য সম্পূর্ণ ফ্রি চেম্বার রেজিস্ট্রেশন ফর্ম। আপনার ভিজিটিং সময়সূচী ও সিরিয়াল নম্বর হেলথ ক্লাব ডিরেক্টরিতে যুক্ত করুন।";

  return {
    title: "ডাক্তার ও চেম্বার নিবন্ধন ফর্ম | ফেনী ডাক্তার তালিকাভুক্তি ও সিরিয়াল",
    description: "ফেনীর বিশেষজ্ঞ চিকিৎসকদের জন্য ১০০% ফ্রি চেম্বার রেজিস্ট্রেশন পোর্টাল। আপনার চেম্বার, ভিজিটিং সময়সূচী ও রোগী দেখার সিরিয়াল নম্বর হেলথ ক্লাব ডিরেক্টরিতে যুক্ত করুন।",
    alternates: {
      canonical: `${SITE_URL}/doctor-registration`,
    },
    keywords: [
      "doctor registration form feni",
      "feni doctor chamber listing",
      "ফেনী ডাক্তার চেম্বার নিবন্ধন",
      "ডাক্তার তালিকাভুক্তি ফর্ম",
      "ডাক্তার সিরিয়াল নম্বর এন্ট্রি",
      "feni doctor enlistment",
      "হেলথ ক্লাব ডাক্তার নিবন্ধন",
      "ফেনী বিশেষজ্ঞ ডাক্তার চেম্বার",
      "doctor registration bangladesh",
    ],
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE_URL}/doctor-registration`,
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

export default async function DoctorRegistrationPage() {
  const contact = await getCachedContactSettings();
  const whatsappNumber = contact.whatsapp || "01886763849";
  const whatsappUrl = getWhatsAppUniversalUrl(
    whatsappNumber,
    "আমি একজন চিকিৎসক। হেলথ ক্লাব ফেনী ডিরেক্টরিতে আমার চেম্বারের তথ্য তালিকাভুক্ত করতে চাই।"
  );

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/doctor-registration#webpage`,
        url: `${SITE_URL}/doctor-registration`,
        name: "ডাক্তার ও চেম্বার নিবন্ধন ফর্ম | ফেনী ডাক্তার তালিকাভুক্তি",
        description: "ফেনীর বিশেষজ্ঞ চিকিৎসকদের জন্য সম্পূর্ণ ফ্রি চেম্বার রেজিস্ট্রেশন ফর্ম। আপনার ভিজিটিং সময়সূচী ও সিরিয়াল নম্বর হেলথ ক্লাবে যুক্ত করুন।",
        inLanguage: "bn-BD",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "হেলথ ক্লাব (Health Club)",
        },
      },
      {
        "@type": "HowTo",
        name: "কীভাবে হেলথ ক্লাব ডিরেক্টরিতে ডাক্তার হিসেবে চেম্বার তালিকাভুক্ত করবেন?",
        description: "সহজ ৩টি ধাপে ফেনী হেলথ ক্লাব ডিরেক্টরিতে চিকিৎসকের চেম্বার ও রোগী দেখার সময়সূচী বিনামূল্যে যুক্ত করার নির্দেশিকা।",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "রেজিস্ট্রেশন ফর্মে তথ্য পূরণ",
            text: "ডাক্তারের নাম, বিএমডিসি রেজিস্ট্রেশন নম্বর, ডিগ্রিসমূহ, চেম্বারের নাম, ঠিকানা এবং রোগী দেখার দিন ও সময় দিন।",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "BMDC ও চেম্বার ভেরিফিকেশন",
            text: "আমাদের মেডিকেল ভেরিফিকেশন টিম তথ্য ও বিএমডিসি সনদ ১২-২৪ ঘণ্টার মধ্যে যাচাই করবে।",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "ডিরেক্টরিতে লাইভ প্রকাশ",
            text: "অনুমোদনের পর হাজারো রোগীর জন্য ডিরেক্টরি ও গুগল সার্চে চিকিৎসকের চেম্বার শিডিউল উন্মুক্ত হবে।",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "হেলথ ক্লাব ডিরেক্টরিতে ডাক্তারদের চেম্বার যুক্ত করার ফি কত?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "হেলথ ক্লাব ডিরেক্টরিতে চিকিৎসকদের প্রোফাইল ও চেম্বার তালিকাভুক্তি সম্পূর্ণ ফ্রি (১০০% বিনামূল্যে)। রোগীদের সঠিক চিকিৎসা তথ্য দিতে কোনো চার্জ নেওয়া হয় না।",
            },
          },
          {
            "@type": "Question",
            name: "রেজিস্ট্রেশন করার কতক্ষণ পর চেম্বার তথ্য লাইভ হবে?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "তথ্য জমা দেওয়ার পর আমাদের টিম BMDC রেজিস্ট্রেশন নম্বর যাচাই করে ১২ থেকে ২৪ ঘণ্টার মধ্যে প্রোফাইল ডিরেক্টরিতে লাইভ প্রকাশ করে।",
            },
          },
          {
            "@type": "Question",
            name: "অনলাইন ফর্ম পূরণ ছাড়া কি তথ্য পাঠানো যাবে?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "হ্যাঁ, আপনার প্রেসক্রিপশন প্যাড বা ভিজিটিং কার্ডের ছবি সরাসরি আমাদের অফিসিয়াল WhatsApp নম্বরে (+880 1886763849) পাঠিয়ে দিলে আমাদের টিম তথ্য যুক্ত করে দেবে।",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-background min-h-screen py-8 sm:py-14">
      <JsonLd data={jsonLdData} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {/* Breadcrumb & Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">হোম</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/consultants" className="hover:text-primary transition-colors">ডাক্তার তালিকা</Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-semibold">ডাক্তার রেজিস্ট্রেশন</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ফেনীর চিকিৎসকদের জন্য ১০০% ফ্রি ও উন্মুক্ত সেবা</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white tracking-tight">
            হেলথ ক্লাব ডাক্তার ডিরেক্টরিতে আপনার চেম্বার যুক্ত করুন
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            ফেনী সদর ও সকল উপজেলার হাজারো রোগী প্রতিদিন বিশেষজ্ঞ ডাক্তারদের সিরিয়াল নম্বর ও শিডিউল অনুসন্ধান করেন। বিনামূল্যে আপনার চেম্বারের সঠিক সময়সূচী তালিকাভুক্ত করে সরাসরি রোগীদের সাথে যুক্ত হোন।
          </p>
        </div>

        {/* Direct Answer Capsule (GEO Bottom Line Up Front) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 border border-primary/20 max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed text-center">
            <strong>সরাসরি উত্তর (BLUF):</strong> ফেনীর যে কোনো বিএমডিসি-নিবন্ধিত (BMDC) বিশেষজ্ঞ চিকিৎসক বা তাদের চেম্বার প্রতিনিধি সম্পূর্ণ বিনামূল্যে হেলথ ক্লাব ডিরেক্টরিতে নাম, ডিগ্রি, চেম্বারের ঠিকানা ও সিরিয়াল বুকিং নম্বর যুক্ত করতে পারেন। তথ্য সাবমিটের ১২-২৪ ঘণ্টার মধ্যে ভেরিফিকেশন শেষে তা প্রকাশ করা হয়।
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
              ডাক্তার বা চেম্বার তালিকাভুক্তির জন্য কোনো প্রকার রেজিস্ট্রেশন ফি বা চার্জ নেওয়া হয় না।
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
              রোগীরা গুগলে আপনার নাম বা স্পেশালিটি সার্চ করলে সহজেই আপনার ভেরিফাইড চেম্বার শিডিউল খুঁজে পাবেন।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              সরাসরি সিরিয়াল বুকিং
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              দালালমুক্ত ব্যবস্থাপনায় রোগীরা এক ক্লিকে সরাসরি আপনার চেম্বারের দেওয়া হটলাইনে কল দিয়ে সিরিয়াল নিতে পারবেন।
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
              ফর্ম পূরণের সময় নেই? ভিজিটিং কার্ড পাঠান WhatsApp-এ!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              আপনার প্রেসক্রিপশন প্যাড বা ভিজিটিং কার্ডের স্পষ্ট ছবি তুলে আমাদের অফিসিয়াল WhatsApp নম্বরে পাঠিয়ে দিন। আমাদের প্রতিনিধি তা সাজিয়ে ডিরেক্টরিতে যুক্ত করবেন।
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <WhatsAppIcon className="h-4 w-4 fill-white" />
            <span>WhatsApp-এ কার্ড পাঠান</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* 3 Step Timeline */}
        <div className="space-y-4 max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white">
            কীভাবে আপনার চেম্বার তালিকাভুক্ত হবে?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-bold text-primary font-mono">ধাপ ১</span>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">তথ্য প্রদান</h3>
              <p className="text-2xs sm:text-xs text-muted-foreground">
                নিচের ফর্মে আপনার ডিগ্রি, চেম্বার, ভিজিটিং সময় ও সিরিয়াল নম্বর প্রদান করুন।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-bold text-primary font-mono">ধাপ ২</span>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">মেডিকেল যাচাই</h3>
              <p className="text-2xs sm:text-xs text-muted-foreground">
                রোগীদের সুরক্ষায় আমাদের টিম BMDC রেজিস্ট্রি ও চেম্বার ফোন নম্বর যাচাই করবে।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-bold text-primary font-mono">ধাপ ৩</span>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">ডিরেক্টরিতে প্রকাশ</h3>
              <p className="text-2xs sm:text-xs text-muted-foreground">
                ১২-২৪ ঘণ্টার মধ্যে হেলথ ক্লাব ডাক্তার ডিরেক্টরি ও গুগল সার্চে আপনার প্রোফাইল লাইভ হবে।
              </p>
            </div>
          </div>
        </div>

        {/* The Main Registration Form */}
        <div className="max-w-3xl mx-auto">
          <DoctorRegistrationForm />
        </div>

        {/* AEO FAQ Section */}
        <div className="space-y-4 max-w-3xl mx-auto pt-6 border-t border-border/80">
          <div className="text-center space-y-1.5">
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white">
              সাধারণ জিজ্ঞাসা (Frequently Asked Questions)
            </h2>
            <p className="text-xs text-muted-foreground">
              ডাক্তার চেম্বার লিস্টিং ও তথ্য হালনাগাদ সম্পর্কিত জরুরি তথ্য
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                প্রশ্ন: হেলথ ক্লাব ডিরেক্টরিতে ডাক্তারদের তালিকাভুক্তির ফি কত?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                উত্তর: এটি <strong>১০০% সম্পূর্ণ ফ্রি</strong>। ফেনীর রোগী ও স্বাস্থ্যসেবার সুবিধার্থে ডাক্তারদের চেম্বার তথ্য প্রকাশের জন্য কোনো প্রকার এককালীন বা মাসিক চার্জ নেওয়া হয় না।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                প্রশ্ন: পরবর্তীতে চেম্বারের সময়সূচী বা সিরিয়াল নম্বর পরিবর্তন হলে কীভাবে আপডেট করব?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                উত্তর: খুব সহজেই আমাদের অফিসিয়াল সাপোর্ট নম্বরে বা WhatsApp-এ একটি মেসেজ দিয়ে আপনার পরিবর্তিত শিডিউল জানালেই আমাদের টিম দ্রুত প্রোফাইল আপডেট করে দেবে।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                প্রশ্ন: BMDC রেজিস্ট্রেশন নম্বর দেওয়া কেন বাধ্যতামূলক?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                উত্তর: রোগীদের সর্বোচ্চ চিকিৎসা সুরক্ষা নিশ্চিত করতে এবং ভুয়া চিকিৎসক বা কোয়াকদের অনুপ্রবেশ ঠেকাতে বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল (BMDC) রেজিস্ট্রেশন যাচাই করা হেলথ ক্লাবের একটি বাধ্যতামূলক নীতি।
              </p>
            </div>
          </div>
        </div>

        {/* Assistance Help Box */}
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 text-center space-y-2 max-w-xl mx-auto">
          <HelpCircle className="h-6 w-6 text-primary mx-auto" />
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            কোনো তথ্যের জন্য সহায়তার প্রয়োজন?
          </h3>
          <p className="text-xs text-muted-foreground">
            আমাদের ডিরেক্টরি ব্যবস্থাপনা টিমের সাথে সরাসরি কথা বলতে কল করুন:{" "}
            <a href={`tel:${contact.hotline || "01886763849"}`} className="font-bold text-primary hover:underline">
              {toBanglaNums(contact.hotline || "01886763849")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
