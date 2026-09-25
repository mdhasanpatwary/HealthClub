import { SadarHospitalCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface SadarHospitalPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: SadarHospitalCarePackageItem[];
  };
}

export function SadarHospitalPriceTable({
  pricingData,
}: SadarHospitalPriceTableProps) {

  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="sadar-hospital-price-guide"
      title={pricingData.titleBn
      }
      subtitle={pricingData.subtitleBn
      }
      items={items}
      columnHeaders={{
        item: "সরকারি সেবা বা ডায়াগনস্টিক পরীক্ষা",
        regularPrice: "সরকারি ইউজার ফি / বেসরকারি বাজারদর",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "সময়সূচি বা ডেলিভারি",
      }}
      conversionBanner={{
        text: "হাসপাতালে কোনো টেস্টের রিএজেন্ট শেষ থাকলে বা এমআরআই, সিটি স্ক্যান ও জরুরি পরীক্ষা বাইরে রেফার করলে হেলথ ক্লাব মেম্বার কার্ডে পার্টনার ডায়াগনস্টিকে ১০-৩০% নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
