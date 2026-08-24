"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, PhoneCall, Calendar, Clock, MapPin, Building2,
  Stethoscope, HeartPulse, Brain, Bone, Baby, Sparkles, ShieldCheck,
  UserRound, Apple, Eye, Info, X, CheckCircle2, ChevronDown, Smile,
} from "lucide-react";
import { Doctor } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { DoctorAvatar, DoctorSerialModal, DoctorDetailsModal } from "./doctors/DoctorModals";
import { DoctorAvailabilityBadge, DoctorNoticeBanner } from "./doctors/DoctorAvailabilityBadge";
import { FENI_UPAZILAS, getUpazilaLabel, detectUpazilaFromText } from "@/data/feniLocations";

interface DoctorDirectoryProps {
  doctors?: Doctor[];
  limit?: number;
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
  { id: "dental", labelKey: "consultants.filter.dental", icon: Smile },
  { id: "other", labelKey: "consultants.filter.other", icon: Sparkles },
];

export default function DoctorDirectory({ doctors = [], limit }: DoctorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedUpazila, setSelectedUpazila] = useState("all");
  const [visibleCount, setVisibleCount] = useState(24);
  const [activeSerialDoctor, setActiveSerialDoctor] = useState<Doctor | null>(null);
  const [activeDetailsDoctor, setActiveDetailsDoctor] = useState<Doctor | null>(null);
  const { t, locale } = useLanguage();

  const isEn = locale === "en";

  // Precompute upazila for each doctor
  const doctorsWithUpazila = useMemo(() => {
    return doctors.map((doc) => ({
      ...doc,
      resolvedUpazila: doc.upazila || detectUpazilaFromText(doc.chamberAddress),
    }));
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctorsWithUpazila.filter((doc) => {
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
      const matchesUpazila = selectedUpazila === "all" || doc.resolvedUpazila === selectedUpazila;

      return matchesSearch && matchesDept && matchesUpazila;
    });
  }, [doctorsWithUpazila, searchQuery, selectedDept, selectedUpazila]);

  const displayedDoctors = limit ? filteredDoctors.slice(0, limit) : filteredDoctors.slice(0, visibleCount);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          aria-label={t("consultants.search.placeholder") || "Search doctors by name, specialty, degree, chamber, or serial phone"}
          placeholder={t("consultants.search.placeholder")}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setVisibleCount(24);
          }}
          className="pl-12 pr-10 py-3.5 sm:py-6 text-sm sm:text-base rounded-2xl border-border/80 bg-background shadow-xs focus-visible:ring-primary"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setSearchQuery("");
              setVisibleCount(24);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Upazila / Area Location Filter Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>{isEn ? "Filter by Upazila / Area" : "উপজেলা / এলাকা অনুযায়ী খুঁজুন"}</span>
          </span>
          {(selectedUpazila !== "all" || selectedDept !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedUpazila("all");
                setSelectedDept("all");
                setSearchQuery("");
                setVisibleCount(24);
              }}
              className="text-xs text-primary hover:underline font-semibold cursor-pointer"
            >
              {isEn ? "Reset Filters" : "ফিল্টার মুছুন"}
            </button>
          )}
        </div>

        {/* Upazila Pills - Horizontal Scroll on Mobile, Flex Wrap on Desktop */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none sm:flex-wrap sm:justify-center">
          {FENI_UPAZILAS.map((upz) => {
            const isSelected = selectedUpazila === upz.id;
            const count =
              upz.id === "all"
                ? doctorsWithUpazila.length
                : doctorsWithUpazila.filter((d) => d.resolvedUpazila === upz.id).length;

            return (
              <button
                key={upz.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedUpazila(upz.id);
                  setVisibleCount(24);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white shadow-sm ring-2 ring-primary/20"
                    : "bg-background hover:bg-muted text-muted-foreground border border-border/80"
                }`}
              >
                <MapPin className={`h-3 w-3 ${isSelected ? "text-white" : "text-primary"}`} />
                <span>{isEn ? upz.nameEn : upz.nameBn}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
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
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setVisibleCount(24);
            }}
            className="w-full appearance-none pl-10 pr-10 py-3 text-sm font-semibold rounded-2xl border border-border/80 bg-background text-foreground shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all cursor-pointer"
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
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedDept(dept.id);
                setVisibleCount(24);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-secondary text-white shadow-sm ring-2 ring-secondary/20"
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedDoctors.map((doc) => (
              <Card
                key={doc.id}
                className="h-full flex flex-col justify-between overflow-hidden rounded-2xl border-border/80 bg-card hover:shadow-lg transition-all duration-300 group hover:border-primary/40"
              >
                <div className="p-3.5 sm:p-4 pb-2 sm:pb-2.5 space-y-2.5 sm:space-y-3 flex-1 flex flex-col justify-between">
                  {/* Doctor Header (Image + Basic Info) */}
                  <div className="flex items-start gap-3">
                    <Link href={`/consultants/${doc.id}`} className="shrink-0 hover:opacity-90 transition-opacity">
                      <DoctorAvatar
                        src={doc.imageUrl}
                        alt={doc.name}
                        className="h-16 w-16 sm:h-18 sm:w-18"
                      />
                    </Link>
                    <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Link
                          href={`/consultants/${doc.id}`}
                          className="font-heading font-bold text-sm sm:text-base text-secondary dark:text-white leading-snug line-clamp-1 hover:text-primary transition-colors"
                          title={doc.name}
                        >
                          {doc.name}
                        </Link>
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      </div>
                      <p
                        className="text-[11px] sm:text-xs font-semibold text-primary leading-tight line-clamp-1"
                        title={doc.specialty}
                      >
                        {doc.specialty}
                      </p>
                      <p
                        className="text-[11px] sm:text-xs text-muted-foreground leading-tight line-clamp-2 h-[2.4em] overflow-hidden break-words"
                        title={doc.degrees}
                      >
                        {doc.degrees}
                      </p>
                    </div>
                  </div>

                    {/* Designation & Availability Row */}
                    <div className="flex flex-col gap-1.5">
                      <div className="bg-muted/40 rounded-xl px-2.5 py-1.5 sm:py-2 text-xs text-muted-foreground min-h-10 flex items-center overflow-hidden">
                        <p
                          className="font-medium leading-tight line-clamp-2 overflow-hidden break-words"
                          title={doc.designation}
                        >
                          {doc.designation || "বিশেষজ্ঞ চিকিৎসক"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-1.5">
                        <DoctorAvailabilityBadge doctor={doc} locale={locale} size="sm" />
                      </div>
                    </div>

                    {/* Notice Banner if present */}
                    {doc.notice && (
                      <DoctorNoticeBanner notice={doc.notice} locale={locale} compact />
                    )}

                    {/* Chamber Schedule & Address with Upazila Badge */}
                    <div className="space-y-1 text-xs pt-0.5">
                      <div className="flex items-center justify-between gap-2 text-foreground font-medium min-w-0">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                          <span className="flex-1 truncate leading-snug" title={doc.chamberName}>
                            {doc.chamberName}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                          <MapPin className="h-2.5 w-2.5" />
                          {getUpazilaLabel(doc.resolvedUpazila, locale)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground/80 shrink-0" />
                        <span className="flex-1 truncate leading-snug" title={doc.chamberAddress}>
                          {doc.chamberAddress}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1.5 rounded-lg font-medium text-[11px] sm:text-xs overflow-hidden">
                        <div className="inline-flex items-center gap-1.5 truncate min-w-0 flex-1">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate" title={doc.visitingDays}>
                            {doc.visitingDays}
                          </span>
                        </div>
                        <span className="text-emerald-400/80 dark:text-emerald-600 shrink-0">•</span>
                        <div className="inline-flex items-center gap-1.5 truncate shrink-0 max-w-[45%]">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate" title={doc.visitingHours}>
                            {doc.visitingHours}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* Action Buttons */}
                <div className="border-t border-border/60 bg-muted/20 p-2 sm:p-2.5 grid grid-cols-2 gap-2 mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveDetailsDoctor(doc)}
                    className="h-8 sm:h-9 text-xs font-semibold rounded-xl border-border/80 hover:bg-muted cursor-pointer"
                  >
                    <Info className="h-3.5 w-3.5 mr-1" />
                    {t("consultants.button.details") || (isEn ? "Details" : "বিস্তারিত")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setActiveSerialDoctor(doc)}
                    className="h-8 sm:h-9 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xs cursor-pointer"
                  >
                    <PhoneCall className="h-3.5 w-3.5 mr-1" />
                    {t("consultants.button.serial") || (isEn ? "Call Serial" : "সিরিয়াল কল")}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {!limit && displayedDoctors.length < filteredDoctors.length && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold border-border hover:bg-muted cursor-pointer"
              >
                {t("consultants.button.loadMore") || (isEn ? "Load More Doctors" : "আরও ডাক্তার দেখুন")} ({filteredDoctors.length - displayedDoctors.length} {t("consultants.button.remaining") || (isEn ? "remaining" : "জন বাকি")})
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="p-8 sm:p-12 text-center rounded-2xl border-dashed border-2 border-border/80 bg-muted/10">
          <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white mb-1">
            {t("consultants.empty.title") || (isEn ? "No doctors found" : "কোনো ডাক্তার পাওয়া যায়নি")}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-4">
            {t("consultants.empty.desc") || (isEn ? "Please try another search keyword or select a different department." : "অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড বা বিভাগ দিয়ে পুনরায় চেষ্টা করুন।")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedDept("all");
              setSelectedUpazila("all");
            }}
            className="rounded-xl cursor-pointer"
          >
            {t("consultants.empty.reset") || (isEn ? "Reset Filters" : "ফিল্টার রিসেট করুন")}
          </Button>
        </Card>
      )}

      {/* Modals */}
      {activeSerialDoctor && (
        <DoctorSerialModal
          doctor={activeSerialDoctor}
          onClose={() => setActiveSerialDoctor(null)}
          t={t}
          locale={locale}
        />
      )}

      {activeDetailsDoctor && (
        <DoctorDetailsModal
          doctor={activeDetailsDoctor}
          onClose={() => setActiveDetailsDoctor(null)}
          onCallSerial={(doc) => {
            setActiveDetailsDoctor(null);
            setActiveSerialDoctor(doc);
          }}
          t={t}
        />
      )}
    </div>
  );
}
