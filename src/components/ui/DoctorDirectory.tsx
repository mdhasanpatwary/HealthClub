"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Stethoscope, X, ChevronDown } from "lucide-react";
import { Doctor } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import dynamic from "next/dynamic";
import { DoctorCard } from "./doctors/DoctorCard";
import DepartmentSeoHero from "@/components/consultants/DepartmentSeoHero";
import { getDepartmentSeoConfig } from "@/data/doctorSeoData";
import { FENI_UPAZILAS, detectUpazilaFromText } from "@/data/feniLocations";
import { DEPARTMENTS } from "@/components/consultants/consultantData";

const DoctorSerialModal = dynamic(
  () => import("./doctors/DoctorModals").then((m) => m.DoctorSerialModal),
  { ssr: false }
);
const DoctorDetailsModal = dynamic(
  () => import("./doctors/DoctorModals").then((m) => m.DoctorDetailsModal),
  { ssr: false }
);

interface DoctorDirectoryProps {
  doctors?: Doctor[];
  limit?: number;
  initialDept?: string;
  initialUpazila?: string;
}

const INITIAL_VISIBLE_COUNT = 12;

function isDiabetesDoctor(doc: Doctor): boolean {
  if (doc.department === "diabetes") return true;
  const spec = (doc.specialty || "").toLowerCase();
  return ["ডায়াবেটিস", "diabetes", "হরমোন", "hormone", "থাইরয়েড", "thyroid", "endocrin"].some((k) =>
    spec.includes(k)
  );
}

export default function DoctorDirectory({
  doctors = [],
  limit,
  initialDept = "all",
  initialUpazila = "all",
}: DoctorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState(initialDept || "all");
  const [selectedUpazila, setSelectedUpazila] = useState(initialUpazila || "all");
  const [prevInitialDept, setPrevInitialDept] = useState(initialDept);
  const [prevInitialUpazila, setPrevInitialUpazila] = useState(initialUpazila);

  if (initialDept !== prevInitialDept) {
    setPrevInitialDept(initialDept);
    setSelectedDept(initialDept || "all");
  }
  if (initialUpazila !== prevInitialUpazila) {
    setPrevInitialUpazila(initialUpazila);
    setSelectedUpazila(initialUpazila || "all");
  }

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [activeSerialDoctor, setActiveSerialDoctor] = useState<Doctor | null>(null);
  const [activeDetailsDoctor, setActiveDetailsDoctor] = useState<Doctor | null>(null);
  const { t, locale } = useLanguage();
  const isEn = locale === "en";

  // Sync with URL query parameters on initial client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const dept = params.get("dept");
    const upazila = params.get("upazila");
    if (dept && dept !== "all") {
      queueMicrotask(() => setSelectedDept(dept));
    }
    if (upazila && upazila !== "all") {
      queueMicrotask(() => setSelectedUpazila(upazila));
    }
  }, []);

  // Update browser URL query params without full page reload
  const updateUrlParams = (dept: string, upazila: string) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (dept && dept !== "all") url.searchParams.set("dept", dept);
    else url.searchParams.delete("dept");
    if (upazila && upazila !== "all") url.searchParams.set("upazila", upazila);
    else url.searchParams.delete("upazila");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  };

  const handleDeptChange = (deptId: string) => {
    setSelectedDept(deptId);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    updateUrlParams(deptId, selectedUpazila);
  };

  const handleUpazilaChange = (upzId: string) => {
    setSelectedUpazila(upzId);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    updateUrlParams(selectedDept, upzId);
  };

  const handleResetFilters = () => {
    setSelectedUpazila("all");
    setSelectedDept("all");
    setSearchQuery("");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    updateUrlParams("all", "all");
  };

  // Precompute upazila for each doctor (server provides pre-resolved upazila, fallback provided)
  const doctorsWithUpazila = useMemo(() => {
    return doctors.map((doc) => ({
      ...doc,
      resolvedUpazila: doc.upazila || (doc.chamberAddress ? detectUpazilaFromText(doc.chamberAddress) : "feni-sadar"),
    }));
  }, [doctors]);

  // Single-pass computation of department and upazila counts for maximum performance
  const { departmentCounts, upazilaCounts } = useMemo(() => {
    const deptMap: Record<string, number> = { all: doctorsWithUpazila.length };
    const upzMap: Record<string, number> = { all: doctorsWithUpazila.length };

    for (let i = 0; i < doctorsWithUpazila.length; i++) {
      const doc = doctorsWithUpazila[i];
      const dept = doc.department || "other";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
      if (isDiabetesDoctor(doc)) {
        deptMap["diabetes"] = (deptMap["diabetes"] || 0) + 1;
      }
      const upz = doc.resolvedUpazila || "feni-sadar";
      upzMap[upz] = (upzMap[upz] || 0) + 1;
    }

    return { departmentCounts: deptMap, upazilaCounts: upzMap };
  }, [doctorsWithUpazila]);

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

      const matchesDept =
        selectedDept === "all" ||
        doc.department === selectedDept ||
        (selectedDept === "diabetes" && isDiabetesDoctor(doc));

      const matchesUpazila = selectedUpazila === "all" || doc.resolvedUpazila === selectedUpazila;

      return matchesSearch && matchesDept && matchesUpazila;
    });
  }, [doctorsWithUpazila, searchQuery, selectedDept, selectedUpazila]);

  const displayedDoctors = limit ? filteredDoctors.slice(0, limit) : filteredDoctors.slice(0, visibleCount);

  const deptSeo = getDepartmentSeoConfig(selectedDept);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Screen Reader Live Announcement */}
      <div aria-live="polite" role="status" aria-atomic="true" className="sr-only">
        {isEn
          ? `Found ${filteredDoctors.length} doctor${filteredDoctors.length === 1 ? "" : "s"}`
          : `${filteredDoctors.length} জন ডাক্তার পাওয়া গেছে`}
      </div>

      {/* Contextual Department SEO Hero if a specialty is selected */}
      {deptSeo && (
        <DepartmentSeoHero
          seoConfig={deptSeo}
          locale={locale}
          matchingDoctorsCount={filteredDoctors.length}
          onReset={() => handleDeptChange("all")}
        />
      )}

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
            setVisibleCount(INITIAL_VISIBLE_COUNT);
          }}
          className="pl-12 pr-10 py-3.5 sm:py-6 text-sm sm:text-base rounded-2xl border-border/80 bg-background shadow-xs focus-visible:ring-primary"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setSearchQuery("");
              setVisibleCount(INITIAL_VISIBLE_COUNT);
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
              onClick={handleResetFilters}
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
            const count = upazilaCounts[upz.id] || 0;

            return (
              <button
                key={upz.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleUpazilaChange(upz.id)}
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
                      isSelected ? "bg-white/30 text-white" : "bg-muted text-muted-foreground"
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
            onChange={(e) => handleDeptChange(e.target.value)}
            className="w-full appearance-none pl-10 pr-10 py-3 text-sm font-semibold rounded-2xl border border-border/80 bg-background text-foreground shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => {
              const count = departmentCounts[dept.id] || 0;
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
          const count = departmentCounts[dept.id] || 0;

          return (
            <button
              key={dept.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleDeptChange(dept.id)}
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
              <DoctorCard
                key={doc.id}
                doctor={doc}
                locale={locale}
                isEn={isEn}
                t={t}
                onDetailsClick={setActiveDetailsDoctor}
                onSerialClick={setActiveSerialDoctor}
              />
            ))}
          </div>

          {/* Load More Button */}
          {!limit && displayedDoctors.length < filteredDoctors.length && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 12)}
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
            onClick={handleResetFilters}
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
