import { CardiacPackagePriceItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface CardiacPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: CardiacPackagePriceItem[];
  };
  locale?: string;
}

export function CardiacPriceTable({
  pricingData,
  locale = "bn",
}: CardiacPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.testOrPackageNameEn : item.testOrPackageNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.reportTimeBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="cardiac-price-guide"
      title={isEn ? "Cardiac Diagnostic Costs & Member Savings Guide" : pricingData.titleBn}
      subtitle={
        isEn
          ? "Standard market fees for cardiac diagnostic tests in Feni and 10-30% discount for Health Club members."
          : "ফেনীর শীর্ষ ডায়াগনস্টিক সেন্টারে কার্ডিয়াক পরীক্ষাগুলোর সাধারণ বাজারদর এবং হেলথ ক্লাব মেম্বারদের জন্য ১০-৩০% ডিসকাউন্ট সুবিধা।"
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Test & Category" : "হৃদরোগ পরীক্ষা ও বিভাগ",
        regularPrice: isEn ? "Regular Market Fee" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: isEn ? "Report Time" : "রিপোর্ট পাওয়ার সময়",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members get a 10-30% discount on all cardiac diagnostic tests at verified partner centers across Feni (including Feni Heart Foundation Hospital, Popular, Chevron, and LabAid)."
          : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে (ফেনী হার্ট ফাউন্ডেশন, পপুলার, শেভরন ও ল্যাবএইড) সকল কার্ডিয়াক টেস্টে ১০-৩০% ডিসকাউন্ট পাবেন।",
        buttonText: isEn ? "Join Health Club" : "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
