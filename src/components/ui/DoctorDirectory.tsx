"use client";

import { useState, useMemo } from "react";
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
  const [visibleCount, setVisibleCount] = useState(24);
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

  const displayedDoctors = limit ? filteredDoctors.slice(0, limit) : filteredDoctors.slice(0, visibleCount);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
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
            onClick={() => {
              setSearchQuery("");
              setVisibleCount(24);
            }}
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
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setVisibleCount(24);
            }}
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
              onClick={() => {
                setSelectedDept(dept.id);
                setVisibleCount(24);
              }}
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
                    <DoctorAvatar
                      src={doc.imageUrl}
                      alt={doc.name}
                      className="h-16 w-16 sm:h-18 sm:w-18 shrink-0"
                    />
                    <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3
                          className="font-heading font-bold text-sm sm:text-base text-secondary dark:text-white leading-snug line-clamp-1"
                          title={doc.name}
                        >
                          {doc.name}
                        </h3>
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

                  {/* Designation (Fixed Equal Height with Line Clamp & Overflow Hidden) */}
                  <div className="bg-muted/40 rounded-xl px-2.5 py-1.5 sm:py-2 text-xs text-muted-foreground h-11 flex items-center overflow-hidden">
                    <p
                      className="font-medium leading-tight line-clamp-2 overflow-hidden break-words"
                      title={doc.designation}
                    >
                      {doc.designation || "বিশেষজ্ঞ চিকিৎসক"}
                    </p>
                  </div>

                  {/* Chamber Schedule & Address (Clean Truncation) */}
                  <div className="space-y-1 text-xs pt-0.5">
                    <div className="flex items-center gap-2 text-foreground font-medium min-w-0">
                      <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                      <span className="flex-1 truncate leading-snug" title={doc.chamberName}>
                        {doc.chamberName}
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

          {/* Load More Button */}
          {!limit && filteredDoctors.length > visibleCount && (
            <div className="flex flex-col items-center justify-center pt-4 pb-2 space-y-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="rounded-2xl px-8 border-primary/30 text-primary hover:bg-primary hover:text-white font-semibold transition-all shadow-xs cursor-pointer"
              >
                {locale === "en"
                  ? `Load More Doctors (${filteredDoctors.length - visibleCount} remaining)`
                  : `আরো ডাক্তার দেখুন (বাকি ${filteredDoctors.length - visibleCount} জন)`}
              </Button>
              <p className="text-xs text-muted-foreground">
                {locale === "en"
                  ? `Showing ${Math.min(visibleCount, filteredDoctors.length)} of ${filteredDoctors.length} doctors`
                  : `মোট ${filteredDoctors.length} জন ডাক্তারের মধ্যে ${Math.min(visibleCount, filteredDoctors.length)} জন প্রদর্শিত হচ্ছে`}
              </p>
            </div>
          )}
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
              setVisibleCount(24);
            }}
          >
            {locale === "en" ? "Clear Filters" : "ফিল্টার ক্লিয়ার করুন"}
          </Button>
        </div>
      )}

      {/* Serial Phone Booking Modal */}
      {activeSerialDoctor && (
        <DoctorSerialModal
          doctor={activeSerialDoctor}
          onClose={() => setActiveSerialDoctor(null)}
          t={t}
          locale={locale}
        />
      )}

      {/* Doctor Details Modal */}
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
