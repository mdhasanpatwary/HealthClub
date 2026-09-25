import { SkinCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface SkinPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: SkinCarePackageItem[];
  };
}

export function SkinPriceTable({
  pricingData,
}: SkinPriceTableProps) {
  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="skin-price-guide"
      title={pricingData.titleBn}
      subtitle={pricingData.subtitleBn}
      items={items}
      columnHeaders={{
        item: "টেস্ট / প্রসিডিউরের নাম ও ধরন",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "সময়কাল / রিপোর্ট ডেলিভারি",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বারশিপ থাকলে পার্টনার ডায়াগনস্টিক সেন্টারে স্কিন স্ক্র্যাপিং, এলার্জি প্যানেল ও বায়োপসি টেস্টে নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
