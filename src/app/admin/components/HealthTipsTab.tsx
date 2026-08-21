"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  HealthTipArticle,
  HEALTH_CATEGORIES,
} from "@/data/healthTipsData";

import {
  getPaginatedHealthTipsAdminAction,
  deleteHealthTipAction,
} from "@/app/actions/healthTipsAdminActions";
import { exportToCsv } from "@/lib/exportUtils";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { HealthTipArticleDialog } from "./HealthTipArticleDialog";
import { Pagination } from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/useDebounce";

export function HealthTipsTab() {
  const { locale, t } = useLanguage();
  const isEn = locale === "en";

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<HealthTipArticle[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog & Delete Modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<HealthTipArticle | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingArticle, setDeletingArticle] = useState<HealthTipArticle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPaginatedHealthTipsAdminAction({
        page: currentPage,
        pageSize,
        search: debouncedSearch,
        category: selectedCategory,
      });
      setArticles(res.data);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);
    } catch {
      toast.error(isEn ? "Failed to load articles" : "আর্টিকেল লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, selectedCategory, isEn]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadArticles();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [loadArticles]);


  const confirmDelete = async () => {
    if (!deletingArticle) return;
    setDeleting(true);
    try {
      const res = await deleteHealthTipAction(deletingArticle.slug);
      if (res.success) {
        toast.success(isEn ? "Article deleted successfully!" : "আর্টিকেল সফলভাবে মুছে ফেলা হয়েছে!");
        setDeleteModalOpen(false);
        setDeletingArticle(null);
        loadArticles();
      } else {
        toast.error(res.error || (isEn ? "Failed to delete article" : "আর্টিকেল মোছা ব্যর্থ হয়েছে"));
      }
    } catch {
      toast.error(isEn ? "Error deleting article" : "সমস্যা দেখা দিয়েছে");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
          <div>
            <CardTitle className="font-heading text-lg font-bold text-secondary dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>{isEn ? "Health Tips & Medical Knowledge Blog" : "স্বাস্থ্য টিপস ও মেডিকেল ব্লগ ব্যবস্থাপনা"}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {isEn
                ? "Create, edit, and manage health guides and disease prevention tips for members."
                : "সদস্যদের সচেতনতায় স্বাস্থ্য টিপস, রোগ প্রতিরোধ নির্দেশিকা ও ডাক্তারের পরামর্শ পরিচালনা করুন।"}
            </CardDescription>
          </div>

          <Button
            onClick={() => {
              setEditingArticle(null);
              setDialogOpen(true);
            }}
            className="bg-primary hover:bg-primary-dark text-white text-xs h-9 font-bold gap-1 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{isEn ? "Write New Article" : "নতুন আর্টিকেল লিখুন"}</span>
          </Button>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Controls & Filter bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={isEn ? "Search by title, author..." : "শিরোনাম বা লেখক দিয়ে খুঁজুন..."}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 h-9 text-xs border-border bg-background"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 px-2.5 text-xs rounded-md border border-border bg-background focus:outline-none"
              >
                {HEALTH_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isEn ? c.nameEn : c.nameBn}
                  </option>
                ))}
              </select>
            </div>

            {/* CSV Export Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportToCsv(articles, "healthclub_health_articles", [
                  { header: "Slug", accessor: "slug" },
                  { header: "Title (BN)", accessor: "titleBn" },
                  { header: "Title (EN)", accessor: "titleEn" },
                  { header: "Category", accessor: "categoryNameBn" },
                  { header: "Author", accessor: "authorBn" },
                  { header: "Published Date", accessor: "publishedDate" },
                  { header: "Read Time", accessor: "readTimeBn" },
                ])
              }
              className="text-xs h-9 font-semibold gap-1.5 border-border shrink-0"
            >

              <Download className="h-3.5 w-3.5" />
              <span>{isEn ? "Export Articles" : "এক্সপোর্ট"}</span>
            </Button>
          </div>

          {/* Table Container */}
          <div className="rounded-xl border border-border overflow-hidden relative bg-card shadow-xs">
            {/* Top Loading Progress Line */}
            {loading && articles.length > 0 && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/20 z-10 overflow-hidden">
                <div className="h-full bg-primary animate-pulse w-full" />
              </div>
            )}

            <div className="overflow-x-auto min-h-[420px]">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[120px]">{isEn ? "Category" : "ক্যাটাগরি"}</TableHead>
                    <TableHead className="w-auto">{isEn ? "Article Title" : "শিরোনাম"}</TableHead>
                    <TableHead className="w-[140px] hidden sm:table-cell">{isEn ? "Author" : "লেখক"}</TableHead>
                    <TableHead className="w-[110px] hidden md:table-cell">{isEn ? "Published" : "তারিখ"}</TableHead>
                    <TableHead className="w-[90px] hidden lg:table-cell">{isEn ? "Read Time" : "পড়ার সময়"}</TableHead>
                    <TableHead className="w-[110px] text-right">{isEn ? "Actions" : "অ্যাকশন"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className={loading && articles.length > 0 ? "opacity-50 pointer-events-none transition-opacity duration-150" : "transition-opacity duration-150"}>
                  {loading && articles.length === 0 ? (
                    Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                      <TableRow key={`skeleton-${i}`} className="h-[64px] hover:bg-transparent">
                        <TableCell className="w-[120px]">
                          <Skeleton className="h-5 w-16 rounded-md" />
                        </TableCell>
                        <TableCell className="w-auto">
                          <div className="space-y-1.5 py-1">
                            <Skeleton className="h-4 w-3/4 max-w-sm" />
                            <Skeleton className="h-3 w-1/2 max-w-xs" />
                          </div>
                        </TableCell>
                        <TableCell className="w-[140px] hidden sm:table-cell">
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell className="w-[110px] hidden md:table-cell">
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell className="w-[90px] hidden lg:table-cell">
                          <Skeleton className="h-4 w-14" />
                        </TableCell>
                        <TableCell className="w-[110px] text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : articles.length === 0 ? (
                    <TableRow className="h-[200px]">
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                        {isEn ? "No articles found." : "কোনো আর্টিকেল পাওয়া যায়নি।"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    articles.map((art) => (
                      <TableRow key={art.slug} className="h-[64px] hover:bg-muted/30">
                        <TableCell className="w-[120px]">
                          <Badge className="bg-primary/10 text-primary font-bold border-primary/20 text-[10px] truncate max-w-[100px]">
                            {isEn ? art.categoryNameEn : art.categoryNameBn}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-auto">
                          <div className="font-bold text-xs text-foreground line-clamp-1">
                            {isEn ? art.titleEn : art.titleBn}
                          </div>
                          <div className="text-[11px] text-muted-foreground line-clamp-1">
                            {isEn ? art.excerptEn : art.excerptBn}
                          </div>
                        </TableCell>
                        <TableCell className="w-[140px] hidden sm:table-cell text-xs text-muted-foreground truncate">
                          {isEn ? art.authorEn : art.authorBn}
                        </TableCell>
                        <TableCell className="w-[110px] hidden md:table-cell text-xs text-muted-foreground whitespace-nowrap">
                          {art.publishedDate}
                        </TableCell>
                        <TableCell className="w-[90px] hidden lg:table-cell text-xs text-muted-foreground whitespace-nowrap">
                          {isEn ? art.readTimeEn : art.readTimeBn}
                        </TableCell>
                        <TableCell className="w-[110px] text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/health-tips/${art.slug}`}
                              target="_blank"
                              className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted/50"
                              title={isEn ? "View live article" : "আর্টিকেল দেখুন"}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => {
                                setEditingArticle(art);
                                setDialogOpen(true);
                              }}
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => {
                                setDeletingArticle(art);
                                setDeleteModalOpen(true);
                              }}
                              className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>


          {/* Pagination Footer */}
          {totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              locale={locale}
              t={t}
              itemLabel={isEn ? "articles" : "টি আর্টিকেল"}
              disabled={loading}
            />
          )}

        </CardContent>

      </Card>

      {/* Write / Edit Article Dialog */}
      <HealthTipArticleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        article={editingArticle}
        onSuccess={loadArticles}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>{isEn ? "Confirm Deletion" : "মুছে ফেলার নিশ্চিতকরণ"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isEn
                ? `Are you sure you want to permanently delete article "${deletingArticle?.titleEn}"?`
                : `আপনি কি নিশ্চিত যে "${deletingArticle?.titleBn}" আর্টিকেলটি স্থায়ীভাবে মুছে ফেলতে চান?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              {isEn ? "Cancel" : "বাতিল"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={deleting}
              className="font-bold"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  {isEn ? "Deleting..." : "মুছে ফেলা হচ্ছে..."}
                </>
              ) : (
                isEn ? "Delete Permanently" : "মুছে ফেলুন"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
