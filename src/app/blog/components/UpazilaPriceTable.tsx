import { UpazilaCarePackageItem } from "@/types/upazilaBlog";
import { BlogPriceTable } from "./BlogPriceTable";

interface UpazilaPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: UpazilaCarePackageItem[];
  };
}

export function UpazilaPriceTable({
  pricingData,
}: UpazilaPriceTableProps) {
  const items = pricingData.packages.map((item) => ({
    name: item.procedureOrTestNameBn,
    category: item.categoryBn,
    regularPriceRange: item.regularPriceRangeBn,
    durationOrTurnaround: item.durationOrTurnaroundBn,
    discountText: "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="upazila-price-guide"
      title={pricingData.titleBn}
      subtitle={pricingData.subtitleBn}
      items={items}
      showBenefitColumn={false}
      columnHeaders={{
        item: "উপজেলা স্বাস্থ্যসেবা বা ডায়াগনস্টিক পরীক্ষা",
        regularPrice: "সরকারি ইউজার ফি / বেসরকারি বাজারদর",
        duration: "সময়সূচি বা ডেলিভারি",
      }}
      conversionBanner={{
        text: "উন্নত চিকিৎসার জন্য ফেনী সদরের পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে রেফারেল হলে প্যাথলজি, ডিজিটাল এক্স-রে, সিটি স্ক্যান ও কেবিনে হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড় উপভোগ করতে আজই মেম্বারশিপ নিন।",
        buttonText: "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
