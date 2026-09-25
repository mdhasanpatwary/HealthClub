"use client";

import { useState } from "react";
import { HeartPulse, Activity } from "lucide-react";
import { BpEvaluatorTab } from "./BpEvaluatorTab";
import { DiabetesEvaluatorTab } from "./DiabetesEvaluatorTab";

export function BpDiabetesEvaluator() {
  const [activeEvaluator, setActiveEvaluator] = useState<"bp" | "diabetes">("bp");

  return (
    <div className="space-y-6">
      {/* Sub Mode Selector */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-muted/80 backdrop-blur-sm rounded-2xl border border-border/80 shadow-xs max-w-md w-full">
          <button
            type="button"
            onClick={() => setActiveEvaluator("bp")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeEvaluator === "bp"
                ? "bg-background text-rose-600 dark:text-rose-400 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HeartPulse className="h-4 w-4 shrink-0" />
            <span>রক্তচাপ মূল্যায়ন (BP)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveEvaluator("diabetes")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeEvaluator === "diabetes"
                ? "bg-background text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="h-4 w-4 shrink-0" />
            <span>ডায়াবেটিস ও শর্করা</span>
          </button>
        </div>
      </div>

      {/* Render Active Tool */}
      <div className="animate-in fade-in-50 duration-300">
        {activeEvaluator === "bp" ? <BpEvaluatorTab /> : <DiabetesEvaluatorTab />}
      </div>
    </div>
  );
}
