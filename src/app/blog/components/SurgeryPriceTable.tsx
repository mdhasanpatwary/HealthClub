import { SurgicalCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface SurgeryPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    titleEn?: string;
    subtitleEn?: string;
    packages: SurgicalCarePackageItem[];
  };
}

export function SurgeryPriceTable({
  pricingData,
}: SurgeryPriceTableProps) {

  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="surgery-price-guide"
      title={pricingData.titleBn
      }
      subtitle={pricingData.subtitleBn
      }
      items={items}
      columnHeaders={{
        item: "অপারেশন / সার্জিক্যাল প্রসিডিউরের নাম",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "হাসপাতাল অবস্থান ও সুবিধা",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বারশিপ থাকলে ফেনীর পার্টনার হাসপাতালে ল্যাপারোস্কোপিক গলব্লাডার অপারেশন, লেজার পাইলস সার্জারি, ওটি চার্জ এবং পোস্ট-অপারেটিভ কেবিনে ১০-৩০% নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
