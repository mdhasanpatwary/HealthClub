export interface TocSubItem {
  id: string;
  name: string;
}

export function TocSubList({ items }: { items: TocSubItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <ol className="pl-4 pt-1 space-y-1 text-xs text-muted-foreground/90 border-l border-border/80 ml-2">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="hover:text-primary transition-colors block truncate py-0.5"
          >
            {item.name}
          </a>
        </li>
      ))}
    </ol>
  );
}

export interface StandardEntityTocProps {
  overviewTitle: string;
  matrixTitle?: string;
  reviewsTitle?: string;
  reviewsId?: string;
  subItems?: TocSubItem[];
  priceGuideId?: string;
  priceGuideTitle?: string;
  selectionGuideTitle?: string;
  emergencyTitle?: string;
  secNum: (n: number) => string;
  isEn: boolean;
}

export function StandardEntityToc({
  overviewTitle,
  matrixTitle,
  reviewsTitle,
  reviewsId,
  subItems,
  priceGuideId,
  priceGuideTitle,
  selectionGuideTitle,
  emergencyTitle,
  secNum,
  isEn,
}: StandardEntityTocProps) {
  let cur = 1;
  return (
    <ol className="space-y-1.5 list-none pl-0">
      <li>
        <a href="#overview" className="hover:text-primary transition-colors block py-0.5">
          {secNum(cur++)}{overviewTitle}
        </a>
      </li>
      {matrixTitle && (
        <li>
          <a href="#comparison-matrix" className="hover:text-primary transition-colors block py-0.5">
            {secNum(cur++)}{matrixTitle}
          </a>
        </li>
      )}
      {reviewsTitle && reviewsId && (
        <li>
          <a
            href={`#${reviewsId}`}
            className="hover:text-primary transition-colors font-semibold text-foreground block py-0.5"
          >
            {secNum(cur++)}{reviewsTitle}
          </a>
          {subItems && <TocSubList items={subItems} />}
        </li>
      )}
      {priceGuideId && priceGuideTitle && (
        <li>
          <a href={`#${priceGuideId}`} className="hover:text-primary transition-colors block py-0.5">
            {secNum(cur++)}{priceGuideTitle}
          </a>
        </li>
      )}
      {selectionGuideTitle && (
        <li>
          <a href="#selection-guide" className="hover:text-primary transition-colors block py-0.5">
            {secNum(cur++)}{selectionGuideTitle}
          </a>
        </li>
      )}
      {emergencyTitle && (
        <li>
          <a href="#emergency-directory" className="hover:text-primary transition-colors block py-0.5">
            {secNum(cur++)}{emergencyTitle}
          </a>
        </li>
      )}
      <li>
        <a href="#faq-section" className="hover:text-primary transition-colors block py-0.5">
          {secNum(cur)}{isEn ? "Frequently Asked Questions" : "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)"}
        </a>
      </li>
    </ol>
  );
}

export interface PricingGuideConfig {
  hasMaternityPricing?: boolean;
  hasCardiacPricing?: boolean;
  hasKidneyPricing?: boolean;
  hasPediatricPricing?: boolean;
  hasSkinPricing?: boolean;
  hasEyePricing?: boolean;
  hasOrthopedicPricing?: boolean;
  hasEntPricing?: boolean;
  hasSurgeryPricing?: boolean;
  hasNeurologyPricing?: boolean;
  hasDiabetesPricing?: boolean;
  hasPsychiatryPricing?: boolean;
  hasSadarHospitalPricing?: boolean;
  hasDiabeticHospitalPricing?: boolean;
  hasPharmacyPricing?: boolean;
  hasBloodPricing?: boolean;
  hasAmbulancePricing?: boolean;
}

