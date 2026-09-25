import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { BmiCalculator } from "./components/BmiCalculator";
import { WaterIntakeCalculator } from "./components/WaterIntakeCalculator";
import { CalorieCalculator } from "./components/CalorieCalculator";
import { PregnancyCalculator } from "./components/PregnancyCalculator";
import { BpDiabetesEvaluator } from "./components/BpDiabetesEvaluator";
import { HealthReportExportButton } from "./components/HealthReportExportButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, Scale, Droplet, Flame, Baby, HeartPulse, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "ফ্রি স্বাস্থ্য ক্যালকুলেটর: বিএমআই, রক্তচাপ ও ডায়াবেটিস, পানির চাহিদা, ক্যালোরি ও গর্ভকালীন ইডিডি",
  description: "সহজেই আপনার বডি ম্যাস ইনডেক্স (BMI), রক্তচাপ ও ডায়াবেটিস মাত্রা মূল্যায়ন, দৈনিক পানির প্রয়োজনীয়তা, ক্যালোরি চাহিদা ও গর্ভকালীন প্রসবের সম্ভাব্য তারিখ (EDD) হিসাব করুন।",
  alternates: {
    canonical: `${SITE_URL}/health-tools`,
  },
  openGraph: {
    title: "ফ্রি স্বাস্থ্য ক্যালকুলেটর: বিএমআই, রক্তচাপ ও ডায়াবেটিস, পানির চাহিদা, ক্যালোরি ও গর্ভকালীন ইডিডি - হেলথ ক্লাব",
    description: "সহজেই আপনার বডি ম্যাস ইনডেক্স (BMI), রক্তচাপ ও ডায়াবেটিস মাত্রা মূল্যায়ন, দৈনিক পানির প্রয়োজনীয়তা, ক্যালোরি চাহিদা ও গর্ভকালীন প্রসবের সম্ভাব্য তারিখ (EDD) হিসাব করুন।",
    url: `${SITE_URL}/health-tools`,
    siteName: "হেলথ ক্লাব (Health Club)",
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: "ফ্রি স্বাস্থ্য ক্যালকুলেটর টুলস - হেলথ ক্লাব",
    description: "সহজেই আপনার বডি ম্যাস ইনডেক্স (BMI), রক্তচাপ ও ডায়াবেটিস মাত্রা মূল্যায়ন, দৈনিক পানির প্রয়োজনীয়তা, ক্যালোরি চাহিদা ও গর্ভকালীন প্রসবের সম্ভাব্য তারিখ (EDD) হিসাব করুন।",
    images: DEFAULT_TWITTER_IMAGES,
  },
  keywords: [
    "BMI calculator bangla",
    "বিএমআই ক্যালকুলেটর",
    "Blood pressure calculator bangla",
    "রক্তচাপ মূল্যায়ন",
    "Diabetes blood sugar calculator",
    "ডায়াবেটিস ও রক্তের শর্করা",
    "Water intake calculator",
    "দৈনিক পানির পরিমাণ",
    "Calorie calculator",
    "Pregnancy due date calculator bangla",
    "গর্ভকালীন প্রসবের তারিখ ইডিডি",
    "Health Club health tools",
  ],
};

