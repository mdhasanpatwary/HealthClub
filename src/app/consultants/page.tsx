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

  const ogTitle = "ফেনী ডাক্তার তালিকা ও সিরিয়াল নাম্বার | চেম্বার সময়সূচী - হেলথ ক্লাব";
  const ogDesc = "ফেনীর সকল বিশেষজ্ঞ ডাক্তারদের তালিকা, চেম্বার শিডিউল, রোগী দেখার সময় এবং সরাসরি সিরিয়াল নাম্বার ও অ্যাপয়েন্টমেন্ট তথ্য।";

  return {
    title: "ফেনী ডাক্তার তালিকা ও সিরিয়াল নাম্বার | চেম্বার সময়সূচী ও অ্যাপয়েন্টমেন্ট",
    description: "ফেনী ডাক্তার তালিকা, চেম্বার সময়সূচী ও সরাসরি সিরিয়াল নাম্বার। ফেনীর বিশেষজ্ঞ ডাক্তারদের (মেডিসিন, গাইনী, শিশু, হৃদরোগ) চেম্বার, রোগী দেখার সময় এবং অ্যাপয়েন্টমেন্ট বুকিংয়ের বিস্তারিত তথ্য।",
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

  // Fetch doctors server-side (cached with ISR)
  const doctors = await getDoctorsAction();

  // Breadcrumb Schema
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
  ];

  // FAQ Schema
  const faqItems = [
    {
      "@type": "Question",
      name: "ফেনীতে বিশেষজ্ঞ ডাক্তারের সিরিয়াল বা অ্যাপয়েন্টমেন্ট কীভাবে বুক করবেন?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "হেলথ ক্লাব ডিরেক্টরিতে যেকোনো ডাক্তারের প্রোফাইলে 'সিরিয়াল কল করুন' বাটনে চাপ দিন। এতে সরাসরি সংশ্লিষ্ট হাসপাতাল ও চেম্বার কাউন্টারের অফিসিয়াল হটলাইন নাম্বার চলে আসবে। সেখানে কল করে কোনো প্রকার মধ্যস্বত্বভোগী বা বাড়তি ফি ছাড়াই আপনার সিরিয়াল নিশ্চিত করুন।",
      },
    },
    {
      "@type": "Question",
      name: "ফেনীতে আজ কোন ডাক্তার চেম্বারে বসবেন তা কীভাবে জানব?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "হেলথ ক্লাব ডিরেক্টরির প্রতিটি ডাক্তারের কার্ডে 'আজ চেম্বার খোলা' বা 'আজ চেম্বার বন্ধ' স্ট্যাটাস ব্যাজ এবং রোগী দেখার দিন ও সময় স্পষ্ট উল্লেখ থাকে। এছাড়া আপনার প্রয়োজনীয় বিভাগ (যেমন মেডিসিন, গাইনী, শিশু রোগ) নির্বাচন করে আজকের শিডিউল অনুযায়ী সহজেই ডাক্তার খুঁজে নিতে পারেন।",
      },
    },
    {
      "@type": "Question",
      name: "ফেনীর ডাক্তারদের চেম্বার ও সময়সূচী কোথায় পাওয়া যাবে?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "আমাদের ডিরেক্টরিতে ফেনীর এস.এস.কে রোড, ট্রাঙ্ক রোড, শহীদ শহীদুল্লা কায়সার সড়ক ও গ্র্যান্ড ট্রাঙ্ক রোডের সকল প্রধান ক্লিনিক ও ডায়াগনস্টিক সেন্টারের চিকিৎসকদের চেম্বার নাম, রুম নম্বর, রোগী দেখার দিন এবং সময়সূচী সম্পূর্ণ হালনাগাদ আকারে পাওয়া যায়।",
      },
    },
    {
      "@type": "Question",
      name: "ফেনীর কোন কোন হাসপাতাল ও ডায়াগনস্টিক সেন্টারের ডাক্তার তালিকা এখানে রয়েছে?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ফেনীর শীর্ষ স্বাস্থ্যসেবা প্রতিষ্ঠান যেমন আধুনিক ডায়াগনস্টিক সেন্টার, ফেনী ডায়াবেটিক সমিতি, কনসেপ্ট হাসপাতাল, সাজেদা হাসপাতাল, ড্রিম প্রাইভেট হাসপাতাল, ফেনী হার্ট ফাউন্ডেশন, আল-কেমাল হাসপাতাল সহ শহরের সকল রেজিস্টার্ড সেন্টারের অভিজ্ঞ চিকিৎসকদের তথ্য এখানে অন্তর্ভুক্ত রয়েছে।",
      },
    },
    {
      "@type": "Question",
      name: "ডাক্তার দেখানোর পর টেস্ট বা পরীক্ষায় হেলথ ক্লাব মেম্বাররা কী সুবিধা পান?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ডাক্তার দেখানোর পর চিকিৎসকের পরামর্শ অনুযায়ী সকল প্রয়োজনীয় ডায়াগনস্টিক পরীক্ষা (যেমন: রক্ত পরীক্ষা, ডিজিটাল এক্স-রে, আল্ট্রাসনোগ্রাম, ইকো, এমআরআই, সিটি স্ক্যান)-এ হেলথ ক্লাব মেম্বাররা পার্টনার হাসপাতাল ও ল্যাবগুলোতে ১০% থেকে ৩০% পর্যন্ত তাৎক্ষণিক ডিসকাউন্ট পান।",
      },
    },
    {
      "@type": "Question",
      name: "চেম্বারে যাওয়ার পূর্বে কী প্রস্তুতি নেওয়া প্রয়োজন ও তথ্য কতটা নির্ভরযোগ্য?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "আমাদের ডেডিকেটেড হেলথ টিম নিয়মিত হাসপাতাল ও চেম্বারগুলোর সাথে সরাসরি যোগাযোগ রেখে ডাক্তারদের সময়সূচি এবং সিরিয়াল নম্বর যাচাই করে। চেম্বারে যাওয়ার পূর্বে ফোনে সিরিয়াল নিশ্চিত করুন এবং রোগীর পূর্বের প্রেসক্রিপশন ও রিপোর্ট সাথে নিয়ে নির্ধারিত সময়ের ৩০ মিনিট পূর্বে উপস্থিত হোন।",
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
      mainEntity: faqItems,
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
