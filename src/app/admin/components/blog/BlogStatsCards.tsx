import Link from "next/link";
import { Newspaper, Layers, Sparkles, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BLOG_CATEGORIES } from "@/data/blog/blogPosts";
import { toBanglaNums } from "@/lib/utils";

interface BlogStatsCardsProps {
  totalItems: number;
}

export function BlogStatsCards({ totalItems }: BlogStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <Card className="p-3 sm:p-4 bg-muted/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              মোট ব্লগ পোস্ট
            </p>
            <h3 className="text-lg sm:text-xl font-extrabold text-foreground">
              {toBanglaNums(totalItems)}
            </h3>
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-4 bg-muted/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              মোট ক্যাটাগরি
            </p>
            <h3 className="text-lg sm:text-xl font-extrabold text-foreground">
              {toBanglaNums(BLOG_CATEGORIES.length - 1)}
            </h3>
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-4 bg-muted/40 col-span-2 sm:col-span-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              পাবলিক সাইট
            </p>
            <Link
              href="/blog"
              target="_blank"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>healthclubbd.org/blog</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
