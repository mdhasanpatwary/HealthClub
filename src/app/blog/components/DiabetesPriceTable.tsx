import { DiabetesCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface DiabetesPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: DiabetesCarePackageItem[];
  };
}

export function DiabetesPriceTable({
  pricingData,
}: DiabetesPriceTableProps) {

  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="diabetes-price-guide"
      title={pricingData.titleBn
      }
      subtitle={pricingData.subtitleBn
      }
      items={items}
      columnHeaders={{
        item: "পরীক্ষা বা ল্যাব প্যাকেজের নাম",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "রিপোর্ট ও টেস্টের সময়",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বারশিপ থাকলে ফেনীর শীর্ষ পার্টনার ডায়াগনস্টিক ল্যাবে HbA1c, থাইরয়েড প্রোফাইল, লিপিড প্যানেল, ইউরিন স্পট এসিআর এবং ডায়াবেটিক টেস্টে ১০-৩০% নিশ্চিত ক্যাশলেস ছাড় পাওয়া যায়।",
        buttonText: "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
