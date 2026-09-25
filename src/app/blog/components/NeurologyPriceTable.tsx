import { NeurologyCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface NeurologyPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: NeurologyCarePackageItem[];
  };
}

export function NeurologyPriceTable({
  pricingData,
}: NeurologyPriceTableProps) {
  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="neurology-price-guide"
      title={pricingData.titleBn}
      subtitle={pricingData.subtitleBn}
      items={items}
      columnHeaders={{
        item: "পরীক্ষা বা নিউরো প্রসিডিউরের নাম",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "রিপোর্ট ও টেস্টের সময়",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বারশিপ থাকলে ফেনীর পার্টনার ডায়াগনস্টিক ও হাসপাতালে ব্রেন এমআরআই, জরুরি সিটি স্ক্যান, ডিজিটাল ইইজি, এনসিএস এবং স্ট্রোক আইসিইউ বেডে ১০-৩০% নিশ্চিত ক্যাশলেস ছাড় পাওয়া যায়।",
        buttonText: "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
