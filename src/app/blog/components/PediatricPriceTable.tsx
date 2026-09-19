import { PediatricCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface PediatricPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: PediatricCarePackageItem[];
  };
  locale?: string;
}

export function PediatricPriceTable({
  pricingData,
  locale = "bn",
}: PediatricPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.serviceOrVaccineNameEn : item.serviceOrVaccineNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.ageOrDurationBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="pediatric-price-guide"
      title={
        isEn
          ? "Child Care, Vaccination & NICU Cost Guide"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? "Government hospital subsidized SCANU rates vs private NICU incubator charges in Feni, routine/optional vaccination costs, and 10-30% Health Club member savings."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Service / Vaccine & Category" : "সেবা / টিকা এবং ক্যাটাগরি",
        regularPrice: isEn ? "Standard Rate" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা",
        duration: isEn ? "Age / Duration / Report" : "বয়সসীমা / সময়কাল",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members save 10-30% on all pediatric diagnostic tests (CBC with ESR, CRP, Serum Bilirubin, Urine, Chest X-Ray) at verified partner centers including DD Lab, New Ibn Sina, and Chevron in Feni."
          : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার ডায়াগনস্টিক ও হাসপাতালে (ডিডি ল্যাব, নিউ ইবনে সিনা, শেভরন ও ল্যাবএইড) শিশুদের সিবিসি, সিআরপি, সিরাম বিলিরুবিন, ইউরিন ও এক্স-রেসহ সকল পরীক্ষায় ১০-৩০% ডিসকাউন্ট পাবেন।",
        buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ কার্ড নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
