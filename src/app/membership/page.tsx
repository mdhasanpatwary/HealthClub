import Link from "next/link";
import { Check, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import JsonLd from "@/components/seo/JsonLd";
import { LazyTestimonialsSection } from "@/components/landing/LazyLandingComponents";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export const revalidate = 86400; // 24-hour ISR

export async function generateMetadata() {
  const ogTitle = "মেম্বারশিপ প্ল্যান - হেলথ ক্লাব";
  const ogDesc = "প্রথম ১০০ জন সদস্য পাচ্ছেন ১ বছরের ফাউন্ডিং মেম্বারশিপ সম্পূর্ণ ফ্রি।";

  return {
    title: "মেম্বারশিপ প্ল্যান ও ফ্রি রেজিস্ট্রেশন",
    description: "ফাউন্ডিং মেম্বার (১ বছর সম্পূর্ণ ফ্রি) ও প্রিমিয়াম মেম্বারশিপের সুবিধা দেখে নিন এবং আপনার জন্য সেরা প্ল্যানটি বেছে নিন।",
    alternates: {
      canonical: `${SITE_URL}/membership`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE_URL}/membership`,
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

export default async function MembershipPage() {
  const benefitDetails = [
    { title: "হাসপাতাল ডিসকাউন্ট", desc: "যেকোনো অংশীদার হাসপাতালে শুধু ডিজিটাল মেম্বার কার্ড প্রদর্শন করে বিলের উপর ১০-৩০% ডিসকাউন্ট।", gradient: "from-emerald-500 to-green-600" },
    { title: "ডায়াগনস্টিক টেস্ট ছাড়", desc: "রক্ত পরীক্ষা, এক্স-রে সহ সকল প্যাথলজিক্যাল ও ইমেজিং পরীক্ষায় ১০-৩০% ডিসকাউন্ট।", gradient: "from-blue-500 to-cyan-600" },
    { title: "মডেল ফার্মেসি অফার", desc: "নির্ধারিত পার্টনার ফার্মেসিগুলো থেকে প্রয়োজনীয় ঔষধ ক্রয়ের ক্ষেত্রে ৫% থেকে ১০% ডিসকাউন্ট।", gradient: "from-violet-500 to-purple-600" },
    { title: "ফ্রি স্বাস্থ্য ক্যাম্প", desc: "নিয়মিত আয়োজিত ফ্রি ডায়াবেটিস চেকআপ, আই ক্যাম্প এবং রক্তচাপ পরীক্ষা।", gradient: "from-rose-500 to-pink-600" },
    { title: "১ বছর প্রতিষ্ঠাতা স্ট্যাটাস", desc: "প্রথম ১০০ ফাউন্ডিং মেম্বারদের জন্য মেম্বারশিপ ১ বছরের জন্য সম্পূর্ণ ফ্রি।", gradient: "from-amber-500 to-orange-600" }
  ];

  const merchantReturnPolicy = {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": "BD",
    "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
    "merchantReturnLink": `${SITE_URL}/terms-conditions`
  };

  const digitalShippingDetails = {
    "@type": "OfferShippingDetails",
    "shippingRate": {
      "@type": "MonetaryAmount",
      "value": "0",
      "currency": "BDT"
    },
    "shippingDestination": {
      "@type": "DefinedRegion",
      "addressCountry": "BD"
    },
    "deliveryTime": {
      "@type": "ShippingDeliveryTime",
      "handlingTime": {
        "@type": "QuantitativeValue",
        "minValue": 0,
        "maxValue": 0,
        "unitCode": "DAY"
      },
      "transitTime": {
        "@type": "QuantitativeValue",
        "minValue": 0,
        "maxValue": 0,
        "unitCode": "DAY"
      }
    }
  };

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
          "name": "মেম্বারশিপ",
          "item": `${SITE_URL}/membership`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Health Club Membership Card",
      "description": "Digital health discount membership card offering 10% to 30% discount at partner hospitals, diagnostic centers, and pharmacies.",
      "image": [
        `${SITE_URL}/og-image.png`,
        `${SITE_URL}/og-image.jpg`
      ],
      "url": `${SITE_URL}/membership`,
      "sku": "HC-MEMBERSHIP-CARD",
      "brand": {
        "@type": "Brand",
        "name": "Health Club"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "128",
        "ratingCount": "128",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "মোঃ আশরাফুল আলম"
          },
          "datePublished": "2026-01-15",
          "reviewBody": "আমার বাবার হঠাৎ স্ট্রোক করার পর পপুলার হাসপাতালে ভর্তি করতে হয়েছিল। হেলথ ক্লাব মেম্বার কার্ড দেখিয়ে আমরা মোট বিলে ১০-৩০% ডিসকাউন্ট পেয়েছি। আমাদের মত গ্রামীণ পরিবারের জন্য এই মেম্বারশিপটি সত্যিই একটি বড় আশীর্বাদ।",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Health Club"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "বেগম সুফিয়া খাতুন"
          },
          "datePublished": "2026-02-10",
          "reviewBody": "আমার ডায়াবেটিস ও প্রেসারের সমস্যার কারণে প্রতি মাসে ল্যাব টেস্ট করাতে হয়। হেলথ ক্লাব কার্ডের মাধ্যমে আমি এখন ল্যাব টেস্টে ১০-৩০% ডিসকাউন্ট পাই। প্রতি মাসে যে টাকা বাঁচে, তা দিয়ে আমার সারা মাসের ঔষধ কেনা হয়ে যায়।",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Health Club"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "মোঃ সাকিবুল ইসলাম"
          },
          "datePublished": "2026-03-01",
          "reviewBody": "পরীক্ষার আগে হঠাৎ করে আমার ডেঙ্গু জ্বর হয়েছিল। ডক্টরের প্রেসক্রিপশন অনুযায়ী কিছু টেস্ট করতে হয় ল্যাবএইডে। বিল পে করার সময় হেলথ ক্লাব ডিজিটাল কার্ড দেখানোতে সরাসরি ১০-৩০% ডিসকাউন্ট পেলাম। সীমিত বাজেটের শিক্ষার্থীর জন্য এই ছাড়টি অনেক উপকারে এসেছে।",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Health Club"
          }
        }
      ],
      "offers": [
        {
          "@type": "Offer",
          "name": "Founding Member (First 100 Users)",
          "price": "0",
          "priceCurrency": "BDT",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "url": `${SITE_URL}/membership`,
          "priceValidUntil": `${new Date().getFullYear() + 1}-12-31`,
          "hasMerchantReturnPolicy": merchantReturnPolicy,
          "shippingDetails": digitalShippingDetails
        },
        {
          "@type": "Offer",
          "name": "Premium Member Annual Plan",
          "price": "500",
          "priceCurrency": "BDT",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "url": `${SITE_URL}/membership`,
          "priceValidUntil": `${new Date().getFullYear() + 1}-12-31`,
          "hasMerchantReturnPolicy": merchantReturnPolicy,
          "shippingDetails": digitalShippingDetails
        }
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <JsonLd data={jsonLdData} />

      {/* Page Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-light/50 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-8 sm:py-20 border-b border-border/60">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-32 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #16a34a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="section-label">প্ল্যান ও বিবরণী</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold shadow-xs">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-500" />
                ))}
              </div>
              <span>৪.৯/৫ রেটিং (১২০+ ভেরিফাইড মেম্বার রিভিউ)</span>
            </div>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white mt-2">
            সাশ্রয়ী স্বাস্থ্য মেম্বারশিপ প্ল্যান
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground max-w-xl mx-auto">
            আপনার পরিবারের প্রয়োজন ও বাজেট অনুযায়ী মানানসই প্ল্যানটি বেছে নিন।
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-20 space-y-10 sm:space-y-20">

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch max-w-3xl mx-auto">

          {/* Founding Member */}
          <div className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background dark:from-primary/15 dark:via-primary/8 dark:to-slate-900 border-2 border-primary rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-xl ring-4 ring-primary/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-3xl" />
            <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
              সীমিত অফার
            </div>
            <div className="relative space-y-6">
              <div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                  <Star className="h-5 w-5 text-primary fill-primary/20" />
                </div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">ফাউন্ডিং মেম্বার</h3>
                <p className="text-xs text-muted-foreground mt-1">প্রথম ১০০ জন ফাউন্ডিং মেম্বারশিপ পাবেন।</p>
              </div>
              <div className="flex items-baseline gap-2 text-secondary dark:text-white">
                <span className="text-5xl font-extrabold font-mono">৳০</span>
                <span className="text-sm text-muted-foreground font-semibold">/ ১ বছর ফ্রি</span>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  "১টি কার্ডে পরিবার ও সকল আত্মীয়দের ডিসকাউন্ট কভারেজ",
                  "১ বছর মেম্বারশিপ",
                  "সকল পার্টনার হাসপাতালে ডিসকাউন্ট",
                  "ডিজিটাল মেম্বারশিপ কার্ড ও ভেরিফাইড কিউআর",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-secondary/80 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative pt-8">
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className: "w-full",
                })}
              >
                <span>ফ্রি জয়েন করুন</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Premium */}
          <div className="bg-background dark:bg-slate-900 border border-border rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-md hover-lift">
            <div className="space-y-6">
              <div>
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <ShieldCheck className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">প্রিমিয়াম মেম্বারশিপ</h3>
                <p className="text-xs text-muted-foreground mt-1">প্রিমিয়াম সদস্যদের বাৎসরিক কার্ড ও সুবিধা।</p>
              </div>
              <div className="flex items-baseline gap-2 text-secondary dark:text-white">
                <span className="text-5xl font-extrabold font-mono">৳৫০০</span>
                <span className="text-sm text-muted-foreground font-semibold">/ বাৎসরিক সাবস্ক্রিপশন</span>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "১টি কার্ডে পরিবার ও সকল আত্মীয়দের ডিসকাউন্ট কভারেজ",
                  "বাৎসরিক রিনিউয়াল সাপেক্ষে মেয়াদ বৃদ্ধি",
                  "সকল পার্টনার হাসপাতালে ডিসকাউন্ট",
                  "ডিজিটাল মেম্বারশিপ কার্ড ও ভেরিফাইড কিউআর",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8">
              <Link
                href="/register?plan=premium"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full",
                })}
              >
                <span>প্ল্যান কিনুন</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Detailed Benefits Grid */}
        <div className="space-y-10 border-t border-border/60 pt-16">
          <div className="text-center space-y-3">
            <span className="section-label">বিস্তারিত মেম্বারশিপের সুবিধাসমূহ</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary dark:text-white mt-3">
              আমাদের সকল মেম্বারশিপ প্ল্যানেই নিচে উল্লেখ করা মৌলিক স্বাস্থ্য সুবিধা ও ক্যাশলেস ডিসকাউন্ট কভারেজ অন্তর্ভুক্ত থাকে।
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {benefitDetails.map((benefit, index) => (
              <div key={index} className="group flex gap-4 p-6 rounded-2xl border border-border/80 bg-background dark:bg-slate-900 hover:border-primary/20 hover-lift shadow-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/3 group-hover:to-transparent transition-all duration-500 rounded-2xl" />
                <div className={`relative h-10 w-10 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                  <Check className="h-4.5 w-4.5 text-white" />
                </div>
                <div className="relative">
                  <h4 className="font-heading font-bold text-secondary dark:text-white text-base">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Reviews & Testimonials Section */}
        <div className="space-y-6 sm:space-y-8 border-t border-border/60 pt-12 sm:pt-16">
          <div className="text-center space-y-2 sm:space-y-3 max-w-xl mx-auto">
            <span className="section-label">সদস্যদের অভিজ্ঞতা ও রিভিউ</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary dark:text-white mt-2">
              আমাদের কার্ড ব্যবহারকারীদের বাস্তব অভিজ্ঞতা
            </h2>
          </div>

          <LazyTestimonialsSection />
        </div>

      </div>
    </div>
  );
}

