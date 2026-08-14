import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { BmiCalculator } from "./components/BmiCalculator";
import { WaterIntakeCalculator } from "./components/WaterIntakeCalculator";
import { CalorieCalculator } from "./components/CalorieCalculator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, Scale, Droplet, Flame, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Free Health Calculators: BMI, Ideal Weight, Water Intake & Calories - Health Club"
      : "ফ্রি স্বাস্থ্য ক্যালকুলেটর: বিএমআই (BMI), পানির চাহিদা ও ক্যালোরি - হেলথ ক্লাব",
    description: isEn
      ? "Calculate your Body Mass Index (BMI), ideal weight range, daily hydration target, and maintenance calorie needs for a healthier lifestyle."
      : "সহজেই আপনার বডি ম্যাস ইনডেক্স (BMI), আদর্শ ওজন, দৈনিক পানির প্রয়োজনীয়তা ও ক্যালোরি চাহিদা হিসাব করুন এবং বিশেষজ্ঞ চিকিৎসকের পরামর্শ নিন।",
    alternates: {
      canonical: "https://healthclubfeni.vercel.app/health-tools",
    },
    keywords: [
      "BMI calculator bangla",
      "বিএমআই ক্যালকুলেটর",
      "Water intake calculator",
      "দৈনিক পানির পরিমাণ",
      "Calorie calculator",
      "Health Club health tools",
    ],
  };
}

export default async function HealthToolsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": isEn ? "Home" : "হোম",
          "item": "https://healthclubfeni.vercel.app",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": isEn ? "Health Tools" : "হেলথ ক্যালকুলেটরস",
          "item": "https://healthclubfeni.vercel.app/health-tools",
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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
            <Calculator className="h-3.5 w-3.5" />
            <span>{isEn ? "Smart Health Assessment Tools" : "স্মার্ট স্বাস্থ্য মূল্যায়ন টুলস"}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            {isEn ? "Interactive Health Calculators" : "ইন্টারেক্টিভ হেলথ ক্যালকুলেটরস"}
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Track your essential health metrics with scientifically backed tools designed to help you make informed lifestyle decisions."
              : "আপনার শরীরের বিএমআই, আদর্শ ওজন, দৈনিক পানির প্রয়োজনীয়তা ও ক্যালোরি চাহিদা সহজেই জেনে নিন এবং নিজেকে সুস্থ রাখুন।"}
          </p>
        </div>
      </div>

      {/* Main Hub Tabs */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
        <Tabs defaultValue="bmi" className="w-full space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-xl grid-cols-3 h-12 p-1 bg-muted/80 rounded-2xl">
              <TabsTrigger
                value="bmi"
                className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"
              >
                <Scale className="h-4 w-4" />
                <span>{isEn ? "BMI" : "বিএমআই"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="water"
                className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-cyan-600 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"
              >
                <Droplet className="h-4 w-4" />
                <span>{isEn ? "Water Intake" : "পানির চাহিদা"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="calories"
                className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-orange-600 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"
              >
                <Flame className="h-4 w-4" />
                <span>{isEn ? "Calories" : "ক্যালোরি"}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="bmi" className="pt-2">
            <BmiCalculator />
          </TabsContent>

          <TabsContent value="water" className="pt-2">
            <WaterIntakeCalculator />
          </TabsContent>

          <TabsContent value="calories" className="pt-2">
            <CalorieCalculator />
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
                {isEn ? "Need Specialist Medical Advice?" : "বিশেষজ্ঞ ডাক্তারের পরামর্শ প্রয়োজন?"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isEn
                  ? "Explore our specialist doctor directory in Feni for professional nutrition, cardiology & medicine care."
                  : "মেডিসিন, ডায়াবেটিস ও পুষ্টি বিশেষজ্ঞ ডাক্তারদের চেম্বার শিডিউল দেখুন ও ডিসকাউন্ট সুবিধায় সেবা নিন।"}
              </p>
            </div>
          </div>
          <Link href="/consultants" className="shrink-0 w-full sm:w-auto">
            <Button size="lg" className="w-full font-bold">
              {isEn ? "Browse Doctor Directory" : "ডাক্তারদের তালিকা দেখুন"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
