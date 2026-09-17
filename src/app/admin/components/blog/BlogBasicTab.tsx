import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOG_CATEGORIES } from "@/data/blog/blogPosts";
import { Sparkles } from "lucide-react";

interface BlogBasicTabProps {
  isEn: boolean;
  isEditing: boolean;
  titleBn: string;
  setTitleBn: (val: string) => void;
  titleEn: string;
  setTitleEn: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  coverImage: string;
  setCoverImage: (val: string) => void;
  coverImageAlt: string;
  setCoverImageAlt: (val: string) => void;
  readTimeBn: string;
  setReadTimeBn: (val: string) => void;
  readTimeEn: string;
  setReadTimeEn: (val: string) => void;
  onAutoSlug: () => void;
}

export function BlogBasicTab({
  isEn,
  isEditing,
  titleBn,
  setTitleBn,
  titleEn,
  setTitleEn,
  slug,
  setSlug,
  category,
  setCategory,
  coverImage,
  setCoverImage,
  coverImageAlt,
  setCoverImageAlt,
  readTimeBn,
  setReadTimeBn,
  readTimeEn,
  setReadTimeEn,
  onAutoSlug,
}: BlogBasicTabProps) {
  return (
    <div className="space-y-4 pt-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="titleBn" className="text-xs font-semibold">
            {isEn ? "Title (Bangla) *" : "বাংলা শিরোনাম *"}
          </Label>
          <Input
            id="titleBn"
            value={titleBn}
            onChange={(e) => setTitleBn(e.target.value)}
            placeholder="ফেনীর সেরা হাসপাতাল গাইড..."
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="titleEn" className="text-xs font-semibold">
            {isEn ? "Title (English) *" : "English Title *"}
          </Label>
          <Input
            id="titleEn"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="Best Hospitals in Feni..."
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="slug" className="text-xs font-semibold">
            {isEn ? "URL Slug *" : "URL স্লাগ *"}
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAutoSlug}
            className="h-6 text-xs text-primary gap-1 px-2"
          >
            <Sparkles className="h-3 w-3" />
            {isEn ? "Auto Generate" : "অটো তৈরি"}
          </Button>
        </div>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="best-hospitals-in-feni"
          disabled={isEditing}
          required
        />
        <p className="text-[11px] text-muted-foreground">
          {isEn
            ? "Unique link identifier (lowercase letters, numbers, hyphens)."
            : "ইউনিক লিংক আইডি (ছোট হাতের ইংরেজি অক্ষর ও হাইফেন)।"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">
            {isEn ? "Category *" : "ক্যাটাগরি *"}
          </Label>
          <Select
            value={category}
            onValueChange={(val) => {
              if (val) setCategory(val);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="ক্যাটাগরি বাছাই করুন" />
            </SelectTrigger>
            <SelectContent>
              {BLOG_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.nameBn} ({cat.nameEn})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="readTimeBn" className="text-xs font-semibold">
              {isEn ? "Read Time (Bn)" : "পড়ার সময় (বাং)"}
            </Label>
            <Input
              id="readTimeBn"
              value={readTimeBn}
              onChange={(e) => setReadTimeBn(e.target.value)}
              placeholder="৫ মিনিট"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="readTimeEn" className="text-xs font-semibold">
              {isEn ? "Read Time (En)" : "Read Time (En)"}
            </Label>
            <Input
              id="readTimeEn"
              value={readTimeEn}
              onChange={(e) => setReadTimeEn(e.target.value)}
              placeholder="5 min read"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="coverImage" className="text-xs font-semibold">
            {isEn ? "Cover Image URL *" : "কভার ইমেজ লিঙ্ক *"}
          </Label>
          <Input
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="/images/blog/cover.webp"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coverImageAlt" className="text-xs font-semibold">
            {isEn ? "Image Alt Text" : "ইমেজ Alt টেক্সট"}
          </Label>
          <Input
            id="coverImageAlt"
            value={coverImageAlt}
            onChange={(e) => setCoverImageAlt(e.target.value)}
            placeholder="ফেনী হাসপাতাল রিভিউ গাইড"
          />
        </div>
      </div>
    </div>
  );
}
