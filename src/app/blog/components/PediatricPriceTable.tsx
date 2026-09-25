import { PediatricCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface PediatricPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: PediatricCarePackageItem[];
  };
}

export function PediatricPriceTable({
  pricingData,
}: PediatricPriceTableProps) {

  const items = pricingData.packages.map((item) => ({
    name: item.serviceOrVaccineNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.ageOrDurationBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="pediatric-price-guide"
      title={pricingData.titleBn
      }
      subtitle={pricingData.subtitleBn
      }
      items={items}
      columnHeaders={{
        item: "সেবা / টিকা এবং ক্যাটাগরি",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "বয়সসীমা / সময়কাল",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার ডায়াগনস্টিক ও হাসপাতালে (ডিডি ল্যাব, নিউ ইবনে সিনা, শেভরন ও ল্যাবএইড) শিশুদের সিবিসি, সিআরপি, সিরাম বিলিরুবিন, ইউরিন ও এক্স-রেসহ সকল পরীক্ষায় ১০-৩০% ডিসকাউন্ট পাবেন।",
        buttonText: "মেম্বারশিপ কার্ড নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
