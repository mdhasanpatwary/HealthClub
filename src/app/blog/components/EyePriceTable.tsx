import { EyeCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface EyePriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: EyeCarePackageItem[];
  };
  locale?: string;
}

export function EyePriceTable({
  pricingData,
  locale = "bn",
}: EyePriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.procedureOrTestNameEn : item.procedureOrTestNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.durationOrTurnaroundBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="eye-price-guide"
      title={
        isEn
          ? "Eye Test, Cataract Surgery & Laser Cost Guide"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? "Estimated surgical and diagnostic fees for Phaco cataract surgery, OCT scans, glaucoma tonometry, and vision exams in Feni with 10-30% Health Club member savings."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Procedure / Diagnostic Test" : "টেস্ট / প্রসিডিউরের নাম ও ধরন",
        regularPrice: isEn ? "Standard Rate" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা",
        duration: isEn ? "Duration / Turnaround" : "সময়কাল / সুবিধা",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members enjoy direct discounts on blood sugar panels, OCT retina scans, and optical investigations at partner diagnostic labs in Feni."
          : "হেলথ ক্লাব মেম্বারশিপ থাকলে পার্টনার ডায়াগনস্টিক ল্যাবে ওসিটি স্ক্যান, ফান্ডাস পরীক্ষা, প্রি-অপারেটিভ রক্ত পরীক্ষা ও চশমায় নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: isEn ? "Get Membership Card" : "মেম্বারশিপ সুবিধা দেখুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
