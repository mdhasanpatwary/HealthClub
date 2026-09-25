import { DiabeticHospitalPackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface DiabeticHospitalPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: DiabeticHospitalPackageItem[];
  };
}

export function DiabeticHospitalPriceTable({
  pricingData,
}: DiabeticHospitalPriceTableProps) {

  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="diabetic-hospital-price-guide"
      title={pricingData.titleBn
      }
      subtitle={pricingData.subtitleBn
      }
      items={items}
      columnHeaders={{
        item: "হাসপাতাল সেবা বা ডায়াগনস্টিক পরীক্ষা",
        regularPrice: "সমিতি ইউজার ফি / বেসরকারি বাজারদর",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "সময়সূচি বা ডেলিভারি",
      }}
      conversionBanner={{
        text: "ডায়াবেটিক সমিতি হাসপাতালের বাইরে কার্ডিয়াক ইকো, ১.৫ টেসলা এমআরআই, ভাস্কুলার ডপলার বা উচ্চমানের হরমোন টেস্ট রেফার করা হলে হেলথ ক্লাব মেম্বার কার্ডে পার্টনার ডায়াগনস্টিকে ১০-৩০% নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
