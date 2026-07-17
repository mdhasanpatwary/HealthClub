import { Heart, ShieldCheck, Users, Award, Target, Zap } from "lucide-react";
import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  return {
    title: locale === "en" ? "About Us - Health Club" : "আমাদের সম্পর্কে - হেলথ ক্লাব",
    description: locale === "en"
      ? "Learn about Health Club's mission, our team, how we work, and how we make healthcare affordable."
      : "হেলথ ক্লাবের লক্ষ্য, আমাদের টিম, কাজের ধরণ এবং কীভাবে আমরা চিকিৎসা খরচ কমিয়ে এনে দেশব্যাপী স্বাস্থ্যসেবা সহজলভ্য করছি তা জানুন।"
  };
}

export default async function AboutUsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const t = (key: string) => tServer(locale, key);

  const pillars = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: t("aboutUs.page.healthcareForAll"),
      desc: t("aboutUs.page.bringingTheCostOfHealth"),
      gradient: "from-emerald-500 to-green-600",
      bg: "from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: t("aboutUs.page.100OfficialPartnership"),
      desc: t("aboutUs.page.weEnsureValidDiscountsThrough"),
      gradient: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-white dark:from-blue-950/40 dark:to-slate-900",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t("aboutUs.page.simpleDigitalVerification"),
      desc: t("aboutUs.page.hasslefreeVerificationAtHospitalsUsing"),
      gradient: "from-violet-500 to-purple-600",
      bg: "from-violet-50 to-white dark:from-violet-950/40 dark:to-slate-900",
    },
  ];

  return (
    <div className="bg-background min-h-screen">

      {/* Page Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-light/50 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-16 sm:py-24 border-b border-border/60">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-32 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #16a34a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="section-label">{t("aboutUs.page.ourMission")}</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white mt-3">
            {t("aboutUs.page.ourVisionMission")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            {t("aboutUs.page.makingHealthcareSimpleAndAffordable")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-secondary dark:text-white">
                {t("aboutUs.page.whyWasHealthClubCreated")}
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t("aboutUs.page.forMiddleclassFamiliesStudentsAnd")}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t("aboutUs.page.healthClubIsASimple")}
            </p>
          </div>

          {/* Brand values card */}
          <div className="relative bg-gradient-to-br from-primary-light/80 via-emerald-50/60 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8 rounded-3xl border border-primary/20 dark:border-primary/10 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

            <div className="relative flex items-center gap-2.5 mb-6">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-heading text-base font-bold text-primary">
                {t("aboutUs.page.healthClubBrandValues")}
              </h3>
            </div>

            <ul className="space-y-5">
              {[
                { icon: <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />, text: t("aboutUs.page.trustCredibility100ServiceGuarantee") },
                { icon: <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />, text: t("aboutUs.page.caringServiceWarmAndPrompt") },
                { icon: <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />, text: t("aboutUs.page.communityWelfarePlayingARole") },
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-primary/15 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-sm text-secondary dark:text-slate-300 leading-relaxed pt-1">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Values / Pillars Grid */}
        <div className="space-y-10 border-t border-border/60 pt-16">
          <div className="text-center space-y-3">
            <span className="section-label">{t("aboutUs.page.ourCorePillars")}</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary dark:text-white mt-3">
              {t("aboutUs.page.weManageOurMemberServices")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className={`relative bg-gradient-to-br ${pillar.bg} p-7 rounded-2xl border border-border/80 text-center space-y-4 hover-lift shadow-sm overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 group-hover:from-primary/3 to-transparent transition-all duration-500 rounded-2xl" />
                <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mx-auto text-white shadow-lg`}>
                  {pillar.icon}
                </div>
                <h3 className="relative font-heading text-base font-bold text-secondary dark:text-white">
                  {pillar.title}
                </h3>
                <p className="relative text-sm text-muted-foreground leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
