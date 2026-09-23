import { BlogPost } from "@/types/blog";
import { toBanglaNums } from "@/lib/utils";
import { HospitalReviewCard } from "./HospitalReviewCard";
import { HospitalComparisonTable } from "./HospitalComparisonTable";
import { DiagnosticComparisonTable } from "./DiagnosticComparisonTable";
import { DiagnosticReviewCard } from "./DiagnosticReviewCard";
import { DiagnosticPriceTable } from "./DiagnosticPriceTable";
import { MedicalTestPriceTable } from "./MedicalTestPriceTable";
import { DentalComparisonTable } from "./DentalComparisonTable";
import { DentalReviewCard } from "./DentalReviewCard";
import { PhysiotherapyComparisonTable } from "./PhysiotherapyComparisonTable";
import { PhysiotherapyReviewCard } from "./PhysiotherapyReviewCard";
import { BlogEmergencyCareSections } from "./BlogEmergencyCareSections";
import { BlogSpecialtyPriceTables } from "./BlogSpecialtyPriceTables";

interface BlogSpecializedSectionsProps {
  post: BlogPost;
  locale?: string;
}

export function BlogSpecializedSections({
  post,
  locale = "bn",
}: BlogSpecializedSectionsProps) {
  const isEn = locale === "en";
  const isUpazila = post.slug.includes("healthcare-guide");
  const isIcu = post.slug === "feni-icu-ccu-nicu-bed-charges-and-facilities-guide";
  const isStrokeCardiac = post.slug === "stroke-and-heart-attack-emergency-protocol-feni";
  const isHomeCare = post.slug === "home-sample-collection-and-nursing-service-in-feni";
  const isOxygen = post.slug === "feni-oxygen-cylinder-refill-and-home-rent-guide";
  const isDengueTyphoid = post.slug === "dengue-and-typhoid-test-cost-management-guide-feni";

  return (
    <>
      {/* Diagnostic Center Comparison Table */}
      {post.diagnosticComparisonTable && post.diagnosticComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {post.slug === "feni-ct-scan-and-mri-test-price-guide"
              ? (isEn
                  ? "2. Feni CT Scan & MRI Centers Comparison Matrix"
                  : "২. একনজরে ফেনীর শীর্ষ সিটি স্ক্যান ও এমআরআই সেন্টারের সুবিধা তুলনা")
              : post.slug === "pregnancy-ultrasonography-4d-anomaly-scan-in-feni"
              ? (isEn
                  ? "2. Feni 4D Pregnancy Ultrasound Centers Comparison Matrix"
                  : "২. একনজরে ফেনীর শীর্ষ ৪ডি প্রেগন্যান্সি আল্ট্রাসাউন্ড সেন্টারের সুবিধা তুলনা")
              : post.slug === "full-body-health-checkup-packages-in-feni"
              ? (isEn
                  ? "2. Feni Full Body Health Checkup Centers Comparison Matrix"
                  : "২. একনজরে ফেনীর শীর্ষ হোল বডি চেকআপ সেন্টারের সুবিধা তুলনা")
              : (isEn
                  ? "2. Top 10 Diagnostic Centers Comparison Matrix"
                  : "২. একনজরে ফেনীর সেরা ১০ ডায়াগনস্টিকের প্রযুক্তি ও সুবিধা তুলনা")}
          </h2>
          <DiagnosticComparisonTable items={post.diagnosticComparisonTable} locale={locale} />
        </section>
      )}

      {/* Diagnostic Center In-Depth Reviews */}
      {post.diagnosticCenters && post.diagnosticCenters.length > 0 && (
        <section id="diagnostic-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {post.slug === "feni-ct-scan-and-mri-test-price-guide"
                ? (isEn
                    ? "3. Leading CT Scan & 1.5T MRI Diagnostic Centers in Feni"
                    : "৩. ফেনীর শীর্ষ সিটি স্ক্যান ও ১.৫ টেসলা এমআরআই সেন্টারের পর্যালোচনা")
                : post.slug === "pregnancy-ultrasonography-4d-anomaly-scan-in-feni"
                ? (isEn
                    ? "3. Leading 4D Pregnancy Ultrasound Centers in Feni"
                    : "৩. ফেনীর শীর্ষ ৪ডি আল্ট্রাসাউন্ড ও প্রেগন্যান্সি ডায়াগনস্টিক সেন্টারের পর্যালোচনা")
                : post.slug === "full-body-health-checkup-packages-in-feni"
                ? (isEn
                    ? "3. Leading Full Body Checkup & Diagnostic Centers in Feni"
                    : "৩. ফেনীর শীর্ষ হোল বডি চেকআপ ও এক্সিকিউটিভ ডায়াগনস্টিক সেন্টারের পর্যালোচনা")
                : (isEn
                    ? "3. In-Depth Reviews of Top 10 Diagnostic Centers"
                    : "৩. ফেনীর সেরা ১০টি ডায়াগনস্টিক সেন্টারের পূর্ণাঙ্গ পর্যালোচনা")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {post.slug === "feni-ct-scan-and-mri-test-price-guide"
                ? (isEn
                    ? "Detailed breakdown of 128-slice CT, 1.5T MRI, contrast safety protocols, addresses, and member discounts."
                    : "প্রতিটি সেন্টারের ১২৮-স্লাইস সিটি, ১.৫ টেসলা এমআরআই, কনট্রাস্ট সেফটি প্রটোকল, ঠিকানা ও মেম্বার ছাড়ের তথ্য।")
                : post.slug === "pregnancy-ultrasonography-4d-anomaly-scan-in-feni"
                ? (isEn
                    ? "Detailed breakdown of 4D Voluson ultrasound, female sonologists, anomaly scan capabilities, addresses, and member discounts."
                    : "প্রতিটি সেন্টারের ৪ডি ভলিউসন মেশিন, নারী সনোলজিস্টের সুবিধা, অ্যানোমালি স্ক্যান, ঠিকানা ও মেম্বার ছাড়ের তথ্য।")
                : post.slug === "full-body-health-checkup-packages-in-feni"
                ? (isEn
                    ? "Detailed breakdown of automated clinical analyzers, checkup packages, home collection, addresses, and member discounts."
                    : "প্রতিটি সেন্টারের অটোমেটেড বায়োকেমিস্ট্রি প্ল্যাটফর্ম, চেকআপ প্যাকেজ, হোম স্যাম্পল সংগ্রহ, ঠিকানা ও মেম্বার ছাড়ের তথ্য।")
                : (isEn
                    ? "Detailed breakdown of lab equipment, tests, addresses, serial contacts, and member discounts."
                    : "প্রতিটি সেন্টারের আধুনিক যন্ত্রপাতি, বিশেষায়িত টেস্ট, ঠিকানা, যোগাযোগের নম্বর ও ডিসকাউন্ট তথ্য।")}
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
      {post.diagnosticTestPricingBn &&
        (post.slug === "feni-medical-test-price-list" ? (
          <MedicalTestPriceTable
            pricingData={post.diagnosticTestPricingBn}
            locale={locale}
          />
        ) : (
          <DiagnosticPriceTable
            pricingData={post.diagnosticTestPricingBn}
            locale={locale}
          />
        ))}

      {/* Dental Clinic Comparison Table */}
      {post.dentalComparisonTable && post.dentalComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {isEn
              ? "2. Top 10 Dental Clinics Comparison Matrix"
              : "২. একনজরে ফেনীর সেরা ১০ ডেন্টাল ক্লিনিকের সুবিধা তুলনা"}
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
                ? "Detailed breakdown of sterilization protocols, dental chairs, visiting hours, and member discounts."
                : "প্রতিটি ক্লিনিকের আধুনিক প্রযুক্তি, স্কেলিং ও রুট ক্যানেল সুবিধা, চেম্বার শিডিউল ও মেম্বার ছাড়ের তথ্য।"}
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

      {/* Physiotherapy Center Comparison Table */}
      {post.physiotherapyComparisonTable && post.physiotherapyComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {isEn
              ? "2. Top Physiotherapy Centers Comparison Matrix"
              : "২. একনজরে ফেনীর সেরা ফিজিওথেরাপি সেন্টারের সুবিধা তুলনা"}
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
                ? "3. In-Depth Reviews of Top Physiotherapy Centers"
                : "৩. ফেনীর সেরা ফিজিওথেরাপি সেন্টারের পূর্ণাঙ্গ পর্যালোচনা"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isEn
                ? "Detailed breakdown of therapy equipment, specialized stroke rehab, home service, and member discounts."
                : "প্রতিটি সেন্টারের আধুনিক ইলেকট্রোথেরাপি, স্ট্রোক রিহ্যাব, হোম সার্ভিস ও মেম্বার ছাড়ের তথ্য।"}
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

      {/* Specialized Care Pricing Tables (Modularized for performance & strict 500-line limit) */}
      <BlogSpecialtyPriceTables post={post} locale={locale} />

      {/* Emergency Care Specialized Sections: Pharmacies, Blood Banks & Ambulances */}
      <BlogEmergencyCareSections post={post} locale={locale} />

      {/* Hospital / Upazila Comparison Matrix Table */}
      {post.comparisonTable && post.comparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {isUpazila
              ? isEn
                ? "2. Upazila Healthcare Comparison Matrix"
                : "২. একনজরে উপজেলা হাসপাতাল ও ক্লিনিকের তুলনামূলক তালিকা"
              : isIcu
              ? isEn
                ? "2. Feni ICU, CCU & NICU Hospitals Comparison Matrix"
                : "২. একনজরে ফেনীর শীর্ষ আইসিইউ, সিসিইউ ও এনআইসিইউ সুবিধা তুলনা"
              : isStrokeCardiac
              ? isEn
                ? "2. Feni Emergency Stroke & Cardiac Centers Comparison Matrix"
                : "২. একনজরে ফেনীর শীর্ষ স্ট্রোক ও কার্ডিয়াক ইমার্জেন্সি সেন্টারের সুবিধা তুলনা"
              : isHomeCare
              ? isEn
                ? "2. Feni Home Phlebotomy & Nursing Providers Comparison Matrix"
                : "২. একনজরে ফেনীর শীর্ষ হোম স্যাম্পল ও নার্সিং সেবা তুলনা"
              : isOxygen
              ? isEn
                ? "2. Feni Medical Oxygen & Ventilator Suppliers Matrix"
                : "২. একনজরে ফেনীর শীর্ষ অক্সিজেন ও ভেন্টিলেটর সরবরাহকারী তুলনা"
              : isDengueTyphoid
              ? isEn
                ? "2. Feni Dengue & Typhoid Care Facilities Matrix"
                : "২. একনজরে ফেনীর শীর্ষ ডেঙ্গু ও টাইফয়েড চিকিৎসা সুবিধা তুলনা"
              : isEn
              ? "2. Top 10 Hospitals Comparison Matrix"
              : "২. একনজরে ফেনীর সেরা ১০ হাসপাতালের তুলনামূলক তালিকা"}
          </h2>
          <HospitalComparisonTable items={post.comparisonTable} locale={locale} />
        </section>
      )}

      {/* Hospital / Upazila Reviews */}
      {post.hospitals && post.hospitals.length > 0 && (
        <section id="hospital-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {isUpazila
                ? isEn
                  ? `3. In-Depth Reviews of ${post.hospitals.length} Upazila Healthcare Facilities`
                  : `৩. উপজেলার ${toBanglaNums(post.hospitals.length)}টি শীর্ষ হাসপাতাল ও ক্লিনিকের পূর্ণাঙ্গ পর্যালোচনা`
                : isIcu
                ? isEn
                  ? "3. Leading ICU, CCU & Neonatal Hospitals in Feni"
                  : "৩. ফেনীর শীর্ষ আইসিইউ, সিসিইউ ও নিওনেটাল হাসপাতালের পর্যালোচনা"
                : isStrokeCardiac
                ? isEn
                  ? "3. Leading Stroke & Cardiac Emergency Facilities in Feni"
                  : "৩. ফেনীর শীর্ষ স্ট্রোক ও কার্ডিয়াক ইমার্জেন্সি চিকিৎসাকেন্দ্রের পর্যালোচনা"
                : isHomeCare
                ? isEn
                  ? "3. Leading Home Phlebotomy & Nursing Care Providers in Feni"
                  : "৩. ফেনীর শীর্ষ হোম স্যাম্পল ও নার্সিং কেয়ার প্রতিষ্ঠানের পর্যালোচনা"
                : isOxygen
                ? isEn
                  ? "3. Leading Oxygen & Home Respiratory Care Providers in Feni"
                  : "৩. ফেনীর শীর্ষ অক্সিজেন সিলিন্ডার ও হোম ভেন্টিলেটর প্রদানকারী প্রতিষ্ঠানের পর্যালোচনা"
                : isDengueTyphoid
                ? isEn
                  ? "3. Leading Dengue & Typhoid Facilities in Feni"
                  : "৩. ফেনীর শীর্ষ ডেঙ্গু ও টাইফয়েড চিকিৎসাকেন্দ্রের পর্যালোচনা"
                : isEn
                ? "3. In-Depth Reviews of Top 10 Hospitals"
                : "৩. ফেনীর সেরা ১০টি হাসপাতালের পূর্ণাঙ্গ পর্যালোচনা"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isIcu
                ? isEn
                  ? "Detailed breakdown of bed capacity, ICU/CCU/NICU technology, mechanical ventilators, central oxygen, and member benefits."
                  : "প্রতিটি হাসপাতালের শয্যা সংখ্যা, আইসিইউ/সিসিইউ/এনআইসিইউ প্রযুক্তি, ভেন্টিলেটর, সেন্ট্রাল অক্সিজেন ও মেম্বার ছাড়ের তথ্য।"
                : isStrokeCardiac
                ? isEn
                  ? "Detailed breakdown of emergency triage, 24/7 CCU/HDU, CT scan availability, hotlines, and partner discounts."
                  : "প্রতিটি প্রতিষ্ঠানের জরুরি ট্রাইয়েজ, সার্বক্ষণিক সিসিইউ/এইচডিইউ, সিটি স্ক্যান সুবিধা, হটলাইন ও পার্টনার ছাড়ের তথ্য।"
                : isHomeCare
                ? isEn
                  ? "Detailed breakdown of home blood collection, certified on-call nurses, catheterization, wound care, and member discounts."
                  : "প্রতিটি প্রতিষ্ঠানের হোম স্যাম্পল কালেকশন, অন-কল নার্সিং সেবা, ক্যাথেটার, ক্ষত ড্রেসিং ও মেম্বার ছাড়ের তথ্য।"
                : isOxygen
                ? isEn
                  ? "Detailed breakdown of cylinder refills, 24/7 home delivery, concentrators, BiPAP setup, hotlines, and member discounts."
                  : "প্রতিটি প্রতিষ্ঠানের অক্সিজেন রিফিল, ২৪/৭ হোম ডেলিভারি, কনসেনট্রেটর, বাইপ্যাপ সেটআপ, হটলাইন ও মেম্বার ছাড়ের তথ্য।"
                : isDengueTyphoid
                ? isEn
                  ? "Detailed breakdown of fever beds, STAT platelet testing, Dengue NS1 & Typhoid cultures, hotlines, and member discounts."
                  : "প্রতিটি প্রতিষ্ঠানের ডেঙ্গু বেড, স্ট্যাট প্লাটিলেট কাউন্ট, এনএস১ ও টাইফয়েড কালচার সুবিধা, হটলাইন ও মেম্বার ছাড়ের তথ্য।"
                : isEn
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
