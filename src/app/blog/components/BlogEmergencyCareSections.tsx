import { BlogPost } from "@/types/blog";
import { PharmacyComparisonTable } from "./PharmacyComparisonTable";
import { PharmacyReviewCard } from "./PharmacyReviewCard";
import { PharmacyPriceTable } from "./PharmacyPriceTable";
import { BloodBankComparisonTable } from "./BloodBankComparisonTable";
import { BloodBankReviewCard } from "./BloodBankReviewCard";
import { BloodPriceTable } from "./BloodPriceTable";
import { AmbulanceComparisonTable } from "./AmbulanceComparisonTable";
import { AmbulanceReviewCard } from "./AmbulanceReviewCard";
import { AmbulancePriceTable } from "./AmbulancePriceTable";

interface BlogEmergencyCareSectionsProps {
  post: BlogPost;
}

export function BlogEmergencyCareSections({
  post,
}: BlogEmergencyCareSectionsProps) {
  return (
    <>
      {/* 24/7 Pharmacy Comparison Table */}
      {post.pharmacyComparisonTable && post.pharmacyComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            ২. একনজরে ফেনীর শীর্ষ ২৪/৭ ফার্মেসির সুবিধা ও সেবা তুলনা
          </h2>
          <PharmacyComparisonTable items={post.pharmacyComparisonTable} />
        </section>
      )}

      {/* 24/7 Pharmacy In-Depth Reviews */}
      {post.pharmacies && post.pharmacies.length > 0 && (
        <section id="pharmacy-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              ৩. ফেনীর শীর্ষ ২৪/৭ ফার্মেসি ও জরুরি ওষুধ ডেলিভারি সেন্টারের পর্যালোচনা
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              প্রতিটি ফার্মেসির নাইট কাউন্টার স্ট্যাটাস, ভেরিফায়েড হটলাইন নম্বর, ইনসুলিন কোল্ড চেইন এবং জরুরি হোম ডেলিভারি তথ্য।
            </p>
          </div>

          <div className="space-y-8">
            {post.pharmacies.map((pharmacy) => (
              <PharmacyReviewCard
                key={pharmacy.rank}
                pharmacy={pharmacy}
              />
            ))}
          </div>
        </section>
      )}

      {/* Emergency Medicine & Delivery Fee Benchmark Table */}
      {post.pharmacyCarePricingBn && (
        <PharmacyPriceTable
          pricingData={post.pharmacyCarePricingBn}
        />
      )}

      {/* Blood Bank & Voluntary Donor Network Comparison Table */}
      {post.bloodBankComparisonTable && post.bloodBankComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            ২. একনজরে ফেনী ব্লাড ব্যাংক ও স্বেচ্ছাসেবী রক্তদান সংগঠনের তুলনা
          </h2>
          <BloodBankComparisonTable items={post.bloodBankComparisonTable} />
        </section>
      )}

      {/* Blood Bank & Voluntary Donor In-Depth Reviews */}
      {post.bloodBanks && post.bloodBanks.length > 0 && (
        <section id="blood-bank-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              ৩. ফেনীর শীর্ষ ১২টি ব্লাড ব্যাংক ও রক্তদান সংগঠনের পর্যালোচনা
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              রেড ক্রিসেন্ট, সদর হাসপাতাল ব্লাড ইউনিট, ছাত্র ও স্বেচ্ছাসেবী ক্লাবের হটলাইন, ৫-পয়েন্ট স্ক্রিনিং ও হেলথ ক্লাব সহায়তা।
            </p>
          </div>

          <div className="space-y-8">
            {post.bloodBanks.map((bank) => (
              <BloodBankReviewCard
                key={bank.rank}
                bank={bank}
              />
            ))}
          </div>
        </section>
      )}

      {/* Blood Transfusion & Screening Pricing Benchmark Table */}
      {post.bloodCarePricingBn && (
        <BloodPriceTable
          pricingData={post.bloodCarePricingBn}
        />
      )}

      {/* 24/7 Ambulance & Oxygen Services Comparison Table */}
      {post.ambulanceComparisonTable && post.ambulanceComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            ২. একনজরে ফেনী ২৪/৭ অ্যাম্বুলেন্স ও অক্সিজেন সার্ভিসের তুলনা
          </h2>
          <AmbulanceComparisonTable items={post.ambulanceComparisonTable} />
        </section>
      )}

      {/* 24/7 Ambulance & Oxygen In-Depth Reviews */}
      {post.ambulances && post.ambulances.length > 0 && (
        <section id="ambulance-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              ৩. ফেনীর শীর্ষ ১২টি অ্যাম্বুলেন্স ও অক্সিজেন সার্ভিসের পর্যালোচনা
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              আইসিইউ লাইফ সাপোর্ট অ্যাম্বুলেন্স, এসি পেশেন্ট ক্যারিয়ার, অক্সিজেন সিলিন্ডার হোম ডেলিভারি ও লাশবাহী ফ্রিজিং ভ্যানের বিস্তারিত বিবরণ।
            </p>
          </div>

          <div className="space-y-8">
            {post.ambulances.map((ambulance) => (
              <AmbulanceReviewCard
                key={ambulance.rank}
                ambulance={ambulance}
              />
            ))}
          </div>
        </section>
      )}

      {/* Ambulance Fares & Oxygen Cylinder Price Benchmark Table */}
      {post.ambulanceCarePricingBn && (
        <AmbulancePriceTable
          pricingData={post.ambulanceCarePricingBn}
        />
      )}
    </>
  );
}
