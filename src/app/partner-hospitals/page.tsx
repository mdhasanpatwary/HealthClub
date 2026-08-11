import Link from "next/link";
import PartnerDirectory from "@/components/ui/PartnerDirectory";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";
import { getPartnersAction } from "@/app/actions/partnerActions";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Partner Hospitals & Diagnostic Centers Directory - Health Club"
      : "পার্টনার হাসপাতাল ও ডায়াগনস্টিকস তালিকা - হেলথ ক্লাব",
    description: isEn
      ? "Explore our full network of partner hospitals, diagnostic centers, and model pharmacies offering 10% to 30% discount to Health Club members."
      : "আমাদের মেম্বারশিপ কার্ড ব্যবহার করে দেশের যেসব হাসপাতাল, ল্যাব ও ফার্মেসিতে সর্বোচ্চ ডিসকাউন্ট পাবেন তার সম্পূর্ণ তালিকা দেখুন।",
    alternates: {
      canonical: "https://healthclubfeni.vercel.app/partner-hospitals",
    },
    openGraph: {
      title: isEn
        ? "Partner Hospitals & Diagnostic Centers - Health Club"
        : "পার্টনার হাসপাতাল ও ডায়াগনস্টিকস - হেলথ ক্লাব",
      description: isEn
        ? "Find hospitals, diagnostic labs, and pharmacies with instant member discounts."
        : "ফেনী ও আশপাশের চুক্তিভিত্তিক হাসপাতাল ও ডায়াগনস্টিক সেন্টারের বিস্তারিত তালিকা।",
      url: "https://healthclubfeni.vercel.app/partner-hospitals",
    },
  };
}

export default async function PartnerHospitalsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const t = (key: string) => tServer(locale, key);

  // Fetch partners server-side (cached) — eliminates client-side loading spinner
  const allPartners = await getPartnersAction();

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": locale === "en" ? "Home" : "হোম",
          "item": "https://healthclubfeni.vercel.app"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": locale === "en" ? "Partner Hospitals" : "পার্টনার হাসপাতালসমূহ",
          "item": "https://healthclubfeni.vercel.app/partner-hospitals"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "Health Club Partner Network",
      "url": "https://healthclubfeni.vercel.app/partner-hospitals",
      "description": "Network of partner hospitals, diagnostic clinics, and model pharmacies offering healthcare discounts in Bangladesh.",
      "areaServed": "Feni, Bangladesh",
      "medicalSpecialty": "Healthcare Discount Membership Services"
    }
  ];

  return (
    <div className="bg-background min-h-screen py-6 sm:py-12">
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-2 sm:space-y-4 max-w-2xl mx-auto">
          <span className="text-[11px] sm:text-xs font-extrabold text-primary tracking-widest uppercase">
            {t("partnerHospitals.page.partnerNetwork")}
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            {t("partnerHospitals.page.partnerHospitalsDiagnostics")}
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground">
            {t("partnerHospitals.page.findYourNearestPartnerFacilities")}
          </p>
        </div>

        {/* Directory Component — server-fetched data, no client-side loading */}
        <div className="bg-muted/30 border border-border/80 rounded-3xl p-3.5 sm:p-8">
          <PartnerDirectory partners={allPartners} />
        </div>

        {/* Become Partner Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-emerald-500/5 to-secondary/5 border border-primary/20 rounded-3xl p-5 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          <h2 className="font-heading text-xl md:text-3xl font-bold text-secondary dark:text-white">
            {t("partnerHospitals.page.doYouManageAHealthcare")}
          </h2>
          <p className="text-xs md:text-base text-muted-foreground max-w-xl mx-auto">
            {t("partnerHospitals.page.joinOurHealthClubPartner")}
          </p>
          <div>
            <Link href="/become-partner">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold">
                {t("partnerHospitals.page.applyAsAPartnerHospital")}
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
