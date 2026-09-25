import { CriticalCarePricingData } from "@/types/criticalCareBlog";
import { BlogPriceTable } from "./BlogPriceTable";

interface CriticalCarePriceTableProps {
  pricingData: CriticalCarePricingData;
}

export function CriticalCarePriceTable({
  pricingData,
}: CriticalCarePriceTableProps) {
  const items = pricingData.packages.map((item) => ({
    name: item.serviceOrBedNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.stayOrDurationBn,
    discountText: "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="critical-care-price-guide"
      title={pricingData.titleBn}
      subtitle="ফেনীর শীর্ষ বেসরকারি হাসপাতালে জেনারেল আইসিইউ, সিসিইউ, এনআইসিইউ ইনকিউবেটর, মেকানিক্যাল ভেন্টিলেটর ও লাইফ সাপোর্টের সাধারণ খরচ এবং হেলথ ক্লাব মেম্বারদের ১০-৩০% নিশ্চিত ছাড়।"
      items={items}
      columnHeaders={{
        item: "সেবা / বেড ও বিভাগ",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: "সময়কাল / ব্যাপ্তিকাল",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতালে (আল-আকসা হাসপাতাল লিঃ সহ) ইনডোর বেড, ক্রিটিক্যাল মনিটরিং ও ডায়াগনস্টিক টেস্টে ১০-৩০% নিশ্চিত ডিসকাউন্ট পাবেন।",
        buttonText: "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
