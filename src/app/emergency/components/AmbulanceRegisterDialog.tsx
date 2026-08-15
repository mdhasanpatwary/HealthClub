"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UPAZILAS_FENI } from "@/data/emergencyData";
import { registerAmbulanceAction } from "@/app/actions/emergencyActions";
import { toast } from "sonner";
import { Truck, Loader2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface AmbulanceRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AMBULANCE_TYPES = [
  { id: "AC", nameEn: "AC Ambulance", nameBn: "এসি অ্যাম্বুলেন্স" },
  { id: "Non-AC", nameEn: "Non-AC Ambulance", nameBn: "নন-এসি অ্যাম্বুলেন্স" },
  { id: "ICU", nameEn: "ICU Life Support", nameBn: "আইসিইউ (ICU)" },
  { id: "Freezer", nameEn: "Freezer Van (Corpse)", nameBn: "ফ্রিজার ভ্যান (লাশবাহী)" },
];

export function AmbulanceRegisterDialog({
  open,
  onOpenChange,
}: AmbulanceRegisterDialogProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [serviceName, setServiceName] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [type, setType] = useState<string>("AC");
  const [upazila, setUpazila] = useState<string>("feni-sadar");
  const [standLocation, setStandLocation] = useState("");
  const [coverage, setCoverage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !operatorName.trim() || !phone.trim()) {
      toast.error(
        isEn
          ? "Please provide service name, driver/operator name, and phone number."
          : "অনুগ্রহ করে প্রতিষ্ঠানের নাম, চালক/মালিকের নাম ও ফোন নম্বর পূরণ করুন।"
      );
      return;
    }

    setLoading(true);
    try {
      const selectedUpazilaObj = UPAZILAS_FENI.find((u) => u.id === upazila);
      const upazilaLabel = isEn ? selectedUpazilaObj?.nameEn : selectedUpazilaObj?.nameBn;
      const fullLocation = standLocation.trim()
        ? `${upazilaLabel || upazila} (${standLocation.trim()})`
        : upazilaLabel || upazila;

      const res = await registerAmbulanceAction({
        serviceName: serviceName.trim(),
        operatorName: operatorName.trim(),
        phone: phone.trim(),
        altPhone: altPhone.trim() || undefined,
        type,
        location: fullLocation,
        coverage: coverage.trim() || undefined,
      });

      if (res.success) {
        toast.success(
          isEn
            ? "Ambulance registration submitted successfully! We will review and publish it."
            : res.message
        );
        setServiceName("");
        setOperatorName("");
        setPhone("");
        setAltPhone("");
        setStandLocation("");
        setCoverage("");
        onOpenChange(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error(
        isEn
          ? "Failed to submit ambulance registration. Please try again."
          : "নিবন্ধন জমা দেওয়া সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Truck className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center font-heading text-xl font-bold">
            {isEn ? "Register Ambulance Service" : "অ্যাম্বুলেন্স তালিকাভুক্ত করুন"}
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm text-muted-foreground">
            {isEn
              ? "List your ambulance in Health Club's 24/7 emergency dispatch directory in Feni."
              : "ফেনীর মানুষের জরুরি স্বাস্থ্য সেবায় হেলথ ক্লাব ২৪/৭ অ্যাম্বুলেন্স ডিরেক্টরিতে যুক্ত হোন।"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Service / Ambulance Name */}
          <div className="space-y-1.5">
            <Label htmlFor="ambulance-service-name" className="text-xs font-semibold">
              {isEn ? "Ambulance / Service Name" : "অ্যাম্বুলেন্স / সার্ভিসের নাম"}{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="ambulance-service-name"
              placeholder={isEn ? "e.g. Al-Madina AC Ambulance Service" : "যেমন: আল-মদিনা এসি অ্যাম্বুলেন্স সার্ভিস"}
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
            />
          </div>

          {/* Driver / Operator Name */}
          <div className="space-y-1.5">
            <Label htmlFor="ambulance-operator-name" className="text-xs font-semibold">
              {isEn ? "Driver / Owner Name" : "চালক বা মালিকের নাম"}{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="ambulance-operator-name"
              placeholder={isEn ? "e.g. Md. Jasim Uddin" : "যেমন: মোঃ জসীম উদ্দিন"}
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              required
            />
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-phone" className="text-xs font-semibold">
                {isEn ? "Primary Hotline Phone" : "প্রধান কল নম্বর (২৪/৭)"}{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="ambulance-phone"
                type="tel"
                placeholder={isEn ? "e.g. 018XXXXXXXX" : "যেমন: ০১৮XXXXXXXX"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-alt-phone" className="text-xs font-semibold text-muted-foreground">
                {isEn ? "Alternative Phone (Optional)" : "বিকল্প নম্বর (ঐচ্ছিক)"}
              </Label>
              <Input
                id="ambulance-alt-phone"
                type="tel"
                placeholder={isEn ? "e.g. 017XXXXXXXX" : "যেমন: ০১৭XXXXXXXX"}
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Ambulance Type Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {isEn ? "Ambulance Type" : "অ্যাম্বুলেন্সের ধরন"}{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {AMBULANCE_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-2.5 text-xs font-bold rounded-xl border text-left flex items-center justify-between transition-all ${
                    type === t.id
                      ? "bg-primary/10 text-primary border-primary shadow-2xs font-semibold"
                      : "bg-background hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  <span>{isEn ? t.nameEn : t.nameBn}</span>
                  {type === t.id && <span className="text-primary font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Upazila & Stand Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-upazila" className="text-xs font-semibold">
                {isEn ? "Upazila / Area" : "উপজেলা / এলাকা"}{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <select
                id="ambulance-upazila"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {UPAZILAS_FENI.filter((u) => u.id !== "all").map((u) => (
                  <option key={u.id} value={u.id}>
                    {isEn ? u.nameEn : u.nameBn}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-stand" className="text-xs font-semibold">
                {isEn ? "Stand / Specific Point" : "স্ট্যান্ড / নির্দিষ্ট স্থান"}
              </Label>
              <Input
                id="ambulance-stand"
                placeholder={isEn ? "e.g. Sadar Hospital Gate" : "যেমন: সদর হাসপাতাল গেইট"}
                value={standLocation}
                onChange={(e) => setStandLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Coverage Note */}
          <div className="space-y-1.5">
            <Label htmlFor="ambulance-coverage" className="text-xs font-semibold text-muted-foreground">
              {isEn ? "Service Coverage Area (Optional)" : "সার্ভিস রুট / কভারেজ (ঐচ্ছিক)"}
            </Label>
            <Input
              id="ambulance-coverage"
              placeholder={isEn ? "e.g. Feni Local & Feni to Dhaka/Ctg" : "যেমন: সমগ্র ফেনী ও ঢাকা/চট্টগ্রাম ট্রিপ"}
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
            />
          </div>

          {/* Verified listing note */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-muted/60 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              {isEn
                ? "Your details will be reviewed and published to the 24/7 public emergency directory upon phone verification."
                : "তথ্য সাবমিট করার পর আমাদের হেল্পডেস্ক টিম যাচাই করে দ্রুত ডিরেক্টরিতে উন্মুক্ত করবে।"}
            </span>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEn ? "Submitting..." : "জমা দেওয়া হচ্ছে..."}
                </>
              ) : (
                <>
                  <Truck className="mr-2 h-4 w-4" />
                  {isEn ? "Submit Ambulance Listing" : "অ্যাম্বুলেন্স তথ্য জমা দিন"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
