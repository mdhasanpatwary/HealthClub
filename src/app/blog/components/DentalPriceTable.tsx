import { DentalProcedurePriceItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface DentalPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    procedures: DentalProcedurePriceItem[];
  };
}

export function DentalPriceTable({
  pricingData,
}: DentalPriceTableProps) {
  const items = pricingData.procedures.map((proc) => ({
    name: proc.procedureNameBn,
    category: proc.categoryBn,
    regularPriceRange: proc.regularPriceRangeBn,
    durationOrTurnaround: proc.durationBn,
    discountText: "১০-৩০% বিশেষ ছাড়",
  }));

  return (
    <BlogPriceTable
      id="price-guide"
      title={pricingData.titleBn}
      subtitle={pricingData.subtitleBn}
      items={items}
      columnHeaders={{
        item: "চিকিৎসা ও পদ্ধতির নাম",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: "চিকিৎসার সময়",
      }}
      conversionBanner={{
        title: "ফেনীর সেরা ডেন্টাল ক্লিনিকে চিকিৎসায় বিশেষ মেম্বার ছাড় পান!",
        text: "আজই হেলথ ক্লাবের মেম্বারশিপ কার্ড সংগ্রহ করে রুট ক্যানেল, স্কেলিং ও ক্যাপের বিল সাশ্রয়ী করুন।",
        buttonText: "মেম্বারশিপ কার্ড সংগ্রহ করুন",
        href: "/membership",
        variant: "button",
      }}
    />
  );
}
