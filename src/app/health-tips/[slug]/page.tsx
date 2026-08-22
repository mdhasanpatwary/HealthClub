import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import {
  getHealthTipBySlugAction,
  getAllHealthTipsAction,
} from "@/app/actions/healthTipsAdminActions";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  User,
  Calendar,
  ChevronLeft,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { ArticleShareBar } from "./components/ArticleShareBar";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";
import { SITE_URL } from "@/lib/siteConfig";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getHealthTipBySlugAction(slug);
  if (!article) return { title: "Article Not Found - Health Club" };

  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const title = isEn ? `${article.titleEn} - Health Club` : `${article.titleBn} - হেলথ ক্লাব`;
  const description = isEn ? article.excerptEn : article.excerptBn;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/health-tips/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/health-tips/${article.slug}`,
      type: "article",
      images: [
        {
          url: `${SITE_URL}/icon.png`,
          width: 512,
          height: 512,
          alt: title,
        },
      ],
    },
    keywords: [
      article.titleBn,
      article.titleEn,
      article.categoryNameBn,
      article.categoryNameEn,
      "স্বাস্থ্য টিপস",
      "ডাক্তারের পরামর্শ",
      "Health Club tips",
    ],
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getHealthTipBySlugAction(slug);
  if (!article) notFound();

  const allArticles = await getAllHealthTipsAction();
  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => {
      const aMatch = a.category === article.category ? 1 : 0;
      const bMatch = b.category === article.category ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 2);

  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": isEn ? "Home" : "হোম",
          "item": SITE_URL,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": isEn ? "Health Tips" : "স্বাস্থ্য টিপস",
          "item": `${SITE_URL}/health-tips`,
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": isEn ? article.titleEn : article.titleBn,
          "item": `${SITE_URL}/health-tips/${article.slug}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "headline": isEn ? article.titleEn : article.titleBn,
      "description": isEn ? article.excerptEn : article.excerptBn,
      "url": `${SITE_URL}/health-tips/${article.slug}`,
      "mainEntityOfPage": `${SITE_URL}/health-tips/${article.slug}`,
      "author": {
        "@type": "Person",
        "name": isEn ? article.authorEn : article.authorBn,
        "jobTitle": "Physician / Medical Specialist",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Health Club",
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/icon.png`,
        },
      },
      "datePublished": "2026-08-10",
      "dateModified": "2026-08-15",
    },
  ];

  const contentBlocks = isEn ? article.contentEn : article.contentBn;
  const keyTakeaways = isEn ? article.keyTakeawaysEn : article.keyTakeawaysBn;

  return (
    <div className="bg-background min-h-screen pb-16">
      <JsonLd data={jsonLdData} />

      {/* Header Container */}
      <div className="border-b border-border/60 bg-muted/20 py-6 sm:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Back button */}
          <Link
            href="/health-tips"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{isEn ? "Back to all guides" : "সব টিপসে ফিরে যান"}</span>
          </Link>

          {/* Category & Read Time */}
          <div className="flex items-center gap-3 pt-1">
            <Badge className="bg-primary text-white font-bold text-xs">
              {isEn ? article.categoryNameEn : article.categoryNameBn}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>{isEn ? article.readTimeEn : article.readTimeBn}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <span>{article.publishedDate}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-secondary dark:text-white leading-tight">
            {isEn ? article.titleEn : article.titleBn}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-foreground">
                {isEn ? article.authorEn : article.authorBn}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {isEn ? "Medically Reviewed & Verified" : "চিকিৎসক দ্বারা পর্যালোচিত ও প্রকাশিত"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Takeaways Box */}
        <div className="p-5 sm:p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-base font-heading">
            <Sparkles className="h-4 w-4" />
            <span>{isEn ? "Key Takeaways & Quick Advice" : "একনজরে জরুরি পরামর্শ"}</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-foreground/90">
            {keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Article Body */}
        <article className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-secondary/90 dark:text-slate-200">
          {contentBlocks.map((block, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-card border border-border/70 shadow-xs space-y-2 whitespace-pre-line"
            >
              {block}
            </div>
          ))}
        </article>

        {/* Share Bar */}
        <div className="pt-4 border-t border-border/80">
          <ArticleShareBar
            title={isEn ? article.titleEn : article.titleBn}
            slug={article.slug}
          />
        </div>

        {/* Related Health Guides */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border/80">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                {isEn ? "Related Health Guides" : "সম্পর্কিত অন্যান্য স্বাস্থ্য গাইড"}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <Card
                  key={rel.slug}
                  className="border border-border/80 bg-card hover:border-primary/40 transition-all rounded-2xl group"
                >
                  <CardContent className="p-4 space-y-2.5">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                      {isEn ? rel.categoryNameEn : rel.categoryNameBn}
                    </Badge>
                    <Link href={`/health-tips/${rel.slug}`}>
                      <h4 className="font-heading font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {isEn ? rel.titleEn : rel.titleBn}
                      </h4>
                    </Link>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {isEn ? rel.excerptEn : rel.excerptBn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Specialist Doctor Call to Action */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white">
                {isEn ? "Consult Specialist Doctors" : "বিশেষজ্ঞ ডাক্তারের অ্যাপয়েন্টমেন্ট নিন"}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isEn
                  ? "Find registered specialist doctors in Feni and get member discounts on your visits."
                  : "ফেনীর সেরা কনসালট্যান্টদের চেম্বার শিডিউল দেখুন ও মেম্বার ডিসকাউন্টে সেবা গ্রহণ করুন।"}
              </p>
            </div>
          </div>
          <Link
            href="/consultants"
            className={buttonVariants({
              className: "shrink-0 w-full sm:w-auto font-bold cursor-pointer",
            })}
          >
            <span>{isEn ? "View Doctors" : "ডাক্তার তালিকা"}</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Medical Disclaimer */}
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
