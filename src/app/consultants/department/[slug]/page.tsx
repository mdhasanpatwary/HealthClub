import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { Stethoscope, ShieldCheck, PhoneCall, HeartHandshake, HelpCircle } from "lucide-react";
import dynamic from "next/dynamic";
import JsonLd from "@/components/seo/JsonLd";
import DoctorDirectory from "@/components/ui/DoctorDirectory";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const CommunityNetworkCTA = dynamic(
  () => import("@/components/common/CommunityNetworkCTA"),
  { ssr: true }
);
import { getDoctorsByDepartmentAction } from "@/app/actions/doctorActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { getDepartmentSeoConfig, getAllDepartmentSlugs, DOCTOR_DEPARTMENTS_SEO } from "@/data/doctorSeoData";
import { generateConsultantDepartmentJsonLd, getHighDensityDepartmentFaqs } from "../../utils/consultantJsonLd";

export const revalidate = false; // Pure static SSG (zero ISR writes)

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllDepartmentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug === "all" || slug === "other") {
    permanentRedirect("/consultants");
  }
  const deptSeo = getDepartmentSeoConfig(slug);

  if (!deptSeo) {
    notFound();
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
  if (!slug || slug === "all" || slug === "other") {
    permanentRedirect("/consultants");
  }
  const deptSeo = getDepartmentSeoConfig(slug);

  if (!deptSeo) {
    notFound();
  }

  const deptDoctors = await getDoctorsByDepartmentAction(slug);
  const pageUrl = `${SITE_URL}/consultants/department/${deptSeo.slug}`;

  const departmentFaqs = getHighDensityDepartmentFaqs(deptSeo);
  const jsonLdData = generateConsultantDepartmentJsonLd({
    pageUrl,
    deptSeo,
    deptDoctors,
  });

  // Top related departments for interlinking
  const relatedDepartments = Object.values(DOCTOR_DEPARTMENTS_SEO)
    .filter((d) => d.slug !== slug)
    .slice(0, 8);

  return (
    <div className="bg-background min-h-screen py-4 sm:py-10">
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        
        {/* Semantic Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "হোম", href: "/" },
            { label: "বিশেষজ্ঞ ডাক্তার", href: "/consultants" },
            { label: deptSeo.nameBn },
          ]}
        />

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
              <div className="text-xs sm:text-sm font-bold text-foreground">যাচাইকৃত বিশেষজ্ঞ</div>
              <p className="text-[11px] sm:text-xs text-muted-foreground">বিএমডিসি নিবন্ধিত অভিজ্ঞ চিকিৎসক</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-foreground">সরাসরি সিরিয়াল</div>
              <p className="text-[11px] sm:text-xs text-muted-foreground">চেম্বারে সরাসরি সিরিয়াল কল সুবিধা</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-foreground">মেম্বার বিশেষ ছাড়</div>
              <p className="text-[11px] sm:text-xs text-muted-foreground">১০-৩০% মেম্বার ছাড় টেস্ট ও ল্যাবে</p>
            </div>
          </div>
        </div>

        {/* Interactive Doctor Directory with pre-selected department */}
        <div className="sm:bg-muted/30 sm:border sm:border-border/80 sm:rounded-3xl sm:p-8">
          <DoctorDirectory
            doctors={deptDoctors}
            initialDept={slug}
            initialUpazila="all"
            isDepartmentPage={true}
          />
        </div>

        {/* Department-Curated FAQ Section (AEO & Speakable Featured Snippets) */}
        {departmentFaqs && departmentFaqs.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-4 pt-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-lg sm:text-xl">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 id="dept-heading">{deptSeo.nameBn} সংক্রান্ত সাধারণ জিজ্ঞাসা ও উত্তর</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {departmentFaqs.map((faq, i) => (
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
