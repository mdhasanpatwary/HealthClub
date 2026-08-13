import Link from "next/link";
import { Check, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Membership Plans & Pricing - Health Club"
      : "মেম্বারশিপ প্ল্যান ও ফ্রি রেজিস্ট্রেশন - হেলথ ক্লাব",
    description: isEn
      ? "Compare Founding Member (Free 1 year) and Premium Member plans to get instant discounts on medical bills across partner hospitals."
      : "ফাউন্ডিং মেম্বার (১ বছর সম্পূর্ণ ফ্রি) ও প্রিমিয়াম মেম্বারশিপের সুবিধা দেখে নিন এবং আপনার জন্য সেরা প্ল্যানটি বেছে নিন।",
    alternates: {
      canonical: "https://healthclubfeni.vercel.app/membership",
    },
    openGraph: {
      title: isEn
        ? "Health Club Membership Plans & Benefits"
        : "মেম্বারশিপ প্ল্যান - হেলথ ক্লাব",
      description: isEn
        ? "Get 1 Year Free Founding Membership for first 100 users."
        : "প্রথম ১০০ জন সদস্য পাচ্ছেন ১ বছরের ফাউন্ডিং মেম্বারশিপ সম্পূর্ণ ফ্রি।",
      url: "https://healthclubfeni.vercel.app/membership",
    },
  };
}

