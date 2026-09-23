import { StrokeCardiacPricingData } from "@/types/strokeCardiacBlog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface StrokeCardiacPriceTableProps {
  pricingData: StrokeCardiacPricingData;
  locale?: string;
}

export function StrokeCardiacPriceTable({
  pricingData,
  locale = "bn",
}: StrokeCardiacPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.procedureOrTestNameEn : item.procedureOrTestNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.durationOrTurnaroundBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="stroke-cardiac-price-guide"
      title={isEn ? "Emergency Stroke & Cardiac Diagnostics & Bed Charges" : pricingData.titleBn}
      subtitle={
        isEn
          ? "Standard market fees for emergency 12-lead ECG, troponin-I, non-contrast CT brain, CCU beds, and ALS ambulance in Feni Sadar with 10-30% Health Club member discounts."
          : "ফেনীর শীর্ষ বেসরকারি হাসপাতাল ও আধুনিক ডায়াগনস্টিকে জরুরি ইসিজি, ট্রপোনিন আই, ব্রেন সিটি স্ক্যান, সিসিইউ বেড ও লাইফ সাপোর্ট অ্যাম্বুলেন্সের সাধারণ ফি এবং হেলথ ক্লাব মেম্বার ছাড়।"
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Emergency Procedure / Test & Category" : "জরুরি পরীক্ষা / সেবা ও বিভাগ",
        regularPrice: isEn ? "Regular Market Fee" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: isEn ? "Turnaround / Duration" : "রিপোর্ট সময় / ব্যাপ্তিকাল",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members get a 10-30% discount on emergency diagnostic tests, ECG, CT scans, and hospital indoor admissions at verified partner centers in Feni (including Al-Aqsa Hospital Ltd, Imperial Neurocare, Pacific Health Care, and Life Care)."
          : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে (আল-আকসা হাসপাতাল লিঃ, ইম্পেরিয়াল নিউরোকেয়ার, প্যাসিফিক হেলথ কেয়ার ও লাইফ কেয়ার) জরুরি টেস্ট, ইসিজি, সিটি স্ক্যান ও ইনডোর বেডে নিশ্চিত ১০-৩০% মেম্বার ছাড় পাবেন।",
        buttonText: isEn ? "Join Health Club" : "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
