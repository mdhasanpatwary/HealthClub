import Link from "next/link";
import { Check, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import JsonLd from "@/components/seo/JsonLd";
import { LazyTestimonialsSection } from "@/components/landing/LazyLandingComponents";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import WhatsAppAssistanceCard from "@/components/common/WhatsAppAssistanceCard";

export const revalidate = 86400; // 24-hour ISR

export async function generateMetadata() {
  const ogTitle = "মেম্বারশিপ প্ল্যান - হেলথ ক্লাব";
  const ogDesc = "ফ্রি মেম্বারশিপে ১০-২৫% ছাড় এবং প্রিমিয়াম মেম্বারশিপে ১৫-৩০% ছাড় ও প্রায়োরিটি সুবিধা।";

  return {
    title: "মেম্বারশিপ প্ল্যান ও ফ্রি রেজিস্ট্রেশন",
    description: "ফ্রি মেম্বারশিপ (১০-২৫% ছাড়) ও প্রিমিয়াম মেম্বারশিপ (১৫-৩০% ছাড় ও প্রায়োরিটি)-এর সুবিধা দেখে নিন এবং সেরা প্ল্যানটি বেছে নিন।",
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
  const contact = await getCachedContactSettings();

  const benefitDetails = [
    { title: "হাসপাতাল ডিসকাউন্ট", desc: "যেকোনো অংশীদার হাসপাতালে শুধু ডিজিটাল মেম্বার কার্ড প্রদর্শন করে বিলের উপর ১০-৩০% ডিসকাউন্ট।", gradient: "from-emerald-500 to-green-600" },
    { title: "ডায়াগনস্টিক টেস্ট ছাড়", desc: "রক্ত পরীক্ষা, এক্স-রে সহ সকল প্যাথলজিক্যাল ও ইমেজিং পরীক্ষায় ১০-৩০% ডিসকাউন্ট।", gradient: "from-blue-500 to-cyan-600" },
    { title: "মডেল ফার্মেসি অফার", desc: "নির্ধারিত পার্টনার ফার্মেসিগুলো থেকে প্রয়োজনীয় ঔষধ ক্রয়ের ক্ষেত্রে ৫% থেকে ১০% ডিসকাউন্ট।", gradient: "from-violet-500 to-purple-600" },
    { title: "ফ্রি স্বাস্থ্য ক্যাম্প", desc: "নিয়মিত আয়োজিত ফ্রি ডায়াবেটিস চেকআপ, আই ক্যাম্প এবং রক্তচাপ পরীক্ষা।", gradient: "from-rose-500 to-pink-600" },
    { title: "প্রাইওরিটি স্বাস্থ্য সেবা", desc: "প্রিমিয়াম সদস্যদের জন্য রয়েছে সর্বোচ্চ ১৫-৩০% ছাড় এবং চেম্বার ও সিরিয়ালে অগ্রাধিকার সুবিধা।", gradient: "from-amber-500 to-orange-600" }
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
          "reviewBody": "বাবার হঠাৎ তীব্র অসুস্থতায় আল-আকসা হাসপাতালে ভর্তি করাতে হয়েছিল। হেলথ ক্লাব মেম্বার কার্ড দেখিয়ে আমরা মোট বিলে ১০-৩০% ডিসকাউন্ট পেয়েছি। আমাদের মত পরিবারের জন্য এই মেম্বারশিপটি সত্যিই একটি বড় আশীর্বাদ।",
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
          "reviewBody": "হঠাৎ ডেঙ্গুর লক্ষণ দেখা দিলে ডাক্তার জরুরি ব্লাড টেস্টের পরামর্শ দেন। জিরো পয়েন্টে প্যাসিফিক হেলথ কেয়ার সেন্টারে গিয়ে মেম্বার কার্ড দেখাতেই সরাসরি ১০-৩০% ছাড় পেয়েছি। দ্রুত রিপোর্ট ও কর্মীদের আন্তরিক ব্যবহারে আমি অত্যন্ত সন্তুষ্ট।",
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
          "name": "Free Member Plan",
          "price": "0",
          "priceCurrency": "BDT",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "url": `${SITE_URL}/membership`,
          "validFrom": `${new Date().getFullYear()}-01-01`,
          "priceValidUntil": `${new Date().getFullYear() + 1}-12-31`,
          "hasMerchantReturnPolicy": merchantReturnPolicy,
          "shippingDetails": digitalShippingDetails,
          "seller": {
            "@type": "Organization",
            "name": "Health Club",
            "url": SITE_URL
          }
        },
        {
          "@type": "Offer",
          "name": "Premium Member Annual Plan",
          "price": "500",
          "priceCurrency": "BDT",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "url": `${SITE_URL}/membership`,
          "validFrom": `${new Date().getFullYear()}-01-01`,
          "priceValidUntil": `${new Date().getFullYear() + 1}-12-31`,
          "hasMerchantReturnPolicy": merchantReturnPolicy,
          "shippingDetails": digitalShippingDetails,
          "seller": {
            "@type": "Organization",
            "name": "Health Club",
            "url": SITE_URL
          }
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

          {/* Free Member */}
          <div className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background dark:from-primary/15 dark:via-primary/8 dark:to-slate-900 border-2 border-primary rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-xl ring-4 ring-primary/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-3xl" />
            <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
              জনপ্রিয়
            </div>
            <div className="relative space-y-6">
              <div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                  <Star className="h-5 w-5 text-primary fill-primary/20" />
                </div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">ফ্রি মেম্বারশিপ</h3>
                <p className="text-xs text-muted-foreground mt-1">চিকিৎসায় ১০-২৫% ডিসকাউন্ট উপভোগ করুন।</p>
              </div>
              <div className="flex items-baseline gap-2 text-secondary dark:text-white">
                <span className="text-5xl font-extrabold font-mono">৳০</span>
                <span className="text-sm text-muted-foreground font-semibold">/ সম্পূর্ণ ফ্রি</span>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  "হাসপাতাল ও টেস্টে ১০-২৫% নিশ্চিত ডিসকাউন্ট",
                  "১টি কার্ডে পরিবার ও সকল আত্মীয়দের ডিসকাউন্ট কভারেজ",
                  "ডিজিটাল মেম্বারশিপ কার্ড ও ভেরিফাইড কিউআর",
                  "সম্পূর্ণ বিনামূল্যে মেম্বারশিপ সুবিধা",
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

          {/* Premium Member */}
          <div className="bg-background dark:bg-slate-900 border border-border rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-md hover-lift">
            <div className="space-y-6">
              <div>
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <ShieldCheck className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">প্রিমিয়াম মেম্বারশিপ</h3>
                <p className="text-xs text-muted-foreground mt-1">১৫-৩০% সর্বোচ্চ ছাড় ও প্রায়োরিটি সুবিধা।</p>
              </div>
              <div className="flex items-baseline gap-2 text-secondary dark:text-white">
                <span className="text-5xl font-extrabold font-mono">৳৫০০</span>
                <span className="text-sm text-muted-foreground font-semibold">/ বাৎসরিক সাবস্ক্রিপশন</span>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "হাসপাতাল ও টেস্টে ১৫-৩০% সর্বোচ্চ ডিসকাউন্ট",
                  "প্রাইওরিটি কাস্টমার সাপোর্ট ও ডেডিকেটেড হেল্পলাইন",
                  "ডাক্তার চেম্বার ও সিরিয়ালে অগ্রাধিকার সুবিধা",
                  "১টি কার্ডে পরিবার ও সকল আত্মীয়দের ডিসকাউন্ট কভারেজ",
                  "প্রিমিয়াম ডিজিটাল মেম্বারশিপ কার্ড ও কিউআর",
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
                className={cn(
                  buttonVariants({
                    variant: "secondary",
                    size: "lg",
                  }),
                  "w-full shadow-md font-bold transition-all hover:shadow-lg"
                )}
              >
                <span>প্রিমিয়াম মেম্বার হোন</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* WhatsApp Assisted Onboarding & Helpline Support Banner */}
        <div className="max-w-3xl mx-auto w-full">
          <WhatsAppAssistanceCard
            context="membership"
            variant="banner"
            whatsappNumber={contact.whatsapp}
            hotlineNumber={contact.hotline}
          />
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

