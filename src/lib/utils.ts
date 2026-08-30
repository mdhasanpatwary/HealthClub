import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toBanglaNums(num: number | string): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((digit) => {
      const parsed = parseInt(digit, 10);
      return isNaN(parsed) ? digit : banglaDigits[parsed];
    })
    .join("");
}

/**
 * Parses a discount string that may contain Bangla or English numerals
 * (e.g., "১০-৫০% ডিসকাউন্ট" or "10-50% Discount") and returns
 * the rate as a decimal (e.g. 0.50 for 50%, capped at 0.70).
 */
export function parseDiscountPercentage(discountStr: string): number {
  if (!discountStr) return 0.10;

  const banglaToEnglishMap: { [key: string]: string } = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };

  let converted = discountStr;
  for (const [bangla, english] of Object.entries(banglaToEnglishMap)) {
    converted = converted.replaceAll(bangla, english);
  }

  // 1. First priority: look for numbers explicitly marked with % (e.g., "10-50%", "15%")
  const percentMatches = [...converted.matchAll(/(\d+(?:\.\d+)?)\s*%/g)];
  if (percentMatches.length > 0) {
    const nums = percentMatches.map((m) => parseFloat(m[1])).filter((n) => !isNaN(n));
    if (nums.length > 0) {
      const maxNum = Math.max(...nums);
      const rate = maxNum / 100;
      return Math.max(0, Math.min(rate, 0.70));
    }
  }

  // 2. Second priority: look for standalone numbers <= 100 (filters out phone numbers or 500+ tests)
  const standaloneMatches = [...converted.matchAll(/(\d+(?:\.\d+)?)/g)];
  if (standaloneMatches.length > 0) {
    const validNums = standaloneMatches
      .map((m) => parseFloat(m[1]))
      .filter((n) => !isNaN(n) && n <= 100);

    if (validNums.length > 0) {
      const maxNum = Math.max(...validNums);
      const rate = maxNum >= 1 ? maxNum / 100 : maxNum;
      return Math.max(0, Math.min(rate, 0.70));
    }
  }

  return 0.10;
}

