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
    { id: "maternity-price-guide", has: cfg.hasMaternityPricing, bn: "প্রসূতি ও ডেলিভারি খরচের হিসাব" },
    { id: "cardiac-price-guide", has: cfg.hasCardiacPricing, bn: "হৃদরোগ পরীক্ষা খরচের হিসাব" },
    { id: "kidney-price-guide", has: cfg.hasKidneyPricing, bn: "ডায়ালাইসিস ও কিডনি টেস্ট খরচের হিসাব" },
    { id: "pediatric-price-guide", has: cfg.hasPediatricPricing, bn: "শিশু চিকিৎসা ও টিকা খরচের হিসাব" },
    { id: "skin-price-guide", has: cfg.hasSkinPricing, bn: "চর্মরোগ টেস্ট ও প্রসিডিউর খরচের হিসাব" },
    { id: "eye-price-guide", has: cfg.hasEyePricing, bn: "চক্ষু পরীক্ষা ও ছানি অপারেশন খরচের হিসাব" },
    { id: "orthopedic-price-guide", has: cfg.hasOrthopedicPricing, bn: "অর্থোপেডিক ও জয়েন্ট টেস্ট খরচের হিসাব" },
    { id: "ent-price-guide", has: cfg.hasEntPricing, bn: "ইএনটি টেস্ট ও সার্জারি খরচের হিসাব" },
    { id: "surgery-price-guide", has: cfg.hasSurgeryPricing, bn: "ল্যাপারোস্কোপিক ও সার্জারি খরচের হিসাব" },
    { id: "neurology-price-guide", has: cfg.hasNeurologyPricing, bn: "ব্রেন এমআরআই, সিটি ও নিউরো টেস্ট খরচের হিসাব" },
    { id: "diabetes-price-guide", has: cfg.hasDiabetesPricing, bn: "ডায়াবেটিস, HbA1c ও হরমোন টেস্ট খরচের হিসাব" },
    { id: "psychiatry-price-guide", has: cfg.hasPsychiatryPricing, bn: "সাইকিয়াট্রি ও থেরাপি খরচের হিসাব" },
    { id: "sadar-hospital-price-guide", has: cfg.hasSadarHospitalPricing, bn: "হাসপাতাল ফি ও টেস্ট খরচের হিসাব" },
    { id: "diabetic-hospital-price-guide", has: cfg.hasDiabeticHospitalPricing, bn: "হাসপাতাল ফি ও টেস্ট খরচের হিসাব" },
    { id: "pharmacy-price-guide", has: cfg.hasPharmacyPricing, bn: "জরুরি ওষুধ ও ডেলিভারি ফি তালিকা" },
    { id: "blood-price-guide", has: cfg.hasBloodPricing, bn: "রক্ত পরীক্ষা ও ট্রান্সফিউশন ফি তালিকা" },
    { id: "ambulance-price-guide", has: cfg.hasAmbulancePricing, bn: "অ্যাম্বুলেন্স ভাড়া ও অক্সিজেন খরচের হিসাব" },
    { id: "critical-care-price-guide", has: cfg.hasCriticalCarePricing, bn: "আইসিইউ, সিসিইউ ও এনআইসিইউ খরচের হিসাব" },
    { id: "stroke-cardiac-price-guide", has: cfg.hasStrokeCardiacPricing, bn: "জরুরি টেস্ট ও সিসিইউ খরচের হিসাব" },
    { id: "home-care-price-guide", has: cfg.hasHomeCarePricing, bn: "হোম স্যাম্পল ও নার্সিং খরচের হিসাব" },
    { id: "oxygen-price-guide", has: cfg.hasOxygenPricing, bn: "অক্সিজেন রিফিল ও হোম ভেন্টিলেটর খরচের হিসাব" },
    { id: "dengue-typhoid-price-guide", has: cfg.hasDengueTyphoidPricing, bn: "ডেঙ্গু ও টাইফয়েড টেস্ট এবং ভর্তি খরচের হিসাব" },
  ];
}

