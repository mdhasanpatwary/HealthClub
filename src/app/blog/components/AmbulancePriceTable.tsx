import { AmbulancePackagePriceItem } from "@/types/ambulanceBlog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface AmbulancePriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: AmbulancePackagePriceItem[];
  };
  locale?: string;
}

export function AmbulancePriceTable({
  pricingData,
  locale = "bn",
}: AmbulancePriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.procedureOrTestNameEn : item.procedureOrTestNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.durationOrTurnaroundBn, isEn),
    discountText: isEn ? "Standard Public Fare" : "প্রমিত পাবলিক ভাড়া",
  }));

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
        <span className="font-bold text-sky-700 dark:text-sky-400 shrink-0">
          {isEn ? "Emergency Note:" : "জরুরি দ্রষ্টব্য:"}
        </span>
        <span>
          {isEn
            ? "Ambulance rates vary based on fuel prices, midnight timing, and patient clinical severity. All ambulance and oxygen services operate as an open emergency public directory connecting citizens directly with drivers at standard public benchmark fares."
            : "জ্বালানি তেলের দাম, মধ্যরাতের সময় এবং রোগীর শারীরিক অবস্থার ওপর ভিত্তি করে অ্যাম্বুলেন্স ভাড়ায় সামান্য তারতম্য হতে পারে। ফেনীর অ্যাম্বুলেন্স ও অক্সিজেন সার্ভিসগুলো সবার জন্য উন্মুক্ত একটি জরুরি পাবলিক ডিরেক্টরি হিসেবে পরিচালিত হয়, যেখানে চালকের সাথে সরাসরি সাধারণ প্রমিত বাজারদরে সেবা নেওয়া যায়।"}
        </span>
      </div>

      <BlogPriceTable
        id="ambulance-price-guide"
        title={
          isEn
            ? "Feni 24/7 Ambulance Fares & Oxygen Cylinder Price Guide (2026)"
            : pricingData.titleBn
        }
        subtitle={
          isEn
            ? "Standard benchmark fares for Feni to Dhaka and Chittagong transfers, ICU ventilator ambulances, local municipality trips, and oxygen cylinder rentals (Public emergency directory; transparent benchmark fares with direct driver booking)."
            : pricingData.subtitleBn
        }
        items={items}
        locale={locale}
        columnHeaders={{
          item: isEn ? "Route / Emergency Transport Service" : "রুট / জরুরি পরিবহন ও অক্সিজেন সেবা",
          regularPrice: isEn ? "Standard Benchmark Fare" : "সাধারণ প্রমিত বাজারদর / ভাড়া",
          benefit: isEn ? "Fare Category" : "ভাড়ার ধরন",
          duration: isEn ? "Duration / Speed" : "আনুমানিক সময় / রুট",
        }}
        conversionBanner={{
          text: isEn
            ? "Health Club maintains a 24/7 verified public emergency directory of ambulances, ICU transports, and oxygen suppliers in Feni to assist citizens in critical moments with transparent direct driver contacts."
            : "হেলথ ক্লাব ফেনী জেলা জুড়ে নাগরিকদের জরুরি মুহূর্তে দ্রুত সহায়তার জন্য ভেরিফায়েড অ্যাম্বুলেন্স, আইসিইউ লাইফ সাপোর্ট ও অক্সিজেন সরবরাহকারীদের একটি উন্মুক্ত ২৪/৭ পাবলিক ডিরেক্টরি প্রকাশ করে (সরাসরি চালকের সাথে কথা বলে দালালমুক্ত সেবা নিশ্চিত করুন)।",
          buttonText: isEn ? "Explore Emergency Directory" : "জরুরি ডিরেক্টরি দেখুন",
          href: "/emergency?tab=ambulances",
          variant: "link",
        }}
      />
    </div>
  );
}
