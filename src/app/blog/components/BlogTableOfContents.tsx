"use client";

import { useState } from "react";
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

interface BlogTableOfContentsProps {
  hospitals?: HospitalReviewItem[];
  doctorGroups?: DoctorSpecialtyGroup[];
  diagnosticCenters?: DiagnosticCenterReviewItem[];
  dentalClinics?: DentalClinicReviewItem[];
  physiotherapyCenters?: PhysiotherapyCenterReviewItem[];
  hasMaternityPricing?: boolean;
  hasCardiacPricing?: boolean;
  locale?: string;
}

export function BlogTableOfContents({
  hospitals = [],
  doctorGroups = [],
  diagnosticCenters = [],
  dentalClinics = [],
  physiotherapyCenters = [],
  hasMaternityPricing = false,
  hasCardiacPricing = false,
  locale = "bn",
}: BlogTableOfContentsProps) {
  const { locale: contextLocale } = useLanguage();
  const activeLocale = contextLocale || locale;
  const isEn = activeLocale === "en";
  const [isOpen, setIsOpen] = useState(false);

  const isDoctorArticle = doctorGroups && doctorGroups.length > 0;
  const isDiagnosticArticle = diagnosticCenters && diagnosticCenters.length > 0;
  const isDentalArticle = dentalClinics && dentalClinics.length > 0;
  const isPhysiotherapyArticle = physiotherapyCenters && physiotherapyCenters.length > 0;

  const secNum = (n: number) => (isEn ? `${n}. ` : `${toBanglaNums(n)}. `);

  return (
    <nav
      aria-label="Table of Contents"
      className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-3"
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
        {isDoctorArticle ? (
          <ol className="space-y-1.5 list-none pl-0">
            <li>
              <a href="#overview" className="hover:text-primary transition-colors block py-0.5">
                {secNum(1)}{isEn ? "Healthcare Landscape of Feni" : "ফেনীর স্বাস্থ্যসেবা ও বিশেষজ্ঞ ডাক্তার"}
              </a>
            </li>
            <li>
              <a
                href="#specialist-doctors"
                className="hover:text-primary transition-colors font-semibold text-foreground block py-0.5"
              >
                {secNum(2)}{isEn ? "Specialist Doctors by Department" : "বিভাগভিত্তিক বিশেষজ্ঞ ডাক্তার তালিকা"}
              </a>
              <ol className="pl-4 pt-1 space-y-1 text-xs text-muted-foreground/90 border-l border-border/80 ml-2">
                {doctorGroups.map((group, idx) => (
                  <li key={group.department}>
                    <a
                      href={`#dept-${group.department}`}
                      className="hover:text-primary transition-colors block truncate py-0.5"
                    >
                      {isEn
                        ? `${idx + 1}. ${group.departmentNameEn}`
                        : `${toBanglaNums(idx + 1)}. ${group.departmentNameBn}`}
                    </a>
                  </li>
                ))}
              </ol>
            </li>
            <li>
              <a href="#chamber-hubs" className="hover:text-primary transition-colors block py-0.5">
                {secNum(3)}{isEn ? "Major Chamber Locations" : "ফেনী শহরের প্রধান চেম্বার হাবসমূহ"}
              </a>
            </li>
            <li>
              <a href="#serial-guide" className="hover:text-primary transition-colors block py-0.5">
                {secNum(4)}{isEn ? "Serial Booking Guidelines" : "ডাক্তারের সিরিয়াল নেওয়ার নিয়মাবলী"}
              </a>
            </li>
            {hasMaternityPricing && (
              <li>
                <a
                  href="#maternity-price-guide"
                  className="hover:text-primary transition-colors block py-0.5"
                >
                  {secNum(5)}{isEn ? "Maternity & Delivery Cost Guide" : "প্রসূতি ও ডেলিভারি খরচের হিসাব"}
                </a>
              </li>
            )}
            {hasCardiacPricing && (
              <li>
                <a
                  href="#cardiac-price-guide"
                  className="hover:text-primary transition-colors block py-0.5"
                >
                  {secNum(5)}{isEn ? "Cardiac Diagnostic Cost Guide" : "হৃদরোগ পরীক্ষা খরচের হিসাব"}
                </a>
              </li>
            )}
            <li>
              <a href="#faq-section" className="hover:text-primary transition-colors block py-0.5">
                {secNum(hasMaternityPricing || hasCardiacPricing ? 6 : 5)}
                {isEn ? "Frequently Asked Questions" : "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)"}
              </a>
            </li>
          </ol>
        ) : isDiagnosticArticle ? (
          <ol className="space-y-1.5 list-none pl-0">
            <li>
              <a href="#overview" className="hover:text-primary transition-colors block py-0.5">
                {secNum(1)}{isEn ? "Diagnostic Healthcare in Feni" : "ফেনীর ডায়াগনস্টিক ও ল্যাব পরিকাঠামো"}
              </a>
            </li>
            <li>
              <a href="#comparison-matrix" className="hover:text-primary transition-colors block py-0.5">
                {secNum(2)}{isEn ? "Equipment Comparison Matrix" : "একনজরে সেরা ১০ ডায়াগনস্টিকের তুলনা"}
              </a>
            </li>
            <li>
              <a
                href="#diagnostic-reviews"
                className="hover:text-primary transition-colors font-semibold text-foreground block py-0.5"
              >
                {secNum(3)}{isEn ? "Detailed Diagnostic Center Reviews" : "সেরা ১০ ডায়াগনস্টিক সেন্টারের পর্যালোচনা"}
              </a>
              {diagnosticCenters.length > 0 && (
                <ol className="pl-4 pt-1 space-y-1 text-xs text-muted-foreground/90 border-l border-border/80 ml-2">
                  {diagnosticCenters.map((d) => (
                    <li key={d.rank}>
                      <a
                        href={`#diagnostic-${d.rank}`}
                        className="hover:text-primary transition-colors block truncate py-0.5"
                      >
                        {isEn ? `#${d.rank} ${d.nameEn}` : `${toBanglaNums(d.rank)}. ${d.nameBn}`}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
            <li>
              <a href="#price-guide" className="hover:text-primary transition-colors block py-0.5">
                {secNum(4)}{isEn ? "Test Pricing & Member Savings" : "সাধারণ টেস্টের মূল্যতালিকা ও মেম্বার ছাড়"}
              </a>
            </li>
            <li>
              <a href="#selection-guide" className="hover:text-primary transition-colors block py-0.5">
                {secNum(5)}{isEn ? "Guidelines for Choosing a Lab" : "সঠিক ডায়াগনস্টিক ল্যাব নির্বাচনের উপায়"}
              </a>
            </li>
            <li>
              <a href="#faq-section" className="hover:text-primary transition-colors block py-0.5">
                {secNum(6)}{isEn ? "Frequently Asked Questions" : "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)"}
              </a>
            </li>
          </ol>
        ) : isDentalArticle ? (
          <ol className="space-y-1.5 list-none pl-0">
            <li>
              <a href="#overview" className="hover:text-primary transition-colors block py-0.5">
                {secNum(1)}{isEn ? "Dental Health in Feni" : "ফেনীর দন্ত চিকিৎসা ও প্রেক্ষাপট"}
              </a>
            </li>
            <li>
              <a href="#comparison-matrix" className="hover:text-primary transition-colors block py-0.5">
                {secNum(2)}{isEn ? "Dental Clinics Comparison Matrix" : "একনজরে সেরা ১০ ডেন্টাল ক্লিনিকের তুলনা"}
              </a>
            </li>
            <li>
              <a
                href="#dental-reviews"
                className="hover:text-primary transition-colors font-semibold text-foreground block py-0.5"
              >
                {secNum(3)}{isEn ? "Detailed Dental Clinic Reviews" : "সেরা ১০ ডেন্টাল ক্লিনিকের পর্যালোচনা"}
              </a>
              {dentalClinics.length > 0 && (
                <ol className="pl-4 pt-1 space-y-1 text-xs text-muted-foreground/90 border-l border-border/80 ml-2">
                  {dentalClinics.map((d) => (
                    <li key={d.rank}>
                      <a
                        href={`#dental-${d.rank}`}
                        className="hover:text-primary transition-colors block truncate py-0.5"
                      >
                        {isEn ? `#${d.rank} ${d.nameEn}` : `${toBanglaNums(d.rank)}. ${d.nameBn}`}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
            <li>
              <a href="#price-guide" className="hover:text-primary transition-colors block py-0.5">
                {secNum(4)}{isEn ? "Dental Treatment Cost & Savings" : "দন্ত চিকিৎসার খরচ ও মেম্বার সাশ্রয়"}
              </a>
            </li>
            <li>
              <a href="#selection-guide" className="hover:text-primary transition-colors block py-0.5">
                {secNum(5)}{isEn ? "Guidelines for Choosing a Dentist" : "সঠিক ডেন্টাল ক্লিনিক নির্বাচনের উপায়"}
              </a>
            </li>
            <li>
              <a href="#faq-section" className="hover:text-primary transition-colors block py-0.5">
                {secNum(6)}{isEn ? "Frequently Asked Questions" : "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)"}
              </a>
            </li>
          </ol>
        ) : isPhysiotherapyArticle ? (
          <ol className="space-y-1.5 list-none pl-0">
            <li>
              <a href="#overview" className="hover:text-primary transition-colors block py-0.5">
                {secNum(1)}{isEn ? "Physiotherapy in Feni" : "ফেনীর ফিজিওথেরাপি ও পুনর্বাসন চিকিৎসা"}
              </a>
            </li>
            <li>
              <a href="#comparison-matrix" className="hover:text-primary transition-colors block py-0.5">
                {secNum(2)}{isEn ? "Physiotherapy Comparison Matrix" : "একনজরে সেরা ১০ ফিজিওথেরাপি সেন্টারের তুলনা"}
              </a>
            </li>
            <li>
              <a
                href="#physiotherapy-reviews"
                className="hover:text-primary transition-colors font-semibold text-foreground block py-0.5"
              >
                {secNum(3)}{isEn ? "Detailed Physiotherapy Center Reviews" : "সেরা ১০ ফিজিওথেরাপি সেন্টারের পর্যালোচনা"}
              </a>
              {physiotherapyCenters.length > 0 && (
                <ol className="pl-4 pt-1 space-y-1 text-xs text-muted-foreground/90 border-l border-border/80 ml-2">
                  {physiotherapyCenters.map((c) => (
                    <li key={c.rank}>
                      <a
                        href={`#physio-${c.rank}`}
                        className="hover:text-primary transition-colors block truncate py-0.5"
                      >
                        {isEn ? `#${c.rank} ${c.nameEn}` : `${toBanglaNums(c.rank)}. ${c.nameBn}`}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
            <li>
              <a href="#price-guide" className="hover:text-primary transition-colors block py-0.5">
                {secNum(4)}{isEn ? "Therapy Costs & Member Savings" : "থেরাপি ফি ও মেম্বার সাশ্রয় তালিকা"}
              </a>
            </li>
            <li>
              <a href="#selection-guide" className="hover:text-primary transition-colors block py-0.5">
                {secNum(5)}{isEn ? "Guidelines for Choosing a Physiotherapist" : "সঠিক ফিজিওথেরাপি সেন্টার নির্বাচনের উপায়"}
              </a>
            </li>
            <li>
              <a href="#faq-section" className="hover:text-primary transition-colors block py-0.5">
                {secNum(6)}{isEn ? "Frequently Asked Questions" : "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)"}
              </a>
            </li>
          </ol>
        ) : (
          <ol className="space-y-1.5 list-none pl-0">
            <li>
              <a href="#overview" className="hover:text-primary transition-colors block py-0.5">
                {secNum(1)}{isEn ? "Healthcare Overview of Feni" : "ফেনী জেলার স্বাস্থ্যসেবা ও পটভূমি"}
              </a>
            </li>
            <li>
              <a href="#comparison-matrix" className="hover:text-primary transition-colors block py-0.5">
                {secNum(2)}{isEn ? "Quick Comparison Matrix" : "একনজরে সেরা ১০ হাসপাতালের তুলনা"}
              </a>
            </li>
            <li>
              <a
                href="#hospital-reviews"
                className="hover:text-primary transition-colors font-semibold text-foreground block py-0.5"
              >
                {secNum(3)}{isEn ? "Detailed Hospital Reviews" : "সেরা ১০ হাসপাতালের বিস্তারিত পর্যালোচনা"}
              </a>
              {hospitals.length > 0 && (
                <ol className="pl-4 pt-1 space-y-1 text-xs text-muted-foreground/90 border-l border-border/80 ml-2">
                  {hospitals.map((h) => (
                    <li key={h.rank}>
                      <a
                        href={`#hospital-${h.rank}`}
                        className="hover:text-primary transition-colors block truncate py-0.5"
                      >
                        {isEn ? `#${h.rank} ${h.nameEn}` : `${toBanglaNums(h.rank)}. ${h.nameBn}`}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
            <li>
              <a href="#selection-guide" className="hover:text-primary transition-colors block py-0.5">
                {secNum(4)}{isEn ? "How to Choose the Right Hospital" : "সঠিক হাসপাতাল নির্বাচনের উপায়"}
              </a>
            </li>
            <li>
              <a href="#emergency-directory" className="hover:text-primary transition-colors block py-0.5">
                {secNum(5)}{isEn ? "Emergency Contacts & Ambulance" : "জরুরি যোগাযোগ ও অ্যাম্বুলেন্স হটলাইন"}
              </a>
            </li>
            <li>
              <a href="#faq-section" className="hover:text-primary transition-colors block py-0.5">
                {secNum(6)}{isEn ? "Frequently Asked Questions" : "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)"}
              </a>
            </li>
          </ol>
        )}
      </div>
    </nav>
  );
}
