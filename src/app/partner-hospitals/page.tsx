import PartnerDirectory from "@/components/ui/PartnerDirectory";
import PartnerHospitalsGuide from "@/components/partner-hospitals/PartnerHospitalsGuide";
import PartnerHospitalsFAQ from "@/components/partner-hospitals/PartnerHospitalsFAQ";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const ogTitle = isEn
    ? "Partner Hospitals & Diagnostic Centers in Feni - Health Club"
    : "ফেনীর পার্টনার হাসপাতাল, ডায়াগনস্টিক ও ফার্মেসি - হেলথ ক্লাব";
  const ogDesc = isEn
    ? "Find hospitals, diagnostic labs, and pharmacies with instant member discounts in Feni."
    : "ফেনী ও আশপাশের চুক্তিভিত্তিক হাসপাতাল ও ডায়াগনস্টিক সেন্টারের বিস্তারিত তালিকা।";

  return {
    title: isEn
      ? "Partner Hospitals, Diagnostic Centers & Pharmacies in Feni - Health Club"
      : "ফেনীর পার্টনার হাসপাতাল, ডায়াগনস্টিক ও ফার্মেসি তালিকা - হেলথ ক্লাব",
    description: isEn
      ? "Explore our full network of partner hospitals, diagnostic centers, pathology labs, and model pharmacies offering 10% to 30% discount to Health Club members in Feni."
      : "ফেনীর শীর্ষ বেসরকারি হাসপাতাল, প্যাথলজি ল্যাব, ডায়াগনস্টিক সেন্টার ও মডেল ফার্মেসির তালিকা। হেলথ ক্লাব মেম্বার কার্ডে পান ১০% থেকে ৩০% নিশ্চিত ডিসকাউন্ট।",
    alternates: {
      canonical: `${SITE_URL}/partner-hospitals`,
      languages: {
        "bn-BD": `${SITE_URL}/partner-hospitals`,
        "en-US": `${SITE_URL}/partner-hospitals`,
      },
    },
    keywords: [
      "feni diagnostic center",
      "feni hospital list",
      "feni diagnostic center list",
      "feni private hospital list",
      "feni pharmacy discount",
      "feni pathology lab",
      "feni blood test price discount",
      "ফেনী ডায়াগনস্টিক সেন্টার",
      "ফেনী হাসপাতাল তালিকা",
      "ফেনী ক্লিনিক ও ডায়াগনস্টিক",
      "ফেনী মডেল ফার্মেসি",
      "ফেনী প্যাথলজি ল্যাব",
      "diagnostic center in Feni",
      "hospitals in Feni",
      "Health Club partner hospitals",
      "মেডিকেল ডিসকাউন্ট হাসপাতাল ফেনী",
      "ফেনী প্যাথলজি ও ল্যাব",
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
  };
}

export default async function PartnerHospitalsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";
  const t = (key: string) => tServer(locale, key);

  // Fetch partners server-side (cached) — eliminates client-side loading spinner
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
          "name": isEn ? "Partner Hospitals" : "পার্টনার হাসপাতালসমূহ",
          "item": `${SITE_URL}/partner-hospitals`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "Health Club Partner Network Feni",
      "url": `${SITE_URL}/partner-hospitals`,
      "description": "Network of partner hospitals, diagnostic clinics, pathology labs, and model pharmacies offering healthcare discounts in Feni, Bangladesh.",
      "areaServed": [
        "Feni Sadar",
        "Daganbhuiyan",
        "Sonagazi",
        "Chhagalnaiya",
        "Parshuram",
        "Fulgazi",
        "Mohipal"
      ],
      "medicalSpecialty": "Healthcare Discount Membership & Diagnostic Partner Services"
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
        }
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen py-6 sm:py-12">
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-14">
        
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-4 max-w-2xl mx-auto">
          <span className="text-[11px] sm:text-xs font-extrabold text-primary tracking-widest uppercase">
            {t("partnerHospitals.page.partnerNetwork")}
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            {t("partnerHospitals.page.partnerHospitalsDiagnostics")}
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground">
            {t("partnerHospitals.page.findYourNearestPartnerFacilities")}
          </p>
        </div>

        {/* Directory Component — server-fetched data, no client-side loading */}
        <div className="bg-muted/30 border border-border/80 rounded-3xl p-3.5 sm:p-8">
          <PartnerDirectory partners={allPartners} />
        </div>

        {/* Informational SEO Guide Component */}
        <PartnerHospitalsGuide />

        {/* FAQ Section with Rich SEO Accordion */}
        <PartnerHospitalsFAQ />

        {/* Healthcare & Emergency Community Collaboration CTA */}
        <CommunityNetworkCTA />

      </div>
    </div>
  );
}

