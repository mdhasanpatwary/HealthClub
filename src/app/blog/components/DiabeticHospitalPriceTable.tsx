import { DiabeticHospitalPackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface DiabeticHospitalPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: DiabeticHospitalPackageItem[];
  };
  locale?: string;
}

export function DiabeticHospitalPriceTable({
  pricingData,
  locale = "bn",
}: DiabeticHospitalPriceTableProps) {
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
      id="diabetic-hospital-price-guide"
      title={
        isEn
          ? "Feni Diabetic Association Hospital Service & Lab Price Benchmark (2026)"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? "Subsidized guide book rates & diagnostic charges at Feni Diabetic Hospital vs. private diagnostic market benchmarks, with 10-30% Health Club member discounts on referral tests."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Hospital Service / Diagnostic Test" : "হাসপাতাল সেবা বা ডায়াগনস্টিক পরীক্ষা",
        regularPrice: isEn ? "Subsidized Fee / Private Market Benchmark" : "সমিতি ইউজার ফি / বেসরকারি বাজারদর",
        benefit: isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা",
        duration: isEn ? "Turnaround / Schedule" : "সময়সূচি বা ডেলিভারি",
      }}
      conversionBanner={{
        text: isEn
          ? "Whenever specialized cardiac Doppler, 1.5T MRI, continuous glucose monitoring (CGM), or advanced vascular Doppler scans are referred outside, Health Club members enjoy 10-30% guaranteed savings at verified partner centers across Feni."
          : "ডায়াবেটিক সমিতি হাসপাতালের বাইরে কার্ডিয়াক ইকো, ১.৫ টেসলা এমআরআই, ভাস্কুলার ডপলার বা উচ্চমানের হরমোন টেস্ট রেফার করা হলে হেলথ ক্লাব মেম্বার কার্ডে পার্টনার ডায়াগনস্টিকে ১০-৩০% নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
