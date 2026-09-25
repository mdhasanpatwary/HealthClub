import { PhysiotherapyTreatmentPriceItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface PhysiotherapyPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    treatments: PhysiotherapyTreatmentPriceItem[];
  };
}

export function PhysiotherapyPriceTable({
  pricingData,
}: PhysiotherapyPriceTableProps) {

  const items = pricingData.treatments.map((item) => ({
    name: item.treatmentNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationBn,
    discountText: "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="price-guide"
      title={pricingData.titleBn}
      subtitle={pricingData.subtitleBn
      }
      items={items}
      columnHeaders={{
        item: "থেরাপি সেশন ও বিভাগ",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: "সেশনের সময়",
      }}
      conversionBanner={{
        title: "ফেনীর পার্টনার ফিজিওথেরাপি সেন্টারে ১০-৩০% মেম্বার ডিসকাউন্ট পান!",
        text: "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার ফিজিওথেরাপি সেন্টারে (সেন্ট্রাল ফিজিওথেরাপি অ্যান্ড রিহ্যাবিলিটেশন সেন্টার, ইসলামিয়া ফিজিওথেরাপি অ্যান্ড রিহ্যাবিলিটেশন সেন্টার) প্রতিটি সেশনে ১০-৩০% ডিসকাউন্ট পাবেন।",
        buttonText: "মেম্বারশিপ কার্ড সংগ্রহ করুন",
        href: "/membership",
        variant: "button",
      }}
    />
  );
}
