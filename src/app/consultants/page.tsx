import Link from "next/link";
import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import DoctorDirectory from "@/components/ui/DoctorDirectory";
import ConsultantsGuide from "@/components/consultants/ConsultantsGuide";
import ConsultantsFAQ from "@/components/consultants/ConsultantsFAQ";
import { Button } from "@/components/ui/button";
import { getDoctorsAction } from "@/app/actions/doctorActions";
import { Stethoscope, ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";
import { SITE_URL } from "@/lib/siteConfig";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Specialist Doctors & Consultants Directory in Feni - Health Club"
      : "বিশেষজ্ঞ ডাক্তার ও কনসালট্যান্ট তালিকা (ফেনী) - হেলথ ক্লাব",
    description: isEn
      ? "Find specialist doctors in Feni, check chamber visiting hours, qualifications, and call direct serial numbers for appointments at partner hospitals and clinics."
      : "ফেনীর বিশেষজ্ঞ ডাক্তারদের তালিকা, চেম্বার শিডিউল, রোগী দেখার সময় এবং সরাসরি সিরিয়াল বুকিংয়ের হটলাইন নম্বর জানুন। পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারের কনসালট্যান্ট তালিকা।",
    alternates: {
      canonical: `${SITE_URL}/consultants`,
    },
    keywords: [
      "feni doctor",
      "feni doctors info",
      "feni doctor info",
      "feni doctor list",
      "feni doctor serial number",
      "feni doctor appointment",
      "feni specialist doctors",
      "ফেনী ডাক্তার",
      "ফেনী ডাক্তারদের তথ্য",
      "ফেনীর বিশেষজ্ঞ ডাক্তার",
      "ফেনী ডাক্তার সিরিয়াল",
      "ফেনীর ডাক্তারদের চেম্বার",
      "Medicine specialist doctor in Feni",
      "Gynecologist in Feni",
      "Psychiatrist in Feni",
      "Orthopedic doctor in Feni",
      "Cardiologist in Feni",
      "Health Club doctor directory",
    ],
    openGraph: {
      title: isEn
        ? "Specialist Doctors & Consultants Directory - Health Club"
        : "বিশেষজ্ঞ ডাক্তার ও কনসালট্যান্ট তালিকা - হেলথ ক্লাব",
      description: isEn
        ? "Find specialist doctors, chamber schedules, and book appointment serials directly in Feni."
        : "ফেনীর বিশেষজ্ঞ ডাক্তারদের পূর্ণাঙ্গ তালিকা ও সরাসরি সিরিয়াল দেওয়ার নাম্বার।",
      url: `${SITE_URL}/consultants`,
    },
    twitter: {
      card: "summary_large_image",
      title: isEn
        ? "Specialist Doctors & Consultants Directory - Health Club"
        : "বিশেষজ্ঞ ডাক্তার ও কনসালট্যান্ট তালিকা - হেলথ ক্লাব",
      description: isEn
        ? "Find specialist doctors, chamber schedules, and book appointment serials directly in Feni."
        : "ফেনীর বিশেষজ্ঞ ডাক্তারদের পূর্ণাঙ্গ তালিকা ও সরাসরি সিরিয়াল দেওয়ার নাম্বার।",
    },
  };
}

export default async function ConsultantsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const t = (key: string) => tServer(locale, key);

  // Fetch doctors server-side (cached)
  const doctors = await getDoctorsAction();

  // Structured Data for Google Rich Snippets & AI Search Engines
  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "en" ? "Home" : "হোম",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "en" ? "Consultants & Doctors" : "ডাক্তার ও কনসালট্যান্টস",
          item: `${SITE_URL}/consultants`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: "Health Club Specialist Doctors Network",
      url: `${SITE_URL}/consultants`,
      description: "Directory of specialist doctors, consultants, chamber schedules, and appointment serial booking in Feni, Bangladesh.",
      areaServed: "Feni, Bangladesh",
      medicalSpecialty: [
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
      mainEntity: [
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
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Specialist Doctors in Feni",
      itemListElement: doctors.slice(0, 20).map((doc, index) => ({
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-14">
        
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
              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                {locale === "en" ? "Verified Specialists" : "যাচাইকৃত বিশেষজ্ঞ"}
              </h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                {locale === "en" ? "Top hospitals & medical colleges" : "শীর্ষ হাসপাতাল ও মেডিকেল কলেজের চিকিৎসক"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                {locale === "en" ? "Direct Serial Call" : "সরাসরি সিরিয়াল সুবিধা"}
              </h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                {locale === "en" ? "Direct helpline & phone serials" : "এক ক্লিকেই সিরিয়াল নম্বরে কল করার সুযোগ"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                {locale === "en" ? "Member Benefits" : "মেম্বার ডিসকাউন্ট"}
              </h4>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                {locale === "en" ? "Special discount on prescribed tests" : "প্রেসক্রিপশন টেস্টে ১০-৩০% পর্যন্ত ছাড়"}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Directory Component */}
        <div className="sm:bg-muted/30 sm:border sm:border-border/80 sm:rounded-3xl sm:p-8">
          <DoctorDirectory doctors={doctors} />
        </div>

        {/* Generative Engine Optimization (GEO) Healthcare Guide & Authority Block */}
        <ConsultantsGuide />

        {/* Answer Engine Optimization (AEO) FAQ Section */}
        <ConsultantsFAQ />

        {/* Bottom CTA for Partner Hospitals & Doctors */}
        <div className="bg-gradient-to-r from-primary/10 via-emerald-500/5 to-secondary/5 border border-primary/20 rounded-3xl p-5 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          <h2 className="font-heading text-xl md:text-3xl font-bold text-secondary dark:text-white">
            {locale === "en"
              ? "Are You a Healthcare Professional or Partner?"
              : "আপনি কি একজন বিশেষজ্ঞ চিকিৎসক অথবা স্বাস্থ্যসেবা প্রতিষ্ঠান?"}
          </h2>
          <p className="text-xs md:text-base text-muted-foreground max-w-xl mx-auto">
            {locale === "en"
              ? "Join Health Club to expand your patient reach and deliver convenient healthcare access across Feni."
              : "হেলথ ক্লাবের সাথে যুক্ত হয়ে আপনার চেম্বার বা ডায়াগনস্টিক সেবাকে মানুষের কাছে আরও সহজলভ্য করুন।"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/partner-hospitals">
              <Button variant="outline" className="rounded-xl font-semibold">
                {locale === "en" ? "View Partner Hospitals" : "পার্টনার হাসপাতাল তালিকা"}
              </Button>
            </Link>
            <Link href="/become-partner">
              <Button className="bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold">
                {locale === "en" ? "Become a Partner" : "পার্টনার হিসেবে যুক্ত হোন"}
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

