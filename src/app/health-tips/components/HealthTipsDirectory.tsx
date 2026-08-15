"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  HEALTH_TIPS_ARTICLES,
  HEALTH_CATEGORIES,
  HealthTipArticle,
} from "@/data/healthTipsData";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Search,
  Clock,
  User,
  ArrowRight,
  X,
  ChevronDown,
  Filter,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface HealthTipsDirectoryProps {
  initialArticles?: HealthTipArticle[];
}

export function HealthTipsDirectory({
  initialArticles = HEALTH_TIPS_ARTICLES,
}: HealthTipsDirectoryProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialArticles.length };
    initialArticles.forEach((article) => {
      counts[article.category] = (counts[article.category] || 0) + 1;
    });
    return counts;
  }, [initialArticles]);

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article: HealthTipArticle) => {
      const matchCat =
        selectedCategory === "all" || article.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        query === "" ||
        article.titleBn.toLowerCase().includes(query) ||
        article.titleEn.toLowerCase().includes(query) ||
        article.excerptBn.toLowerCase().includes(query) ||
        article.excerptEn.toLowerCase().includes(query) ||
        article.authorBn.toLowerCase().includes(query) ||
        article.authorEn.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  }, [initialArticles, selectedCategory, searchQuery]);

  const displayedArticles = filteredArticles.slice(0, visibleCount);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter */}
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                isEn
                  ? "Search health guides, diseases, symptoms..."
                  : "রোগ, লক্ষণ বা স্বাস্থ্য বিষয়ে খুঁজুন..."
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              className="pl-10 pr-10 bg-background rounded-xl h-11 border-border/80 text-xs sm:text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="text-xs text-muted-foreground font-medium self-end sm:self-center">
            {isEn
              ? `Showing ${filteredArticles.length} guides`
              : `মোট ${filteredArticles.length} টি স্বাস্থ্য গাইড`}
          </div>
        </div>

        {/* Mobile View: Select Dropdown Field */}
        <div className="block sm:hidden">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-muted-foreground">
              <Filter className="h-3.5 w-3.5 text-primary" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setVisibleCount(12);
              }}
              className="w-full h-11 pl-9 pr-10 text-xs font-bold rounded-xl border border-border/80 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none shadow-xs"
            >
              {HEALTH_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                if (cat.id !== "all" && count === 0) return null;
                return (
                  <option key={cat.id} value={cat.id}>
                    {isEn ? `${cat.nameEn} (${count})` : `${cat.nameBn} (${count}টি)`}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Desktop View: Category Pills */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {HEALTH_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            if (cat.id !== "all" && count === 0) return null;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setVisibleCount(12);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border/60"
                }`}
              >
                <span>{isEn ? cat.nameEn : cat.nameBn}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-background text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid */}
      {displayedArticles.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {displayedArticles.map((article) => (
              <Card
                key={article.slug}
                className="border border-border/80 bg-card hover:border-primary/50 transition-all duration-300 shadow-xs flex flex-col justify-between group overflow-hidden rounded-3xl"
              >
                <CardContent className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Category & Read Time */}
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 text-[11px] font-bold px-2.5 py-0.5"
                      >
                        {isEn ? article.categoryNameEn : article.categoryNameBn}
                      </Badge>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                        <Clock className="h-3 w-3" />
                        <span>{isEn ? article.readTimeEn : article.readTimeBn}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={`/health-tips/${article.slug}`}>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {isEn ? article.titleEn : article.titleBn}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {isEn ? article.excerptEn : article.excerptBn}
                    </p>
                  </div>

                  {/* Footer: Author & Read More */}
                  <div className="pt-3.5 border-t border-border/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="truncate max-w-[130px] font-medium text-[11px]">
                        {isEn ? article.authorEn : article.authorBn}
                      </span>
                    </div>

                    <Link href={`/health-tips/${article.slug}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary group-hover:bg-primary group-hover:text-white font-bold gap-1 rounded-xl text-xs h-8 px-2.5 transition-all cursor-pointer"
                      >
                        <span>{isEn ? "Read" : "পড়ুন"}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {filteredArticles.length > visibleCount && (
            <div className="flex flex-col items-center justify-center pt-4 space-y-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="rounded-2xl px-8 border-primary/30 text-primary hover:bg-primary hover:text-white font-semibold transition-all shadow-xs cursor-pointer"
              >
                {isEn
                  ? `Load More Guides (${filteredArticles.length - visibleCount} remaining)`
                  : `আরো গাইড দেখুন (বাকি ${filteredArticles.length - visibleCount} টি)`}
              </Button>
              <p className="text-xs text-muted-foreground">
                {isEn
                  ? `Showing ${Math.min(visibleCount, filteredArticles.length)} of ${filteredArticles.length} articles`
                  : `মোট ${filteredArticles.length} টির মধ্যে ${Math.min(visibleCount, filteredArticles.length)} টি প্রদর্শিত হচ্ছে`}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center bg-muted/40 rounded-3xl border border-dashed border-border space-y-3">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-base text-foreground">
              {isEn ? "No health guides found" : "কোনো স্বাস্থ্য গাইড পাওয়া যায়নি"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {isEn
                ? "Try searching for keywords like 'diabetes', 'dengue', 'heart', or 'blood pressure'."
                : "'ডায়াবেটিস', 'ডেঙ্গু', 'হার্ট', বা 'রক্তচাপ' লিখে সার্চ করুন।"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
