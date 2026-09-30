import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Stethoscope,
  FileCheck2,
  CheckCircle2,
  Scale,
  AlertTriangle,
  HelpCircle,
  Building2,
  Mail,
  Phone,
  HeartPulse,
  Award,
  Users,
  ExternalLink,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { toBanglaNums } from "@/lib/utils";
import {
  EDITORIAL_PILLARS,
  CLINICAL_SOURCING_POINTS,
  FACT_CHECKING_STEPS,
  EDITORIAL_FAQS,
} from "./data/editorialPolicyData";

export const revalidate = 86400; // 24-hour ISR cache

export async function generateMetadata(): Promise<Metadata> {
  const title = "এডিটোরিয়াল নীতিমালা ও ফ্যাক্ট-চেকিং প্রটোকল | হেলথ ক্লাব";
  const description =
    "হেলথ ক্লাবের চিকিৎসা তথ্য প্রকাশনা নীতিমালা, BMDC নিবন্ধিত বিশেষজ্ঞ চিকিৎসক দ্বারা ফ্যাক্ট-চেকিং, ক্লিনিক্যাল সোর্সিং এবং জনস্বাস্থ্য সতর্কবার্তা।";
  const ogTitle = "এডিটোরিয়াল নীতিমালা, ফ্যাক্ট-চেকিং ও মেডিকেল ডিসক্লেইমার - হেলথ ক্লাব";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/editorial-policy`,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: `${SITE_URL}/editorial-policy`,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

const PILLAR_ICONS = {
  FileCheck2: <FileCheck2 className="h-5 w-5 text-primary" />,
  Stethoscope: <Stethoscope className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
  Scale: <Scale className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
  Building2: <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
};

export default async function EditorialPolicyPage() {
  const contact = await getCachedContactSettings();
  const rawHotline = contact.hotline.replace(/[^0-9]/g, "");
  const normalizedHotline = rawHotline.replace(/^(880|88|0)/, "");
  const hotlineTel = `+880${normalizedHotline}`;
  const hotlineDisplay = toBanglaNums(`+880 ${normalizedHotline}`);

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "হোম",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "এডিটোরিয়াল নীতিমালা",
          item: `${SITE_URL}/editorial-policy`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: "হেলথ ক্লাব এডিটোরিয়াল নীতিমালা, ফ্যাক্ট-চেকিং প্রটোকল ও মেডিকেল ডিসক্লেইমার",
      url: `${SITE_URL}/editorial-policy`,
      description:
        "হেলথ ক্লাবের চিকিৎসা তথ্য প্রকাশনা নীতিমালা, BMDC নিবন্ধিত বিশেষজ্ঞ চিকিৎসক দ্বারা ফ্যাক্ট-চেকিং, ক্লিনিক্যাল সোর্সিং এবং জনস্বাস্থ্য সতর্কবার্তা।",
      inLanguage: "bn-BD",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [
          "#editorial-quick-summary",
          "#fact-checking-workflow",
          "#medical-disclaimer",
        ],
      },
      publisher: {
        "@type": "Organization",
        name: "হেলথ ক্লাব (Health Club)",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/member-card-logo.webp`,
        },
      },
      reviewedBy: {
        "@type": "MedicalOrganization",
        name: "Health Club Clinical Review Board (BMDC-Registered Specialists)",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: EDITORIAL_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-16">
      <JsonLd data={jsonLdData} />

      {/* Breadcrumb Header */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <Breadcrumbs
            items={[
              { label: "হোম", href: "/" },
              { label: "এডিটোরিয়াল নীতিমালা" },
            ]}
          />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-primary font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>ক্লিনিক্যাল স্বচ্ছতা ও সত্যনিষ্ঠ প্রকাশনা</span>
          </span>
        </div>
      </div>

      {/* Page Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background border-b border-border/60 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-5 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold px-3 py-1"
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              E-E-A-T কোয়ালিটি স্ট্যান্ডার্ড
            </Badge>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold px-3 py-1"
            >
              <Stethoscope className="h-3.5 w-3.5 mr-1" />
              BMDC চিকিৎসক দ্বারা পরীক্ষিত
            </Badge>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.25]">
            এডিটোরিয়াল নীতিমালা, ফ্যাক্ট-চেকিং ও মেডিকেল ডিসক্লেইমার
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            রোগী ও সাধারণ পরিবারের জন্য নির্ভরযোগ্য চিকিৎসা তথ্য, বৈজ্ঞানিক প্রমাণভিত্তিক সোর্সিং, BMDC নিবন্ধিত চিকিৎসকদের ক্লিনিক্যাল পর্যালোচনা ও নিরপেক্ষ স্বাস্থ্য নির্দেশিকা।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <span>সর্বশেষ সংস্করণ: <strong className="text-foreground">জানুয়ারি ২০২৬</strong></span>
            <span>•</span>
            <span>পরিচালনায়: <strong className="text-foreground">হেলথ ক্লাব মেডিকেল রিভিউ বোর্ড</strong></span>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-12 sm:space-y-16">

        {/* BLUF Direct Answer Capsule */}
        <section
          id="editorial-quick-summary"
          aria-label="এডিটোরিয়াল নীতিমালার মূল সারসংক্ষেপ"
          className="rounded-2xl border-2 border-primary/25 bg-gradient-to-r from-primary/[0.08] via-card to-primary/[0.03] p-6 sm:p-8 shadow-xs"
        >
          <div className="flex items-center gap-2.5 text-primary mb-3">
            <HeartPulse className="h-5 w-5 shrink-0" />
            <span className="font-heading text-xs font-bold uppercase tracking-wider">
              এক নজরে হেলথ ক্লাব এডিটোরিয়াল প্রতিশ্রুতি (BLUF)
            </span>
          </div>
          <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
            হেলথ ক্লাবের প্রতিটি স্বাস্থ্য নির্দেশিকা, রোগ নির্ণয়ের খরচ তালিকা ও বিশেষজ্ঞ চিকিৎসকের প্রোফাইল জাতীয় স্বাস্থ্য প্রটোকল (DGHS/WHO) এবং বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল (BMDC) নিবন্ধিত চিকিৎসকদের সক্রিয় ক্লিনিক্যাল পর্যালোচনায় প্রস্তুতকৃত। আমরা বাণিজ্যিক ওষুধ প্রস্তুতকারী প্রভাবমুক্ত, ফেনী সদরের বাস্তবসম্মত স্বাস্থ্য তথ্যভিত্তিক এবং রোগীর নিরাপত্তা ও অধিকার রক্ষায় সর্বোচ্চ স্বচ্ছতা বজায় রাখতে প্রতিশ্রুতিবদ্ধ।
          </p>
        </section>

        {/* Section 1: Core Pillars */}
        <section aria-labelledby="core-pillars-heading" className="space-y-6">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/25 bg-primary/5">
              স্তম্ভসমূহ
            </Badge>
            <h2 id="core-pillars-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              আমাদের এডিটোরিয়াল দর্শনের ৪টি মূল স্তম্ভ
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              স্বাস্থ্যসেবা সম্পর্কিত তথ্য মানুষের জীবনের সাথে সরাসরি জড়িত। তাই হেলথ ক্লাব তথ্য উপস্থাপনায় কোনো আপস করে না।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {EDITORIAL_PILLARS.map((col, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-3 hover:border-primary/40 transition-colors shadow-xs"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  {PILLAR_ICONS[col.iconName]}
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  {col.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {col.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Clinical Sourcing */}
        <section aria-labelledby="sourcing-heading" className="space-y-6 border-t border-border/60 pt-10">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/25 bg-primary/5">
              সোর্সিং মানদণ্ড
            </Badge>
            <h2 id="sourcing-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              ক্লিনিক্যাল তথ্য সংগ্রহ ও রেফারেন্স সোর্সিং মানদণ্ড
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              হেলথ ক্লাব কোনো অনির্ভরযোগ্য সোশ্যাল মিডিয়া পোস্ট, ইন্টারনেট গুজব বা বাণিজ্যিক প্রচারণাকে তথ্যের উৎস হিসেবে বিবেচনা করে না।
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-5">
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
              আমাদের প্রাথমিক চিকিৎসা ও বৈজ্ঞানিক তথ্যসূত্রসমূহ:
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-muted-foreground">
              {CLINICAL_SOURCING_POINTS.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                  <span>
                    <strong className="text-foreground">{pt.title}</strong> {pt.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 3: 4-Step Fact-Checking Workflow */}
        <section id="fact-checking-workflow" aria-labelledby="workflow-heading" className="space-y-6 border-t border-border/60 pt-10">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/25 bg-primary/5">
              ফ্যাক্ট-চেকিং প্রটোকল
            </Badge>
            <h2 id="workflow-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              চার-ধাপের মেডিকেল রিভিউ ও ফ্যাক্ট-চেকিং প্রটোকল
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              একটি স্বাস্থ্য গাইড প্রকাশিত হওয়ার পূর্বে চারটি সুনির্দিষ্ট ও নিশ্ছিদ্র যাচাইকরণ ধাপ অতিক্রম করে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FACT_CHECKING_STEPS.map((st, i) => (
              <div key={i} className="rounded-2xl border border-primary/20 bg-card p-5 sm:p-6 space-y-2.5 relative">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full inline-block">
                  {st.step}
                </span>
                <h3 className="font-heading text-base font-bold text-foreground">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Geographic Scope & Pricing Rules */}
        <section aria-labelledby="geo-pricing-heading" className="space-y-6 border-t border-border/60 pt-10">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/25 bg-primary/5">
              স্বচ্ছতা ও সত্যতা
            </Badge>
            <h2 id="geo-pricing-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              ভৌগোলিক সীমাবদ্ধতা ও ডায়াগনস্টিক প্রাইসিং নীতিমালা
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              রোগীদের কোনো প্রকার মিথ্যা প্রতিশ্রুতি বা বিভ্রান্তিকর খরচের হিসাব না দেওয়া আমাদের সর্বোচ্চ অগ্রাধিকার।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-foreground font-heading font-bold text-base">
                <Building2 className="h-5 w-5 text-primary shrink-0" />
                <span>পার্টনার সুবিধা কেবল ফেনী সদরে সীমাবদ্ধ</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                হেলথ ক্লাবের সকল অফিসিয়াল হাসপাতাল ও ডায়াগনস্টিক চুক্তি শুধুমাত্র <strong>ফেনী সদর</strong> কেন্দ্রিক। দাগনভূঞা, ছাগলনাইয়া, সোনাগাজী, পরশুরাম বা ফুলগাজীর কোনো প্রতিষ্ঠান বর্তমানে আমাদের পার্টনার নয়। তাই উপজেলা গাইডে বিভ্রান্তি এড়াতে পার্টনার সুবিধা প্রদর্শিত হয় না।
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-foreground font-heading font-bold text-base">
                <Award className="h-5 w-5 text-primary shrink-0" />
                <span>১০-৩০% মেম্বার ছাড় প্রদর্শনের নিয়ম</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                টেস্ট বা অপারেশনের ফি টেবিলে কোনো বানিয়ে দেওয়া কাল্পনিক ডিসকাউন্ট টাকার অঙ্ক দেখানো হয় না। বাজারমূল্যের সাধারণ রেঞ্জ প্রদর্শনের পাশাপাশি মেম্বারদের জন্য অফিসিয়ালি <strong>১০-৩০% মেম্বার ছাড়</strong> ব্যাজ উল্লেখ করা হয়, যা কার্ডধারীদের প্রকৃত সাশ্রয় নিশ্চিত করে।
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Corrections & Feedback */}
        <section aria-labelledby="corrections-heading" className="space-y-6 border-t border-border/60 pt-10">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/25 bg-primary/5">
              জবাবদিহিতা
            </Badge>
            <h2 id="corrections-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              কনটেন্ট সংশোধন ও পাঠক প্রতিক্রিয়া নীতি
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              চিকিৎসা বিজ্ঞানের তথ্য প্রতিনিয়ত পরিবর্তনশীল। আমরা যেকোনো অসঙ্গতি স্বচ্ছভাবে দ্রুত সংশোধন করতে প্রতিশ্রুতিবদ্ধ।
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              যদি আমাদের কোনো গাইডে কোনো ওষুধের নাম, ক্লিনিক্যাল টেস্ট প্রস্তুতি, ডাক্তারের চেম্বার শিডিউল কিংবা টেস্টের খরচে অনিচ্ছাকৃত কোনো অসঙ্গতি পরিলক্ষিত হয়, তবে যেকোনো পাঠক বা চিকিৎসক আমাদের সাথে যোগাযোগ করতে পারেন। আমাদের এডিটোরিয়াল বোর্ড সংশ্লিষ্ট তথ্য পুঙ্খানুপুঙ্খ তদন্ত করে সর্বোচ্চ <strong>২৪ থেকে ৪৮ ঘণ্টার মধ্যে</strong> আর্টিকেলে সংশোধন আনয়ন করে এবং প্রয়োজনীয় ক্ষেত্রে এডিটোরিয়াল নোট সংযুক্ত করে।
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-primary" />
                <span>ইমেইল: <strong className="font-medium">editorial@healthclubfeni.com</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-primary" />
                <span>জরুরি হেল্পলাইন: <a href={`tel:${hotlineTel}`} className="hover:underline font-medium text-primary">{hotlineDisplay}</a></span>
              </span>
            </div>
          </div>
        </section>

        {/* Section 6: Official Medical Disclaimer */}
        <section
          id="medical-disclaimer"
          aria-labelledby="disclaimer-heading"
          className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-amber-500/5 p-6 sm:p-8 space-y-4 shadow-sm"
        >
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <h2 id="disclaimer-heading" className="font-heading text-lg sm:text-xl font-bold">
              অফিশিয়াল মেডিকেল ডিসক্লেইমার ও ক্লিনিক্যাল দায়মুক্তি
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed">
            <p>
              <strong>১. সাধারণ স্বাস্থ্য সচেতনতা:</strong> হেলথ ক্লাবের ওয়েবসাইটের সকল আর্টিকেল, স্বাস্থ্য টিপস, ডায়াগনস্টিক পরীক্ষার নির্দেশিকা ও স্বাস্থ্য ক্যালকুলেটরের তথ্য শুধুমাত্র সাধারণ মানুষের স্বাস্থ্য সচেতনতা বৃদ্ধি ও তথ্যপ্রাপ্তি সহজ করার লক্ষ্যে প্রকাশিত।
            </p>
            <p>
              <strong>২. ডাক্তারের বিকল্প নয়:</strong> এই তথ্যগুলো কোনো অবস্থাতেই বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল (BMDC) নিবন্ধিত বিশেষজ্ঞ চিকিৎসকের সরাসরি পরামর্শ, ক্লিনিক্যাল রোগ নির্ণয় কিংবা প্রেসক্রিপশনের বিকল্প নয়। কোনো শারীরিক সমস্যা বা ওষুধ শুরু বা বন্ধ করার পূর্বে সর্বদা চিকিৎসকের পরামর্শ গ্রহণ করুন।
            </p>
            <p>
              <strong>৩. জরুরি চিকিৎসা সতর্কতা:</strong> তীব্র বুকে ব্যথা, শ্বাসকষ্ট, হঠাৎ শরীরের একাংশ অবশ হয়ে যাওয়া, অতিরিক্ত রক্তক্ষরণ, হঠাৎ অজ্ঞান হওয়া কিংবা গুরুতর আঘাতের মতো ইমার্জেন্সিতে ইন্টারনেটের তথ্যের অপেক্ষায় সময় নষ্ট করবেন না। অবিলম্বে জাতীয় জরুরি সেবা <strong>৯৯৯ (999)</strong> অথবা <strong>ফেনী সদর ২৫০ শয্যা জেনারেল হাসপাতালের জরুরি বিভাগে (০১৭৩০-৩২৪৭৮৪)</strong> রোগী নিয়ে যান।
            </p>
          </div>
        </section>

        {/* Section 7: FAQs (AEO & Voice Search) */}
        <section aria-labelledby="faq-heading" className="space-y-6 border-t border-border/60 pt-10">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/25 bg-primary/5">
              প্রশ্নোত্তর
            </Badge>
            <h2 id="faq-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              এডিটোরিয়াল নীতিমালা সম্পর্কিত সাধারণ প্রশ্নোত্তর
            </h2>
          </div>

          <div className="space-y-4">
            {EDITORIAL_FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-2"
              >
                <h3 className="font-heading text-sm sm:text-base font-bold text-foreground flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: Editorial Feedback Box */}
        <section aria-label="এডিটোরিয়াল ফিডব্যাক ও যোগাযোগ" className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center space-y-4">
          <Users className="h-8 w-8 text-primary mx-auto" />
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            আপনার কোনো মতামত বা সংশোধনী প্রস্তাব আছে?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            আমরা আমাদের পাঠকদের সুচিন্তিত মতামতকে শ্রদ্ধা জানাই। ফেনীর কোনো স্বাস্থ্যসেবা প্রতিষ্ঠান, বিশেষজ্ঞ চিকিৎসক বা ডায়াগনস্টিক পরীক্ষার তথ্য সম্পর্কে আপনার পর্যবেক্ষণ আমাদের পাঠাতে দ্বিধা করবেন না।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity"
            >
              <span>আমাদের সাথে যোগাযোগ করুন</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border/80 bg-background text-foreground font-semibold text-xs sm:text-sm hover:bg-muted transition-colors"
            >
              <span>স্বাস্থ্য ব্লগ ও গাইড দেখুন</span>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
