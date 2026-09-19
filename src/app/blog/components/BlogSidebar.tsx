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
  locale?: string;
}

const CLUSTER_QUICK_LINKS = [
  { slug: "best-10-hospitals-in-feni", titleBn: "ফেনীর সেরা হাসপাতাল", titleEn: "Top 10 Hospitals" },
  { slug: "best-doctors-in-feni", titleBn: "সেরা বিশেষজ্ঞ ডাক্তার", titleEn: "Specialist Doctors" },
  { slug: "best-child-specialists-in-feni", titleBn: "শিশু ও নবজাতক বিশেষজ্ঞ", titleEn: "Child Specialists & NICU" },
  { slug: "best-skin-specialists-in-feni", titleBn: "চর্ম, এলার্জি ও যৌন বিশেষজ্ঞ", titleEn: "Dermatologists & Skin" },
  { slug: "best-medicine-doctors-in-feni", titleBn: "মেডিসিন বিশেষজ্ঞ", titleEn: "Medicine Specialists" },
  { slug: "best-cardiologists-in-feni", titleBn: "হৃদরোগ ও কার্ডিওলজিস্ট", titleEn: "Cardiologists & Heart" },
  { slug: "best-gynecologists-in-feni", titleBn: "গাইনি ও প্রসূতি সেবা", titleEn: "Gynecologists & Maternity" },
  { slug: "best-kidney-doctors-in-feni", titleBn: "কিডনি ও ডায়ালাইসিস", titleEn: "Kidney & Dialysis" },
  { slug: "best-diagnostic-centers-in-feni", titleBn: "ডায়াগনস্টিক ও ল্যাব", titleEn: "Diagnostic Labs" },
  { slug: "best-dental-clinics-in-feni", titleBn: "ডেন্টাল ও দন্ত চিকিৎসা", titleEn: "Dental Clinics" },
  { slug: "best-physiotherapy-centers-in-feni", titleBn: "ফিজিওথেরাপি ও রিহ্যাব", titleEn: "Physiotherapy Centers" },
];

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
  locale = "bn",
}: BlogSidebarProps) {
  const isEn = locale === "en";

  return (
    <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto pr-1 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
        {/* Table of Contents */}
        <BlogTableOfContents
          hospitals={hospitals}
          doctorGroups={doctorGroups}
          diagnosticCenters={diagnosticCenters}
          dentalClinics={dentalClinics}
          physiotherapyCenters={physiotherapyCenters}
          hasMaternityPricing={hasMaternityPricing}
          hasCardiacPricing={hasCardiacPricing}
          hasKidneyPricing={hasKidneyPricing}
          hasPediatricPricing={hasPediatricPricing}
          hasSkinPricing={hasSkinPricing}
          locale={locale}
        />

        {/* Feni Healthcare Topic Cluster Quick Links */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-foreground">
              {isEn ? "Feni Healthcare Cluster" : "ফেনী স্বাস্থ্য গাইড নেটওয়ার্ক"}
            </h3>
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {isEn ? "11 Guides" : "১১টি গাইড"}
            </span>
          </div>
          <div className="space-y-1 text-xs">
            {CLUSTER_QUICK_LINKS.map((link) => {
              const isActive = link.slug === currentSlug;
              return (
                <Link
                  key={link.slug}
                  href={`/blog/${link.slug}`}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <span className="truncate">{isEn ? link.titleEn : link.titleBn}</span>
                  {isActive ? (
                    <span className="text-[10px] text-primary shrink-0">
                      {isEn ? "Current" : "পড়ছেন"}
                    </span>
                  ) : (
                    <ArrowRight className="h-3 w-3 opacity-60 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

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
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs transition-colors"
          >
            <span>{isEn ? "View Membership Plans" : "মেম্বারশিপ প্ল্যান দেখুন"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
    </aside>
  );
}
