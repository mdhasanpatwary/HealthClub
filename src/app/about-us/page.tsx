import { Heart, ShieldCheck, Users, Award, Target, Zap } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export const revalidate = 86400; // 24-hour ISR

export async function generateMetadata() {
  const ogTitle = "আমাদের সম্পর্কে - হেলথ ক্লাব";
  const ogDesc = "চিকিৎসা ব্যয় সাশ্রয়ে হেলথ ক্লাবের উদ্যোগ ও লক্ষ্য সম্পর্কে বিস্তারিত জানুন।";

  return {
    title: "আমাদের সম্পর্কে - ভিশন ও মিশন",
    description: "হেলথ ক্লাবের লক্ষ্য, আমাদের ভিশন এবং কীভাবে আমরা চিকিৎসা খরচ কমিয়ে এনে দেশব্যাপী স্বাস্থ্যসেবা সহজলভ্য করছি তা জানুন।",
    alternates: {
      canonical: `${SITE_URL}/about-us`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE_URL}/about-us`,
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

export default async function AboutUsPage() {
  const pillars = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "সবার জন্য চিকিৎসা",
      desc: "মধ্যবিত্ত ও গ্রামীণ নিম্ন-আয়ের পরিবারগুলোর স্বাস্থ্য পরীক্ষার ব্যয় হাতের নাগালে নিয়ে আসা আমাদের প্রথম লক্ষ্য।",
      gradient: "from-emerald-500 to-green-600",
      bg: "from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "শতভাগ অফিশিয়াল পার্টনারশিপ",
      desc: "সকল অংশীদার হাসপাতাল ও ল্যাবের সাথে অফিশিয়াল চুক্তির মাধ্যমে ভ্যালিড ডিসকাউন্টের নিশ্চয়তা প্রদান করি।",
      gradient: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-white dark:from-blue-950/40 dark:to-slate-900",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "সহজ ডিজিটাল যাচাইকরণ",
      desc: "ডিজিটাল মেম্বার আইডি কার্ড ও সহজ কিউআর কোড স্ক্যান ব্যবহার করে ঝামেলাহীন হাসপাতাল ছাড় নিশ্চিত করা।",
      gradient: "from-violet-500 to-purple-600",
      bg: "from-violet-50 to-white dark:from-violet-950/40 dark:to-slate-900",
    },
  ];

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
          "name": "আমাদের সম্পর্কে",
          "item": `${SITE_URL}/about-us`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "হেলথ ক্লাব সম্পর্কে",
      "url": `${SITE_URL}/about-us`,
      "description": "হেলথ ক্লাব একটি সহজ ডিজিটাল মেম্বারশিপ প্ল্যাটফর্ম, যা সাধারণ পরিবারগুলোর সাথে নামকরা পার্টনার হাসপাতালের সরাসরি সেতুবন্ধন তৈরি করে।"
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <JsonLd data={jsonLdData} />

      {/* Page Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-light/50 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-16 sm:py-24 border-b border-border/60">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-32 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #16a34a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="section-label">আওয়ার মিশন</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white mt-3">
            আমাদের লক্ষ্য ও পরিচিতি
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী — এই স্লোগানকে সামনে রেখে আমরা কাজ করে যাচ্ছি।
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-secondary dark:text-white">
                হেলথ ক্লাব কেন তৈরি হয়েছে?
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              আমাদের দেশের গ্রামীণ ও মফস্বল এলাকার মধ্যবিত্ত পরিবার, শিক্ষার্থী এবং প্রবীণ নাগরিকদের জন্য হঠাৎ আসা বড় ধরনের চিকিৎসা ব্যয় বহন করা অত্যন্ত কষ্টসাধ্য। অনেক সময় ডায়াগনস্টিক টেস্টের অতিরিক্ত মূল্যের কারণে সঠিক সময়ে রোগ নির্ণয় সম্ভব হয় না।
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              হেলথ ক্লাব একটি সহজ ডিজিটাল মেম্বারশিপ প্ল্যাটফর্ম, যা সাধারণ পরিবারগুলোর সাথে নামকরা পার্টনার হাসপাতালের সরাসরি সেতুবন্ধন তৈরি করে। আমাদের অফিশিয়াল চুক্তির মাধ্যমে hospital ও ল্যাবগুলো আমাদের কার্ডধারী সদস্যদের বিশেষ ছাড় প্রদান করে, যার ফলে চিকিৎসায় সাশ্রয় ও সুস্থ জীবন নিশ্চিত করা সহজ হয়।
            </p>
          </div>

          {/* Brand values card */}
          <div className="relative bg-gradient-to-br from-primary-light/80 via-emerald-50/60 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8 rounded-3xl border border-primary/20 dark:border-primary/10 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

            <div className="relative flex items-center gap-2.5 mb-6">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-heading text-base font-bold text-primary">
                হেলথ ক্লাব ব্র্যান্ড ভ্যালু
              </h3>
            </div>

            <ul className="space-y-5">
              {[
                { icon: <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />, text: "ভরসা ও বিশ্বস্ততা: হাসপাতালগুলোর সাথে আইনি চুক্তির মাধ্যমে সেবার শতভাগ নিশ্চয়তা।" },
                { icon: <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />, text: "যত্নশীল সেবা: প্রতিটি মেম্বার এবং তাদের পরিবারের চিকিৎসায় আন্তরিক সমাধান।" },
                { icon: <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />, text: "কমিউনিটি ও সমাজকল্যাণ: সাশ্রয়ী স্বাস্থ্যসেবা সবার মৌলিক অধিকার বাস্তবায়নে ভূমিকা রাখা।" },
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-primary/15 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-sm text-secondary dark:text-slate-300 leading-relaxed pt-1">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Values / Pillars Grid */}
        <div className="space-y-10 border-t border-border/60 pt-16">
          <div className="text-center space-y-3">
            <span className="section-label">আমাদের মূল স্তম্ভসমূহ (Core Pillars)</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary dark:text-white mt-3">
              আমরা তিনটি মূল নীতির উপর ভিত্তি করে আমাদের মেম্বার ও পার্টনার হাসপাতাল পরিচালনা করি।
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className={`relative bg-gradient-to-br ${pillar.bg} p-7 rounded-2xl border border-border/80 text-center space-y-4 hover-lift shadow-sm overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 group-hover:from-primary/3 to-transparent transition-all duration-500 rounded-2xl" />
                <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mx-auto text-white shadow-lg`}>
                  {pillar.icon}
                </div>
                <h3 className="relative font-heading text-base font-bold text-secondary dark:text-white">
                  {pillar.title}
                </h3>
                <p className="relative text-sm text-muted-foreground leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
