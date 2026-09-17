import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Edit3, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/types/blog";
import { formatArticleDate } from "@/lib/dateUtils";

interface BlogMobileCardProps {
  post: BlogPost;
  isEn: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
}

export function BlogMobileCard({
  post,
  isEn,
  onEdit,
  onDelete,
}: BlogMobileCardProps) {
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
          {formatArticleDate(post.publishedDate, isEn ? "en" : "bn")}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {post.readTimeBn}
        </span>
      </div>

      <div className="flex items-center justify-end gap-1.5 pt-1 border-t">
        <Link
          href={`/blog/${post.slug}`}
          target="_blank"
          className="h-8 px-2.5 inline-flex items-center justify-center rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 gap-1 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>{isEn ? "View" : "দেখুন"}</span>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(post)}
          className="h-8 text-xs gap-1"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>{isEn ? "Edit" : "এডিট"}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(post)}
          className="h-8 text-xs text-destructive hover:bg-destructive/10 gap-1"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{isEn ? "Delete" : "মুছুন"}</span>
        </Button>
      </div>
    </div>
  );
}
