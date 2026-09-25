"use client";

import Link from "next/link";
import {
  Phone,
  PhoneCall,
  Truck,
  MapPin,
  Clock,
  Navigation,
  Share2,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Partner } from "@/services/db";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDiscount } from "@/lib/utils";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/siteConfig";
import { trackEvent } from "@/lib/analytics";
import HospitalSocialLinks from "./HospitalSocialLinks";

interface HospitalContactSidebarProps {
  partner: Partner;
  relatedPartners?: Partner[];
}

export default function HospitalContactSidebar({
  partner,
  relatedPartners = [],
}: HospitalContactSidebarProps) {
  const isPharmacy = partner.category === "pharmacy";
  const isDiagnostic = partner.category === "diagnostic";

  const getMapUrl = () => {
    if (partner.mapLink) return partner.mapLink;
    const query = `${partner.name}, ${partner.address}, Feni`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const deskTitle = isPharmacy
    ? "ফার্মেসি কাউন্টারে যোগাযোগ"
    : isDiagnostic
    ? "ডায়াগনস্টিক সেন্টারে যোগাযোগ"
    : "হাসপাতাল ডেস্কে যোগাযোগ";

  const callBtnLabel = isPharmacy
    ? "ফার্মেসিতে কল করুন"
    : isDiagnostic
    ? "ডায়াগনস্টিকে কল করুন"
    : "হাসপাতালে কল করুন";

  const handleShare = async () => {
    const profileUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `${SITE_URL}/partner-hospitals/${encodeURIComponent(partner.slug || partner.id)}`;
    const shareTitle = `${partner.name} - হেলথ ক্লাব পার্টনার`;
    const shareText = `${partner.name}, ${partner.address}। ডিসকাউন্ট: ${partner.discount}। হেল্পলাইন: ${partner.phone}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: profileUrl,
        });
        return;
      } catch {
        // user cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(profileUrl);
      const copiedMsg = isPharmacy
        ? "ফার্মেসি প্রোফাইলের লিংক ক্লিপবোর্ডে কপি করা হয়েছে!"
        : isDiagnostic
        ? "ডায়াগনস্টিক প্রোফাইলের লিংক ক্লিপবোর্ডে কপি করা হয়েছে!"
        : "হাসপাতাল প্রোফাইলের লিংক ক্লিপবোর্ডে কপি করা হয়েছে!";
      toast.success(copiedMsg);
    } catch {
      toast.error("লিংক কপি করা যায়নি।");
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Action & Contact Card */}
      <Card className="p-4 sm:p-5 rounded-3xl border-border/80 bg-background dark:bg-slate-900/90 shadow-sm space-y-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono">
            সরাসরি যোগাযোগ
          </span>
          <h3 className="text-base font-bold text-secondary dark:text-white font-heading mt-0.5">
            {deskTitle}
          </h3>
        </div>

        {/* Primary Call Button */}
        <div className="space-y-2">
          <a
            href={`tel:${partner.phone}`}
            onClick={() => {
              trackEvent("hospital_contact_click", {
                partner_id: partner.id,
                partner_name: partner.name,
                upazila: partner.upazila,
                phone: partner.phone,
              });
            }}
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "w-full h-11 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm cursor-pointer",
            })}
          >
            <Phone className="h-4 w-4 mr-2 shrink-0" />
            <span>{callBtnLabel}</span>
          </a>

          {/* Emergency 24/7 Call Button */}
          {partner.emergencyPhone && (
            <a
              href={`tel:${partner.emergencyPhone}`}
              onClick={() => {
                trackEvent("emergency_dial", {
                  service_type: "hospital",
                  target_name: `${partner.name} (Emergency 24/7)`,
                  phone: partner.emergencyPhone!,
                  upazila: partner.upazila,
                });
              }}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full h-11 rounded-2xl border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-sm shadow-2xs cursor-pointer",
              })}
            >
              <PhoneCall className="h-4 w-4 mr-2 shrink-0" />
              <span>২৪/৭ জরুরি হটলাইন: {partner.emergencyPhone}</span>
            </a>
          )}

          {/* Dedicated Ambulance Call Button */}
          {partner.ambulancePhone && (
            <a
              href={`tel:${partner.ambulancePhone}`}
              onClick={() => {
                trackEvent("emergency_dial", {
                  service_type: "ambulance",
                  target_name: `${partner.name} (Ambulance)`,
                  phone: partner.ambulancePhone!,
                  upazila: partner.upazila,
                });
              }}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full h-11 rounded-2xl border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-sm shadow-2xs cursor-pointer",
              })}
            >
              <Truck className="h-4 w-4 mr-2 shrink-0" />
              <span>জরুরি অ্যাম্বুলেন্স: {partner.ambulancePhone}</span>
            </a>
          )}

          {/* Location / Google Maps */}
          <a
            href={getMapUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "outline",
              className: "w-full h-10 rounded-2xl border-border hover:border-primary/40 hover:bg-muted/80 text-foreground font-semibold text-xs cursor-pointer",
            })}
          >
            <Navigation className="h-3.5 w-3.5 mr-2 text-primary shrink-0" />
            <span>গুগল ম্যাপে দিকনির্দেশনা</span>
            <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
          </a>

          {/* Share Profile */}
          <Button
            variant="ghost"
            onClick={handleShare}
            className="w-full h-9 rounded-xl text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5 mr-2 shrink-0" />
            <span>প্রোফাইল শেয়ার করুন</span>
          </Button>
        </div>

        {/* Address & Working Hours Breakdown */}
        <div className="pt-3 border-t border-border/60 space-y-2.5 text-xs">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">
                ঠিকানা ও অবস্থান
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground mt-0.5">
                {partner.address}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">
                রোগী দেখার ও সেবা সময়
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground mt-0.5">
                {partner.workingHours ||
                  (partner.category === "pharmacy"
                    ? "সকাল ৮:০০ - রাত ১১:৩০ (প্রতিদিন)"
                    : "২৪ ঘণ্টা খোলা (জরুরি ও ইনডোর)")}
              </p>
            </div>
          </div>
        </div>

        {/* Social Media & Online Connect Links */}
        <HospitalSocialLinks partner={partner} variant="sidebar" />
      </Card>

      {/* Member Privilege & Discount Guide */}
      <Card className="p-4 sm:p-5 rounded-3xl border-primary/20 bg-gradient-to-b from-primary/10 via-background to-background shadow-xs space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary text-white shadow-xs">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-secondary dark:text-white font-heading">
              হেলথ ক্লাব সদস্য সুবিধা
            </h4>
            <p className="text-[10px] text-primary font-bold">
              {formatDiscount(partner.discount)} নিশ্চিত ছাড়
            </p>
          </div>
        </div>

        <div className="space-y-2 text-[11px] text-muted-foreground">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span>
              {isPharmacy
                ? "ঔষধ ক্রয়ের পূর্বে ফার্মেসির ক্যাশ কাউন্টারে আপনার ডিজিটাল মেম্বার কার্ড প্রদর্শন করুন।"
                : "বিলিং বা ক্যাশ কাউন্টারে আপনার ডিজিটাল কার্ড বা মেম্বার আইডি কিউআর কোড প্রদর্শন করুন।"}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span>
              {isPharmacy
                ? "সকল প্রেসক্রিপশন মেডিসিন, ভিটামিন ও স্বাস্থ্য সামগ্রীতে নির্ধারিত ছাড় প্রযোজ্য।"
                : "সকল প্যাথলজি পরীক্ষা, ডাক্তার চেম্বার ও ইনডোর বেড ভাড়ায় প্রযোজ্য।"}
            </span>
          </div>
        </div>

        <Link
          href="/membership"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "w-full h-9 rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-white font-semibold text-xs cursor-pointer shadow-2xs",
          })}
        >
          <span>মেম্বারশিপ কার্ড সংগ্রহ করুন</span>
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Link>
      </Card>

      {/* Other Partner Facilities in Network */}
      {relatedPartners.length > 0 && (
        <Card className="p-4 sm:p-5 rounded-3xl border-border/80 bg-background dark:bg-slate-900/90 shadow-2xs space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-secondary dark:text-white font-heading">
            ফেনীর অন্যান্য পার্টনার প্রতিষ্ঠান
          </h4>

          <div className="space-y-2.5">
            {relatedPartners.map((p) => (
              <Link
                key={p.id}
                href={`/partner-hospitals/${encodeURIComponent(p.slug || p.id)}`}
                className="group block p-2.5 rounded-xl border border-border/60 hover:border-primary/40 bg-muted/20 hover:bg-muted/50 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {p.name}
                  </span>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                    {formatDiscount(p.discount)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {p.address}
                </p>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
