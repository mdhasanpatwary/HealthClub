"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone, PhoneCall, Calendar, Clock, MapPin, Building2,
  Stethoscope, CheckCircle2, Share2, Navigation,
  ChevronRight, ArrowLeft, HeartPulse, Brain, Bone, Baby,
  Sparkles, ShieldCheck, UserRound, Apple, Eye, Info, Smile,
  FileText, Clock3, CreditCard
} from "lucide-react";
import { Doctor, Partner } from "@/services/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { DoctorAvatar, DoctorSerialModal } from "@/components/ui/doctors/DoctorModals";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/siteConfig";

interface DoctorProfileViewProps {
  doctor: Doctor & { partner?: Partner | null };
  relatedDoctors?: Doctor[];
}

const DEPT_ICONS: Record<string, typeof Stethoscope> = {
  medicine: Stethoscope,
  cardiology: HeartPulse,
  gynecology: UserRound,
  orthopedics: Bone,
  psychiatry: Brain,
  nephrology: ShieldCheck,
  hepatology: ShieldCheck,
  surgery: Sparkles,
  pediatrics: Baby,
  rheumatology: Bone,
  nutrition: Apple,
  dermatology: Sparkles,
  ent: Info,
  eye: Eye,
  dental: Smile,
  other: Sparkles,
};

