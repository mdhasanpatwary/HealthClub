"use client";

import { useState, useMemo } from "react";
import { AMBULANCE_TYPES, AmbulanceService } from "@/data/emergencyData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Search, PlusCircle, Activity, Wind, Snowflake } from "lucide-react";
import { AmbulanceRegisterDialog } from "./AmbulanceRegisterDialog";
import { AmbulanceCard } from "./AmbulanceCard";

interface AmbulanceDirectoryProps {
  initialAmbulances?: AmbulanceService[];
}

export function AmbulanceDirectory({ initialAmbulances = [] }: AmbulanceDirectoryProps) {
  const [selectedAmbulanceType, setSelectedAmbulanceType] = useState<string>("all");
  const [ambulanceSearch, setAmbulanceSearch] = useState<string>("");
  const [isAmbulanceRegisterOpen, setIsAmbulanceRegisterOpen] = useState(false);

  const ambulancesList = useMemo(() => initialAmbulances ?? [], [initialAmbulances]);

  // Filtered ambulances
  const filteredAmbulances = useMemo(() => {
    return ambulancesList.filter((amb: AmbulanceService) => {
      if (amb.status === "pending") return false;
      const matchType = selectedAmbulanceType === "all" || amb.type === selectedAmbulanceType;
      const matchSearch =
        ambulanceSearch.trim() === "" ||
        amb.name.toLowerCase().includes(ambulanceSearch.toLowerCase()) ||
        amb.phone.includes(ambulanceSearch) ||
        amb.location.toLowerCase().includes(ambulanceSearch.toLowerCase());

      return matchType && matchSearch;
    });
  }, [ambulancesList, selectedAmbulanceType, ambulanceSearch]);

  // Count by ambulance type
  const ambulanceCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    ambulancesList.forEach((a) => {
      if (a.status !== "pending") {
        counts.all = (counts.all || 0) + 1;
        counts[a.type] = (counts[a.type] || 0) + 1;
      }
    });
    return counts;
  }, [ambulancesList]);

  return (
    <div className="space-y-4">
      {/* Screen Reader Live Announcement */}
      <div aria-live="polite" role="status" aria-atomic="true" className="sr-only">
        {filteredAmbulances.length}টি অ্যাম্বুলেন্স সেবা পাওয়া গেছে
      </div>

      {/* Header Action Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
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
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shrink-0 rounded-xl"
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
            onClick={() => setSelectedAmbulanceType("all")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedAmbulanceType === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground border border-border/50"
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            <span>সকল অ্যাম্বুলেন্স</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/15 dark:bg-white/15">
              {ambulanceCounts.all}
            </span>
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
                onClick={() => setSelectedAmbulanceType(typeObj.id)}
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
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/15 dark:bg-white/15">
                  {ambulanceCounts[typeObj.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Ambulance Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="অ্যাম্বুলেন্সের নাম, চালক, এলাকা বা ফোন নম্বর দিয়ে খুঁজুন"
            placeholder="অ্যাম্বুলেন্সের নাম, চালক, এলাকা বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={ambulanceSearch}
            onChange={(e) => setAmbulanceSearch(e.target.value)}
            className="pl-9.5 h-10 bg-background text-sm rounded-xl border-border"
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-muted-foreground">
          মোট {filteredAmbulances.length}টি অ্যাম্বুলেন্স সেবা পাওয়া গেছে
        </p>
      </div>

      {filteredAmbulances.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAmbulances.map((amb) => (
            <AmbulanceCard key={amb.id} ambulance={amb} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-muted/40 rounded-2xl border border-dashed border-border space-y-2">
          <Truck className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-muted-foreground">
            আপনার অনুসন্ধানের সাথে মিলে এমন কোনো অ্যাম্বুলেন্স পাওয়া যায়নি।
          </p>
        </div>
      )}

      {/* Registration Dialog */}
      <AmbulanceRegisterDialog open={isAmbulanceRegisterOpen} onOpenChange={setIsAmbulanceRegisterOpen} />
    </div>
  );
}
