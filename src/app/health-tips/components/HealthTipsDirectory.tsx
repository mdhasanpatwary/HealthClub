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
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export function HealthTipsDirectory() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return HEALTH_TIPS_ARTICLES.filter((article: HealthTipArticle) => {
      const matchCat =
        selectedCategory === "all" || article.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        query === "" ||
        article.titleBn.toLowerCase().includes(query) ||
        article.titleEn.toLowerCase().includes(query) ||
        article.excerptBn.toLowerCase().includes(query) ||
        article.excerptEn.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Category Pills & Search */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {HEALTH_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border/50"
                }`}
              >
                {isEn ? cat.nameEn : cat.nameBn}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              isEn ? "Search health guides, diseases..." : "রোগ বা স্বাস্থ্য বিষয়ে খুঁজুন..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background rounded-xl"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {filteredArticles.map((article) => (
            <Card
              key={article.slug}
              className="border border-border/80 bg-background hover:border-primary/40 transition-all duration-300 shadow-xs flex flex-col justify-between group overflow-hidden rounded-3xl"
            >
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-bold px-2.5 py-0.5">
                      {isEn ? article.categoryNameEn : article.categoryNameBn}
                    </Badge>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{isEn ? article.readTimeEn : article.readTimeBn}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={`/health-tips/${article.slug}`}>
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-secondary dark:text-white group-hover:text-primary transition-colors leading-snug">
                      {isEn ? article.titleEn : article.titleBn}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {isEn ? article.excerptEn : article.excerptBn}
                  </p>
                </div>

                {/* Footer: Author & Read More */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate max-w-[180px] font-medium">
                      {isEn ? article.authorEn : article.authorBn}
                    </span>
                  </div>

                  <Link href={`/health-tips/${article.slug}`}>
                    <Button variant="ghost" size="sm" className="text-primary group-hover:bg-primary group-hover:text-white font-bold gap-1 rounded-xl text-xs transition-all">
                      <span>{isEn ? "Read Guide" : "বিস্তারিত পড়ুন"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-muted/40 rounded-3xl border border-dashed border-border space-y-3">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-base text-foreground">
              {isEn ? "No health guides found" : "কোনো স্বাস্থ্য গাইড পাওয়া যায়নি"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {isEn ? "Try adjusting your search keywords." : "অন্য কোনো কিওয়ার্ড দিয়ে পুনরায় সার্চ করুন।"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
