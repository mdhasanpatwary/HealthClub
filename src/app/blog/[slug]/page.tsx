import { notFound } from "next/navigation";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { getAllBlogPostsAction, getBlogPostBySlugAction } from "@/app/actions/blogAdminActions";
import { BLOG_POSTS } from "@/data/blog/blogPosts";
import { BlogPostCardItem } from "@/types/blog";
import { BlogPostDetailView } from "../components/BlogPostDetailView";
import { generateBlogJsonLd } from "../utils/blogJsonLd";
import { SITE_URL } from "@/lib/siteConfig";
import { getArticleIsoDate } from "@/lib/dateUtils";

import { getPostFacilityMeta } from "../utils/blogPagination";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; // 24-hour Incremental Static Regeneration (ISR)

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlugAction(slug);
  const isEn = false;

  if (!post) {
    return {
      title: isEn ? "Article Not Found - Health Club" : "নিবন্ধ পাওয়া যায়নি - হেলথ ক্লাব",
    };
  }

  const pageTitle = isEn
    ? { absolute: `${post.titleEn} | Health Club` }
    : post.titleBn;
  const description = isEn ? post.excerptEn : post.excerptBn;
  const fullBrandTitle = isEn
    ? `${post.titleEn} | Health Club`
    : `${post.titleBn} | হেলথ ক্লাব`;

  const ogImageUrl = post.coverImage?.startsWith("http")
    ? post.coverImage
    : `${SITE_URL}${post.coverImage || "/opengraph-image.png"}`;

  const articleImages = [
    {
      url: ogImageUrl,
      width: 1200,
      height: 630,
      alt: post.coverImageAlt || fullBrandTitle,
    },
  ];

  return {
    title: pageTitle,
    description,
    keywords: post.metaKeywords,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
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
      title: fullBrandTitle,
      description,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: getArticleIsoDate(post.publishedDate),
      modifiedTime: getArticleIsoDate(post.modifiedDate),
      siteName: "হেলথ ক্লাব (Health Club)",
      locale: isEn ? "en_US" : "bn_BD",
      images: articleImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullBrandTitle,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlugAction(slug);

  if (!post) {
    notFound();
  }

  const locale: Locale = "bn";
  const isEn = false;

  const title = isEn ? post.titleEn : post.titleBn;
  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const allPosts = await getAllBlogPostsAction();

  // Prioritize curated relatedSlugs, then same category, then general posts
  let relatedPosts: typeof allPosts = [];
  if (post.relatedSlugs && post.relatedSlugs.length > 0) {
    const curated = post.relatedSlugs
      .map((slugStr) => allPosts.find((p) => p.slug.toLowerCase() === slugStr.toLowerCase()))
      .filter((p): p is (typeof allPosts)[0] => !!p && p.slug !== post.slug);

    if (curated.length >= 3) {
      relatedPosts = curated.slice(0, 3);
    } else {
      const remainingSameCat = allPosts.filter(
        (p) => p.slug !== post.slug && p.category === post.category && !curated.some((c) => c.slug === p.slug)
      );
      const remainingOthers = allPosts.filter(
        (p) => p.slug !== post.slug && p.category !== post.category && !curated.some((c) => c.slug === p.slug)
      );
      relatedPosts = [...curated, ...remainingSameCat, ...remainingOthers].slice(0, 3);
    }
  } else {
    const sameCat = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category);
    const others = allPosts.filter((p) => p.slug !== post.slug && p.category !== post.category);
    relatedPosts = [...sameCat, ...others].slice(0, 3);
  }

  // Schema.org Structured Data
  const jsonLdData = generateBlogJsonLd(post, title, pageUrl, isEn, relatedPosts);

  // Map to lightweight card items for the view to prune hundreds of kilobytes of nested data
  const cardRelatedPosts: BlogPostCardItem[] = relatedPosts.map((p) => {
    const meta = getPostFacilityMeta(p);
    return {
      slug: p.slug,
      titleBn: p.titleBn,
      titleEn: p.titleEn,
      excerptBn: p.excerptBn,
      excerptEn: p.excerptEn,
      category: p.category,
      categoryNameBn: p.categoryNameBn,
      categoryNameEn: p.categoryNameEn,
      readTimeBn: p.readTimeBn,
      readTimeEn: p.readTimeEn,
      publishedDate: p.publishedDate,
      coverImage: p.coverImage,
      coverImageAlt: p.coverImageAlt,
      author: {
        nameBn: p.author.nameBn,
        nameEn: p.author.nameEn,
      },
      hospitalCount: p.hospitals?.length ?? 0,
      facilityCount: meta.count,
      facilityLabelBn: meta.labelBn,
      facilityLabelEn: meta.labelEn,
    };
  });

  return (
    <>
      <JsonLd data={jsonLdData} />
      <BlogPostDetailView
        post={post}
        pageUrl={pageUrl}
        relatedPosts={cardRelatedPosts}
        initialLocale={locale}
      />
    </>
  );
}
