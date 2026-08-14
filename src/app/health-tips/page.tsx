import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { HealthTipsDirectory } from "./components/HealthTipsDirectory";
import { BookOpen } from "lucide-react";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Health Tips & Medical Care Blog - Health Club"
      : "স্বাস্থ্য টিপস, রোগ প্রতিরোধ ও মেডিকেল গাইড - হেলথ ক্লাব",
    description: isEn
      ? "Expert medical advice, disease prevention guidelines, nutrition recommendations, and lifestyle tips verified by registered doctors."
      : "অভিজ্ঞ চিকিৎসকদের পরামর্শ, ডায়াবেটিস ও উচ্চ রক্তচাপ নিয়ন্ত্রণ, ডেঙ্গু প্রতিরোধ, পুষ্টিকর খাদ্যতালিকা ও স্বাস্থ্যকর জীবনযাপনের নির্ভরযোগ্য গাইড।",
    alternates: {
      canonical: "https://healthclubfeni.vercel.app/health-tips",
    },
    keywords: [
      "Health tips bangla",
      "স্বাস্থ্য টিপস",
      "Dengue prevention bangla",
      "Diabetes diet chart",
      "ডায়াবেটিস নিয়ন্ত্রণ",
      "Health Club blog",
    ],
  };
}

export default async function HealthTipsPage() {
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
          "name": isEn ? "Health Tips" : "স্বাস্থ্য টিপস",
          "item": "https://healthclubfeni.vercel.app/health-tips",
        },
      ],
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <JsonLd data={jsonLdData} />

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-emerald-500/5 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-8 sm:py-16 border-b border-border/60">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{isEn ? "Doctor Verified Health Guides" : "ডাক্তারদের পরামর্শ ও স্বাস্থ্য গাইড"}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            {isEn ? "Health Tips & Wellness Blog" : "স্বাস্থ্য টিপস ও সুস্থ জীবনের গাইড"}
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Practical medical articles, dietary advice, and seasonal disease awareness to keep you and your family protected."
              : "নিয়মিত স্বাস্থ্য সচেতনতা, খাদ্যতালিকা ও বিভিন্ন রোগ প্রতিরোধের কার্যকরী পরামর্শ জেনে পরিবারসহ সুস্থ থাকুন।"}
          </p>
        </div>
      </div>

      {/* Main Content Directory */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <HealthTipsDirectory />
      </main>
    </div>
  );
}
