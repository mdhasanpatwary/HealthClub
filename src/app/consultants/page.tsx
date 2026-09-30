import { redirect } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import DoctorDirectory from "@/components/ui/DoctorDirectory";
import ConsultantsGuide from "@/components/consultants/ConsultantsGuide";
import ConsultantsFAQ from "@/components/consultants/ConsultantsFAQ";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { getDoctorsAction } from "@/app/actions/doctorActions";
import { Stethoscope, ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

import { getDepartmentSeoConfig } from "@/data/doctorSeoData";
import { getUpazilaSeoConfig } from "@/data/feniLocations";
import { GeoAnswerCapsule } from "@/app/blog/components/GeoAnswerCapsule";
import { generateConsultantsDirectoryJsonLd, DEFAULT_CONSULTANT_GEO_DATA } from "./utils/consultantJsonLd";

export const revalidate = 86400; // 24-hour Incremental Static Regeneration (ISR)

interface ConsultantsPageProps {
  searchParams?: Promise<{ dept?: string; upazila?: string }>;
}

export async function generateMetadata({ searchParams }: ConsultantsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const dept = resolvedSearchParams.dept;
  const deptSeo = getDepartmentSeoConfig(dept);

  if (deptSeo) {
    return {
      title: deptSeo.metaTitleBn,
      description: deptSeo.metaDescriptionBn,
      keywords: deptSeo.keywords,
      alternates: {
        canonical: `${SITE_URL}/consultants/department/${deptSeo.slug}`,
      },
      openGraph: {
        title: deptSeo.metaTitleBn,
        description: deptSeo.metaDescriptionBn,
        url: `${SITE_URL}/consultants?dept=${deptSeo.slug}`,
        siteName: "হেলথ ক্লাব (Health Club)",
        type: "website",
        images: DEFAULT_OG_IMAGES,
      },
      twitter: {
        card: "summary_large_image",
        title: deptSeo.metaTitleBn,
        description: deptSeo.metaDescriptionBn,
        images: DEFAULT_TWITTER_IMAGES,
      },
    };
  }

  const upazila = resolvedSearchParams.upazila;
  const upazilaSeo = upazila && upazila !== "all" ? getUpazilaSeoConfig(upazila) : null;
  if (upazilaSeo) {
    return {
      title: upazilaSeo.metaTitleBn,
      description: upazilaSeo.metaDescriptionBn,
      keywords: upazilaSeo.keywords,
      alternates: {
        canonical: `${SITE_URL}/consultants/location/${upazilaSeo.slug}`,
      },
      openGraph: {
        title: upazilaSeo.metaTitleBn,
        description: upazilaSeo.metaDescriptionBn,
        url: `${SITE_URL}/consultants/location/${upazilaSeo.slug}`,
        siteName: "হেলথ ক্লাব (Health Club)",
        type: "website",
        images: DEFAULT_OG_IMAGES,
      },
      twitter: {
        card: "summary_large_image",
        title: upazilaSeo.metaTitleBn,
        description: upazilaSeo.metaDescriptionBn,
        images: DEFAULT_TWITTER_IMAGES,
      },
    };
  }

  const ogTitle = "ফেনী ডাক্তার তালিকা ও সিরিয়াল নাম্বার | ফেনী সদর ও উপজেলা ভিত্তিক চেম্বার তথ্য - হেলথ ক্লাব";
  const ogDesc = "ফেনীর সেরা মেডিসিন, গাইনী, শিশু, হৃদরোগ ও কিডনি বিশেষজ্ঞ ডাক্তার, চেম্বার শিডিউল, রোগী দেখার সময় এবং সরাসরি সিরিয়াল নাম্বার ও অ্যাপয়েন্টমেন্ট তথ্য।";

  return {
    title: "ফেনী ডাক্তার তালিকা ও সিরিয়াল নাম্বার | ফেনী সদর ও উপজেলা ভিত্তিক চেম্বার সময়সূচী",
    description: "ফেনী ডাক্তার তালিকা, ফেনী সদর ও উপজেলা ভিত্তিক চেম্বার সময়সূচী, ডাক্তার সিরিয়াল এবং অ্যাপয়েন্টমেন্ট তথ্য। ফেনীর বিশেষজ্ঞ ডাক্তারদের মেডিসিন, গাইনী, শিশু, হৃদরোগ এবং ডায়াগনস্টিক সহযোগী সেবা খুঁজুন।",
    alternates: {
      canonical: `${SITE_URL}/consultants`,
    },
    keywords: [
      "feni doctor list",
      "feni doctor serial number",
      "feni doctor appointment",
      "feni doctors info",
      "feni doctor schedule",
      "ফেনী ডাক্তার তালিকা",
      "ফেনী সদর ডাক্তার তালিকা",
      "ফেনী ডাক্তারদের তথ্য",
      "ফেনী ডাক্তার সিরিয়াল",
      "ফেনীর ডাক্তারদের চেম্বার ও সময়সূচী",
      "ফেনীতে আজ কোন ডাক্তার বসেন",
      "ফেনীতে সেরা মেডিসিন বিশেষজ্ঞ",
      "ফেনী সদর ডায়াগনস্টিক টেস্টের খরচ",
      "ফেনী হাসপাতাল সিরিয়াল",
      "feni doctor",
      "feni doctor info",
      "feni specialist doctors",
      "feni doctor phone number",
      "ফেনী ডাক্তার",
      "ফেনীর বিশেষজ্ঞ ডাক্তার",
      "ফেনী ডাক্তার চেম্বার",
      "ফেনী হাসপাতাল ডাক্তার সিরিয়াল",
      "Medicine specialist doctor in Feni",
      "Gynecologist in Feni",
      "Pediatrician in Feni",
      "Psychiatrist in Feni",
      "Orthopedic doctor in Feni",
      "Cardiologist in Feni",
      "Health Club doctor directory",
      "Feni Sadar doctor serial",
      "doctor appointment Feni Bangladesh",
    ],
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE_URL}/consultants`,
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

export default async function ConsultantsPage({ searchParams }: ConsultantsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialDept = resolvedSearchParams.dept || "all";
  const initialUpazila = resolvedSearchParams.upazila || "all";

  // Redirect department-specific queries to dedicated SEO landing pages to avoid over-fetching
  if (initialDept !== "all") {
    const deptSeo = getDepartmentSeoConfig(initialDept);
    if (deptSeo) {
      const upazilaParam = initialUpazila !== "all" ? `?upazila=${encodeURIComponent(initialUpazila)}` : "";
      redirect(`/consultants/department/${deptSeo.slug}${upazilaParam}`);
    }
  }

  // Redirect upazila-specific queries to dedicated location landing pages
  if (initialUpazila !== "all") {
    const upzSeo = getUpazilaSeoConfig(initialUpazila);
    if (upzSeo) {
      redirect(`/consultants/location/${upzSeo.slug}`);
    }
  }

  // Fetch doctors server-side (cached with ISR)
  const doctors = await getDoctorsAction();

  // Structured Data for Google Rich Snippets & AI Search Engines (AEO & Speakable Specification)
  const jsonLdData = generateConsultantsDirectoryJsonLd({
    pageUrl: `${SITE_URL}/consultants`,
    doctors,
  });

  return (
    <div className="bg-background min-h-screen py-6 sm:py-12">
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-2 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="h-3.5 w-3.5" />
            <span>ফেনী ডাক্তার তালিকা ও চেম্বার ডিরেক্টরি</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white tracking-tight">
            ফেনী ডাক্তার তালিকা ও সিরিয়াল বুকিং ডিরেক্টরি
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            ফেনীর সকল হাসপাতালের বিশেষজ্ঞ ডাক্তারদের তালিকা, চেম্বার শিডিউল, রোগী দেখার সময়সূচী এবং সরাসরি সিরিয়াল নাম্বার ও অ্যাপয়েন্টমেন্ট তথ্য।
          </p>
        </div>

        {/* Highlight Banner / Notice */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-foreground">
                যাচাইকৃত বিশেষজ্ঞ
              </h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                শীর্ষ হাসপাতাল ও মেডিকেল কলেজের চিকিৎসক
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-foreground">
                সরাসরি সিরিয়াল সুবিধা
              </h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                এক ক্লিকেই সিরিয়াল নম্বরে কল করার সুযোগ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-foreground">
                মেম্বার ডিসকাউন্ট
              </h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                প্রেসক্রিপশন টেস্টে ১০-৩০% পর্যন্ত ছাড়
              </p>
            </div>
          </div>
        </div>

        {/* Standardized GEO Answer Capsule (BLUF) */}
        <GeoAnswerCapsule
          data={DEFAULT_CONSULTANT_GEO_DATA}
          title="ফেনী বিশেষজ্ঞ ডাক্তার ও চেম্বার সিরিয়াল সারসংক্ষেপ"
        />

        {/* Interactive Directory Component */}
        <div className="sm:bg-muted/30 sm:border sm:border-border/80 sm:rounded-3xl sm:p-8">
          <DoctorDirectory
            doctors={doctors}
            initialDept={initialDept}
            initialUpazila={initialUpazila}
          />
        </div>

        {/* Generative Engine Optimization (GEO) Healthcare Guide & Authority Block */}
        <ConsultantsGuide />

        {/* Answer Engine Optimization (AEO) FAQ Section */}
        <ConsultantsFAQ />

        {/* Healthcare & Emergency Community Collaboration CTA */}
        <CommunityNetworkCTA />

      </div>
    </div>
  );
}
