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
import { useLanguage } from "@/components/layout/LanguageProvider";
import { TocSubList, StandardEntityToc, getPricingGuides } from "./BlogTocList";

interface BlogTableOfContentsProps {
  hospitals?: HospitalReviewItem[];
  doctorGroups?: DoctorSpecialtyGroup[];
  diagnosticCenters?: DiagnosticCenterReviewItem[];
  dentalClinics?: DentalClinicReviewItem[];
  physiotherapyCenters?: PhysiotherapyCenterReviewItem[];
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
  hasUpazilaPricing?: boolean;
  pharmacies?: import("@/types/pharmacyBlog").PharmacyReviewItem[];
  bloodBanks?: import("@/types/bloodBankBlog").BloodBankReviewItem[];
  ambulances?: import("@/types/ambulanceBlog").AmbulanceReviewItem[];
  currentSlug?: string;
  locale?: string;
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
  hasMaternityPricing = false,
  hasCardiacPricing = false,
  hasKidneyPricing = false,
  hasPediatricPricing = false,
  hasSkinPricing = false,
  hasEyePricing = false,
  hasOrthopedicPricing = false,
  hasEntPricing = false,
  hasSurgeryPricing = false,
  hasNeurologyPricing = false,
  hasDiabetesPricing = false,
  hasPsychiatryPricing = false,
  hasSadarHospitalPricing = false,
  hasDiabeticHospitalPricing = false,
  hasPharmacyPricing = false,
  hasBloodPricing = false,
  hasAmbulancePricing = false,
  hasUpazilaPricing = false,
  currentSlug,
  locale = "bn",
  className = "",
  id = "table-of-contents",
  defaultOpen = false,
}: BlogTableOfContentsProps) {
  const { locale: contextLocale } = useLanguage();
  const activeLocale = contextLocale || locale;
  const isEn = activeLocale === "en";
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
    hasDiabeticHospitalPricing;

  const isUpazilaArticle = Boolean(hasUpazilaPricing || currentSlug?.includes("healthcare-guide"));
  const isDoctorArticle = !isUpazilaArticle && doctorGroups && doctorGroups.length > 0;
  const isDiagnosticArticle = diagnosticCenters && diagnosticCenters.length > 0;
  const isDentalArticle = dentalClinics && dentalClinics.length > 0;
  const isPhysiotherapyArticle = physiotherapyCenters && physiotherapyCenters.length > 0;
  const isPharmacyArticle = pharmacies && pharmacies.length > 0;
  const isBloodBankArticle = bloodBanks && bloodBanks.length > 0;
  const isAmbulanceArticle = ambulances && ambulances.length > 0;
  const isPurePriceList = currentSlug === "feni-medical-test-price-list";

  const secNum = (n: number) => (isEn ? `${n}. ` : `${toBanglaNums(n)}. `);

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
          <span>{isEn ? "Table of Contents" : "এই লেখার বিষয়বস্তু ও সূচিপত্র"}</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-primary font-medium sm:hidden">
          <span>{isOpen ? (isEn ? "Hide" : "লুকান") : isEn ? "Show" : "দেখুন"}</span>
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
                {secNum(1)}{isEn ? "Diagnostic Healthcare in Feni" : "ফেনীর ডায়াগনস্টিক পরিকাঠামো ও প্রেক্ষাপট"}
              </a>
            </li>
            <li>
              <a href="#price-guide" className={linkClass("price-guide")}>
                {secNum(2)}{isEn ? "80+ Diagnostic Tests Price List" : "৮০+ টেস্টের মূল্যতালিকা ও মেম্বার ছাড়"}
              </a>
            </li>
            <li>
              <a href="#selection-guide" className={linkClass("selection-guide")}>
                {secNum(3)}{isEn ? "Guidelines for Choosing Quality Diagnostics" : "নির্ভরযোগ্য ল্যাব ও টেস্ট নির্বাচনের উপায়"}
              </a>
            </li>
            <li>
              <a href="#emergency-directory" className={linkClass("emergency-directory")}>
                {secNum(4)}{isEn ? "Diagnostic Assistance & Emergency Contacts" : "ডায়াগনস্টিক সাপোর্ট ও জরুরি হেল্পলাইন"}
              </a>
            </li>
            <li>
              <a href="#faq-section" className={linkClass("faq-section")}>
                {secNum(5)}{isEn ? "Frequently Asked Questions" : "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)"}
              </a>
            </li>
          </ol>
        ) : isUpazilaArticle ? (
          <ol className="space-y-1.5 list-none pl-0">
            <li>
              <a href="#overview" className={linkClass("overview")}>
                {secNum(1)}{isEn ? "Upazila Healthcare Landscape" : "উপজেলা স্বাস্থ্যসেবা ও পটভূমি"}
              </a>
            </li>
            <li>
              <a href="#specialist-doctors" className={linkClass("specialist-doctors", true)}>
                {secNum(2)}{isEn ? "Specialist Doctors by Upazila" : "উপজেলা অনুযায়ী বিশেষজ্ঞ ডাক্তার তালিকা"}
              </a>
              <TocSubList
                items={doctorGroups.map((g, idx) => ({
                  id: `dept-${g.department}`,
                  name: isEn ? `${idx + 1}. ${g.departmentNameEn}` : `${toBanglaNums(idx + 1)}. ${g.departmentNameBn}`,
                }))}
                activeId={activeId}
              />
            </li>
            <li>
              <a href="#chamber-hubs" className={linkClass("chamber-hubs")}>
                {secNum(3)}{isEn ? "Major Upazila Chamber Hubs" : "উপজেলার প্রধান চেম্বার হাবসমূহ"}
              </a>
            </li>
            <li>
              <a href="#serial-guide" className={linkClass("serial-guide")}>
                {secNum(4)}{isEn ? "Serial Booking Guidelines" : "ডাক্তারের সিরিয়াল বুকিং নিয়মাবলী"}
              </a>
            </li>
            <li>
              <a href="#upazila-price-guide" className={linkClass("upazila-price-guide")}>
                {secNum(5)}{isEn ? "Upazila Healthcare & Diagnostic Fees" : "উপজেলা স্বাস্থ্যসেবা ও টেস্ট ফি তালিকা"}
              </a>
            </li>
            <li>
              <a href="#comparison-matrix" className={linkClass("comparison-matrix")}>
                {secNum(6)}{isEn ? "Healthcare Facilities Comparison" : "একনজরে উপজেলা হাসপাতালের তুলনা"}
              </a>
            </li>
            <li>
              <a href="#hospital-reviews" className={linkClass("hospital-reviews", true)}>
                {secNum(7)}{isEn ? "Detailed Facility Reviews" : `${toBanglaNums(hospitals.length)}টি চিকিৎসাকেন্দ্রের বিস্তারিত পর্যালোচনা`}
              </a>
              <TocSubList
                items={hospitals.map((h) => ({
                  id: `hospital-${h.rank}`,
                  name: isEn ? `#${h.rank} ${h.nameEn}` : `${toBanglaNums(h.rank)}. ${h.nameBn}`,
                }))}
                activeId={activeId}
              />
            </li>
            <li>
              <a href="#selection-guide" className={linkClass("selection-guide")}>
                {secNum(8)}{isEn ? "Guidelines & Broker Precautions" : "স্বাস্থ্যসেবা নির্বাচন ও দালাল সতর্কতা"}
              </a>
            </li>
            <li>
              <a href="#emergency-directory" className={linkClass("emergency-directory")}>
                {secNum(9)}{isEn ? "Emergency Referral Transport" : "জরুরি যোগাযোগ ও সদর রেফারেল অ্যাম্বুলেন্স"}
              </a>
            </li>
            <li>
              <a href="#faq-section" className={linkClass("faq-section")}>
                {secNum(10)}{isEn ? "Frequently Asked Questions" : "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)"}
              </a>
            </li>
          </ol>
        ) : isDoctorArticle ? (
          <ol className="space-y-1.5 list-none pl-0">
            <li>
              <a href="#overview" className={linkClass("overview")}>
                {secNum(1)}{isEn ? "Healthcare Landscape of Feni" : "ফেনীর স্বাস্থ্যসেবা ও বিশেষজ্ঞ ডাক্তার"}
              </a>
            </li>
            <li>
              <a
                href="#specialist-doctors"
                className={linkClass("specialist-doctors", true)}
              >
                {secNum(2)}{isEn ? "Specialist Doctors by Department" : "বিভাগভিত্তিক বিশেষজ্ঞ ডাক্তার তালিকা"}
              </a>
              <TocSubList
                items={doctorGroups.map((g, idx) => ({
                  id: `dept-${g.department}`,
                  name: isEn ? `${idx + 1}. ${g.departmentNameEn}` : `${toBanglaNums(idx + 1)}. ${g.departmentNameBn}`,
                }))}
                activeId={activeId}
              />
            </li>
            <li>
              <a href="#chamber-hubs" className={linkClass("chamber-hubs")}>
                {secNum(3)}{isEn ? "Major Chamber Locations" : "ফেনী শহরের প্রধান চেম্বার হাবসমূহ"}
              </a>
            </li>
            <li>
              <a href="#serial-guide" className={linkClass("serial-guide")}>
                {secNum(4)}{isEn ? "Serial Booking Guidelines" : "ডাক্তারের সিরিয়াল নেওয়ার নিয়মাবলী"}
              </a>
            </li>
            {pricingGuides.filter((g) => g.has).map((guide) => (
              <li key={guide.id}>
                <a href={`#${guide.id}`} className={linkClass(guide.id)}>
                  {secNum(5)}{isEn ? guide.en : guide.bn}
                </a>
              </li>
            ))}
            <li>
              <a href="#faq-section" className={linkClass("faq-section")}>
                {secNum(hasDoctorPricing ? 6 : 5)}
                {isEn ? "Frequently Asked Questions" : "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)"}
              </a>
            </li>
          </ol>
        ) : isDiagnosticArticle ? (
          <StandardEntityToc
            overviewTitle={isEn ? "Diagnostic Healthcare in Feni" : "ফেনীর ডায়াগনস্টিক ও ল্যাব পরিকাঠামো"}
            matrixTitle={isEn ? "Equipment Comparison Matrix" : "একনজরে সেরা ১০ ডায়াগনস্টিকের তুলনা"}
            reviewsTitle={isEn ? "Detailed Diagnostic Center Reviews" : "সেরা ১০ ডায়াগনস্টিক সেন্টারের পর্যালোচনা"}
            reviewsId="diagnostic-reviews"
            subItems={diagnosticCenters.map((d) => ({
              id: `diagnostic-${d.rank}`,
              name: isEn ? `#${d.rank} ${d.nameEn}` : `${toBanglaNums(d.rank)}. ${d.nameBn}`,
            }))}
            priceGuideId="price-guide"
            priceGuideTitle={isEn ? "Test Pricing & Member Savings" : "টেস্টের মূল্যতালিকা ও মেম্বার ছাড়"}
            selectionGuideTitle={isEn ? "Guidelines for Choosing Quality Diagnostics" : "নির্ভরযোগ্য ডায়াগনস্টিক নির্বাচনের উপায়"}
            emergencyTitle={isEn ? "Emergency Contacts & Ambulance" : "জরুরি যোগাযোগ ও অ্যাম্বুলেন্স হটলাইন"}
            secNum={secNum}
            isEn={isEn}
            activeId={activeId}
          />
        ) : isDentalArticle ? (
          <StandardEntityToc
            overviewTitle={isEn ? "Dental Healthcare in Feni" : "ফেনীর ডেন্টাল চিকিৎসাব্যবস্থা ও পটভূমি"}
            matrixTitle={isEn ? "Dental Clinics Comparison Matrix" : "একনজরে সেরা ১০ ডেন্টাল ক্লিনিকের তুলনা"}
            reviewsTitle={isEn ? "Detailed Dental Clinic Reviews" : "সেরা ১০ ডেন্টাল ক্লিনিকের বিস্তারিত পর্যালোচনা"}
            reviewsId="dental-reviews"
            subItems={dentalClinics.map((c) => ({
              id: `dental-${c.rank}`,
              name: isEn ? `#${c.rank} ${c.nameEn}` : `${toBanglaNums(c.rank)}. ${c.nameBn}`,
            }))}
            priceGuideId="price-guide"
            priceGuideTitle={isEn ? "Treatment Costs & Member Savings" : "চিকিৎসা ফি ও মেম্বার সাশ্রয় তালিকা"}
            selectionGuideTitle={isEn ? "Guidelines for Choosing a Dentist" : "সঠিক ডেন্টাল ক্লিনিক নির্বাচনের উপায়"}
            secNum={secNum}
            isEn={isEn}
            activeId={activeId}
          />
        ) : isPhysiotherapyArticle ? (
          <StandardEntityToc
            overviewTitle={isEn ? "Physiotherapy in Feni" : "ফেনীর ফিজিওথেরাপি চিকিৎসাব্যবস্থা ও পটভূমি"}
            matrixTitle={isEn ? "Physiotherapy Centers Comparison Matrix" : "একনজরে সেরা ৮ ফিজিওথেরাপি সেন্টারের তুলনা"}
            reviewsTitle={isEn ? "Detailed Physiotherapy Center Reviews" : "সেরা ৮ ফিজিওথেরাপি সেন্টারের বিস্তারিত পর্যালোচনা"}
            reviewsId="physiotherapy-reviews"
            subItems={physiotherapyCenters.map((c) => ({
              id: `physio-${c.rank}`,
              name: isEn ? `#${c.rank} ${c.nameEn}` : `${toBanglaNums(c.rank)}. ${c.nameBn}`,
            }))}
            priceGuideId="price-guide"
            priceGuideTitle={isEn ? "Therapy Costs & Member Savings" : "থেরাপি ফি ও মেম্বার সাশ্রয় তালিকা"}
            selectionGuideTitle={isEn ? "Guidelines for Choosing a Physiotherapist" : "সঠিক ফিজিওথেরাপি সেন্টার নির্বাচনের উপায়"}
            secNum={secNum}
            isEn={isEn}
            activeId={activeId}
          />
        ) : isPharmacyArticle ? (
          <StandardEntityToc
            overviewTitle={isEn ? "24/7 Pharmacy Landscape in Feni" : "ফেনীতে জরুরি ওষুধ ও ফার্মেসির পটভূমি"}
            matrixTitle={isEn ? "24/7 Pharmacies Comparison Matrix" : "একনজরে শীর্ষ ফার্মেসির সুবিধা তুলনা"}
            reviewsTitle={isEn ? "Detailed 24/7 Pharmacy Reviews" : "সেরা ১২ ফার্মেসির বিস্তারিত পর্যালোচনা"}
            reviewsId="pharmacy-reviews"
            subItems={pharmacies.map((p) => ({
              id: `pharmacy-${p.rank}`,
              name: isEn ? `#${p.rank} ${p.nameEn}` : `${toBanglaNums(p.rank)}. ${p.nameBn}`,
            }))}
            priceGuideId="pharmacy-price-guide"
            priceGuideTitle={isEn ? "Emergency Medicine & Delivery Pricing" : "জরুরি ওষুধ ও ডেলিভারি ফি তালিকা"}
            selectionGuideTitle={isEn ? "Guidelines for Safe Medicine Purchase" : "নিরাপদ ফার্মেসি ও ওষুধ ক্রয়ের নিয়ম"}
            emergencyTitle={isEn ? "Emergency Contacts & Hotlines" : "জরুরি যোগাযোগ ও ফার্মেসি হটলাইন"}
            secNum={secNum}
            isEn={isEn}
            activeId={activeId}
          />
        ) : isBloodBankArticle ? (
          <StandardEntityToc
            overviewTitle={isEn ? "Blood Supply Landscape in Feni" : "ফেনীতে জরুরি রক্ত ও রক্তদাতার পটভূমি"}
            matrixTitle={isEn ? "Blood Centers & Clubs Comparison" : "একনজরে ব্লাড ব্যাংক ও স্বেচ্ছাসেবী ক্লাবের তুলনা"}
            reviewsTitle={isEn ? "Detailed Blood Bank & Club Reviews" : "শীর্ষ ১২ ব্লাড ব্যাংক ও ক্লাবের পর্যালোচনা"}
            reviewsId="blood-bank-reviews"
            subItems={bloodBanks.map((b) => ({
              id: `blood-bank-${b.rank}`,
              name: isEn ? `#${b.rank} ${b.nameEn}` : `${toBanglaNums(b.rank)}. ${b.nameBn}`,
            }))}
            priceGuideId="blood-price-guide"
            priceGuideTitle={isEn ? "Transfusion Screening & Supply Costs" : "রক্ত পরীক্ষা ও ট্রান্সফিউশন ফি তালিকা"}
            selectionGuideTitle={isEn ? "Guidelines for Safe Transfusion" : "নিরাপদ রক্ত পরিসঞ্চালন ও রক্তদাতার শর্তাবলী"}
            emergencyTitle={isEn ? "Emergency Blood Bank Hotlines" : "জরুরি ব্লাড ব্যাংক ও রক্তদাতা হটলাইন"}
            secNum={secNum}
            isEn={isEn}
            activeId={activeId}
          />
        ) : isAmbulanceArticle ? (
          <StandardEntityToc
            overviewTitle={isEn ? "Emergency Ambulance & Oxygen in Feni" : "ফেনীতে জরুরি অ্যাম্বুলেন্স ও অক্সিজেনের পটভূমি"}
            matrixTitle={isEn ? "Ambulance & Oxygen Comparison Matrix" : "একনজরে অ্যাম্বুলেন্স ও অক্সিজেন সেবার তুলনা"}
            reviewsTitle={isEn ? "Detailed Ambulance & Oxygen Reviews" : "শীর্ষ ১২ অ্যাম্বুলেন্স ও অক্সিজেন সেবার পর্যালোচনা"}
            reviewsId="ambulance-reviews"
            subItems={ambulances.map((a) => ({
              id: `ambulance-${a.rank}`,
              name: isEn ? `#${a.rank} ${a.nameEn}` : `${toBanglaNums(a.rank)}. ${a.nameBn}`,
            }))}
            priceGuideId="ambulance-price-guide"
            priceGuideTitle={isEn ? "Ambulance Fares & Oxygen Cost Guide" : "অ্যাম্বুলেন্স ভাড়া ও অক্সিজেন খরচের হিসাব"}
            selectionGuideTitle={isEn ? "Guidelines for Booking Ambulance & Oxygen" : "জরুরি অ্যাম্বুলেন্স ও অক্সিজেন বুকিংয়ের নিয়ম"}
            emergencyTitle={isEn ? "Emergency Ambulance Dispatch Hotlines" : "জরুরি অ্যাম্বুলেন্স ও অক্সিজেন হটলাইন"}
            secNum={secNum}
            isEn={isEn}
            activeId={activeId}
          />
        ) : (
          <StandardEntityToc
            overviewTitle={isEn ? "Healthcare Overview of Feni" : "ফেনী জেলার স্বাস্থ্যসেবা ও পটভূমি"}
            matrixTitle={isEn ? "Quick Comparison Matrix" : "একনজরে সেরা ১০ হাসপাতালের তুলনা"}
            reviewsTitle={isEn ? "Detailed Hospital Reviews" : "সেরা ১০ হাসপাতালের বিস্তারিত পর্যালোচনা"}
            reviewsId="hospital-reviews"
            subItems={hospitals.map((h) => ({
              id: `hospital-${h.rank}`,
              name: isEn ? `#${h.rank} ${h.nameEn}` : `${toBanglaNums(h.rank)}. ${h.nameBn}`,
            }))}
            selectionGuideTitle={isEn ? "How to Choose the Right Hospital" : "সঠিক হাসপাতাল নির্বাচনের উপায়"}
            emergencyTitle={isEn ? "Emergency Contacts & Ambulance" : "জরুরি যোগাযোগ ও অ্যাম্বুলেন্স হটলাইন"}
            secNum={secNum}
            isEn={isEn}
            activeId={activeId}
          />
        )}
      </div>
    </nav>
  );
}
