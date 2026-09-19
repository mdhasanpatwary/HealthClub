import { DiabetesCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface DiabetesPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: DiabetesCarePackageItem[];
  };
  locale?: string;
}

export function DiabetesPriceTable({
  pricingData,
  locale = "bn",
}: DiabetesPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.procedureOrTestNameEn : item.procedureOrTestNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.durationOrTurnaroundBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="diabetes-price-guide"
      title={
        isEn
          ? "Diabetes, HbA1c, Thyroid & Hormone Diagnostic Cost Guide"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? "Standard market costs for HbA1c, fasting glucose, oral glucose tolerance (OGTT), thyroid profiles (TSH/FT4), and diabetic foot screening in Feni with 10-30% member savings."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Diagnostic Test / Clinical Package" : "পরীক্ষা বা ল্যাব প্যাকেজের নাম",
        regularPrice: isEn ? "Standard Market Fee" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা",
        duration: isEn ? "Report & Turnaround" : "রিপোর্ট ও টেস্টের সময়",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members receive 10-30% guaranteed savings on HbA1c, Complete Thyroid Profile, Fasting Lipid Panel, Urine Spot ACR, and diabetic neuropathy tests across verified labs in Feni."
          : "হেলথ ক্লাব মেম্বারশিপ থাকলে ফেনীর শীর্ষ পার্টনার ডায়াগনস্টিক ল্যাবে HbA1c, থাইরয়েড প্রোফাইল, লিপিড প্যানেল, ইউরিন স্পট এসিআর এবং ডায়াবেটিক টেস্টে ১০-৩০% নিশ্চিত ক্যাশলেস ছাড় পাওয়া যায়।",
        buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
