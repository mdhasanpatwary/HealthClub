import { EntCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface EntPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: EntCarePackageItem[];
  };
}

export function EntPriceTable({
  pricingData,
}: EntPriceTableProps) {

  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="ent-price-guide"
      title={pricingData.titleBn
      }
      subtitle={pricingData.subtitleBn
      }
      items={items}
      columnHeaders={{
        item: "টেস্ট / প্রসিডিউরের নাম ও ধরন",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "সময়কাল / সুবিধা",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বারশিপ থাকলে পার্টনার হাসপাতাল ও ডায়াগনস্টিক ল্যাবে পিউর টোন অডিওমেট্রি, পিএনএস এক্স-রে, সিটি স্ক্যান ও কানের মাইক্রোসার্জারিতে নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
