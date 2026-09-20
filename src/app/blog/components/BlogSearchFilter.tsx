"use client";

import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, BookOpen, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlogFilterPill, BLOG_FILTER_PILLS } from "@/data/blog/blogCategories";
import { Pagination } from "@/components/ui/pagination";
import { toBanglaNums } from "@/lib/utils";
import { Locale } from "@/lib/i18n";

interface BlogSearchFilterProps {
  children: React.ReactNode;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  currentCategory?: string;
  currentSearch?: string;
  filterPills?: BlogFilterPill[];
  locale?: string;
}

export function BlogSearchFilter({
  children,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  currentCategory = "all",
  currentSearch = "",
  filterPills = BLOG_FILTER_PILLS,
  locale = "bn",
}: BlogSearchFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  const isEn = locale === "en";
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [prevSearch, setPrevSearch] = useState(currentSearch);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [prevCategory, setPrevCategory] = useState(currentCategory);

  // Sync state if server props update externally (adjust state during render)
  if (currentSearch !== prevSearch) {
    setPrevSearch(currentSearch);
    setSearchQuery(currentSearch);
  }

  if (currentCategory !== prevCategory) {
    setPrevCategory(currentCategory);
    setSelectedCategory(currentCategory);
  }

  const createUrl = useCallback(
    (overrides: { page?: number; category?: string; search?: string }) => {
      const p = overrides.page !== undefined ? overrides.page : currentPage;
      const cat = overrides.category !== undefined ? overrides.category : selectedCategory;
      const q = overrides.search !== undefined ? overrides.search : searchQuery;

      const params = new URLSearchParams();
      if (p > 1) params.set("page", String(p));
      if (cat && cat !== "all") params.set("category", cat);
      if (q.trim()) params.set("search", q.trim());

      const qs = params.toString();
      return `/blog${qs ? `?${qs}` : ""}`;
    },
    [currentPage, selectedCategory, searchQuery]
  );

  const navigate = useCallback(
    (
      overrides: { page?: number; category?: string; search?: string },
      shouldScrollTop = false
    ) => {
      const targetUrl = createUrl(overrides);
      startTransition(() => {
        router.push(targetUrl, { scroll: false });
        if (shouldScrollTop && containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    },
    [createUrl, router]
  );

  // Debounced search query synchronization
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() !== currentSearch.trim()) {
        navigate({ search: searchQuery, page: 1 });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, currentSearch, navigate]);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === selectedCategory) return;
    setSelectedCategory(categoryId);
    navigate({ category: categoryId, page: 1 });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    navigate({ search: "", page: 1 });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    navigate({ category: "all", search: "", page: 1 });
  };

  return (
    <div ref={containerRef} className="space-y-8 scroll-mt-20">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 rounded-2xl bg-card border border-border/70 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isEn
                ? "Search blog guides, hospitals, tips..."
                : "হাসপাতাল, বিশেষজ্ঞ ডাক্তার বা স্বাস্থ্য গাইড খুঁজুন..."
            }
            className="pl-10 pr-10 h-11 bg-background rounded-xl border-border/80 focus-visible:ring-primary text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label={isEn ? "Clear search" : "সার্চ মুছুন"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground mr-1 shrink-0 hidden sm:block" />
          {filterPills.map((pill) => {
            const isSelected = selectedCategory === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => handleCategorySelect(pill.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20 scale-102"
                    : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {isEn ? pill.nameEn : pill.nameBn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header / Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-2">
          <span>
            {isEn ? (
              <>
                Showing <strong>{Math.min(pageSize, totalItems)}</strong> of{" "}
                <strong>{totalItems}</strong>{" "}
                {totalItems === 1 ? "article" : "articles"}
              </>
            ) : (
              <>
                মোট <strong>{toBanglaNums(totalItems)}</strong>টি নিবন্ধের মধ্যে{" "}
                <strong>{toBanglaNums(Math.min(pageSize, totalItems))}</strong>টি প্রদর্শিত হচ্ছে
              </>
            )}
          </span>
          {isPending && (
            <span className="inline-flex items-center gap-1 text-primary text-xs animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>{isEn ? "Updating..." : "লোড হচ্ছে..."}</span>
            </span>
          )}
        </div>

        {(searchQuery || selectedCategory !== "all") && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-primary hover:underline font-medium cursor-pointer"
          >
            {isEn ? "Reset filters" : "ফিল্টার রিসেট করুন"}
          </button>
        )}
      </div>

      {/* Grid of Articles */}
      <div
        className={`transition-opacity duration-200 ${
          isPending ? "opacity-60 pointer-events-none" : "opacity-100"
        }`}
      >
        {totalItems > 0 ? (
          children
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              {isEn ? "No articles found" : "কোনো নিবন্ধ পাওয়া যায়নি"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {isEn
                ? "Try adjusting your search terms or selecting a different category."
                : "অনুগ্রহ করে ভিন্ন কোনো শব্দ দিয়ে খুঁজুন অথবা অন্য ক্যাটাগরি নির্বাচন করুন।"}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer"
              >
                {isEn ? "View all articles" : "সকল নিবন্ধ দেখুন"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Server-Side Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            getPageUrl={(page) => createUrl({ page })}
            onPageChange={(page) => navigate({ page }, true)}
            locale={locale as Locale}
            disabled={isPending}
            className="rounded-2xl border border-border/70 bg-card shadow-xs"
          />
        </div>
      )}
    </div>
  );
}
