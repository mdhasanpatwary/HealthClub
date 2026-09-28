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

  const isProcedure =
    pricingData.titleBn.includes("সার্জারি") ||
    pricingData.titleBn.includes("অপারেশন") ||
    pricingData.titleBn.includes("ডায়ালাইসিস") ||
    pricingData.titleBn.includes("প্রসিডিউর") ||
    pricingData.titleBn.includes("রুট ক্যানেল") ||
    pricingData.titleBn.includes("হাড়ভাঙা") ||
    pricingData.titleBn.includes("লেজার") ||
    pricingData.titleBn.includes("খাতনা") ||
    pricingData.titleBn.includes("মুসলমানি") ||
    pricingData.titleBn.includes("ট্রিটমেন্ট") ||
    pricingData.titleBn.includes("চিকিৎসা") ||
    pricingData.titleBn.includes("পিআরপি") ||
    pricingData.titleBn.includes("থেরাপি") ||
    pricingData.titleBn.includes("জরুরি") ||
    pricingData.titleBn.includes("ভর্তি");

  return (
    <BlogPriceTable
      id="price-guide"
      title={`৪. ${pricingData.titleBn}`}
      subtitle={pricingData.subtitleBn}
      items={items}
      columnHeaders={{
        item: isProcedure ? "অপারেশন / পরীক্ষার নাম ও বিবরণ" : "পরীক্ষার নাম ও বিভাগ",
        regularPrice: "সাধারণ বাজারদর",
        benefit: "হেলথ ক্লাব মেম্বার সুবিধা",
        duration: isProcedure ? "সার্জারি / রিপোর্ট সময়" : "রিপোর্ট সময়",
      }}
      conversionBanner={{
        title: isProcedure
          ? "ফেনীর শীর্ষ পার্টনার হাসপাতালে সার্জারি ও ডায়াগনস্টিকে বিশেষ মেম্বার ছাড় পান!"
          : "ফেনীর সেরা ডায়াগনস্টিকে টেস্টে বিশেষ মেম্বার ছাড় ও সাশ্রয় পান!",
        text: isProcedure
          ? "আজই হেলথ ক্লাবের মেম্বারশিপ কার্ড সংগ্রহ করে পরিবারের সার্জারি ও ডায়াগনস্টিক চিকিৎসায় ১০-৩০% সাশ্রয় করুন।"
          : "আজই হেলথ ক্লাবের মেম্বারশিপ কার্ড সংগ্রহ করে পরিবারের ডায়াগনস্টিক খরচ সাশ্রয় করুন।",
        buttonText: "মেম্বারশিপ কার্ড সংগ্রহ করুন",
        href: "/membership",
        variant: "button",
      }}
    />
  );
}
