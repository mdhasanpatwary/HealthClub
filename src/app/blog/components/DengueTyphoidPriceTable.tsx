import { DengueTyphoidPricingData } from "@/types/dengueTyphoidBlog";
import { BlogPriceTable } from "./BlogPriceTable";

interface DengueTyphoidPriceTableProps {
  pricingData: DengueTyphoidPricingData;
}

export function DengueTyphoidPriceTable({
  pricingData,
}: DengueTyphoidPriceTableProps) {
  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrServiceNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="dengue-typhoid-price-guide"
      title={pricingData.titleBn}
      subtitle="ফেনীর শীর্ষ ডায়াগনস্টিক ও বেসরকারি হাসপাতালে ডেঙ্গু এনএস১, সিবিসি প্লাটিলেট কাউন্ট, টাইফয়েড রক্ত পরীক্ষা, কালচার ও ইনডোর ওয়ার্ড বেডের সাধারণ ফি এবং হেলথ ক্লাব মেম্বার ছাড়।"
      items={items}
      columnHeaders={{
        item: "টেস্ট / ইনডোর ভর্তি সেবা",
        regularPrice: "সাধারণ বাজারদর ফি",
        benefit: "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: "রিপোর্ট ডেলিভারি / সময়কাল",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে (আল-আকসা হাসপাতাল লিঃ ও প্যাসিফিক হেলথ কেয়ার) ডেঙ্গু এনএস১, সিবিসি প্লাটিলেট কাউন্ট, ব্লাড কালচার ও হাসপাতালে ভর্তিতে নিশ্চিত ১০-৩০% মেম্বার ছাড় পাবেন।",
        buttonText: "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
