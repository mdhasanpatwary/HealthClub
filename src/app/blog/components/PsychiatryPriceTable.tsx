import { PsychiatryCarePackageItem } from "@/types/blog";
import { BlogPriceTable } from "./BlogPriceTable";
import {
  formatBlogPriceRange,
  translateMedicalCategory,
  translateTurnaroundTime,
} from "../utils/blogTranslations";

interface PsychiatryPriceTableProps {
  pricingData: {
    titleBn: string;
    subtitleBn: string;
    packages: PsychiatryCarePackageItem[];
  };
  locale?: string;
}

export function PsychiatryPriceTable({
  pricingData,
  locale = "bn",
}: PsychiatryPriceTableProps) {
  const isEn = locale === "en";

  const items = pricingData.packages.map((item) => ({
    name: isEn ? item.procedureOrTestNameEn : item.procedureOrTestNameBn,
    category: translateMedicalCategory(item.categoryBn, isEn),
    regularPriceRange: formatBlogPriceRange(item.regularPriceRangeBn, isEn),
    durationOrTurnaround: translateTurnaroundTime(item.durationOrTurnaroundBn, isEn),
    discountText: isEn ? "10-30% Member Discount" : "১০-৩০% মেম্বার ছাড়",
  }));

  return (
    <BlogPriceTable
      id="psychiatry-price-guide"
      title={
        isEn
          ? "Psychiatry Consultation, Psychotherapy & Neuro Diagnostic Cost Guide"
          : pricingData.titleBn
      }
      subtitle={
        isEn
          ? "Standard market costs for psychiatric evaluations, CBT psychotherapy sessions, EEG brain mapping, MRI scans, and drug screening in Feni with 10-30% member savings."
          : pricingData.subtitleBn
      }
      items={items}
      locale={locale}
      columnHeaders={{
        item: isEn ? "Consultation / Therapy / Diagnostic Test" : "কনসালটেশন, থেরাপি বা টেস্টের নাম",
        regularPrice: isEn ? "Standard Market Fee" : "সাধারণ বাজারদর",
        benefit: isEn ? "Health Club Benefit" : "হেলথ ক্লাব সুবিধা",
        duration: isEn ? "Duration / Turnaround" : "সেশন বা টেস্টের সময়",
      }}
      conversionBanner={{
        text: isEn
          ? "Health Club members receive 10-30% guaranteed savings on Digital Video EEG, Brain MRI, Thyroid/Vitamin panels, Dope tests, and psychotherapy sessions across verified partner centers in Feni."
          : "হেলথ ক্লাব মেম্বারশিপ থাকলে ফেনীর শীর্ষ পার্টনার ডায়াগনস্টিক ও কনসালটেশন সেন্টারে ভিডিও ইইজি, ব্রেন এমআরআই, থাইরয়েড/ভিটামিন টেস্ট, ডোপ টেস্ট ও সাইকোথেরাপিতে ১০-৩০% নিশ্চিত ছাড় পাওয়া যায়।",
        buttonText: isEn ? "Join Health Club" : "মেম্বারশিপ গ্রহণ করুন",
        href: "/membership",
        variant: "link",
      }}
    />
  );
}
