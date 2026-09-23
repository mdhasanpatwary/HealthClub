import { CriticalCarePricingData } from "@/types/criticalCareBlog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface CriticalCarePriceTableProps {
  pricingData: CriticalCarePricingData;
  locale?: string;
}

export function CriticalCarePriceTable({
  pricingData,
  locale = "bn",
}: CriticalCarePriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.serviceOrBedNameEn : item.serviceOrBedNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.stayOrDurationBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="critical-care-price-guide"
      title={isEn ? "ICU, CCU, NICU Bed Charges & Member Savings Guide" : pricingData.titleBn}
      subtitle={
        isEn
          ? "Standard benchmark daily bed rental, mechanical ventilator, incubator, and life support charges in Feni Sadar with 10-30% Health Club member discounts."
          : "ফেনীর শীর্ষ বেসরকারি হাসপাতালে জেনারেল আইসিইউ, সিসিইউ, এনআইসিইউ ইনকিউবেটর, মেকানিক্যাল ভেন্টিলেটর ও লাইফ সাপোর্টের সাধারণ খরচ এবং হেলথ ক্লাব মেম্বারদের ১০-৩০% নিশ্চিত ছাড়।"
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Service / Bed & Category" : "সেবা / বেড ও বিভাগ",
        regularPrice: isEn ? "Regular Market Fee" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: isEn ? "Duration / Frequency" : "সময়কাল / ব্যাপ্তিকাল",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members get a 10-30% discount on hospital indoor beds, critical monitoring, and diagnostic tests at verified partner centers in Feni (including Al-Aqsa Hospital Ltd.)."
          : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতালে (আল-আকসা হাসপাতাল লিঃ সহ) ইনডোর বেড, ক্রিটিক্যাল মনিটরিং ও ডায়াগনস্টিক টেস্টে ১০-৩০% নিশ্চিত ডিসকাউন্ট পাবেন।",
        buttonText: isEn ? "Join Health Club" : "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
