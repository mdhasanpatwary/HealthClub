"use client";

import React from "react";
import { Sparkles, X } from "lucide-react";
import { POPULAR_SYMPTOM_CHIPS, PopularSymptomChip } from "@/components/consultants/consultantData";

interface SymptomHintChipsProps {
  activeSearchQuery: string;
  onSelectSymptom: (searchTerm: string) => void;
  onClear: () => void;
}

export function SymptomHintChips({
  activeSearchQuery,
  onSelectSymptom,
  onClear,
}: SymptomHintChipsProps) {
  const normalizedQuery = activeSearchQuery.trim().toLowerCase();

  return (
    <div className="space-y-1.5" role="region" aria-label="জনপ্রিয় স্বাস্থ্য লক্ষণ ও রোগ ফিল্টার">
      <div className="flex items-center gap-1.5 px-1">
        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          জনপ্রিয় লক্ষণ বা রোগ অনুযায়ী খুঁজুন
        </span>
      </div>

      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none sm:flex-wrap"
        role="group"
        aria-label="জনপ্রিয় স্বাস্থ্য সমস্যা তালিকা"
      >
        {POPULAR_SYMPTOM_CHIPS.map((chip: PopularSymptomChip) => {
          const chipTerm = chip.searchTerm.toLowerCase();
          const isActive =
            normalizedQuery === chipTerm ||
            (normalizedQuery.length > 0 &&
              (normalizedQuery.includes(chipTerm) || chipTerm.includes(normalizedQuery)));

          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                if (isActive) {
                  onClear();
                } else {
                  onSelectSymptom(chip.searchTerm);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? "bg-primary text-white shadow-xs ring-2 ring-primary/20 scale-[1.02]"
                  : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80"
              }`}
            >
              <span>{chip.labelBn}</span>
              {isActive && <X className="h-3 w-3 text-white/90 ml-0.5" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