export function getDiagnosticTocTitles(currentSlug: string | undefined) {
  const isCtMri = currentSlug === "feni-ct-scan-and-mri-test-price-guide";
  const isPregnancyUsg = currentSlug === "pregnancy-ultrasonography-4d-anomaly-scan-in-feni";
  const isCheckup = currentSlug === "full-body-health-checkup-packages-in-feni";
  return {
    overviewTitle: isCtMri
      ? "ফেনীতে সিটি স্ক্যান ও এমআরআই পরিকাঠামো"
      : isPregnancyUsg
      ? "ফেনীতে প্রেগন্যান্সি আল্ট্রাসোনোগ্রাফির গুরুত্ব ও প্রেক্ষাপট"
      : isCheckup
      ? "ফেনীতে প্রিভেন্টিভ হেলথ স্ক্রিনিংয়ের গুরুত্ব ও প্রেক্ষাপট"
      : "ফেনীর ডায়াগনস্টিক ও ল্যাব পরিকাঠামো",
    matrixTitle: isCtMri
      ? "একনজরে শীর্ষ সিটি স্ক্যান ও এমআরআই তুলনা"
      : isPregnancyUsg
      ? "একনজরে শীর্ষ ৪ডি আল্ট্রাসাউন্ড ডায়াগনস্টিক তুলনা"
      : isCheckup
      ? "একনজরে শীর্ষ হোল বডি চেকআপ সেন্টারের তুলনা"
      : "একনজরে সেরা ১০ ডায়াগনস্টিকের তুলনা",
    reviewsTitle: isCtMri
      ? "শীর্ষ সিটি স্ক্যান ও এমআরআই সেন্টারের পর্যালোচনা"
      : isPregnancyUsg
      ? "ফেনীর শীর্ষ ৪ডি আল্ট্রাসাউন্ড ও ডায়াগনস্টিক সেন্টারের পর্যালোচনা"
      : isCheckup
      ? "ফেনীর শীর্ষ চেকআপ ও ডায়াগনস্টিক সেন্টারের পর্যালোচনা"
      : "সেরা ১০ ডায়াগনস্টিক সেন্টারের পর্যালোচনা",
    priceGuideTitle: isCtMri
      ? "সিটি স্ক্যান ও এমআরআই মূল্যতালিকা ও ছাড়"
      : isPregnancyUsg
      ? "প্রেগন্যান্সি ইউএসজি ও ৪ডি টেস্ট মূল্যতালিকা ও ছাড়"
      : isCheckup
      ? "হোল বডি চেকআপ প্যাকেজ মূল্যতালিকা ও ছাড়"
      : "টেস্টের মূল্যতালিকা ও মেম্বার ছাড়",
    selectionGuideTitle: isCtMri
      ? "সঠিক সিটি স্ক্যান ও এমআরআই সেন্টার নির্বাচনের উপায়"
      : isPregnancyUsg
      ? "সঠিক আল্ট্রাসাউন্ড ও অ্যানোমালি স্ক্যান সেন্টার নির্বাচনের উপায়"
      : isCheckup
      ? "সঠিক হোল বডি চেকআপ ল্যাব নির্বাচনের উপায়"
      : "নির্ভরযোগ্য ডায়াগনস্টিক নির্বাচনের উপায়",
  };
}

