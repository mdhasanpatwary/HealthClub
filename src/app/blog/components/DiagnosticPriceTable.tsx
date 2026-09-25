import { DiagnosticTestPriceItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";

interface DiagnosticPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    titleEn?: string;
    subtitleEn?: string;
    tests: DiagnosticTestPriceItem[];
  };
}

export function DiagnosticPriceTable({
  pricingData,
}: DiagnosticPriceTableProps) {

  const items = pricingData.tests.map((test) => ({
    name: test.testNameBn,
    category: test.categoryBn,
    regularPriceRange: test.regularPriceRangeBn,
    durationOrTurnaround: test.turnaroundTimeBn,
    discountText: "১০-৩০% বিশেষ ছাড়",
  }));

  return (
    <BlogPriceTable
      id="price-guide"
      title={`৪. ${pricingData.titleBn}`
      }
      subtitle={pricingData.subtitleBn
      }
      items={items}
      columnHeaders={{
        item: "পরীক্ষার নাম ও বিভাগ",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: "রিপোর্ট সময়",
      }}
      conversionBanner={{
        title: "ফেনীর সেরা ডায়াগনস্টিকে টেস্টে বিশেষ মেম্বার ছাড় ও সাশ্রয় পান!",
        text: "আজই হেলথ ক্লাবের মেম্বারশিপ কার্ড সংগ্রহ করে পরিবারের ডায়াগনস্টিক খরচ সাশ্রয় করুন।",
        buttonText: "মেম্বারশিপ কার্ড সংগ্রহ করুন",
        href: "/membership",
        variant: "button",
      }}
    />
  );
}
