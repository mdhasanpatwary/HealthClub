import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Edit3, Trash2, Calendar, Clock, Search, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/types/blog";
import { formatArticleDate } from "@/lib/dateUtils";
import { pingIndexNowForBlogAction } from "@/app/actions/blogAdminActions";
import { toast } from "sonner";

interface BlogMobileCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onPreviewSeo?: (post: BlogPost) => void;
}

export function BlogMobileCard({
  post,
  onEdit,
  onDelete,
  onPreviewSeo,
}: BlogMobileCardProps) {
  const [isPinging, setIsPinging] = useState(false);

  const handlePingIndexNow = async () => {
    setIsPinging(true);
    try {
      const res = await pingIndexNowForBlogAction(post.slug);
      if (res.success) {
        toast.success(`IndexNow সফল: ${res.submittedCount}টি URL পাঠানো হয়েছে!`);
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
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <Badge variant="secondary" className="text-[10px] font-medium">
            {post.categoryNameBn}
          </Badge>
          <h4 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
            {post.titleBn}
          </h4>
          <p className="text-[11px] text-muted-foreground font-mono">
            /blog/{post.slug}
          </p>
        </div>
        {post.coverImage && (
          <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border">
            <Image
              src={post.coverImage}
              alt={post.titleBn}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatArticleDate(post.publishedDate)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {post.readTimeBn}
        </span>
      </div>

      <div className="flex items-center justify-end gap-1.5 pt-1 border-t">
        {onPreviewSeo && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreviewSeo(post)}
            className="h-8 px-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 gap-1"
          >
            <Search className="h-3 w-3" />
            <span>SERP</span>
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePingIndexNow}
          disabled={isPinging}
          className="h-8 px-2 text-xs font-semibold text-sky-600 dark:text-sky-400 border-sky-500/30 hover:bg-sky-50 dark:hover:bg-sky-950/40 gap-1"
          title="IndexNow দিয়ে সার্চ ইঞ্জিনে নোটিফিকেশন পাঠান"
        >
          {isPinging ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Send className="h-3 w-3" />
          )}
          <span>ইনডেক্স</span>
        </Button>
        <Link
          href={`/blog/${post.slug}`}
          target="_blank"
          className="h-8 px-2.5 inline-flex items-center justify-center rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 gap-1 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>দেখুন</span>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(post)}
          className="h-8 text-xs gap-1"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>এডিট</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(post)}
          className="h-8 text-xs text-destructive hover:bg-destructive/10 gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>মুছুন</span>
        </Button>
      </div>
    </div>
  );
}
