import { DengueTyphoidPricingData } from "@/types/dengueTyphoidBlog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface DengueTyphoidPriceTableProps {
  pricingData: DengueTyphoidPricingData;
  locale?: string;
}

export function DengueTyphoidPriceTable({
  pricingData,
  locale = "bn",
}: DengueTyphoidPriceTableProps) {
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
      id="dengue-typhoid-price-guide"
      title={isEn ? "Dengue & Typhoid Diagnostics & Inpatient Pricing Guide" : pricingData.titleBn}
      subtitle={
        isEn
          ? "Standard market fees for Dengue NS1 antigen, serial CBC platelet counts, Typhoid serology, blood cultures, and inpatient ward beds across Feni Sadar with 10-30% Health Club member discounts."
          : "ফেনীর শীর্ষ ডায়াগনস্টিক ও বেসরকারি হাসপাতালে ডেঙ্গু এনএস১, সিবিসি প্লাটিলেট কাউন্ট, টাইফয়েড রক্ত পরীক্ষা, কালচার ও ইনডোর ওয়ার্ড বেডের সাধারণ ফি এবং হেলথ ক্লাব মেম্বার ছাড়।"
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Test / Inpatient Admission Service" : "টেস্ট / ইনডোর ভর্তি সেবা",
        regularPrice: isEn ? "Regular Market Fee Range" : "সাধারণ বাজারদর ফি",
        benefit: isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: isEn ? "Turnaround / Service Timing" : "রিপোর্ট ডেলিভারি / সময়কাল",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members receive a guaranteed 10-30% discount on Dengue NS1, CBC platelet monitoring, blood cultures, and hospital ward admissions at verified partner facilities in Feni (including Al-Aqsa Hospital Ltd and Pacific Health Care)."
          : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে (আল-আকসা হাসপাতাল লিঃ ও প্যাসিফিক হেলথ কেয়ার) ডেঙ্গু এনএস১, সিবিসি প্লাটিলেট কাউন্ট, ব্লাড কালচার ও হাসপাতালে ভর্তিতে নিশ্চিত ১০-৩০% মেম্বার ছাড় পাবেন।",
        buttonText: isEn ? "Join Health Club" : "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
