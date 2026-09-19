import { PhysiotherapyTreatmentPriceItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface PhysiotherapyPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    treatments: PhysiotherapyTreatmentPriceItem[];
  };
  locale?: string;
}

export function PhysiotherapyPriceTable({
  pricingData,
  locale = "bn",
}: PhysiotherapyPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.treatments.map((item) => ({
    name: isEn ? item.treatmentNameEn : item.treatmentNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.durationBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="price-guide"
      title={isEn ? "Physiotherapy Session Costs & Member Savings Guide" : pricingData.titleBn}
      subtitle={
        isEn
          ? "Standard market fees for physiotherapy in Feni and 10-30% discount for Health Club members."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Therapy & Category" : "থেরাপি সেশন ও বিভাগ",
        regularPrice: isEn ? "Regular Market Fee" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: isEn ? "Duration" : "সেশনের সময়",
      }}
      conversionBanner={{
        title: isEn
          ? "10-30% member discount on physiotherapy sessions in Feni!"
          : "ফেনীর পার্টনার ফিজিওথেরাপি সেন্টারে ১০-৩০% মেম্বার ডিসকাউন্ট পান!",
        text: isEn
          ? "Health Club members receive guaranteed 10-30% discounts on stroke rehab, PLID traction, and therapy sessions at verified partner clinics (Central Physiotherapy, Islamia Physiotherapy)."
          : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার ফিজিওথেরাপি সেন্টারে (সেন্ট্রাল ফিজিওথেরাপি অ্যান্ড রিহ্যাবিলিটেশন সেন্টার, ইসলামিয়া ফিজিওথেরাপি অ্যান্ড রিহ্যাবিলিটেশন সেন্টার) প্রতিটি সেশনে ১০-৩০% ডিসকাউন্ট পাবেন।",
        buttonText: isEn ? "Get Health Card" : "মেম্বারশিপ কার্ড সংগ্রহ করুন",
        href: "/membership",
        variant: "button",
      }}
    />
  );
}
