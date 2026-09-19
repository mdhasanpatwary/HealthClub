import { NeurologyCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface NeurologyPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: NeurologyCarePackageItem[];
  };
  locale?: string;
}

export function NeurologyPriceTable({
  pricingData,
  locale = "bn",
}: NeurologyPriceTableProps) {
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
      id="neurology-price-guide"
      title={
        isEn
          ? "Brain MRI, Emergency CT, EEG & Neuro Diagnostics Cost Guide"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? "Standard market fees for Brain MRI (1.5 Tesla), emergency CT scan, Digital Video EEG, NCS/EMG, and stroke ICU support in Feni with 10-30% Health Club member savings."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Neurological Test / Procedure" : "পরীক্ষা বা নিউরো প্রসিডিউরের নাম",
        regularPrice: isEn ? "Standard Market Fee" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা",
        duration: isEn ? "Report & Turnaround" : "রিপোর্ট ও টেস্টের সময়",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members receive 10-30% guaranteed savings on Brain MRI, Emergency CT Scan, Digital Video EEG, NCS, and stroke ICU bed support across verified diagnostic labs and hospitals in Feni."
          : "হেলথ ক্লাব মেম্বারশিপ থাকলে ফেনীর পার্টনার ডায়াগনস্টিক ও হাসপাতালে ব্রেন এমআরআই, জরুরি সিটি স্ক্যান, ডিজিটাল ইইজি, এনসিএস এবং স্ট্রোক আইসিইউ বেডে ১০-৩০% নিশ্চিত ক্যাশলেস ছাড় পাওয়া যায়।",
        buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
