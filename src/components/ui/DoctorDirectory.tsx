"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Stethoscope, X } from "lucide-react";
import { Doctor } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { DoctorCard } from "./doctors/DoctorCard";
import { SymptomHintChips } from "./doctors/SymptomHintChips";
import { ChamberFilterChips } from "./doctors/ChamberFilterChips";
import { AvailableTodayToggle } from "./doctors/AvailableTodayToggle";
import { DepartmentFilterBar } from "./doctors/DepartmentFilterBar";
import { getDepartmentSeoConfig } from "@/data/doctorSeoData";
import { FENI_UPAZILAS, detectUpazilaFromText } from "@/data/feniLocations";
import { getDoctorDiseaseKeywords } from "@/components/consultants/consultantData";
import { matchesHospitalDoctor } from "@/data/feniHospitalsData";
import { toBanglaNums } from "@/lib/utils";
import {
  isDoctorAvailableToday,
  extractTodayIntent,
  getBangladeshDayInfo,
} from "@/lib/doctorAvailability";
import {
  getChamberSearchAliases,
  getSpecialtySearchAliases,
  transliterateBengaliToEnglish,
} from "@/lib/transliteration";

const DepartmentSeoHero = dynamic(
  () => import("@/components/consultants/DepartmentSeoHero")
);
const DoctorSerialModal = dynamic(
  () => import("./doctors/DoctorModals").then((m) => m.DoctorSerialModal)
);
const DoctorDetailsModal = dynamic(
  () => import("./doctors/DoctorModals").then((m) => m.DoctorDetailsModal)
);

interface DoctorDirectoryProps {
  doctors?: Doctor[];
  limit?: number;
  initialDept?: string;
  initialUpazila?: string;
  initialChamber?: string;
  isDepartmentPage?: boolean;
  isLocationPage?: boolean;
}

const INITIAL_VISIBLE_COUNT = 9;

function isDiabetesDoctor(doc: Doctor): boolean {
  if (doc.department === "diabetes") return true;
  const spec = (doc.specialty || "").toLowerCase();
  return ["ডায়াবেটিস", "diabetes", "হরমোন", "hormone", "থাইরয়েড", "thyroid", "endocrin"].some((k) =>
    spec.includes(k)
  );
}

function normalizeBengaliQuery(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFC")
    .replace(/\u09AF\u09BC/g, "য়")
    .replace(/\u09A1\u09BC/g, "ড়")
    .replace(/\u09A2\u09BC/g, "ঢ়");
}

