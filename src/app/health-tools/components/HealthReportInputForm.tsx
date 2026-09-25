"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  HeartPulse,
  Activity,
  Eye,
} from "lucide-react";

interface HealthReportInputFormProps {
  mobileTab: "form" | "preview";
  setMobileTab: (tab: "form" | "preview") => void;
  name: string;
  setName: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
  gender: "male" | "female";
  setGender: (v: "male" | "female") => void;
  unit: "ft" | "cm";
  setUnit: (v: "ft" | "cm") => void;
  feet: string;
  setFeet: (v: string) => void;
  inches: string;
  setInches: (v: string) => void;
  cm: string;
  setCm: (v: string) => void;
  weightKg: string;
  setWeightKg: (v: string) => void;
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  setActivityLevel: (v: "sedentary" | "light" | "moderate" | "active") => void;
  systolic: string;
  setSystolic: (v: string) => void;
  diastolic: string;
  setDiastolic: (v: string) => void;
  glucose: string;
  setGlucose: (v: string) => void;
  glucoseContext: "fasting" | "post_meal";
  setGlucoseContext: React.Dispatch<React.SetStateAction<"fasting" | "post_meal">>;
}

export function HealthReportInputForm({
  mobileTab,
  setMobileTab,
  name,
  setName,
  age,
  setAge,
  gender,
  setGender,
  unit,
  setUnit,
  feet,
  setFeet,
  inches,
  setInches,
  cm,
  setCm,
  weightKg,
  setWeightKg,
  activityLevel,
  setActivityLevel,
  systolic,
  setSystolic,
  diastolic,
  setDiastolic,
  glucose,
  setGlucose,
  glucoseContext,
  setGlucoseContext,
}: HealthReportInputFormProps) {
  return (
    <div className={`lg:col-span-7 space-y-3.5 ${mobileTab === "form" ? "block" : "hidden lg:block"}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs sm:text-sm font-bold text-foreground font-heading">
          শারীরিক তথ্য ও ভাইটালস
        </h4>
        <span className="text-[10px] text-muted-foreground">
          লাইভ সিঙ্ক
        </span>
      </div>

      {/* Name & Age & Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="space-y-1">
          <Label className="text-[11px] sm:text-xs font-semibold">
            আপনার নাম (ঐচ্ছিক)
          </Label>
          <Input
            placeholder="যেমন: মেম্বার"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 sm:h-9 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] sm:text-xs font-semibold">
            বয়স (বছর)
          </Label>
          <Input
            type="number"
            min="5"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="h-8 sm:h-9 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] sm:text-xs font-semibold">
            লিঙ্গ
          </Label>
          <div className="grid grid-cols-2 gap-1 bg-muted p-0.5 rounded-lg h-8 sm:h-9 items-center">
            <button
              type="button"
              onClick={() => setGender("male")}
              className={`text-[11px] sm:text-xs py-1 rounded-md font-semibold transition-all cursor-pointer ${
                gender === "male"
                  ? "bg-background text-primary shadow-xs"
                  : "text-muted-foreground"
              }`}
            >
              পুরুষ
            </button>
            <button
              type="button"
              onClick={() => setGender("female")}
              className={`text-[11px] sm:text-xs py-1 rounded-md font-semibold transition-all cursor-pointer ${
                gender === "female"
                  ? "bg-background text-pink-600 shadow-xs"
                  : "text-muted-foreground"
              }`}
            >
              মহিলা
            </button>
          </div>
        </div>
      </div>

      {/* Height & Weight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-muted/30 p-2.5 sm:p-3 rounded-2xl border border-border/60">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] sm:text-xs font-semibold">
              উচ্চতা
            </Label>
            <div className="inline-flex text-[9px] bg-muted rounded p-0.5">
              <button
                type="button"
                onClick={() => setUnit("ft")}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${unit === "ft" ? "bg-background text-primary font-bold shadow-xs" : "text-muted-foreground"}`}
              >
                ft/in
              </button>
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${unit === "cm" ? "bg-background text-primary font-bold shadow-xs" : "text-muted-foreground"}`}
              >
                cm
              </button>
            </div>
          </div>
          {unit === "ft" ? (
            <div className="grid grid-cols-2 gap-1.5">
              <Input
                type="number"
                placeholder="ফুট"
                value={feet}
                onChange={(e) => setFeet(e.target.value)}
                className="h-8 sm:h-9 text-xs"
              />
              <Input
                type="number"
                placeholder="ইঞ্চি"
                value={inches}
                onChange={(e) => setInches(e.target.value)}
                className="h-8 sm:h-9 text-xs"
              />
            </div>
          ) : (
            <Input
              type="number"
              placeholder="cm"
              value={cm}
              onChange={(e) => setCm(e.target.value)}
              className="h-8 sm:h-9 text-xs"
            />
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] sm:text-xs font-semibold">
            ওজন (কেজি)
          </Label>
          <Input
            type="number"
            step="0.5"
            placeholder="kg"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="h-8 sm:h-9 text-xs"
          />
        </div>
      </div>

      {/* Activity Level */}
      <div className="space-y-1">
        <Label className="text-[11px] sm:text-xs font-semibold">
          দৈনিক কায়িক পরিশ্রম
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11px]">
          {(
            [
              { id: "sedentary", bn: "বসে কাজ" },
              { id: "light", bn: "হালকা হাঁটা" },
              { id: "moderate", bn: "মাঝারি" },
              { id: "active", bn: "সক্রিয়" },
            ] as const
          ).map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setActivityLevel(lvl.id)}
              className={`py-1.5 px-2 rounded-xl text-center border font-medium transition-all cursor-pointer ${
                activityLevel === lvl.id
                  ? "bg-primary/10 border-primary text-primary font-bold shadow-xs"
                  : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
              }`}
            >
              {lvl.bn}
            </button>
          ))}
        </div>
      </div>

      {/* Blood Pressure & Blood Sugar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-muted/30 p-2.5 sm:p-3 rounded-2xl border border-border/60">
        <div className="space-y-1">
          <Label className="text-[11px] sm:text-xs font-semibold flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <HeartPulse className="h-3 w-3" />
            <span>রক্তচাপ (Sys / Dia)</span>
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            <Input
              type="number"
              placeholder="Sys"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="h-8 sm:h-9 text-xs"
            />
            <Input
              type="number"
              placeholder="Dia"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="h-8 sm:h-9 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] sm:text-xs font-semibold flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Activity className="h-3 w-3" />
              <span>শর্করা (mmol/L)</span>
            </Label>
            <button
              type="button"
              onClick={() =>
                setGlucoseContext((prev) => (prev === "fasting" ? "post_meal" : "fasting"))
              }
              className="text-[9px] text-primary hover:underline font-semibold cursor-pointer"
            >
              {glucoseContext === "fasting" ? "খালি পেট" : "খাওয়ার পর"}
            </button>
          </div>
          <Input
            type="number"
            step="0.1"
            placeholder="5.5"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            className="h-8 sm:h-9 text-xs"
          />
        </div>
      </div>

      {/* Mobile Quick Proceed Button */}
      <div className="pt-1 lg:hidden">
        <Button
          type="button"
          onClick={() => setMobileTab("preview")}
          className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-2 rounded-xl text-xs gap-1.5 cursor-pointer"
        >
          <span>রিপোর্ট প্রিভিউ ও প্রিন্ট দেখুন</span>
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
