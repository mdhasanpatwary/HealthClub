import { StrokeCardiacPricingData } from "@/types/strokeCardiacBlog";
import { BlogPriceTable } from "./BlogPriceTable";

interface StrokeCardiacPriceTableProps {
  pricingData: StrokeCardiacPricingData;
}

export function StrokeCardiacPriceTable({
  pricingData,
}: StrokeCardiacPriceTableProps) {
  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="stroke-cardiac-price-guide"
      title={pricingData.titleBn}
      subtitle="ফেনীর শীর্ষ বেসরকারি হাসপাতাল ও আধুনিক ডায়াগনস্টিকে জরুরি ইসিজি, ট্রপোনিন আই, ব্রেন সিটি স্ক্যান, সিসিইউ বেড ও লাইফ সাপোর্ট অ্যাম্বুলেন্সের সাধারণ ফি এবং হেলথ ক্লাব মেম্বার ছাড়।"
      items={items}
      columnHeaders={{
        item: "জরুরি পরীক্ষা / সেবা ও বিভাগ",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: "রিপোর্ট সময় / ব্যাপ্তিকাল",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে (আল-আকসা হাসপাতাল লিঃ, ইম্পেরিয়াল নিউরোকেয়ার, প্যাসিফিক হেলথ কেয়ার ও লাইফ কেয়ার) জরুরি টেস্ট, ইসিজি, সিটি স্ক্যান ও ইনডোর বেডে নিশ্চিত ১০-৩০% মেম্বার ছাড় পাবেন।",
        buttonText: "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
