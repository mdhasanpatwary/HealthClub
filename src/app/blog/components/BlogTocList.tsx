export interface TocSubItem {
  id: string;
  name: string;
}

export function TocSubList({ items, activeId }: { items: TocSubItem[]; activeId?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <ol className="pl-4 pt-1 space-y-1 text-xs text-muted-foreground/90 border-l border-border/80 ml-2">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block truncate py-0.5 transition-colors ${
                isActive
                  ? "text-primary font-bold bg-primary/10 px-1.5 rounded-sm"
                  : "hover:text-primary"
              }`}
            >
              {item.name}
            </a>
          </li>
        );
      })}
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
  activeId?: string;
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
  activeId,
}: StandardEntityTocProps) {
  let cur = 1;
  const linkClass = (id: string, isBold = false) => {
    const isActive = activeId === id;
    if (isActive) {
      return "text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md block transition-colors";
    }
    return `hover:text-primary transition-colors block py-0.5 ${isBold ? "font-semibold text-foreground" : ""}`;
  };

  return (
    <ol className="space-y-1.5 list-none pl-0">
      <li>
        <a href="#overview" className={linkClass("overview")}>
          {secNum(cur++)}{overviewTitle}
        </a>
      </li>
      {matrixTitle && (
        <li>
          <a href="#comparison-matrix" className={linkClass("comparison-matrix")}>
            {secNum(cur++)}{matrixTitle}
          </a>
        </li>
      )}
      {reviewsTitle && reviewsId && (
        <li>
          <a
            href={`#${reviewsId}`}
            className={linkClass(reviewsId, true)}
          >
            {secNum(cur++)}{reviewsTitle}
          </a>
          {subItems && <TocSubList items={subItems} activeId={activeId} />}
        </li>
      )}
      {priceGuideId && priceGuideTitle && (
        <li>
          <a href={`#${priceGuideId}`} className={linkClass(priceGuideId)}>
            {secNum(cur++)}{priceGuideTitle}
          </a>
        </li>
      )}
      {selectionGuideTitle && (
        <li>
          <a href="#selection-guide" className={linkClass("selection-guide")}>
            {secNum(cur++)}{selectionGuideTitle}
          </a>
        </li>
      )}
      {emergencyTitle && (
        <li>
          <a href="#emergency-directory" className={linkClass("emergency-directory")}>
            {secNum(cur++)}{emergencyTitle}
          </a>
        </li>
      )}
      <li>
        <a href="#faq-section" className={linkClass("faq-section")}>
          {secNum(cur)}সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
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
  hasCriticalCarePricing?: boolean;
  hasStrokeCardiacPricing?: boolean;
  hasHomeCarePricing?: boolean;
  hasOxygenPricing?: boolean;
  hasDengueTyphoidPricing?: boolean;
}

