"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlogPost, BlogCategory } from "@/types/blog";
import { BlogFilterPill, BLOG_FILTER_PILLS } from "@/data/blog/blogPosts";
import { BlogCard } from "./BlogCard";
import { toBanglaNums } from "@/lib/utils";

interface BlogSearchFilterProps {
  initialPosts: BlogPost[];
  categories?: BlogCategory[];
  filterPills?: BlogFilterPill[];
  locale?: string;
}

export function BlogSearchFilter({
  initialPosts,
  filterPills = BLOG_FILTER_PILLS,
  locale = "bn",
}: BlogSearchFilterProps) {
  const isEn = locale === "en";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return initialPosts.filter((post) => {
      // Category match
      let matchesCategory = false;
      if (selectedCategory === "all") {
        matchesCategory = true;
      } else {
        const activePill = filterPills.find((p) => p.id === selectedCategory);
        if (activePill?.matchingCategories && activePill.matchingCategories.length > 0) {
          matchesCategory = activePill.matchingCategories.includes(post.category);
        } else {
          matchesCategory = post.category === selectedCategory;
        }
      }

      if (!matchesCategory) return false;

      // Search query match
      if (!query) return true;

      const titleMatch =
        post.titleBn.toLowerCase().includes(query) ||
        post.titleEn.toLowerCase().includes(query);

      const excerptMatch =
        post.excerptBn.toLowerCase().includes(query) ||
        post.excerptEn.toLowerCase().includes(query);

      const tagMatch = post.tags.some((t) => t.toLowerCase().includes(query));
      const keywordMatch = post.metaKeywords.some((k) =>
        k.toLowerCase().includes(query)
      );

      return titleMatch || excerptMatch || tagMatch || keywordMatch;
    });
  }, [initialPosts, searchQuery, selectedCategory, filterPills]);

  return (
    <div className="space-y-8">
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
            className="pl-10 pr-4 h-11 bg-background rounded-xl border-border/80 focus-visible:ring-primary text-sm"
          />
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
                onClick={() => setSelectedCategory(pill.id)}
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
        <span>
          {isEn ? (
            <>
              Showing <strong>{filteredPosts.length}</strong>{" "}
              {filteredPosts.length === 1 ? "article" : "articles"}
            </>
          ) : (
            <>
              মোট <strong>{toBanglaNums(filteredPosts.length)}</strong>টি নিবন্ধ
              পাওয়া গেছে
            </>
          )}
        </span>

        {(searchQuery || selectedCategory !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-primary hover:underline font-medium cursor-pointer"
          >
            {isEn ? "Reset filters" : "ফিল্টার রিসেট করুন"}
          </button>
        )}
      </div>

      {/* Grid of Articles */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, idx) => (
            <BlogCard
              key={post.slug}
              post={post}
              locale={locale}
              priority={idx < 2}
            />
          ))}
        </div>
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
        </div>
      )}
    </div>
  );
}
