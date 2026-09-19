import { BlogPost } from "@/types/blog";
import { HospitalReviewCard } from "./HospitalReviewCard";
import { HospitalComparisonTable } from "./HospitalComparisonTable";
import { DiagnosticComparisonTable } from "./DiagnosticComparisonTable";
import { DiagnosticReviewCard } from "./DiagnosticReviewCard";
import { DiagnosticPriceTable } from "./DiagnosticPriceTable";
import { DentalComparisonTable } from "./DentalComparisonTable";
import { DentalReviewCard } from "./DentalReviewCard";
import { DentalPriceTable } from "./DentalPriceTable";
import { PhysiotherapyComparisonTable } from "./PhysiotherapyComparisonTable";
import { PhysiotherapyReviewCard } from "./PhysiotherapyReviewCard";
import { PhysiotherapyPriceTable } from "./PhysiotherapyPriceTable";
import { MaternityPriceTable } from "./MaternityPriceTable";
import { CardiacPriceTable } from "./CardiacPriceTable";
import { KidneyPriceTable } from "./KidneyPriceTable";
import { PediatricPriceTable } from "./PediatricPriceTable";
import { SkinPriceTable } from "./SkinPriceTable";
import { EyePriceTable } from "./EyePriceTable";
import { OrthopedicPriceTable } from "./OrthopedicPriceTable";
import { EntPriceTable } from "./EntPriceTable";
import { SurgeryPriceTable } from "./SurgeryPriceTable";
import { NeurologyPriceTable } from "./NeurologyPriceTable";
import { DiabetesPriceTable } from "./DiabetesPriceTable";
import { PsychiatryPriceTable } from "./PsychiatryPriceTable";

interface BlogSpecializedSectionsProps {
  post: BlogPost;
  locale?: string;
}

