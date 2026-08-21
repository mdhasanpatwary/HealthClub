"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HealthTipArticle,
  HEALTH_CATEGORIES,
} from "@/data/healthTipsData";
import { saveHealthTipAction } from "@/app/actions/healthTipsAdminActions";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface HealthTipArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: HealthTipArticle | null;
  onSuccess: () => void;
}

export function HealthTipArticleDialog({
  open,
  onOpenChange,
  article,
  onSuccess,
}: HealthTipArticleDialogProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [slug, setSlug] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [excerptBn, setExcerptBn] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [category, setCategory] = useState<HealthTipArticle["category"]>("general");
  const [readTimeBn, setReadTimeBn] = useState("৩ মিনিট");
  const [readTimeEn, setReadTimeEn] = useState("3 min read");
  const [authorBn, setAuthorBn] = useState("হেলথ ক্লাব মেডিকেল টিম");
  const [authorEn, setAuthorEn] = useState("Health Club Medical Team");
  const [relatedSpecialty, setRelatedSpecialty] = useState("মেডিসিন ও লিভার");

  // Dynamic arrays for takeaways and content paragraphs
  const [keyTakeawaysBn, setKeyTakeawaysBn] = useState<string[]>([""]);
  const [keyTakeawaysEn, setKeyTakeawaysEn] = useState<string[]>([""]);
  const [contentBn, setContentBn] = useState<string[]>([""]);
  const [contentEn, setContentEn] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      if (article) {
        setSlug(article.slug);
        setTitleBn(article.titleBn);
        setTitleEn(article.titleEn);
        setExcerptBn(article.excerptBn);
        setExcerptEn(article.excerptEn);
        setCategory(article.category);
        setReadTimeBn(article.readTimeBn);
        setReadTimeEn(article.readTimeEn);
        setAuthorBn(article.authorBn);
        setAuthorEn(article.authorEn);
        setRelatedSpecialty(article.relatedSpecialty);
        setKeyTakeawaysBn(article.keyTakeawaysBn.length ? article.keyTakeawaysBn : [""]);
        setKeyTakeawaysEn(article.keyTakeawaysEn.length ? article.keyTakeawaysEn : [""]);
        setContentBn(article.contentBn.length ? article.contentBn : [""]);
        setContentEn(article.contentEn.length ? article.contentEn : [""]);
      } else {
        setSlug("");
        setTitleBn("");
        setTitleEn("");
        setExcerptBn("");
        setExcerptEn("");
        setCategory("general");
        setReadTimeBn("৩ মিনিট");
        setReadTimeEn("3 min read");
        setAuthorBn("হেলথ ক্লাব মেডিকেল টিম");
        setAuthorEn("Health Club Medical Team");
        setRelatedSpecialty("মেডিসিন ও লিভার");
        setKeyTakeawaysBn([""]);
        setKeyTakeawaysEn([""]);
        setContentBn([""]);
        setContentEn([""]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [article, open]);

  // Auto-generate slug from English or Bengali title
  const handleTitleEnChange = (val: string) => {
    setTitleEn(val);
    if (!article) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() || !slug.trim()) {
      toast.error(isEn ? "Title and Slug are required" : "শিরোনাম ও স্লাগ আবশ্যক");
      return;
    }

    const catObj = HEALTH_CATEGORIES.find((c) => c.id === category);

    setSaving(true);
    try {
      const payload: HealthTipArticle = {
        slug: slug.trim(),
        titleBn: titleBn.trim(),
        titleEn: titleEn.trim() || titleBn.trim(),
        excerptBn: excerptBn.trim(),
        excerptEn: excerptEn.trim() || excerptBn.trim(),
        category,
        categoryNameBn: catObj ? catObj.nameBn : "সাধারণ স্বাস্থ্য",
        categoryNameEn: catObj ? catObj.nameEn : "General Health",
        readTimeBn: readTimeBn.trim() || "৩ মিনিট",
        readTimeEn: readTimeEn.trim() || "3 min read",
        publishedDate: article ? article.publishedDate : new Date().toLocaleDateString("bn-BD"),
        authorBn: authorBn.trim() || "হেলথ ক্লাব মেডিকেল টিম",
        authorEn: authorEn.trim() || "Health Club Medical Team",
        relatedSpecialty: relatedSpecialty.trim(),
        keyTakeawaysBn: keyTakeawaysBn.filter((t) => t.trim().length > 0),
        keyTakeawaysEn: keyTakeawaysEn.filter((t) => t.trim().length > 0),
        contentBn: contentBn.filter((c) => c.trim().length > 0),
        contentEn: contentEn.filter((c) => c.trim().length > 0),
      };

      const res = await saveHealthTipAction(payload);
      if (res.success) {
        toast.success(
          article
            ? isEn ? "Article updated successfully!" : "আর্টিকেল আপডেট করা হয়েছে!"
            : isEn ? "New article published successfully!" : "নতুন আর্টিকেল প্রকাশিত হয়েছে!"
        );
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(res.error || (isEn ? "Failed to save article" : "আর্টিকেল সংরক্ষণ ব্যর্থ"));
      }
    } catch {
      toast.error(isEn ? "An unexpected error occurred" : "একটি সমস্যা দেখা দিয়েছে");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {article
              ? isEn ? "Edit Health Article" : "স্বাস্থ্য টিপস আর্টিকেল এডিট করুন"
              : isEn ? "Write New Health Article" : "নতুন স্বাস্থ্য টিপস লিখুন"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEn
              ? "Publish medical guides, prevention tips, and health recommendations."
              : "চিকিৎসকের পরামর্শ, স্বাস্থ্যকর অভ্যাস ও সচেতনতামূলক গাইড প্রকাশ করুন।"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* Titles & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="art-title-bn" className="text-xs font-semibold">
                {isEn ? "Title (Bangla)" : "শিরোনাম (বাংলা)"} *
              </Label>
              <Input
                id="art-title-bn"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="যেমন: ডেঙ্গু জ্বর প্রতিরোধ ও চিকিৎসা"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="art-title-en" className="text-xs font-semibold">
                {isEn ? "Title (English)" : "শিরোনাম (ইংরেজি)"}
              </Label>
              <Input
                id="art-title-en"
                value={titleEn}
                onChange={(e) => handleTitleEnChange(e.target.value)}
                placeholder="e.g. Dengue Fever Care Guidelines"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="art-slug" className="text-xs font-semibold">
                {isEn ? "URL Slug (Unique)" : "ইউআরএল স্লাগ"} *
              </Label>
              <Input
                id="art-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dengue-prevention"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                {isEn ? "Category" : "ক্যাটাগরি"} *
              </Label>
              <Select
                value={category}
                onValueChange={(val) => {
                  if (val) setCategory(val as HealthTipArticle["category"]);
                }}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="ক্যাটাগরি" />
                </SelectTrigger>
                <SelectContent>
                  {HEALTH_CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {isEn ? c.nameEn : c.nameBn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="art-author-bn" className="text-xs font-semibold">
                {isEn ? "Author / Doctor" : "লেখক / চিকিৎসক"}
              </Label>
              <Input
                id="art-author-bn"
                value={authorBn}
                onChange={(e) => setAuthorBn(e.target.value)}
                placeholder="যেমন: ডাঃ তানভীর হাসান"
              />
            </div>
          </div>

          {/* Excerpts */}
          <div className="space-y-1.5">
            <Label htmlFor="art-excerpt-bn" className="text-xs font-semibold">
              {isEn ? "Short Summary (Bangla)" : "সংক্ষিপ্ত সারসংক্ষেপ (বাংলা)"}
            </Label>
            <textarea
              id="art-excerpt-bn"
              rows={2}
              value={excerptBn}
              onChange={(e) => setExcerptBn(e.target.value)}
              placeholder="আর্টিকেলের মূল বক্তব্য ১-২ বাক্যে লিখুন..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Key Takeaways */}
          <div className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">
                {isEn ? "Key Takeaways (Bullet Points)" : "একনজরে জরুরি পরামর্শসমূহ (পয়েন্টস)"}
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setKeyTakeawaysBn([...keyTakeawaysBn, ""])}
                className="h-7 text-[11px] gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>{isEn ? "Add Point" : "পয়েন্ট যোগ"}</span>
              </Button>
            </div>

            {keyTakeawaysBn.map((point, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={point}
                  onChange={(e) => {
                    const next = [...keyTakeawaysBn];
                    next[idx] = e.target.value;
                    setKeyTakeawaysBn(next);
                  }}
                  placeholder={`পয়েন্ট #${idx + 1}`}
                  className="h-8 text-xs bg-background"
                />
                {keyTakeawaysBn.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setKeyTakeawaysBn(keyTakeawaysBn.filter((_, i) => i !== idx));
                    }}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Content Paragraphs */}
          <div className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">
                {isEn ? "Article Body Paragraphs (Bangla)" : "আর্টিকেল প্যারাগ্রাফ / বিস্তারিত বিবরণ"}
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setContentBn([...contentBn, ""])}
                className="h-7 text-[11px] gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>{isEn ? "Add Paragraph" : "প্যারাগ্রাফ যোগ"}</span>
              </Button>
            </div>

            {contentBn.map((para, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => {
                    const next = [...contentBn];
                    next[idx] = e.target.value;
                    setContentBn(next);
                  }}
                  placeholder={`প্যারাগ্রাফ #${idx + 1}...`}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none"
                />
                {contentBn.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setContentBn(contentBn.filter((_, i) => i !== idx));
                    }}
                    className="h-8 w-8 text-destructive shrink-0 mt-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="text-xs"
            >
              {isEn ? "Cancel" : "বাতিল"}
            </Button>
            <Button type="submit" disabled={saving} className="text-xs font-bold">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  {isEn ? "Saving..." : "সংরক্ষণ হচ্ছে..."}
                </>
              ) : (
                isEn ? "Save & Publish" : "সংরক্ষণ ও প্রকাশ করুন"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
