import { KidneyPackagePriceItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import { formatNumberedTitle } from "@/app/blog/utils/blogAeoHeadingUtils";

interface KidneyPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: KidneyPackagePriceItem[];
  };
  pricingNum?: number;
}

export function KidneyPriceTable({
  pricingData,
  pricingNum,
}: KidneyPriceTableProps) {
  const items = pricingData.packages.map((item) => ({
    name: item.testOrPackageNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.turnaroundOrDurationBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="kidney-price-guide"
      title={formatNumberedTitle(pricingData.titleBn, pricingNum)}
      subtitle={pricingData.subtitleBn}
      items={items}
      columnHeaders={{
        item: "ডায়ালাইসিস ও পরীক্ষা এবং বিভাগ",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "সময়কাল / রিপোর্ট",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার ডায়াগনস্টিক সেন্টারে (প্যাসিফিক হেলথ কেয়ার, লাইফ কেয়ার ডায়াগনস্টিক, ইম্পেরিয়াল নিউরোকেয়ার ও ফেনি ম্যাক্স) সিরাম ক্রিয়েটিনিন, ইলেক্ট্রোলাইটস, ইউরিন এসিআর ও ইউএসজিসহ সকল কিডনি পরীক্ষায় ১০-৩০% ডিসকাউন্ট পাবেন।",
        buttonText: "মেম্বারশিপ কার্ড নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
