import PartnerDirectory from "@/components/ui/PartnerDirectory";
import PartnerHospitalsGuide from "@/components/partner-hospitals/PartnerHospitalsGuide";
import PartnerHospitalsFAQ from "@/components/partner-hospitals/PartnerHospitalsFAQ";
import CommunityNetworkCTA from "@/components/common/CommunityNetworkCTA";
import JsonLd from "@/components/seo/JsonLd";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { Sparkles, ShieldCheck, Tag, Pill, MapPin } from "lucide-react";

export const revalidate = 86400; // 24-hour Incremental Static Regeneration (ISR)

export async function generateMetadata() {
  const pageTitle = "ফেনী হাসপাতাল তালিকা, ডায়াগনস্টিক সেন্টার ও প্যাথলজি ডিসকাউন্ট";
  const ogTitle = "ফেনী হাসপাতাল তালিকা, ডায়াগনস্টিক সেন্টার ও প্যাথলজি ডিসকাউন্ট - হেলথ ক্লাব";
  const pageDesc = "ফেনীর শীর্ষ বেসরকারি হাসপাতাল, প্যাথলজি ল্যাব, ডায়াগনস্টিক সেন্টার ও মডেল ফার্মেসির তালিকা। হেলথ ক্লাব মেম্বার কার্ডে পান ১০% থেকে ৩০% নিশ্চিত ডিসকাউন্ট।";

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: `${SITE_URL}/partner-hospitals`,
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
      description: pageDesc,
      url: `${SITE_URL}/partner-hospitals`,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: pageDesc,
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
  // Fetch partners server-side (cached with ISR)
  const allPartners = await getPartnersAction();

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "হোম",
          "item": SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টার",
          "item": `${SITE_URL}/partner-hospitals`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": ["MedicalBusiness", "MedicalOrganization"],
      "name": "হেলথ ক্লাব পার্টনার হাসপাতাল ও ডায়াগনস্টিক নেটওয়ার্ক (ফেনী)",
      "url": `${SITE_URL}/partner-hospitals`,
      "description": "ফেনীর শীর্ষ বেসরকারি হাসপাতাল, প্যাথলজি ল্যাব, ডায়াগনস্টিক সেন্টার ও মডেল ফার্মেসির তালিকা এবং ১০% থেকে ৩০% মেম্বার ডিসকাউন্ট নেটওয়ার্ক।",
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
          "name": "ফেনীতে হাসপাতালে এবং মেডিকেল টেস্টে কীভাবে ডিসকাউন্ট পেতে পারি?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "হেলথ ক্লাব (Health Club)-এর ডিজিটাল মেম্বারশিপ কার্ড ব্যবহার করে ফেনীর চুক্তিবদ্ধ সকল বেসরকারি হাসপাতাল, ক্লিনিক এবং ডায়াগনস্টিক সেন্টারে প্যাথলজি ল্যাব টেস্ট (রক্ত, হরমোন পরীক্ষা), ডিজিটাল এক্স-রে, আল্ট্রাসনোগ্রাম (USG), সিটি স্ক্যান এবং কেবিন ভাড়ায় ১০% থেকে ৩০% পর্যন্ত নিশ্চিত ডিসকাউন্ট পাওয়া যায়। বিলিং কাউন্টারে শুধু আপনার হেলথ ক্লাব মেম্বার আইডি বা কার্ডটি প্রদর্শন করলেই তাৎক্ষণিকভাবে বিল থেকে নির্ধারিত ছাড় পেয়ে যাবেন।"
          }
        },
        {
          "@type": "Question",
          "name": "ডায়াগনস্টিক সেন্টারে কোন কোন টেস্টে ছাড় পাওয়া যায়?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "সকল প্রকার প্যাথলজি রক্ত পরীক্ষা (CBC, Lipid, HbA1c, Thyroid ইত্যাদি), ডিজিটাল এক্স-রে, আল্ট্রাসনোগ্রাম (USG), ইসিজি (ECG), ইকোকার্ডিওগ্রাফি, এন্ডোস্কোপি, সিটি স্ক্যান ও এমআরআই টেস্টে ১০% থেকে ৩০% পর্যন্ত ছাড় পাবেন।"
          }
        },
        {
          "@type": "Question",
          "name": "ফার্মেসিতে ওষুধ কেনার সময় কি ডিসকাউন্ট প্রযোজ্য?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "হ্যাঁ, আমাদের তালিকাভুক্ত মডেল ফার্মেসি ও পার্টনার ওষুধের দোকানগুলোতে প্রেসক্রিপশন অনুযায়ী প্রয়োজনীয় ওষুধ ক্রয়ে হেলথ ক্লাব মেম্বার কার্ড দেখালে বিশেষ ছাড় পাওয়া যাবে।"
          }
        },
        {
          "@type": "Question",
          "name": "ফেনীর বাইরে কি এই মেম্বার কার্ড ব্যবহার করা যাবে?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "হ্যাঁ, হেলথ ক্লাবের নেটওয়ার্কভুক্ত ঢাকা, চট্টগ্রাম সহ অন্যান্য জেলার পার্টনার হাসপাতাল ও ডায়াগনস্টিক ল্যাবেও আপনি একই সুবিধা উপভোগ করতে পারবেন।"
          }
        },
        {
          "@type": "Question",
          "name": "জরুরি প্রয়োজনে কীভাবে নিকটস্থ অ্যাম্বুলেন্স বা অক্সিজেন খুঁজে পাবো?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "হেলথ ক্লাবের 'জরুরি সেবা' পেজ থেকে সরাসরি হটলাইনে কল করে ২৪/৭ আইসিইউ/এসি অ্যাম্বুলেন্স, ব্লাড ডোনার এবং অক্সিজেন সিলিন্ডার সহায়তা পাওয়া যাবে।"
          }
        },
        {
          "@type": "Question",
          "name": "ফেনীতে মেডিকেল টেস্ট ও প্যাথলজি ল্যাব টেস্টে কত টাকা সাশ্রয় হয়?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "টেস্টের ধরন অনুযায়ী মেম্বাররা রুটিন প্যাথলজি, হরমোন টেস্ট, এক্স-রে, ৪ডি ইউএসজি, সিটি স্ক্যান এবং এমআরআই-তে ১৫% থেকে ৩০% পর্যন্ত ছাড় পান, যা প্রতিটি মেডিকেল চেকআপে উল্লেখযোগ্য আর্থিক সাশ্রয় নিশ্চিত করে।"
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
            <span>ফেনী হেলথকেয়ার নেটওয়ার্ক ও ডিসকাউন্ট</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টার{" "}
            <span className="text-primary">তালিকা (ফেনী)</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            ফেনী সদর, মহিপাল ও সকল উপজেলার ভেরিফাইড বেসরকারি হাসপাতাল, ডায়াগনস্টিক সেন্টার, প্যাথলজি ল্যাব ও মডেল ফার্মেসির বিস্তারিত তালিকা। হেলথ ক্লাব মেম্বার কার্ডে পান ১০% থেকে ৩০% নিশ্চিত ছাড়।
          </p>

          {/* Quick Highlight Feature Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Tag className="h-3.5 w-3.5 text-primary" />
              ১০% - ৩০% নিশ্চিত ছাড়
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              প্যাথলজি ও ডিজিটাল স্ক্যান
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <Pill className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              মডেল ফার্মেসি নেটওয়ার্ক
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/70 shadow-2xs">
              <MapPin className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              ফেনীর ৬টি উপজেলা কভারেজ
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Directory & SEO Guides */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 sm:space-y-16">
        
        {/* Directory Component — server-fetched data, no client-side loading */}
        <section aria-labelledby="partner-directory-heading" className="bg-muted/30 border border-border/80 rounded-3xl p-3.5 sm:p-8 space-y-4">
          <h2 id="partner-directory-heading" className="sr-only">
            পার্টনার হাসপাতাল ও ডায়াগনস্টিক ডিরেক্টরি
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
