import { KidneyPackagePriceItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface KidneyPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: KidneyPackagePriceItem[];
  };
  locale?: string;
}

export function KidneyPriceTable({
  pricingData,
  locale = "bn",
}: KidneyPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.testOrPackageNameEn : item.testOrPackageNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.turnaroundOrDurationBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="kidney-price-guide"
      title={isEn ? "Dialysis & Kidney Diagnostic Cost Guide" : pricingData.titleBn}
      subtitle={
        isEn
          ? "Subsidized government hospital vs private dialysis rates in Feni, routine renal panel costs, and 10-30% Health Club member discounts."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Procedure / Investigation & Category" : "ডায়ালাইসিস ও পরীক্ষা এবং বিভাগ",
        regularPrice: isEn ? "Standard Fee Range" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা",
        duration: isEn ? "Duration / Report Time" : "সময়কাল / রিপোর্ট",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members save 10-30% on all renal diagnostic tests (Serum Creatinine, Electrolytes, Urine ACR, USG KUB) at verified partner centers including DD Lab, Ibn Sina, Chevron, and Labaid in Feni."
          : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার ডায়াগনস্টিক ও হাসপাতালে (ডিডি ল্যাব, নিউ ইবনে সিনা, শেভরন ও ল্যাবএইড) সিরাম ক্রিয়েটিনিন, ইলেক্ট্রোলাইটস, ইউরিন এসিআর ও ইউএসজিসহ সকল কিডনি পরীক্ষায় ১০-৩০% ডিসকাউন্ট পাবেন।",
        buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ কার্ড নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
