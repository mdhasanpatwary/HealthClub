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
  isEn: boolean;
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
  isEn,
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
  hasCriticalCarePricing?: boolean;
  hasStrokeCardiacPricing?: boolean;
  hasHomeCarePricing?: boolean;
  hasOxygenPricing?: boolean;
  hasDengueTyphoidPricing?: boolean;
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
    { id: "critical-care-price-guide", has: cfg.hasCriticalCarePricing, en: "ICU, CCU & NICU Bed Charges Guide", bn: "আইসিইউ, সিসিইউ ও এনআইসিইউ খরচের হিসাব" },
    { id: "stroke-cardiac-price-guide", has: cfg.hasStrokeCardiacPricing, en: "Stroke & Cardiac Emergency Pricing", bn: "জরুরি টেস্ট ও সিসিইউ খরচের হিসাব" },
    { id: "home-care-price-guide", has: cfg.hasHomeCarePricing, en: "Home Care & Nursing Pricing", bn: "হোম স্যাম্পল ও নার্সিং খরচের হিসাব" },
    { id: "oxygen-price-guide", has: cfg.hasOxygenPricing, en: "Oxygen Refill & Home Ventilator Cost Guide", bn: "অক্সিজেন রিফিল ও হোম ভেন্টিলেটর খরচের হিসাব" },
    { id: "dengue-typhoid-price-guide", has: cfg.hasDengueTyphoidPricing, en: "Dengue & Typhoid Diagnostics & Inpatient Pricing", bn: "ডেঙ্গু ও টাইফয়েড টেস্ট এবং ভর্তি খরচের হিসাব" },
  ];
}

export function getDiagnosticTocTitles(currentSlug: string | undefined, isEn: boolean) {
  const isCtMri = currentSlug === "feni-ct-scan-and-mri-test-price-guide";
  const isPregnancyUsg = currentSlug === "pregnancy-ultrasonography-4d-anomaly-scan-in-feni";
  const isCheckup = currentSlug === "full-body-health-checkup-packages-in-feni";
  return {
    overviewTitle: isCtMri
      ? (isEn ? "CT Scan & MRI Landscape in Feni" : "ফেনীতে সিটি স্ক্যান ও এমআরআই পরিকাঠামো")
      : isPregnancyUsg
      ? (isEn ? "Pregnancy Ultrasound Landscape in Feni" : "ফেনীতে প্রেগন্যান্সি আল্ট্রাসোনোগ্রাফির গুরুত্ব ও প্রেক্ষাপট")
      : isCheckup
      ? (isEn ? "Preventive Health Screening Landscape in Feni" : "ফেনীতে প্রিভেন্টিভ হেলথ স্ক্রিনিংয়ের গুরুত্ব ও প্রেক্ষাপট")
      : (isEn ? "Diagnostic Healthcare in Feni" : "ফেনীর ডায়াগনস্টিক ও ল্যাব পরিকাঠামো"),
    matrixTitle: isCtMri
      ? (isEn ? "CT & MRI Centers Comparison Matrix" : "একনজরে শীর্ষ সিটি স্ক্যান ও এমআরআই তুলনা")
      : isPregnancyUsg
      ? (isEn ? "4D USG Centers Comparison Matrix" : "একনজরে শীর্ষ ৪ডি আল্ট্রাসাউন্ড ডায়াগনস্টিক তুলনা")
      : isCheckup
      ? (isEn ? "Checkup Centers Comparison Matrix" : "একনজরে শীর্ষ হোল বডি চেকআপ সেন্টারের তুলনা")
      : (isEn ? "Equipment Comparison Matrix" : "একনজরে সেরা ১০ ডায়াগনস্টিকের তুলনা"),
    reviewsTitle: isCtMri
      ? (isEn ? "Detailed CT & MRI Center Reviews" : "শীর্ষ সিটি স্ক্যান ও এমআরআই সেন্টারের পর্যালোচনা")
      : isPregnancyUsg
      ? (isEn ? "Leading 4D Ultrasound Centers in Feni" : "ফেনীর শীর্ষ ৪ডি আল্ট্রাসাউন্ড ও ডায়াগনস্টিক সেন্টারের পর্যালোচনা")
      : isCheckup
      ? (isEn ? "Leading Checkup & Diagnostic Centers in Feni" : "ফেনীর শীর্ষ চেকআপ ও ডায়াগনস্টিক সেন্টারের পর্যালোচনা")
      : (isEn ? "Detailed Diagnostic Center Reviews" : "সেরা ১০ ডায়াগনস্টিক সেন্টারের পর্যালোচনা"),
    priceGuideTitle: isCtMri
      ? (isEn ? "CT & MRI Pricing & Member Savings" : "সিটি স্ক্যান ও এমআরআই মূল্যতালিকা ও ছাড়")
      : isPregnancyUsg
      ? (isEn ? "Pregnancy Ultrasound Pricing & Member Savings" : "প্রেগন্যান্সি ইউএসজি ও ৪ডি টেস্ট মূল্যতালিকা ও ছাড়")
      : isCheckup
      ? (isEn ? "Checkup Packages Pricing & Member Savings" : "হোল বডি চেকআপ প্যাকেজ মূল্যতালিকা ও ছাড়")
      : (isEn ? "Test Pricing & Member Savings" : "টেস্টের মূল্যতালিকা ও মেম্বার ছাড়"),
    selectionGuideTitle: isCtMri
      ? (isEn ? "Guidelines for Choosing CT & MRI Centers" : "সঠিক সিটি স্ক্যান ও এমআরআই সেন্টার নির্বাচনের উপায়")
      : isPregnancyUsg
      ? (isEn ? "Guidelines for Choosing 4D Ultrasound Centers" : "সঠিক আল্ট্রাসাউন্ড ও অ্যানোমালি স্ক্যান সেন্টার নির্বাচনের উপায়")
      : isCheckup
      ? (isEn ? "Guidelines for Choosing Quality Checkup Labs" : "সঠিক হোল বডি চেকআপ ল্যাব নির্বাচনের উপায়")
      : (isEn ? "Guidelines for Choosing Quality Diagnostics" : "নির্ভরযোগ্য ডায়াগনস্টিক নির্বাচনের উপায়"),
  };
}

