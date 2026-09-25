import { PsychiatryCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface PsychiatryPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: PsychiatryCarePackageItem[];
  };
}

export function PsychiatryPriceTable({
  pricingData,
}: PsychiatryPriceTableProps) {

  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="psychiatry-price-guide"
      title={pricingData.titleBn
      }
      subtitle={pricingData.subtitleBn
      }
      items={items}
      columnHeaders={{
        item: "কনসালটেশন, থেরাপি বা টেস্টের নাম",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "সেশন বা টেস্টের সময়",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বারশিপ থাকলে ফেনীর শীর্ষ পার্টনার ডায়াগনস্টিক ও কনসালটেশন সেন্টারে ভিডিও ইইজি, ব্রেন এমআরআই, থাইরয়েড/ভিটামিন টেস্ট, ডোপ টেস্ট ও সাইকোথেরাপিতে ১০-৩০% নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
