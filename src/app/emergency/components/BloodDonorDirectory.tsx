"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { UPAZILAS_FENI, BLOOD_GROUPS, BloodDonor } from "@/data/emergencyData";
import {
  paginateBloodDonors,
  normalizeBloodGroup,
  DEFAULT_DONOR_PAGE_SIZE,
} from "../utils/bloodDonorPagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Heart, Search, PlusCircle, Sparkles, X } from "lucide-react";
import { BloodDonorRegisterDialog } from "./BloodDonorRegisterDialog";
import { BloodDonorCard } from "./BloodDonorCard";
import { toBanglaNums } from "@/lib/utils";

interface BloodDonorDirectoryProps {
  donors?: BloodDonor[];
  initialBloodDonors?: BloodDonor[];
  pageSize?: number;
}

export function BloodDonorDirectory({
  donors: passedDonors,
  initialBloodDonors,
  pageSize = DEFAULT_DONOR_PAGE_SIZE,
}: BloodDonorDirectoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const allDonors = useMemo(
    () => passedDonors ?? initialBloodDonors ?? [],
    [passedDonors, initialBloodDonors]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedUpazila, setSelectedUpazila] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Sync with URL query parameters on initial client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const g = normalizeBloodGroup(params.get("group") || params.get("bloodGroup") || "");
    const u = params.get("upazila");
    const q = params.get("search");
    const p = parseInt(params.get("page") || "1", 10);
    queueMicrotask(() => {
      if (g && g !== "all") setSelectedGroup(g);
      if (u) setSelectedUpazila(u);
      if (q) setSearchQuery(q);
      if (p > 1) setCurrentPage(p);
    });
  }, []);

  const paginatedResult = useMemo(() => {
    return paginateBloodDonors(allDonors, {
      page: currentPage,
      pageSize,
      group: selectedGroup,
      upazila: selectedUpazila,
      search: searchQuery,
    });
  }, [allDonors, currentPage, pageSize, selectedGroup, selectedUpazila, searchQuery]);

  const displayedDonors = paginatedResult.donors;
  const totalItems = paginatedResult.totalItems;
  const totalPages = paginatedResult.totalPages;

  // Sync URL in address bar without triggering Next.js server actions / RSC
  const updateUrlParams = useCallback((p: number, g: string, u: string, q: string) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (g && g !== "all") params.set("group", g);
    if (u && u !== "all") params.set("upazila", u);
    if (q.trim()) params.set("search", q.trim());
    const qs = params.toString();
    const newPath = `/emergency/blood-donors${qs ? `?${qs}` : ""}`;
    window.history.replaceState(null, "", newPath);
  }, []);

  const handleGroupSelect = (group: string) => {
    if (group === selectedGroup) return;
    setSelectedGroup(group);
    setCurrentPage(1);
    updateUrlParams(1, group, selectedUpazila, searchQuery);
  };

  const handleUpazilaChange = (upazila: string) => {
    if (upazila === selectedUpazila) return;
    setSelectedUpazila(upazila);
    setCurrentPage(1);
    updateUrlParams(1, selectedGroup, upazila, searchQuery);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    updateUrlParams(1, selectedGroup, selectedUpazila, val);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    updateUrlParams(1, selectedGroup, selectedUpazila, "");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGroup("all");
    setSelectedUpazila("all");
    setCurrentPage(1);
    updateUrlParams(1, "all", "all", "");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams(page, selectedGroup, selectedUpazila, searchQuery);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const isFiltered = searchQuery !== "" || selectedGroup !== "all" || selectedUpazila !== "all";

  return (
    <div ref={containerRef} className="space-y-6 scroll-mt-20">
      {/* Screen Reader Live Announcement */}
      <div aria-live="polite" role="status" aria-atomic="true" className="sr-only">
        মোট {totalItems} জন রক্তদাতা পাওয়া গেছে
      </div>

      {/* Header Action Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-linear-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-rose-500" />
            ফেনী স্বেচ্ছাসেবী রক্তদাতা ডিরেক্টরি
          </h3>
          <p className="text-xs text-muted-foreground">
            ফেনীর সকল উপজেলার রক্তের গ্রুপভিত্তিক যাচাইকৃত রক্তদাতাদের তালিকা থেকে সরাসরি যোগাযোগ করুন।
          </p>
        </div>
        <Button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold shrink-0 rounded-xl cursor-pointer"
          size="sm"
        >
          <PlusCircle className="mr-1.5 h-4 w-4" />
          রক্তদাতা হতে যুক্ত হোন
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="space-y-3">
        {/* Blood Group Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            role="button"
            aria-pressed={selectedGroup === "all"}
            onClick={() => handleGroupSelect("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedGroup === "all"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            সব গ্রুপ
          </button>
          {BLOOD_GROUPS.map((bg) => {
            const isSelected = selectedGroup === bg;
            return (
              <button
                type="button"
                role="button"
                key={bg}
                aria-pressed={isSelected}
                onClick={() => handleGroupSelect(bg)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                {bg}
              </button>
            );
          })}
        </div>

        {/* Upazila Filter & Search Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              aria-label="নাম বা ফোন দিয়ে রক্তদাতা খুঁজুন"
              placeholder="নাম বা ফোন দিয়ে রক্তদাতা খুঁজুন..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-9 bg-background"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="সার্চ মুছুন"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            aria-label="উপজেলা অনুযায়ী রক্তদাতা ফিল্টার"
            value={selectedUpazila}
            onChange={(e) => handleUpazilaChange(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer"
          >
            {UPAZILAS_FENI.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nameBn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Donors Count Summary */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground font-semibold">
          <span>
            মোট {toBanglaNums(totalItems)} জন সক্রিয় রক্তদাতার মধ্যে{" "}
            {totalItems > 0 ? (
              <>
                {toBanglaNums(startItem)}–{toBanglaNums(endItem)} জন প্রদর্শিত
              </>
            ) : (
              "০ জন"
            )}
          </span>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        )}
      </div>

      {/* Donors Grid */}
      <div>
        {displayedDonors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {displayedDonors.map((donor) => {
              const upazilaObj = UPAZILAS_FENI.find(
                (u) => u.id === donor.upazila || u.nameBn === donor.upazila
              );
              const areaLabel = upazilaObj?.nameBn || donor.upazila || "ফেনী";

              return (
                <BloodDonorCard
                  key={donor.id}
                  donor={donor}
                  areaLabel={areaLabel}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center bg-muted/40 rounded-2xl border border-dashed border-border space-y-3">
            <Heart className="h-8 w-8 text-rose-500/60 mx-auto" />
            <h4 className="text-base font-bold text-foreground font-heading">
              কোনো রক্তদাতা পাওয়া যায়নি
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              এই মুহূর্তে নির্বাচিত ফিল্টারের কোনো সক্রিয় রক্তদাতা পাওয়া যায়নি। ভিন্ন রক্তের গ্রুপ বা উপজেলা নির্বাচন করে আবার চেষ্টা করুন।
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="rounded-xl border-border/80 text-xs font-semibold cursor-pointer"
              >
                সকল রক্তদাতা দেখুন
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            getPageUrl={(page) => `#page-${page}`}
            onPageChange={(page) => handlePageChange(page)}
            itemLabel="জন রক্তদাতা"
            className="rounded-2xl border border-border/70 bg-card shadow-xs"
          />
        </div>
      )}

      {/* Registration Dialog */}
      <BloodDonorRegisterDialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen} />
    </div>
  );
}
