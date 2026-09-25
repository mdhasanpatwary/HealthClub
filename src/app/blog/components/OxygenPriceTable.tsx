import { OxygenPricingData } from "@/types/oxygenBlog";
import { BlogPriceTable } from "./BlogPriceTable";

interface OxygenPriceTableProps {
  pricingData: OxygenPricingData;
}

export function OxygenPriceTable({
  pricingData,
}: OxygenPriceTableProps) {
  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrServiceNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="oxygen-price-guide"
      title={pricingData.titleBn}
      subtitle="ফেনীর শীর্ষ সরবরাহকারী ও বেসরকারি হাসপাতালে ১.৪m³ ও জাম্বো সিলিন্ডার গ্যাস রিফিল, হোম সেট ভাড়া, ৫-১০L কনসেনট্রেটর ও সিওপিডি বাইপ্যাপের সাধারণ ফি এবং হেলথ ক্লাব মেম্বার ছাড়।"
      items={items}
      columnHeaders={{
        item: "অক্সিজেন সেবা / যন্ত্রপাতি",
        regularPrice: "সাধারণ বাজারদর / জামানত",
        benefit: "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: "ডেলিভারি / সময়কাল",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতাল ও চিকিৎসা কেন্দ্রে (আল-আকসা হাসপাতাল লিঃ ও প্যাসিফিক হেলথ কেয়ার) জরুরি অক্সিজেন সুবিধা, সিলিন্ডার ভাড়া, রিফিল, রেসপিরেটরি ল্যাব টেস্ট ও ভর্তিতে নিশ্চিত ১০-৩০% মেম্বার ছাড় পাবেন।",
        buttonText: "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
