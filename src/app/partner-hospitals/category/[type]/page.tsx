import { notFound } from "next/navigation";
import {
  Sparkles,
  ShieldCheck,
  Tag,
  MapPin,
  Building2,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import PartnerDirectory from "@/components/ui/PartnerDirectory";
import PartnerHospitalsGuide from "@/components/partner-hospitals/PartnerHospitalsGuide";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import {
  getAllPartnerCategorySlugs,
  getPartnerCategorySeoConfig,
} from "@/data/partnerCategorySeoData";
import { generatePartnerCategoryJsonLd, getHighDensityPartnerCategoryFaqs } from "../../utils/hospitalJsonLd";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return getAllPartnerCategorySlugs().map((type) => ({ type }));
}

export async function generateMetadata({ params }: PageProps) {
  const { type } = await params;
  const seo = getPartnerCategorySeoConfig(type);

  if (!seo) {
    return {
      title: "ক্যাটাগরি খুঁজে পাওয়া যায়নি | হেলথ ক্লাব",
      description: "অনুরোধকৃত পার্টনার ক্যাটাগরি ডিরেক্টরি পাওয়া যায়নি।",
    };
  }

  const canonicalUrl = `${SITE_URL}/partner-hospitals/category/${seo.slug}`;

  return {
    title: seo.metaTitleBn,
    description: seo.metaDescriptionBn,
    keywords: seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${seo.metaTitleBn} - হেলথ ক্লাব`,
      description: seo.metaDescriptionBn,
      url: canonicalUrl,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.metaTitleBn} - হেলথ ক্লাব`,
      description: seo.metaDescriptionBn,
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

export default async function PartnerCategoryPage({ params }: PageProps) {
  const { type } = await params;
  const seo = getPartnerCategorySeoConfig(type);

  if (!seo) {
    notFound();
  }

  const allPartners = await getPartnersAction();
  const categoryPartners = allPartners.filter((p) => p.category === seo.slug);
  const pageUrl = `${SITE_URL}/partner-hospitals/category/${seo.slug}`;

  const categoryFaqs = getHighDensityPartnerCategoryFaqs(seo);
  const jsonLdData = generatePartnerCategoryJsonLd({
    pageUrl,
    seo,
    categoryPartners,
  });

  return (
    <div className="bg-background min-h-screen py-4 sm:py-10">
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "হোম", href: "/" },
            { label: "পার্টনার প্রতিষ্ঠান", href: "/partner-hospitals" },
            { label: seo.nameBn },
          ]}
        />

        {/* Hero Header Section */}
        <header className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{seo.badgeTextBn}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white tracking-tight">
            {seo.h1TitleBn}
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {seo.metaDescriptionBn}
          </p>
        </header>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {seo.highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {idx === 0 && <Tag className="h-5 w-5" />}
                {idx === 1 && <ShieldCheck className="h-5 w-5" />}
                {idx === 2 && <Building2 className="h-5 w-5" />}
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-foreground">
                  {highlight.title}
                </h2>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  {highlight.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Geographic & Membership Notice */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 sm:p-4 text-xs sm:text-sm text-foreground">
          <div className="flex items-center gap-2 font-bold text-primary">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>ফেনী সদর পার্টনার নেটওয়ার্ক নিশ্চয়তা</span>
          </div>
          <p className="mt-1.5 text-muted-foreground leading-relaxed">
            হেলথ ক্লাবের চুক্তিবদ্ধ সকল পার্টনার প্রতিষ্ঠান বর্তমানে ফেনী সদরের প্রধান চিকিৎসা কেন্দ্রগুলোতে (ট্রাঙ্ক রোড, এসএসকে রোড, হাসপাতাল রোড) অবস্থিত। ফেনী সদর ছাড়াও দাগনভূঞা, ছাগলনাইয়া, সোনাগাজী, পরশুরাম ও ফুলগাজীর রোগীরা সরাসরি এখানে এসে ১০-৩০% মেম্বার ডিসকাউন্ট সুবিধা নিতে পারেন।
          </p>
        </div>

        {/* Directory Filter & Grid */}
        <section
          aria-labelledby="category-directory-heading"
          className="bg-muted/30 border border-border/80 rounded-3xl p-3.5 sm:p-8 space-y-4"
        >
          <h2 id="category-directory-heading" className="sr-only">
            {seo.h1TitleBn}
          </h2>
          <PartnerDirectory
            partners={allPartners}
            initialCategory={seo.slug}
            isCategoryPage={true}
          />
        </section>

        {/* Category Specific FAQ Section (AEO & Speakable Specification) */}
        <section
          aria-labelledby="partner-category-heading"
          className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 space-y-6"
        >
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>সাধারণ প্রশ্নোত্তর</span>
            </div>
            <h2
              id="partner-category-heading"
              className="text-xl sm:text-2xl font-bold text-foreground font-heading"
            >
              {seo.nameBn} সংক্রান্ত সচরাচর জিজ্ঞাসা
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {seo.nameBn} ডিসকাউন্ট ও সেবা সম্পর্কে রোগীদের প্রয়োজনীয় তথ্য।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {categoryFaqs.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/70 space-y-2"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <h3 className="text-sm font-bold text-foreground">
                    {item.question}
                  </h3>
                </div>
                <p className="faq-answer text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Informational Partner Guide */}
        <PartnerHospitalsGuide />

        {/* Community Network CTA */}
        <CommunityNetworkCTA />
      </div>
    </div>
  );
}
