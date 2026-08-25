import { toBanglaNums } from "./utils";

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  textBn: string;
  textEn: string;
}

/**
 * Calculates reading time based on Bengali/English content.
 * Average reading speed: 200 words per minute.
 */
export function calculateReadingTime(
  content: string | string[],
  wpm = 200
): ReadingTimeResult {
  const text = Array.isArray(content) ? content.join(" ") : content || "";
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      minutes: 1,
      words: 0,
      textBn: "১ মিনিট পড়ার সময়",
      textEn: "1 min read",
    };
  }

  // Split by whitespace to get words
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wpm));

  return {
    minutes,
    words,
    textBn: `${toBanglaNums(minutes)} মিনিট পড়ার সময়`,
    textEn: `${minutes} min read`,
  };
}

/**
 * Calculate reading time for a health tip article based on content blocks and key takeaways.
 */
export function getArticleReadingTime(
  article: {
    contentBn?: string[];
    contentEn?: string[];
    keyTakeawaysBn?: string[];
    keyTakeawaysEn?: string[];
    readTimeBn?: string;
    readTimeEn?: string;
  },
  locale: "bn" | "en" = "bn"
): string {
  const isEn = locale === "en";
  const contentBlocks = isEn
    ? [...(article.contentEn || []), ...(article.keyTakeawaysEn || [])]
    : [...(article.contentBn || []), ...(article.keyTakeawaysBn || [])];

  if (contentBlocks.length > 0) {
    const calc = calculateReadingTime(contentBlocks);
    return isEn ? calc.textEn : calc.textBn;
  }

  return isEn
    ? article.readTimeEn || "2 min read"
    : article.readTimeBn || "২ মিনিট পড়ার সময়";
}
