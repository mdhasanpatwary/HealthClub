import { EntCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface EntPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: EntCarePackageItem[];
  };
  locale?: string;
}

export function EntPriceTable({
  pricingData,
  locale = "bn",
}: EntPriceTableProps) {
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
      id="ent-price-guide"
      title={
        isEn
          ? "ENT Diagnostic Tests, Hearing & Surgery Cost Guide"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? "Standard market fees for pure tone audiometry, PNS CT scans, eardrum repairs, and tonsillectomies in Feni with 10-30% Health Club member savings."
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
          ? "Health Club members receive verified discounts on pure-tone audiometry, PNS CT imaging, diagnostic nasal endoscopy, and ENT surgeries at partner centers in Feni."
          : "হেলথ ক্লাব মেম্বারশিপ থাকলে পার্টনার হাসপাতাল ও ডায়াগনস্টিক ল্যাবে পিউর টোন অডিওমেট্রি, পিএনএস এক্স-রে, সিটি স্ক্যান ও কানের মাইক্রোসার্জারিতে নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
