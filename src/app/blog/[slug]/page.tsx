import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import {
  getAllBlogPostCardsAction,
  getAllBlogSlugsAction,
  getBlogPostBySlugAction,
} from "@/app/actions/blogAdminActions";
import { BlogPostCardItem } from "@/types/blog";
import { BlogPostDetailView } from "../components/BlogPostDetailView";
import { generateBlogJsonLd } from "../utils/blogJsonLd";
import { SITE_URL } from "@/lib/siteConfig";
import { getArticleIsoDate } from "@/lib/dateUtils";
import { getBlogDoctorDepartment } from "@/data/blog/departmentBlogMapping";
import { getDoctorsByDepartmentAction } from "@/app/actions/doctorActions";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; // 24-hour Incremental Static Regeneration (ISR)

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugsAction();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlugAction(slug);

  if (!post) {
    return {
      title: "নিবন্ধ পাওয়া যায়নি - হেলথ ক্লাব",
    };
  }

  // If titleBn does not have English letters, append primary English keywords from titleEn
  const hasEnglishInTitle = /[a-zA-Z]{3,}/.test(post.titleBn);
  const primaryEnPart = (post.titleEn || "").split(" - ")[0].split(":")[0].trim();
  const pageTitle = hasEnglishInTitle
    ? post.titleBn
    : `${post.titleBn} (${primaryEnPart})`;
  const description = post.excerptBn;
  const fullBrandTitle = `${pageTitle} | হেলথ ক্লাব`;

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

  const allKeywords = Array.from(
    new Set([
      ...(post.metaKeywords || []),
      ...(post.tags || []),
      post.titleEn,
      post.categoryNameEn,
    ])
  ).filter(Boolean);

  return {
    title: pageTitle,
    description,
    keywords: allKeywords,
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
      locale: "bn_BD",
      alternateLocale: ["en_US"],
      publishedTime: getArticleIsoDate(post.publishedDate),
      modifiedTime: getArticleIsoDate(post.modifiedDate),
      siteName: "হেলথ ক্লাব (Health Club)",
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

  const title = post.titleBn;
  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const allCards = await getAllBlogPostCardsAction();

  // Prioritize curated relatedSlugs, then same category, then general posts
  let relatedPosts: BlogPostCardItem[] = [];
  if (post.relatedSlugs && post.relatedSlugs.length > 0) {
    const curated = post.relatedSlugs
      .map((slugStr) => allCards.find((p) => p.slug.toLowerCase() === slugStr.toLowerCase()))
      .filter((p): p is BlogPostCardItem => !!p && p.slug !== post.slug);

    if (curated.length >= 3) {
      relatedPosts = curated.slice(0, 3);
    } else {
      const remainingSameCat = allCards.filter(
        (p) => p.slug !== post.slug && p.category === post.category && !curated.some((c) => c.slug === p.slug)
      );
      const remainingOthers = allCards.filter(
        (p) => p.slug !== post.slug && p.category !== post.category && !curated.some((c) => c.slug === p.slug)
      );
      relatedPosts = [...curated, ...remainingSameCat, ...remainingOthers].slice(0, 3);
    }
  } else {
    const sameCat = allCards.filter((p) => p.slug !== post.slug && p.category === post.category);
    const others = allCards.filter((p) => p.slug !== post.slug && p.category !== post.category);
    relatedPosts = [...sameCat, ...others].slice(0, 3);
  }

  // Schema.org Structured Data
  const jsonLdData = generateBlogJsonLd(post, title, pageUrl, relatedPosts);

  // Fetch live active doctors for this department to augment blog guides
  const targetDepartment = getBlogDoctorDepartment(
    post.slug,
    post.doctorGroups?.[0]?.department
  );
  const liveDoctors = await getDoctorsByDepartmentAction(targetDepartment);

  return (
    <>
      <JsonLd data={jsonLdData} />
      <BlogPostDetailView
        post={post}
        pageUrl={pageUrl}
        relatedPosts={relatedPosts}
        liveDoctors={liveDoctors}
        liveDepartment={targetDepartment}
      />
    </>
  );
}
