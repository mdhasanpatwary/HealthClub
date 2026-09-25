import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogPostCardItem } from "@/types/blog";
import { toBanglaNums } from "@/lib/utils";
import { formatArticleDate } from "@/lib/dateUtils";

interface BlogCardProps {
  post: BlogPostCardItem;
  priority?: boolean;
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const title = post.titleBn;
  const excerpt = post.excerptBn;
  const categoryName = post.categoryNameBn;
  const readTime = post.readTimeBn;
  const publishedDate = formatArticleDate(post.publishedDate);
  const facilityCount = post.facilityCount ?? post.hospitalCount ?? 0;
  const facilityLabel = post.facilityLabelBn || "প্রতিষ্ঠান";

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Thumbnail Banner */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-muted">
        <Image
          src={post.coverImage}
          alt={post.coverImageAlt || title}
          fill
          priority={priority}
          quality={60}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-primary/95 text-primary-foreground font-semibold shadow-xs backdrop-blur-xs">
            {categoryName}
          </Badge>
        </div>

        {/* Read Time Overlay */}
        <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1.5 text-xs text-white/90 font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
          <Clock className="h-3 w-3" />
          <span>{readTime}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-4">
        <div className="space-y-2.5">
          {/* Published Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {publishedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-primary font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              {post.author.nameBn}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`} prefetch={false} className="focus:outline-hidden">
              <span className="absolute inset-0" aria-hidden="true" />
              {title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </div>

        {/* Action Footer */}
        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
          <span className="flex items-center gap-1 group-hover:gap-2 transition-all">
            সম্পূর্ণ গাইড পড়ুন
            <ArrowRight className="h-3.5 w-3.5" />
          </span>

          {facilityCount > 0 && (
            <span className="text-[11px] font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              {`${toBanglaNums(facilityCount)}টি ${facilityLabel}`}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
