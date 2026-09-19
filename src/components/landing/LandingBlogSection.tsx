import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn, toBanglaNums } from "@/lib/utils";
import { formatArticleDate } from "@/lib/dateUtils";
import { BlogPost } from "@/types/blog";

interface LandingBlogSectionProps {
  posts: BlogPost[];
  locale?: string;
  limit?: number;
}

export function LandingBlogSection({
  posts,
  locale = "bn",
  limit = 3,
}: LandingBlogSectionProps) {
  const isEn = locale === "en";

  if (!posts || posts.length === 0) return null;

  const displayPosts = posts.slice(0, limit);

  return (
    <section
      id="blog"
      className="py-10 sm:py-20 lg:py-28 bg-muted/40 dark:bg-slate-950/60 border-y border-border/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1.5 sm:space-y-2 text-center sm:text-left">
            <span className="section-label">
              {isEn ? "Healthcare Blog & Guides" : "স্বাস্থ্য ব্লগ ও হাসপাতাল গাইড"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary dark:text-white mt-1">
              {isEn
                ? "Feni Healthcare Reviews & Guides"
                : "ফেনীর সেরা হাসপাতাল ও স্বাস্থ্য গাইড"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              {isEn
                ? "Verified hospital reviews, specialist doctor guides, diagnostic costs, and member savings in Feni."
                : "ফেনী জেলার শীর্ষ হাসপাতাল, বিশেষজ্ঞ ডাক্তার, ডায়াগনস্টিক খরচ ও মেম্বার ডিসকাউন্টের তথ্যবহুল গাইড।"}
            </p>
          </div>

          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-primary/40 text-primary hover:bg-primary/5 shrink-0 self-center sm:self-end text-xs sm:text-sm hidden sm:inline-flex"
            )}
          >
            {isEn ? "View All Guides" : "সকল ব্লগ পড়ুন"}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayPosts.map((post) => {
            const title = isEn ? post.titleEn : post.titleBn;
            const excerpt = isEn ? post.excerptEn : post.excerptBn;
            const categoryName = isEn ? post.categoryNameEn : post.categoryNameBn;
            const readTime = isEn ? post.readTimeEn : post.readTimeBn;
            const authorName = isEn ? post.author.nameEn : post.author.nameBn;
            const dateStr = formatArticleDate(post.publishedDate, locale);

            const facilityCount =
              post.hospitals?.length ||
              post.diagnosticCenters?.length ||
              post.dentalClinics?.length ||
              post.physiotherapyCenters?.length ||
              post.doctorGroups?.reduce((acc, g) => acc + g.doctors.length, 0) ||
              0;

            return (
              <article
                key={post.slug}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Thumbnail Banner */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                  <Image
                    src={post.coverImage}
                    alt={post.coverImageAlt || title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-primary/95 text-primary-foreground font-semibold shadow-xs backdrop-blur-xs text-[11px] sm:text-xs">
                      {categoryName}
                    </Badge>
                  </div>

                  {/* Read Time Overlay */}
                  <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1.5 text-[11px] sm:text-xs text-white/90 font-medium bg-black/45 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    <Clock className="h-3 w-3" />
                    <span>{readTime}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 space-y-3">
                  <div className="space-y-2">
                    {/* Published Meta */}
                    <div className="flex items-center gap-2 sm:gap-2.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {dateStr}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-primary font-medium truncate">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{authorName}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-base sm:text-lg font-bold tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                    <span className="flex items-center gap-1 group-hover:gap-2 transition-all">
                      {isEn ? "Read Full Guide" : "সম্পূর্ণ গাইড পড়ুন"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>

                    {facilityCount > 0 && (
                      <span className="text-[11px] font-normal text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md">
                        {isEn
                          ? `${facilityCount} Listed`
                          : `${toBanglaNums(facilityCount)}টি তালিকাভুক্ত`}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <div className="pt-2 sm:hidden">
          <Link
            href="/blog"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full border-primary/40 text-primary hover:bg-primary/5 py-2.5 text-xs font-semibold justify-center flex items-center gap-1.5"
            )}
          >
            {isEn ? "View All Healthcare Articles" : "সকল স্বাস্থ্য ও হাসপাতাল ব্লগ পড়ুন"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
