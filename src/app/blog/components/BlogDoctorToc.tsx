import { DoctorSpecialtyGroup, HospitalReviewItem } from "@/types/blog";
import { toBanglaNums } from "@/lib/utils";
import { TocSubList } from "./BlogTocList";

interface PricingGuideMeta {
  id: string;
  bn: string;
  has?: boolean;
}

interface BlogDoctorTocProps {
  isUpazilaArticle: boolean;
  doctorGroups?: DoctorSpecialtyGroup[];
  hospitals?: HospitalReviewItem[];
  pricingGuides: PricingGuideMeta[];
  hasDoctorPricing: boolean;
  secNum: (n: number) => string;
  linkClass: (targetId: string, isBold?: boolean) => string;
  activeId?: string;
  currentSlug?: string;
}

export function BlogDoctorToc({
  isUpazilaArticle,
  doctorGroups = [],
  hospitals = [],
  pricingGuides,
  hasDoctorPricing,
  secNum,
  linkClass,
  activeId,
  currentSlug,
}: BlogDoctorTocProps) {
  if (isUpazilaArticle) {
    return (
      <ol className="space-y-1.5 list-none pl-0">
        <li>
          <a href="#overview" className={linkClass("overview")}>
            {secNum(1)}উপজেলা স্বাস্থ্যসেবা ও পটভূমি
          </a>
        </li>
        <li>
          <a href="#specialist-doctors" className={linkClass("specialist-doctors", true)}>
            {secNum(2)}উপজেলা অনুযায়ী বিশেষজ্ঞ ডাক্তার তালিকা
          </a>
          <TocSubList
            items={doctorGroups.map((g, idx) => ({
              id: `dept-${g.department}`,
              name: `${toBanglaNums(idx + 1)}. ${g.departmentNameBn}`,
            }))}
            activeId={activeId}
          />
        </li>
        <li>
          <a href="#chamber-hubs" className={linkClass("chamber-hubs")}>
            {secNum(3)}উপজেলার প্রধান চেম্বার হাবসমূহ
          </a>
        </li>
        <li>
          <a href="#serial-guide" className={linkClass("serial-guide")}>
            {secNum(4)}ডাক্তারের সিরিয়াল বুকিং নিয়মাবলী
          </a>
        </li>
        <li>
          <a href="#upazila-price-guide" className={linkClass("upazila-price-guide")}>
            {secNum(5)}উপজেলা স্বাস্থ্যসেবা ও টেস্ট ফি তালিকা
          </a>
        </li>
        <li>
          <a href="#comparison-matrix" className={linkClass("comparison-matrix")}>
            {secNum(6)}একনজরে উপজেলা হাসপাতালের তুলনা
          </a>
        </li>
        <li>
          <a href="#hospital-reviews" className={linkClass("hospital-reviews", true)}>
            {secNum(7)}{`${toBanglaNums(hospitals.length)}টি চিকিৎসাকেন্দ্রের বিস্তারিত পর্যালোচনা`}
          </a>
          <TocSubList
            items={hospitals.map((h) => ({
              id: `hospital-${h.rank}`,
              name: `${toBanglaNums(h.rank)}. ${h.nameBn}`,
            }))}
            activeId={activeId}
          />
        </li>
        <li>
          <a href="#selection-guide" className={linkClass("selection-guide")}>
            {secNum(8)}স্বাস্থ্যসেবা নির্বাচন ও দালাল সতর্কতা
          </a>
        </li>
        <li>
          <a href="#emergency-directory" className={linkClass("emergency-directory")}>
            {secNum(9)}জরুরি যোগাযোগ ও সদর রেফারেল অ্যাম্বুলেন্স
          </a>
        </li>
        <li>
          <a href="#faq-section" className={linkClass("faq-section")}>
            {secNum(10)}সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
          </a>
        </li>
      </ol>
    );
  }

  const isDoctorAppointment = currentSlug === "feni-doctor-serial-appointment-guide";
  const isHospitalSskHub = currentSlug === "feni-hospital-road-ss-k-road-chamber-hub-guide";
  const isTrunkMizanHub = currentSlug === "feni-trunk-road-mizan-road-clinic-pharmacy-hub-guide";
  const isFridayWeekendGuide = currentSlug === "feni-friday-weekend-doctor-chamber-serial-guide";
  const isFemaleGynaeGuide = currentSlug === "feni-female-gynecologist-doctor-chamber-list";
  const isEveningGuide = currentSlug === "feni-evening-doctor-chambers-after-5pm-guide";
  const isHubGuide = isHospitalSskHub || isTrunkMizanHub || isFridayWeekendGuide || isFemaleGynaeGuide || isEveningGuide;

  return (
    <ol className="space-y-1.5 list-none pl-0">
      <li>
        <a href="#overview" className={linkClass("overview")}>
          {secNum(1)}
          {isDoctorAppointment
            ? "ফেনীতে ডাক্তার সিরিয়াল ও স্বাস্থ্যসেবা প্রেক্ষাপট"
            : isHospitalSskHub
            ? "হাসপাতাল রোড ও এসএসকে রোড স্বাস্থ্যসেবা প্রেক্ষাপট"
            : isTrunkMizanHub
            ? "ট্রাঙ্ক রোড ও মিজান রোড স্বাস্থ্যসেবা প্রেক্ষাপট"
            : isFridayWeekendGuide
            ? "শুক্রবার ও ছুটির দিনের স্বাস্থ্যসেবা প্রেক্ষাপট"
            : isFemaleGynaeGuide
            ? "ফেনীতে মহিলা গাইনী ডাক্তার ও প্রসূতিসেবা প্রেক্ষাপট"
            : isEveningGuide
            ? "বিকেল ও সান্ধ্যকালীন স্বাস্থ্যসেবা প্রেক্ষাপট"
            : "ফেনীর স্বাস্থ্যসেবা ও বিশেষজ্ঞ ডাক্তার"}
        </a>
      </li>
      <li>
        <a
          href="#specialist-doctors"
          className={linkClass("specialist-doctors", true)}
        >
          {secNum(2)}
          {isDoctorAppointment
            ? "বিভাগভিত্তিক বিশেষজ্ঞ ডাক্তার ও চেম্বার শিডিউল"
            : isHospitalSskHub
            ? "হাসপাতাল ও এসএসকে রোডের প্রধান বিশেষজ্ঞ ডাক্তার তালিকা"
            : isTrunkMizanHub
            ? "ট্রাঙ্ক ও মিজান রোডের প্রধান বিশেষজ্ঞ ডাক্তার তালিকা"
            : isFridayWeekendGuide
            ? "শুক্রবার ও ছুটির দিনের প্রধান বিশেষজ্ঞ ডাক্তার তালিকা"
            : isFemaleGynaeGuide
            ? "শীর্ষ ২০ জন মহিলা গাইনী ও প্রসূতিরোগ বিশেষজ্ঞ তালিকা"
            : isEveningGuide
            ? "সান্ধ্যকালীন প্রধান বিশেষজ্ঞ ডাক্তার তালিকা (সন্ধ্যা ৫টার পর)"
            : "বিভাগভিত্তিক বিশেষজ্ঞ ডাক্তার তালিকা"}
        </a>
        <TocSubList
          items={doctorGroups.map((g, idx) => ({
            id: `dept-${g.department}`,
            name: `${toBanglaNums(idx + 1)}. ${g.departmentNameBn}`,
          }))}
          activeId={activeId}
        />
      </li>
      <li>
        <a href="#chamber-hubs" className={linkClass("chamber-hubs")}>
          {secNum(3)}
          {isHospitalSskHub
            ? "হাসপাতাল ও এসএসকে রোড প্রধান চেম্বার করিডোর"
            : isTrunkMizanHub
            ? "ট্রাঙ্ক ও মিজান রোড প্রধান চেম্বার ও ফার্মেসি হাব"
            : isFridayWeekendGuide
            ? "শুক্রবার ও ছুটির দিনের প্রধান চেম্বার করিডোর"
            : isFemaleGynaeGuide
            ? "মহিলা স্বাস্থ্য ও প্রধান চেম্বার করিডোরসমূহ"
            : isEveningGuide
            ? "সান্ধ্যকালীন প্রধান চেম্বার ও ফার্মেসি করিডোর"
            : "ফেনী শহরের প্রধান চেম্বার হাবসমূহ"}
        </a>
      </li>
      <li>
        <a href="#serial-guide" className={linkClass("serial-guide")}>
          {secNum(4)}
          {isDoctorAppointment
            ? "দালালমুক্ত সরাসরি সিরিয়াল নেওয়ার সহজ উপায়"
            : isHubGuide
            ? "দালালমুক্ত সরাসরি সিরিয়াল নেওয়ার সহজ ৫টি নিয়ম"
            : "ডাক্তারের সিরিয়াল নেওয়ার নিয়মাবলী"}
        </a>
      </li>
      {pricingGuides.filter((g) => g.has).map((guide) => (
        <li key={guide.id}>
          <a href={`#${guide.id}`} className={linkClass(guide.id)}>
            {secNum(5)}{guide.bn}
          </a>
        </li>
      ))}
      <li>
        <a href="#selection-guide" className={linkClass("selection-guide")}>
          {secNum(hasDoctorPricing ? 6 : 5)}
          {isDoctorAppointment || isHubGuide
            ? "নির্ভরযোগ্য ডাক্তার নির্বাচন ও দালাল প্রতিরোধের উপায়"
            : "সঠিক ডাক্তার ও ক্লিনিক নির্বাচনের উপায়"}
        </a>
      </li>
      <li>
        <a href="#emergency-directory" className={linkClass("emergency-directory")}>
          {secNum(hasDoctorPricing ? 7 : 6)}জরুরি যোগাযোগ ও হটলাইন
        </a>
      </li>
      <li>
        <a href="#faq-section" className={linkClass("faq-section")}>
          {secNum(hasDoctorPricing ? 8 : 7)}সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
        </a>
      </li>
    </ol>
  );
}
