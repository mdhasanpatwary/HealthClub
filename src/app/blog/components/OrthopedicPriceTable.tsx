import { OrthopedicCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface OrthopedicPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: OrthopedicCarePackageItem[];
  };
  locale?: string;
}

export function OrthopedicPriceTable({
  pricingData,
  locale = "bn",
}: OrthopedicPriceTableProps) {
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
      id="orthopedic-price-guide"
      title={
        isEn
          ? "Orthopedic Tests, Plaster & Joint Procedure Cost Guide"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? "Standard market fees for digital X-rays, 3D CT bone scans, MRI spine/knee, plaster casts, and joint procedures in Feni with 10-30% Health Club member savings."
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
          ? "Health Club members enjoy direct discounts on digital X-rays, 1.5T MRI spine imaging, BMD scans, and bone profile labs at partner diagnostic centers in Feni."
          : "হেলথ ক্লাব মেম্বারশিপ থাকলে পার্টনার ডায়াগনস্টিক ল্যাবে ডিজিটাল এক্স-রে, ১.৫ টেসলা এমআরআই, বিএমডি বোন ডেনসিটি ও রক্তের ক্যালসিয়াম-ভিটামিন ডি টেস্টে নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