export function getHospitalTocTitles(currentSlug: string | undefined) {
  const isIcu = currentSlug === "feni-icu-ccu-nicu-bed-charges-and-facilities-guide";
  const isStrokeCardiac = currentSlug === "stroke-and-heart-attack-emergency-protocol-feni";
  const isHomeCare = currentSlug === "home-sample-collection-and-nursing-service-in-feni";
  const isOxygen = currentSlug === "feni-oxygen-cylinder-refill-and-home-rent-guide";
  const isDengueTyphoid = currentSlug === "dengue-and-typhoid-test-cost-management-guide-feni";
  return {
    overviewTitle: isIcu
      ? "ফেনীতে আইসিইউ ও লাইফ সাপোর্ট পরিকাঠামো"
      : isStrokeCardiac
      ? "ফেনীতে স্ট্রোক ও হৃদরোগ সংকট ও প্রেক্ষাপট"
      : isHomeCare
      ? "ফেনীতে হোম স্যাম্পল ও নার্সিং সেবার প্রেক্ষাপট"
      : isOxygen
      ? "ফেনীতে জরুরি অক্সিজেন ও হোম ভেন্টিলেটর পরিকাঠামো"
      : isDengueTyphoid
      ? "ফেনীতে ডেঙ্গু ও টাইফয়েড চিকিৎসা প্রেক্ষাপট"
      : "ফেনী জেলার স্বাস্থ্যসেবা ও পটভূমি",
    matrixTitle: isIcu
      ? "একনজরে শীর্ষ আইসিইউ ও এনআইসিইউ সুবিধা তুলনা"
      : isStrokeCardiac
      ? "একনজরে শীর্ষ স্ট্রোক ও কার্ডিয়াক সেন্টারের সুবিধা তুলনা"
      : isHomeCare
      ? "একনজরে শীর্ষ হোম স্যাম্পল ও নার্সিং সেবা তুলনা"
      : isOxygen
      ? "একনজরে শীর্ষ অক্সিজেন ও ভেন্টিলেটর সুবিধা তুলনা"
      : isDengueTyphoid
      ? "একনজরে শীর্ষ জ্বর চিকিৎসা সুবিধা তুলনা"
      : "একনজরে সেরা ১০ হাসপাতালের তুলনা",
    reviewsTitle: isIcu
      ? "শীর্ষ আইসিইউ, সিসিইউ ও নিওনেটাল হাসপাতালের পর্যালোচনা"
      : isStrokeCardiac
      ? "শীর্ষ স্ট্রোক ও কার্ডিয়াক চিকিৎসাকেন্দ্রের পর্যালোচনা"
      : isHomeCare
      ? "শীর্ষ হোম স্যাম্পল ও নার্সিং কেয়ার প্রতিষ্ঠানের পর্যালোচনা"
      : isOxygen
      ? "শীর্ষ অক্সিজেন ও হোম ভেন্টিলেটর প্রদানকারী প্রতিষ্ঠানের পর্যালোচনা"
      : isDengueTyphoid
      ? "শীর্ষ ডেঙ্গু ও টাইফয়েড চিকিৎসাকেন্দ্রের পর্যালোচনা"
      : "সেরা ১০ হাসপাতালের বিস্তারিত পর্যালোচনা",
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
      ? "আইসিইউ, সিসিইউ ও এনআইসিইউ চার্জ ও ছাড়"
      : isStrokeCardiac
      ? "জরুরি টেস্ট, সিসিইউ ও বেড খরচের হিসাব"
      : isHomeCare
      ? "হোম স্যাম্পল, নার্সিং চার্জ ও মেম্বার ছাড়"
      : isOxygen
      ? "অক্সিজেন সিলিন্ডার, রিফিল ও ভেন্টিলেটর ভাড়া তালিকা"
      : isDengueTyphoid
      ? "ডেঙ্গু, টাইফয়েড ও প্লাটিলেট টেস্ট খরচ ও ছাড়"
      : undefined,
    selectionGuideTitle: isIcu
      ? "জরুরি ক্রিটিক্যাল কেয়ার ও আইসিইউ হাসপাতাল নির্বাচনের উপায়"
      : isStrokeCardiac
      ? "জরুরি স্ট্রোক ও হৃদরোগ হাসপাতাল নির্বাচনের উপায়"
      : isHomeCare
      ? "সঠিক হোম ল্যাব ও নার্সিং সেবা নির্বাচনের উপায়"
      : isOxygen
      ? "নিরাপদ অক্সিজেন সিলিন্ডার ও ভেন্টিলেটর নির্বাচনের উপায়"
      : isDengueTyphoid
      ? "সঠিক ডেঙ্গু ও টাইফয়েড চিকিৎসাকেন্দ্র নির্বাচনের উপায়"
      : "সঠিক হাসপাতাল নির্বাচনের উপায়",
    emergencyTitle: "জরুরি যোগাযোগ ও অ্যাম্বুলেন্স হটলাইন",
  };
}

