import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  HelpCircle,
  FileCheck2,
  ArrowRight,
  Droplets,
  Scale,
  Calendar,
  Activity,
  PhoneCall,
  HeartHandshake,
  AlertCircle,
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import BloodDonorRegistrationForm from "./BloodDonorRegistrationForm";
import { WhatsAppIcon } from "@/components/ui/SocialBrandIcons";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { getWhatsAppUniversalUrl } from "@/lib/whatsapp";
import { toBanglaNums } from "@/lib/utils";
import {
  buildBloodDonorRegisterJsonLd,
  BLOOD_DONOR_REGISTER_FAQS,
} from "./bloodDonorRegisterSeo";

export const revalidate = false; // Pure static SSG

export async function generateMetadata(): Promise<Metadata> {
  const ogTitle = "স্বেচ্ছাসেবী রক্তদাতা নিবন্ধন ফরম | ফেনী ব্লাড ডোনার নেটওয়ার্ক - হেলথ ক্লাব";
  const ogDesc = "ফেনীর সকল উপজেলার রক্তদাতাদের জন্য ১০০% ফ্রি ও নিরাপদ রক্তদাতা তালিকাভুক্তি পোর্টাল। রক্তের গ্রুপ (A+, B+, AB+, O+) ও ফোন নম্বর যুক্ত করে মুমূর্ষু রোগীর পাশে দাঁড়ান।";
  const canonicalUrl = `${SITE_URL}/emergency/blood-donors/register`;

  return {
    title: "স্বেচ্ছাসেবী রক্তদাতা নিবন্ধন ফরম | ফেনী ব্লাড ডোনার নেটওয়ার্ক",
    description: "ফেনী সদর ও সকল উপজেলার রক্তদাতাদের জন্য ১০০% ফ্রি ব্লাড ডোনার তালিকাভুক্তি পোর্টাল। A+, B+, AB+, O+ গ্রুপের স্বেচ্ছাসেবী রক্তদাতাদের ফোন নম্বর ও এলাকা যুক্ত করুন।",
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      "blood donor registration feni",
      "ফেনী রক্তদাতা নিবন্ধন",
      "স্বেচ্ছাসেবী রক্তদাতা ফরম",
      "ব্লাড ডোনার ফেনী যুক্ত হন",
      "feni blood bank registration",
      "ফেনী রক্তের গ্রুপ তালিকা",
      "feni blood donor sign up",
      "ও নেগেটিভ রক্তদাতা ফেনী",
      "জরুরি রক্ত ফেনী",
      "health club blood donor join",
    ],
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonicalUrl,
      siteName: "হেলথ ক্লাব (Health Club)",
      type: "website",
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default async function BloodDonorRegistrationPage() {
  const contact = await getCachedContactSettings();
  const whatsappNumber = contact.whatsapp || "01886763849";
  const whatsappUrl = getWhatsAppUniversalUrl(
    whatsappNumber,
    "আমি ফেনীর একজন রক্তদাতা। হেলথ ক্লাব স্বেচ্ছাসেবী রক্তদাতা তালিকায় আমার নাম ও রক্তের গ্রুপ যুক্ত করতে চাই।"
  );
  const pageCanonicalUrl = `${SITE_URL}/emergency/blood-donors/register`;
  const jsonLdData = buildBloodDonorRegisterJsonLd(pageCanonicalUrl);

  return (
    <div className="bg-background min-h-screen py-8 sm:py-14">
      <JsonLd data={jsonLdData} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">হোম</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/emergency" className="hover:text-primary transition-colors">জরুরি সেবা</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/emergency/blood-donors" className="hover:text-rose-600 transition-colors">রক্তদাতা ডিরেক্টরি</Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-semibold">রক্তদাতা নিবন্ধন</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ফেনীর স্বেচ্ছাসেবী রক্তদাতাদের জন্য ১০০% ফ্রি ও মানবিক সেবা</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white tracking-tight">
            হেলথ ক্লাব স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্কে যুক্ত হোন
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি মুমূর্ষু রোগীর অমূল্য জীবন। ফেনী সদরসহ ৬টি উপজেলার যে কোনো আগ্রহী সুস্থ রক্তদাতা বিনামূল্যে নিবন্ধন করে জীবন বাঁচানোর মহৎ উদ্যোগে শরিক হতে পারেন।
          </p>
        </div>

        {/* Direct Answer Capsule (GEO Bottom Line Up Front) */}
        <div
          id="blood-donor-register-bluf"
          className="p-4 sm:p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 max-w-3xl mx-auto"
        >
          <p id="blood-donor-register-summary" className="text-xs sm:text-sm text-foreground/90 leading-relaxed text-center font-medium">
            <strong>সরাসরি উত্তর (BLUF):</strong> ১৮ থেকে ৬০ বছর বয়সী যেকোনো সুস্থ নারী ও পুরুষ (ওজন ন্যূনতম ৫০ কেজি এবং রক্তচাপ ও হিমোগ্লোবিন স্বাভাবিক) সম্পূর্ণ বিনামূল্যে হেলথ ক্লাব রক্তদাতা ডিরেক্টরিতে নাম ও রক্তের গ্রুপ (<strong>A+, B+, O+, AB+</strong> ইত্যাদি) তালিকাভুক্ত করতে পারেন। অনলাইন ফর্ম বা হোয়াটসঅ্যাপের মাধ্যমে তথ্য জমা দিলে প্রাথমিক যাচাইপূর্বক ফেনীর জরুরি রক্ত সংকট নিরসনে ডোনার তালিকায় যুক্ত করা হয়।
          </p>
        </div>

        {/* 3 Value Proposition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              ১০০% মানবিক ও ফ্রি সেবা
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              রক্তদাতা তালিকাভুক্তির জন্য কোনো প্রকার ফি বা বাণিজ্যিক চার্জ নেওয়া হয় না। এটি সম্পূর্ণ মানবকল্যাণমূলক উদ্যোগ।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              নিরাপদ ও নিয়ন্ত্রিত ডাটাবেজ
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              আপনার ফোন নম্বর শুধুমাত্র জীবন বাঁচানোর প্রয়োজনে রোগীর পরিবার ও হাসপাতালের জরুরি প্রয়োজনেই ব্যবহৃত হবে।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-2">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <PhoneCall className="h-5 w-5" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              উপজেলা অনুযায়ী সরাসরি কল
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              কোনো মধ্যস্বত্বভোগী দালাল নেই। ফেনীর যে কোনো হাসপাতালে সংকট দেখা দিলে রোগীর স্বজনরা সরাসরি আপনাকে ফোন করবেন।
            </p>
          </div>
        </div>

        {/* Alternative Fast-Track Option: WhatsApp Submission */}
        <div className="p-6 rounded-3xl bg-linear-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold text-xs">
              <FileCheck2 className="h-4 w-4" />
              <span>সহজ বিকল্প পদ্ধতি</span>
            </div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-secondary dark:text-white">
              ফর্ম পূরণের সময় নেই? রক্তের গ্রুপ ও নম্বর WhatsApp-এ পাঠান!
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              আপনার নাম, রক্তের গ্রুপ এবং বর্তমান ঠিকানা লিখে সরাসরি আমাদের অফিসিয়াল WhatsApp-এ একটি বার্তা পাঠিয়ে দিন। আমাদের সমন্বয়ক টিম তা সিস্টেমে যুক্ত করে নেবে।
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <WhatsAppIcon className="h-4 w-4 fill-white" />
            <span>WhatsApp-এ বার্তা পাঠান</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Medical Eligibility Checklist */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="text-center space-y-1.5">
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white">
              রক্তদানের ডাক্তারি যোগ্যতা ও স্বাস্থ্যগত শর্তাবলি
            </h2>
            <p className="text-xs text-muted-foreground">
              রক্তদাতা এবং রক্তগ্রহীতা উভয়ের সুস্বাস্থ্য নিশ্চিত করতে চিকিৎসকদের নির্ধারিত মানদণ্ড মেনে চলা জরুরি
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs sm:text-sm">
                <Calendar className="h-4 w-4" />
                <span>বয়স: ১৮ থেকে ৬০ বছর</span>
              </div>
              <p className="text-2xs sm:text-xs text-muted-foreground leading-relaxed">
                ১৮ বছর পূর্ণ হওয়া যেকোনো সুস্থ প্রাপ্তবয়স্ক নারী ও পুরুষ নিরাপদে রক্তদান করতে পারেন।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs sm:text-sm">
                <Scale className="h-4 w-4" />
                <span>ওজন: ন্যূনতম ৫০ কেজি</span>
              </div>
              <p className="text-2xs sm:text-xs text-muted-foreground leading-relaxed">
                রক্তদাতার শারীরিক ওজন ন্যূনতম ৫০ কেজি হতে হবে (নারীদের ক্ষেত্রে ৪৫-৫০ কেজি গ্রহণযোগ্য)।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs sm:text-sm">
                <Droplets className="h-4 w-4" />
                <span>সময় ব্যবধান: ৩-৪ মাস</span>
              </div>
              <p className="text-2xs sm:text-xs text-muted-foreground leading-relaxed">
                পুরুষদের প্রতি ৩ মাস (৯০ দিন) এবং নারীদের প্রতি ৪ মাস (১২০ দিন) পর পর রক্তদান নিরাপদ।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs sm:text-sm">
                <Activity className="h-4 w-4" />
                <span>স্বাভাবিক হিমোগ্লোবিন ও প্রেশার</span>
              </div>
              <p className="text-2xs sm:text-xs text-muted-foreground leading-relaxed">
                হিমোগ্লোবিন ন্যূনতম ১২.০ g/dL এবং রক্তচাপ ও পালস স্বাভাবিক সীমায় থাকা আবশ্যক।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs sm:text-sm">
                <Heart className="h-4 w-4" />
                <span>সংক্রামক ব্যাধিমুক্ত থাকা</span>
              </div>
              <p className="text-2xs sm:text-xs text-muted-foreground leading-relaxed">
                হেপাটাইটিস বি/সি, এইডস বা সংক্রামক জন্ডিসমুক্ত সুস্থ শরীর হওয়া বাধ্যতামূলক।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-xs sm:text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>অস্থায়ী বিরতি ও সতর্কতা</span>
              </div>
              <p className="text-2xs sm:text-xs text-muted-foreground leading-relaxed">
                গত ৬ মাসে বড় সার্জারি বা টাইফয়েড/ম্যালেরিয়া আক্রান্ত হয়ে থাকলে সম্পূর্ণ সুস্থ না হওয়া পর্যন্ত বিরত থাকুন।
              </p>
            </div>
          </div>
        </div>

        {/* 3 Step Timeline */}
        <div className="space-y-4 max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white">
            কীভাবে আপনার নাম রক্তদাতা তালিকায় যুক্ত হবে?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-bold text-rose-600 font-mono">ধাপ ১</span>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">তথ্য প্রদান</h3>
              <p className="text-2xs sm:text-xs text-muted-foreground">
                নিচের ফর্মে নাম, রক্তের গ্রুপ, মোবাইল নম্বর ও আপনার বর্তমান উপজেলার নাম দিন।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-bold text-rose-600 font-mono">ধাপ ২</span>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">প্রাথমিক যাচাই</h3>
              <p className="text-2xs sm:text-xs text-muted-foreground">
                আমাদের স্বেচ্ছাসেবী সমন্বয়ক টিম ফোন করে আপনার রক্তের গ্রুপ ও তথ্য যাচাই করে নেবে।
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <span className="text-xs font-bold text-rose-600 font-mono">ধাপ ৩</span>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">ডিরেক্টরিতে প্রকাশ</h3>
              <p className="text-2xs sm:text-xs text-muted-foreground">
                ২৪ ঘণ্টার মধ্যে হেলথ ক্লাব রক্তদাতা পোর্টালে আপনার তথ্য উন্মুক্ত হবে।
              </p>
            </div>
          </div>
        </div>

        {/* Main Registration Form */}
        <div className="max-w-3xl mx-auto">
          <BloodDonorRegistrationForm />
        </div>

        {/* Strict Donor Privacy & Security Disclosure */}
        <div className="p-6 rounded-3xl bg-linear-to-r from-rose-500/10 via-card to-background border border-rose-500/20 max-w-3xl mx-auto space-y-3">
          <div className="flex items-center gap-2.5 text-rose-600 font-bold text-sm sm:text-base">
            <HeartHandshake className="h-5 w-5" />
            <span>রক্তদাতার গোপনীয়তা রক্ষা ও নিরাপত্তা অঙ্গীকার</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            হেলথ ক্লাব রক্তদাতাদের ব্যক্তিগত তথ্য কঠোর সুরক্ষায় রাখে। আপনার মোবাইল নম্বর শুধুমাত্র মুমূর্ষু রোগীর জরুরি রক্তের প্রয়োজনে সেবাগ্রহীতা ও হাসপাতাল কর্তৃপক্ষের যোগাযোগের উদ্দেশ্যে সংরক্ষিত থাকে। কোনো বাণিজ্যিক প্রচারণা, বিজ্ঞাপন বা অসঙ্গত কাজে রক্তদাতার নম্বর দেওয়া হয় না। প্রয়োজনে যে কোনো সময় আপনি নিজের প্রোফাইল নিষ্ক্রিয় করতে পারবেন।
          </p>
        </div>

        {/* AEO FAQ Section */}
        <div id="blood-donor-reg-faq" className="space-y-4 max-w-3xl mx-auto pt-6 border-t border-border/80">
          <div className="text-center space-y-1.5">
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-secondary dark:text-white">
              সাধারণ জিজ্ঞাসা (Frequently Asked Questions)
            </h2>
            <p className="text-xs text-muted-foreground">
              স্বেচ্ছাসেবী রক্তদান ও হেলথ ক্লাব ডোনার নেটওয়ার্ক সম্পর্কিত প্রয়োজনীয় তথ্য
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {BLOOD_DONOR_REGISTER_FAQS.map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 space-y-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-foreground">
                  প্রশ্ন: {faq.question}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  উত্তর: {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Assistance Help Box */}
        <div className="p-5 rounded-2xl bg-muted/40 border border-border/80 text-center space-y-2 max-w-xl mx-auto">
          <HelpCircle className="h-6 w-6 text-rose-600 mx-auto" />
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            কোনো তথ্যের জন্য সহায়তার প্রয়োজন?
          </h3>
          <p className="text-xs text-muted-foreground">
            আমাদের জরুরি সমন্বয়ক টিমের সাথে সরাসরি কথা বলতে কল করুন:{" "}
            <a href={`tel:${contact.hotline || "01886763849"}`} className="font-bold text-rose-600 hover:underline">
              {toBanglaNums(contact.hotline || "01886763849")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