export function getPricingGuides(cfg: PricingGuideConfig) {
  return [
    { id: "maternity-price-guide", has: cfg.hasMaternityPricing, bn: "খরচ কত: প্রসূতি ও ডেলিভারি খরচের হিসাব" },
    { id: "cardiac-price-guide", has: cfg.hasCardiacPricing, bn: "খরচ কত: হৃদরোগ পরীক্ষা খরচের হিসাব" },
    { id: "kidney-price-guide", has: cfg.hasKidneyPricing, bn: "খরচ কত: ডায়ালাইসিস ও কিডনি টেস্ট খরচের হিসাব" },
    { id: "pediatric-price-guide", has: cfg.hasPediatricPricing, bn: "খরচ কত: শিশু চিকিৎসা ও টিকা খরচের হিসাব" },
    { id: "skin-price-guide", has: cfg.hasSkinPricing, bn: "খরচ কত: চর্মরোগ টেস্ট ও প্রসিডিউর খরচের হিসাব" },
    { id: "eye-price-guide", has: cfg.hasEyePricing, bn: "খরচ কত: চক্ষু পরীক্ষা ও ছানি অপারেশন খরচের হিসাব" },
    { id: "orthopedic-price-guide", has: cfg.hasOrthopedicPricing, bn: "খরচ কত: অর্থোপেডিক ও জয়েন্ট টেস্ট খরচের হিসাব" },
    { id: "ent-price-guide", has: cfg.hasEntPricing, bn: "খরচ কত: ইএনটি টেস্ট ও সার্জারি খরচের হিসাব" },
    { id: "surgery-price-guide", has: cfg.hasSurgeryPricing, bn: "খরচ কত: ল্যাপারোস্কোপিক ও সার্জারি খরচের হিসাব" },
    { id: "neurology-price-guide", has: cfg.hasNeurologyPricing, bn: "খরচ কত: ব্রেন এমআরআই, সিটি ও নিউরো টেস্ট খরচের হিসাব" },
    { id: "diabetes-price-guide", has: cfg.hasDiabetesPricing, bn: "খরচ কত: ডায়াবেটিস, HbA1c ও হরমোন টেস্ট খরচের হিসাব" },
    { id: "psychiatry-price-guide", has: cfg.hasPsychiatryPricing, bn: "খরচ কত: সাইকিয়াট্রি ও থেরাপি খরচের হিসাব" },
    { id: "sadar-hospital-price-guide", has: cfg.hasSadarHospitalPricing, bn: "খরচ কত: হাসপাতাল ফি ও টেস্ট খরচের হিসাব" },
    { id: "diabetic-hospital-price-guide", has: cfg.hasDiabeticHospitalPricing, bn: "খরচ কত: হাসপাতাল ফি ও টেস্ট খরচের হিসাব" },
    { id: "pharmacy-price-guide", has: cfg.hasPharmacyPricing, bn: "খরচ কত: জরুরি ওষুধ ও ডেলিভারি ফি তালিকা" },
    { id: "blood-price-guide", has: cfg.hasBloodPricing, bn: "খরচ কত: রক্ত পরীক্ষা ও ট্রান্সফিউশন ফি তালিকা" },
    { id: "ambulance-price-guide", has: cfg.hasAmbulancePricing, bn: "খরচ কত: অ্যাম্বুলেন্স ভাড়া ও অক্সিজেন খরচের হিসাব" },
    { id: "critical-care-price-guide", has: cfg.hasCriticalCarePricing, bn: "খরচ কত: আইসিইউ, সিসিইউ ও এনআইসিইউ খরচের হিসাব" },
    { id: "stroke-cardiac-price-guide", has: cfg.hasStrokeCardiacPricing, bn: "খরচ কত: জরুরি টেস্ট ও সিসিইউ খরচের হিসাব" },
    { id: "home-care-price-guide", has: cfg.hasHomeCarePricing, bn: "খরচ কত: হোম স্যাম্পল ও নার্সিং খরচের হিসাব" },
    { id: "oxygen-price-guide", has: cfg.hasOxygenPricing, bn: "খরচ কত: অক্সিজেন রিফিল ও হোম ভেন্টিলেটর খরচের হিসাব" },
    { id: "dengue-typhoid-price-guide", has: cfg.hasDengueTyphoidPricing, bn: "খরচ কত: ডেঙ্গু ও টাইফয়েড টেস্ট এবং ভর্তি খরচের হিসাব" },
  ];
}

export {
  type DiagnosticTocTitles,
  DIAGNOSTIC_TOC_MAP,
  getDiagnosticTocTitles,
} from "@/app/blog/utils/blogDiagnosticMetadata";

