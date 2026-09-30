"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Search,
  Copy,
  Check,
  User,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BlogPost } from "@/types/blog";
import { formatArticleDate } from "@/lib/dateUtils";
import { analyzeBlogPostSerp } from "@/lib/seo/serpValidator";
import { pingIndexNowForBlogAction } from "@/app/actions/blogAdminActions";
import { SITE_URL } from "@/lib/siteConfig";
import { toast } from "sonner";

interface BlogManagementCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onPreviewSeo: (post: BlogPost) => void;
}

export function BlogManagementCard({
  post,
  onEdit,
  onDelete,
  onPreviewSeo,
}: BlogManagementCardProps) {
  const [copied, setCopied] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const serpAnalysis = analyzeBlogPostSerp(post);

  const copySlug = () => {
    navigator.clipboard.writeText(`${SITE_URL}/blog/${post.slug}`);
    setCopied(true);
    toast.success("ব্লগ লিঙ্ক কপি করা হয়েছে!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleIndexNowPing = async () => {
    setIsPinging(true);
    try {
      const res = await pingIndexNowForBlogAction(post.slug);
      if (res.success) {
        toast.success(`IndexNow সফল: ${res.submittedCount}টি URL সার্চ ইঞ্জিনে পাঠানো হয়েছে!`);
      } else {
        toast.error(res.error || "IndexNow পিং করতে ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি: IndexNow পিং করা যায়নি");
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-border/70 hover:border-primary/40 transition-all duration-200 flex flex-col justify-between bg-card hover:shadow-sm">
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Top Badges & SEO Score */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="text-[11px] font-semibold">
            {post.categoryNameBn}
          </Badge>

          {/* Quick SERP Health Pill */}
          <button
            type="button"
            onClick={() => onPreviewSeo(post)}
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold border transition-colors ${
              serpAnalysis.grade === "A+" || serpAnalysis.grade === "A"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-500/40 hover:bg-amber-100 dark:hover:bg-amber-900/60"
            }`}
            title="গুগল SERP প্রিভিউ ও অডিট দেখতে ক্লিক করুন"
          >
            <Search className="h-3 w-3" />
            <span>SERP {serpAnalysis.score}%</span>
            <span className="text-[10px] font-black uppercase">
              ({serpAnalysis.grade})
            </span>
          </button>
        </div>

        {/* Title & Cover Image */}
        <div className="flex items-start gap-3 justify-between">
          <div className="space-y-1 min-w-0">
            <h4
              onClick={() => onPreviewSeo(post)}
              className="text-sm font-bold text-foreground leading-snug hover:text-primary cursor-pointer line-clamp-2"
            >
              {post.titleBn}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {post.titleEn}
            </p>
          </div>

          {post.coverImage && (
            <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0 border bg-muted">
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt || post.titleBn}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
        </div>

        {/* URL Slug with Copy */}
        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border/50 text-[11px] font-mono text-muted-foreground">
          <span className="truncate">/blog/{post.slug}</span>
          <button
            type="button"
            onClick={copySlug}
            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            title="লিঙ্ক কপি করুন"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>

        {/* SEO Metrics Bar */}
        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-0.5">
          <div className="p-1.5 rounded-lg bg-muted/30 border border-border/40">
            <div className="text-muted-foreground">টাইটেল সাইজ</div>
            <div className="font-bold text-foreground mt-0.5">
              {post.titleBn.length} অক্ষর
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-muted/30 border border-border/40">
            <div className="text-muted-foreground">সারাংশ সাইজ</div>
            <div className="font-bold text-foreground mt-0.5">
              {post.excerptBn ? `${post.excerptBn.length} অক্ষর` : "খালি"}
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-muted/30 border border-border/40">
            <div className="text-muted-foreground">FAQ স্কিমা</div>
            <div className="font-bold text-foreground mt-0.5">
              {post.faqs?.length ? `${post.faqs.length}টি প্রশ্ন` : "নেই"}
            </div>
          </div>
        </div>

        {/* Metadata: Author, Date, Reading Time */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
          <span className="flex items-center gap-1 truncate max-w-[140px]">
            <User className="h-3 w-3 text-primary" />
            <span className="truncate">{post.author?.nameBn || "টিম"}</span>
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatArticleDate(post.publishedDate)}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTimeBn}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 py-2.5 bg-muted/20 border-t border-border flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreviewSeo(post)}
            className="h-8 text-xs font-semibold gap-1.5 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
          >
            <Search className="h-3.5 w-3.5" />
            <span>SERP প্রিভিউ</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleIndexNowPing}
            disabled={isPinging}
            className="h-8 w-8 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40"
            title="IndexNow দিয়ে সার্চ ইঞ্জিনে তাত্ক্ষণিক নোটিফিকেশন পাঠান"
          >
            {isPinging ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
            title="লাইভ আর্টিকেল দেখুন"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(post)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="সম্পাদনা করুন"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(post)}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            title="মুছে ফেলুন"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
