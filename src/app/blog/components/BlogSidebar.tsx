import Link from "next/link";
import { Siren, ShieldCheck, ArrowRight } from "lucide-react";
import { BlogTableOfContents } from "./BlogTableOfContents";
import { HospitalReviewItem, DoctorSpecialtyGroup, DiagnosticCenterReviewItem, DentalClinicReviewItem, PhysiotherapyCenterReviewItem } from "@/types/blog";

interface BlogSidebarProps {
  currentSlug?: string;
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
  hasCriticalCarePricing?: boolean;
  hasStrokeCardiacPricing?: boolean;
  hasHomeCarePricing?: boolean;
  hasOxygenPricing?: boolean;
  hasDengueTyphoidPricing?: boolean;
  hasUpazilaPricing?: boolean;
  pharmacies?: import("@/types/pharmacyBlog").PharmacyReviewItem[];
  bloodBanks?: import("@/types/bloodBankBlog").BloodBankReviewItem[];
  ambulances?: import("@/types/ambulanceBlog").AmbulanceReviewItem[];
  locale?: string;
}

export function BlogSidebar({
  currentSlug,
  hospitals,
  doctorGroups,
  diagnosticCenters,
  dentalClinics,
  physiotherapyCenters,
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
  hasCriticalCarePricing = false,
  hasStrokeCardiacPricing = false,
  hasHomeCarePricing = false,
  hasOxygenPricing = false,
  hasDengueTyphoidPricing = false,
  hasUpazilaPricing = false,
  pharmacies,
  bloodBanks,
  ambulances,
  locale = "bn",
}: BlogSidebarProps) {
  const isEn = locale === "en";

  return (
    <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto pr-1 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
        {/* Table of Contents (Desktop Sticky) */}
        <BlogTableOfContents
          className="hidden lg:block"
          defaultOpen={true}
          hospitals={hospitals}
          doctorGroups={doctorGroups}
          diagnosticCenters={diagnosticCenters}
          dentalClinics={dentalClinics}
          physiotherapyCenters={physiotherapyCenters}
          pharmacies={pharmacies}
          bloodBanks={bloodBanks}
          ambulances={ambulances}
          hasMaternityPricing={hasMaternityPricing}
          hasCardiacPricing={hasCardiacPricing}
          hasKidneyPricing={hasKidneyPricing}
          hasPediatricPricing={hasPediatricPricing}
          hasSkinPricing={hasSkinPricing}
          hasEyePricing={hasEyePricing}
          hasOrthopedicPricing={hasOrthopedicPricing}
          hasEntPricing={hasEntPricing}
          hasSurgeryPricing={hasSurgeryPricing}
          hasNeurologyPricing={hasNeurologyPricing}
          hasDiabetesPricing={hasDiabetesPricing}
          hasPsychiatryPricing={hasPsychiatryPricing}
          hasSadarHospitalPricing={hasSadarHospitalPricing}
          hasDiabeticHospitalPricing={hasDiabeticHospitalPricing}
          hasPharmacyPricing={hasPharmacyPricing}
          hasBloodPricing={hasBloodPricing}
          hasAmbulancePricing={hasAmbulancePricing}
          hasCriticalCarePricing={hasCriticalCarePricing}
          hasStrokeCardiacPricing={hasStrokeCardiacPricing}
          hasHomeCarePricing={hasHomeCarePricing}
          hasOxygenPricing={hasOxygenPricing}
          hasDengueTyphoidPricing={hasDengueTyphoidPricing}
          hasUpazilaPricing={hasUpazilaPricing}
          currentSlug={currentSlug}
          locale={locale}
        />

        {/* Sidebar Quick Emergency Helpline Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2 text-rose-600">
            <Siren className="h-5 w-5" />
            <h3 className="font-heading text-sm font-bold text-foreground">
              {isEn ? "24/7 Feni Emergency Hotlines" : "জরুরি অ্যাম্বুলেন্স ও সেবা"}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isEn
              ? "Instant assistance for blood donation, ambulance dispatch, and hospital admissions."
              : "ফেনীতে জরুরি প্রয়োজনে তাৎক্ষণিক অ্যাম্বুলেন্স, রক্তদাতা ও ডাক্তারের তথ্য পেতে আমাদের জরুরি বিভাগে যোগাযোগ করুন।"}
          </p>
          <Link
            href="/emergency"
            prefetch={false}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <span>{isEn ? "Emergency Directory" : "জরুরি হেল্পলাইন দেখুন"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Sidebar Health Club Card Promo */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-3.5">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="font-heading text-sm font-bold text-foreground">
              {isEn ? "Health Club Discount Card" : "হেলথ ক্লাব কার্ড নিন"}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isEn
              ? "Get guaranteed member discounts at partner diagnostic labs & hospitals in Feni."
              : "ফেনীর শীর্ষ ডায়াগনস্টিক ল্যাব ও পার্টনার হাসপাতালে নিশ্চিত মেম্বার ছাড় পান।"}
          </p>
          <Link
            href="/membership"
            prefetch={false}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs transition-colors"
          >
            <span>{isEn ? "View Membership Plans" : "মেম্বারশিপ প্ল্যান দেখুন"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
    </aside>
  );
}
