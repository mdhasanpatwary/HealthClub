"use client";

import Image from "next/image";
import { Building2, MapPin, PhoneCall, Clock, Eye } from "lucide-react";
import { Partner, DepartmentDiscount } from "@/services/db";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface PartnerCardPreviewProps {
  partner: Partner;
  name: string;
  address: string;
  discount: string;
  emergencyPhone: string;
  workingHours: string;
  imageUrl: string;
  departmentDiscounts: DepartmentDiscount[];
}

export function PartnerCardPreview({
  partner,
  name,
  address,
  discount,
  emergencyPhone,
  workingHours,
  imageUrl,
  departmentDiscounts,
}: PartnerCardPreviewProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5 text-xs font-bold text-secondary dark:text-white uppercase tracking-wider px-1">
        <Eye className="h-4 w-4 text-primary" />
        {t("partner.profile.livePreview")}
      </div>

      <Card className="overflow-hidden rounded-3xl border-border bg-card shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Banner preview */}
        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name || "Hospital"}
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              unoptimized={imageUrl.startsWith("data:")}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center text-slate-500">
              <Building2 className="h-16 w-16 opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

          <div className="absolute top-3 right-3 z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
              {partner.category === "hospital" ? "হাসপাতাল" : partner.category === "diagnostic" ? "ডায়াগনস্টিক" : "ফার্মেসি"}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 z-10 space-y-1">
            <h3 className="font-heading text-base font-bold text-white line-clamp-1">
              {name || "হাসপাতালের নাম"}
            </h3>
            <p className="flex items-center gap-1 text-xs text-slate-300 line-clamp-1">
              <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
              <span>{address || "ঠিকানা"}</span>
            </p>
          </div>
        </div>

        {/* Preview Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-mono">ডিসকাউন্ট হার</p>
              <p className="text-base font-bold text-primary font-heading">{discount || "২০%"}</p>
            </div>
            {emergencyPhone && (
              <div className="text-right">
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 justify-end">
                  <PhoneCall className="h-3 w-3" /> জরুরি
                </p>
                <p className="text-xs font-bold text-secondary dark:text-white font-mono">{emergencyPhone}</p>
              </div>
            )}
          </div>

          {workingHours && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 p-2 rounded-xl">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{workingHours}</span>
            </div>
          )}

          {/* Department breakdown tags */}
          {departmentDiscounts.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">বিভাগভিত্তিক ছাড়:</p>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {departmentDiscounts.map((dept, i) => (
                  <span key={i} className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span>{dept.name}</span>
                    <strong className="font-mono font-bold">({dept.discount})</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
