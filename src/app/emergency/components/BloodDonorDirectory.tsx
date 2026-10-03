"use client";

import { useState, useMemo } from "react";
import { UPAZILAS_FENI, BLOOD_GROUPS, BloodDonor } from "@/data/emergencyData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Search, PlusCircle, Sparkles } from "lucide-react";
import { BloodDonorRegisterDialog } from "./BloodDonorRegisterDialog";
import { BloodDonorCard } from "./BloodDonorCard";

interface BloodDonorDirectoryProps {
  initialBloodDonors?: BloodDonor[];
}

export function BloodDonorDirectory({ initialBloodDonors = [] }: BloodDonorDirectoryProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const donorsList = useMemo(() => initialBloodDonors ?? [], [initialBloodDonors]);

  // Filtered blood donors
  const filteredDonors = useMemo(() => {
    return donorsList.filter((donor: BloodDonor) => {
      if (donor.status === "pending") return false;
      const matchGroup = selectedGroup === "all" || donor.bloodGroup === selectedGroup;
      const matchUpazila = selectedUpazila === "all" || donor.upazila === selectedUpazila;
      const matchSearch =
        searchQuery.trim() === "" ||
        donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.phone.includes(searchQuery) ||
        donor.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase());

      return matchGroup && matchUpazila && matchSearch;
    });
  }, [donorsList, selectedGroup, selectedUpazila, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Screen Reader Live Announcement */}
      <div aria-live="polite" role="status" aria-atomic="true" className="sr-only">
        {filteredDonors.length} জন রক্তদাতা পাওয়া গেছে
      </div>

      {/* Header Action Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20">
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
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold shrink-0 rounded-xl"
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
            onClick={() => setSelectedGroup("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedGroup === "all"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            সব গ্রুপ
          </button>
          {BLOOD_GROUPS.map((bg) => (
            <button
              type="button"
              role="button"
              key={bg}
              aria-pressed={selectedGroup === bg}
              onClick={() => setSelectedGroup(bg)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedGroup === bg
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              {bg}
            </button>
          ))}
        </div>

        {/* Upazila Filter & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="নাম বা ফোন দিয়ে রক্তদাতা খুঁজুন"
              placeholder="নাম বা ফোন দিয়ে রক্তদাতা খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <select
            aria-label="উপজেলা অনুযায়ী রক্তদাতা ফিল্টার"
            value={selectedUpazila}
            onChange={(e) => setSelectedUpazila(e.target.value)}
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
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-muted-foreground">
          মোট {filteredDonors.length} জন সক্রিয় রক্তদাতা প্রদর্শিত
        </p>
      </div>

      {/* Donors Grid */}
      {filteredDonors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredDonors.map((donor) => {
            const upazilaObj = UPAZILAS_FENI.find((u) => u.id === donor.upazila);
            const areaLabel = upazilaObj?.nameBn || "ফেনী";

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
        <div className="p-8 text-center bg-muted/40 rounded-2xl border border-dashed border-border space-y-2">
          <Heart className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-muted-foreground">
            এই মুহূর্তে নির্বাচিত ফিল্টারের কোনো রক্তদাতা পাওয়া যায়নি।
          </p>
        </div>
      )}

      {/* Registration Dialog */}
      <BloodDonorRegisterDialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen} />
    </div>
  );
}
