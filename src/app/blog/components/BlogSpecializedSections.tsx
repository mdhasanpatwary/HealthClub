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
import {
  getDiagnosticTocTitles,
  getDiagnosticReviewsSubtitle,
} from "@/app/blog/utils/blogDiagnosticMetadata";

interface BlogSpecializedSectionsProps {
  post: BlogPost;
}

export function BlogSpecializedSections({
  post,
}: BlogSpecializedSectionsProps) {
  const isUpazila =
    post.slug.includes("healthcare-guide") || post.slug.includes("patient-guide");
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
            {`২. ${getDiagnosticTocTitles(post.slug).matrixTitle}`}
          </h2>
          <DiagnosticComparisonTable items={post.diagnosticComparisonTable} />
        </section>
      )}

      {/* Diagnostic Center In-Depth Reviews */}
      {post.diagnosticCenters && post.diagnosticCenters.length > 0 && (
        <section id="diagnostic-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {`৩. ${getDiagnosticTocTitles(post.slug).reviewsTitle}`}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {getDiagnosticReviewsSubtitle(post.slug)}
            </p>
          </div>

          <div className="space-y-8">
            {post.diagnosticCenters.map((center) => (
              <DiagnosticReviewCard
                key={center.rank}
                center={center}
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
          />
        ) : (
          <DiagnosticPriceTable
            pricingData={post.diagnosticTestPricingBn}
          />
        ))}

      {/* Dental Clinic Comparison Table */}
      {post.dentalComparisonTable && post.dentalComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            ২. একনজরে ফেনীর সেরা ১০ ডেন্টাল ক্লিনিকের সুবিধা তুলনা
          </h2>
          <DentalComparisonTable items={post.dentalComparisonTable} />
        </section>
      )}

      {/* Dental Clinic In-Depth Reviews */}
      {post.dentalClinics && post.dentalClinics.length > 0 && (
        <section id="dental-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              ৩. ফেনীর সেরা ১০টি ডেন্টাল ক্লিনিকের পূর্ণাঙ্গ পর্যালোচনা
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              প্রতিটি ক্লিনিকের আধুনিক প্রযুক্তি, স্কেলিং ও রুট ক্যানেল সুবিধা, চেম্বার শিডিউল ও মেম্বার ছাড়ের তথ্য।
            </p>
          </div>

          <div className="space-y-8">
            {post.dentalClinics.map((clinic) => (
              <DentalReviewCard
                key={clinic.rank}
                clinic={clinic}
              />
            ))}
          </div>
        </section>
      )}

      {/* Physiotherapy Center Comparison Table */}
      {post.physiotherapyComparisonTable && post.physiotherapyComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            ২. একনজরে ফেনীর সেরা ফিজিওথেরাপি সেন্টারের সুবিধা তুলনা
          </h2>
          <PhysiotherapyComparisonTable items={post.physiotherapyComparisonTable} />
        </section>
      )}

      {/* Physiotherapy Center In-Depth Reviews */}
      {post.physiotherapyCenters && post.physiotherapyCenters.length > 0 && (
        <section id="physiotherapy-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              ৩. ফেনীর সেরা ফিজিওথেরাপি সেন্টারের পূর্ণাঙ্গ পর্যালোচনা
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              প্রতিটি সেন্টারের আধুনিক ইলেকট্রোথেরাপি, স্ট্রোক রিহ্যাব, হোম সার্ভিস ও মেম্বার ছাড়ের তথ্য।
            </p>
          </div>

          <div className="space-y-8">
            {post.physiotherapyCenters.map((center) => (
              <PhysiotherapyReviewCard
                key={center.rank}
                center={center}
              />
            ))}
          </div>
        </section>
      )}

      {/* Specialized Care Pricing Tables (Modularized for performance & strict 500-line limit) */}
      <BlogSpecialtyPriceTables post={post} />

      {/* Emergency Care Specialized Sections: Pharmacies, Blood Banks & Ambulances */}
      <BlogEmergencyCareSections post={post} />

      {/* Hospital / Upazila Comparison Matrix Table */}
      {post.comparisonTable && post.comparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {isUpazila
              ? "৬. একনজরে উপজেলা হাসপাতাল ও ক্লিনিকের তুলনামূলক তালিকা"
              : isIcu
              ? "২. একনজরে ফেনীর শীর্ষ আইসিইউ, সিসিইউ ও এনআইসিইউ সুবিধা তুলনা"
              : isStrokeCardiac
              ? "২. একনজরে ফেনীর শীর্ষ স্ট্রোক ও কার্ডিয়াক ইমার্জেন্সি সেন্টারের সুবিধা তুলনা"
              : isHomeCare
              ? "২. একনজরে ফেনীর শীর্ষ হোম স্যাম্পল ও নার্সিং সেবা তুলনা"
              : isOxygen
              ? "২. একনজরে ফেনীর শীর্ষ অক্সিজেন ও ভেন্টিলেটর সরবরাহকারী তুলনা"
              : isDengueTyphoid
              ? "২. একনজরে ফেনীর শীর্ষ ডেঙ্গু ও টাইফয়েড চিকিৎসা সুবিধা তুলনা"
              : "২. একনজরে ফেনীর সেরা ১০ হাসপাতালের তুলনামূলক তালিকা"}
          </h2>
          <HospitalComparisonTable items={post.comparisonTable} />
        </section>
      )}

      {/* Hospital / Upazila Reviews */}
      {post.hospitals && post.hospitals.length > 0 && (
        <section id="hospital-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {isUpazila
                ? `৭. উপজেলার ${toBanglaNums(post.hospitals.length)}টি শীর্ষ হাসপাতাল ও ক্লিনিকের পূর্ণাঙ্গ পর্যালোচনা`
                : isIcu
                ? "৩. ফেনীর শীর্ষ আইসিইউ, সিসিইউ ও নিওনেটাল হাসপাতালের পর্যালোচনা"
                : isStrokeCardiac
                ? "৩. ফেনীর শীর্ষ স্ট্রোক ও কার্ডিয়াক ইমার্জেন্সি চিকিৎসাকেন্দ্রের পর্যালোচনা"
                : isHomeCare
                ? "৩. ফেনীর শীর্ষ হোম স্যাম্পল ও নার্সিং কেয়ার প্রতিষ্ঠানের পর্যালোচনা"
                : isOxygen
                ? "৩. ফেনীর শীর্ষ অক্সিজেন সিলিন্ডার ও হোম ভেন্টিলেটর প্রদানকারী প্রতিষ্ঠানের পর্যালোচনা"
                : isDengueTyphoid
                ? "৩. ফেনীর শীর্ষ ডেঙ্গু ও টাইফয়েড চিকিৎসাকেন্দ্রের পর্যালোচনা"
                : "৩. ফেনীর সেরা ১০টি হাসপাতালের পূর্ণাঙ্গ পর্যালোচনা"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isIcu
                ? "প্রতিটি হাসপাতালের শয্যা সংখ্যা, আইসিইউ/সিসিইউ/এনআইসিইউ প্রযুক্তি, ভেন্টিলেটর, সেন্ট্রাল অক্সিজেন ও মেম্বার ছাড়ের তথ্য।"
                : isStrokeCardiac
                ? "প্রতিটি প্রতিষ্ঠানের জরুরি ট্রাইয়েজ, সার্বক্ষণিক সিসিইউ/এইচডিইউ, সিটি স্ক্যান সুবিধা, হটলাইন ও পার্টনার ছাড়ের তথ্য।"
                : isHomeCare
                ? "প্রতিটি প্রতিষ্ঠানের হোম স্যাম্পল কালেকশন, অন-কল নার্সিং সেবা, ক্যাথেটার, ক্ষত ড্রেসিং ও মেম্বার ছাড়ের তথ্য।"
                : isOxygen
                ? "প্রতিটি প্রতিষ্ঠানের অক্সিজেন রিফিল, ২৪/৭ হোম ডেলিভারি, কনসেনট্রেটর, বাইপ্যাপ সেটআপ, হটলাইন ও মেম্বার ছাড়ের তথ্য।"
                : isDengueTyphoid
                ? "প্রতিটি প্রতিষ্ঠানের ডেঙ্গু বেড, স্ট্যাট প্লাটিলেট কাউন্ট, এনএস১ ও টাইফয়েড কালচার সুবিধা, হটলাইন ও মেম্বার ছাড়ের তথ্য।"
                : "প্রতিটি হাসপাতালের শয্যা সংখ্যা, আইসিইউ সুবিধা, বিশেষজ্ঞ ডাক্তার, যোগাযোগের নম্বর ও ডিসকাউন্ট তথ্য।"}
            </p>
          </div>

          <div className="space-y-8">
            {post.hospitals.map((hospital) => (
              <HospitalReviewCard
                key={hospital.rank}
                hospital={hospital}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
