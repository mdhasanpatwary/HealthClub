import { MaternityCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface MaternityPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: MaternityCarePackageItem[];
  };
  locale?: string;
}

export function MaternityPriceTable({
  pricingData,
  locale = "bn",
}: MaternityPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.packageNameEn : item.packageNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.stayOrDurationBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="maternity-price-guide"
      title={
        isEn
          ? "Maternity & Delivery Cost Guide with Member Discounts"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? "Standard market fees for delivery and maternity care in Feni and 10-30% discount for Health Club members."
          : "ফেনীর বিভিন্ন প্রাইভেট ও পার্টনার হাসপাতালে স্বাভাবিক ও সিজারিয়ান প্রসবের সাধারণ বাজারদর এবং হেলথ ক্লাব মেম্বারদের জন্য ১০-৩০% ডিসকাউন্ট সুবিধা।"
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Package & Care Type" : "প্রসূতি সেবা ও প্যাকেজ",
        regularPrice: isEn ? "Regular Market Fee" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Discount" : "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: isEn ? "Stay / Validity" : "হাসপাতাল অবস্থান",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members get a 10-30% discount on maternity and delivery care packages at verified partner hospitals across Feni (including Z.U Model Hospital and Al-Kamy Hospital Ltd.)."
          : "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতালগুলোতে (জেড.ইউ মডেল হাসপাতাল, আল-কেমি হাসপাতাল ইত্যাদি) প্রসূতি ও ডেলিভারি সেবায় ১০-৩০% ডিসকাউন্ট পাবেন।",
        buttonText: isEn ? "Join Health Club" : "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
