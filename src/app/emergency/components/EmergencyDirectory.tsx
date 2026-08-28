"use client";

import { useState, useMemo } from "react";
import {
  UPAZILAS_FENI,
  BLOOD_GROUPS,
  AMBULANCE_TYPES,
  BloodDonor,
  AmbulanceService,
  EmergencyHotline,
  INITIAL_BLOOD_DONORS,
  INITIAL_AMBULANCES,
  INITIAL_EMERGENCY_HOTLINES,
} from "@/data/emergencyData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Heart,
  PhoneCall,
  Truck,
  PhoneForwarded,
  Search,
  PlusCircle,
  Sparkles,
  Activity,
  Wind,
  Snowflake,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { BloodDonorRegisterDialog } from "./BloodDonorRegisterDialog";
import { AmbulanceRegisterDialog } from "./AmbulanceRegisterDialog";
import { AmbulanceCard } from "./AmbulanceCard";
import { BloodDonorCard } from "./BloodDonorCard";
import { trackEvent } from "@/lib/analytics";

interface EmergencyDirectoryProps {
  initialBloodDonors?: BloodDonor[];
  initialAmbulances?: AmbulanceService[];
  initialHotlines?: EmergencyHotline[];
}

export function EmergencyDirectory({
  initialBloodDonors = INITIAL_BLOOD_DONORS,
  initialAmbulances = INITIAL_AMBULANCES,
  initialHotlines = INITIAL_EMERGENCY_HOTLINES,
}: EmergencyDirectoryProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [activeTab, setActiveTab] = useState<"donors" | "ambulances" | "hotlines">("donors");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAmbulanceRegisterOpen, setIsAmbulanceRegisterOpen] = useState(false);

  const [selectedAmbulanceType, setSelectedAmbulanceType] = useState<string>("all");
  const [ambulanceSearch, setAmbulanceSearch] = useState<string>("");

  const donorsList =
    initialBloodDonors && initialBloodDonors.length > 0
      ? initialBloodDonors
      : INITIAL_BLOOD_DONORS;

  const ambulancesList =
    initialAmbulances && initialAmbulances.length > 0
      ? initialAmbulances
      : INITIAL_AMBULANCES;

  const hotlinesList =
    initialHotlines && initialHotlines.length > 0
      ? initialHotlines
      : INITIAL_EMERGENCY_HOTLINES;

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

  // Filtered ambulances
  const filteredAmbulances = useMemo(() => {
    return ambulancesList.filter((amb: AmbulanceService) => {
      if (amb.status === "pending") return false;
      const matchType = selectedAmbulanceType === "all" || amb.type === selectedAmbulanceType;
      const matchSearch =
        ambulanceSearch.trim() === "" ||
        amb.name.toLowerCase().includes(ambulanceSearch.toLowerCase()) ||
        amb.phone.includes(ambulanceSearch) ||
        amb.location.toLowerCase().includes(ambulanceSearch.toLowerCase()) ||
        amb.type.toLowerCase().includes(ambulanceSearch.toLowerCase());
      return matchType && matchSearch;
    });
  }, [ambulancesList, selectedAmbulanceType, ambulanceSearch]);

  const ambulanceCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0, AC: 0, "Non-AC": 0, ICU: 0, Freezer: 0 };
    ambulancesList.forEach((amb) => {
      if (amb.status !== "pending") {
        counts.all = (counts.all || 0) + 1;
        if (counts[amb.type] !== undefined) {
          counts[amb.type] += 1;
        }
      }
    });
    return counts;
  }, [ambulancesList]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Tab Switcher */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "donors" | "ambulances" | "hotlines")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/80 rounded-2xl">
          <TabsTrigger
            value="donors"
            className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-rose-600 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"
          >
            <Heart className="h-4 w-4 fill-rose-500/30 text-rose-600" />
            <span>{isEn ? "Blood Donors" : "রক্তদাতা"}</span>
          </TabsTrigger>
          <TabsTrigger
            value="ambulances"
            className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"
          >
            <Truck className="h-4 w-4 text-primary" />
            <span>{isEn ? "Ambulances" : "অ্যাম্বুলেন্স"}</span>
          </TabsTrigger>
          <TabsTrigger
            value="hotlines"
            className="rounded-xl text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:text-amber-600 data-[state=active]:shadow-sm flex items-center justify-center gap-1.5"
          >
            <PhoneForwarded className="h-4 w-4 text-amber-600" />
            <span>{isEn ? "Hotlines" : "জরুরি হটলাইন"}</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. Blood Donors Tab */}
        <TabsContent value="donors" className="space-y-6 pt-4">
          {/* Header Action Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20">
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-500" />
                {isEn ? "Feni Voluntary Blood Donor Directory" : "ফেনী স্বেচ্ছাসেবী রক্তদাতা ডিরেক্টরি"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEn
                  ? "Instant access to verified blood donors across Feni Sadar, Daganbhuiyan, Sonagazi, and all upazilas."
                  : "ফেনীর সকল উপজেলার রক্তের গ্রুপভিত্তিক যাচাইকৃত রক্তদাতাদের তালিকা থেকে সরাসরি যোগাযোগ করুন।"}
              </p>
            </div>
            <Button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold shrink-0 rounded-xl"
              size="sm"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" />
              {isEn ? "Become a Donor" : "রক্তদাতা হতে যুক্ত হোন"}
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
                {isEn ? "All Groups" : "সব গ্রুপ"}
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
                  aria-label={isEn ? "Search by donor name or phone" : "নাম বা ফোন দিয়ে রক্তদাতা খুঁজুন"}
                  placeholder={isEn ? "Search by donor name or phone..." : "নাম বা ফোন দিয়ে রক্তদাতা খুঁজুন..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <select
                aria-label={isEn ? "Filter donors by Feni upazila" : "উপজেলা অনুযায়ী রক্তদাতা ফিল্টার"}
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer"
              >
                {UPAZILAS_FENI.map((u) => (
                  <option key={u.id} value={u.id}>
                    {isEn ? u.nameEn : u.nameBn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Donors Count Summary */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-muted-foreground">
              {isEn
                ? `Showing ${filteredDonors.length} active blood donor(s)`
                : `মোট ${filteredDonors.length} জন সক্রিয় রক্তদাতা প্রদর্শিত`}
            </p>
          </div>

          {/* Donors Grid */}
          {filteredDonors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredDonors.map((donor) => {
                const upazilaObj = UPAZILAS_FENI.find((u) => u.id === donor.upazila);
                const areaLabel = isEn ? (upazilaObj?.nameEn || "Feni") : (upazilaObj?.nameBn || "ফেনী");

                return (
                  <BloodDonorCard
                    key={donor.id}
                    donor={donor}
                    areaLabel={areaLabel}
                    isEn={isEn}
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-muted/40 rounded-2xl border border-dashed border-border space-y-2">
              <Heart className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-muted-foreground">
                {isEn
                  ? "No blood donors found for this search criteria."
                  : "এই মুহূর্তে নির্বাচিত গ্রুপের কোনো রক্তদাতা পাওয়া যায়নি।"}
              </p>
            </div>
          )}
        </TabsContent>

        {/* 2. Ambulances Tab */}
        <TabsContent value="ambulances" className="space-y-4 pt-4">
          {/* Header Action Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base sm:text-lg text-secondary dark:text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                {isEn ? "24/7 Feni Emergency Ambulance Services" : "২৪/৭ ফেনী জরুরি অ্যাম্বুলেন্স সেবা"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEn
                  ? "Verified ICU ventilator ambulances, AC, Non-AC & Freezing carriers across Feni & highway routes."
                  : "ফেনী ও মহাসড়কে জরুরি রোগীর জন্য আইসিইউ, এসি, নন-এসি ও ফ্রিজিং অ্যাম্বুলেন্সের সরাসরি যোগাযোগ নম্বর।"}
              </p>
            </div>
            <Button
              onClick={() => setIsAmbulanceRegisterOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shrink-0 rounded-xl"
              size="sm"
            >
              <PlusCircle className="mr-1.5 h-4 w-4" />
              {isEn ? "Add Ambulance" : "অ্যাম্বুলেন্স যুক্ত করুন"}
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
                <span>{isEn ? "All Ambulances" : "সকল অ্যাম্বুলেন্স"}</span>
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
                    <span>{isEn ? typeObj.nameEn : typeObj.nameBn}</span>
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
                aria-label={
                  isEn
                    ? "Search ambulance service, driver, location, or phone"
                    : "অ্যাম্বুলেন্সের নাম, চালক, এলাকা বা ফোন নম্বর দিয়ে খুঁজুন"
                }
                placeholder={
                  isEn
                    ? "Search ambulance service, driver, location, or phone..."
                    : "অ্যাম্বুলেন্সের নাম, চালক, এলাকা বা ফোন নম্বর দিয়ে খুঁজুন..."
                }
                value={ambulanceSearch}
                onChange={(e) => setAmbulanceSearch(e.target.value)}
                className="pl-9.5 h-10 bg-background text-sm rounded-xl border-border"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-muted-foreground">
              {isEn
                ? `Showing ${filteredAmbulances.length} ambulance service(s)`
                : `মোট ${filteredAmbulances.length}টি অ্যাম্বুলেন্স সেবা পাওয়া গেছে`}
            </p>
          </div>

          {filteredAmbulances.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAmbulances.map((amb) => (
                <AmbulanceCard key={amb.id} ambulance={amb} isEn={isEn} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-muted/40 rounded-2xl border border-dashed border-border space-y-2">
              <Truck className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-muted-foreground">
                {isEn
                  ? "No ambulances found matching your criteria."
                  : "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো অ্যাম্বুলেন্স পাওয়া যায়নি।"}
              </p>
            </div>
          )}
        </TabsContent>

        {/* 3. Emergency Hotlines Tab */}
        <TabsContent value="hotlines" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotlinesList.map((hotline) => (
              <Card
                key={hotline.id}
                className="border border-border/80 bg-background hover:border-amber-500/40 transition-all duration-300 shadow-xs"
              >
                <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                      <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                      <span className="capitalize">{hotline.category.replace("_", " ")}</span>
                    </div>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-secondary dark:text-white">
                      {isEn ? hotline.titleEn : hotline.titleBn}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isEn ? hotline.descriptionEn : hotline.descriptionBn}
                    </p>
                  </div>

                  <a
                    href={`tel:${hotline.phone}`}
                    onClick={() => {
                      trackEvent("emergency_dial", {
                        service_type: "hotline",
                        target_name: hotline.titleEn || hotline.titleBn,
                        phone: hotline.phone,
                      });
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-sm transition-all"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>
                      {isEn ? "Hotline:" : "হটলাইন নম্বর:"} {hotline.phone}
                    </span>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Registration Dialogs */}
      <BloodDonorRegisterDialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen} />
      <AmbulanceRegisterDialog open={isAmbulanceRegisterOpen} onOpenChange={setIsAmbulanceRegisterOpen} />
    </div>
  );
}

