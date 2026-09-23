import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Stethoscope, ShieldCheck, PhoneCall, HeartHandshake, HelpCircle } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import DoctorDirectory from "@/components/ui/DoctorDirectory";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import { getDoctorsAction } from "@/app/actions/doctorActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { getDepartmentSeoConfig, getAllDepartmentSlugs, DOCTOR_DEPARTMENTS_SEO } from "@/data/doctorSeoData";

export const revalidate = 86400; // 24-hour ISR

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllDepartmentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const deptSeo = getDepartmentSeoConfig(slug);

  if (!deptSeo) {
    return {
      title: "বিভাগ পাওয়া যায়নি | হেলথ ক্লাব",
      description: "অনুরোধকৃত চিকিৎসা বিভাগটি খুঁজে পাওয়া যায়নি।",
    };
  }

  const canonicalUrl = `${SITE_URL}/consultants/department/${deptSeo.slug}`;

  return {
    title: deptSeo.metaTitleBn,
    description: deptSeo.metaDescriptionBn,
    keywords: deptSeo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: deptSeo.metaTitleBn,
      description: deptSeo.metaDescriptionBn,
      url: canonicalUrl,
      siteName: "হেলথ ক্লাব (Health Club)",
      locale: "bn_BD",
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

export default async function DepartmentLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const deptSeo = getDepartmentSeoConfig(slug);

  if (!deptSeo) {
    notFound();
  }

  const doctors = await getDoctorsAction();
  const pageUrl = `${SITE_URL}/consultants/department/${deptSeo.slug}`;

  // Filter department physicians for ItemList schema
  const deptDoctors = doctors.filter((doc) => {
    if (doc.department === slug) return true;
    if (slug === "diabetes") {
      const spec = (doc.specialty || "").toLowerCase();
      return ["ডায়াবেটিস", "diabetes", "হরমোন", "hormone", "থাইরয়েড", "thyroid", "endocrin"].some((k) =>
        spec.includes(k)
      );
    }
    return false;
  });

  // Breadcrumb schema
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "হোম",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ডাক্তার ও কনসালট্যান্টস",
      item: `${SITE_URL}/consultants`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: deptSeo.nameBn,
      item: pageUrl,
    },
  ];

  // FAQ schema from department-curated FAQs
  const faqSchema = deptSeo.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.qBn,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.aBn,
    },
  }));

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: `${deptSeo.nameBn} - হেলথ ক্লাব ফেনী`,
      url: pageUrl,
      description: deptSeo.metaDescriptionBn,
      areaServed: {
        "@type": "City",
        name: "Feni",
        containedInPlace: {
          "@type": "Country",
          name: "Bangladesh",
        },
      },
      medicalSpecialty: deptSeo.medicalSpecialtySchema,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqSchema,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Specialist Doctors in ${deptSeo.nameEn} (Feni)`,
      itemListElement: deptDoctors.slice(0, 15).map((doc, index) => ({
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

  // Top related departments for interlinking
  const relatedDepartments = Object.values(DOCTOR_DEPARTMENTS_SEO)
    .filter((d) => d.slug !== slug)
    .slice(0, 8);

  return (
    <div className="bg-background min-h-screen py-4 sm:py-10">
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        
        {/* Semantic Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs text-muted-foreground gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            হোম
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/consultants" className="hover:text-primary transition-colors">
            ডাক্তার তালিকা
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-semibold" aria-current="page">
            {deptSeo.nameBn}
          </span>
        </nav>

        {/* Hero Section */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="h-3.5 w-3.5" />
            <span>{deptSeo.heroBadgeBn}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white tracking-tight">
            {deptSeo.heroHeadlineBn}
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {deptSeo.introDescriptionBn}
          </p>

          {/* Clinical Scope Pills */}
          {deptSeo.clinicalScopeBn && deptSeo.clinicalScopeBn.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2">
              {deptSeo.clinicalScopeBn.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-muted text-[11px] sm:text-xs font-medium text-foreground border border-border/60"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Highlight Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-foreground">যাচাইকৃত বিশেষজ্ঞ</h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">বিএমডিসি নিবন্ধিত অভিজ্ঞ চিকিৎসক</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-foreground">সরাসরি সিরিয়াল</h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">চেম্বারে সরাসরি সিরিয়াল কল সুবিধা</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-foreground">মেম্বার বিশেষ ছাড়</h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">১০-৩০% মেম্বার ছাড় টেস্ট ও ল্যাবে</p>
            </div>
          </div>
        </div>

        {/* Interactive Doctor Directory with pre-selected department */}
        <div className="sm:bg-muted/30 sm:border sm:border-border/80 sm:rounded-3xl sm:p-8">
          <DoctorDirectory doctors={doctors} initialDept={slug} />
        </div>

        {/* Department-Curated FAQ Section (AEO & Featured Snippets) */}
        {deptSeo.faqs && deptSeo.faqs.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-4 pt-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-lg sm:text-xl">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2>{deptSeo.nameBn} সংক্রান্ত সাধারণ জিজ্ঞাসা ও উত্তর</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {deptSeo.faqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                    {faq.qBn}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                    {faq.aBn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Medical Departments in Feni (Internal Linking Hub) */}
        <div className="max-w-5xl mx-auto space-y-3 pt-6 border-t border-border/80">
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-bold text-foreground">ফেনীর অন্যান্য বিশেষজ্ঞ বিভাগসমূহ</h3>
            <p className="text-xs text-muted-foreground">প্রয়োজনীয় বিশেষজ্ঞ ডাক্তার খুঁজে নিতে বিভাগ নির্বাচন করুন</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedDepartments.map((dept) => (
              <Link
                key={dept.slug}
                href={`/consultants/department/${dept.slug}`}
                className="px-3 py-1.5 rounded-xl bg-card hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-border/80 text-xs font-medium text-foreground transition-all duration-200"
              >
                {dept.nameBn}
              </Link>
            ))}
            <Link
              href="/consultants"
              className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
            >
              সকল ডাক্তার দেখুন →
            </Link>
          </div>
        </div>

        {/* Community Collaboration CTA */}
        <CommunityNetworkCTA />
      </div>
    </div>
  );
}
