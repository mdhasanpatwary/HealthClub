"use client";

import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AMBULANCE_TYPES, AmbulanceService } from "@/data/emergencyData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Truck, Search, PlusCircle, Activity, Wind, Snowflake, X, Loader2 } from "lucide-react";
import { AmbulanceRegisterDialog } from "./AmbulanceRegisterDialog";
import { AmbulanceCard } from "./AmbulanceCard";
import { toBanglaNums } from "@/lib/utils";

interface AmbulanceDirectoryProps {
  ambulances?: AmbulanceService[];
  initialAmbulances?: AmbulanceService[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  currentType?: string;
  currentSearch?: string;
  counts?: Record<string, number>;
}

export function AmbulanceDirectory({
  ambulances: initialAmbulancesList,
  initialAmbulances,
  totalItems: initialTotalItems,
  totalPages: initialTotalPages,
  currentPage: initialCurrentPage = 1,
  pageSize = 8,
  currentType = "all",
  currentSearch = "",
  counts: initialCounts,
}: AmbulanceDirectoryProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAmbulanceRegisterOpen, setIsAmbulanceRegisterOpen] = useState(false);

  // Support both ambulances and fallback initialAmbulances
  const ambulances = initialAmbulancesList ?? initialAmbulances ?? [];
  const totalItems = initialTotalItems ?? ambulances.length;
  const totalPages = initialTotalPages ?? Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = initialCurrentPage;

  const [ambulanceSearch, setAmbulanceSearch] = useState(currentSearch);
  const [prevSearch, setPrevSearch] = useState(currentSearch);
  const [selectedAmbulanceType, setSelectedAmbulanceType] = useState(currentType);
  const [prevType, setPrevType] = useState(currentType);

  // Sync state if server props update externally (e.g. browser back/forward or server re-render)
  if (currentSearch !== prevSearch) {
    setPrevSearch(currentSearch);
    setAmbulanceSearch(currentSearch);
  }
  if (currentType !== prevType) {
    setPrevType(currentType);
    setSelectedAmbulanceType(currentType);
  }

  const createUrl = useCallback(
    (overrides: { page?: number; type?: string; search?: string }) => {
      const p = overrides.page !== undefined ? overrides.page : currentPage;
      const t = overrides.type !== undefined ? overrides.type : selectedAmbulanceType;
      const q = overrides.search !== undefined ? overrides.search : ambulanceSearch;

      const params = new URLSearchParams();
      if (p > 1) params.set("page", String(p));
      if (t && t !== "all") params.set("type", t);
      if (q.trim()) params.set("search", q.trim());

      const qs = params.toString();
      return `/emergency/ambulances${qs ? `?${qs}` : ""}`;
    },
    [currentPage, selectedAmbulanceType, ambulanceSearch]
  );

