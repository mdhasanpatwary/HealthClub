import { PharmacyPackagePriceItem } from "@/types/pharmacyBlog";
import { BlogPriceTable } from "./BlogPriceTable";
import { toBanglaNums } from "@/lib/utils";

interface PharmacyPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: PharmacyPackagePriceItem[];
  };
  pricingNum?: number;
}

export function PharmacyPriceTable({
  pricingData,
  pricingNum,
}: PharmacyPriceTableProps) {

  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  const cleanTitle = pricingData.titleBn.replace(/^[০-৯১-৯\d]+[\.\:\-—\s]+/, "").trim();
  const numStr = pricingNum ? `${toBanglaNums(pricingNum)}. ` : "";

  return (
    <BlogPriceTable
      id="pharmacy-price-guide"
      title={`${numStr}${cleanTitle}`}
      subtitle={pricingData.subtitleBn
      }
      items={items}
      columnHeaders={{
        item: "ওষুধ / জরুরি সামগ্রী / হোম ডেলিভারি",
        regularPrice: "সাধারণ বাজারদর / নির্ধারিত ফি",
        benefit: "হেলথ ক্লাব সুবিধা",
        duration: "প্রাপ্যতা বা সময়সীমা",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড ব্যবহার করে ফেনী সদরের অফিসিয়াল পার্টনার ফার্মেসি (এম রহমান মেডিকেল স্টোর ও ঢাকা ফার্মেসি) কাউন্টারে প্রেসক্রিপশন ওষুধ, ইনসুলিন ও ডায়াবেটিক ডিভাইসে নিশ্চিত ১০-৩০% মেম্বার ছাড় উপভোগ করুন।",
        buttonText: "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
