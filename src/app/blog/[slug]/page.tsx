import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { getAllBlogPostsAction, getBlogPostBySlugAction } from "@/app/actions/blogAdminActions";
import { BlogArticleHeader } from "../components/BlogArticleHeader";
import { BlogQuickAnswer } from "../components/BlogQuickAnswer";
import { BlogSidebar } from "../components/BlogSidebar";
import { BlogMembershipBanner } from "../components/BlogMembershipBanner";
import { DoctorSpecialtySection } from "../components/DoctorSpecialtySection";
import { DoctorChamberHubs } from "../components/DoctorChamberHubs";
import { DoctorBookingGuide } from "../components/DoctorBookingGuide";
import { BlogSpecializedSections } from "../components/BlogSpecializedSections";
import { generateBlogJsonLd } from "../utils/blogJsonLd";

import { BlogFAQSection } from "../components/BlogFAQSection";
import { BlogShareBar } from "../components/BlogShareBar";
import { BlogCard } from "../components/BlogCard";
import { ChevronLeft, Phone, Siren } from "lucide-react";
import { SITE_URL } from "@/lib/siteConfig";
import { getArticleIsoDate } from "@/lib/dateUtils";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPostsAction();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlugAction(slug);
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

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

  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const title = isEn ? post.titleEn : post.titleBn;
  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const allPosts = await getAllBlogPostsAction();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Schema.org Structured Data
  const jsonLdData = generateBlogJsonLd(post, title, pageUrl, isEn);

  return (
    <div className="min-h-screen bg-background pb-16">
      <JsonLd data={jsonLdData} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{isEn ? "Back to Blog" : "সকল ব্লগ নিবন্ধ"}</span>
          </Link>

          <ol className="hidden md:flex items-center gap-2 list-none p-0 m-0">
            <li>
              <Link href="/" className="hover:text-foreground">
                {isEn ? "Home" : "হোম"}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-foreground">
                {isEn ? "Blog" : "ব্লগ"}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium truncate max-w-xs" aria-current="page">
              {title}
            </li>
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-12">
        <article>
          {/* Content Layout: 8 cols main, 4 cols sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-8 space-y-10 min-w-0">
              {/* Article Header (Title, Author, Highlights) */}
              <BlogArticleHeader post={post} pageUrl={pageUrl} locale={locale} />

              {/* AEO Quick Answer / AI Decision Summary */}
              <BlogQuickAnswer post={post} locale={locale} />

              {/* Overview / Introduction */}
              <section id="overview" className="scroll-mt-24 space-y-4">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                  {isEn ? "1. Healthcare Landscape in Feni" : "১. ফেনী জেলার স্বাস্থ্যসেবা ও পটভূমি"}
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed">
                  {post.introParagraphsBn.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </section>

            {/* Doctor Specialty Sections */}
            {post.doctorGroups && post.doctorGroups.length > 0 && (
              <DoctorSpecialtySection
                doctorGroups={post.doctorGroups}
                locale={locale}
              />
            )}

            {/* Doctor Chamber Hubs */}
            {post.chamberHubsBn && post.chamberHubsBn.length > 0 && (
              <DoctorChamberHubs hubs={post.chamberHubsBn} locale={locale} />
            )}

            {/* Doctor Serial Booking Guide */}
            {post.bookingGuideBn && (
              <DoctorBookingGuide guide={post.bookingGuideBn} locale={locale} />
            )}

            {/* Specialized Reviews, Comparison Matrix & Pricing Guides */}
            <BlogSpecializedSections post={post} locale={locale} />

            {/* Selection Guide */}
            {post.selectionGuideBn && (
              <section id="selection-guide" className="scroll-mt-24 space-y-5">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                  {(post.diagnosticCenters && post.diagnosticCenters.length > 0) ||
                  (post.dentalClinics && post.dentalClinics.length > 0) ||
                  (post.physiotherapyCenters && post.physiotherapyCenters.length > 0)
                    ? "৫."
                    : "৪."}{" "}
                  {post.selectionGuideBn.titleBn}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.selectionGuideBn.pointsBn.map((pt, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-border/80 bg-card p-5 space-y-2"
                    >
                      <h3 className="font-heading text-base font-bold text-primary flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span>{pt.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {pt.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Health Club Member Discount Banner */}
            <BlogMembershipBanner locale={locale} />

            {/* Emergency Hotline Directory */}
            {post.emergencyDirectoryBn && (
              <section id="emergency-directory" className="scroll-mt-24 space-y-4">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <Siren className="h-5 w-5" />
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                    ৫. {post.emergencyDirectoryBn.titleBn}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {post.emergencyDirectoryBn.services.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <span className="font-bold text-xs sm:text-sm text-foreground block truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground block truncate">
                          {item.note}
                        </span>
                      </div>
                      <a
                        href={`tel:${item.phone.replace(/[^0-9]/g, "")}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700 transition-colors shrink-0"
                      >
                        <Phone className="h-3 w-3" />
                        <span>{item.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ Accordion */}
            <BlogFAQSection faqs={post.faqs} locale={locale} />

            {/* Bottom Share Bar */}
            <div className="p-5 rounded-2xl border border-border/70 bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-medium text-foreground">
                {isEn
                  ? "Found this healthcare guide helpful? Share it with family & friends!"
                  : "তথ্যটি প্রয়োজনীয় মনে হলে পরিবার ও পরিচিতজনদের সাথে শেয়ার করুন!"}
              </span>
              <BlogShareBar url={pageUrl} title={title} locale={locale} />
            </div>
          </div>

          {/* Sticky Sidebar */}
          <BlogSidebar
            hospitals={post.hospitals}
            doctorGroups={post.doctorGroups}
            diagnosticCenters={post.diagnosticCenters}
            dentalClinics={post.dentalClinics}
            physiotherapyCenters={post.physiotherapyCenters}
            hasMaternityPricing={!!post.maternityCarePricingBn}
            hasCardiacPricing={!!post.cardiacCarePricingBn}
            locale={locale}
          />
        </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <aside aria-label={isEn ? "Related Healthcare Guides" : "আরও প্রয়োজনীয় স্বাস্থ্য গাইড"} className="pt-10 border-t border-border/60 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-2xl font-bold text-foreground">
                {isEn ? "Related Healthcare Guides" : "আরও প্রয়োজনীয় স্বাস্থ্য গাইড"}
              </h3>
              <Link
                href="/blog"
                className="text-xs sm:text-sm font-semibold text-primary hover:underline"
              >
                {isEn ? "View all posts →" : "সকল ব্লগ দেখুন →"}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <BlogCard key={rPost.slug} post={rPost} locale={locale} />
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
