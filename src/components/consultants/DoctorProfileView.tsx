"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone, PhoneCall, Calendar, Clock, MapPin, Building2,
  Stethoscope, CheckCircle2, Share2, Navigation,
  ChevronRight, ArrowLeft, ShieldCheck,
  FileText, Clock3, CreditCard
} from "lucide-react";
import { Doctor, Partner } from "@/services/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DoctorAvatar, DoctorSerialModal } from "@/components/ui/doctors/DoctorModals";
import { DoctorAvailabilityBadge, DoctorNoticeBanner } from "@/components/ui/doctors/DoctorAvailabilityBadge";
import { DEPT_ICONS, CLINICAL_FOCUS_MAP, DEPT_LABEL_MAP } from "./consultantData";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/siteConfig";

interface DoctorProfileViewProps {
  doctor: Doctor & { partner?: Partner | null };
  relatedDoctors?: Doctor[];
}

export default function DoctorProfileView({
  doctor,
  relatedDoctors = [],
}: DoctorProfileViewProps) {
  const [showSerialModal, setShowSerialModal] = useState(false);

  const DeptIcon = DEPT_ICONS[doctor.department] || Stethoscope;
  const clinicalFocus = CLINICAL_FOCUS_MAP[doctor.department] || CLINICAL_FOCUS_MAP.other;

  const parsePhones = (phoneStr: string) => {
    return phoneStr
      .split(/[,/|]+/)
      .map((p) => p.trim())
      .filter(Boolean);
  };

  const phoneNumbers = parsePhones(doctor.serialPhone);

  const getMapUrl = () => {
    if (doctor.partner?.mapLink) return doctor.partner.mapLink;
    const query = `${doctor.chamberName}, ${doctor.chamberAddress}, Feni`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const handleShare = async () => {
    const profileUrl = typeof window !== "undefined" ? window.location.href : `${SITE_URL}/consultants/${encodeURIComponent(doctor.slug || doctor.id)}`;
    const shareTitle = `${doctor.name} - ${doctor.specialty} | Health Club`;
    const shareText = `${doctor.name} (${doctor.specialty}), ${doctor.chamberName}, Feni. সিরিয়াল হটলাইন: ${doctor.serialPhone}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: profileUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("ডাক্তারের প্রোফাইল লিংক কপি করা হয়েছে!");
    } catch {
      toast.error("লিংক কপি করা সম্ভব হয়নি।");
    }
  };

  const deptLabel = DEPT_LABEL_MAP[doctor.department] || doctor.department || doctor.specialty;

  return (
    <div className="bg-background min-h-screen py-4 sm:py-10">
      {/* Breadcrumb Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap py-1">
          <Link href="/" className="hover:text-primary transition-colors">
            হোম
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <Link href="/consultants" className="hover:text-primary transition-colors">
            বিশেষজ্ঞ ডাক্তার
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-none">
            {doctor.name}
          </span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Top Header Card */}
        <Card className="rounded-3xl border-border/80 bg-card p-5 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-7">
            {/* Avatar */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <DoctorAvatar
                src={doctor.imageUrl}
                alt={doctor.name}
                priority
                sizes="(max-width: 640px) 112px, 144px"
                className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl shadow-sm border-2 border-primary/20"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-md border-2 border-background">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            {/* Main Info */}
            <div className="space-y-3 flex-1 text-center md:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs font-bold px-3 py-1 rounded-full gap-1.5">
                  <DeptIcon className="h-3.5 w-3.5" />
                  <span>{deptLabel}</span>
                </Badge>
                <DoctorAvailabilityBadge doctor={doctor} size="md" />
                <Badge variant="outline" className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>ভেরিফাইড বিশেষজ্ঞ</span>
                </Badge>
              </div>

              <h1 className="font-heading text-xl sm:text-3xl lg:text-4xl font-extrabold text-secondary dark:text-white tracking-tight leading-tight">
                {doctor.name}
              </h1>

              <p className="text-sm sm:text-base font-bold text-primary">
                {doctor.specialty}
              </p>

              <div className="bg-muted/40 p-3 sm:p-4 rounded-2xl text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed max-w-3xl">
                <span className="font-bold text-muted-foreground block mb-0.5 text-[11px] uppercase tracking-wider">
                  শিক্ষাগত যোগ্যতা ও ডিগ্রি
                </span>
                {doctor.degrees}
              </div>

              {doctor.designation && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                  <Building2 className="h-4 w-4 text-primary shrink-0" />
                  <span>{doctor.designation}</span>
                </div>
              )}
            </div>

            {/* Quick Action Buttons (Desktop Sidebar / CTA) */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-border/70 md:pl-6">
              <Button
                onClick={() => setShowSerialModal(true)}
                size="lg"
                className="w-full bg-primary hover:bg-primary-dark text-white rounded-2xl h-12 text-sm font-bold shadow-md shadow-primary/20 gap-2 cursor-pointer"
              >
                <PhoneCall className="h-4 w-4 animate-pulse" />
                <span>সিরিয়াল নিতে কল দিন</span>
              </Button>

              <a
                href={getMapUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 rounded-2xl border border-border bg-background hover:bg-muted text-foreground text-xs sm:text-sm font-semibold transition-colors"
              >
                <Navigation className="h-4 w-4 text-primary" />
                <span>গুগল ম্যাপে দিকনির্দেশনা</span>
              </a>

              <Button
                variant="ghost"
                onClick={handleShare}
                className="w-full rounded-2xl h-10 text-xs font-semibold text-muted-foreground hover:text-foreground gap-2 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>প্রোফাইল শেয়ার করুন</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Grid: Chamber & Details vs Side Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Chamber Schedule & Hotline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Notice Callout Banner */}
            {doctor.notice && (
              <DoctorNoticeBanner notice={doctor.notice} />
            )}

            {/* Chamber Schedule Card */}
            <Card className="rounded-3xl border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-base sm:text-lg text-foreground">
                      চেম্বার ও রোগী দেখার সময়সূচী
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {doctor.chamberName}
                    </p>
                  </div>
                </div>
                <DoctorAvailabilityBadge doctor={doctor} size="sm" />
              </div>

              {/* Chamber Details & Address */}
              <div className="space-y-4">
                <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-foreground">
                        {doctor.chamberName}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span>{doctor.chamberAddress}</span>
                      </p>
                      {doctor.roomNo && (
                        <p className="text-xs font-semibold text-primary inline-flex items-center gap-1 mt-1 bg-primary/10 px-2.5 py-0.5 rounded-lg">
                          <span>রুম নং:</span>
                          <span>{doctor.roomNo}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timing & Visiting Schedule Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                      <Clock3 className="h-4 w-4 shrink-0" />
                      <span>রোগী দেখার দিন</span>
                    </div>
                    <p className="font-heading font-bold text-sm sm:text-base text-foreground pt-1">
                      {doctor.visitingDays}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>সময়সূচী</span>
                    </div>
                    <p className="font-heading font-bold text-sm sm:text-base text-foreground pt-1">
                      {doctor.visitingHours}
                    </p>
                  </div>
                </div>

                {/* Consultation Fee */}
                {doctor.consultationFee && (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <CreditCard className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span>পরামর্শ ফি</span>
                    </div>
                    <span className="font-heading font-bold text-sm sm:text-base text-amber-700 dark:text-amber-300">
                      {doctor.consultationFee}
                    </span>
                  </div>
                )}
              </div>

              {/* Direct Serial Helpline List */}
              <div className="space-y-3 pt-2">
                <h3 className="font-heading font-bold text-xs sm:text-sm text-foreground uppercase tracking-wider text-muted-foreground">
                  চেম্বার সিরিয়াল ও বুকিং নাম্বার
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {phoneNumbers.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="font-heading font-bold text-sm text-foreground font-mono">
                          {phone}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        কল দিন
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </Card>

            {/* Clinical Focus & Department Guide */}
            <Card className="rounded-3xl border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-border/60">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-base sm:text-lg text-foreground">
                    বিশেষায়িত চিকিৎসাসেবা ও পারদর্শিতা
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {clinicalFocus.bn}
              </p>

              {/* Patient Preparation Checklist */}
              <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 sm:p-5 space-y-3 mt-4">
                <h3 className="font-heading font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>চেম্বারে আসার পূর্বে রোগীর প্রস্তুতি</span>
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>পূর্বের সকল প্রেসক্রিপশন, টেস্ট রিপোর্ট এবং নিয়মিত ঔষধের তালিকা সাথে রাখুন।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>সিরিয়াল ফোনে নিশ্চিত করুন এবং নির্ধারিত সময়ের অন্তত ১৫-২০ মিনিট পূর্বে চেম্বারে উপস্থিত হোন।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>পার্টনার ডায়াগনস্টিক সেন্টার বা হাসপাতালে ছাড় পেতে হেলথ ক্লাব ডিজিটাল কার্ড প্রদর্শন করুন।</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Right Column: Member Discount Callout & Related Doctors */}
          <div className="space-y-6">
            
            {/* Health Club Member Savings Callout */}
            <Card className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-5 sm:p-6 shadow-xs space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2.5 text-primary font-bold text-sm">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <span>হেলথ ক্লাব মেম্বার সুবিধা</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                হেলথ ক্লাব মেম্বারগণ এই ডাক্তারের প্রেসক্রিপশন অনুযায়ী সকল ডায়াগনস্টিক টেস্টে পার্টনার হাসপাতালগুলোতে ১০-৩০% পর্যন্ত বিশেষ ছাড় উপভোগ করবেন।
              </p>
              <div className="pt-2">
                <Link
                  href="/membership"
                  className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-xs"
                >
                  মেম্বারশিপ কার্ড সংগ্রহ করুন
                </Link>
              </div>
            </Card>

            {/* Related Specialists in same department */}
            {relatedDoctors.length > 0 && (
              <Card className="rounded-3xl border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h3 className="font-heading font-bold text-sm text-foreground">
                    এই বিভাগের অন্যান্য বিশেষজ্ঞ ডাক্তার
                  </h3>
                  <Link
                    href="/consultants"
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    সকল দেখুন
                  </Link>
                </div>

                <div className="space-y-3">
                  {relatedDoctors.map((relDoc) => (
                    <Link
                      key={relDoc.id}
                      href={`/consultants/${encodeURIComponent(relDoc.slug || relDoc.id)}`}
                      className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-muted/60 transition-colors border border-border/50 group"
                    >
                      <DoctorAvatar
                        src={relDoc.imageUrl}
                        alt={relDoc.name}
                        className="h-12 w-12 rounded-xl shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="font-heading font-bold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {relDoc.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-primary line-clamp-2 break-words">
                          {relDoc.specialty}
                        </p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">
                          {relDoc.chamberName}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Back to Directory Button */}
            <div className="pt-2">
              <Link
                href="/consultants"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl border border-border bg-card hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>সকল ডাক্তার তালিকায় ফিরুন</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Serial Phone Modal */}
      {showSerialModal && (
        <DoctorSerialModal
          doctor={doctor}
          onClose={() => setShowSerialModal(false)}
        />
      )}
    </div>
  );
}
