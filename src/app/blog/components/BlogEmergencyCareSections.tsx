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
import { toBanglaNums } from "@/lib/utils";

interface BlogEmergencyCareSectionsProps {
  post: BlogPost;
  matrixNum?: number;
  reviewsNum?: number;
  pricingNum?: number;
}

export function BlogEmergencyCareSections({
  post,
  matrixNum,
  reviewsNum,
  pricingNum,
}: BlogEmergencyCareSectionsProps) {
  const matrixNumStr = `${toBanglaNums(matrixNum || 1)}. `;
  const reviewsNumStr = `${toBanglaNums(reviewsNum || 2)}. `;

  return (
    <>
      {/* 24/7 Pharmacy Comparison Table */}
      {post.pharmacyComparisonTable && post.pharmacyComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {`${matrixNumStr}কোথায় পাবেন: একনজরে ফেনীর শীর্ষ ২৪/৭ ফার্মেসির সুবিধা ও সেবা তুলনা`}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            ফেনী সদরে জরুরি প্রেসক্রিপশন ওষুধ, ইনসুলিন কোল্ড চেইন ও গভীর রাতে হোম ডেলিভারির জন্য অনুমোদিত ২৪ ঘণ্টা ফার্মেসিগুলোর তুলনামূলক সেবা নিচে সংকলিত হলো।
          </p>
          <PharmacyComparisonTable items={post.pharmacyComparisonTable} />
        </section>
      )}

      {/* 24/7 Pharmacy In-Depth Reviews */}
      {post.pharmacies && post.pharmacies.length > 0 && (
        <section id="pharmacy-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {`${reviewsNumStr}কোথায় সেবা পাবেন: ফেনীর শীর্ষ ২৪/৭ ফার্মেসি ও জরুরি ওষুধ ডেলিভারি সেন্টারের পর্যালোচনা`}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              প্রতিটি ফার্মেসির নাইট কাউন্টার স্ট্যাটাস, ভেরিফায়েড হটলাইন নম্বর, জরুরি হোম ডেলিভারি ও হেলথ ক্লাব মেম্বারদের জন্য ওষুধের খরচে নিশ্চিত ছাড়ের তথ্য।
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
          pricingNum={pricingNum}
        />
      )}

      {/* Blood Bank & Voluntary Donor Network Comparison Table */}
      {post.bloodBankComparisonTable && post.bloodBankComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {`${matrixNumStr}কোথায় পাবেন: একনজরে ফেনী ব্লাড ব্যাংক ও স্বেচ্ছাসেবী রক্তদান সংগঠনের তুলনা`}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            ফেনী জেলা সদর ও পার্শ্ববর্তী এলাকায় জরুরি রক্তের প্রয়োজনে সরকারি ব্লাড ব্যাংক ও নির্ভরযোগ্য স্বেচ্ছাসেবী ডোনার ক্লাবের সার্বক্ষণিক হটলাইন ও স্ক্রিনিং সুবিধার তুলনা নিচে তুলে ধরা হলো।
          </p>
          <BloodBankComparisonTable items={post.bloodBankComparisonTable} />
        </section>
      )}

      {/* Blood Bank & Voluntary Donor In-Depth Reviews */}
      {post.bloodBanks && post.bloodBanks.length > 0 && (
        <section id="blood-bank-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {`${reviewsNumStr}কোথায় সেবা পাবেন: ফেনীর শীর্ষ ১২টি ব্লাড ব্যাংক ও রক্তদান সংগঠনের পর্যালোচনা`}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              রেড ক্রিসেন্ট, সদর হাসপাতাল ব্লাড ইউনিট ও অনুমোদিত ক্লাবের সক্রিয় হটলাইন, ৫-পয়েন্ট ভাইরাল স্ক্রিনিং ও হেলথ ক্লাব ইমার্জেন্সি সাপোর্ট সুবিধা।
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
          pricingNum={pricingNum}
        />
      )}

      {/* 24/7 Ambulance & Oxygen Services Comparison Table */}
      {post.ambulanceComparisonTable && post.ambulanceComparisonTable.length > 0 && (
        <section id="comparison-matrix" className="scroll-mt-24 space-y-4">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {`${matrixNumStr}কোথায় পাবেন: একনজরে ফেনী ২৪/৭ অ্যাম্বুলেন্স ও অক্সিজেন সার্ভিসের তুলনা`}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            ফেনী থেকে ঢাকা, চট্টগ্রাম বা স্থানীয় ক্লিনিকে জরুরি রোগী স্থানান্তরের জন্য ভেন্টিলেটরযুক্ত আইসিইউ, এসি ও লাশবাহী ফ্রিজিং অ্যাম্বুলেন্সের নির্ভরযোগ্য তালিকা নিচে দেওয়া হলো।
          </p>
          <AmbulanceComparisonTable items={post.ambulanceComparisonTable} />
        </section>
      )}

      {/* 24/7 Ambulance & Oxygen In-Depth Reviews */}
      {post.ambulances && post.ambulances.length > 0 && (
        <section id="ambulance-reviews" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {`${reviewsNumStr}কোথায় সেবা পাবেন: ফেনীর শীর্ষ ১২টি অ্যাম্বুলেন্স ও অক্সিজেন সার্ভিসের পর্যালোচনা`}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              প্রতিটি সার্ভিসের লাইফ সাপোর্ট ভেন্টিলেটর সুবিধা, সার্বক্ষণিক ড্রাইভার হটলাইন, অক্সিজেন সিলিন্ডার এবং হেলথ ক্লাবের মাধ্যমে দ্রুত বুকিংয়ের বিবরণ।
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
          pricingNum={pricingNum}
        />
      )}
    </>
  );
}
