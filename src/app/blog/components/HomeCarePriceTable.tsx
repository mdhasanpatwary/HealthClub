import { HomeCarePricingData } from "@/types/homeCareBlog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface HomeCarePriceTableProps {
  pricingData: HomeCarePricingData;
  locale?: string;
}

export function HomeCarePriceTable({
  pricingData,
  locale = "bn",
}: HomeCarePriceTableProps) {
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
      id="home-care-price-guide"
      title={isEn ? "Home Sample Collection & Elderly Nursing Care Pricing Guide" : pricingData.titleBn}
      subtitle={
        isEn
          ? "Standard market fees for home blood sample draws, Foley urinary catheterization, IV cannula & saline, wound dressing, and bedside nursing in Feni Sadar with 10-30% Health Club member discounts."
          : "ফেনীর শীর্ষ ডায়াগনস্টিক ল্যাব ও বেসরকারি হাসপাতালে হোম স্যাম্পল পিকআপ, মূত্রথলির ক্যাথেটার, আইভি স্যালাইন, ক্ষত ড্রেসিং ও নার্সিং কেয়ারের সাধারণ ফি এবং হেলথ ক্লাব মেম্বার ছাড়।"
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Home Service / Clinical Procedure" : "হোম সার্ভিস / ক্লিনিক্যাল সেবা",
        regularPrice: isEn ? "Regular Market Fee" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: isEn ? "Arrival / Duration" : "উপস্থিতি / সেবার সময়কাল",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members receive a 10-30% discount on home sample collection, pathology tests, on-call nursing visits, and indoor care at verified partner facilities in Feni (including Al-Aqsa Hospital Ltd, Pacific Health Care, Life Care, Imperial Neurocare, and Feni Max)."
          : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে (আল-আকসা হাসপাতাল লিঃ, প্যাসিফিক হেলথ কেয়ার, লাইফ কেয়ার, ইম্পেরিয়াল নিউরোকেয়ার ও ফেনী ম্যাক্স) হোম স্যাম্পল পিকআপ, প্যাথলজি টেস্ট ও অন-কল নার্সিং সেবায় নিশ্চিত ১০-৩০% মেম্বার ছাড় পাবেন।",
        buttonText: isEn ? "Join Health Club" : "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
