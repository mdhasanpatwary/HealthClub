import { DentalProcedurePriceItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface DentalPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    procedures: DentalProcedurePriceItem[];
  };
  locale?: string;
}

export function DentalPriceTable({
  pricingData,
  locale = "bn",
}: DentalPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.procedures.map((proc) => ({
    name: isEn ? proc.procedureNameEn : proc.procedureNameBn,
    category: translateMedicalCategory(proc.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(proc.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(proc.durationBn, isEn),
    discountText: isEn ? "10-30% Special Discount" : "১০-৩০% বিশেষ ছাড়",
  }));

  return (
    <BlogPriceTable
      id="price-guide"
      title={isEn ? "Dental Treatment Cost & Member Savings Guide" : pricingData.titleBn}
      subtitle={
        isEn
          ? "Estimated dental procedure charges in Feni and guaranteed savings with Health Club membership."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Procedure & Category" : "চিকিৎসা ও পদ্ধতির নাম",
        regularPrice: isEn ? "Regular Market Fee" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: isEn ? "Duration" : "চিকিৎসার সময়",
      }}
      conversionBanner={{
        title: isEn
          ? "Special member savings on dental procedures & surgeries in Feni!"
          : "ফেনীর সেরা ডেন্টাল ক্লিনিকে চিকিৎসায় বিশেষ মেম্বার ছাড় পান!",
        text: isEn
          ? "Get your digital Health Club membership card today and save thousands on dental care."
          : "আজই হেলথ ক্লাবের মেম্বারশিপ কার্ড সংগ্রহ করে রুট ক্যানেল, স্কেলিং ও ক্যাপের বিল সাশ্রয়ী করুন।",
        buttonText: isEn ? "Get Membership Card" : "মেম্বারশিপ কার্ড সংগ্রহ করুন",
        href: "/membership",
        variant: "button",
      }}
    />
  );
}