export function BlogSpecializedSections({
  post,
  locale = "bn",
}: BlogSpecializedSectionsProps) {
  const isEn = locale === "en";

  return (
    <>
      {/* Diagnostic Center Comparison Table */}
      {post.diagnosticComparisonTable && post.diagnosticComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {isEn
              ? "2. Top 10 Diagnostic Centers Comparison Matrix"
              : "২. একনজরে ফেনীর সেরা ১০ ডায়াগনস্টিকের প্রযুক্তি ও সুবিধা তুলনা"}
          </h2>
          <DiagnosticComparisonTable items={post.diagnosticComparisonTable} locale={locale} />
        </section>
      )}

      {/* Diagnostic Center In-Depth Reviews */}
      {post.diagnosticCenters && post.diagnosticCenters.length > 0 && (
        <section id="diagnostic-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {isEn
                ? "3. In-Depth Reviews of Top 10 Diagnostic Centers"
                : "৩. ফেনীর সেরা ১০টি ডায়াগনস্টিক সেন্টারের পূর্ণাঙ্গ পর্যালোচনা"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isEn
                ? "Detailed breakdown of lab equipment, tests, addresses, serial contacts, and member discounts."
                : "প্রতিটি সেন্টারের আধুনিক যন্ত্রপাতি, বিশেষায়িত টেস্ট, ঠিকানা, যোগাযোগের নম্বর ও ডিসকাউন্ট তথ্য।"}
            </p>
          </div>

          <div className="space-y-8">
            {post.diagnosticCenters.map((center) => (
              <DiagnosticReviewCard
                key={center.rank}
                center={center}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      {/* Diagnostic Test Pricing & Member Savings Table */}
      {post.diagnosticTestPricingBn && (
        <DiagnosticPriceTable
          pricingData={post.diagnosticTestPricingBn}
          locale={locale}
        />
      )}

      {/* Dental Clinic Comparison Table */}
      {post.dentalComparisonTable && post.dentalComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {isEn
              ? "2. Top 10 Dental Clinics Comparison Matrix"
              : "২. একনজরে ফেনীর সেরা ১০ ডেন্টাল ক্লিনিকের সেবা ও প্রযুক্তি তুলনা"}
          </h2>
          <DentalComparisonTable items={post.dentalComparisonTable} locale={locale} />
        </section>
      )}

      {/* Dental Clinic In-Depth Reviews */}
      {post.dentalClinics && post.dentalClinics.length > 0 && (
        <section id="dental-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {isEn
                ? "3. In-Depth Reviews of Top 10 Dental Clinics"
                : "৩. ফেনীর সেরা ১০টি ডেন্টাল ক্লিনিকের পূর্ণাঙ্গ পর্যালোচনা"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isEn
                ? "Detailed breakdown of BMDC dental surgeons, modern equipment, addresses, visiting hours, and member discounts."
                : "প্রতিটি ক্লিনিকের বিএমডিসি সনদপ্রাপ্ত বিশেষজ্ঞ সার্জন, আধুনিক যন্ত্রপাতি, চেম্বার ঠিকানা, সিরিয়াল নম্বর ও ডিসকাউন্ট তথ্য।"}
            </p>
          </div>

          <div className="space-y-8">
            {post.dentalClinics.map((clinic) => (
              <DentalReviewCard
                key={clinic.rank}
                clinic={clinic}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      {/* Dental Procedure Pricing & Member Savings Table */}
      {post.dentalProcedurePricingBn && (
        <DentalPriceTable
          pricingData={post.dentalProcedurePricingBn}
          locale={locale}
        />
      )}

      {/* Physiotherapy Center Comparison Table */}
      {post.physiotherapyComparisonTable && post.physiotherapyComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {isEn
              ? "2. Top 10 Physiotherapy Centers Comparison Matrix"
              : "২. একনজরে ফেনীর সেরা ১০ ফিজিওথেরাপি সেন্টারের সুবিধা তুলনা"}
          </h2>
          <PhysiotherapyComparisonTable items={post.physiotherapyComparisonTable} locale={locale} />
        </section>
      )}

      {/* Physiotherapy Center In-Depth Reviews */}
      {post.physiotherapyCenters && post.physiotherapyCenters.length > 0 && (
        <section id="physiotherapy-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {isEn
                ? "3. In-Depth Reviews of Top 10 Physiotherapy Centers"
                : "৩. ফেনীর সেরা ১০টি ফিজিওথেরাপি সেন্টারের পূর্ণাঙ্গ পর্যালোচনা"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isEn
                ? "Detailed breakdown of BPT/MPT physiotherapists, advanced equipment, home services, and member discounts."
                : "প্রতিটি সেন্টারের বিপিটি সনদপ্রাপ্ত ফিজিওথেরাপিস্ট, আধুনিক যন্ত্রপাতি, হোম সার্ভিস সুবিধা, যোগাযোগ ও ডিসকাউন্ট তথ্য।"}
            </p>
          </div>

          <div className="space-y-8">
            {post.physiotherapyCenters.map((center) => (
              <PhysiotherapyReviewCard
                key={center.rank}
                center={center}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      {/* Physiotherapy Procedure Pricing & Member Savings Table */}
      {post.physiotherapyTreatmentPricingBn && (
        <PhysiotherapyPriceTable
          pricingData={post.physiotherapyTreatmentPricingBn}
          locale={locale}
        />
      )}

      {/* Maternity Care & Delivery Pricing Table */}
      {post.maternityCarePricingBn && (
        <MaternityPriceTable
          pricingData={post.maternityCarePricingBn}
          locale={locale}
        />
      )}

      {/* Cardiac Diagnostic & Care Pricing Table */}
      {post.cardiacCarePricingBn && (
        <CardiacPriceTable
          pricingData={post.cardiacCarePricingBn}
          locale={locale}
        />
      )}

      {/* Kidney Care & Dialysis Pricing Table */}
      {post.kidneyCarePricingBn && (
        <KidneyPriceTable
          pricingData={post.kidneyCarePricingBn}
          locale={locale}
        />
      )}

      {/* Pediatric Care, Vaccination & NICU Pricing Table */}
      {post.pediatricCarePricingBn && (
        <PediatricPriceTable
          pricingData={post.pediatricCarePricingBn}
          locale={locale}
        />
      )}

      {/* Skin Care, Allergy & Minor Procedure Pricing Table */}
      {post.skinCarePricingBn && (
        <SkinPriceTable
          pricingData={post.skinCarePricingBn}
          locale={locale}
        />
      )}

      {/* Eye Care, Cataract Surgery & Laser Pricing Table */}
      {post.eyeCarePricingBn && (
        <EyePriceTable
          pricingData={post.eyeCarePricingBn}
          locale={locale}
        />
      )}

      {/* Orthopedic, Trauma & Joint Procedure Pricing Table */}
      {post.orthopedicCarePricingBn && (
        <OrthopedicPriceTable
          pricingData={post.orthopedicCarePricingBn}
          locale={locale}
        />
      )}

      {/* ENT Diagnostic Tests & Surgery Pricing Table */}
      {post.entCarePricingBn && (
        <EntPriceTable
          pricingData={post.entCarePricingBn}
          locale={locale}
        />
      )}

      {/* General, Laparoscopic & Laser Surgery Pricing Table */}
      {post.surgicalCarePricingBn && (
        <SurgeryPriceTable
          pricingData={post.surgicalCarePricingBn}
          locale={locale}
        />
      )}

      {/* Neurology, Brain MRI, CT & EEG Pricing Table */}
      {post.neurologyCarePricingBn && (
        <NeurologyPriceTable
          pricingData={post.neurologyCarePricingBn}
          locale={locale}
        />
      )}

      {/* Diabetes, HbA1c, Thyroid & Hormone Pricing Table */}
      {post.diabetesCarePricingBn && (
        <DiabetesPriceTable
          pricingData={post.diabetesCarePricingBn}
          locale={locale}
        />
      )}

      {/* Psychiatry, CBT & Mental Health Pricing Table */}
      {post.psychiatryCarePricingBn && (
        <PsychiatryPriceTable
          pricingData={post.psychiatryCarePricingBn}
          locale={locale}
        />
      )}

      {/* Hospital Comparison Matrix Table */}
      {post.comparisonTable && post.comparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {isEn
              ? "2. Top 10 Hospitals Comparison Matrix"
              : "২. একনজরে ফেনীর সেরা ১০ হাসপাতালের তুলনামূলক তালিকা"}
          </h2>
          <HospitalComparisonTable items={post.comparisonTable} locale={locale} />
        </section>
      )}

      {/* Hospital Reviews */}
      {post.hospitals && post.hospitals.length > 0 && (
        <section id="hospital-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {isEn
                ? "3. In-Depth Reviews of Top 10 Hospitals"
                : "৩. ফেনীর সেরা ১০টি হাসপাতালের পূর্ণাঙ্গ পর্যালোচনা"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isEn
                ? "Detailed breakdown of services, address, emergency hotlines, and member discounts."
                : "প্রতিটি হাসপাতালের শয্যা সংখ্যা, আইসিইউ সুবিধা, বিশেষজ্ঞ ডাক্তার, যোগাযোগের নম্বর ও ডিসকাউন্ট তথ্য।"}
            </p>
          </div>

          <div className="space-y-8">
            {post.hospitals.map((hospital) => (
              <HospitalReviewCard
                key={hospital.rank}
                hospital={hospital}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