const CLINICAL_FOCUS_MAP: Record<string, { bn: string; en: string }> = {
  medicine: {
    bn: "জ্বর, গ্যাস্ট্রিক, লিভার, ডায়াবেটিস, উচ্চ রক্তচাপ, হাঁপানি ও সাধারণ স্বাস্থ্য সমস্যার পূর্ণাঙ্গ চিকিৎসা।",
    en: "Fever, gastrointestinal disorders, liver diseases, diabetes, hypertension, asthma & general health.",
  },
  cardiology: {
    bn: "বুকে ব্যথা, উচ্চ রক্তচাপ, বুক ধড়ফড়, শ্বাসকষ্ট, হৃদরোগ নির্ণয়, ইসিজি ও ইকো-কার্ডিওগ্রাফি পরামর্শ।",
    en: "Chest pain, hypertension, palpitations, shortness of breath, cardiovascular diseases, ECG & Echo.",
  },
  gynecology: {
    bn: "গর্ভকালীন যত্ন (ANC), বন্ধ্যাত্ব চিকিৎসা, সিজারিয়ান ও নরমাল ডেলিভারি, জরায়ুর জটিলতা ও মহিলাদের স্বাস্থ্যসেবা।",
    en: "Antenatal care (ANC), infertility evaluation, normal/caesarean delivery, and women's health.",
  },
  orthopedics: {
    bn: "হাড় ভাঙা ও জোড়া লাগানো, বাত-ব্যথা, স্পাইন ও মেরুদণ্ডের সমস্যা, জয়েন্ট রিপ্লেসমেন্ট ও ট্রমা সার্জারি।",
    en: "Fractures, arthritis, spine disorders, joint replacements, trauma surgery & chronic musculoskeletal pain.",
  },
  pediatrics: {
    bn: "নবজাতক ও শিশুর জ্বর, সর্দি-কাশি, নিউমোনিয়া, অপুষ্টি, টিকা পরামর্শ ও শারীরিক বৃদ্ধির চিকিৎসা।",
    en: "Neonatal & pediatric care, pneumonia, nutrition assessment, vaccinations & child development.",
  },
  psychiatry: {
    bn: "মানসিক অবসাদ, অনিদ্রা, উদ্বেগ, ফোবিয়া, মাদকাসক্তি থেকে মুক্তি ও স্নায়ুরোগ সংক্রান্ত কাউন্সেলিং।",
    en: "Depression, insomnia, anxiety disorders, phobias, addiction recovery & neuropsychiatric counseling.",
  },
  nephrology: {
    bn: "কিডনি রোগ, প্রস্রাবের ইনফেকশন, প্রোটিন নির্গমন, ক্রনিক কিডনি ডিজিজ (CKD) ও ডায়ালাইসিস পরামর্শ।",
    en: "Renal disease, urinary tract infections, proteinuria, chronic kidney disease (CKD) & dialysis guidance.",
  },
  hepatology: {
    bn: "জন্ডিস, ফ্যাটি লিভার, লিভার সিরোসিস, হেপাটাইটিস বি ও সি ভাইরাস এবং লিভারের জটিল রোগ।",
    en: "Jaundice, fatty liver disease, cirrhosis, Hepatitis B/C infections & advanced liver health.",
  },
  surgery: {
    bn: "ল্যাপারোস্কপিক ও জেনারেল সার্জারি, অ্যাপেন্ডিক্স, হার্নিয়া, পিত্তথলির পাথর, টিউমার ও ভাস্কুলার অপারেশন।",
    en: "Laparoscopic and general surgery, appendix, hernia repair, gallstones, tumors & vascular surgery.",
  },
  dermatology: {
    bn: "ব্রণ, এলার্জি, চর্মরোগ, সোরিয়াসিস, চুল পড়া, একজিমা, দাদ ও লেজার স্কিন কেয়ার চিকিৎসা।",
    en: "Acne, allergies, eczema, psoriasis, hair loss, fungal infections & modern dermatological care.",
  },
  ent: {
    bn: "নাক, কান, গলা ও থাইরয়েড রোগ, সাইনোসাইটিস, কানের পর্দা ফুটো, টনসিল অপারেশন ও স্লিপ সার্জারি।",
    en: "Ear, nose, throat and thyroid conditions, sinusitis, tonsillitis, ear discharge & sleep apnea surgery.",
  },
  eye: {
    bn: "চোখের ছানি অপারেশন, দৃষ্টিশক্তি পরীক্ষা, গ্লুকোমা, চোখের লালভাব ও আধুনিক ফ্যাকো সার্জারি।",
    en: "Cataract phaco surgery, visual acuity checks, glaucoma screening & ocular medical treatment.",
  },
  dental: {
    bn: "রুট ক্যানেল, স্কেলিং, দাঁতের ফিলিং, ক্যাপ বসানো, মাড়ির রোগ ও আধুনিক অর্থোডন্টিক সেবা।",
    en: "Root canal therapy, scaling, tooth fillings, crowns, gum care & modern orthodontic dentistry.",
  },
  nutrition: {
    bn: "ওজন নিয়ন্ত্রণ, ডায়াবেটিস ডায়েট চার্ট, কিডনি ও ফ্যাটি লিভার রোগীর পুষ্টি পরামর্শ ও সুষম খাদ্য তালিকা।",
    en: "Weight management, medical nutrition therapy for diabetes/kidney diseases & customized diet plans.",
  },
  rheumatology: {
    bn: "রিউমাটয়েড আর্থ্রাইটিস, গাউট, এঙ্কাইলোজিং স্পন্ডিলাইটিস ও দীর্ঘমেয়াদী জয়েন্ট ব্যথার আধুনিক চিকিৎসা।",
    en: "Rheumatoid arthritis, gout, ankylosing spondylitis, lupus & chronic joint and muscle care.",
  },
  other: {
    bn: "বিশেষায়িত চিকিৎসা সেবা, রোগ নির্ণয় এবং প্রয়োজনীয় স্বাস্থ্য ও রেফারেল পরামর্শ।",
    en: "Specialized clinical consultations, diagnostics, and patient referral services.",
  },
};

