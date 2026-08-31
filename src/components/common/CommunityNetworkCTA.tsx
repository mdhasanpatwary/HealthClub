"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Heart, Building2, PhoneCall, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { BloodDonorRegisterDialog } from "@/app/emergency/components/BloodDonorRegisterDialog";
import { AmbulanceRegisterDialog } from "@/app/emergency/components/AmbulanceRegisterDialog";
import { toBanglaNums } from "@/lib/utils";

interface CommunityNetworkCTAProps {
  hotline?: string;
}

export default function CommunityNetworkCTA({ hotline }: CommunityNetworkCTAProps) {
  const { t, locale } = useLanguage();
  const isEn = locale === "en";

  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false);

  const rawHotline = (hotline || process.env.NEXT_PUBLIC_HOTLINE_PHONE || "01886763849").replace(/[^0-9]/g, "");
  const normalizedHotline = rawHotline.replace(/^(880|88|0)/, "");
  const hotlineTel = `+880${normalizedHotline}`;
  const hotlineDisplay = isEn
    ? `+880 ${normalizedHotline}`
    : toBanglaNums(`+880 ${normalizedHotline}`);

  return (
    <section
      aria-labelledby="community-network-heading"
      className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pt-6"
    >
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto px-4">
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          {t("communityCTA.badge")}
        </Badge>
        <h2
          id="community-network-heading"
          className="font-heading text-xl sm:text-3xl md:text-4xl font-bold text-secondary dark:text-white"
        >
          {t("communityCTA.title")}
        </h2>
        <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
          {t("communityCTA.desc")}
        </p>
      </div>

      {/* 3 Dedicated Pathway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-4">
        {/* 1. Ambulance Operators */}
        <Card className="border border-border/80 bg-gradient-to-b from-primary/5 via-card to-card hover:border-primary/40 hover:shadow-md transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden">
          <CardContent className="p-5 sm:p-6 space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                  <Truck className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-2xs font-bold text-primary border-primary/30">
                  {t("communityCTA.ambulance.badge")}
                </Badge>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-secondary dark:text-white">
                  {t("communityCTA.ambulance.title")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t("communityCTA.ambulance.desc")}
                </p>
              </div>

              <ul className="text-2xs sm:text-xs text-muted-foreground space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{t("communityCTA.ambulance.feature1")}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{t("communityCTA.ambulance.feature2")}</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setIsAmbulanceModalOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl mt-2 cursor-pointer"
            >
              <Truck className="mr-2 h-4 w-4" />
              {t("communityCTA.ambulance.btn")}
            </Button>
          </CardContent>
        </Card>

        {/* 2. Blood Donors & Clubs */}
        <Card className="border border-border/80 bg-gradient-to-b from-rose-500/5 via-card to-card hover:border-rose-500/40 hover:shadow-md transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden">
          <CardContent className="p-5 sm:p-6 space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center shadow-2xs">
                  <Heart className="h-6 w-6 fill-rose-500/20" />
                </div>
                <Badge variant="outline" className="text-2xs font-bold text-rose-600 border-rose-500/30">
                  {t("communityCTA.donor.badge")}
                </Badge>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-secondary dark:text-white">
                  {t("communityCTA.donor.title")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t("communityCTA.donor.desc")}
                </p>
              </div>

              <ul className="text-2xs sm:text-xs text-muted-foreground space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>{t("communityCTA.donor.feature1")}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>{t("communityCTA.donor.feature2")}</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setIsDonorModalOpen(true)}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl mt-2 cursor-pointer"
            >
              <Heart className="mr-2 h-4 w-4 fill-white" />
              {t("communityCTA.donor.btn")}
            </Button>
          </CardContent>
        </Card>

        {/* 3. Healthcare Providers & Partners */}
        <Card className="border border-border/80 bg-gradient-to-b from-blue-500/5 via-card to-card hover:border-blue-500/40 hover:shadow-md transition-all duration-300 rounded-3xl flex flex-col justify-between overflow-hidden">
          <CardContent className="p-5 sm:p-6 space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shadow-2xs">
                  <Building2 className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-2xs font-bold text-blue-600 border-blue-500/30">
                  {t("communityCTA.partner.badge")}
                </Badge>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-secondary dark:text-white">
                  {t("communityCTA.partner.title")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t("communityCTA.partner.desc")}
                </p>
              </div>

              <ul className="text-2xs sm:text-xs text-muted-foreground space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>{t("communityCTA.partner.feature1")}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>{t("communityCTA.partner.feature2")}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/become-partner"
              className={buttonVariants({
                variant: "outline",
                className: "w-full border-blue-500/30 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold rounded-xl mt-2",
              })}
            >
              <span>{t("communityCTA.partner.btn")}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Support & Direct Inquiries Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-muted/60 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mx-4">
        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm font-bold text-secondary dark:text-white">
            {t("communityCTA.help.title")}
          </p>
          <p className="text-2xs sm:text-xs text-muted-foreground">
            {t("communityCTA.help.desc")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${hotlineTel}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>{hotlineDisplay}</span>
          </a>
          <Link
            href="/contact"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "text-xs font-semibold rounded-xl",
            })}
          >
            {t("communityCTA.help.contactBtn")}
          </Link>
        </div>
      </div>

      {/* Modals */}
      <BloodDonorRegisterDialog open={isDonorModalOpen} onOpenChange={setIsDonorModalOpen} />
      <AmbulanceRegisterDialog open={isAmbulanceModalOpen} onOpenChange={setIsAmbulanceModalOpen} />
    </section>
  );
}

