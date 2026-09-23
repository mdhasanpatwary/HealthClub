import { SurgicalCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface SurgeryPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    titleEn?: string;
    subtitleEn?: string;
    packages: SurgicalCarePackageItem[];
  };
  locale?: string;
}

export function SurgeryPriceTable({
  pricingData,
  locale = "bn",
}: SurgeryPriceTableProps) {
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
      id="surgery-price-guide"
      title={
        isEn
          ? pricingData.titleEn || "General, Laparoscopic & Laser Surgery Cost Guide"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? pricingData.subtitleEn ||
            "Standard market fees for laparoscopic gallbladder surgery, laser piles procedures, appendix, hernia, and hospital OT charges in Feni with 10-30% Health Club member savings."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Surgical Procedure / Package" : "অপারেশন / সার্জিক্যাল প্রসিডিউরের নাম",
        regularPrice: isEn ? "Standard Market Fee" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা",
        duration: isEn ? "Stay & Recovery" : "হাসপাতাল অবস্থান ও সুবিধা",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members enjoy 10-30% savings on surgery OT charges, post-op cabin beds, diagnostic laparoscopy, and proctology laser care at partner hospitals in Feni."
          : "হেলথ ক্লাব মেম্বারশিপ থাকলে ফেনীর পার্টনার হাসপাতালে ল্যাপারোস্কোপিক গলব্লাডার অপারেশন, লেজার পাইলস সার্জারি, ওটি চার্জ এবং পোস্ট-অপারেটিভ কেবিনে ১০-৩০% নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
