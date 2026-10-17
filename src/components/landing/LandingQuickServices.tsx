import Link from "next/link";
import {
  ArrowRight,
  Stethoscope,
  Heart,
  Truck,
  PhoneCall,
  Siren,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, toBanglaNums } from "@/lib/utils";
import HospitalDoctorQuickLinks from "@/components/consultants/HospitalDoctorQuickLinks";

interface LandingQuickServicesProps {
  doctorCount?: number;
  bloodDonorCount?: number;
  ambulanceCount?: number;
}

export function LandingQuickServices({
  doctorCount = 0,
  bloodDonorCount = 0,
  ambulanceCount = 0,
}: LandingQuickServicesProps) {
  const services = [
    {
      id: "doctor",
      badge: "বিশেষজ্ঞ চিকিৎসক",
      countBadge:
        doctorCount > 0
          ? `${toBanglaNums(doctorCount)}+ ডাক্তার`
          : "ভেরিফাইড",
      title: "ডাক্তার ও চেম্বার শিডিউল",
      description: "ফেনীর শীর্ষ বিশেষজ্ঞ ডাক্তারদের তালিকা, ভিজিটিং আওয়ার ও সরাসরি সিরিয়াল বুকিং হেল্পলাইন।",
      actionText: "ডাক্তার খুঁজুন",
      href: "/consultants",
      icon: Stethoscope,
      color: {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/20 hover:border-emerald-500/40",
        badgeBg: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
        btnHover: "hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600",
        topBorder: "via-emerald-500",
      },
    },
    {
      id: "blood",
      badge: "স্বেচ্ছাসেবী রক্তদাতা",
      countBadge:
        bloodDonorCount > 0
          ? `${toBanglaNums(bloodDonorCount)}+ রক্তদাতা`
          : "সব গ্রুপ",
      title: "জরুরি রক্তদাতা খুঁজুন",
      description: "A+, B+, O+, AB+ সহ সকল গ্রুপের ভেরিফাইড রক্তদাতাদের সাথে তাৎক্ষণিক যোগাযোগের তালিকা।",
      actionText: "রক্তদাতা খুঁজুন",
      href: "/emergency/blood-donors",
      icon: Heart,
      color: {
        bg: "bg-rose-500/10 dark:bg-rose-500/15",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-500/20 hover:border-rose-500/40",
        badgeBg: "bg-rose-500/15 text-rose-800 dark:text-rose-300",
        btnHover: "hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600",
        topBorder: "via-rose-500",
      },
    },
    {
      id: "ambulance",
      badge: "২৪/৭ অ্যাম্বুলেন্স",
      countBadge:
        ambulanceCount > 0
          ? `${toBanglaNums(ambulanceCount)}+ অ্যাম্বুলেন্স`
          : "২৪/৭ প্রস্তুত",
      title: "জরুরি অ্যাম্বুলেন্স সেবা",
      description: "ফেনী জেলা ও ঢাকা-চট্টগ্রাম রুটে জরুরি এসি, নন-এসি ও আইসিইউ (ICU) অ্যাম্বুলেন্স সার্ভিস।",
      actionText: "অ্যাম্বুলেন্স খুঁজুন",
      href: "/emergency/ambulances",
      icon: Truck,
      color: {
        bg: "bg-sky-500/10 dark:bg-sky-500/15",
        text: "text-sky-600 dark:text-sky-400",
        border: "border-sky-500/20 hover:border-sky-500/40",
        badgeBg: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
        btnHover: "hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600",
        topBorder: "via-sky-500",
      },
    },
    {
      id: "hotline",
      badge: "জরুরি হটলাইন",
      countBadge: "হটলাইন ও অক্সিজেন",
      title: "হাসপাতাল ও অক্সিজেন সেবা",
      description: "ফেনী সদর হাসপাতাল ইমার্জেন্সি, জরুরি অক্সিজেন সিলিন্ডার হোম ডেলিভারি ও রেড ক্রিসেন্ট হেল্পলাইন।",
      actionText: "জরুরি সেবা দেখুন",
      href: "/emergency/hotlines",
      icon: PhoneCall,
      color: {
        bg: "bg-amber-500/10 dark:bg-amber-500/15",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20 hover:border-amber-500/40",
        badgeBg: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
        btnHover: "hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600",
        topBorder: "via-amber-500",
      },
    },
  ];

  return (
    <section
      aria-labelledby="services-hub-heading"
      itemScope
      itemType="https://schema.org/MedicalWebPage"
      className="py-10 sm:py-16 bg-muted/20 dark:bg-slate-950/40 border-b border-border/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-2.5 sm:space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-xs font-bold uppercase tracking-wider">
            <Siren className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>২৪/৭ জরুরি ও প্রয়োজনীয় সেবা</span>
          </div>
          <h2
            id="services-hub-heading"
            itemProp="headline"
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-secondary dark:text-white tracking-tight"
          >
            ফেনীর জরুরি স্বাস্থ্য সেবা ও ডিরেক্টরি
          </h2>
          <p
            itemProp="description"
            className="text-xs sm:text-base text-muted-foreground leading-relaxed"
          >
            জরুরি প্রয়োজনে যেকোনো সময় বিশেষজ্ঞ ডাক্তার, রক্তদাতা, অ্যাম্বুলেন্স ও হাসপাতালের হেল্পলাইনে সরাসরি যোগাযোগ করুন।
          </p>
        </div>

        {/* 4 Cards Grid - Mobile First */}
        <div
          itemScope
          itemType="https://schema.org/ItemList"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <article
                key={item.id}
                itemScope
                itemProp="itemListElement"
                itemType="https://schema.org/MedicalBusiness"
                className={cn(
                  "relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-card border transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 overflow-hidden group",
                  item.color.border
                )}
              >
                <meta itemProp="position" content={String(idx + 1)} />
                <meta itemProp="name" content={item.title} />
                <meta itemProp="serviceType" content={item.badge} />
                <meta itemProp="areaServed" content="Feni, Bangladesh" />
                <meta itemProp="isAccessibleForFree" content="true" />

                {/* Subtle top indicator line */}
                <div
                  className={cn(
                    "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent opacity-80",
                    item.color.topBorder
                  )}
                />

                <div className="space-y-4">
                  {/* Top Header: Icon + Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                        item.color.bg,
                        item.color.text
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={cn(
                        "text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full",
                        item.color.badgeBg
                      )}
                    >
                      {item.countBadge}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-1.5">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-secondary dark:text-white group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-6 mt-2 border-t border-border/40">
                  <Link
                    href={item.href}
                    title={`${item.title} - Health Club Feni`}
                    aria-label={`${item.title} - ${item.actionText}`}
                    itemProp="url"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "w-full justify-between rounded-xl font-semibold text-xs sm:text-sm h-10 px-4 transition-all duration-200 border-border/80 group-hover:border-primary/40",
                      item.color.btnHover
                    )}
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Doctors by Hospital Hub - Capture Hospital-Wise Search Intent */}
        <div className="pt-2 sm:pt-4 border-t border-border/40">
          <HospitalDoctorQuickLinks variant="landing" />
        </div>

        {/* Local Intent Quick Search Cluster */}
        <div className="pt-2 sm:pt-4 border-t border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-xs sm:text-sm font-bold text-secondary dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              ফেনীর জনপ্রিয় স্বাস্থ্য সেবা ও ডাক্তার ডিপার্টমেন্ট
            </h3>
            <span className="text-xs text-muted-foreground">সরাসরি চেম্বার তথ্য ও মেম্বার ছাড়</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {[
              { href: "/consultants/department/dental", label: "🦷 ডেন্টাল ও দাঁতের ডাক্তার", badge: "সিরিয়াল ও চেম্বার" },
              { href: "/partner-hospitals/category/diagnostic", label: "🔬 ডায়াগনস্টিক ও ল্যাব টেস্ট", badge: "১০-৩০% ছাড়" },
              { href: "/partner-hospitals/category/hospital", label: "🏥 পার্টনার হাসপাতাল", badge: "কেবিন ও ভর্তি ছাড়" },
              { href: "/consultants/department/medicine", label: "🩺 মেডিসিন বিশেষজ্ঞ", badge: "চেম্বার শিডিউল" },
              { href: "/consultants/department/gynecology", label: "🤰 গাইনী ও প্রসূতি বিশেষজ্ঞ", badge: "লেডি ডাক্তার" },
              { href: "/consultants/department/pediatrics", label: "👶 শিশু বিশেষজ্ঞ", badge: "ফেনী সদর" },
              { href: "/consultants/department/orthopedics", label: "🦴 অর্থোপেডিক সার্জন", badge: "হাড় ও জয়েন্ট" },
              { href: "/emergency/ambulances", label: "🚑 ফেনী অ্যাম্বুলেন্স", badge: "২৪/৭ জরুরি" },
            ].map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-card hover:bg-primary/10 border border-border/80 hover:border-primary/40 text-foreground transition-all duration-200 shadow-xs hover:shadow-sm group"
              >
                <span>{topic.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors font-semibold">
                  {topic.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Public Service Guarantee Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-1 text-xs sm:text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>সম্পূর্ণ ফ্রি জনসেবা ডিরেক্টরি</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>যাচাইকৃত যোগাযোগ নম্বর</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <PhoneCall className="h-4 w-4 text-primary shrink-0" />
            <span>সরাসরি ওয়ান-ট্যাপ কলিং</span>
          </div>
        </div>
      </div>
    </section>
  );
}
