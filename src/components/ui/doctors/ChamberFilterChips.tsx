"use client";

import React, { useMemo } from "react";
import { Building2, X } from "lucide-react";
import { Doctor } from "@/services/db";
import { FENI_HOSPITALS_DIRECTORY, matchesHospitalDoctor } from "@/data/feniHospitalsData";
import { toBanglaNums } from "@/lib/utils";

interface ChamberFilterChipsProps {
  doctors: Doctor[];
  selectedChamber: string;
  onSelectChamber: (chamberId: string) => void;
  onClear: () => void;
}

export function ChamberFilterChips({
  doctors,
  selectedChamber,
  onSelectChamber,
  onClear,
}: ChamberFilterChipsProps) {
  // Precompute doctor count for each hospital
  const hospitalCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const hospital of FENI_HOSPITALS_DIRECTORY) {
      counts[hospital.id] = doctors.filter((doc) =>
        matchesHospitalDoctor(doc, hospital.id)
      ).length;
    }
    return counts;
  }, [doctors]);

  // Only show hospitals that have active doctors in the dataset (or top featured ones)
  const visibleHospitals = useMemo(() => {
    return FENI_HOSPITALS_DIRECTORY.filter(
      (h) => (hospitalCounts[h.id] || 0) > 0 || h.featured
    );
  }, [hospitalCounts]);

  return (
    <div className="space-y-1.5" role="region" aria-label="হাসপাতাল ও চেম্বার ফিল্টার">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>হাসপাতাল ও চেম্বার অনুযায়ী ডাক্তার খুঁজুন</span>
        </span>
        {selectedChamber !== "all" && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-primary hover:underline font-semibold cursor-pointer"
          >
            চেম্বার মুছুন
          </button>
        )}
      </div>

      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none sm:flex-wrap"
        role="group"
        aria-label="হাসপাতাল তালিকা"
      >
        {/* All Chambers Pill */}
        <button
          type="button"
          aria-pressed={selectedChamber === "all"}
          onClick={onClear}
          className={`flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            selectedChamber === "all"
              ? "bg-secondary text-white shadow-xs ring-2 ring-secondary/20"
              : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80"
          }`}
        >
          <span>সকল হাসপাতাল ও চেম্বার</span>
        </button>

        {visibleHospitals.map((hospital) => {
          const isSelected = selectedChamber === hospital.id;
          const count = hospitalCounts[hospital.id] || 0;

          return (
            <button
              key={hospital.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                if (isSelected) {
                  onClear();
                } else {
                  onSelectChamber(hospital.id);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-primary text-white shadow-xs ring-2 ring-primary/20 scale-[1.02]"
                  : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80"
              }`}
            >
              <span>{hospital.shortNameBn}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? "bg-white/30 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {toBanglaNums(count)}
                </span>
              )}
              {isSelected && <X className="h-3 w-3 text-white/90 ml-0.5" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
