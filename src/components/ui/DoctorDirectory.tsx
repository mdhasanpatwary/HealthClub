"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search, Phone, PhoneCall, Calendar, Clock, MapPin, Building2,
  Stethoscope, HeartPulse, Brain, Bone, Baby, Sparkles, ShieldCheck,
  UserRound, Apple, Eye, Info, X, CheckCircle2, ChevronDown,
} from "lucide-react";
import { Doctor } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface DoctorDirectoryProps {
  doctors?: Doctor[];
  limit?: number;
}

function DoctorAvatar({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const fallback = "/images/placeholders/doctor-default.jpg";
  const imgSrc = src || fallback;
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative shrink-0 rounded-2xl overflow-hidden bg-primary/10 border-2 border-primary/20 flex items-center justify-center ${className}`}>
      {!hasError && imgSrc ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="(max-width: 640px) 80px, 100px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-primary/15 text-primary">
          <Stethoscope className="h-7 w-7" />
        </div>
      )}
    </div>
  );
}

const DEPARTMENTS = [
  { id: "all", labelKey: "consultants.filter.all", icon: Stethoscope },
  { id: "medicine", labelKey: "consultants.filter.medicine", icon: Stethoscope },
  { id: "cardiology", labelKey: "consultants.filter.cardiology", icon: HeartPulse },
  { id: "gynecology", labelKey: "consultants.filter.gynecology", icon: UserRound },
  { id: "orthopedics", labelKey: "consultants.filter.orthopedics", icon: Bone },
  { id: "psychiatry", labelKey: "consultants.filter.psychiatry", icon: Brain },
  { id: "nephrology", labelKey: "consultants.filter.nephrology", icon: ShieldCheck },
  { id: "hepatology", labelKey: "consultants.filter.hepatology", icon: ShieldCheck },
  { id: "surgery", labelKey: "consultants.filter.surgery", icon: Sparkles },
  { id: "pediatrics", labelKey: "consultants.filter.pediatrics", icon: Baby },
  { id: "rheumatology", labelKey: "consultants.filter.rheumatology", icon: Bone },
  { id: "nutrition", labelKey: "consultants.filter.nutrition", icon: Apple },
  { id: "dermatology", labelKey: "consultants.filter.dermatology", icon: Sparkles },
  { id: "ent", labelKey: "consultants.filter.ent", icon: Info },
  { id: "eye", labelKey: "consultants.filter.eye", icon: Eye },
];

export default function DoctorDirectory({ doctors = [], limit }: DoctorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [activeSerialDoctor, setActiveSerialDoctor] = useState<Doctor | null>(null);
  const [activeDetailsDoctor, setActiveDetailsDoctor] = useState<Doctor | null>(null);
  const { t, locale } = useLanguage();

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.degrees.toLowerCase().includes(q) ||
        doc.designation.toLowerCase().includes(q) ||
        doc.chamberName.toLowerCase().includes(q) ||
        doc.chamberAddress.toLowerCase().includes(q);

      const matchesDept = selectedDept === "all" || doc.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [doctors, searchQuery, selectedDept]);

  const displayedDoctors = limit ? filteredDoctors.slice(0, limit) : filteredDoctors;

  // Split phone numbers if comma separated
  const parsePhones = (phoneStr: string) => {
    return phoneStr
      .split(/[,/|]+/)
      .map((p) => p.trim())
      .filter(Boolean);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("consultants.search.placeholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-10 py-3.5 sm:py-6 text-sm sm:text-base rounded-2xl border-border/80 bg-background shadow-xs focus-visible:ring-primary"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Mobile Department Select Field */}
      <div className="block sm:hidden">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-primary flex items-center gap-1.5">
            <Stethoscope className="h-4 w-4" />
          </div>
          <select
            id="mobile-department-select"
            aria-label={t("consultants.filter.all")}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full appearance-none pl-10 pr-10 py-3 text-sm font-semibold rounded-2xl border border-border/80 bg-background text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => {
              const count =
                dept.id === "all"
                  ? doctors.length
                  : doctors.filter((d) => d.department === dept.id).length;
              return (
                <option key={dept.id} value={dept.id} className="bg-popover text-popover-foreground py-1">
                  {t(dept.labelKey)} {count > 0 ? `(${count})` : ""}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Desktop Department Filter Pills */}
      <div className="hidden sm:flex items-center gap-2 pb-2 pt-1 sm:flex-wrap sm:justify-center">
        {DEPARTMENTS.map((dept) => {
          const Icon = dept.icon;
          const isSelected = selectedDept === dept.id;
          const count = dept.id === "all" ? doctors.length : doctors.filter((d) => d.department === dept.id).length;

          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? "bg-primary text-white shadow-sm ring-2 ring-primary/20"
                  : "bg-background hover:bg-muted text-muted-foreground border border-border/70"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t(dept.labelKey)}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isSelected ? "bg-white/20 text-white" : "bg-muted-foreground/10 text-muted-foreground"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Doctors Grid */}
      {displayedDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedDoctors.map((doc) => (
            <Card
              key={doc.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border-border/80 bg-card hover:shadow-lg transition-all duration-300 group hover:border-primary/40"
            >
              <div className="p-3 sm:p-4 pb-2 sm:pb-2.5 space-y-2.5 sm:space-y-3 flex-1 flex flex-col justify-between">
                {/* Doctor Header (Image + Basic Info) */}
                <div className="flex items-start gap-3">
                  <DoctorAvatar
                    src={doc.imageUrl}
                    alt={doc.name}
                    className="h-16 w-16 sm:h-18 sm:w-18"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-secondary dark:text-white leading-snug">
                        {doc.name}
                      </h3>
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <p className="text-[11px] sm:text-xs font-semibold text-primary leading-tight">
                      {doc.specialty}
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground font-mono leading-tight">
                      {doc.degrees}
                    </p>
                  </div>
                </div>

                {/* Designation */}
                <div className="bg-muted/40 rounded-xl p-2.5 text-xs text-muted-foreground">
                  <p className="font-medium leading-relaxed">
                    {doc.designation}
                  </p>
                </div>

                {/* Chamber Schedule & Address */}
                <div className="space-y-1.5 text-xs pt-0.5">
                  <div className="flex items-start gap-2 text-foreground font-medium">
                    <Building2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="flex-1 leading-snug">{doc.chamberName}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-muted-foreground/80 shrink-0 mt-0.5" />
                    <span className="flex-1 leading-snug">{doc.chamberAddress}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1.5 rounded-lg font-medium text-[11px] sm:text-xs">
                    <div className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span className="leading-snug">{doc.visitingDays}</span>
                    </div>
                    <span className="hidden sm:inline text-emerald-400/80 dark:text-emerald-600 mx-0.5">•</span>
                    <div className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span className="leading-snug">{doc.visitingHours}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border/60 bg-muted/20 p-2 sm:p-2.5 grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveDetailsDoctor(doc)}
                  className="w-full text-xs font-semibold rounded-xl h-9 hover:bg-muted inline-flex items-center justify-center gap-1.5"
                >
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  <span>{t("consultants.card.viewDetails")}</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => setActiveSerialDoctor(doc)}
                  className="w-full bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl h-9 shadow-xs inline-flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="h-3.5 w-3.5 shrink-0 animate-pulse" />
                  <span>{t("consultants.card.callSerial")}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 bg-muted/20 rounded-3xl border border-dashed border-border/80 max-w-md mx-auto space-y-3">
          <Stethoscope className="h-10 w-10 text-muted-foreground/50 mx-auto" />
          <h3 className="font-heading font-bold text-base text-foreground">
            {t("consultants.empty.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("consultants.empty.desc")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedDept("all");
            }}
          >
            {locale === "en" ? "Clear Filters" : "ফিল্টার ক্লিয়ার করুন"}
          </Button>
        </div>
      )}

      {/* Serial Phone Booking Modal */}
      {activeSerialDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveSerialDoctor(null)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pr-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-foreground">
                  {t("consultants.modal.serialModalTitle")}
                </h4>
                <p className="text-xs text-primary font-semibold">
                  {activeSerialDoctor.name}
                </p>
              </div>
            </div>

            <div className="bg-muted/40 p-3.5 rounded-2xl space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Building2 className="h-4 w-4 text-primary shrink-0" />
                <span>{activeSerialDoctor.chamberName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>
                  {activeSerialDoctor.visitingDays} ({activeSerialDoctor.visitingHours})
                </span>
              </div>
              {activeSerialDoctor.consultationFee && (
                <div className="text-primary font-bold">
                  {t("consultants.card.fee")}: {activeSerialDoctor.consultationFee}
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <p className="text-xs text-muted-foreground font-medium">
                {t("consultants.modal.serialModalDesc")}
              </p>
              {parsePhones(activeSerialDoctor.serialPhone).map((phone, idx) => (
                <a
                  key={idx}
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="font-heading font-bold text-sm sm:text-base text-foreground tracking-wide font-mono">
                      {phone}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                    {locale === "en" ? "Call Now" : "কল দিন"}
                  </span>
                </a>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full rounded-2xl"
              onClick={() => setActiveSerialDoctor(null)}
            >
              {t("consultants.modal.close")}
            </Button>
          </div>
        </div>
      )}

      {/* Doctor Details Modal */}
      {activeDetailsDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 my-8 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveDetailsDoctor(null)}
              className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile Info */}
            <div className="flex items-start gap-4 pr-6">
              <DoctorAvatar
                src={activeDetailsDoctor.imageUrl}
                alt={activeDetailsDoctor.name}
                className="h-20 w-20"
              />
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
                  {activeDetailsDoctor.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-primary">
                  {activeDetailsDoctor.specialty}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {activeDetailsDoctor.degrees}
                </p>
              </div>
            </div>

            {/* Workplace / Designation */}
            <div className="space-y-1 bg-muted/40 p-3.5 rounded-2xl text-xs">
              <p className="text-muted-foreground font-semibold">
                {t("consultants.modal.designation")}
              </p>
              <p className="font-medium text-foreground leading-relaxed">
                {activeDetailsDoctor.designation}
              </p>
            </div>

            {/* Chamber & Schedule */}
            <div className="space-y-3 bg-muted/20 border border-border/70 p-4 rounded-2xl text-xs">
              <div>
                <p className="text-muted-foreground font-semibold">
                  {t("consultants.card.chamber")}
                </p>
                <p className="font-bold text-sm text-foreground">
                  {activeDetailsDoctor.chamberName}
                </p>
                <p className="text-muted-foreground mt-0.5">
                  {activeDetailsDoctor.chamberAddress}
                </p>
                {activeDetailsDoctor.roomNo && (
                  <p className="text-primary font-semibold mt-1">
                    {activeDetailsDoctor.roomNo}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                <div>
                  <p className="text-muted-foreground font-medium">
                    {t("consultants.card.visitingDays")}
                  </p>
                  <p className="font-bold text-foreground">
                    {activeDetailsDoctor.visitingDays}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">
                    {t("consultants.card.visitingHours")}
                  </p>
                  <p className="font-bold text-foreground">
                    {activeDetailsDoctor.visitingHours}
                  </p>
                </div>
              </div>

              {activeDetailsDoctor.consultationFee && (
                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">
                    {t("consultants.card.fee")}:
                  </span>
                  <span className="font-bold text-primary text-sm">
                    {activeDetailsDoctor.consultationFee}
                  </span>
                </div>
              )}
            </div>

            {/* Serial action */}
            <div className="space-y-2">
              <Button
                onClick={() => {
                  const doc = activeDetailsDoctor;
                  setActiveDetailsDoctor(null);
                  setActiveSerialDoctor(doc);
                }}
                className="w-full bg-primary hover:bg-primary-dark text-white rounded-2xl h-11 font-semibold"
              >
                <PhoneCall className="h-4 w-4 mr-2" />
                {t("consultants.card.callSerial")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
