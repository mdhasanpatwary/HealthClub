import { CardiacPackagePriceItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface CardiacPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: CardiacPackagePriceItem[];
  };
}

export function CardiacPriceTable({
  pricingData,
}: CardiacPriceTableProps) {

  const items = pricingData.packages.map((item) => ({
    name: item.testOrPackageNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.reportTimeBn,
    discountText: "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="cardiac-price-guide"
      title={pricingData.titleBn}
      subtitle={"ফেনীর শীর্ষ ডায়াগনস্টিক সেন্টারে কার্ডিয়াক পরীক্ষাগুলোর সাধারণ বাজারদর এবং হেলথ ক্লাব মেম্বারদের জন্য ১০-৩০% ডিসকাউন্ট সুবিধা।"
      }
      items={items}
      columnHeaders={{
        item: "হৃদরোগ পরীক্ষা ও বিভাগ",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: "রিপোর্ট পাওয়ার সময়",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে (ফেনী হার্ট ফাউন্ডেশন, পপুলার, শেভরন ও ল্যাবএইড) সকল কার্ডিয়াক টেস্টে ১০-৩০% ডিসকাউন্ট পাবেন।",
        buttonText: "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
