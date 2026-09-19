import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { BLOG_CATEGORIES, BLOG_FILTER_PILLS } from "@/data/blog/blogPosts";
import { getAllBlogPostsAction } from "@/app/actions/blogAdminActions";
import { BlogSearchFilter } from "./components/BlogSearchFilter";
import {
  BookOpen,
  Hospital,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { formatArticleDate } from "@/lib/dateUtils";

export const revalidate = 86400; // 24-hour Incremental Static Regeneration (ISR)

export async function generateMetadata() {
  const isEn = false;

  const ogTitle = isEn
    ? "Healthcare Blog & Feni Hospital Review Directory | Health Club"
    : "স্বাস্থ্যসেবা ব্লগ ও ফেনী হাসপাতাল গাইড | হেলথ ক্লাব";
  const ogDesc = isEn
    ? "Trusted healthcare reviews, hospital directories in Feni, emergency contacts, and medical cost-saving guides."
    : "ফেনীর সেরা হাসপাতাল ও স্বাস্থ্যসেবা প্রতিষ্ঠানের বিস্তারিত রিভিউ, জরুরি অ্যাম্বুলেন্স তালিকা ও সাশ্রয়ী চিকিৎসার নির্ভরযোগ্য গাইড।";

  return {
    title: isEn
      ? { absolute: "Health Care Blog & Feni Hospital Reviews | Health Club" }
      : "স্বাস্থ্যসেবা ব্লগ ও ফেনী হাসপাতাল রিভিউ গাইড",
    description: ogDesc,
    alternates: {
      canonical: `${SITE_URL}/blog`,
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
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: `${SITE_URL}/blog`,
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
    keywords: [
      "Feni hospital blog",
      "best hospitals in feni",
      "ফেনীর সেরা হাসপাতাল",
      "feni doctor directory",
      "health club feni blog",
      "feni emergency health helpline",
      "ফেনী প্রাইভেট হাসপাতাল ও ডায়াগনস্টিক",
    ],
  };
}

export default async function BlogPage() {
  const locale: Locale = "bn";
  const isEn = false;

  const allPosts = await getAllBlogPostsAction();
  const featuredPost = allPosts[0]; // Flagship article

  const ogDesc = isEn
    ? "Trusted healthcare reviews, hospital directories in Feni, emergency contacts, and medical cost-saving guides."
    : "ফেনীর সেরা হাসপাতাল ও স্বাস্থ্যসেবা প্রতিষ্ঠানের বিস্তারিত রিভিউ, জরুরি অ্যাম্বুলেন্স তালিকা ও সাশ্রয়ী চিকিৎসার নির্ভরযোগ্য গাইড।";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/blog#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEn ? "Home" : "হোম",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isEn ? "Blog" : "ব্লগ",
            item: `${SITE_URL}/blog`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/blog#collection`,
        url: `${SITE_URL}/blog`,
        name: isEn
          ? "Healthcare Blog & Feni Hospital Guides"
          : "স্বাস্থ্যসেবা ব্লগ ও ফেনী হাসপাতাল গাইড",
        description: ogDesc,
        inLanguage: isEn ? "en-US" : "bn-BD",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          name: "Health Club (হেলথ ক্লাব)",
          url: SITE_URL,
        },
        mainEntity: {
          "@type": "ItemList",
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          numberOfItems: allPosts.length,
          itemListElement: allPosts.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}/blog/${post.slug}`,
            name: isEn ? post.titleEn : post.titleBn,
            description: isEn ? post.excerptEn : post.excerptBn,
            image: post.coverImage.startsWith("http")
              ? post.coverImage
              : `${SITE_URL}${post.coverImage}`,
          })),
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <JsonLd data={jsonLdData} />

      {/* Header / Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Hospital className="h-4 w-4" />
              <span>
                {isEn ? "Health Club Editorial & Guides" : "হেলথ ক্লাব এডিটোরিয়াল ও গাইড"}
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {isEn ? (
                <>
                  Healthcare Blog & <span className="gradient-text">Hospital Directory</span>
                </>
              ) : (
                <>
                  স্বাস্থ্যসেবা ব্লগ ও <span className="gradient-text">হাসপাতাল গাইড</span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
              {isEn
                ? "Authoritative guides on hospitals, verified specialist doctor chambers, emergency contacts, and member discount benefits in Feni."
                : "ফেনী ও পার্শ্ববর্তী অঞ্চলের সেরা সরকারি-বেসরকারি হাসপাতালের পূর্ণাঙ্গ রিভিউ, জরুরি অ্যাম্বুলেন্স তালিকা ও হেলথ কার্ডে সাশ্রয়ী চিকিৎসার উপায়।"}
            </p>

            {/* Quick Trust Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-3 text-xs sm:text-sm text-foreground/90 font-medium">
              <span className="flex items-center gap-1.5 bg-card/80 border border-border/80 px-3 py-1 rounded-full shadow-xs">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {isEn ? "Verified Reviews" : "সরেজমিনে যাচাইকৃত তথ্য"}
              </span>
              <span className="flex items-center gap-1.5 bg-card/80 border border-border/80 px-3 py-1 rounded-full shadow-xs">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                {isEn ? "Special Member Discount" : "মেম্বারদের জন্য বিশেষ ছাড়"}
              </span>
              <span className="flex items-center gap-1.5 bg-card/80 border border-border/80 px-3 py-1 rounded-full shadow-xs">
                <BookOpen className="h-4 w-4 text-cyan-500" />
                {isEn ? "24/7 Helpline" : "২৪/৭ জরুরি হটলাইন"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Featured Flagship Article Spotlight */}
        {featuredPost && (
          <section aria-labelledby="featured-article-heading">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2
                id="featured-article-heading"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                {isEn ? "Featured Guide" : "সেরা আলোচিত স্বাস্থ্য গাইড"}
              </h2>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card shadow-lg shadow-primary/5 transition-all duration-300 hover:border-primary/50">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Image Banner */}
                <div className="relative aspect-16/10 lg:aspect-auto lg:col-span-6 w-full overflow-hidden bg-muted">
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.coverImageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground font-bold shadow-xs">
                      {isEn ? featuredPost.categoryNameEn : featuredPost.categoryNameBn}
                    </Badge>
                    <Badge variant="outline" className="bg-black/60 text-white border-white/20">
                      {isEn ? "Top Ranked" : "শীর্ষ আলোচিত"}
                    </Badge>
                  </div>
                </div>

                {/* Body Content */}
                <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatArticleDate(featuredPost.publishedDate, locale)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {isEn ? featuredPost.readTimeEn : featuredPost.readTimeBn}
                      </span>
                    </div>

                    <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        {isEn ? featuredPost.titleEn : featuredPost.titleBn}
                      </Link>
                    </h3>

                    <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed">
                      {isEn ? featuredPost.excerptEn : featuredPost.excerptBn}
                    </p>

                    {/* Quick highlights list */}
                    {featuredPost.keyHighlightsBn && (
                      <ul className="space-y-1.5 text-xs text-foreground/85 pt-1">
                        {featuredPost.keyHighlightsBn.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm hover:bg-primary/90 transition-all group"
                    >
                      <span>{isEn ? "Read Complete Review" : "সম্পূর্ণ রিভিউ পড়ুন"}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <span className="text-xs text-muted-foreground font-medium">
                      {isEn ? "10 Top Facilities" : "১০টি শীর্ষ প্রতিষ্ঠান"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Posts with Live Search & Filter */}
        <section aria-labelledby="all-articles-heading" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="all-articles-heading"
                className="font-heading text-2xl font-bold text-foreground"
              >
                {isEn ? "All Blog Articles" : "সকল স্বাস্থ্য ও হাসপাতাল ব্লগ"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {isEn
                  ? "Browse through our collection of verified regional healthcare guides."
                  : "আপনার প্রয়োজনীয় স্বাস্থ্য তথ্য ও হাসপাতাল গাইড সহজে খুঁজুন।"}
              </p>
            </div>
          </div>

          <BlogSearchFilter
            initialPosts={allPosts}
            categories={BLOG_CATEGORIES}
            filterPills={BLOG_FILTER_PILLS}
            locale={locale}
          />
        </section>
      </div>
    </div>
  );
}