export default function HealthToolsPage() {
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
          name: "হেলথ ক্যালকুলেটরস",
          item: `${SITE_URL}/health-tools`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "হেলথ ক্লাব ইন্টারেক্টিভ স্বাস্থ্য ক্যালকুলেটর",
      url: `${SITE_URL}/health-tools`,
      applicationCategory: "HealthApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BDT",
        availability: "https://schema.org/InStock",
        name: "ফ্রি স্বাস্থ্য মূল্যায়ন ক্যালকুলেটর",
      },
      description: "বিএমআই (BMI), রক্তচাপ ও ডায়াবেটিস মূল্যায়ন, দৈনিক পানির চাহিদা, ক্যালোরি পরিমাপ ও গর্ভকালীন প্রসবের সম্ভাব্য তারিখ হিসাবের ফ্রি ডিজিটাল স্বাস্থ্য টুলস।",
      provider: {
        "@type": "Organization",
        name: "Health Club",
        url: SITE_URL,
      },
      featureList: [
        "বডি ম্যাস ইনডেক্স (BMI) ও আদর্শ ওজন নির্ণয়",
        "রক্তচাপ ও রক্তের শর্করা / ডায়াবেটিস রেঞ্জ মূল্যায়ন",
        "দৈনিক পানির প্রয়োজনীয় পরিমাণ নির্ণয়",
        "ক্যালোরি চাহিদা, ওজন হ্রাস ও বৃদ্ধির পরিমাপক",
        "গর্ভকালীন প্রসবের সম্ভাব্য তারিখ (EDD) ও শিশুর বর্তমান অবস্থা",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "কিভাবে আপনার বিএমআই (BMI) বা বডি ম্যাস ইনডেক্স হিসাব করবেন",
      description: "হেলথ ক্লাবের বিএমআই ক্যালকুলেটর ব্যবহার করে আপনার বডি ম্যাস ইনডেক্স নির্ণয় এবং ওজন সঠিক রেঞ্জে আছে কিনা তা জানার সহজ ধাপ।",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "উচ্চতার একক নির্বাচন ও মান দিন",
          text: "ফিট/ইঞ্চি বা সেন্টিমিটার একক বেছে নিন এবং আপনার উচ্চতা লিখুন।",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "শরীরের ওজন লিখুন",
          text: "কিলোগ্রাম (কেজি) এককে আপনার বর্তমান ওজন লিখুন।",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "হিসাব করুন ও ফলাফল দেখুন",
          text: "'হিসাব করুন' বাটনে চাপ দিয়ে আপনার বিএমআই স্কোর, স্বাস্থ্যগত অবস্থা এবং আপনার জন্য আদর্শ স্বাস্থ্যকর ওজন জেনে নিন।",
        },
      ],
      tool: [
        {
          "@type": "HowToTool",
          name: "হেলথ ক্লাব বিএমআই ক্যালকুলেটর",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "কিভাবে দৈনিক পানির প্রয়োজনীয় চাহিদা হিসাব করবেন",
      description: "শরীরের ওজন, শারীরিক পরিশ্রমের মাত্রা এবং আবহাওয়ার ওপর ভিত্তি করে দৈনিক কত লিটার পানি পান করা উচিত তা জানার নিয়ম।",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "শরীরের ওজন দিন",
          text: "আপনার বর্তমান ওজন কেজি (kg) এককে লিখুন।",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "পরিশ্রমের মাত্রা ও আবহাওয়া নির্বাচন",
          text: "আপনার দৈনিক শারীরিক পরিশ্রমের মাত্রা (হালকা, মাঝারি, ভারী) এবং বর্তমান আবহাওয়া (স্বাভাবিক বা গরম/আর্দ্র) নির্বাচন করুন।",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "দৈনিক পানির লক্ষ্যমাত্রা দেখুন",
          text: "'পানির পরিমাণ দেখুন' বাটনে ক্লিক করে দৈনিক কত লিটার ও কত গ্লাস পানি পান করা প্রয়োজন তা জেনে নিন।",
        },
      ],
      tool: [
        {
          "@type": "HowToTool",
          name: "হেলথ ক্লাব ওয়াটার ইনটেক ক্যালকুলেটর",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "কিভাবে দৈনিক ক্যালোরি চাহিদা হিসাব করবেন",
      description: "মিফলিন-সেন্ট জিওর ফর্মুলায় আপনার বিএমআর (BMR) এবং ওজন বজায় রাখা, কমানো বা বাড়ানোর জন্য প্রয়োজনীয় দৈনিক ক্যালোরি নির্ণয়ের নিয়ম।",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "ব্যক্তিগত তথ্য প্রদান",
          text: "লিঙ্গ নির্বাচন করুন এবং আপনার বয়স (বছর), উচ্চতা (সেমি) ও ওজন (কেজি) লিখুন।",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "দৈনিক শারীরিক সক্রিয়তার মাত্রা নির্বাচন",
          text: "আপনার জীবনযাপনের সক্রিয়তার ধরন (ব্যায়ামহীন, হালকা ব্যায়াম, মাঝারি বা বেশি সক্রিয়) নির্বাচন করুন।",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "ক্যালোরি লক্ষ্যমাত্রা নির্ণয়",
          text: "'ক্যালোরি হিসাব করুন' বাটনে ক্লিক করে বিএমআর, দৈনিক মেইনটেন্যান্স ক্যালোরি, ওজন কমানোর নিরাপদ ক্যালোরি এবং ওজন বাড়ানোর ক্যালোরি হিসাব দেখে নিন।",
        },
      ],
      tool: [
        {
          "@type": "HowToTool",
          name: "হেলথ ক্লাব ক্যালোরি ক্যালকুলেটর",
        },
      ],
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <JsonLd data={jsonLdData} />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-cyan-500/5 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-8 sm:py-16 border-b border-border/60">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
            <Calculator className="h-3.5 w-3.5" />
            <span>স্মার্ট স্বাস্থ্য মূল্যায়ন টুলস</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            ইন্টারেক্টিভ হেলথ ক্যালকুলেটরস
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            আপনার শরীরের বিএমআই, রক্তচাপ ও ডায়াবেটিস রেঞ্জ, দৈনিক পানির প্রয়োজনীয়তা, ক্যালোরি চাহিদা ও গর্ভকালীন অগ্রগতি সহজে জেনে নিন।
          </p>

          <div className="flex justify-center pt-2">
            <HealthReportExportButton />
          </div>
        </div>
      </div>

      {/* Main Hub Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
        <Tabs defaultValue="bmi" className="w-full space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-3xl grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto p-1.5 bg-muted/80 rounded-2xl gap-1">
              <TabsTrigger
                value="bmi"
                className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 py-2.5"
              >
                <Scale className="h-4 w-4 shrink-0" />
                <span className="truncate">বিএমআই</span>
              </TabsTrigger>
              <TabsTrigger
                value="bp-diabetes"
                className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-rose-600 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 py-2.5"
              >
                <HeartPulse className="h-4 w-4 shrink-0" />
                <span className="truncate">রক্তচাপ ও সুগার</span>
              </TabsTrigger>
              <TabsTrigger
                value="water"
                className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-cyan-600 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 py-2.5"
              >
                <Droplet className="h-4 w-4 shrink-0" />
                <span className="truncate">পানির চাহিদা</span>
              </TabsTrigger>
              <TabsTrigger
                value="calories"
                className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-orange-600 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 py-2.5"
              >
                <Flame className="h-4 w-4 shrink-0" />
                <span className="truncate">ক্যালোরি</span>
              </TabsTrigger>
              <TabsTrigger
                value="pregnancy"
                className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-pink-600 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5 py-2.5 col-span-2 sm:col-span-1"
              >
                <Baby className="h-4 w-4 shrink-0" />
                <span className="truncate">গর্ভকালীন ইডিডি</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bmi" className="pt-2">
            <BmiCalculator />
          </TabsContent>

          <TabsContent value="bp-diabetes" className="pt-2">
            <BpDiabetesEvaluator />
          </TabsContent>

          <TabsContent value="water" className="pt-2">
            <WaterIntakeCalculator />
          </TabsContent>

          <TabsContent value="calories" className="pt-2">
            <CalorieCalculator />
          </TabsContent>

          <TabsContent value="pregnancy" className="pt-2">
            <PregnancyCalculator />
          </TabsContent>
        </Tabs>

        {/* Doctor Consultation Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-emerald-500/5 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white">
                বিশেষজ্ঞ ডাক্তারের পরামর্শ প্রয়োজন?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                মেডিসিন, ডায়াবেটিস ও পুষ্টি বিশেষজ্ঞ ডাক্তারদের চেম্বার শিডিউল দেখুন ও ডিসকাউন্ট সুবিধায় সেবা নিন।
              </p>
            </div>
          </div>
          <Link
            href="/consultants"
            className={buttonVariants({
              size: "lg",
              className: "shrink-0 w-full sm:w-auto font-bold",
            })}
          >
            <span>ডাক্তারদের তালিকা দেখুন</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
