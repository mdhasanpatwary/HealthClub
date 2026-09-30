export interface SerpValidationRule {
  id: string;
  category: "title" | "description" | "bilingual" | "image" | "schema" | "safety";
  nameBn: string;
  nameEn: string;
  status: "pass" | "warn" | "fail";
  scoreWeight: number;
  messageBn: string;
  messageEn: string;
  recommendationBn?: string;
  recommendationEn?: string;
}

export interface SerpLengthMetric {
  length: number;
  pixelEstimate: number;
  status: "optimal" | "short" | "long" | "truncated";
  labelBn: string;
  labelEn: string;
}

export interface SerpAnalysisResult {
  score: number; // 0 to 100
  grade: "A+" | "A" | "B" | "C" | "F";
  statusColor: string;
  rules: SerpValidationRule[];
  titleBnMetric: SerpLengthMetric;
  titleEnMetric: SerpLengthMetric;
  descBnMetric: SerpLengthMetric;
  descEnMetric: SerpLengthMetric;
  summary: {
    passedCount: number;
    warnCount: number;
    failCount: number;
  };
}

/**
 * Approximates Google desktop SERP pixel width for Arial/Noto Sans 20px (Title)
 */
export function estimateTitlePixelWidth(text: string): number {
  if (!text) return 0;
  let px = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[ijlI1\.,\':;\|!\s]/.test(char)) {
      px += 5;
    } else if (/[wmWM@#]/.test(char)) {
      px += 17;
    } else if (/[A-Z]/.test(char)) {
      px += 13;
    } else if (/[\u0980-\u09FF]/.test(char)) {
      // Bengali characters
      px += 11;
    } else {
      px += 10;
    }
  }
  return Math.round(px);
}

/**
 * Approximates Google desktop SERP pixel width for Arial 14px (Snippet)
 */
export function estimateSnippetPixelWidth(text: string): number {
  if (!text) return 0;
  let px = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[ijlI1\.,\':;\|!\s]/.test(char)) {
      px += 3.5;
    } else if (/[wmWM@#]/.test(char)) {
      px += 12;
    } else if (/[A-Z]/.test(char)) {
      px += 9;
    } else if (/[\u0980-\u09FF]/.test(char)) {
      px += 7.8;
    } else {
      px += 7;
    }
  }
  return Math.round(px);
}

export function evaluateTitleMetric(text: string): SerpLengthMetric {
  const length = (text || "").trim().length;
  const pixelEstimate = estimateTitlePixelWidth(text);

  if (length >= 50 && length <= 60) {
    return {
      length,
      pixelEstimate,
      status: "optimal",
      labelBn: "পারফেক্ট দৈর্ঘ্য (৫০-৬০ অক্ষর)",
      labelEn: "Optimal Length (50-60 chars)",
    };
  }
  if (length < 50) {
    return {
      length,
      pixelEstimate,
      status: "short",
      labelBn: `অল্প ছোট (${length}/৫০ অক্ষর)`,
      labelEn: `Too Short (${length}/50 chars)`,
    };
  }
  if (length <= 68 && pixelEstimate <= 590) {
    return {
      length,
      pixelEstimate,
      status: "long",
      labelBn: `সামান্য দীর্ঘ (${length} অক্ষর)`,
      labelEn: `Slightly Long (${length} chars)`,
    };
  }
  return {
    length,
    pixelEstimate,
    status: "truncated",
    labelBn: `কাটা পড়বে (>৬০ অক্ষর, ~${pixelEstimate}px)`,
    labelEn: `Truncated (>60 chars, ~${pixelEstimate}px)`,
  };
}

export function evaluateSnippetMetric(text: string): SerpLengthMetric {
  const length = (text || "").trim().length;
  const pixelEstimate = estimateSnippetPixelWidth(text);

  if (length >= 140 && length <= 160) {
    return {
      length,
      pixelEstimate,
      status: "optimal",
      labelBn: "আদর্শ সাইজ (১৪০-১৬০ অক্ষর)",
      labelEn: "Optimal Size (140-160 chars)",
    };
  }
  if (length < 140) {
    return {
      length,
      pixelEstimate,
      status: "short",
      labelBn: `কম তথ্যবহুল (${length}/১৪০ অক্ষর)`,
      labelEn: `Too Short (${length}/140 chars)`,
    };
  }
  return {
    length,
    pixelEstimate,
    status: "truncated",
    labelBn: `সার্চে কাটা পড়বে (${length}/১৬০ অক্ষর)`,
    labelEn: `Truncated on SERP (${length}/160 chars)`,
  };
}
