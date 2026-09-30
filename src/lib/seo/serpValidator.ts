import { BlogPost } from "@/types/blog";
import {
  SerpValidationRule,
  SerpAnalysisResult,
  evaluateTitleMetric,
  evaluateSnippetMetric,
} from "./serpMetrics";

export * from "./serpMetrics";

export function analyzeBlogPostSerp(post: Partial<BlogPost> | null): SerpAnalysisResult {
  if (!post) {
    return {
      score: 0,
      grade: "F",
      statusColor: "text-destructive",
      rules: [],
      titleBnMetric: evaluateTitleMetric(""),
      titleEnMetric: evaluateTitleMetric(""),
      descBnMetric: evaluateSnippetMetric(""),
      descEnMetric: evaluateSnippetMetric(""),
      summary: { passedCount: 0, warnCount: 0, failCount: 0 },
    };
  }

  const rules: SerpValidationRule[] = [];

  const titleBn = (post.titleBn || "").trim();
  const titleEn = (post.titleEn || "").trim();
  const excerptBn = (post.excerptBn || "").trim();
  const excerptEn = (post.excerptEn || "").trim();
  const slug = (post.slug || "").trim();
  const coverImage = (post.coverImage || "").trim();
  const coverImageAlt = (post.coverImageAlt || "").trim();
  const metaKeywords = post.metaKeywords || [];
  const tags = post.tags || [];
  const faqs = post.faqs || [];

  const titleBnMetric = evaluateTitleMetric(titleBn);
  const titleEnMetric = evaluateTitleMetric(titleEn);
  const descBnMetric = evaluateSnippetMetric(excerptBn);
  const descEnMetric = evaluateSnippetMetric(excerptEn);

  // 1. Title Bangla
  if (!titleBn) {
    rules.push({
      id: "title_bn_presence",
      category: "title",
      nameBn: "বাংলা শিরোনাম উপস্থিতি",
      nameEn: "Bangla Title Presence",
      status: "fail",
      scoreWeight: 15,
      messageBn: "বাংলা শিরোনাম অনুপস্থিত।",
      messageEn: "Bangla title is missing.",
      recommendationBn: "একটি আকর্ষণীয় ৫০-৬০ অক্ষরের বাংলা শিরোনাম যোগ করুন।",
      recommendationEn: "Add an engaging 50-60 character Bangla title.",
    });
  } else if (titleBnMetric.status === "optimal") {
    rules.push({
      id: "title_bn_length",
      category: "title",
      nameBn: "বাংলা শিরোনামের দৈর্ঘ্য",
      nameEn: "Bangla Title Length",
      status: "pass",
      scoreWeight: 15,
      messageBn: `পারফেক্ট দৈর্ঘ্য: ${titleBn.length} অক্ষর (~${titleBnMetric.pixelEstimate}px)।`,
      messageEn: `Optimal length: ${titleBn.length} chars (~${titleBnMetric.pixelEstimate}px).`,
    });
  } else if (titleBnMetric.status === "short") {
    rules.push({
      id: "title_bn_length",
      category: "title",
      nameBn: "বাংলা শিরোনামের দৈর্ঘ্য",
      nameEn: "Bangla Title Length",
      status: "warn",
      scoreWeight: 10,
      messageBn: `শিরোনাম কিছুটা ছোট (${titleBn.length} অক্ষর)। ৫০-৬০ অক্ষরের মধ্যে রাখা উত্তম।`,
      messageEn: `Title is somewhat short (${titleBn.length} chars). Target 50-60 chars.`,
      recommendationBn: "ফেনী বা মূল কীওয়ার্ড যোগ করে ৫০ অক্ষরের কাছাকাছি করুন।",
      recommendationEn: "Include key local keywords to reach ~50 chars.",
    });
  } else {
    rules.push({
      id: "title_bn_length",
      category: "title",
      nameBn: "বাংলা শিরোনামের দৈর্ঘ্য",
      nameEn: "Bangla Title Length",
      status: "warn",
      scoreWeight: 10,
      messageBn: `শিরোনাম বড় (${titleBn.length} অক্ষর, ~${titleBnMetric.pixelEstimate}px)। গুগলে কাটা পড়তে পারে।`,
      messageEn: `Title is long (${titleBn.length} chars, ~${titleBnMetric.pixelEstimate}px). May be truncated.`,
      recommendationBn: "৬০ অক্ষরের মধ্যে সীমাবদ্ধ রাখুন।",
      recommendationEn: "Keep within 60 characters for zero truncation.",
    });
  }

  // 2. Title English
  if (!titleEn) {
    rules.push({
      id: "title_en_presence",
      category: "title",
      nameBn: "ইংরেজি শিরোনাম উপস্থিতি",
      nameEn: "English Title Presence",
      status: "fail",
      scoreWeight: 10,
      messageBn: "ইংরেজি শিরোনাম অনুপস্থিত। আন্তর্জাতিক ক্রল ও সাইটম্যাপের জন্য এটি জরুরি।",
      messageEn: "English title is missing.",
      recommendationBn: "বিলিঙ্গুয়াল এআই ইন্ডেক্সিং এর জন্য ইংরেজি টাইটেল দিন।",
      recommendationEn: "Provide English title for bilingual indexing.",
    });
  } else {
    rules.push({
      id: "title_en_length",
      category: "title",
      nameBn: "ইংরেজি শিরোনাম কোয়ালিটি",
      nameEn: "English Title Quality",
      status: titleEnMetric.status === "optimal" || titleEnMetric.status === "long" ? "pass" : "warn",
      scoreWeight: 10,
      messageBn: `ইংরেজি শিরোনাম: ${titleEn.length} অক্ষর (${titleEnMetric.labelBn})।`,
      messageEn: `English Title: ${titleEn.length} chars (${titleEnMetric.labelEn}).`,
    });
  }

  // 3. Meta Description (Bangla Excerpt)
  if (!excerptBn) {
    rules.push({
      id: "desc_bn_presence",
      category: "description",
      nameBn: "বাংলা মেটা সারাংশ",
      nameEn: "Bangla Meta Description",
      status: "fail",
      scoreWeight: 15,
      messageBn: "বাংলা সারাংশ (মেটা ডেসক্রিপশন) খালি।",
      messageEn: "Bangla excerpt is missing.",
      recommendationBn: "১৪০-১৬০ অক্ষরের তথ্যবহুল সারাংশ লিখুন।",
      recommendationEn: "Write an informative 140-160 character description.",
    });
  } else if (descBnMetric.status === "optimal") {
    rules.push({
      id: "desc_bn_length",
      category: "description",
      nameBn: "বাংলা মেটা সারাংশের দৈর্ঘ্য",
      nameEn: "Bangla Meta Description Length",
      status: "pass",
      scoreWeight: 15,
      messageBn: `আদর্শ সাইজ: ${excerptBn.length} অক্ষর (~${descBnMetric.pixelEstimate}px)।`,
      messageEn: `Optimal size: ${excerptBn.length} chars (~${descBnMetric.pixelEstimate}px).`,
    });
  } else {
    rules.push({
      id: "desc_bn_length",
      category: "description",
      nameBn: "বাংলা মেটা সারাংশের দৈর্ঘ্য",
      nameEn: "Bangla Meta Description Length",
      status: "warn",
      scoreWeight: 10,
      messageBn: `সারাংশ ${descBnMetric.status === "short" ? "ছোট" : "বড়"}: ${excerptBn.length} অক্ষর (${descBnMetric.labelBn})।`,
      messageEn: `Excerpt is ${descBnMetric.status}: ${excerptBn.length} chars (${descBnMetric.labelEn}).`,
      recommendationBn: "১৪০ থেকে ১৬০ অক্ষরের মাঝে রাখার চেষ্টা করুন যাতে সম্পূর্ণ বাক্য দেখা যায়।",
      recommendationEn: "Target 140-160 characters for complete visibility.",
    });
  }

  // 4. Meta Description (English Excerpt)
  if (!excerptEn) {
    rules.push({
      id: "desc_en_presence",
      category: "description",
      nameBn: "ইংরেজি মেটা সারাংশ",
      nameEn: "English Meta Description",
      status: "warn",
      scoreWeight: 8,
      messageBn: "ইংরেজি সারাংশ খালি। বৈশ্বিক সার্চ ও এআই বটের জন্য ইংরেজি সারাংশ থাকা উত্তম।",
      messageEn: "English excerpt is missing.",
      recommendationBn: "ইংরেজি সারাংশ পূরণ করুন।",
      recommendationEn: "Fill in the English excerpt.",
    });
  } else {
    rules.push({
      id: "desc_en_presence",
      category: "description",
      nameBn: "ইংরেজি মেটা সারাংশ",
      nameEn: "English Meta Description",
      status: "pass",
      scoreWeight: 8,
      messageBn: `ইংরেজি সারাংশ সম্পন্ন (${excerptEn.length} অক্ষর)।`,
      messageEn: `English description complete (${excerptEn.length} chars).`,
    });
  }

  // 5. Canonical URL Slug
  const isSlugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  if (!slug) {
    rules.push({
      id: "slug_health",
      category: "safety",
      nameBn: "URL স্লাগ ভ্যালিডেশন",
      nameEn: "URL Slug Validation",
      status: "fail",
      scoreWeight: 10,
      messageBn: "স্লাগ খালি। একটি পরিষ্কার URL আবশ্যক।",
      messageEn: "Slug is missing.",
    });
  } else if (!isSlugValid) {
    rules.push({
      id: "slug_health",
      category: "safety",
      nameBn: "URL স্লাগ ভ্যালিডেশন",
      nameEn: "URL Slug Validation",
      status: "warn",
      scoreWeight: 5,
      messageBn: "স্লাগে ক্যাপিটাল লেটার বা স্পেশাল ক্যারেক্টার রয়েছে।",
      messageEn: "Slug contains capital letters or special characters.",
      recommendationBn: "শুধুমাত্র ছোট হাতের ইংরেজি ও হাইফেন ব্যবহার করুন।",
      recommendationEn: "Use only lowercase letters and hyphens.",
    });
  } else {
    rules.push({
      id: "slug_health",
      category: "safety",
      nameBn: "URL স্লাগ ভ্যালিডেশন",
      nameEn: "URL Slug Validation",
      status: "pass",
      scoreWeight: 10,
      messageBn: `পরিষ্কার এসইও ফ্রেন্ডলি স্লাগ: /blog/${slug}`,
      messageEn: `Clean SEO friendly slug: /blog/${slug}`,
    });
  }

  // 6. Cover Image & Alt Text
  const hasCoverImage = coverImage && (coverImage.startsWith("/") || coverImage.startsWith("http"));
  const hasValidExt = /\.(webp|png|jpe?g|svg)$/i.test(coverImage);
  if (!hasCoverImage) {
    rules.push({
      id: "cover_image_health",
      category: "image",
      nameBn: "কভার ইমেজ ভ্যালিডেশন",
      nameEn: "Cover Image Validation",
      status: "fail",
      scoreWeight: 10,
      messageBn: "কভার ইমেজ লিঙ্ক নেই বা ভুল ফরম্যাটে রয়েছে।",
      messageEn: "Cover image is missing or invalid.",
      recommendationBn: "একটি ভ্যালিড WebP বা JPG ইমেজ পাথ যোগ করুন।",
      recommendationEn: "Provide a valid WebP or JPG image path.",
    });
  } else if (!hasValidExt) {
    rules.push({
      id: "cover_image_health",
      category: "image",
      nameBn: "কভার ইমেজ ফরম্যাট",
      nameEn: "Cover Image Format",
      status: "warn",
      scoreWeight: 6,
      messageBn: "ইমেজের এক্সটেনশন (.webp, .png, .jpg) নির্দিষ্ট করা নেই।",
      messageEn: "Image extension (.webp, .png, .jpg) is missing.",
    });
  } else if (!coverImageAlt || coverImageAlt.length < 5) {
    rules.push({
      id: "cover_image_health",
      category: "image",
      nameBn: "ইমেজ অল্ট টেক্সট (Alt Text)",
      nameEn: "Image Alt Text",
      status: "warn",
      scoreWeight: 8,
      messageBn: "ইমেজ অল্ট টেক্সট খালি বা খুব ছোট। গুগল ইমেজ সার্চের জন্য অল্ট টেক্সট জরুরি।",
      messageEn: "Image alt text is missing or too short.",
      recommendationBn: "ছবি সম্পর্কিত একটি বর্ণনামূলক অল্ট টেক্সট লিখুন।",
      recommendationEn: "Write a descriptive alt text for Google Image search.",
    });
  } else {
    rules.push({
      id: "cover_image_health",
      category: "image",
      nameBn: "কভার ইমেজ ও অল্ট টেক্সট",
      nameEn: "Cover Image & Alt Text",
      status: "pass",
      scoreWeight: 10,
      messageBn: `বৈধ ইমেজ ফরম্যাট ও অল্ট টেক্সট প্রস্তুত: "${coverImageAlt}"।`,
      messageEn: `Valid image format & alt text present.`,
    });
  }

  // 7. Bilingual Keywords & Tags
  const hasBnKeywords = metaKeywords.some((k) => /[\u0980-\u09FF]/.test(k));
  const hasEnKeywords = metaKeywords.some((k) => /[a-zA-Z]/.test(k));
  if (metaKeywords.length === 0 && tags.length === 0) {
    rules.push({
      id: "bilingual_keywords",
      category: "bilingual",
      nameBn: "বিলিঙ্গুয়াল এসইও কিওয়ার্ড",
      nameEn: "Bilingual SEO Keywords",
      status: "warn",
      scoreWeight: 8,
      messageBn: "কোনো এসইও কিওয়ার্ড বা ট্যাগ যোগ করা হয়নি।",
      messageEn: "No SEO keywords or tags specified.",
      recommendationBn: "বাংলা ও ইংরেজি উভয় ভাষায় ৪-৬টি প্রাসঙ্গিক কিওয়ার্ড দিন।",
      recommendationEn: "Add 4-6 relevant bilingual keywords.",
    });
  } else if (!hasBnKeywords || !hasEnKeywords) {
    rules.push({
      id: "bilingual_keywords",
      category: "bilingual",
      nameBn: "বিলিঙ্গুয়াল কিওয়ার্ড ব্যালেন্স",
      nameEn: "Bilingual Keyword Balance",
      status: "warn",
      scoreWeight: 8,
      messageBn: `কিওয়ার্ডে শুধুমাত্র ${hasBnKeywords ? "বাংলা" : "ইংরেজি"} রয়েছে। উভয় ভাষার কিওয়ার্ড যুক্ত করুন।`,
      messageEn: `Only ${hasBnKeywords ? "Bangla" : "English"} keywords found. Provide both.`,
    });
  } else {
    rules.push({
      id: "bilingual_keywords",
      category: "bilingual",
      nameBn: "বিলিঙ্গুয়াল কিওয়ার্ড ও ট্যাগ",
      nameEn: "Bilingual Keywords & Tags",
      status: "pass",
      scoreWeight: 10,
      messageBn: `সঠিক বিলিঙ্গুয়াল কিওয়ার্ড বিন্যাস (${metaKeywords.length} কিওয়ার্ড, ${tags.length} ট্যাগ)।`,
      messageEn: `Proper bilingual keywords (${metaKeywords.length} keywords, ${tags.length} tags).`,
    });
  }

  // 8. FAQ Rich Snippet Schema
  const validFaqs = faqs.filter(
    (f) => f.questionBn?.trim() && f.answerBn?.trim() && f.questionEn?.trim() && f.answerEn?.trim()
  );
  if (validFaqs.length === 0) {
    rules.push({
      id: "faq_schema",
      category: "schema",
      nameBn: "গুগল FAQPage রিচ স্নsnippet",
      nameEn: "Google FAQPage Rich Snippet",
      status: "warn",
      scoreWeight: 6,
      messageBn: "কোনো সম্পূর্ণ বিলিঙ্গুয়াল FAQ নেই। FAQ যুক্ত করলে গুগলে বড় ড্রপডাউন রেজাল্ট পাওয়া যায়।",
      messageEn: "No bilingual FAQ items found.",
      recommendationBn: "কমপক্ষে ৩-৫টি সাধারণ প্রশ্নের উত্তর যোগ করুন।",
      recommendationEn: "Add 3-5 QA pairs for Google FAQ rich snippet.",
    });
  } else if (validFaqs.length < 3) {
    rules.push({
      id: "faq_schema",
      category: "schema",
      nameBn: "গুগল FAQPage রিচ স্নsnippet",
      nameEn: "Google FAQPage Rich Snippet",
      status: "pass",
      scoreWeight: 10,
      messageBn: `${validFaqs.length}টি FAQ রয়েছে (৩টি বা তার বেশি থাকলে রিচ স্নিপেট নিশ্চিত হয়)।`,
      messageEn: `${validFaqs.length} FAQs present. Target >= 3 for full rich snippet.`,
    });
  } else {
    rules.push({
      id: "faq_schema",
      category: "schema",
      nameBn: "গুগল FAQPage রিচ স্নsnippet",
      nameEn: "Google FAQPage Rich Snippet",
      status: "pass",
      scoreWeight: 12,
      messageBn: `অনবদ্য: ${validFaqs.length}টি বিলিঙ্গুয়াল FAQ প্রস্তুত। গুগলে ড্রপডাউন অ্যাকর্ডিয়ন দেখাবে।`,
      messageEn: `Excellent: ${validFaqs.length} bilingual FAQs ready for Google accordion.`,
    });
  }

  // 9. E-E-A-T Medical Attribution
  const hasAuthor = Boolean(post.author?.nameBn && post.author?.roleBn);
  const hasReviewer = Boolean(post.reviewedBy?.doctorNameBn);
  if (!hasAuthor) {
    rules.push({
      id: "eeat_attribution",
      category: "safety",
      nameBn: "মেডিকেল E-E-A-T অট্রিবিউশন",
      nameEn: "Medical E-E-A-T Attribution",
      status: "warn",
      scoreWeight: 5,
      messageBn: "লেখকের নাম বা পদবি অনুপস্থিত। গুগল হেলথ আপডেটের জন্য পরিচয় আবশ্যক।",
      messageEn: "Author name or role missing.",
    });
  } else {
    rules.push({
      id: "eeat_attribution",
      category: "safety",
      nameBn: "মেডিকেল E-E-A-T অট্রিবিউশন",
      nameEn: "Medical E-E-A-T Attribution",
      status: "pass",
      scoreWeight: 10,
      messageBn: `লেখক: ${post.author?.nameBn} (${post.author?.roleBn})${hasReviewer ? ` · রিভিউয়ার: ${post.reviewedBy?.doctorNameBn}` : ""}।`,
      messageEn: `Author verified with proper E-E-A-T credentials.`,
    });
  }

  // Calculate final score
  let maxPossibleScore = 0;
  let earnedScore = 0;
  let passedCount = 0;
  let warnCount = 0;
  let failCount = 0;

  for (const r of rules) {
    maxPossibleScore += r.scoreWeight;
    if (r.status === "pass") {
      earnedScore += r.scoreWeight;
      passedCount++;
    } else if (r.status === "warn") {
      earnedScore += Math.round(r.scoreWeight * 0.55);
      warnCount++;
    } else {
      failCount++;
    }
  }

  const finalScore = maxPossibleScore > 0 ? Math.round((earnedScore / maxPossibleScore) * 100) : 0;

  let grade: "A+" | "A" | "B" | "C" | "F" = "F";
  let statusColor = "text-destructive";

  if (finalScore >= 95) {
    grade = "A+";
    statusColor = "text-emerald-600 dark:text-emerald-400";
  } else if (finalScore >= 85) {
    grade = "A";
    statusColor = "text-emerald-600 dark:text-emerald-400";
  } else if (finalScore >= 75) {
    grade = "B";
    statusColor = "text-amber-600 dark:text-amber-400";
  } else if (finalScore >= 60) {
    grade = "C";
    statusColor = "text-amber-600 dark:text-amber-400";
  } else {
    grade = "F";
    statusColor = "text-destructive";
  }

  return {
    score: finalScore,
    grade,
    statusColor,
    rules,
    titleBnMetric,
    titleEnMetric,
    descBnMetric,
    descEnMetric,
    summary: {
      passedCount,
      warnCount,
      failCount,
    },
  };
}
