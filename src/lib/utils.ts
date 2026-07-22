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
 * (e.g., "১০% ফ্ল্যাট ডিসকাউন্ট" or "10% Flat Discount") and returns
 * the rate as a decimal (0.10 for 10%).
 */
export function parseDiscountPercentage(discountStr: string): number {
  const banglaToEnglishMap: { [key: string]: string } = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };

  let converted = discountStr;
  for (const [bangla, english] of Object.entries(banglaToEnglishMap)) {
    converted = converted.replaceAll(bangla, english);
  }

  const match = converted.match(/(\d+(?:\.\d+)?)\s*%/);
  if (match) {
    return parseFloat(match[1]) / 100;
  }

  const fallbackMatch = converted.match(/(\d+(?:\.\d+)?)/);
  if (fallbackMatch) {
    const num = parseFloat(fallbackMatch[1]);
    return num > 1 ? num / 100 : num;
  }

  return 0.10;
}
