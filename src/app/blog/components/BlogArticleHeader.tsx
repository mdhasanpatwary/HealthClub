import Image from "next/image";
import { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Calendar, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { BlogShareBar } from "./BlogShareBar";
import { formatArticleDate, getArticleIsoDate } from "@/lib/dateUtils";

interface BlogArticleHeaderProps {
  post: BlogPost;
  pageUrl: string;
  locale?: string;
}

export function BlogArticleHeader({
  post,
  pageUrl,
  locale = "bn",
}: BlogArticleHeaderProps) {
  const isEn = locale === "en";
  const title = isEn ? post.titleEn : post.titleBn;

  return (
    <header className="space-y-6 w-full">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-primary text-primary-foreground font-semibold">
          {isEn ? post.categoryNameEn : post.categoryNameBn}
        </Badge>
        <Badge variant="outline" className="text-xs border-border/80">
          {isEn ? "Comprehensive Review" : "তথ্যবহুল পর্যালোচনা ২০২৬"}
        </Badge>
        <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          <span>{isEn ? "Fact-Checked & Reviewed" : "ক্লিনিক্যাল রিসার্চ টিম কর্তৃক যাচাইকৃত"}</span>
        </Badge>
      </div>

      <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2]">
        {title}
      </h1>

      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
        {isEn ? post.excerptEn : post.excerptBn}
      </p>

      {/* Meta Bar + Social Share */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-y border-border/60 py-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {isEn ? post.author.nameEn : post.author.nameBn}
          </span>
          <span>•</span>
          <time
            dateTime={getArticleIsoDate(post.publishedDate)}
            className="flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4" />
            {formatArticleDate(post.publishedDate, locale)}
          </time>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {isEn ? post.readTimeEn : post.readTimeBn}
          </span>
        </div>

        <BlogShareBar url={pageUrl} title={title} locale={locale} />
      </div>

      {/* Featured Hero Cover Image */}
      {post.coverImage && (
        <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl border border-border/80 bg-muted shadow-sm">
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt || title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}


      {/* Key Highlights Box */}
      {post.keyHighlightsBn && post.keyHighlightsBn.length > 0 && (
        <div id="key-highlights" className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 space-y-3">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{isEn ? "Article Highlights" : "এই লেখার মূল বিষয়সমূহ"}</span>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-foreground/90">
            {post.keyHighlightsBn.map((hl, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <span className="leading-snug">{hl}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
