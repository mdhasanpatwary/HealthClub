import { Heart, ShieldCheck, Users, Award } from "lucide-react";
import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  return {
    title: locale === "en" ? "About Us - Health Club" : "আমাদের সম্পর্কে - হেলথ ক্লাব",
    description: locale === "en"
      ? "Learn about Health Club's mission, our team, how we work, and how we make healthcare affordable."
      : "হেলথ ক্লাবের লক্ষ্য, আমাদের টিম, কাজের ধরণ এবং কীভাবে আমরা চিকিৎসা খরচ কমিয়ে এনে দেশব্যাপী স্বাস্থ্যসেবা সহজলভ্য করছি তা জানুন।"
  };
}

export default async function AboutUsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const t = (key: string) => tServer(locale, key);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">
            {t("aboutUs.page.ourMission")}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            {t("aboutUs.page.ourVisionMission")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("aboutUs.page.makingHealthcareSimpleAndAffordable")}
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-secondary dark:text-white">
              {t("aboutUs.page.whyWasHealthClubCreated")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t("aboutUs.page.forMiddleclassFamiliesStudentsAnd")}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t("aboutUs.page.healthClubIsASimple")}
            </p>
          </div>
          <div className="relative bg-gradient-to-br from-primary-light/80 to-emerald-500/10 p-8 rounded-3xl border border-primary/20 space-y-6">
            <h3 className="font-heading text-xl font-bold text-primary">
              {t("aboutUs.page.healthClubBrandValues")}
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-secondary dark:text-slate-300">
                  {t("aboutUs.page.trustCredibility100ServiceGuarantee")}
                </span>
              </li>
              <li className="flex gap-3">
                <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-secondary dark:text-slate-300">
                  {t("aboutUs.page.caringServiceWarmAndPrompt")}
                </span>
              </li>
              <li className="flex gap-3">
                <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-secondary dark:text-slate-300">
                  {t("aboutUs.page.communityWelfarePlayingARole")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values Grid */}
        <div className="space-y-8 pt-8 border-t border-border">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-2xl font-bold text-secondary dark:text-white">
              {t("aboutUs.page.ourCorePillars")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t("aboutUs.page.weManageOurMemberServices")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-muted/40 p-6 rounded-2xl border border-border text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto border border-primary/20">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">
                {t("aboutUs.page.healthcareForAll")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("aboutUs.page.bringingTheCostOfHealth")}
              </p>
            </div>

            <div className="bg-muted/40 p-6 rounded-2xl border border-border text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-200">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">
                {t("aboutUs.page.100OfficialPartnership")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("aboutUs.page.weEnsureValidDiscountsThrough")}
              </p>
            </div>

            <div className="bg-muted/40 p-6 rounded-2xl border border-border text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">
                {t("aboutUs.page.simpleDigitalVerification")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t("aboutUs.page.hasslefreeVerificationAtHospitalsUsing")}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
