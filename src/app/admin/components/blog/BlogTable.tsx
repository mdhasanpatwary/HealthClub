"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Edit3, Trash2, Search, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlogPost } from "@/types/blog";
import { formatArticleDate } from "@/lib/dateUtils";
import { pingIndexNowForBlogAction } from "@/app/actions/blogAdminActions";
import { toast } from "sonner";

interface BlogTableProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onPreviewSeo?: (post: BlogPost) => void;
}

export function BlogTable({ posts, onEdit, onDelete, onPreviewSeo }: BlogTableProps) {
  const [pingingSlug, setPingingSlug] = useState<string | null>(null);

  const handlePingIndexNow = async (post: BlogPost) => {
    setPingingSlug(post.slug);
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
      setPingingSlug(null);
    }
  };
  return (
    <div className="hidden md:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="text-xs">আর্টিকেল</TableHead>
            <TableHead className="text-xs">ক্যাটাগরি</TableHead>
            <TableHead className="text-xs">লেখক</TableHead>
            <TableHead className="text-xs">তারিখ</TableHead>
            <TableHead className="text-xs text-right">অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.slug} className="hover:bg-muted/30">
              <TableCell className="max-w-md py-3">
                <div className="flex items-center gap-3">
                  {post.coverImage && (
                    <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border">
                      <Image
                        src={post.coverImage}
                        alt={post.titleBn}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      {post.titleBn}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">
                      /blog/{post.slug}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[11px]">
                  {post.categoryNameBn}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {post.author?.nameBn || "টিম"}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {formatArticleDate(post.publishedDate)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {onPreviewSeo && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPreviewSeo(post)}
                      className="h-8 w-8 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      title="গুগল SERP প্রিভিউ ও এসইও অডিট"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePingIndexNow(post)}
                    disabled={pingingSlug === post.slug}
                    className="h-8 w-8 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                    title="IndexNow দিয়ে সার্চ ইঞ্জিনে (Bing/Yandex) তাত্ক্ষণিক নোটিফিকেশন পাঠান"
                  >
                    {pingingSlug === post.slug ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-primary hover:bg-muted transition-colors"
                    title="লাইভ আর্টিকেল দেখুন"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(post)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="আর্টিকেল এডিট করুন"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(post)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    title="আর্টিকেল মুছে ফেলুন"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
