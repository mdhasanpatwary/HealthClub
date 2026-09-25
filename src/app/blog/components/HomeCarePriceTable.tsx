import { HomeCarePricingData } from "@/types/homeCareBlog";
import { BlogPriceTable } from "./BlogPriceTable";

interface HomeCarePriceTableProps {
  pricingData: HomeCarePricingData;
}

export function HomeCarePriceTable({
  pricingData,
}: HomeCarePriceTableProps) {

  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrServiceNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="home-care-price-guide"
      title={pricingData.titleBn}
      subtitle={"ফেনীর শীর্ষ ডায়াগনস্টিক ল্যাব ও বেসরকারি হাসপাতালে হোম স্যাম্পল পিকআপ, মূত্রথলির ক্যাথেটার, আইভি স্যালাইন, ক্ষত ড্রেসিং ও নার্সিং কেয়ারের সাধারণ ফি এবং হেলথ ক্লাব মেম্বার ছাড়।"
      }
      items={items}
      columnHeaders={{
        item: "হোম সার্ভিস / ক্লিনিক্যাল সেবা",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: "উপস্থিতি / সেবার সময়কাল",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে (আল-আকসা হাসপাতাল লিঃ, প্যাসিফিক হেলথ কেয়ার, লাইফ কেয়ার, ইম্পেরিয়াল নিউরোকেয়ার ও ফেনী ম্যাক্স) হোম স্যাম্পল পিকআপ, প্যাথলজি টেস্ট ও অন-কল নার্সিং সেবায় নিশ্চিত ১০-৩০% মেম্বার ছাড় পাবেন।",
        buttonText: "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
