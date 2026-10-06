"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, SlidersHorizontal, BookOpen, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlogFilterPill, BLOG_FILTER_PILLS } from "@/data/blog/blogCategories";
import { Pagination } from "@/components/ui/pagination";
import { toBanglaNums } from "@/lib/utils";
import { BlogPostCardItem } from "@/types/blog";
import { paginateBlogPosts, DEFAULT_BLOG_PAGE_SIZE } from "../utils/blogPagination";
import { BlogCard } from "./BlogCard";

interface BlogSearchFilterProps {
  allPosts?: BlogPostCardItem[];
  children?: React.ReactNode;
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  currentCategory?: string;
  currentSearch?: string;
  filterPills?: BlogFilterPill[];
}

export function BlogSearchFilter({
  allPosts,
  children,
  totalItems: initialTotalItems,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage = 1,
  pageSize = DEFAULT_BLOG_PAGE_SIZE,
  currentCategory = "all",
  currentSearch = "",
  filterPills = BLOG_FILTER_PILLS,
}: BlogSearchFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);

  // Sync state with URL query parameters on initial client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const q = params.get("search");
    const p = parseInt(params.get("page") || "1", 10);
    queueMicrotask(() => {
      if (cat) setSelectedCategory(cat);
      if (q) setSearchQuery(q);
      if (p > 1) setCurrentPage(p);
    });
  }, []);

  // In-memory pagination result when allPosts is provided
  const clientResult = useMemo(() => {
    if (!allPosts) return null;
    return paginateBlogPosts(allPosts, {
      page: currentPage,
      pageSize,
      category: selectedCategory,
      search: searchQuery,
      filterPills,
    });
  }, [allPosts, currentPage, pageSize, selectedCategory, searchQuery, filterPills]);

  const totalItems = clientResult ? clientResult.totalItems : initialTotalItems ?? 0;
  const totalPages = clientResult ? clientResult.totalPages : initialTotalPages ?? 1;
  const cardPosts = clientResult ? clientResult.posts : [];

  // Sync URL in address bar without triggering Next.js server actions / RSC
  const updateUrlParams = useCallback((p: number, cat: string, q: string) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (cat && cat !== "all") params.set("category", cat);
    if (q.trim()) params.set("search", q.trim());
    const qs = params.toString();
    const newPath = `/blog${qs ? `?${qs}` : ""}`;
    window.history.replaceState(null, "", newPath);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === selectedCategory) return;
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    updateUrlParams(1, categoryId, searchQuery);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    updateUrlParams(1, selectedCategory, val);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    updateUrlParams(1, selectedCategory, "");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setCurrentPage(1);
    updateUrlParams(1, "all", "");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams(page, selectedCategory, searchQuery);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 sm:space-y-8 scroll-mt-20">
      {/* Search & Category Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/70 shadow-xs space-y-3.5">
        {/* Full-Width Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="হাসপাতাল, বিশেষজ্ঞ ডাক্তার বা স্বাস্থ্য গাইড খুঁজুন..."
            className="w-full pl-10 pr-10 h-11 bg-background rounded-xl border-border/80 focus-visible:ring-primary text-sm shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="সার্চ মুছুন"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground mr-1 shrink-0 hidden sm:block" />
          {filterPills.map((pill) => {
            const isSelected = selectedCategory === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => handleCategorySelect(pill.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20 scale-102"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {pill.nameBn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header / Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-2">
          <span>
            মোট <strong>{toBanglaNums(totalItems)}</strong>টি নিবন্ধের মধ্যে{" "}
            <strong>{toBanglaNums(Math.min(pageSize, totalItems))}</strong>টি প্রদর্শিত হচ্ছে
          </span>
        </div>

        {(searchQuery || selectedCategory !== "all") && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-primary hover:underline font-medium cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        )}
      </div>

      {/* Grid of Articles */}
      <div>
        {allPosts ? (
          cardPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardPosts.map((post, idx) => (
                <BlogCard key={post.slug} post={post} priority={idx < 3} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                কোনো নিবন্ধ পাওয়া যায়নি
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                অনুগ্রহ করে ভিন্ন কোনো শব্দ দিয়ে খুঁজুন অথবা অন্য ক্যাটাগরি নির্বাচন করুন।
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer"
                >
                  সকল নিবন্ধ দেখুন
                </button>
              </div>
            </div>
          )
        ) : totalItems > 0 ? (
          children
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              কোনো নিবন্ধ পাওয়া যায়নি
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              অনুগ্রহ করে ভিন্ন কোনো শব্দ দিয়ে খুঁজুন অথবা অন্য ক্যাটাগরি নির্বাচন করুন।
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer"
              >
                সকল নিবন্ধ দেখুন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            getPageUrl={(page) => `#page-${page}`}
            onPageChange={(page) => handlePageChange(page)}
            className="rounded-2xl border border-border/70 bg-card shadow-xs"
          />
        </div>
      )}
    </div>
  );
}
