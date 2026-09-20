import { BloodCarePackageItem } from "@/types/bloodBankBlog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface BloodPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: BloodCarePackageItem[];
  };
  locale?: string;
}

export function BloodPriceTable({
  pricingData,
  locale = "bn",
}: BloodPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.procedureOrTestNameEn : item.procedureOrTestNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.durationOrTurnaroundBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
        <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">
          {isEn ? "Note:" : "জরুরি দ্রষ্টব্য:"}
        </span>
        <span>
          {isEn
            ? "Blood donation is strictly free and commercial trade is illegal. The pricing guide below details clinical laboratory charges (5-point TTI screening, cross-matching, blood bags) at hospital/diagnostic facilities, where Health Club members receive 10-30% discount on lab investigations."
            : "রক্ত কেনাবেচা আইনত সম্পূর্ণ নিষিদ্ধ ও অবৈধ; স্বেচ্ছাসেবী রক্তদাতার রক্ত সম্পূর্ণ বিনামূল্যে পাওয়া যায়। নিচের তালিকাটি কেবলমাত্র হাসপাতাল ও ডায়াগনস্টিক ল্যাবরেটরিতে রক্ত পরিসঞ্চালনের পূর্ববর্তী জরুরি ল্যাব পরীক্ষা (স্ক্রিনিং, ক্রস-ম্যাচিং, সিবিসি ও ব্লাড ব্যাগ)-এর নির্ধারিত ফি, যেগুলোতে হেলথ ক্লাব মেম্বাররা পার্টনার ল্যাবে ১০-৩০% ছাড় পান।"}
        </span>
      </div>

      <BlogPriceTable
        id="blood-price-guide"
        title={
          isEn
            ? "Safe Blood Transfusion Tests & Emergency Supplies Price List in Feni (2026)"
            : pricingData.titleBn
        }
        subtitle={
          isEn
            ? "Standard benchmark charges for 5-point TTI screening, pre-transfusion cross-matching, blood bags, and administration sets across government and private labs, with 10-30% member savings at partner diagnostic centers."
            : pricingData.subtitleBn
        }
        items={items}
        locale={locale}
        columnHeaders={{
          item: isEn ? "Test / Medical Transfusion Supply" : "পরীক্ষা / রক্ত পরিসঞ্চালন সামগ্রী",
          regularPrice: isEn ? "Standard Market Price / Fee" : "সাধারণ বাজারদর / নির্ধারিত ফি",
          benefit: isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা",
          duration: isEn ? "Turnaround / Speed" : "ফলাফল বা সময়সীমা",
        }}
        conversionBanner={{
          text: isEn
            ? "Health Club members receive 10-30% discounts on pre-transfusion TTI screening, CBC, cross-matching, and pathology tests at verified partner labs and hospitals in Feni."
            : "হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড প্রদর্শন করে ফেনীর পার্টনার ডায়াগনস্টিক ল্যাবগুলোতে রক্ত পরিসঞ্চালন স্ক্রিনিং, সিবিসি ও ক্রস-ম্যাচিং টেস্টে নিশ্চিত ১০-৩০% মেম্বার ছাড় উপভোগ করুন।",
          buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ গ্রহণ করুন",
          href: "/membership",
          variant: "link",
        }}
      />
    </div>
  );
}
