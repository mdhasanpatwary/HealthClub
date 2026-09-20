import { PharmacyPackagePriceItem } from "@/types/pharmacyBlog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface PharmacyPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: PharmacyPackagePriceItem[];
  };
  locale?: string;
}

export function PharmacyPriceTable({
  pricingData,
  locale = "bn",
}: PharmacyPriceTableProps) {
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
      id="pharmacy-price-guide"
      title={
        isEn
          ? "Emergency Medicines, Supplies & Home Delivery Benchmark in Feni (2026)"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? "Standard market retail prices for life-saving inhalers, cold-chain insulin, monitoring devices, trauma dressings, and home delivery rates, with 10-30% Health Club member discounts at partner pharmacies."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Medicine / Medical Supply / Delivery" : "ওষুধ / জরুরি সামগ্রী / হোম ডেলিভারি",
        regularPrice: isEn ? "Standard Market MRP / Charge" : "সাধারণ বাজারদর / নির্ধারিত ফি",
        benefit: isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা",
        duration: isEn ? "Availability / Speed" : "প্রাপ্যতা বা সময়সীমা",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members enjoy 10-30% savings on non-controlled prescription medicines, healthcare devices, and surgical supplies at Lazz Pharma and verified partner pharmacies in Feni."
          : "হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড ব্যবহার করে ফেনীতে লাজ ফার্মা ও পার্টনার ফার্মেসি কাউন্টারগুলোতে প্রেসক্রিপশন ওষুধ, ইনসুলিন ও ডায়াগনস্টিক ডিভাইসে নিশ্চিত ১০-৩০% মেম্বার ছাড় উপভোগ করুন।",
        buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