export function getPricingGuides(cfg: PricingGuideConfig) {
  return [
    { id: "maternity-price-guide", has: cfg.hasMaternityPricing, en: "Maternity & Delivery Cost Guide", bn: "প্রসূতি ও ডেলিভারি খরচের হিসাব" },
    { id: "cardiac-price-guide", has: cfg.hasCardiacPricing, en: "Cardiac Diagnostic Cost Guide", bn: "হৃদরোগ পরীক্ষা খরচের হিসাব" },
    { id: "kidney-price-guide", has: cfg.hasKidneyPricing, en: "Dialysis & Kidney Diagnostic Cost Guide", bn: "কিডনি টেস্ট ও ডায়ালাইসিস খরচের হিসাব" },
    { id: "pediatric-price-guide", has: cfg.hasPediatricPricing, en: "Child Care & Vaccination Cost Guide", bn: "শিশু চিকিৎসা ও টিকা খরচের হিসাব" },
    { id: "skin-price-guide", has: cfg.hasSkinPricing, en: "Skin Test & Dermatosurgery Cost Guide", bn: "চর্মরোগ টেস্ট ও প্রসিডিউর খরচের হিসাব" },
    { id: "eye-price-guide", has: cfg.hasEyePricing, en: "Eye Test & Cataract Surgery Cost Guide", bn: "চক্ষু পরীক্ষা ও ছানি অপারেশন খরচের হিসাব" },
    { id: "orthopedic-price-guide", has: cfg.hasOrthopedicPricing, en: "Orthopedic & Joint Procedure Cost Guide", bn: "অর্থোপেডিক ও জয়েন্ট টেস্ট খরচের হিসাব" },
    { id: "ent-price-guide", has: cfg.hasEntPricing, en: "ENT Diagnostic & Surgery Cost Guide", bn: "ইএনটি টেস্ট ও সার্জারি খরচের হিসাব" },
    { id: "surgery-price-guide", has: cfg.hasSurgeryPricing, en: "General, Laparoscopic & Laser Surgery Cost Guide", bn: "ল্যাপারোস্কোপিক ও সার্জারি খরচের হিসাব" },
    { id: "neurology-price-guide", has: cfg.hasNeurologyPricing, en: "Brain MRI, CT & Neuro Diagnostics Cost Guide", bn: "ব্রেন এমআরআই, সিটি ও নিউরো টেস্ট খরচের হিসাব" },
    { id: "diabetes-price-guide", has: cfg.hasDiabetesPricing, en: "Diabetes, HbA1c & Hormone Cost Guide", bn: "ডায়াবেটিস, HbA1c ও হরমোন টেস্ট খরচের হিসাব" },
    { id: "psychiatry-price-guide", has: cfg.hasPsychiatryPricing, en: "Psychiatry & Therapy Cost Guide", bn: "সাইকিয়াট্রি ও থেরাপি খরচের হিসাব" },
    { id: "sadar-hospital-price-guide", has: cfg.hasSadarHospitalPricing, en: "Govt Hospital Fees & Diagnostic Cost Guide", bn: "হাসপাতাল ফি ও টেস্ট খরচের হিসাব" },
    { id: "diabetic-hospital-price-guide", has: cfg.hasDiabeticHospitalPricing, en: "Hospital Fees & Lab Test Cost Guide", bn: "হাসপাতাল ফি ও টেস্ট খরচের হিসাব" },
    { id: "pharmacy-price-guide", has: cfg.hasPharmacyPricing, en: "Emergency Medicine & Delivery Pricing", bn: "জরুরি ওষুধ ও ডেলিভারি ফি তালিকা" },
    { id: "blood-price-guide", has: cfg.hasBloodPricing, en: "Safe Blood Transfusion & Test Costs", bn: "রক্ত পরীক্ষা ও ট্রান্সফিউশন ফি তালিকা" },
    { id: "ambulance-price-guide", has: cfg.hasAmbulancePricing, en: "Ambulance Rent & Oxygen Cost Guide", bn: "অ্যাম্বুলেন্স ভাড়া ও অক্সিজেন খরচের হিসাব" },
  ];
}