export function getHospitalTocTitles(currentSlug: string | undefined, isEn: boolean) {
  const isIcu = currentSlug === "feni-icu-ccu-nicu-bed-charges-and-facilities-guide";
  const isStrokeCardiac = currentSlug === "stroke-and-heart-attack-emergency-protocol-feni";
  const isHomeCare = currentSlug === "home-sample-collection-and-nursing-service-in-feni";
  const isOxygen = currentSlug === "feni-oxygen-cylinder-refill-and-home-rent-guide";
  const isDengueTyphoid = currentSlug === "dengue-and-typhoid-test-cost-management-guide-feni";
  return {
    overviewTitle: isIcu
      ? (isEn ? "ICU & Critical Care Landscape in Feni" : "ফেনীতে আইসিইউ ও লাইফ সাপোর্ট পরিকাঠামো")
      : isStrokeCardiac
      ? (isEn ? "Stroke & Heart Attack Landscape in Feni" : "ফেনীতে স্ট্রোক ও হৃদরোগ সংকট ও প্রেক্ষাপট")
      : isHomeCare
      ? (isEn ? "Home Healthcare & Nursing Landscape in Feni" : "ফেনীতে হোম স্যাম্পল ও নার্সিং সেবার প্রেক্ষাপট")
      : isOxygen
      ? (isEn ? "Medical Oxygen & Ventilator Landscape in Feni" : "ফেনীতে জরুরি অক্সিজেন ও হোম ভেন্টিলেটর পরিকাঠামো")
      : isDengueTyphoid
      ? (isEn ? "Dengue & Typhoid Landscape in Feni" : "ফেনীতে ডেঙ্গু ও টাইফয়েড চিকিৎসা প্রেক্ষাপট")
      : (isEn ? "Healthcare Overview of Feni" : "ফেনী জেলার স্বাস্থ্যসেবা ও পটভূমি"),
    matrixTitle: isIcu
      ? (isEn ? "ICU & NICU Hospitals Matrix" : "একনজরে শীর্ষ আইসিইউ ও এনআইসিইউ সুবিধা তুলনা")
      : isStrokeCardiac
      ? (isEn ? "Emergency Centers Comparison Matrix" : "একনজরে শীর্ষ স্ট্রোক ও কার্ডিয়াক সেন্টারের সুবিধা তুলনা")
      : isHomeCare
      ? (isEn ? "Home Care & Phlebotomy Providers Matrix" : "একনজরে শীর্ষ হোম স্যাম্পল ও নার্সিং সেবা তুলনা")
      : isOxygen
      ? (isEn ? "Oxygen & Equipment Comparison Matrix" : "একনজরে শীর্ষ অক্সিজেন ও ভেন্টিলেটর সুবিধা তুলনা")
      : isDengueTyphoid
      ? (isEn ? "Dengue & Fever Facilities Matrix" : "একনজরে শীর্ষ জ্বর চিকিৎসা সুবিধা তুলনা")
      : (isEn ? "Quick Comparison Matrix" : "একনজরে সেরা ১০ হাসপাতালের তুলনা"),
    reviewsTitle: isIcu
      ? (isEn ? "Detailed Critical Care Hospital Reviews" : "শীর্ষ আইসিইউ, সিসিইউ ও নিওনেটাল হাসপাতালের পর্যালোচনা")
      : isStrokeCardiac
      ? (isEn ? "Leading Stroke & Cardiac Center Reviews" : "শীর্ষ স্ট্রোক ও কার্ডিয়াক চিকিৎসাকেন্দ্রের পর্যালোচনা")
      : isHomeCare
      ? (isEn ? "Leading Home Care Provider Reviews" : "শীর্ষ হোম স্যাম্পল ও নার্সিং কেয়ার প্রতিষ্ঠানের পর্যালোচনা")
      : isOxygen
      ? (isEn ? "Leading Oxygen & Ventilator Provider Reviews" : "শীর্ষ অক্সিজেন ও হোম ভেন্টিলেটর প্রদানকারী প্রতিষ্ঠানের পর্যালোচনা")
      : isDengueTyphoid
      ? (isEn ? "Leading Dengue & Typhoid Care Reviews" : "শীর্ষ ডেঙ্গু ও টাইফয়েড চিকিৎসাকেন্দ্রের পর্যালোচনা")
      : (isEn ? "Detailed Hospital Reviews" : "সেরা ১০ হাসপাতালের বিস্তারিত পর্যালোচনা"),
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
      ? (isEn ? "ICU, CCU & NICU Bed Charges & Savings" : "আইসিইউ, সিসিইউ ও এনআইসিইউ চার্জ ও ছাড়")
      : isStrokeCardiac
      ? (isEn ? "Emergency Diagnostics & Bed Charges Guide" : "জরুরি টেস্ট, সিসিইউ ও বেড খরচের হিসাব")
      : isHomeCare
      ? (isEn ? "Home Care & Nursing Charges & Member Savings" : "হোম স্যাম্পল, নার্সিং চার্জ ও মেম্বার ছাড়")
      : isOxygen
      ? (isEn ? "Oxygen Refill, Rental & BiPAP/CPAP Pricing" : "অক্সিজেন সিলিন্ডার, রিফিল ও ভেন্টিলেটর ভাড়া তালিকা")
      : isDengueTyphoid
      ? (isEn ? "Dengue, Typhoid & Platelet Test Charges & Savings" : "ডেঙ্গু, টাইফয়েড ও প্লাটিলেট টেস্ট খরচ ও ছাড়")
      : undefined,
    selectionGuideTitle: isIcu
      ? (isEn ? "Guidelines for Choosing Critical Care & ICU" : "জরুরি ক্রিটিক্যাল কেয়ার ও আইসিইউ হাসপাতাল নির্বাচনের উপায়")
      : isStrokeCardiac
      ? (isEn ? "Guidelines for Choosing Emergency Hospital" : "জরুরি স্ট্রোক ও হৃদরোগ হাসপাতাল নির্বাচনের উপায়")
      : isHomeCare
      ? (isEn ? "Guidelines for Choosing Quality Home Care" : "সঠিক হোম ল্যাব ও নার্সিং সেবা নির্বাচনের উপায়")
      : isOxygen
      ? (isEn ? "Guidelines for Choosing Safe Oxygen & Ventilators" : "নিরাপদ অক্সিজেন সিলিন্ডার ও ভেন্টিলেটর নির্বাচনের উপায়")
      : isDengueTyphoid
      ? (isEn ? "Guidelines for Choosing Fever Care Facilities" : "সঠিক ডেঙ্গু ও টাইফয়েড চিকিৎসাকেন্দ্র নির্বাচনের উপায়")
      : (isEn ? "How to Choose the Right Hospital" : "সঠিক হাসপাতাল নির্বাচনের উপায়"),
    emergencyTitle: isEn ? "Emergency Contacts & Ambulance" : "জরুরি যোগাযোগ ও অ্যাম্বুলেন্স হটলাইন",
  };
}

