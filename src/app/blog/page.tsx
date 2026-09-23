import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { BLOG_FILTER_PILLS } from "@/data/blog/blogCategories";
import { getAllBlogPostsAction } from "@/app/actions/blogAdminActions";
import { BlogSearchFilter } from "./components/BlogSearchFilter";
import { BlogCard } from "./components/BlogCard";
import {
  BookOpen,
  Hospital,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { toBanglaNums } from "@/lib/utils";
import {
  paginateBlogPosts,
  DEFAULT_BLOG_PAGE_SIZE,
  getPostFacilityMeta,
} from "./utils/blogPagination";

export const revalidate = 86400; // 24-hour Incremental Static Regeneration (ISR)

interface BlogPageProps {
  searchParams?: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const { page, category, search } = (await searchParams) || {};
  const isEn = false;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const pageSuffix = currentPage > 1 ? ` (পৃষ্ঠা ${toBanglaNums(currentPage)})` : "";
  const pageSuffixEn = currentPage > 1 ? ` (Page ${currentPage})` : "";

  const ogTitle = isEn
    ? `Healthcare Blog & Feni Hospital Review Directory${pageSuffixEn} | Health Club`
    : `স্বাস্থ্যসেবা ব্লগ ও ফেনী হাসপাতাল গাইড${pageSuffix} | হেলথ ক্লাব`;
  const ogDesc = isEn
    ? "Trusted healthcare reviews, hospital directories in Feni, emergency contacts, and medical cost-saving guides."
    : "ফেনীর সেরা হাসপাতাল ও স্বাস্থ্যসেবা প্রতিষ্ঠানের বিস্তারিত রিভিউ, জরুরি অ্যাম্বুলেন্স তালিকা ও সাশ্রয়ী চিকিৎসার নির্ভরযোগ্য গাইড।";

  const queryParams = new URLSearchParams();
  if (currentPage > 1) queryParams.set("page", String(currentPage));
  if (category && category !== "all") queryParams.set("category", category);
  const canonicalUrl = `${SITE_URL}/blog${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  return {
    title: isEn
      ? { absolute: `Health Care Blog & Feni Hospital Reviews${pageSuffixEn} | Health Club` }
      : `স্বাস্থ্যসেবা ব্লগ ও ফেনী হাসপাতাল রিভিউ গাইড${pageSuffix}`,
    description: ogDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !search,
      follow: true,
      googleBot: {
        index: !search,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonicalUrl,
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

function BlogHeroSection({ isEn = false }: { isEn?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pt-6 pb-8 sm:pt-12 sm:pb-16 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Hospital className="h-4 w-4" />
            <span>
              {isEn ? "Health Club Editorial & Guides" : "হেলথ ক্লাব এডিটোরিয়াল ও গাইড"}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {isEn ? (
              <>
                Healthcare Blog & <span className="text-primary">Hospital Directory</span>
              </>
            ) : (
              <>
                স্বাস্থ্যসেবা ব্লগ ও <span className="text-primary">হাসপাতাল গাইড</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {isEn
              ? "Authoritative guides on hospitals, verified specialist doctor chambers, emergency contacts, and member discount benefits in Feni."
              : "ফেনী ও পার্শ্ববর্তী অঞ্চলের সেরা সরকারি-বেসরকারি হাসপাতালের পূর্ণাঙ্গ রিভিউ, জরুরি অ্যাম্বুলেন্স তালিকা ও হেলথ কার্ডে সাশ্রয়ী চিকিৎসার উপায়।"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 sm:pt-3 text-xs sm:text-sm text-foreground/90 font-medium">
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
  );
}


export default async function BlogPage({ searchParams }: BlogPageProps) {
  const isEn = false;
  const locale: Locale = "bn";

  const resolvedSearchParams = (await searchParams) || {};
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || "1", 10) || 1);
  const selectedCategory = resolvedSearchParams.category?.trim() || "all";
  const searchQuery = resolvedSearchParams.search?.trim() || "";

  const allPosts = await getAllBlogPostsAction();
  const paginatedResult = paginateBlogPosts(allPosts, {
    page: currentPage,
    pageSize: DEFAULT_BLOG_PAGE_SIZE,
    category: selectedCategory,
    search: searchQuery,
    filterPills: BLOG_FILTER_PILLS,
  });

  const cardPosts = paginatedResult.posts.map((post) => {
    const facilityMeta = getPostFacilityMeta(post);
    return {
      slug: post.slug,
      titleBn: post.titleBn,
      titleEn: post.titleEn,
      excerptBn: post.excerptBn,
      excerptEn: post.excerptEn,
      category: post.category,
      categoryNameBn: post.categoryNameBn,
      categoryNameEn: post.categoryNameEn,
      readTimeBn: post.readTimeBn,
      readTimeEn: post.readTimeEn,
      publishedDate: post.publishedDate,
      coverImage: post.coverImage,
      coverImageAlt: post.coverImageAlt || post.titleBn,
      author: {
        nameBn: post.author?.nameBn || "হেলথ ক্লাব টিম",
        nameEn: post.author?.nameEn || "Health Club Team",
      },
      hospitalCount: post.hospitals?.length || 0,
      facilityCount: facilityMeta.count,
      facilityLabelBn: facilityMeta.labelBn,
      facilityLabelEn: facilityMeta.labelEn,
    };
  });

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
        description: isEn
          ? "Trusted healthcare reviews, hospital directories in Feni, emergency contacts, and medical cost-saving guides."
          : "ফেনীর সেরা হাসপাতাল ও স্বাস্থ্যসেবা প্রতিষ্ঠানের বিস্তারিত রিভিউ, জরুরি অ্যাম্বুলেন্স তালিকা ও সাশ্রয়ী চিকিৎসার নির্ভরযোগ্য গাইড।",
        inLanguage: isEn ? "en-US" : "bn-BD",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          name: "Health Club (হেলথ ক্লাব)",
          url: SITE_URL,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <JsonLd data={jsonLdData} />

      {/* Header / Hero Section - 100% synchronous, instant FCP */}
      <BlogHeroSection isEn={isEn} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <section
          aria-labelledby="all-articles-heading"
          className="space-y-6 [content-visibility:auto] [contain-intrinsic-size:1200px]"
        >
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
            totalItems={paginatedResult.totalItems}
            totalPages={paginatedResult.totalPages}
            currentPage={paginatedResult.currentPage}
            pageSize={paginatedResult.pageSize}
            currentCategory={selectedCategory}
            currentSearch={searchQuery}
            filterPills={BLOG_FILTER_PILLS}
            locale={locale}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardPosts.map((post, idx) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  locale={locale}
                  priority={idx === 0}
                />
              ))}
            </div>
          </BlogSearchFilter>
        </section>
      </div>
    </div>
  );
}
