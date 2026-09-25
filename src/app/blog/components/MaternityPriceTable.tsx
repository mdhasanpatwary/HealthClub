import { MaternityCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface MaternityPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: MaternityCarePackageItem[];
  };
}

export function MaternityPriceTable({
  pricingData,
}: MaternityPriceTableProps) {

  const items = pricingData.packages.map((item) => ({
    name: item.packageNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.stayOrDurationBn,
    discountText: "মেম্বার হলে ১০-৩০% ডিসকাউন্ট",
  }));

  return (
    <BlogPriceTable
      id="maternity-price-guide"
      title={pricingData.titleBn
      }
      subtitle={"ফেনীর বিভিন্ন প্রাইভেট ও পার্টনার হাসপাতালে স্বাভাবিক ও সিজারিয়ান প্রসবের সাধারণ বাজারদর এবং হেলথ ক্লাব মেম্বারদের জন্য ১০-৩০% ডিসকাউন্ট সুবিধা।"
      }
      items={items}
      columnHeaders={{
        item: "প্রসূতি সেবা ও প্যাকেজ",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: "হাসপাতাল অবস্থান",
      }}
      conversionBanner={{
        text: "হেলথ ক্লাব মেম্বার হলে ফেনীর পার্টনার হাসপাতালগুলোতে (আল-আকসা হাসপাতাল লিঃ, ফেনী কেয়ার হসপিটাল ইত্যাদি) প্রসূতি ও ডেলিভারি সেবায় ১০-৩০% ডিসকাউন্ট পাবেন।",
        buttonText: "সদস্যপদ নিন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
