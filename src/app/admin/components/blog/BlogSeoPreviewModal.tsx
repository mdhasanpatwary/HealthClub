"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  ExternalLink,
  Edit3,
  FileCheck,
  Eye,
} from "lucide-react";
import { BlogPost } from "@/types/blog";
import { analyzeBlogPostSerp } from "@/lib/seo/serpValidator";
import { GoogleSerpSimulator } from "./seo/GoogleSerpSimulator";
import { SerpAuditChecklist } from "./seo/SerpAuditChecklist";

interface BlogSeoPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Partial<BlogPost> | null;
  onEdit?: (post: BlogPost) => void;
}

export function BlogSeoPreviewModal({
  open,
  onOpenChange,
  post,
  onEdit,
}: BlogSeoPreviewModalProps) {
  const [activeLang, setActiveLang] = useState<"bn" | "en">("bn");
  const [activeTab, setActiveTab] = useState<"preview" | "audit">("preview");

  const analysis = useMemo(() => {
    return analyzeBlogPostSerp(post);
  }, [post]);

  if (!post) return null;

  const currentTitleMetric =
    activeLang === "bn" ? analysis.titleBnMetric : analysis.titleEnMetric;
  const currentDescMetric =
    activeLang === "bn" ? analysis.descBnMetric : analysis.descEnMetric;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Search className="h-4 w-4" />
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold">
                  গুগল SERP প্রিভিউ ও টেকনিক্যাল এসইও ভ্যালিডেটর
                </DialogTitle>
                <Badge
                  variant="outline"
                  className={`text-[11px] font-black px-2 py-0.5 ${
                    analysis.grade === "A+" || analysis.grade === "A"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                  }`}
                >
                  SERP Score: {analysis.score}% ({analysis.grade})
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                গুগল সার্চ রেজাল্টে মোবাইল ও ডেস্কটপে এই আর্টিকেলটি কীভাবে প্রদর্শিত হবে এবং টেকনিক্যাল র‍্যাংকিং ফ্যাক্টরসমূহ যাচাই করুন।
              </DialogDescription>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {post.slug && (
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="h-8 px-3 inline-flex items-center justify-center rounded-lg text-xs font-semibold border border-input bg-background hover:bg-muted gap-1.5 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>লাইভ পেজ</span>
                </Link>
              )}
              {onEdit && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    onOpenChange(false);
                    onEdit(post as BlogPost);
                  }}
                  className="h-8 text-xs font-bold gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>এডিট করুন</span>
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Main Content Area */}
        <div className="py-2 space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "preview" | "audit")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full max-w-sm h-9 bg-muted/60 p-1 mb-4">
              <TabsTrigger value="preview" className="text-xs font-bold gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>গুগল SERP সিমুলেটর</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="text-xs font-bold gap-1.5">
                <FileCheck className="h-3.5 w-3.5" />
                <span>টেকনিক্যাল ভ্যালিডেটর ({analysis.rules.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4 m-0">
              <GoogleSerpSimulator
                post={post}
                titleMetric={currentTitleMetric}
                descMetric={currentDescMetric}
                activeLang={activeLang}
                onLangChange={setActiveLang}
              />
            </TabsContent>

            <TabsContent value="audit" className="space-y-4 m-0">
              <SerpAuditChecklist
                analysis={analysis}
                titleMetric={currentTitleMetric}
                descMetric={currentDescMetric}
                activeLang={activeLang}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
