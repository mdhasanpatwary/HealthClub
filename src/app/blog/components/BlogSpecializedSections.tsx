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
            {post.slug === "feni-ct-scan-and-mri-test-price-guide"
              ? "২. একনজরে ফেনীর শীর্ষ সিটি স্ক্যান ও এমআরআই সেন্টারের সুবিধা তুলনা"
              : post.slug === "pregnancy-ultrasonography-4d-anomaly-scan-in-feni"
              ? "২. একনজরে ফেনীর শীর্ষ ৪ডি প্রেগন্যান্সি আল্ট্রাসাউন্ড সেন্টারের সুবিধা তুলনা"
              : post.slug === "full-body-health-checkup-packages-in-feni"
              ? "২. একনজরে ফেনীর শীর্ষ হোল বডি চেকআপ সেন্টারের সুবিধা তুলনা"
              : post.slug === "feni-endoscopy-colonoscopy-test-cost-guide"
              ? "২. একনজরে ফেনীর শীর্ষ এন্ডোস্কোপি ও কোলনোস্কোপি সেন্টারের সুবিধা তুলনা"
              : post.slug === "feni-cardiac-ecg-echo-ett-test-guide"
              ? "২. একনজরে ফেনীর শীর্ষ ইসিজি, ইকো ও ইটিটি হার্ট সেন্টারের সুবিধা তুলনা"
              : post.slug === "feni-blood-test-cbc-cost-guide"
              ? "২. একনজরে ফেনীর শীর্ষ সিবিসি ও প্যাথলজি ল্যাব সেন্টারের সুবিধা তুলনা"
              : post.slug === "feni-lipid-profile-cholesterol-test-guide"
              ? "২. একনজরে ফেনীর শীর্ষ লিপিড প্রোফাইল ও বায়োকেমিস্ট্রি ল্যাব সুবিধা তুলনা"
              : post.slug === "feni-thyroid-tsh-test-cost-guide"
              ? "২. একনজরে ফেনীর শীর্ষ থাইরয়েড ও হরমোন ডায়াগনস্টিক ল্যাব সুবিধা তুলনা"
              : post.slug === "feni-hba1c-diabetes-test-guide"
              ? "২. একনজরে ফেনীর শীর্ষ HbA1c ও ডায়াবেটিস ডায়াগনস্টিক ল্যাব সুবিধা তুলনা"
              : post.slug === "feni-liver-function-sgpt-test-guide"
              ? "২. একনজরে ফেনীর শীর্ষ লিভার ফাংশন ও প্যাথলজি ল্যাব সুবিধা তুলনা"
              : post.slug === "feni-kidney-creatinine-urea-test-guide"
              ? "২. একনজরে ফেনীর শীর্ষ কিডনি ফাংশন ও প্যাথলজি ল্যাব সুবিধা তুলনা"
              : post.slug === "feni-urine-re-culture-test-guide"
              ? "২. একনজরে ফেনীর শীর্ষ ইউরিন ও মাইক্রোবায়োলজি ল্যাব সুবিধা তুলনা"
              : post.slug === "feni-x-ray-digital-dr-cost-guide"
              ? "২. একনজরে ফেনীর শীর্ষ ডিজিটাল এক্স-রে ও ইমেজিং সেন্টার সুবিধা তুলনা"
              : post.slug === "feni-hormone-test-fertility-guide"
              ? "২. একনজরে ফেনীর শীর্ষ হরমোন ও প্রজনন ডায়াগনস্টিক ল্যাব সুবিধা তুলনা"
              : post.slug === "feni-pap-smear-cervical-cancer-screening-guide"
              ? "২. একনজরে ফেনীর শীর্ষ প্যাপ স্মিয়ার ও জরায়ুমুখের ক্যান্সার স্ক্রিনিং সেন্টার তুলনা"
              : post.slug === "feni-allergy-asthma-test-guide"
              ? "২. একনজরে ফেনীর শীর্ষ অ্যালার্জি ও পালমোনারি ল্যাব সুবিধা তুলনা"
              : post.slug === "feni-semen-analysis-infertility-test-guide"
              ? "২. একনজরে ফেনীর শীর্ষ সিমেন অ্যানালাইসিস ও ফার্টিলিটি ল্যাব সুবিধা তুলনা"
              : post.slug === "feni-biopsy-fnac-tumor-test-guide"
              ? "২. একনজরে ফেনীর শীর্ষ এফএনএসি ও বায়োপসি ল্যাব সুবিধা তুলনা"
              : post.slug === "feni-cataract-phaco-eye-surgery-cost-guide"
              ? "২. একনজরে ফেনীর শীর্ষ চক্ষু হাসপাতাল ও ফ্যাকো সেন্টারের সুবিধা তুলনা"
              : post.slug === "feni-tonsil-adenoid-surgery-cost-guide"
              ? "২. একনজরে ফেনীর শীর্ষ ইএনটি হাসপাতাল ও সার্জারি সেন্টারের সুবিধা তুলনা"
              : post.slug === "feni-appendix-appendectomy-surgery-cost-guide"
              ? "২. একনজরে ফেনীর শীর্ষ সার্জারি হাসপাতাল ও ল্যাপারোস্কোপিক ওটি সুবিধা তুলনা"
              : "২. একনজরে ফেনীর সেরা ১০ ডায়াগনস্টিকের প্রযুক্তি ও সুবিধা তুলনা"}
          </h2>
          <DiagnosticComparisonTable items={post.diagnosticComparisonTable} />
        </section>
      )}

      {/* Diagnostic Center In-Depth Reviews */}
      {post.diagnosticCenters && post.diagnosticCenters.length > 0 && (
        <section id="diagnostic-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {post.slug === "feni-ct-scan-and-mri-test-price-guide"
                ? "৩. ফেনীর শীর্ষ সিটি স্ক্যান ও ১.৫ টেসলা এমআরআই সেন্টারের পর্যালোচনা"
                : post.slug === "pregnancy-ultrasonography-4d-anomaly-scan-in-feni"
                ? "৩. ফেনীর শীর্ষ ৪ডি আল্ট্রাসাউন্ড ও প্রেগন্যান্সি ডায়াগনস্টিক সেন্টারের পর্যালোচনা"
                : post.slug === "full-body-health-checkup-packages-in-feni"
                ? "৩. ফেনীর শীর্ষ হোল বডি চেকআপ ও এক্সিকিউটিভ ডায়াগনস্টিক সেন্টারের পর্যালোচনা"
                : post.slug === "feni-endoscopy-colonoscopy-test-cost-guide"
                ? "৩. ফেনীর শীর্ষ এন্ডোস্কোপি, কোলনোস্কোপি ও গ্যাস্ট্রো সেন্টারের পর্যালোচনা"
                : post.slug === "feni-cardiac-ecg-echo-ett-test-guide"
                ? "৩. ফেনীর শীর্ষ কার্ডিয়াক ডায়াগনস্টিক ও হার্ট সেন্টারের পর্যালোচনা"
                : post.slug === "feni-blood-test-cbc-cost-guide"
                ? "৩. ফেনীর শীর্ষ প্যাথলজি ল্যাব ও সিবিসি সেন্টারের পর্যালোচনা"
                : post.slug === "feni-lipid-profile-cholesterol-test-guide"
                ? "৩. ফেনীর শীর্ষ লিপিড প্রোফাইল ও বায়োকেমিস্ট্রি ল্যাব পর্যালোচনা"
                : post.slug === "feni-thyroid-tsh-test-cost-guide"
                ? "৩. ফেনীর শীর্ষ থাইরয়েড ও হরমোন ডায়াগনস্টিক ল্যাব পর্যালোচনা"
                : post.slug === "feni-hba1c-diabetes-test-guide"
                ? "৩. ফেনীর শীর্ষ HbA1c ও ডায়াবেটিস ডায়াগনস্টিক ল্যাব পর্যালোচনা"
                : post.slug === "feni-liver-function-sgpt-test-guide"
                ? "৩. ফেনীর শীর্ষ লিভার ফাংশন ও বায়োকেমিস্ট্রি ল্যাব পর্যালোচনা"
                : post.slug === "feni-kidney-creatinine-urea-test-guide"
                ? "৩. ফেনীর শীর্ষ কিডনি ফাংশন ও বায়োকেমিস্ট্রি ল্যাব পর্যালোচনা"
                : post.slug === "feni-urine-re-culture-test-guide"
                ? "৩. ফেনীর শীর্ষ ইউরিন ও মাইক্রোবায়োলজি ডায়াগনস্টিক ল্যাব পর্যালোচনা"
                : post.slug === "feni-x-ray-digital-dr-cost-guide"
                ? "৩. ফেনীর শীর্ষ ডিজিটাল এক্স-রে (DR/CR) ও ইমেজিং সেন্টারের পর্যালোচনা"
                : post.slug === "feni-hormone-test-fertility-guide"
                ? "৩. ফেনীর শীর্ষ হরমোন ও প্রজনন ডায়াগনস্টিক ল্যাবের পর্যালোচনা"
                : post.slug === "feni-pap-smear-cervical-cancer-screening-guide"
                ? "৩. ফেনীর শীর্ষ প্যাপ স্মিয়ার ও জরায়ুমুখের ক্যান্সার স্ক্রিনিং সেন্টারের পর্যালোচনা"
                : post.slug === "feni-allergy-asthma-test-guide"
                ? "৩. ফেনীর শীর্ষ অ্যালার্জি ও স্পাইরোমেট্রি ডায়াগনস্টিক ল্যাবের পর্যালোচনা"
                : post.slug === "feni-semen-analysis-infertility-test-guide"
                ? "৩. ফেনীর শীর্ষ সিমেন অ্যানালাইসিস ও প্রজনন ডায়াগনস্টিক ল্যাবের পর্যালোচনা"
                : post.slug === "feni-biopsy-fnac-tumor-test-guide"
                ? "৩. ফেনীর শীর্ষ এফএনএসি, বায়োপসি ও টিউমার ডায়াগনস্টিক ল্যাবের পর্যালোচনা"
                : post.slug === "feni-cataract-phaco-eye-surgery-cost-guide"
                ? "৩. ফেনীর শীর্ষ চক্ষু হাসপাতাল, ফ্যাকো সার্জারি সেন্টার ও ডায়াগনস্টিক পর্যালোচনা"
                : post.slug === "feni-tonsil-adenoid-surgery-cost-guide"
                ? "৩. ফেনীর শীর্ষ ইএনটি হাসপাতাল, টনসিল সার্জারি সেন্টার ও ডায়াগনস্টিক পর্যালোচনা"
                : post.slug === "feni-appendix-appendectomy-surgery-cost-guide"
                ? "৩. ফেনীর শীর্ষ সার্জারি হাসপাতাল, ল্যাপারোস্কোপিক সেন্টার ও ডায়াগনস্টিক পর্যালোচনা"
                : "৩. ফেনীর সেরা ১০টি ডায়াগনস্টিক সেন্টারের পূর্ণাঙ্গ পর্যালোচনা"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {post.slug === "feni-ct-scan-and-mri-test-price-guide"
                ? "প্রতিটি সেন্টারের ১২৮-স্লাইস সিটি, ১.৫ টেসলা এমআরআই, কনট্রাস্ট সেফটি প্রটোকল, ঠিকানা ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "pregnancy-ultrasonography-4d-anomaly-scan-in-feni"
                ? "প্রতিটি সেন্টারের ৪ডি ভলিউসন মেশিন, নারী সনোলজিস্টের সুবিধা, অ্যানোমালি স্ক্যান, ঠিকানা ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "full-body-health-checkup-packages-in-feni"
                ? "প্রতিটি সেন্টারের অটোমেটেড বায়োকেমিস্ট্রি প্ল্যাটফর্ম, চেকআপ প্যাকেজ, হোম স্যাম্পল সংগ্রহ, ঠিকানা ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-endoscopy-colonoscopy-test-cost-guide"
                ? "প্রতিটি সেন্টারের এইচডি ভিডিও এন্ডোস্কোপি, ব্যথাহীন কোলনোস্কোপি, বায়োপ্সি সুবিধা, ঠিকানা ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-cardiac-ecg-echo-ett-test-guide"
                ? "প্রতিটি সেন্টারের কালার ডপলার ইকো, কম্পিউটারাইজড ইটিটি, জরুরি ট্রোপোনিন ল্যাব, ঠিকানা ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-blood-test-cbc-cost-guide"
                ? "প্রতিটি সেন্টারের ৫-পার্ট হেমাটোলজি অ্যানালাইজার, প্যাথলজিস্ট কন্ট্রোল, জরুরি রিপোর্ট সময়, ঠিকানা ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-lipid-profile-cholesterol-test-guide"
                ? "প্রতিটি সেন্টারের ফুল অটোমেটেড কেমিস্ট্রি অ্যানালাইজার, ফাস্টিং স্যাম্পল ড্র, রিপোর্ট সময়, ঠিকানা ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-thyroid-tsh-test-cost-guide"
                ? "প্রতিটি সেন্টারের ফুল অটোমেটেড কেমিলুমিনেসেন্স অ্যানালাইজার, হরমোন প্রোফাইল, স্যাম্পল ড্র, রিপোর্ট সময় ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-hba1c-diabetes-test-guide"
                ? "প্রতিটি সেন্টারের এনজিএসপি সার্টিফাইড HPLC অ্যানালাইজার, ডায়াবেটিস প্রোফাইল, স্যাম্পল ড্র, রিপোর্ট সময় ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-liver-function-sgpt-test-guide"
                ? "প্রতিটি সেন্টারের ফুল অটোমেটেড ক্লিনিক্যাল কেমিস্ট্রি অ্যানালাইজার, এলএফটি প্রোফাইল, স্যাম্পল ড্র, রিপোর্ট সময় ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-kidney-creatinine-urea-test-guide"
                ? "প্রতিটি সেন্টারের ফুল অটোমেটেড ক্লিনিক্যাল কেমিস্ট্রি অ্যানালাইজার, ক্রিয়েটিনিন ও ইউরিয়া টেস্ট, স্যাম্পল ড্র, রিপোর্ট সময় ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-urine-re-culture-test-guide"
                ? "প্রতিটি সেন্টারের স্বয়ংক্রিয় ইউরিন অ্যানালাইজার, কালচার ইনকিউবেশন, মিড-স্ট্রিম নমুনা নির্দেশিকা ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-x-ray-digital-dr-cost-guide"
                ? "প্রতিটি সেন্টারের হাই-ফ্রিকোয়েন্সি ডিজিটাল রেডিওগ্রাফি (DR), সিআর সিস্টেম, রেডিয়েশন শিল্ড, অর্থোপেডিক ভিউ ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-hormone-test-fertility-guide"
                ? "প্রতিটি সেন্টারের ফুল অটোমেটেড কেমিলুমিনেসেন্স (CLIA) অ্যানালাইজার, হরমোন প্রোফাইল, স্যাম্পল ড্র, রিপোর্ট সময় ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-pap-smear-cervical-cancer-screening-guide"
                ? "প্রতিটি সেন্টারের সাইটোপ্যাথলজি প্রটোকল, নারী টেকনোলজিস্ট ও স্যাম্পলিং রুম, এলবিসি ও এইচপিভি ডিএনএ সুবিধা এবং মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-allergy-asthma-test-guide"
                ? "প্রতিটি সেন্টারের কম্পিউটারাইজড স্পাইরোমেট্রি, সিরাম টোটাল IgE, অ্যালার্জেন প্যানেল, ডিজিটাল চেস্ট এক্স-রে ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-semen-analysis-infertility-test-guide"
                ? "প্রতিটি সেন্টারের প্রাইভেট স্যাম্পলিং রুম, ফেজ-কনট্রাস্ট মাইক্রোস্কোপি, CASA, ওয়ার্মিং স্টেজ ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-biopsy-fnac-tumor-test-guide"
                ? "প্রতিটি সেন্টারের এফএনএসি স্যাম্পলিং, ইউএসজি গাইডেন্স, ১০% ফরমালিন ফিক্সেশন, হিস্টোপ্যাথলজি ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-cataract-phaco-eye-surgery-cost-guide"
                ? "প্রতিটি সেন্টারের আধুনিক ফ্যাকো মেশিন, বায়োমেট্রি, ফোল্ডেবল আইওএল লেন্স, ঠিকানা ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-tonsil-adenoid-surgery-cost-guide"
                ? "প্রতিটি সেন্টারের ইএনটি ওটি ব্যবস্থা, অ্যানেস্থেসিয়া মনিটরিং, টনসিল-এডিনয়েড সার্জারি পদ্ধতি, ঠিকানা ও মেম্বার ছাড়ের তথ্য।"
                : post.slug === "feni-appendix-appendectomy-surgery-cost-guide"
                ? "প্রতিটি সেন্টারের জরুরি ওটি পরিকাঠামো, ল্যাপারোস্কোপিক সিস্টেম, সার্জন টিম, ঠিকানা ও মেম্বার ছাড়ের তথ্য।"
                : "প্রতিটি সেন্টারের আধুনিক যন্ত্রপাতি, বিশেষায়িত টেস্ট, ঠিকানা, যোগাযোগের নম্বর ও ডিসকাউন্ট তথ্য।"}
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
