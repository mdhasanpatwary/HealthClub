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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogPost } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/data/blog/blogPosts";
import { saveBlogPostAction } from "@/app/actions/blogAdminActions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { BlogBasicTab } from "./blog/BlogBasicTab";
import { BlogContentTab } from "./blog/BlogContentTab";
import { BlogAuthorFaqTab } from "./blog/BlogAuthorFaqTab";

interface BlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
  onSuccess: () => void;
}

export function BlogDialog({
  open,
  onOpenChange,
  post,
  onSuccess,
}: BlogDialogProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  // Tab 1: Basic & SEO
  const [slug, setSlug] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [category, setCategory] = useState("hospital-guide");
  const [coverImage, setCoverImage] = useState("/images/blog/feni-hospitals-guide.webp");
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [readTimeBn, setReadTimeBn] = useState("৫ মিনিট");
  const [readTimeEn, setReadTimeEn] = useState("5 min read");

  // Tab 2: Content & Highlights
  const [excerptBn, setExcerptBn] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [keyHighlightsBn, setKeyHighlightsBn] = useState<string[]>([""]);
  const [introParagraphsBn, setIntroParagraphsBn] = useState<string[]>([""]);

  // Tab 3: Author & FAQs
  const [authorNameBn, setAuthorNameBn] = useState("হেলথ ক্লাব মেডিকেল টিম");
  const [authorNameEn, setAuthorNameEn] = useState("Health Club Medical Team");
  const [authorRoleBn, setAuthorRoleBn] = useState("মেডিকেল এডিটোরিয়াল টিম");
  const [authorRoleEn, setAuthorRoleEn] = useState("Medical Editorial Board");
  const [faqs, setFaqs] = useState<
    { questionBn: string; questionEn: string; answerBn: string; answerEn: string }[]
  >([]);

  // Tab 4: Tags & Keywords
  const [tagsInput, setTagsInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      if (post) {
        setSlug(post.slug);
        setTitleBn(post.titleBn);
        setTitleEn(post.titleEn);
        setCategory(post.category);
        setCoverImage(post.coverImage || "/images/blog/feni-hospitals-guide.webp");
        setCoverImageAlt(post.coverImageAlt || post.titleBn);
        setReadTimeBn(post.readTimeBn || "৫ মিনিট");
        setReadTimeEn(post.readTimeEn || "5 min read");
        setExcerptBn(post.excerptBn || "");
        setExcerptEn(post.excerptEn || "");
        setKeyHighlightsBn(
          post.keyHighlightsBn && post.keyHighlightsBn.length > 0
            ? post.keyHighlightsBn
            : [""]
        );
        setIntroParagraphsBn(
          post.introParagraphsBn && post.introParagraphsBn.length > 0
            ? post.introParagraphsBn
            : [""]
        );
        setAuthorNameBn(post.author?.nameBn || "হেলথ ক্লাব মেডিকেল টিম");
        setAuthorNameEn(post.author?.nameEn || "Health Club Medical Team");
        setAuthorRoleBn(post.author?.roleBn || "মেডিকেল এডিটোরিয়াল টিম");
        setAuthorRoleEn(post.author?.roleEn || "Medical Editorial Board");
        setFaqs(post.faqs && post.faqs.length > 0 ? post.faqs : []);
        setTagsInput(post.tags ? post.tags.join(", ") : "");
        setKeywordsInput(post.metaKeywords ? post.metaKeywords.join(", ") : "");
      } else {
        setSlug("");
        setTitleBn("");
        setTitleEn("");
        setCategory("hospital-guide");
        setCoverImage("/images/blog/feni-hospitals-guide.webp");
        setCoverImageAlt("");
        setReadTimeBn("৫ মিনিট");
        setReadTimeEn("5 min read");
        setExcerptBn("");
        setExcerptEn("");
        setKeyHighlightsBn([""]);
        setIntroParagraphsBn([""]);
        setAuthorNameBn("হেলথ ক্লাব মেডিকেল টিম");
        setAuthorNameEn("Health Club Medical Team");
        setAuthorRoleBn("মেডিকেল এডিটোরিয়াল টিম");
        setAuthorRoleEn("Medical Editorial Board");
        setFaqs([]);
        setTagsInput("ফেনী স্বাস্থ্যসেবা, হাসপাতাল গাইড, হেলথ ক্লাব");
        setKeywordsInput("ফেনী হাসপাতাল, ডাক্তার সিরিয়াল, স্বাস্থ্যসেবা");
      }
      setActiveTab("basic");
    });
    return () => {
      isMounted = false;
    };
  }, [post, open]);

  const handleAutoSlug = () => {
    const source = titleEn || titleBn;
    if (!source) {
      toast.error(isEn ? "Please enter a title first" : "প্রথমে একটি শিরোনাম লিখুন");
      return;
    }
    const generated = source
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated || "new-blog-post");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slug.trim()) {
      toast.error(isEn ? "Slug is required" : "স্লাগ আবশ্যক");
      setActiveTab("basic");
      return;
    }

    if (!titleBn.trim() || !titleEn.trim()) {
      toast.error(isEn ? "Bilingual title is required" : "বাংলা ও ইংরেজি উভয় শিরোনাম আবশ্যক");
      setActiveTab("basic");
      return;
    }

    if (!excerptBn.trim() || !excerptEn.trim()) {
      toast.error(isEn ? "Bilingual excerpt is required" : "বাংলা ও ইংরেজি উভয় সারাংশ আবশ্যক");
      setActiveTab("content");
      return;
    }

    const cleanParagraphs = introParagraphsBn.filter((p) => p.trim().length > 0);
    if (cleanParagraphs.length === 0) {
      toast.error(isEn ? "At least one content paragraph is required" : "কমপক্ষে একটি অনুচ্ছেদ কনটেন্ট লিখুন");
      setActiveTab("content");
      return;
    }

    setSaving(true);
    try {
      const catObj = BLOG_CATEGORIES.find((c) => c.id === category);
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const parsedKeywords = keywordsInput
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const payload: Partial<BlogPost> = {
        ...(post || {}),
        slug: slug.trim().toLowerCase(),
        titleBn: titleBn.trim(),
        titleEn: titleEn.trim(),
        excerptBn: excerptBn.trim(),
        excerptEn: excerptEn.trim(),
        category,
        categoryNameBn: catObj?.nameBn || "স্বাস্থ্যসেবা গাইড",
        categoryNameEn: catObj?.nameEn || "Healthcare Guide",
        publishedDate: post?.publishedDate || new Date().toISOString().split("T")[0],
        modifiedDate: new Date().toISOString().split("T")[0],
        readTimeBn: readTimeBn.trim() || "৫ মিনিট",
        readTimeEn: readTimeEn.trim() || "5 min read",
        coverImage: coverImage.trim() || "/images/blog/feni-hospitals-guide.webp",
        coverImageAlt: coverImageAlt.trim() || titleBn.trim(),
        tags: parsedTags,
        metaKeywords: parsedKeywords,
        keyHighlightsBn: keyHighlightsBn.filter((h) => h.trim().length > 0),
        introParagraphsBn: cleanParagraphs,
        author: {
          nameBn: authorNameBn.trim(),
          nameEn: authorNameEn.trim(),
          roleBn: authorRoleBn.trim(),
          roleEn: authorRoleEn.trim(),
          avatarUrl: post?.author?.avatarUrl || "/images/logo.png",
        },
        faqs: faqs.filter(
          (f) =>
            f.questionBn.trim() &&
            f.questionEn.trim() &&
            f.answerBn.trim() &&
            f.answerEn.trim()
        ),
      };

      const res = await saveBlogPostAction(payload);
      if (res.success) {
        toast.success(
          post
            ? isEn
              ? "Blog updated successfully!"
              : "ব্লগ সফলভাবে আপডেট করা হয়েছে!"
            : isEn
              ? "Blog created successfully!"
              : "নতুন ব্লগ সফলভাবে তৈরি করা হয়েছে!"
        );
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.error || (isEn ? "Failed to save blog" : "ব্লগ সংরক্ষণ করতে সমস্যা হয়েছে"));
      }
    } catch {
      toast.error(isEn ? "An unexpected error occurred" : "অপ্রত্যাশিত ত্রুটি ঘটেছে");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold">
            {post
              ? isEn
                ? "Edit Blog Post"
                : "ব্লগ পোস্ট সম্পাদনা করুন"
              : isEn
                ? "Create New Blog Post"
                : "নতুন ব্লগ পোস্ট তৈরি করুন"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            {isEn
              ? "Fill in bilingual details, SEO parameters and content paragraphs."
              : "বাংলা ও ইংরেজি উভয় ভাষায় শিরোনাম, বিবরণ এবং এসইও তথ্য পূরণ করুন।"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-auto p-1 bg-muted/60">
              <TabsTrigger value="basic" className="text-xs py-2">
                {isEn ? "Basic & SEO" : "বেসিক ও এসইও"}
              </TabsTrigger>
              <TabsTrigger value="content" className="text-xs py-2">
                {isEn ? "Content" : "কনটেন্ট"}
              </TabsTrigger>
              <TabsTrigger value="author" className="text-xs py-2">
                {isEn ? "Author & FAQs" : "লেখক ও এফএকিউ"}
              </TabsTrigger>
              <TabsTrigger value="tags" className="text-xs py-2">
                {isEn ? "Tags & SEO" : "ট্যাগ ও কিওয়ার্ড"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BlogBasicTab
                isEn={isEn}
                isEditing={Boolean(post)}
                titleBn={titleBn}
                setTitleBn={setTitleBn}
                titleEn={titleEn}
                setTitleEn={setTitleEn}
                slug={slug}
                setSlug={setSlug}
                category={category}
                setCategory={setCategory}
                coverImage={coverImage}
                setCoverImage={setCoverImage}
                coverImageAlt={coverImageAlt}
                setCoverImageAlt={setCoverImageAlt}
                readTimeBn={readTimeBn}
                setReadTimeBn={setReadTimeBn}
                readTimeEn={readTimeEn}
                setReadTimeEn={setReadTimeEn}
                onAutoSlug={handleAutoSlug}
              />
            </TabsContent>

            <TabsContent value="content">
              <BlogContentTab
                isEn={isEn}
                excerptBn={excerptBn}
                setExcerptBn={setExcerptBn}
                excerptEn={excerptEn}
                setExcerptEn={setExcerptEn}
                keyHighlightsBn={keyHighlightsBn}
                setKeyHighlightsBn={setKeyHighlightsBn}
                introParagraphsBn={introParagraphsBn}
                setIntroParagraphsBn={setIntroParagraphsBn}
              />
            </TabsContent>

            <TabsContent value="author">
              <BlogAuthorFaqTab
                isEn={isEn}
                authorNameBn={authorNameBn}
                setAuthorNameBn={setAuthorNameBn}
                authorNameEn={authorNameEn}
                setAuthorNameEn={setAuthorNameEn}
                authorRoleBn={authorRoleBn}
                setAuthorRoleBn={setAuthorRoleBn}
                authorRoleEn={authorRoleEn}
                setAuthorRoleEn={setAuthorRoleEn}
                faqs={faqs}
                setFaqs={setFaqs}
              />
            </TabsContent>

            <TabsContent value="tags" className="space-y-4 pt-3">
              <div className="space-y-1.5">
                <Label htmlFor="tagsInput" className="text-xs font-semibold">
                  {isEn ? "Tags (Comma-separated)" : "ট্যাগসমূহ (কমা দিয়ে লিখুন)"}
                </Label>
                <Input
                  id="tagsInput"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="ফেনী হাসপাতাল, চিকিৎসা, হেলথ ক্লাব"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="keywordsInput" className="text-xs font-semibold">
                  {isEn ? "SEO Meta Keywords (Comma-separated)" : "এসইও কিওয়ার্ড (কমা দিয়ে লিখুন)"}
                </Label>
                <Input
                  id="keywordsInput"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="best hospital feni, feni doctor serial, icu ambulance"
                />
              </div>

              {post && (
                <div className="p-3 border rounded-xl bg-muted/40 text-xs space-y-1">
                  <div className="font-semibold text-foreground">
                    {isEn ? "Specialized Section Status" : "স্পেশালাইজড ডেটা স্ট্যাটাস"}
                  </div>
                  <p className="text-muted-foreground">
                    {post.doctorGroups ? `• ${post.doctorGroups.length} Doctor Specialty Groups` : ""}
                    {post.hospitals ? ` • ${post.hospitals.length} Hospital Reviews` : ""}
                    {post.diagnosticCenters ? ` • ${post.diagnosticCenters.length} Diagnostic Centers` : ""}
                    {post.dentalClinics ? ` • ${post.dentalClinics.length} Dental Clinics` : ""}
                    {post.physiotherapyCenters ? ` • ${post.physiotherapyCenters.length} Physio Centers` : ""}
                    {(!post.doctorGroups && !post.hospitals && !post.diagnosticCenters && !post.dentalClinics && !post.physiotherapyCenters)
                      ? isEn
                        ? "Standard article format (Rich custom tables not attached)."
                        : "স্ট্যান্ডার্ড আর্টিকেল ফরম্যাট (কাস্টম স্পেশালাইজড টেবিল নেই)।"
                      : isEn
                        ? " (These rich components are safely preserved during edit)."
                        : " (এই রিচ স্পেশালাইজড ডাটা এডিটের সময় সম্পূর্ণ সংরক্ষিত থাকবে)।"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 pt-2 sm:pt-4 sm:-mx-6 sm:-mb-6 sm:p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              {isEn ? "Cancel" : "বাতিল"}
            </Button>
            <Button type="submit" disabled={saving} className="gap-1.5 font-bold">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {post
                ? isEn
                  ? "Update Blog"
                  : "ব্লগ আপডেট করুন"
                : isEn
                  ? "Publish Blog"
                  : "ব্লগ প্রকাশ করুন"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