  const navigate = useCallback(
    (
      overrides: { page?: number; type?: string; search?: string },
      shouldScrollTop = false
    ) => {
      const targetUrl = createUrl(overrides);
      startTransition(() => {
        router.push(targetUrl, { scroll: false });
        if (shouldScrollTop && containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    },
    [createUrl, router]
  );

  // Debounced search query synchronization
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ambulanceSearch.trim() !== currentSearch.trim()) {
        navigate({ search: ambulanceSearch, page: 1 });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [ambulanceSearch, currentSearch, navigate]);

  const handleTypeSelect = (typeId: string) => {
    if (typeId === selectedAmbulanceType) return;
    setSelectedAmbulanceType(typeId);
    navigate({ type: typeId, page: 1 });
  };

  const handleClearSearch = () => {
    setAmbulanceSearch("");
    navigate({ search: "", page: 1 });
  };

  const handleResetFilters = () => {
    setAmbulanceSearch("");
    setSelectedAmbulanceType("all");
    navigate({ type: "all", search: "", page: 1 });
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const isFiltered = ambulanceSearch !== "" || selectedAmbulanceType !== "all";

  // Counts fallback
  const counts = initialCounts ?? { all: totalItems };

  return (
    <div ref={containerRef} className="space-y-4 scroll-mt-20">
      {/* Screen Reader Live Announcement */}
      <div aria-live="polite" role="status" aria-atomic="true" className="sr-only">
        {totalItems}টি অ্যাম্বুলেন্স সেবা পাওয়া গেছে
      </div>

      {/* Header Action Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            ২৪/৭ ফেনী জরুরি অ্যাম্বুলেন্স সেবা
          </h3>
          <p className="text-xs text-muted-foreground">
            ফেনী ও মহাসড়কে জরুরি রোগীর জন্য আইসিইউ, এসি, নন-এসি ও ফ্রিজিং অ্যাম্বুলেন্সের সরাসরি যোগাযোগ নম্বর।
          </p>
        </div>
        <Button
          onClick={() => setIsAmbulanceRegisterOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shrink-0 rounded-xl cursor-pointer"
          size="sm"
        >
          <PlusCircle className="mr-1.5 h-4 w-4" />
          অ্যাম্বুলেন্স যুক্ত করুন
        </Button>
      </div>

      {/* Vehicle Type Filter Chips */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            type="button"
            role="button"
            aria-pressed={selectedAmbulanceType === "all"}
            onClick={() => handleTypeSelect("all")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedAmbulanceType === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground border border-border/50"
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            <span>সকল অ্যাম্বুলেন্স</span>
            {counts.all !== undefined && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/15 dark:bg-white/15">
                {counts.all}
              </span>
            )}
          </button>

          {AMBULANCE_TYPES.map((typeObj) => {
            const isSelected = selectedAmbulanceType === typeObj.id;
            const TypeIcon =
              typeObj.id === "ICU"
                ? Activity
                : typeObj.id === "AC"
                ? Wind
                : typeObj.id === "Freezer"
                ? Snowflake
                : Truck;

            return (
              <button
                type="button"
                role="button"
                key={typeObj.id}
                aria-pressed={isSelected}
                onClick={() => handleTypeSelect(typeObj.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? typeObj.id === "ICU"
                      ? "bg-rose-600 text-white shadow-xs"
                      : typeObj.id === "AC"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : typeObj.id === "Freezer"
                      ? "bg-cyan-600 text-white shadow-xs"
                      : "bg-slate-700 text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                <TypeIcon className="h-3.5 w-3.5" />
                <span>{typeObj.nameBn}</span>
                {counts[typeObj.id] !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/15 dark:bg-white/15">
                    {counts[typeObj.id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Ambulance Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            aria-label="অ্যাম্বুলেন্সের নাম, চালক, এলাকা বা ফোন নম্বর দিয়ে খুঁজুন"
            placeholder="অ্যাম্বুলেন্সের নাম, চালক, এলাকা বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={ambulanceSearch}
            onChange={(e) => setAmbulanceSearch(e.target.value)}
            className="pl-9.5 pr-9 h-10 bg-background text-sm rounded-xl border-border"
          />
          {ambulanceSearch && (
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
      </div>

      {/* Donors/Ambulance Count Summary & Loading Indicator */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground font-semibold">
          <span>
            মোট {toBanglaNums(totalItems)}টি সেবার মধ্যে{" "}
            {totalItems > 0 ? (
              <>
                {toBanglaNums(startItem)}–{toBanglaNums(endItem)}টি প্রদর্শিত
              </>
            ) : (
              "০টি"
            )}
          </span>
          {isPending && (
            <span className="inline-flex items-center gap-1 text-primary font-bold animate-pulse">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>লোড হচ্ছে...</span>
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-primary hover:underline font-bold cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        )}
      </div>

      {/* Ambulances Grid */}
      <div
        className={`transition-opacity duration-200 ${
          isPending ? "opacity-60 pointer-events-none" : "opacity-100"
        }`}
      >
        {ambulances.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ambulances.map((amb) => (
              <AmbulanceCard key={amb.id} ambulance={amb} />
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center bg-muted/40 rounded-2xl border border-dashed border-border space-y-3">
            <Truck className="h-8 w-8 text-muted-foreground mx-auto" />
            <h4 className="text-base font-bold text-foreground font-heading">
              কোনো অ্যাম্বুলেন্স সেবা পাওয়া যায়নি
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোনো অ্যাম্বুলেন্স পাওয়া যায়নি। ভিন্ন ক্যাটাগরি বা শব্দ দিয়ে আবার চেষ্টা করুন।
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="rounded-xl border-border/80 text-xs font-semibold cursor-pointer"
              >
                সকল অ্যাম্বুলেন্স দেখুন
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Server-Side Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            getPageUrl={(page) => createUrl({ page })}
            onPageChange={(page) => navigate({ page }, true)}
            disabled={isPending}
            itemLabel="টি অ্যাম্বুলেন্স সেবা"
            className="rounded-2xl border border-border/70 bg-card shadow-xs"
          />
        </div>
      )}

      {/* Registration Dialog */}
      <AmbulanceRegisterDialog open={isAmbulanceRegisterOpen} onOpenChange={setIsAmbulanceRegisterOpen} />
    </div>
  );
}
