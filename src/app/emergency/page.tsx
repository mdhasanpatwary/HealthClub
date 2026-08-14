import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { EmergencyDirectory } from "./components/EmergencyDirectory";
import { Siren } from "lucide-react";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn
      ? "24/7 Emergency Health Services, Blood Donors & Ambulances in Feni - Health Club"
      : "জরুরি স্বাস্থ্য সেবা, রক্তদাতা ও অ্যাম্বুলেন্স তালিকা (ফেনী) - হেলথ ক্লাব",
    description: isEn
      ? "Emergency blood donor network by group, 24/7 ambulance contacts, oxygen cylinder suppliers, and national hospital hotlines in Feni."
      : "ফেনীর ২৪/৭ জরুরি রক্তদাতা নেটওয়ার্ক, উপজেলাভিত্তিক রক্তের গ্রুপ সন্ধান, আইসিইউ ও এসি অ্যাম্বুলেন্স এবং জরুরি অক্সিজেন ও মেডিকেল হটলাইন নম্বর।",
    alternates: {
      canonical: "https://healthclubfeni.vercel.app/emergency",
    },
    keywords: [
      "Feni blood donors",
      "ফেনী রক্তদাতা",
      "Feni ambulance service",
      "ফেনী এ্যাম্বুলেন্স",
      "Emergency oxygen Feni",
      "Feni hospital hotline",
      "Health Club emergency directory",
    ],
  };
}

export default async function EmergencyPage() {
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
          "name": isEn ? "Emergency Services" : "জরুরি সেবা",
          "item": "https://healthclubfeni.vercel.app/emergency",
        },
      ],
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <JsonLd data={jsonLdData} />

      {/* Page Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-8 sm:py-16 border-b border-border/60">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold">
            <Siren className="h-3.5 w-3.5 animate-pulse" />
            <span>{isEn ? "24/7 Emergency Support Network" : "২৪/৭ জরুরি স্বাস্থ্য সহায়তা নেটওয়ার্ক"}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            {isEn ? "Emergency Services & Blood Directory" : "জরুরি স্বাস্থ্য সেবা ও রক্তদাতা ডিরেক্টরি"}
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "Instant access to voluntary blood donors in Feni, 24/7 ambulance services, emergency oxygen supplies, and critical medical hotlines."
              : "মুহূর্তেই রক্তের গ্রুপ অনুযায়ী ফেনীর স্বেচ্ছাসেবী রক্তদাতা, ২৪/৭ আইসিইউ অ্যাম্বুলেন্স, জরুরি অক্সিজেন ও মেডিকেল হটলাইনে সরাসরি যোগাযোগ করুন।"}
          </p>
        </div>
      </div>

      {/* Main Content Directory */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <EmergencyDirectory />
      </main>
    </div>
  );
}