export function getHospitalTocTitles(currentSlug: string | undefined) {
  const isIcu = currentSlug === "feni-icu-ccu-nicu-bed-charges-and-facilities-guide";
  const isStrokeCardiac = currentSlug === "stroke-and-heart-attack-emergency-protocol-feni";
  const isHomeCare = currentSlug === "home-sample-collection-and-nursing-service-in-feni";
  const isOxygen = currentSlug === "feni-oxygen-cylinder-refill-and-home-rent-guide";
  const isDengueTyphoid = currentSlug === "dengue-and-typhoid-test-cost-management-guide-feni";
  return {
    overviewTitle: isIcu
      ? "কী ও কেন: ফেনীতে আইসিইউ ও লাইফ সাপোর্ট কী এবং কেন প্রয়োজন?"
      : isStrokeCardiac
      ? "কী ও কেন: ফেনীতে স্ট্রোক ও হার্ট অ্যাটাক কী এবং কেন জরুরি চিকিৎসা প্রয়োজন?"
      : isHomeCare
      ? "কী ও কেন: ফেনীতে হোম স্যাম্পল ও নার্সিং সেবা কী এবং কেন প্রয়োজন?"
      : isOxygen
      ? "কী ও কেন: ফেনীতে জরুরি অক্সিজেন ও হোম ভেন্টিলেটর কী এবং কেন প্রয়োজন?"
      : isDengueTyphoid
      ? "কী ও কেন: ফেনীতে ডেঙ্গু ও টাইফয়েড কী এবং কেন দ্রুত পরীক্ষা প্রয়োজন?"
      : "কী ও কেন: ফেনী জেলার স্বাস্থ্যসেবা ও পটভূমি কী এবং কেন গুরুত্বপূর্ণ?",
    matrixTitle: isIcu
      ? "কোথায় করাবেন: একনজরে শীর্ষ আইসিইউ ও এনআইসিইউ সুবিধা তুলনা"
      : isStrokeCardiac
      ? "কোথায় করাবেন: একনজরে শীর্ষ স্ট্রোক ও কার্ডিয়াক সেন্টারের সুবিধা তুলনা"
      : isHomeCare
      ? "কোথায় করাবেন: একনজরে শীর্ষ হোম স্যাম্পল ও নার্সিং সেবা তুলনা"
      : isOxygen
      ? "কোথায় পাবেন: একনজরে শীর্ষ অক্সিজেন ও ভেন্টিলেটর সুবিধা তুলনা"
      : isDengueTyphoid
      ? "কোথায় করাবেন: একনজরে শীর্ষ জ্বর চিকিৎসা সুবিধা তুলনা"
      : "কোথায় করাবেন: একনজরে সেরা ১০ হাসপাতালের সুবিধা তুলনা",
    reviewsTitle: isIcu
      ? "কোথায় সেবা পাবেন: শীর্ষ আইসিইউ, সিসিইউ ও নিওনেটাল হাসপাতালের পর্যালোচনা"
      : isStrokeCardiac
      ? "কোথায় সেবা পাবেন: শীর্ষ স্ট্রোক ও কার্ডিয়াক চিকিৎসাকেন্দ্রের পর্যালোচনা"
      : isHomeCare
      ? "কোথায় সেবা পাবেন: শীর্ষ হোম স্যাম্পল ও নার্সিং কেয়ার প্রতিষ্ঠানের পর্যালোচনা"
      : isOxygen
      ? "কোথায় সেবা পাবেন: শীর্ষ অক্সিজেন ও হোম ভেন্টিলেটর প্রদানকারী প্রতিষ্ঠানের পর্যালোচনা"
      : isDengueTyphoid
      ? "কোথায় সেবা পাবেন: শীর্ষ ডেঙ্গু ও টাইফয়েড চিকিৎসাকেন্দ্রের পর্যালোচনা"
      : "কোথায় সেবা পাবেন: সেরা ১০ হাসপাতালের বিস্তারিত পর্যালোচনা",
    priceGuideId: isIcu
      ? "critical-care-price-guide"
      : isStrokeCardiac
      ? "stroke-cardiac-price-guide"
      : isHomeCare
      ? "home-care-price-guide"
      : isOxygen
      ? "oxygen-price-guide"
      : isDengueTyphoid
      ? "dengue-typhoid-price-guide"
      : undefined,
    priceGuideTitle: isIcu
      ? "খরচ কত: আইসিইউ, সিসিইউ ও এনআইসিইউ চার্জ ও ছাড়"
      : isStrokeCardiac
      ? "খরচ কত: জরুরি টেস্ট, সিসিইউ ও বেড খরচের হিসাব"
      : isHomeCare
      ? "খরচ কত: হোম স্যাম্পল, নার্সিং চার্জ ও মেম্বার ছাড়"
      : isOxygen
      ? "খরচ কত: অক্সিজেন সিলিন্ডার, রিফিল ও ভেন্টিলেটর ভাড়া তালিকা"
      : isDengueTyphoid
      ? "খরচ কত: ডেঙ্গু, টাইফয়েড ও প্লাটিলেট টেস্ট খরচ ও ছাড়"
      : undefined,
    selectionGuideTitle: isIcu
      ? "কীভাবে নির্বাচন করবেন: জরুরি ক্রিটিক্যাল কেয়ার ও আইসিইউ হাসপাতাল নির্বাচনের উপায়"
      : isStrokeCardiac
      ? "কীভাবে নির্বাচন করবেন: জরুরি স্ট্রোক ও হৃদরোগ হাসপাতাল নির্বাচনের উপায়"
      : isHomeCare
      ? "কীভাবে নির্বাচন করবেন: সঠিক হোম ল্যাব ও নার্সিং সেবা নির্বাচনের উপায়"
      : isOxygen
      ? "কীভাবে নির্বাচন করবেন: নিরাপদ অক্সিজেন সিলিন্ডার ও ভেন্টিলেটর নির্বাচনের উপায়"
      : isDengueTyphoid
      ? "কীভাবে নির্বাচন করবেন: সঠিক ডেঙ্গু ও টাইফয়েড চিকিৎসাকেন্দ্র নির্বাচনের উপায়"
      : "কীভাবে নির্বাচন করবেন: সঠিক হাসপাতাল নির্বাচনের উপায়",
    emergencyTitle: "কখন জরুরি বিভাগে যাবেন: জরুরি যোগাযোগ ও অ্যাম্বুলেন্স হটলাইন",
  };
}

