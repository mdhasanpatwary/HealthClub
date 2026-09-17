"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Newspaper,
  Search,
  Plus,
  Download,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { BlogPost } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/data/blog/blogPosts";
import {
  getPaginatedBlogPostsAdminAction,
  deleteBlogPostAction,
} from "@/app/actions/blogAdminActions";
import { exportToCsv } from "@/lib/exportUtils";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { BlogDialog } from "./BlogDialog";
import { BlogStatsCards } from "./blog/BlogStatsCards";
import { BlogMobileCard } from "./blog/BlogMobileCard";
import { BlogTable } from "./blog/BlogTable";
import { Pagination } from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/useDebounce";

export function BlogsTab() {
  const { locale, t } = useLanguage();
  const isEn = locale === "en";

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog & Delete Modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPaginatedBlogPostsAdminAction({
        page: currentPage,
        pageSize,
        search: debouncedSearch,
        category: selectedCategory,
      });
      setPosts(res.data);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);
    } catch {
      toast.error(isEn ? "Failed to load blog posts" : "ব্লগ পোস্ট লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, selectedCategory, isEn]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadPosts();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [loadPosts]);

  const handleCreateNew = () => {
    setEditingPost(null);
    setDialogOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setDialogOpen(true);
  };

  const handleDeleteClick = (post: BlogPost) => {
    setDeletingPost(post);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingPost) return;
    setDeleting(true);
    try {
      const res = await deleteBlogPostAction(deletingPost.slug);
      if (res.success) {
        toast.success(
          isEn ? "Blog post deleted successfully!" : "ব্লগ পোস্ট সফলভাবে মুছে ফেলা হয়েছে!"
        );
        setDeleteModalOpen(false);
        setDeletingPost(null);
        loadPosts();
      } else {
        toast.error(res.error || (isEn ? "Failed to delete post" : "ব্লগ মুছতে সমস্যা হয়েছে"));
      }
    } catch {
      toast.error(isEn ? "An unexpected error occurred" : "অপ্রত্যাশিত ত্রুটি ঘটেছে");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    if (!posts.length) {
      toast.info(isEn ? "No blog posts to export" : "এক্সপোর্ট করার মতো কোনো ব্লগ নেই");
      return;
    }
    exportToCsv(posts, "healthclub_blog_posts", [
      { header: "স্লাগ", accessor: "slug" },
      { header: "বাংলা শিরোনাম", accessor: "titleBn" },
      { header: "English Title", accessor: "titleEn" },
      { header: "ক্যাটাগরি", accessor: "categoryNameBn" },
      { header: "পড়ার সময়", accessor: "readTimeBn" },
      { header: "প্রকাশের তারিখ", accessor: "publishedDate" },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <span>{isEn ? "Blog Posts Management" : "ব্লগ পোস্ট ম্যানেজমেন্ট"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isEn
              ? "Create, edit and manage public health & hospital blog articles."
              : "নতুন ব্লগ তৈরি করুন, তথ্য আপডেট করুন বা অপ্রয়োজনীয় পোস্ট মুছে ফেলুন।"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={loading || posts.length === 0}
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isEn ? "Export" : "এক্সপোর্ট"}</span>
          </Button>
          <Button
            size="sm"
            onClick={handleCreateNew}
            className="h-9 gap-1.5 text-xs font-bold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>{isEn ? "Write Blog" : "নতুন ব্লগ লিখুন"}</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <BlogStatsCards totalItems={totalItems} isEn={isEn} />

      {/* Main Listing Card */}
      <Card className="border-border">
        <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold">
                {isEn ? "Published Articles" : "প্রকাশিত ব্লগ আর্টিকেলসমূহ"}
              </CardTitle>
              <CardDescription className="text-xs">
                {isEn
                  ? "Showing all active and indexed blog articles."
                  : "সকল সক্রিয় ও সার্চ ইঞ্জিনে ইনডেক্সযোগ্য ব্লগের তালিকা।"}
              </CardDescription>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={isEn ? "Search by title or tag..." : "শিরোনাম বা ট্যাগ খুঁজুন..."}
                  className="pl-8 text-xs h-9"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 px-3 rounded-lg border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {isEn ? cat.nameEn : cat.nameBn}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Newspaper className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {isEn ? "No blog posts found" : "কোনো ব্লগ পোস্ট পাওয়া যায়নি"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {isEn
                  ? "Try changing your search keywords or write a new blog post."
                  : "আপনার অনুসন্ধানের শব্দ পরিবর্তন করুন অথবা নতুন ব্লগ পোস্ট তৈরি করুন।"}
              </p>
              <Button size="sm" onClick={handleCreateNew} className="text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                {isEn ? "Write First Blog" : "প্রথম ব্লগ লিখুন"}
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile View: Cards Layout */}
              <div className="divide-y block md:hidden">
                {posts.map((post) => (
                  <BlogMobileCard
                    key={post.slug}
                    post={post}
                    isEn={isEn}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>

              {/* Desktop View: Table Layout */}
              <BlogTable
                posts={posts}
                isEn={isEn}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </>
          )}

          {/* Pagination */}
          {!loading && totalItems > 0 && (
            <div className="p-4 border-t">
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
                pageSizeOptions={[10, 20, 50]}
                locale={locale}
                t={t}
                itemLabel={isEn ? "posts" : "টি ব্লগ"}
                disabled={loading}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Write / Edit Article Dialog */}
      <BlogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        post={editingPost}
        onSuccess={loadPosts}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>{isEn ? "Confirm Blog Deletion" : "ব্লগ মুছে ফেলার নিশ্চিতকরণ"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isEn
                ? `Are you sure you want to permanently delete "${deletingPost?.titleEn}"? This URL will no longer be accessible.`
                : `আপনি কি নিশ্চিত যে "${deletingPost?.titleBn}" ব্লগটি স্থায়ীভাবে মুছে ফেলতে চান? এটি মুছে ফেললে লিঙ্কে আর ভিজিট করা যাবে না।`}
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
              ) : isEn ? (
                "Delete Permanently"
              ) : (
                "মুছে ফেলুন"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
