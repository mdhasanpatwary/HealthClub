import { BloodCarePackageItem } from "@/types/bloodBankBlog";
import { BlogPriceTable } from "./BlogPriceTable";

interface BloodPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: BloodCarePackageItem[];
  };
}

export function BloodPriceTable({
  pricingData,
}: BloodPriceTableProps) {
  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
        <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">
          জরুরি দ্রষ্টব্য:
        </span>
        <span>
          রক্ত কেনাবেচা আইনত সম্পূর্ণ নিষিদ্ধ ও অবৈধ; স্বেচ্ছাসেবী রক্তদাতার রক্ত সম্পূর্ণ বিনামূল্যে পাওয়া যায়। নিচের তালিকাটি কেবলমাত্র হাসপাতাল ও ডায়াগনস্টিক ল্যাবরেটরিতে রক্ত পরিসঞ্চালনের পূর্ববর্তী জরুরি ল্যাব পরীক্ষা (স্ক্রিনিং, ক্রস-ম্যাচিং, সিবিসি ও ব্লাড ব্যাগ)-এর নির্ধারিত ফি, যেগুলোতে হেলথ ক্লাব মেম্বাররা পার্টনার ল্যাবে ১০-৩০% ছাড় পান।
        </span>
      </div>

      <BlogPriceTable
        id="blood-price-guide"
        title={pricingData.titleBn}
        subtitle={pricingData.subtitleBn}
        items={items}
        columnHeaders={{
          item: "পরীক্ষা / রক্ত পরিসঞ্চালন সামগ্রী",
          regularPrice: "সাধারণ বাজারদর / নির্ধারিত ফি",
          benefit: "হেলথ ক্লাব সুবিধা",
          duration: "ফলাফল বা সময়সীমা",
        }}
        conversionBanner={{
          text: "হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড প্রদর্শন করে ফেনীর পার্টনার ডায়াগনস্টিক ল্যাবগুলোতে রক্ত পরিসঞ্চালন স্ক্রিনিং, সিবিসি ও ক্রস-ম্যাচিং টেস্টে নিশ্চিত ১০-৩০% মেম্বার ছাড় উপভোগ করুন।",
          buttonText: "মেম্বারশিপ গ্রহণ করুন",
          href: "/membership",
          variant: "link",
        }}
      />
    </div>
  );
}
