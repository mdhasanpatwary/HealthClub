import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Edit3, Trash2 } from "lucide-react";
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

interface BlogTableProps {
  posts: BlogPost[];
  isEn: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
}

export function BlogTable({ posts, isEn, onEdit, onDelete }: BlogTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="text-xs">{isEn ? "Article" : "আর্টিকেল"}</TableHead>
            <TableHead className="text-xs">{isEn ? "Category" : "ক্যাটাগরি"}</TableHead>
            <TableHead className="text-xs">{isEn ? "Author" : "লেখক"}</TableHead>
            <TableHead className="text-xs">{isEn ? "Date" : "তারিখ"}</TableHead>
            <TableHead className="text-xs text-right">{isEn ? "Actions" : "অ্যাকশন"}</TableHead>
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
                {formatArticleDate(post.publishedDate, isEn ? "en" : "bn")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-primary hover:bg-muted transition-colors"
                    title={isEn ? "View live article" : "লাইভ আর্টিকেল দেখুন"}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(post)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title={isEn ? "Edit article" : "আর্টিকেল এডিট করুন"}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(post)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    title={isEn ? "Delete article" : "আর্টিকেল মুছে ফেলুন"}
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
