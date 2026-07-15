import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { Locale, tServer } from "@/lib/i18n";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  return {
    title: locale === "en" ? "Membership Plans - Health Club" : "মেম্বারশিপ প্ল্যান - হেলথ ক্লাব",
    description: locale === "en"
      ? "Check out our membership plans to find the right one for you and start saving on medical bills."
      : "আমাদের মেম্বারশিপ প্ল্যান দেখে আপনার জন্য উপযুক্ত প্ল্যানটি বেছে নিন এবং চিকিৎসা ব্যয় সাশ্রয় করা শুরু করুন।"
  };
}

export default async function MembershipPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const t = (key: string) => tServer(locale, key);

  const benefitDetails = locale === "en" ? [
    { title: "Hospital Discount", desc: "Flat 10% discount on the total bill at any partner hospital simply by showing your digital membership card." },
    { title: "Diagnostic Test Off", desc: "Flat 10% discount on all pathological and imaging tests including blood tests and X-rays." },
    { title: "Model Pharmacy Offer", desc: "Flat 10% direct discount on purchasing essential medicines from designated partner pharmacies." },
    { title: "Family Savings", desc: "Family plans allow up to 4 family members to get individual membership cards with the same discount benefits." },
    { title: "Free Health Camps", desc: "Access to regularly organized free diabetes checkups, eye camps, and blood pressure tests." },
    { title: "1 Year Founding Status", desc: "Membership is completely free for 1 year for the first 100 founding members." }
  ] : [
    { title: "হাসপাতাল ডিসকাউন্ট", desc: "যেকোনো অংশীদার হাসপাতালে শুধু ডিজিটাল মেম্বার কার্ড প্রদর্শন করে বিলের উপর ফ্ল্যাট ১০% ডিসকাউন্ট।" },
    { title: "ডায়াগনস্টিক টেস্ট ছাড়", desc: "রক্ত পরীক্ষা, এক্স-রে সহ সকল প্যাথলজিক্যাল ও ইমেজিং পরীক্ষায় ফ্ল্যাট ১০% ডিসকাউন্ট।" },
    { title: "মডেল ফার্মেসী অফার", desc: "নির্ধারিত পার্টনার ফার্মেসীগুলো থেকে প্রয়োজনীয় ঔষধ ক্রয়ের ক্ষেত্রে সরাসরি ফ্ল্যাট ১০% ডিসকাউন্ট।" },
    { title: "পারিবারিক সাশ্রয়", desc: "ফ্যামিলি প্ল্যানের মাধ্যমে পরিবারের ৪ জন সদস্যের আলাদা মেম্বারশিপ কার্ড ও একই ছাড় সুবিধা।" },
    { title: "ফ্রি স্বাস্থ্য ক্যাম্প", desc: "নিয়মিত আয়োজিত ফ্রি ডায়াবেটিস চেকআপ, আই ক্যাম্প এবং রক্তচাপ পরীক্ষা।" },
    { title: "১ বছর প্রতিষ্ঠাতা স্ট্যাটাস", desc: "প্রথম ১০০ ফাউন্ডিং মেম্বারদের জন্য মেম্বারশিপ ১ বছরের জন্য সম্পুর্ণ ফ্রী।" }
  ];

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">
            {t("membership.page.plansDetails")}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            {t("membership.page.affordableHealthcareMembershipPlans")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("membership.page.chooseTheRightPlanThat")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto">
          
          {/* Founding Member */}
          <div className="bg-gradient-to-b from-primary-light/50 to-background border-2 border-primary rounded-3xl p-8 relative flex flex-col justify-between shadow-xl ring-4 ring-primary/10">
            <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {t("membership.page.limitedOffer")}
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-secondary">Founding Member</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("membership.page.theFirst100MembersWill")}
                </p>
              </div>
              <div className="flex items-baseline gap-1 text-secondary dark:text-white font-mono">
                <span className="text-4xl font-extrabold">{t("membership.page.0")}</span>
                <span className="text-xs text-muted-foreground font-semibold">
                  {t("membership.page.1YearFree")}
                </span>
              </div>
              <ul className="space-y-3 text-sm text-secondary/80">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("membership.page.coverageForTheMemberFamily")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("membership.page.1YearMembership")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("membership.page.discountsAtAllPartnerHospitals")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("membership.page.digitalMembershipCardVerifiedQr")}</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link href="/register">
                <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                  {t("membership.page.joinForFree")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Individual */}
          <div className="bg-background border border-border rounded-3xl p-8 flex flex-col justify-between shadow-md">
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">Individual Membership</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("membership.page.annualCardAndBenefitsFor")}
                </p>
              </div>
              <div className="flex items-baseline gap-1 text-secondary dark:text-white font-mono">
                <span className="text-4xl font-extrabold">{t("membership.page.500")}</span>
                <span className="text-xs text-muted-foreground font-semibold">
                  {t("membership.page.annualSubscription")}
                </span>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("membership.page.coverageForTheMemberFamily")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("membership.page.renewalOnAnAnnualBasis")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("membership.page.discountsAtAllPartnerHospitals")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t("membership.page.digitalMembershipCardVerifiedQr")}</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link href="/register?plan=individual">
                <Button variant="outline" className="w-full border-border hover:bg-muted text-secondary dark:text-white">
                  {t("membership.page.buyPlan")}
                </Button>
              </Link>
            </div>
          </div>

        </div>

        {/* Detailed Benefits List */}
        <div className="space-y-8 pt-8 border-t border-border">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary dark:text-white">
              {t("membership.page.detailedMembershipBenefits")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              {t("membership.page.allOfOurMembershipPlans")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefitDetails.map((benefit, index) => (
              <div key={index} className="flex gap-3.5 p-5 rounded-2xl border border-border bg-muted/30">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
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
