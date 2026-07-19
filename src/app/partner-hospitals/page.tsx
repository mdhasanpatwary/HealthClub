import Link from "next/link";
import PartnerDirectory from "@/components/ui/PartnerDirectory";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  return {
    title: locale === "en" ? "Partner Hospitals & Diagnostics - Health Club" : "পার্টনার হাসপাতাল ও ডায়াগনস্টিকস - হেলথ ক্লাব",
    description: locale === "en"
      ? "List of hospitals, labs, and pharmacies where you can get discounts using our membership card."
      : "আমাদের মেম্বারশিপ কার্ড ব্যবহার করে দেশের যেসব হাসপাতাল, ল্যাব ও ফার্মেসিতে ডিসকাউন্ট পাবেন তার তালিকা।"
  };
}

export default async function PartnerHospitalsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const t = (key: string) => tServer(locale, key);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">
            {t("partnerHospitals.page.partnerNetwork")}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            {t("partnerHospitals.page.partnerHospitalsDiagnostics")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("partnerHospitals.page.findYourNearestPartnerFacilities")}
          </p>
        </div>

        {/* Directory Component */}
        <div className="bg-muted/30 border border-border/80 rounded-3xl p-6 sm:p-8">
          <PartnerDirectory />
        </div>

        {/* Become Partner Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-emerald-500/5 to-secondary/5 border border-primary/20 rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary dark:text-white">
            {t("partnerHospitals.page.doYouManageAHealthcare")}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
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
