import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import DoctorDirectory from "@/components/ui/DoctorDirectory";
import DepartmentSeoHero from "@/components/consultants/DepartmentSeoHero";
import ConsultantsGuide from "@/components/consultants/ConsultantsGuide";
import ConsultantsFAQ from "@/components/consultants/ConsultantsFAQ";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { getDoctorsAction } from "@/app/actions/doctorActions";
import { getDepartmentSeoConfig } from "@/data/doctorSeoData";
import { Stethoscope, ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

interface ConsultantsPageProps {
  searchParams?: Promise<{ dept?: string; upazila?: string }>;
}

export async function generateMetadata({ searchParams }: ConsultantsPageProps) {
  const { dept } = (await searchParams) || {};
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const deptSeo = getDepartmentSeoConfig(dept);

  if (deptSeo) {
    const title = isEn ? deptSeo.metaTitleEn : deptSeo.metaTitleBn;
    const description = isEn ? deptSeo.metaDescriptionEn : deptSeo.metaDescriptionBn;
    const canonicalUrl = `${SITE_URL}/consultants?dept=${deptSeo.slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          "bn-BD": canonicalUrl,
          "en-US": canonicalUrl,
        },
      },
      keywords: [
        ...deptSeo.keywords,
        "feni doctor list",
        "feni doctor serial number",
        "feni doctor appointment",
        "feni doctors info",
        "ফেনী ডাক্তার তালিকা",
        "ফেনী ডাক্তার চেম্বার",
        "ফেনী ডাক্তার সিরিয়াল",
        "Health Club doctor directory",
      ],
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "হেলথ ক্লাব (Health Club)",
        locale: isEn ? "en_US" : "bn_BD",
        type: "website",
        images: DEFAULT_OG_IMAGES,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: DEFAULT_TWITTER_IMAGES,
      },
    };
  }

  const ogTitle = isEn
    ? "Feni Doctor List, Serial Numbers & Chamber Schedules - Health Club"
    : "ফেনী ডাক্তার তালিকা ও সিরিয়াল নাম্বার | চেম্বার সময়সূচী - হেলথ ক্লাব";
  const ogDesc = isEn
    ? "Complete Feni doctor list with chamber schedules, visiting hours, and direct serial numbers for doctor appointment booking at partner hospitals."
    : "ফেনীর সকল বিশেষজ্ঞ ডাক্তারদের তালিকা, চেম্বার শিডিউল, রোগী দেখার সময় এবং সরাসরি সিরিয়াল নাম্বার ও অ্যাপয়েন্টমেন্ট তথ্য।";

  return {
    title: isEn
      ? "Feni Doctor List, Serial Numbers & Specialist Chamber Schedules - Health Club"
      : "ফেনী ডাক্তার তালিকা ও সিরিয়াল নাম্বার | চেম্বার সময়সূচী ও অ্যাপয়েন্টমেন্ট - হেলথ ক্লাব",
    description: isEn
      ? "Find specialist doctors in Feni, check chamber visiting hours, qualifications, hospital affiliations, and call direct phone serial numbers for doctor appointments across Feni."
      : "ফেনী ডাক্তার তালিকা, চেম্বার সময়সূচী ও সরাসরি সিরিয়াল নাম্বার। ফেনীর বিশেষজ্ঞ ডাক্তারদের (মেডিসিন, গাইনী, শিশু, হৃদরোগ) চেম্বার, রোগী দেখার সময় এবং অ্যাপয়েন্টমেন্ট বুকিংয়ের বিস্তারিত তথ্য।",
    alternates: {
      canonical: `${SITE_URL}/consultants`,
      languages: {
        "bn-BD": `${SITE_URL}/consultants`,
        "en-US": `${SITE_URL}/consultants`,
      },
    },
    keywords: [
      "feni doctor list",
      "feni doctor serial number",
      "feni doctor appointment",
      "feni doctors info",
      "feni doctor schedule",
      "ফেনী ডাক্তার তালিকা",
      "ফেনী ডাক্তারদের তথ্য",
      "ফেনী ডাক্তার সিরিয়াল",
      "ফেনীর ডাক্তারদের চেম্বার ও সময়সূচী",
      "ফেনীতে আজ কোন ডাক্তার বসেন",
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
    ],
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE_URL}/consultants`,
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

export default async function ConsultantsPage({ searchParams }: ConsultantsPageProps) {
  const { dept, upazila } = (await searchParams) || {};
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";
  const t = (key: string) => tServer(locale, key);

  // Fetch doctors server-side (cached)
  const doctors = await getDoctorsAction();

  const deptSeo = getDepartmentSeoConfig(dept);

  // Filter matching doctors for SEO and counts
  const matchingDoctors = deptSeo
    ? doctors.filter((doc) => {
        if (deptSeo.id === "diabetes") {
          const spec = (doc.specialty || "").toLowerCase();
          return (
            doc.department === "diabetes" ||
            spec.includes("ডায়াবেটিস") ||
            spec.includes("diabetes") ||
            spec.includes("হরমোন") ||
            spec.includes("hormone") ||
            spec.includes("থাইরয়েড") ||
            spec.includes("thyroid") ||
            spec.includes("endocrin")
          );
        }
        return doc.department === deptSeo.id;
      })
    : doctors;

  // Breadcrumb Schema
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: isEn ? "Home" : "হোম",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: isEn ? "Consultants & Doctors" : "ডাক্তার ও কনসালট্যান্টস",
      item: `${SITE_URL}/consultants`,
    },
  ];

  if (deptSeo) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: isEn ? deptSeo.nameEn : deptSeo.nameBn,
      item: `${SITE_URL}/consultants?dept=${deptSeo.slug}`,
    });
  }

  // FAQ Schema
  const faqItems = [
    ...(deptSeo?.faqs || []).map((faq) => ({
      "@type": "Question",
      name: isEn ? faq.qEn : faq.qBn,
      acceptedAnswer: {
        "@type": "Answer",
        text: isEn ? faq.aEn : faq.aBn,
      },
    })),
    {
      "@type": "Question",
      name: t("consultants.faq.q1"),
      acceptedAnswer: {
        "@type": "Answer",
        text: t("consultants.faq.a1"),
      },
    },
    {
      "@type": "Question",
      name: t("consultants.faq.q2"),
      acceptedAnswer: {
        "@type": "Answer",
        text: t("consultants.faq.a2"),
      },
    },
    {
      "@type": "Question",
      name: t("consultants.faq.q3"),
      acceptedAnswer: {
        "@type": "Answer",
        text: t("consultants.faq.a3"),
      },
    },
    {
      "@type": "Question",
      name: t("consultants.faq.q4"),
      acceptedAnswer: {
        "@type": "Answer",
        text: t("consultants.faq.a4"),
      },
    },
    {
      "@type": "Question",
      name: t("consultants.faq.q5"),
      acceptedAnswer: {
        "@type": "Answer",
        text: t("consultants.faq.a5"),
      },
    },
    {
      "@type": "Question",
      name: t("consultants.faq.q6"),
      acceptedAnswer: {
        "@type": "Answer",
        text: t("consultants.faq.a6"),
      },
    },
  ];

  // Structured Data for Google Rich Snippets & AI Search Engines
  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: deptSeo
        ? `${isEn ? deptSeo.nameEn : deptSeo.nameBn} - Health Club Specialist Network`
        : "Health Club Specialist Doctors Network",
      url: deptSeo ? `${SITE_URL}/consultants?dept=${deptSeo.slug}` : `${SITE_URL}/consultants`,
      description: deptSeo
        ? isEn
          ? deptSeo.metaDescriptionEn
          : deptSeo.metaDescriptionBn
        : "Directory of specialist doctors, consultants, chamber schedules, and appointment serial booking in Feni, Bangladesh.",
      areaServed: "Feni, Bangladesh",
      medicalSpecialty: deptSeo
        ? [deptSeo.medicalSpecialtySchema]
        : [
            "Psychiatry",
            "Medicine",
            "Gastroenterology",
            "Vascular Surgery",
            "Orthopaedics",
            "Nephrology",
            "Hepatology",
            "Rheumatology",
            "Nutrition",
            "Gynaecology",
            "Pediatrics",
            "Cardiology",
          ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: deptSeo ? (isEn ? `${deptSeo.nameEn} in Feni` : `ফেনীতে ${deptSeo.nameBn}`) : "Specialist Doctors in Feni",
      itemListElement: (matchingDoctors.length > 0 ? matchingDoctors : doctors).slice(0, 20).map((doc, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Physician",
          name: doc.name,
          image: doc.imageUrl || `${SITE_URL}/og-image.png`,
          medicalSpecialty: doc.specialty,
          jobTitle: doc.designation,
          telephone: doc.serialPhone,
          worksFor: {
            "@type": "MedicalOrganization",
            name: doc.chamberName,
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: doc.chamberAddress,
            addressLocality: "Feni",
            addressCountry: "BD",
          },
        },
      })),
    },
  ];

  return (
    <div className="bg-background min-h-screen py-6 sm:py-12">
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Dynamic Contextual SEO Landing Hero or Default Header */}
        {deptSeo ? (
          <DepartmentSeoHero
            seoConfig={deptSeo}
            locale={locale}
            matchingDoctorsCount={matchingDoctors.length}
          />
        ) : (
          <>
            {/* Page Header */}
            <div className="text-center space-y-2 sm:space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <Stethoscope className="h-3.5 w-3.5" />
                <span>{t("consultants.page.badge")}</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white tracking-tight">
                {t("consultants.page.title")}
              </h1>
              <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {t("consultants.page.subtitle")}
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
                    {isEn ? "Verified Specialists" : "যাচাইকৃত বিশেষজ্ঞ"}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    {isEn ? "Top hospitals & medical colleges" : "শীর্ষ হাসপাতাল ও মেডিকেল কলেজের চিকিৎসক"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-foreground">
                    {isEn ? "Direct Serial Call" : "সরাসরি সিরিয়াল সুবিধা"}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    {isEn ? "Direct helpline & phone serials" : "এক ক্লিকেই সিরিয়াল নম্বরে কল করার সুযোগ"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-foreground">
                    {isEn ? "Member Benefits" : "মেম্বার ডিসকাউন্ট"}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    {isEn ? "Special discount on prescribed tests" : "প্রেসক্রিপশন টেস্টে ১০-৩০% পর্যন্ত ছাড়"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Interactive Directory Component */}
        <div className="sm:bg-muted/30 sm:border sm:border-border/80 sm:rounded-3xl sm:p-8">
          <DoctorDirectory
            doctors={doctors}
            initialDept={dept || "all"}
            initialUpazila={upazila || "all"}
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