export default async function MembershipPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const t = (key: string) => tServer(locale, key);

  const benefitDetails = locale === "en" ? [
    { title: "Hospital Discount", desc: "10-30% discount on the total bill at any partner hospital simply by showing your digital membership card.", gradient: "from-emerald-500 to-green-600" },
    { title: "Diagnostic Test Off", desc: "10-30% discount on all pathological and imaging tests including blood tests and X-rays.", gradient: "from-blue-500 to-cyan-600" },
    { title: "Model Pharmacy Offer", desc: "Get 5% to 10% discount on purchasing medicines from designated partner pharmacies.", gradient: "from-violet-500 to-purple-600" },
    { title: "Free Health Camps", desc: "Access to regularly organized free diabetes checkups, eye camps, and blood pressure tests.", gradient: "from-rose-500 to-pink-600" },
    { title: "1 Year Founding Status", desc: "Membership is completely free for 1 year for the first 100 founding members.", gradient: "from-amber-500 to-orange-600" }
  ] : [
    { title: "হাসপাতাল ডিসকাউন্ট", desc: "যেকোনো অংশীদার হাসপাতালে শুধু ডিজিটাল মেম্বার কার্ড প্রদর্শন করে বিলের উপর ১০-৩০% ডিসকাউন্ট।", gradient: "from-emerald-500 to-green-600" },
    { title: "ডায়াগনস্টিক টেস্ট ছাড়", desc: "রক্ত পরীক্ষা, এক্স-রে সহ সকল প্যাথলজিক্যাল ও ইমেজিং পরীক্ষায় ১০-৩০% ডিসকাউন্ট।", gradient: "from-blue-500 to-cyan-600" },
    { title: "মডেল ফার্মেসি অফার", desc: "নির্ধারিত পার্টনার ফার্মেসিগুলো থেকে প্রয়োজনীয় ঔষধ ক্রয়ের ক্ষেত্রে ৫% থেকে ১০% ডিসকাউন্ট।", gradient: "from-violet-500 to-purple-600" },
    { title: "ফ্রি স্বাস্থ্য ক্যাম্প", desc: "নিয়মিত আয়োজিত ফ্রি ডায়াবেটিস চেকআপ, আই ক্যাম্প এবং রক্তচাপ পরীক্ষা।", gradient: "from-rose-500 to-pink-600" },
    { title: "১ বছর প্রতিষ্ঠাতা স্ট্যাটাস", desc: "প্রথম ১০০ ফাউন্ডিং মেম্বারদের জন্য মেম্বারশিপ ১ বছরের জন্য সম্পূর্ণ ফ্রি।", gradient: "from-amber-500 to-orange-600" }
  ];

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
          "name": locale === "en" ? "Membership" : "মেম্বারশিপ",
          "item": "https://healthclubfeni.vercel.app/membership"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Health Club Membership Card",
      "description": "Digital health discount membership card offering 10% to 30% discount at partner hospitals, diagnostic centers, and pharmacies.",
      "brand": {
        "@type": "Brand",
        "name": "Health Club"
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Founding Member (First 100 Users)",
          "price": "0",
          "priceCurrency": "BDT",
          "availability": "https://schema.org/InStock",
          "url": "https://healthclubfeni.vercel.app/membership"
        },
        {
          "@type": "Offer",
          "name": "Premium Member Annual Plan",
          "price": "500",
          "priceCurrency": "BDT",
          "availability": "https://schema.org/InStock",
          "url": "https://healthclubfeni.vercel.app/membership"
        }
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <JsonLd data={jsonLdData} />

      {/* Page Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-light/50 via-emerald-50/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background py-8 sm:py-20 border-b border-border/60">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-32 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #16a34a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-2 sm:space-y-4">
          <span className="section-label">{t("membership.page.plansDetails")}</span>
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white mt-2">
            {t("membership.page.affordableHealthcareMembershipPlans")}
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground max-w-xl mx-auto">
            {t("membership.page.chooseTheRightPlanThat")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-20 space-y-10 sm:space-y-20">

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch max-w-3xl mx-auto">

          {/* Founding Member */}
          <div className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background dark:from-primary/15 dark:via-primary/8 dark:to-slate-900 border-2 border-primary rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-xl ring-4 ring-primary/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-3xl" />
            <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
              {t("membership.page.limitedOffer")}
            </div>
            <div className="relative space-y-6">
              <div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                  <Star className="h-5 w-5 text-primary fill-primary/20" />
                </div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">{t("membership.page.foundingMember")}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("membership.page.theFirst100MembersWill")}</p>
              </div>
              <div className="flex items-baseline gap-2 text-secondary dark:text-white">
                <span className="text-5xl font-extrabold font-mono">{t("membership.page.0")}</span>
                <span className="text-sm text-muted-foreground font-semibold">{t("membership.page.1YearFree")}</span>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  t("membership.page.coverageForTheMemberFamily"),
                  t("membership.page.1YearMembership"),
                  t("membership.page.discountsAtAllPartnerHospitals"),
                  t("membership.page.digitalMembershipCardVerifiedQr"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-secondary/80 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative pt-8">
              <Link href="/register">
                <Button size="lg" className="w-full">
                  {t("membership.page.joinForFree")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Premium */}
          <div className="bg-background dark:bg-slate-900 border border-border rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-md hover-lift">
            <div className="space-y-6">
              <div>
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <ShieldCheck className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">{t("membership.page.premiumMembership")}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("membership.page.annualCardAndBenefitsFor")}</p>
              </div>
              <div className="flex items-baseline gap-2 text-secondary dark:text-white">
                <span className="text-5xl font-extrabold font-mono">{t("membership.page.500")}</span>
                <span className="text-sm text-muted-foreground font-semibold">{t("membership.page.annualSubscription")}</span>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  t("membership.page.coverageForTheMemberFamily"),
                  t("membership.page.renewalOnAnAnnualBasis"),
                  t("membership.page.discountsAtAllPartnerHospitals"),
                  t("membership.page.digitalMembershipCardVerifiedQr"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8">
              <Link href="/register?plan=premium">
                <Button variant="outline" size="lg" className="w-full">
                  {t("membership.page.buyPlan")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

        </div>

        {/* Detailed Benefits Grid */}
        <div className="space-y-10 border-t border-border/60 pt-16">
          <div className="text-center space-y-3">
            <span className="section-label">{t("membership.page.detailedMembershipBenefits")}</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary dark:text-white mt-3">
              {t("membership.page.allOfOurMembershipPlans")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {benefitDetails.map((benefit, index) => (
              <div key={index} className="group flex gap-4 p-6 rounded-2xl border border-border/80 bg-background dark:bg-slate-900 hover:border-primary/20 hover-lift shadow-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/3 group-hover:to-transparent transition-all duration-500 rounded-2xl" />
                <div className={`relative h-10 w-10 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                  <Check className="h-4.5 w-4.5 text-white" />
                </div>
                <div className="relative">
                  <h4 className="font-heading font-bold text-secondary dark:text-white text-base">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
