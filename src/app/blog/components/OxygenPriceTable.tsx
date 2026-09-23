import { OxygenPricingData } from "@/types/oxygenBlog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface OxygenPriceTableProps {
  pricingData: OxygenPricingData;
  locale?: string;
}

export function OxygenPriceTable({
  pricingData,
  locale = "bn",
}: OxygenPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.procedureOrServiceNameEn : item.procedureOrServiceNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.durationOrTurnaroundBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="oxygen-price-guide"
      title={isEn ? "Medical Oxygen Refill, Cylinder Rental & Ventilator Pricing Guide" : pricingData.titleBn}
      subtitle={
        isEn
          ? "Standard market fees for 1.4m³ & 6.8m³ cylinder refills, monthly home sets, 5L/10L oxygen concentrators, and BiPAP machines across Feni Sadar with 10-30% Health Club member discounts."
          : "ফেনীর শীর্ষ সরবরাহকারী ও বেসরকারি হাসপাতালে ১.৪m³ ও জাম্বো সিলিন্ডার গ্যাস রিফিল, হোম সেট ভাড়া, ৫-১০L কনসেনট্রেটর ও সিওপিডি বাইপ্যাপের সাধারণ ফি এবং হেলথ ক্লাব মেম্বার ছাড়।"
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Oxygen Service / Equipment" : "অক্সিজেন সেবা / যন্ত্রপাতি",
        regularPrice: isEn ? "Regular Market Fee / Deposit" : "সাধারণ বাজারদর / জামানত",
        benefit: isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: isEn ? "Delivery / Duration" : "ডেলিভারি / সময়কাল",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members receive a 10-30% discount on emergency oxygen cylinder rentals, gas refills, respiratory diagnostic workups, and inpatient admissions at verified partner facilities in Feni (including Al-Aqsa Hospital Ltd and Pacific Health Care)."
          : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতাল ও চিকিৎসা কেন্দ্রে (আল-আকসা হাসপাতাল লিঃ ও প্যাসিফিক হেলথ কেয়ার) জরুরি অক্সিজেন সুবিধা, সিলিন্ডার ভাড়া, রিফিল, রেসপিরেটরি ল্যাব টেস্ট ও ভর্তিতে নিশ্চিত ১০-৩০% মেম্বার ছাড় পাবেন।",
        buttonText: isEn ? "Join Health Club" : "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
