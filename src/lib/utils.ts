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
 * (e.g., "১০-২৫% ডিসকাউন্ট" or "10-25% Discount") and returns
 * the rate as a decimal (0.25 for 25%).
 */
export function parseDiscountPercentage(discountStr: string): number {
  const banglaToEnglishMap: { [key: string]: string } = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };

  let converted = discountStr || "";
  for (const [bangla, english] of Object.entries(banglaToEnglishMap)) {
    converted = converted.replaceAll(bangla, english);
  }

  const matches = [...converted.matchAll(/(\d+(?:\.\d+)?)/g)];
  if (matches.length > 0) {
    const nums = matches.map((m) => parseFloat(m[1]));
    const maxNum = Math.max(...nums);
    const rate = maxNum > 1 ? maxNum / 100 : maxNum;
    return Math.min(rate, 0.30);
  }

  return 0.10;
}
