import { notFound } from "next/navigation";
import {
  HeartHandshake,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import DoctorDirectory from "@/components/ui/DoctorDirectory";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getDoctorsAction } from "@/app/actions/doctorActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import {
  detectUpazilaFromText,
  getAllUpazilaSlugs,
  getUpazilaSeoConfig,
} from "@/data/feniLocations";
import { generateConsultantLocationJsonLd, getHighDensityLocationFaqs } from "../../utils/consultantJsonLd";
import { HelpCircle } from "lucide-react";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ upazila: string }>;
}

export async function generateStaticParams() {
  return getAllUpazilaSlugs().map((upazila) => ({ upazila }));
}

export async function generateMetadata({ params }: PageProps) {
  const { upazila } = await params;
  const seo = getUpazilaSeoConfig(upazila);

  if (!seo) {
    return {
      title: "এলাকা খুঁজে পাওয়া যায়নি | হেলথ ক্লাব",
      description: "অনুরোধকৃত উপজেলার ডাক্তার ডিরেক্টরি খুঁজে পাওয়া যায়নি।",
    };
  }

  const canonicalUrl = `${SITE_URL}/consultants/location/${seo.slug}`;

  return {
    title: seo.metaTitleBn,
    description: seo.metaDescriptionBn,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo.metaTitleBn,
      description: seo.metaDescriptionBn,
      url: canonicalUrl,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitleBn,
      description: seo.metaDescriptionBn,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default async function UpazilaDoctorLandingPage({ params }: PageProps) {
  const { upazila } = await params;
  const seo = getUpazilaSeoConfig(upazila);

  if (!seo) {
    notFound();
  }

  const allDoctors = await getDoctorsAction();
  const filteredDoctors = allDoctors.filter((doctor) => {
    const resolvedUpazila = doctor.upazila || detectUpazilaFromText(doctor.chamberAddress);
    return resolvedUpazila === seo.id;
  });

  const pageUrl = `${SITE_URL}/consultants/location/${seo.slug}`;

  const locationFaqs = getHighDensityLocationFaqs(seo);
  const locationDoctors = filteredDoctors.length > 0 ? filteredDoctors : allDoctors.slice(0, 15);
  const jsonLdData = generateConsultantLocationJsonLd({
    pageUrl,
    upzSeo: seo,
    doctors: locationDoctors,
  });

  return (
    <div className="bg-background min-h-screen py-4 sm:py-10">
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        <Breadcrumbs
          items={[
            { label: "হোম", href: "/" },
            { label: "বিশেষজ্ঞ ডাক্তার", href: "/consultants" },
            { label: seo.nameBn },
          ]}
        />

        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="h-3.5 w-3.5" />
            <span>{seo.nameBn} স্বাস্থ্য ডিরেক্টরি</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white tracking-tight">
            {seo.heroHeadlineBn}
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {seo.metaDescriptionBn}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-foreground">যাচাইকৃত বিশেষজ্ঞ</h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">বিএমডিসি নিবন্ধিত ডাক্তার তালিকা</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-foreground">সরাসরি সিরিয়াল</h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">চেম্বার ও হাসপাতাল হটলাইন</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-foreground">স্থানীয় রেফারেল সুবিধা</h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">ফেনী সদর পার্টনার সেন্টারে ১০-৩০% ছাড়</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 sm:p-4 text-xs sm:text-sm text-foreground">
          <div className="flex items-center gap-2 font-bold text-primary">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{seo.nameBn} এলাকার রোগীদের চিকিৎসা পরামর্শ ও ফেনী সদর রেফারেল</span>
          </div>
          <p className="mt-1.5 text-muted-foreground leading-relaxed">
            {seo.nameBn} এলাকা থেকে ফেনী সদরের প্রধান চিকিৎসা কেন্দ্রগুলো (ট্রাঙ্ক রোড, এসএসকে রোড, শহীদ শহীদুল্লা কায়সার সড়ক ও হাসপাতাল রোড) মাত্র ১৫ থেকে ৩৫ মিনিটের দূরত্বে অবস্থিত। জটিল রোগ, ডিজিটাল প্যাথলজি টেস্ট ও বিশেষজ্ঞ ডাক্তার কনসালটেশনের জন্য ফেনী সদরের ভেরিফাইড পার্টনার হাসপাতালে হেলথ ক্লাব মেম্বারশিপ কার্ডে ১০% থেকে ৩০% নিশ্চিত ছাড় সুবিধা উপভোগ করুন।
          </p>
        </div>

        <div className="sm:bg-muted/30 sm:border sm:border-border/80 sm:rounded-3xl sm:p-8">
          <DoctorDirectory
            doctors={allDoctors}
            initialDept="all"
            initialUpazila={seo.id}
            isLocationPage={true}
          />
        </div>

        {/* Location-Specific High-Density FAQ Section (AEO & Speakable Specification) */}
        {locationFaqs && locationFaqs.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-4 pt-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-lg sm:text-xl">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 id="location-heading">{seo.nameBn} স্বাস্থ্যসেবা ও ডাক্তার সিরিয়াল সম্পর্কিত প্রশ্নোত্তর</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {locationFaqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                    {faq.question}
                  </h3>
                  <p className="faq-answer text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <CommunityNetworkCTA />
      </div>
    </div>
  );
}
