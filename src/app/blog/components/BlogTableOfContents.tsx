"use client";

import { useState, useEffect } from "react";
import { ListOrdered, ChevronDown } from "lucide-react";
import {
  HospitalReviewItem,
  DoctorSpecialtyGroup,
  DiagnosticCenterReviewItem,
  DentalClinicReviewItem,
  PhysiotherapyCenterReviewItem,
} from "@/types/blog";
import { toBanglaNums } from "@/lib/utils";
import { StandardEntityToc, getPricingGuides, getDiagnosticTocTitles, getHospitalTocTitles } from "./BlogTocList";
import { BlogDoctorToc } from "./BlogDoctorToc";

interface BlogTableOfContentsProps {
  hospitals?: HospitalReviewItem[];
  doctorGroups?: DoctorSpecialtyGroup[];
  diagnosticCenters?: DiagnosticCenterReviewItem[];
  dentalClinics?: DentalClinicReviewItem[];
  physiotherapyCenters?: PhysiotherapyCenterReviewItem[];
  hasMaternityPricing?: boolean; hasCardiacPricing?: boolean; hasKidneyPricing?: boolean;
  hasPediatricPricing?: boolean; hasSkinPricing?: boolean; hasEyePricing?: boolean;
  hasOrthopedicPricing?: boolean; hasEntPricing?: boolean; hasSurgeryPricing?: boolean;
  hasNeurologyPricing?: boolean; hasDiabetesPricing?: boolean; hasPsychiatryPricing?: boolean;
  hasSadarHospitalPricing?: boolean; hasDiabeticHospitalPricing?: boolean;
  hasPharmacyPricing?: boolean; hasBloodPricing?: boolean; hasAmbulancePricing?: boolean;
  hasCriticalCarePricing?: boolean; hasStrokeCardiacPricing?: boolean; hasHomeCarePricing?: boolean; hasOxygenPricing?: boolean; hasDengueTyphoidPricing?: boolean; hasUpazilaPricing?: boolean;
  pharmacies?: import("@/types/pharmacyBlog").PharmacyReviewItem[];
  bloodBanks?: import("@/types/bloodBankBlog").BloodBankReviewItem[];
  ambulances?: import("@/types/ambulanceBlog").AmbulanceReviewItem[];
  currentSlug?: string;
  className?: string;
  id?: string;
  defaultOpen?: boolean;
}

