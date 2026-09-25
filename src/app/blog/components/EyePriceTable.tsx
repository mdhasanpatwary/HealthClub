import { EyeCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface EyePriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: EyeCarePackageItem[];
  };
}

export function EyePriceTable({
  pricingData,
}: EyePriceTableProps) {
  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="eye-price-guide"
      title={pricingData.titleBn}
      subtitle={pricingData.subtitleBn}
      items={items}
      columnHeaders={{
        item: "টেস্ট / প্রসিডিউরের নাম ও ধরন",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "সময়কাল / সুবিধা",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বারশিপ থাকলে পার্টনার ডায়াগনস্টিক ল্যাবে ওসিটি স্ক্যান, ফান্ডাস পরীক্ষা, প্রি-অপারেটিভ রক্ত পরীক্ষা ও চশমায় নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: "মেম্বারশিপ সুবিধা দেখুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
