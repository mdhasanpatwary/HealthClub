import PartnerDirectory from "@/components/ui/PartnerDirectory";
import PartnerHospitalsGuide from "@/components/partner-hospitals/PartnerHospitalsGuide";
import PartnerHospitalsFAQ from "@/components/partner-hospitals/PartnerHospitalsFAQ";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { Sparkles, ShieldCheck, Tag, Pill, MapPin } from "lucide-react";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const ogTitle = isEn
    ? "Feni Hospital List, Diagnostic Centers & Pathology Lab Discounts - Health Club"
    : "ফেনী হাসপাতাল তালিকা, ডায়াগনস্টিক সেন্টার ও প্যাথলজি ডিসকাউন্ট - হেলথ ক্লাব";
  const ogDesc = isEn
    ? "Explore verified private hospitals, diagnostic pathology labs, and model pharmacies in Feni offering 10% to 30% instant member discounts on medical tests and healthcare services."
    : "ফেনীর শীর্ষ বেসরকারি হাসপাতাল, প্যাথলজি ল্যাব, ডায়াগনস্টিক সেন্টার ও মডেল ফার্মেসির তালিকা। হেলথ ক্লাব মেম্বার কার্ডে পান ১০% থেকে ৩০% নিশ্চিত ডিসকাউন্ট।";

  return {
    title: isEn
      ? "Feni Hospital List, Diagnostic Centers & Pathology Lab Discounts - Health Club"
      : "ফেনী হাসপাতাল তালিকা, ডায়াগনস্টিক সেন্টার ও প্যাথলজি ডিসকাউন্ট - হেলথ ক্লাব",
    description: isEn
      ? "Explore verified private hospitals, diagnostic labs, pathology clinics, and model pharmacies in Feni. Enjoy 10% to 30% instant member discounts on medical tests, admissions, and medicines."
      : "ফেনীর শীর্ষ বেসরকারি হাসপাতাল, প্যাথলজি ল্যাব, ডায়াগনস্টিক সেন্টার ও মডেল ফার্মেসির তালিকা। হেলথ ক্লাব মেম্বার কার্ডে পান ১০% থেকে ৩০% নিশ্চিত ডিসকাউন্ট।",
    alternates: {
      canonical: `${SITE_URL}/partner-hospitals`,
      languages: {
        "bn-BD": `${SITE_URL}/partner-hospitals`,
        "en-US": `${SITE_URL}/partner-hospitals`,
      },
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
    ],
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE_URL}/partner-hospitals`,
      siteName: "হেলথ ক্লাব (Health Club)",
      locale: isEn ? "en_US" : "bn_BD",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
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

export default async function PartnerHospitalsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";
  const t = (key: string) => tServer(locale, key);

  // Fetch partners server-side (cached)
  const allPartners = await getPartnersAction();

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": isEn ? "Home" : "হোম",
          "item": SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": isEn ? "Partner Hospitals & Diagnostics" : "পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টার",
          "item": `${SITE_URL}/partner-hospitals`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": ["MedicalBusiness", "MedicalOrganization"],
      "name": isEn ? "Health Club Partner Healthcare Network Feni" : "হেলথ ক্লাব পার্টনার হাসপাতাল ও ডায়াগনস্টিক নেটওয়ার্ক (ফেনী)",
      "url": `${SITE_URL}/partner-hospitals`,
      "description": isEn
        ? "Network of verified partner hospitals, diagnostic centers, pathology labs, and model pharmacies offering 10% to 30% discounts in Feni, Bangladesh."
        : "ফেনীর শীর্ষ বেসরকারি হাসপাতাল, প্যাথলজি ল্যাব, ডায়াগনস্টিক সেন্টার ও মডেল ফার্মেসির তালিকা এবং ১০% থেকে ৩০% মেম্বার ডিসকাউন্ট নেটওয়ার্ক।",
      "areaServed": [
        "Feni Sadar",
        "Daganbhuiyan",
        "Sonagazi",
        "Chhagalnaiya",
        "Parshuram",
        "Fulgazi",
        "Mohipal"
      ],
      "medicalSpecialty": [
        "General Medical Services",
        "Diagnostic Pathology & Laboratory",
        "Radiology & Imaging",
        "Pharmacy & Prescription Medicine Discount"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": t("partnerHospitals.faq.q1"),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t("partnerHospitals.faq.a1")
          }
        },
        {
          "@type": "Question",
          "name": t("partnerHospitals.faq.q2"),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t("partnerHospitals.faq.a2")
          }
        },
        {
          "@type": "Question",
          "name": t("partnerHospitals.faq.q3"),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t("partnerHospitals.faq.a3")
          }
        },
        {
          "@type": "Question",
          "name": t("partnerHospitals.faq.q4"),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t("partnerHospitals.faq.a4")
          }
        },
        {
          "@type": "Question",
          "name": t("partnerHospitals.faq.q5"),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t("partnerHospitals.faq.a5")
          }
        },
        {
          "@type": "Question",
          "name": t("partnerHospitals.faq.q6"),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t("partnerHospitals.faq.a6")
          }
        }
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <JsonLd data={jsonLdData} />
      
      {/* Hero Header Section */}
      <header className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-primary/5 via-background to-background py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("partnerHospitals.page.badge")}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            {t("partnerHospitals.page.heroTitle")}{" "}
            <span className="text-primary">{t("partnerHospitals.page.heroHighlight")}</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            {t("partnerHospitals.page.heroDesc")}
          </p>

          {/* Quick Highlight Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Tag className="h-3.5 w-3.5 text-primary" />
              {t("partnerHospitals.page.tag1")}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              {t("partnerHospitals.page.tag2")}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Pill className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              {t("partnerHospitals.page.tag3")}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <MapPin className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              {t("partnerHospitals.page.tag4")}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Directory & SEO Guides */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 sm:space-y-16">
        
        {/* Directory Component — server-fetched data, no client-side loading */}
        <section aria-labelledby="partner-directory-heading" className="bg-muted/30 border border-border/80 rounded-3xl p-3.5 sm:p-8 space-y-4">
          <h2 id="partner-directory-heading" className="sr-only">
            {isEn ? "Partner Hospitals & Diagnostic Centers Directory" : "পার্টনার হাসপাতাল ও ডায়াগনস্টিক ডিরেক্টরি"}
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