export function BlogTableOfContents({
  hospitals = [],
  doctorGroups = [],
  diagnosticCenters = [],
  dentalClinics = [],
  physiotherapyCenters = [],
  pharmacies = [],
  bloodBanks = [],
  ambulances = [],
  hasMaternityPricing = false, hasCardiacPricing = false, hasKidneyPricing = false,
  hasPediatricPricing = false, hasSkinPricing = false, hasEyePricing = false,
  hasOrthopedicPricing = false, hasEntPricing = false, hasSurgeryPricing = false,
  hasNeurologyPricing = false, hasDiabetesPricing = false, hasPsychiatryPricing = false,
  hasSadarHospitalPricing = false, hasDiabeticHospitalPricing = false,
  hasPharmacyPricing = false, hasBloodPricing = false, hasAmbulancePricing = false,
  hasCriticalCarePricing = false, hasStrokeCardiacPricing = false, hasHomeCarePricing = false, hasOxygenPricing = false, hasDengueTyphoidPricing = false, hasUpazilaPricing = false,
  currentSlug,
  className = "",
  id = "table-of-contents",
  defaultOpen = false,
}: BlogTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Only run scroll spy on desktop viewports where sticky sidebar TOC is in view
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const sectionIds = [
      "overview",
      "specialist-doctors",
      "chamber-hubs",
      "serial-guide",
      "comparison-matrix",
      "diagnostic-reviews",
      "hospital-reviews",
      "dental-reviews",
      "physiotherapy-reviews",
      "pharmacy-reviews",
      "blood-bank-reviews",
      "ambulance-reviews",
      "price-guide",
      "surgery-price-guide",
      "maternity-price-guide",
      "critical-care-price-guide",
      "stroke-cardiac-price-guide",
      "home-care-price-guide",
      "oxygen-price-guide",
      "dengue-typhoid-price-guide",
      "cardiac-price-guide",
      "kidney-price-guide",
      "pediatric-price-guide",
      "skin-price-guide",
      "eye-price-guide",
      "orthopedic-price-guide",
      "ent-price-guide",
      "neurology-price-guide",
      "diabetes-price-guide",
      "psychiatry-price-guide",
      "sadar-hospital-price-guide",
      "diabetic-hospital-price-guide",
      "pharmacy-price-guide",
      "blood-price-guide",
      "ambulance-price-guide",
      "upazila-price-guide",
      "selection-guide",
      "emergency-directory",
      "faq-section",
    ];

    let ticking = false;
    const handleScrollSpy = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 120;
          for (let i = sectionIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sectionIds[i]);
            if (el && scrollPosition >= el.offsetTop) {
              setActiveId(sectionIds[i]);
              ticking = false;
              return;
            }
          }
          setActiveId("");
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();

    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  const hasDoctorPricing =
    hasMaternityPricing ||
    hasCardiacPricing ||
    hasKidneyPricing ||
    hasPediatricPricing ||
    hasSkinPricing ||
    hasEyePricing ||
    hasOrthopedicPricing ||
    hasEntPricing ||
    hasSurgeryPricing ||
    hasNeurologyPricing ||
    hasDiabetesPricing ||
    hasPsychiatryPricing ||
    hasSadarHospitalPricing ||
    hasDiabeticHospitalPricing ||
    hasCriticalCarePricing ||
    hasStrokeCardiacPricing ||
    hasHomeCarePricing ||
    hasOxygenPricing ||
    hasDengueTyphoidPricing;

  const isUpazilaArticle = Boolean(hasUpazilaPricing || currentSlug?.includes("healthcare-guide"));
  const isDoctorArticle = !isUpazilaArticle && doctorGroups && doctorGroups.length > 0;
  const isDiagnosticArticle = diagnosticCenters && diagnosticCenters.length > 0;
  const isDentalArticle = dentalClinics && dentalClinics.length > 0;
  const isPhysiotherapyArticle = physiotherapyCenters && physiotherapyCenters.length > 0;
  const isPharmacyArticle = pharmacies && pharmacies.length > 0;
  const isBloodBankArticle = bloodBanks && bloodBanks.length > 0;
  const isAmbulanceArticle = ambulances && ambulances.length > 0;
  const isPurePriceList = currentSlug === "feni-medical-test-price-list";

  const secNum = (n: number) => `${toBanglaNums(n)}. `;

  const linkClass = (targetId: string, isBold = false) => {
    const isActive = activeId === targetId;
    if (isActive) {
      return "text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md block transition-colors";
    }
    return `hover:text-primary transition-colors block py-0.5 ${
      isBold ? "font-semibold text-foreground" : ""
    }`;
  };

  const pricingGuides = getPricingGuides({
    hasMaternityPricing,
    hasCardiacPricing,
    hasKidneyPricing,
    hasPediatricPricing,
    hasSkinPricing,
    hasEyePricing,
    hasOrthopedicPricing,
    hasEntPricing,
    hasSurgeryPricing,
    hasNeurologyPricing,
    hasDiabetesPricing,
    hasPsychiatryPricing,
    hasSadarHospitalPricing,
    hasDiabeticHospitalPricing,
    hasPharmacyPricing,
    hasBloodPricing,
    hasAmbulancePricing,
    hasCriticalCarePricing,
    hasStrokeCardiacPricing,
    hasHomeCarePricing,
    hasOxygenPricing,
    hasDengueTyphoidPricing,
  });


  return (
    <nav
      id={id}
      aria-label="Table of Contents"
      className={`rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-3 ${className}`}
    >
      {/* Header / Toggle Button on Mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-heading text-sm sm:text-base font-bold text-foreground cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-primary" />
          <span>এই লেখার বিষয়বস্তু ও সূচিপত্র</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-primary font-medium sm:hidden">
          <span>{isOpen ? "লুকান" : "দেখুন"}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* Content Links */}
      <div
        className={`space-y-2 text-xs sm:text-sm text-muted-foreground transition-all duration-200 ${
          isOpen ? "block pt-2 border-t border-border/60" : "hidden sm:block"
        }`}
      >
        {isPurePriceList ? (
          <ol className="space-y-1.5 list-none pl-0">
            <li>
              <a href="#overview" className={linkClass("overview")}>
                {secNum(1)}ফেনীর ডায়াগনস্টিক পরিকাঠামো ও প্রেক্ষাপট
              </a>
            </li>
            <li>
              <a href="#price-guide" className={linkClass("price-guide")}>
                {secNum(2)}৮০+ টেস্টের মূল্যতালিকা ও মেম্বার ছাড়
              </a>
            </li>
            <li>
              <a href="#selection-guide" className={linkClass("selection-guide")}>
                {secNum(3)}নির্ভরযোগ্য ল্যাব ও টেস্ট নির্বাচনের উপায়
              </a>
            </li>
            <li>
              <a href="#emergency-directory" className={linkClass("emergency-directory")}>
                {secNum(4)}ডায়াগনস্টিক সাপোর্ট ও জরুরি হেল্পলাইন
              </a>
            </li>
            <li>
              <a href="#faq-section" className={linkClass("faq-section")}>
                {secNum(5)}সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
              </a>
            </li>
          </ol>
        ) : isUpazilaArticle || isDoctorArticle ? (
          <BlogDoctorToc
            isUpazilaArticle={isUpazilaArticle}
            doctorGroups={doctorGroups}
            hospitals={hospitals}
            pricingGuides={pricingGuides}
            hasDoctorPricing={hasDoctorPricing}
            secNum={secNum}
            linkClass={linkClass}
            activeId={activeId}
          />
        ) : isDiagnosticArticle ? (
          <StandardEntityToc
            {...getDiagnosticTocTitles(currentSlug)}
            reviewsId="diagnostic-reviews"
            subItems={diagnosticCenters.map((d) => ({
              id: `diagnostic-${d.rank}`,
              name: `${toBanglaNums(d.rank)}. ${d.nameBn}`,
            }))}
            priceGuideId="price-guide"
            emergencyTitle="জরুরি যোগাযোগ ও অ্যাম্বুলেন্স হটলাইন"
            secNum={secNum}
            activeId={activeId}
          />
        ) : isDentalArticle ? (
          <StandardEntityToc
            overviewTitle="ফেনীর ডেন্টাল চিকিৎসাব্যবস্থা ও পটভূমি"
            matrixTitle="একনজরে সেরা ১০ ডেন্টাল ক্লিনিকের তুলনা"
            reviewsTitle="সেরা ১০ ডেন্টাল ক্লিনিকের বিস্তারিত পর্যালোচনা"
            reviewsId="dental-reviews"
            subItems={dentalClinics.map((c) => ({
              id: `dental-${c.rank}`,
              name: `${toBanglaNums(c.rank)}. ${c.nameBn}`,
            }))}
            priceGuideId="price-guide"
            priceGuideTitle="চিকিৎসা ফি ও মেম্বার সাশ্রয় তালিকা"
            selectionGuideTitle="সঠিক ডেন্টাল ক্লিনিক নির্বাচনের উপায়"
            secNum={secNum}
            activeId={activeId}
          />
        ) : isPhysiotherapyArticle ? (
          <StandardEntityToc
            overviewTitle="ফেনীর ফিজিওথেরাপি চিকিৎসাব্যবস্থা ও পটভূমি"
            matrixTitle="একনজরে সেরা ৮ ফিজিওথেরাপি সেন্টারের তুলনা"
            reviewsTitle="সেরা ৮ ফিজিওথেরাপি সেন্টারের বিস্তারিত পর্যালোচনা"
            reviewsId="physiotherapy-reviews"
            subItems={physiotherapyCenters.map((c) => ({
              id: `physio-${c.rank}`,
              name: `${toBanglaNums(c.rank)}. ${c.nameBn}`,
            }))}
            priceGuideId="price-guide"
            priceGuideTitle="থেরাপি ফি ও মেম্বার সাশ্রয় তালিকা"
            selectionGuideTitle="সঠিক ফিজিওথেরাপি সেন্টার নির্বাচনের উপায়"
            secNum={secNum}
            activeId={activeId}
          />
        ) : isPharmacyArticle ? (
          <StandardEntityToc
            overviewTitle="ফেনীতে জরুরি ওষুধ ও ফার্মেসির পটভূমি"
            matrixTitle="একনজরে শীর্ষ ফার্মেসির সুবিধা তুলনা"
            reviewsTitle="সেরা ১২ ফার্মেসির বিস্তারিত পর্যালোচনা"
            reviewsId="pharmacy-reviews"
            subItems={pharmacies.map((p) => ({
              id: `pharmacy-${p.rank}`,
              name: `${toBanglaNums(p.rank)}. ${p.nameBn}`,
            }))}
            priceGuideId="pharmacy-price-guide"
            priceGuideTitle="জরুরি ওষুধ ও ডেলিভারি ফি তালিকা"
            selectionGuideTitle="নিরাপদ ফার্মেসি ও ওষুধ ক্রয়ের নিয়ম"
            emergencyTitle="জরুরি যোগাযোগ ও ফার্মেসি হটলাইন"
            secNum={secNum}
            activeId={activeId}
          />
        ) : isBloodBankArticle ? (
          <StandardEntityToc
            overviewTitle="ফেনীতে জরুরি রক্ত ও রক্তদাতার পটভূমি"
            matrixTitle="একনজরে ব্লাড ব্যাংক ও স্বেচ্ছাসেবী ক্লাবের তুলনা"
            reviewsTitle="শীর্ষ ১২ ব্লাড ব্যাংক ও ক্লাবের পর্যালোচনা"
            reviewsId="blood-bank-reviews"
            subItems={bloodBanks.map((b) => ({
              id: `blood-bank-${b.rank}`,
              name: `${toBanglaNums(b.rank)}. ${b.nameBn}`,
            }))}
            priceGuideId="blood-price-guide"
            priceGuideTitle="রক্ত পরীক্ষা ও ট্রান্সফিউশন ফি তালিকা"
            selectionGuideTitle="নিরাপদ রক্ত পরিসঞ্চালন ও রক্তদাতার শর্তাবলী"
            emergencyTitle="জরুরি ব্লাড ব্যাংক ও রক্তদাতা হটলাইন"
            secNum={secNum}
            activeId={activeId}
          />
        ) : isAmbulanceArticle ? (
          <StandardEntityToc
            overviewTitle="ফেনীতে জরুরি অ্যাম্বুলেন্স ও অক্সিজেনের পটভূমি"
            matrixTitle="একনজরে অ্যাম্বুলেন্স ও অক্সিজেন সেবার তুলনা"
            reviewsTitle="শীর্ষ ১২ অ্যাম্বুলেন্স ও অক্সিজেন সেবার পর্যালোচনা"
            reviewsId="ambulance-reviews"
            subItems={ambulances.map((a) => ({
              id: `ambulance-${a.rank}`,
              name: `${toBanglaNums(a.rank)}. ${a.nameBn}`,
            }))}
            priceGuideId="ambulance-price-guide"
            priceGuideTitle="অ্যাম্বুলেন্স ভাড়া ও অক্সিজেন খরচের হিসাব"
            selectionGuideTitle="জরুরি অ্যাম্বুলেন্স ও অক্সিজেন বুকিংয়ের নিয়ম"
            emergencyTitle="জরুরি অ্যাম্বুলেন্স ও অক্সিজেন হটলাইন"
            secNum={secNum}
            activeId={activeId}
          />
        ) : (
          <StandardEntityToc
            {...getHospitalTocTitles(currentSlug)}
            reviewsId="hospital-reviews"
            subItems={hospitals.map((h) => ({
              id: `hospital-${h.rank}`,
              name: `${toBanglaNums(h.rank)}. ${h.nameBn}`,
            }))}
            secNum={secNum}
            activeId={activeId}
          />
        )}
      </div>
    </nav>
  );
}
