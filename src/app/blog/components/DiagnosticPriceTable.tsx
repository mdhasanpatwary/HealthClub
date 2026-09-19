import { DiagnosticTestPriceItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface DiagnosticPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    tests: DiagnosticTestPriceItem[];
  };
  locale?: string;
}

export function DiagnosticPriceTable({
  pricingData,
  locale = "bn",
}: DiagnosticPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.tests.map((test) => ({
    name: isEn ? test.testNameEn : test.testNameBn,
    category: translateMedicalCategory(test.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(test.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(test.turnaroundTimeBn, isEn),
    discountText: isEn ? "10-30% Special Discount" : "১০-৩০% বিশেষ ছাড়",
  }));

  return (
    <BlogPriceTable
      id="price-guide"
      title={isEn ? "Common Diagnostic Tests & Cost Guide" : `৪. ${pricingData.titleBn}`}
      subtitle={
        isEn
          ? "Estimated diagnostic test charges in Feni and guaranteed savings with Health Club membership."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Test Name & Department" : "পরীক্ষার নাম ও বিভাগ",
        regularPrice: isEn ? "Regular Price Range" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: isEn ? "Report Time" : "রিপোর্ট সময়",
      }}
      conversionBanner={{
        title: isEn
          ? "Special member savings on diagnostic & pathology tests in Feni!"
          : "ফেনীর সেরা ডায়াগনস্টিকে টেস্টে বিশেষ মেম্বার ছাড় ও সাশ্রয় পান!",
        text: isEn
          ? "Get your digital Health Club membership card today for you and your entire family."
          : "আজই হেলথ ক্লাবের মেম্বারশিপ কার্ড সংগ্রহ করে পরিবারের ডায়াগনস্টিক খরচ সাশ্রয় করুন।",
        buttonText: isEn ? "Get Membership Card" : "মেম্বারশিপ কার্ড সংগ্রহ করুন",
        href: "/membership",
        variant: "button",
      }}
    />
  );
}