export default function DoctorProfileView({
  doctor,
  relatedDoctors = [],
}: DoctorProfileViewProps) {
  const { t, locale } = useLanguage();
  const [showSerialModal, setShowSerialModal] = useState(false);
  const isEn = locale === "en";

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
    const profileUrl = typeof window !== "undefined" ? window.location.href : `${SITE_URL}/consultants/${doctor.id}`;
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
      toast.success(t("consultants.profile.linkCopied") || "Doctor profile link copied!");
    } catch {
      toast.error("Could not copy link.");
    }
  };

  return (
    <div className="bg-background min-h-screen py-4 sm:py-10">
      {/* Breadcrumb Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap py-1">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("consultants.profile.breadcrumbHome") || "Home"}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <Link href="/consultants" className="hover:text-primary transition-colors">
            {t("consultants.profile.breadcrumbConsultants") || "Specialist Doctors"}
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
                  <span>{t(`consultants.filter.${doctor.department}`) || doctor.department}</span>
                </Badge>
                <Badge variant="outline" className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{t("consultants.profile.verifiedSpecialist") || "BMDC Verified"}</span>
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
                  {t("consultants.profile.degreesTitle") || "Qualifications"}
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
                <span>{t("consultants.profile.callSerialNow") || "Call for Serial"}</span>
              </Button>

              <a
                href={getMapUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 rounded-2xl border border-border bg-background hover:bg-muted text-foreground text-xs sm:text-sm font-semibold transition-colors"
              >
                <Navigation className="h-4 w-4 text-primary" />
                <span>{t("consultants.profile.getDirections") || "Map Directions"}</span>
              </a>

              <Button
                variant="ghost"
                onClick={handleShare}
                className="w-full rounded-2xl h-10 text-xs font-semibold text-muted-foreground hover:text-foreground gap-2 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{t("consultants.profile.shareDoctor") || "Share Profile"}</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Grid: Chamber & Details vs Side Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Chamber Schedule & Hotline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chamber Schedule Card */}
            <Card className="rounded-3xl border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-border/60">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-base sm:text-lg text-foreground">
                    {t("consultants.profile.chamberSchedule") || "Chamber & Visiting Schedule"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {doctor.chamberName}
                  </p>
                </div>
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
                          <span>{t("consultants.profile.room") || "Room"}:</span>
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
                      <span>{t("consultants.card.visitingDays") || "Visiting Days"}</span>
                    </div>
                    <p className="font-heading font-bold text-sm sm:text-base text-foreground pt-1">
                      {doctor.visitingDays}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{t("consultants.card.visitingHours") || "Visiting Hours"}</span>
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
                      <span>{t("consultants.profile.fee") || "Consultation Fee"}</span>
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
                  {isEn ? "Direct Chamber Phone Serial" : "চেম্বার সিরিয়াল ও বুকিং নাম্বার"}
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
                        {isEn ? "Call" : "কল দিন"}
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
                    {t("consultants.profile.clinicalFocusTitle") || "Specialized Medical Care"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {doctor.specialty}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isEn ? clinicalFocus.en : clinicalFocus.bn}
              </p>

              {/* Patient Preparation Checklist */}
              <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 sm:p-5 space-y-3 mt-4">
                <h3 className="font-heading font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>{t("consultants.profile.patientPrepTitle") || "Preparation Before Chamber Visit"}</span>
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("consultants.profile.prepTip1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("consultants.profile.prepTip2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("consultants.profile.prepTip3")}</span>
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
                <span>{isEn ? "Health Club Member Benefit" : "হেলথ ক্লাব মেম্বার সুবিধা"}</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {t("consultants.profile.memberDiscountNotice")}
              </p>
              <div className="pt-2">
                <Link
                  href="/membership"
                  className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-xs"
                >
                  {isEn ? "Get Membership Card" : "মেম্বারশিপ কার্ড সংগ্রহ করুন"}
                </Link>
              </div>
            </Card>

            {/* Related Specialists in same department */}
            {relatedDoctors.length > 0 && (
              <Card className="rounded-3xl border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h3 className="font-heading font-bold text-sm text-foreground">
                    {t("consultants.profile.relatedDoctors") || "Related Specialists"}
                  </h3>
                  <Link
                    href="/consultants"
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    {isEn ? "View All" : "সকল দেখুন"}
                  </Link>
                </div>

                <div className="space-y-3">
                  {relatedDoctors.map((relDoc) => (
                    <Link
                      key={relDoc.id}
                      href={`/consultants/${relDoc.id}`}
                      className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-muted/60 transition-colors border border-border/50 group"
                    >
                      <DoctorAvatar
                        src={relDoc.imageUrl}
                        alt={relDoc.name}
                        className="h-12 w-12 rounded-xl shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="font-heading font-bold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {relDoc.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-primary line-clamp-1">
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
                <span>{t("consultants.profile.viewAllDoctors") || "Back to Doctor Directory"}</span>
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
          t={t}
          locale={locale}
        />
      )}
    </div>
  );
}
