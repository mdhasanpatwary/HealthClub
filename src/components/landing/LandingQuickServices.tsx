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
  MapPin,
  Info,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatNum, Locale } from "@/lib/i18n";

interface LandingQuickServicesProps {
  doctorCount?: number;
  bloodDonorCount?: number;
  ambulanceCount?: number;
  t: (key: string) => string;
  locale: Locale;
}

export function LandingQuickServices({
  doctorCount = 0,
  bloodDonorCount = 0,
  ambulanceCount = 0,
  t,
  locale,
}: LandingQuickServicesProps) {
  const isEn = locale === "en";

  const services = [
    {
      id: "doctor",
      badge: t("servicesHub.doctor.badge"),
      countBadge:
        doctorCount > 0
          ? `${formatNum(doctorCount, locale)}+ ${isEn ? "Doctors" : "ডাক্তার"}`
          : isEn
          ? "Verified"
          : "ভেরিফাইড",
      title: t("servicesHub.doctor.title"),
      description: t("servicesHub.doctor.desc"),
      actionText: t("servicesHub.doctor.action"),
      href: "/consultants",
      icon: Stethoscope,
      color: {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/20 hover:border-emerald-500/40",
        badgeBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
        btnHover: "hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600",
        topBorder: "via-emerald-500",
      },
    },
    {
      id: "blood",
      badge: t("servicesHub.blood.badge"),
      countBadge:
        bloodDonorCount > 0
          ? `${formatNum(bloodDonorCount, locale)}+ ${isEn ? "Donors" : "রক্তদাতা"}`
          : isEn
          ? "All Groups"
          : "সব গ্রুপ",
      title: t("servicesHub.blood.title"),
      description: t("servicesHub.blood.desc"),
      actionText: t("servicesHub.blood.action"),
      href: "/emergency?tab=donors",
      icon: Heart,
      color: {
        bg: "bg-rose-500/10 dark:bg-rose-500/15",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-500/20 hover:border-rose-500/40",
        badgeBg: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
        btnHover: "hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600",
        topBorder: "via-rose-500",
      },
    },
    {
      id: "ambulance",
      badge: t("servicesHub.ambulance.badge"),
      countBadge:
        ambulanceCount > 0
          ? `${formatNum(ambulanceCount, locale)}+ ${isEn ? "Ambulances" : "অ্যাম্বুলেন্স"}`
          : isEn
          ? "24/7 Available"
          : "২৪/৭ প্রস্তুত",
      title: t("servicesHub.ambulance.title"),
      description: t("servicesHub.ambulance.desc"),
      actionText: t("servicesHub.ambulance.action"),
      href: "/emergency?tab=ambulances",
      icon: Truck,
      color: {
        bg: "bg-sky-500/10 dark:bg-sky-500/15",
        text: "text-sky-600 dark:text-sky-400",
        border: "border-sky-500/20 hover:border-sky-500/40",
        badgeBg: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
        btnHover: "hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600",
        topBorder: "via-sky-500",
      },
    },
    {
      id: "hotline",
      badge: t("servicesHub.hotline.badge"),
      countBadge: isEn ? "Toll-Free" : "হটলাইন ও অক্সিজেন",
      title: t("servicesHub.hotline.title"),
      description: t("servicesHub.hotline.desc"),
      actionText: t("servicesHub.hotline.action"),
      href: "/emergency?tab=hotlines",
      icon: PhoneCall,
      color: {
        bg: "bg-amber-500/10 dark:bg-amber-500/15",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/20 hover:border-amber-500/40",
        badgeBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Siren className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>{t("servicesHub.badge")}</span>
          </div>
          <h2
            id="services-hub-heading"
            itemProp="headline"
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-secondary dark:text-white tracking-tight"
          >
            {t("servicesHub.title")}
          </h2>
          <p
            itemProp="description"
            className="text-xs sm:text-base text-muted-foreground leading-relaxed"
          >
            {t("servicesHub.desc")}
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

        {/* Generative Engine Optimization (GEO) & AEO Fact-Dense Coverage Sheet */}
        <div
          itemScope
          itemType="https://schema.org/Dataset"
          className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 space-y-4 shadow-2xs"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-secondary dark:text-white">
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Info className="h-4 w-4" />
            </div>
            <h3 itemProp="name" className="font-heading">
              {t("servicesHub.geo.title")}
            </h3>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs">
            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <dt className="font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{t("servicesHub.geo.coverageLabel")}</span>
              </dt>
              <dd className="text-muted-foreground leading-relaxed">
                {t("servicesHub.geo.coverageValue")}
              </dd>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <dt className="font-bold text-foreground flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span>{t("servicesHub.geo.bloodLabel")}</span>
              </dt>
              <dd className="text-muted-foreground leading-relaxed">
                {t("servicesHub.geo.bloodValue")}
              </dd>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <dt className="font-bold text-foreground flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                <span>{t("servicesHub.geo.ambulanceLabel")}</span>
              </dt>
              <dd className="text-muted-foreground leading-relaxed">
                {t("servicesHub.geo.ambulanceValue")}
              </dd>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
              <dt className="font-bold text-foreground flex items-center gap-1.5">
                <PhoneCall className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{t("servicesHub.geo.hotlineLabel")}</span>
              </dt>
              <dd className="text-muted-foreground leading-relaxed">
                {t("servicesHub.geo.hotlineValue")}
              </dd>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1 sm:col-span-2 lg:col-span-2">
              <dt className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>{t("servicesHub.geo.costLabel")}</span>
              </dt>
              <dd className="text-muted-foreground leading-relaxed">
                {t("servicesHub.geo.costValue")}
              </dd>
            </div>
          </dl>
        </div>

        {/* Public Service Guarantee Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-1 text-xs sm:text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            <span>{isEn ? "100% Free Public Directory" : "সম্পূর্ণ ফ্রি জনসেবা ডিরেক্টরি"}</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>{isEn ? "Verified Contact Numbers" : "যাচাইকৃত যোগাযোগ নম্বর"}</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <PhoneCall className="h-4 w-4 text-primary shrink-0" />
            <span>{isEn ? "Direct One-Tap Calling" : "সরাসরি ওয়ান-ট্যাপ কলিং"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