export default function DoctorDirectory({
  doctors = [],
  limit,
  initialDept = "all",
  initialUpazila = "all",
  initialChamber = "all",
  isDepartmentPage = false,
  isLocationPage = false,
}: DoctorDirectoryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chamberQueryParam =
    searchParams?.get("chamber") ||
    searchParams?.get("hospital") ||
    initialChamber ||
    "all";
  const todayQueryParam =
    searchParams?.get("today") === "true" ||
    searchParams?.get("available") === "today";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState(initialDept || "all");
  const [selectedUpazila, setSelectedUpazila] = useState(initialUpazila || "all");
  const [selectedChamber, setSelectedChamber] = useState(chamberQueryParam);
  const [isAvailableTodayOnly, setIsAvailableTodayOnly] = useState(todayQueryParam);

  const [prevInitialDept, setPrevInitialDept] = useState(initialDept);
  const [prevInitialUpazila, setPrevInitialUpazila] = useState(initialUpazila);
  const [prevChamberParam, setPrevChamberParam] = useState(chamberQueryParam);
  const [prevTodayParam, setPrevTodayParam] = useState(todayQueryParam);

  if (initialDept !== prevInitialDept) {
    setPrevInitialDept(initialDept);
    setSelectedDept(initialDept || "all");
  }
  if (initialUpazila !== prevInitialUpazila) {
    setPrevInitialUpazila(initialUpazila);
    setSelectedUpazila(initialUpazila || "all");
  }
  if (chamberQueryParam !== prevChamberParam) {
    setPrevChamberParam(chamberQueryParam);
    setSelectedChamber(chamberQueryParam);
  }
  if (todayQueryParam !== prevTodayParam) {
    setPrevTodayParam(todayQueryParam);
    setIsAvailableTodayOnly(todayQueryParam);
  }

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [activeSerialDoctor, setActiveSerialDoctor] = useState<Doctor | null>(null);
  const [activeDetailsDoctor, setActiveDetailsDoctor] = useState<Doctor | null>(null);

  const todayInfo = useMemo(() => getBangladeshDayInfo(), []);

  const handleDeptChange = (deptId: string) => {
    if (deptId === "all" || deptId === "other") {
      router.push("/consultants");
    } else {
      router.push(`/consultants/department/${deptId}`);
    }
  };

  const handleUpazilaChange = (upzId: string) => {
    if (isDepartmentPage) {
      setSelectedUpazila(upzId);
      setVisibleCount(INITIAL_VISIBLE_COUNT);
      return;
    }
    if (upzId === "all") {
      router.push("/consultants");
    } else {
      router.push(`/consultants/location/${upzId}`);
    }
  };

  const handleResetFilters = () => {
    setIsAvailableTodayOnly(false);
    if (isDepartmentPage) {
      setSelectedUpazila("all");
      setSelectedChamber("all");
      setSearchQuery("");
      setVisibleCount(INITIAL_VISIBLE_COUNT);
      return;
    }
    if (isLocationPage) {
      router.push("/consultants");
      return;
    }
    setSelectedUpazila("all");
    setSelectedDept("all");
    setSelectedChamber("all");
    setSearchQuery("");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  // Precompute upazila, search index, and real-time today availability for each doctor
  const doctorsWithUpazila = useMemo(() => {
    return doctors.map((doc) => {
      const resolvedUpazila =
        doc.upazila || (doc.chamberAddress ? detectUpazilaFromText(doc.chamberAddress) : "feni-sadar");
      const transliteratedName = transliterateBengaliToEnglish(doc.name);
      const specialtyAliases = getSpecialtySearchAliases(`${doc.specialty} ${doc.department}`);
      const chamberAliases = getChamberSearchAliases(doc);
      const diseaseKeywords = getDoctorDiseaseKeywords(doc);
      const rawSearchable = `${doc.name} ${transliteratedName} ${doc.nameEn || ""} ${doc.slug || ""} ${doc.specialty} ${specialtyAliases} ${doc.degrees || ""} ${doc.designation || ""} ${doc.chamberName} ${doc.chamberAddress} ${chamberAliases} ${diseaseKeywords}`;
      const searchIndex = normalizeBengaliQuery(rawSearchable);
      const isAvailableToday = isDoctorAvailableToday(doc);

      return {
        ...doc,
        resolvedUpazila,
        searchIndex,
        isAvailableToday,
      };
    });
  }, [doctors]);

  // Single-pass computation of department, upazila, and available-today counts
  const { departmentCounts, upazilaCounts, availableTodayCount } = useMemo(() => {
    const deptMap: Record<string, number> = { all: doctorsWithUpazila.length };
    const upzMap: Record<string, number> = { all: doctorsWithUpazila.length };
    let availableCount = 0;

    for (let i = 0; i < doctorsWithUpazila.length; i++) {
      const doc = doctorsWithUpazila[i];
      if (doc.isAvailableToday) {
        availableCount++;
      }
      const dept = doc.department || "other";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
      if (isDiabetesDoctor(doc)) {
        deptMap["diabetes"] = (deptMap["diabetes"] || 0) + 1;
      }
      const upz = doc.resolvedUpazila || "feni-sadar";
      upzMap[upz] = (upzMap[upz] || 0) + 1;
    }

    return { departmentCounts: deptMap, upazilaCounts: upzMap, availableTodayCount: availableCount };
  }, [doctorsWithUpazila]);

  const filteredDoctors = useMemo(() => {
    const rawQ = searchQuery.trim();
    const { hasTodayIntent, cleanedQuery } = extractTodayIntent(rawQ);
    const q = normalizeBengaliQuery(cleanedQuery);

    return doctorsWithUpazila.filter((doc) => {
      // 1. Available Today check (either via toggle button OR search query keyword)
      if ((isAvailableTodayOnly || hasTodayIntent) && !doc.isAvailableToday) {
        return false;
      }

      // 2. Search query check
      let matchesSearch = true;
      if (q) {
        matchesSearch = doc.searchIndex.includes(q);

        if (!matchesSearch) {
          const cleaned = q.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ").replace(/\s+/g, " ").trim();
          const tokens = cleaned.split(" ").filter((t) => t.length > 1 && t !== "dr" && t !== "ডাঃ" && t !== "doctor");
          if (tokens.length > 0) {
            matchesSearch = tokens.every((token) => doc.searchIndex.includes(token));
          }
        }
      }

      // 3. Department check
      const matchesDept =
        selectedDept === "all" ||
        doc.department === selectedDept ||
        (selectedDept === "diabetes" && isDiabetesDoctor(doc));

      // 4. Upazila check
      const matchesUpazila = selectedUpazila === "all" || doc.resolvedUpazila === selectedUpazila;

      // 5. Hospital / Chamber check
      const matchesChamber =
        selectedChamber === "all" || matchesHospitalDoctor(doc, selectedChamber);

      return matchesSearch && matchesDept && matchesUpazila && matchesChamber;
    });
  }, [doctorsWithUpazila, searchQuery, isAvailableTodayOnly, selectedDept, selectedUpazila, selectedChamber]);

  const displayedDoctors = limit ? filteredDoctors.slice(0, limit) : filteredDoctors.slice(0, visibleCount);

  const deptSeo = getDepartmentSeoConfig(selectedDept);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Screen Reader Live Announcement */}
      <div aria-live="polite" role="status" aria-atomic="true" className="sr-only">
        {`${toBanglaNums(filteredDoctors.length)} জন ডাক্তার পাওয়া গেছে`}
      </div>

      {/* Contextual Department SEO Hero if a specialty is selected */}
      {!isDepartmentPage && !isLocationPage && deptSeo && (
        <DepartmentSeoHero
          seoConfig={deptSeo}
          matchingDoctorsCount={filteredDoctors.length}
          onReset={() => handleDeptChange("all")}
        />
      )}

      {/* Search Bar, Symptom Hint Chips & Available Today Toggle */}
      <div className="space-y-3.5 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            aria-label="ডাক্তারের নাম, লক্ষণ, রোগ, হাসপাতাল বা বিশেষজ্ঞতা দিয়ে খুঁজুন"
            placeholder="ডাক্তারের নাম, লক্ষণ (যেমন: জন্ডিস, হাঁপানি), হাসপাতাল বা বিশেষজ্ঞতা দিয়ে খুঁজুন..."
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

        {/* Quick Symptom & Disease Hint Chips */}
        <SymptomHintChips
          activeSearchQuery={searchQuery}
          onSelectSymptom={(term) => {
            setSearchQuery(term);
            setVisibleCount(INITIAL_VISIBLE_COUNT);
          }}
          onClear={() => {
            setSearchQuery("");
            setVisibleCount(INITIAL_VISIBLE_COUNT);
          }}
        />

        {/* Real-Time "Available Today" Filter Toggle */}
        <div className="flex items-center justify-center pt-0.5">
          <AvailableTodayToggle
            isActive={isAvailableTodayOnly}
            onToggle={() => {
              setIsAvailableTodayOnly((prev) => !prev);
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
            count={availableTodayCount}
            dayNameBn={todayInfo.nameBn}
          />
        </div>
      </div>

      {/* Upazila / Area Location Filter Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>উপজেলা / এলাকা অনুযায়ী খুঁজুন</span>
          </span>
          {(isAvailableTodayOnly || selectedUpazila !== "all" || selectedDept !== "all" || selectedChamber !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-primary hover:underline font-semibold cursor-pointer"
            >
              ফিল্টার মুছুন
            </button>
          )}
        </div>

        {/* Upazila Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none sm:flex-wrap sm:justify-center">
          {FENI_UPAZILAS.map((upz) => {
            const isSelected = selectedUpazila === upz.id;
            const count = upazilaCounts[upz.id] || 0;
            const href = upz.id === "all" ? "/consultants" : `/consultants/location/${upz.id}`;
            const pillClass = `flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              isSelected
                ? "bg-primary text-white shadow-sm ring-2 ring-primary/20"
                : "bg-background hover:bg-muted text-muted-foreground border border-border/80"
            }`;
            const pillContent = (
              <>
                <MapPin className={`h-3 w-3 ${isSelected ? "text-white" : "text-primary"}`} />
                <span>{upz.nameBn}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? "bg-white/30 text-white" : "bg-muted text-muted-foreground"}`}>
                    {toBanglaNums(count)}
                  </span>
                )}
              </>
            );

            if (!isDepartmentPage) {
              return (
                <Link key={upz.id} href={href} prefetch={false} className={pillClass}>
                  {pillContent}
                </Link>
              );
            }

            return (
              <button key={upz.id} type="button" aria-pressed={isSelected} onClick={() => handleUpazilaChange(upz.id)} className={pillClass}>
                {pillContent}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hospital / Clinic Chamber Filter Bar */}
      <ChamberFilterChips
        doctors={doctorsWithUpazila}
        selectedChamber={selectedChamber}
        onSelectChamber={(chamberId) => {
          setSelectedChamber(chamberId);
          setVisibleCount(INITIAL_VISIBLE_COUNT);
        }}
        onClear={() => {
          setSelectedChamber("all");
          setVisibleCount(INITIAL_VISIBLE_COUNT);
        }}
      />

      {/* Department Filter Bar */}
      <DepartmentFilterBar
        selectedDept={selectedDept}
        departmentCounts={departmentCounts}
        onDeptChange={handleDeptChange}
        isDepartmentPage={isDepartmentPage}
      />

      {/* Doctors Grid */}
      {displayedDoctors.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
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
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold border-border hover:bg-muted cursor-pointer"
              >
                আরও ডাক্তার দেখুন ({toBanglaNums(filteredDoctors.length - displayedDoctors.length)} জন বাকি)
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="p-8 sm:p-12 text-center rounded-2xl border-dashed border-2 border-border/80 bg-muted/10">
          <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white mb-1">
            কোনো ডাক্তার পাওয়া যায়নি
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-4">
            {isAvailableTodayOnly
              ? `আজ (${todayInfo.nameBn}) আপনার ফিল্টারের সাথে মিলে এমন কোনো ডাক্তারের নিয়মিত চেম্বার পাওয়া যায়নি। অন্যান্য দিন বা বিভাগে দেখতে ফিল্টার রিসেট করুন।`
              : "অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড বা বিভাগ দিয়ে পুনরায় চেষ্টা করুন।"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="rounded-xl cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </Button>
        </Card>
      )}

      {/* Modals */}
      {activeSerialDoctor && (
        <DoctorSerialModal
          doctor={activeSerialDoctor}
          onClose={() => setActiveSerialDoctor(null)}
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
        />
      )}
    </div>
  );
}
