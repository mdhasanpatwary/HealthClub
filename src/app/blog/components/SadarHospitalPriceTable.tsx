import { SadarHospitalCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface SadarHospitalPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: SadarHospitalCarePackageItem[];
  };
  locale?: string;
}

export function SadarHospitalPriceTable({
  pricingData,
  locale = "bn",
}: SadarHospitalPriceTableProps) {
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
      id="sadar-hospital-price-guide"
      title={
        isEn
          ? "Feni Sadar Hospital Fees & Diagnostic Pricing Benchmark (2026)"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? "Official government nominal user charges vs. private clinic benchmark rates in Feni, with 10-30% Health Club member discounts on external referral diagnostic tests."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Government Service / Diagnostic Test" : "সরকারি সেবা বা ডায়াগনস্টিক পরীক্ষা",
        regularPrice: isEn ? "Govt User Fee / Private Market Benchmark" : "সরকারি ইউজার ফি / বেসরকারি বাজারদর",
        benefit: isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা",
        duration: isEn ? "Schedule / Report Delivery" : "সময়সূচি বা ডেলিভারি",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members receive 10-30% guaranteed savings on 1.5T MRI, 128-slice CT scans, Echocardiography, thyroid panels, and private hospital cabins whenever tests are referred outside."
          : "হাসপাতালে কোনো টেস্টের রিএজেন্ট শেষ থাকলে বা এমআরআই, সিটি স্ক্যান ও জরুরি পরীক্ষা বাইরে রেফার করলে হেলথ ক্লাব মেম্বার কার্ডে পার্টনার ডায়াগনস্টিকে ১০-৩০% নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
