import { UpazilaCarePackageItem } from "@/types/upazilaBlog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface UpazilaPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    titleEn?: string;
    subtitleEn?: string;
    packages: UpazilaCarePackageItem[];
  };
  locale?: string;
}

export function UpazilaPriceTable({
  pricingData,
  locale = "bn",
}: UpazilaPriceTableProps) {
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
      id="upazila-price-guide"
      title={
        isEn
          ? pricingData.titleEn || "Upazila Healthcare & Diagnostic Fee Benchmark (2026)"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? pricingData.subtitleEn ||
            "Official government OPD ticket charges vs. private clinic benchmark rates in Feni upazilas."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      showBenefitColumn={false}
      columnHeaders={{
        item: isEn ? "Upazila Healthcare Service / Lab Test" : "উপজেলা স্বাস্থ্যসেবা বা ডায়াগনস্টিক পরীক্ষা",
        regularPrice: isEn ? "Govt Ticket / Private Market Benchmark" : "সরকারি ইউজার ফি / বেসরকারি বাজারদর",
        duration: isEn ? "Schedule / Report Turnaround" : "সময়সূচি বা ডেলিভারি",
      }}
      conversionBanner={{
        text: isEn
          ? "When referred to our verified partner hospitals and diagnostic centers in Feni Sadar, Health Club members enjoy guaranteed 10-30% discounts on pathology tests, digital X-rays, CT scans, and hospital cabins."
          : "উন্নত চিকিৎসার জন্য ফেনী সদরের পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে রেফারেল হলে প্যাথলজি, ডিজিটাল এক্স-রে, সিটি স্ক্যান ও কেবিনে হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড় উপভোগ করতে আজই মেম্বারশিপ নিন।",
        buttonText: isEn ? "Get Membership Card" : "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
