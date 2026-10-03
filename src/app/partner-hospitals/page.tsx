import { redirect } from "next/navigation";
import PartnerDirectory from "@/components/ui/PartnerDirectory";
import PartnerHospitalsGuide from "@/components/partner-hospitals/PartnerHospitalsGuide";
import PartnerHospitalsFAQ from "@/components/partner-hospitals/PartnerHospitalsFAQ";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import JsonLd from "@/components/seo/JsonLd";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { Sparkles, ShieldCheck, Tag, Pill, MapPin } from "lucide-react";
import { VALID_PARTNER_CATEGORY_SLUGS } from "@/data/partnerCategorySeoData";
import { generatePartnerHospitalsHubJsonLd } from "./utils/hospitalJsonLd";

export const revalidate = false; // Pure static SSG (on-demand revalidated on partner updates)

const PAGE_TITLE = "ফেনী সদর হাসপাতাল ও ডায়াগনস্টিক সেন্টার তালিকা | ১০-৩০% মেম্বার ছাড়";
const OG_TITLE = "ফেনী সদর হাসপাতাল ও ডায়াগনস্টিক সেন্টার তালিকা | ১০-৩০% মেম্বার ছাড় - হেলথ ক্লাব";
const PAGE_DESC = "ফেনী সদর, এসএসকে রোড, ট্রাঙ্ক রোড, হাসপাতাল রোড ও আশেপাশের পার্টনার হাসপাতাল, প্যাথলজি ল্যাব, ডায়াগনস্টিক সেন্টার ও মডেল ফার্মেসির তালিকা। হেলথ ক্লাব মেম্বার কার্ডে পান ১০% থেকে ৩০% নিশ্চিত ডিসকাউন্ট।";

export async function generateMetadata() {
  const pageTitle = PAGE_TITLE;
  const ogTitle = OG_TITLE;
  const pageDesc = PAGE_DESC;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: `${SITE_URL}/partner-hospitals`,
    },
    keywords: [
      "feni hospital list",
      "feni diagnostic center list",
      "feni private hospital",
      "feni private hospital list",
      "feni blood test discount",
      "feni pathology lab discount",
      "feni medical test price list",
      "feni diagnostic center",
      "diagnostic center in feni",
      "hospitals in feni",
      "feni hospital discount",
      "feni pharmacy discount",
      "feni blood test price discount",
      "Health Club partner hospitals",
      "feni clinic list",
      "feni pathology lab",
      "ফেনী ডায়াগনস্টিক সেন্টার তালিকা",
      "ফেনী সদর হাসপাতাল তালিকা",
      "ফেনী হাসপাতাল তালিকা",
      "ফেনী ক্লিনিক ও ডায়াগনস্টিক",
      "ফেনী প্যাথলজি ল্যাব ছাড়",
      "ফেনী মডেল ফার্মেসি",
      "ফেনী ঔষধ ডিসকাউন্ট",
      "ফেনী রক্ত পরীক্ষা ছাড়",
      "ফেনী ডায়াগনস্টিক সেন্টার",
      "ফেনী প্যাথলজি ও ল্যাব",
      "মেডিকেল ডিসকাউন্ট হাসপাতাল ফেনী",
      "ফেনী প্রাইভেট হাসপাতাল",
      "ফেনী সদর হাসপাতাল",
      "ফেনী ল্যাব টেস্ট ডিসকাউন্ট",
      "ফেনী সদর ডায়াগনস্টিক টেস্টের খরচ",
      "ফেনী হাসপাতাল ১০-৩০% ছাড়",
      "Feni Sadar hospital discount",
      "Feni diagnostic test price",
    ],
    openGraph: {
      title: ogTitle,
      description: pageDesc,
      url: `${SITE_URL}/partner-hospitals`,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: pageDesc,
      images: DEFAULT_TWITTER_IMAGES,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

interface PartnerHospitalsPageProps {
  searchParams?: Promise<{ category?: string; upazila?: string }>;
}

export default async function PartnerHospitalsPage({ searchParams }: PartnerHospitalsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const requestedCat = resolvedSearchParams.category?.trim().toLowerCase();

  if (requestedCat && (VALID_PARTNER_CATEGORY_SLUGS as readonly string[]).includes(requestedCat)) {
    redirect(`/partner-hospitals/category/${requestedCat}`);
  }

  // Fetch partners server-side (cached with ISR)
  const allPartners = await getPartnersAction();

  const jsonLdData = generatePartnerHospitalsHubJsonLd({
    pageUrl: `${SITE_URL}/partner-hospitals`,
    partners: allPartners,
    pageTitle: PAGE_TITLE,
    pageDesc: PAGE_DESC,
  });

  return (
    <div className="bg-background min-h-screen">
      <JsonLd data={jsonLdData} />
      
      {/* Hero Header Section */}
      <header className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-primary/5 via-background to-background py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ফেনী হেলথকেয়ার নেটওয়ার্ক ও ডিসকাউন্ট</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টার{" "}
            <span className="text-primary">তালিকা (ফেনী)</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            ফেনী সদর, মহিপাল ও সকল উপজেলার ভেরিফাইড বেসরকারি হাসপাতাল, ডায়াগনস্টিক সেন্টার, প্যাথলজি ল্যাব ও মডেল ফার্মেসির বিস্তারিত তালিকা। হেলথ ক্লাব মেম্বার কার্ডে পান ১০% থেকে ৩০% নিশ্চিত ছাড়।
          </p>

          {/* Quick Highlight Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Tag className="h-3.5 w-3.5 text-primary" />
              ১০% - ৩০% নিশ্চিত ছাড়
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              প্যাথলজি ও ডিজিটাল স্ক্যান
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Pill className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              মডেল ফার্মেসি নেটওয়ার্ক
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <MapPin className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              ফেনীর ৬টি উপজেলা কভারেজ
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Directory & SEO Guides */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 sm:space-y-16">
        
        {/* Directory Component — server-fetched data, no client-side loading */}
        <section aria-labelledby="partner-directory-heading" className="bg-muted/30 border border-border/80 rounded-3xl p-3.5 sm:p-8 space-y-4">
          <h2 id="partner-directory-heading" className="sr-only">
            পার্টনার হাসপাতাল ও ডায়াগনস্টিক ডিরেক্টরি
          </h2>
          <PartnerDirectory partners={allPartners} />
        </section>

        {/* Informational SEO Guide Component (4 Pillars, Popular Test Pricing & 3-Step Redemption) */}
        <PartnerHospitalsGuide />

        {/* FAQ Section with Rich SEO Accordion */}
        <PartnerHospitalsFAQ />

        {/* Healthcare & Emergency Community Collaboration CTA */}
        <CommunityNetworkCTA />

      </div>
    </div>
  );
}
