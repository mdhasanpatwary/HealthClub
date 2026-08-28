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
import { UPAZILAS_FENI, AMBULANCE_TYPES } from "@/data/emergencyData";
import { registerAmbulanceAction } from "@/app/actions/emergencyActions";
import { toast } from "sonner";
import { Truck, Loader2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface AmbulanceRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AmbulanceRegisterDialog({
  open,
  onOpenChange,
}: AmbulanceRegisterDialogProps) {
  const { locale, t } = useLanguage();
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
        t("emergency.ambulanceModal.phoneRequired") || (isEn
          ? "Please provide service name, driver/operator name, and phone number."
          : "অনুগ্রহ করে প্রতিষ্ঠানের নাম, চালক/মালিকের নাম ও ফোন নম্বর পূরণ করুন।")
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
          t("emergency.ambulanceModal.successMsg") || (isEn
            ? "Ambulance registration submitted successfully! We will review and publish it."
            : res.message)
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
        t("emergency.ambulanceModal.errorMsg") || (isEn
          ? "Failed to submit ambulance registration. Please try again."
          : "নিবন্ধন জমা দেওয়া সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।")
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
            {t("emergency.ambulanceModal.title")}
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm text-muted-foreground">
            {t("emergency.ambulanceModal.desc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Service / Ambulance Name */}
          <div className="space-y-1.5">
            <Label htmlFor="ambulance-service-name" className="text-xs font-semibold">
              {t("emergency.ambulanceModal.serviceName")}{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="ambulance-service-name"
              placeholder={t("emergency.ambulanceModal.serviceNamePlaceholder")}
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
            />
          </div>

          {/* Driver / Operator Name */}
          <div className="space-y-1.5">
            <Label htmlFor="ambulance-operator-name" className="text-xs font-semibold">
              {t("emergency.ambulanceModal.operatorName")}{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="ambulance-operator-name"
              placeholder={t("emergency.ambulanceModal.operatorNamePlaceholder")}
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              required
            />
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-phone" className="text-xs font-semibold">
                {t("emergency.ambulanceModal.phone")}{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="ambulance-phone"
                type="tel"
                placeholder={t("emergency.ambulanceModal.phonePlaceholder")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-alt-phone" className="text-xs font-semibold text-muted-foreground">
                {t("emergency.ambulanceModal.altPhone")}
              </Label>
              <Input
                id="ambulance-alt-phone"
                type="tel"
                placeholder={t("emergency.ambulanceModal.altPhonePlaceholder")}
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Ambulance Type Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              {t("emergency.ambulanceModal.type")}{" "}
              <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {AMBULANCE_TYPES.map((tItem) => (
                <button
                  type="button"
                  key={tItem.id}
                  onClick={() => setType(tItem.id)}
                  className={`p-2.5 text-xs font-bold rounded-xl border text-left flex items-center justify-between transition-all ${
                    type === tItem.id
                      ? "bg-primary/10 text-primary border-primary shadow-2xs font-semibold"
                      : "bg-background hover:bg-muted text-muted-foreground border-border"
                  }`}
                >
                  <span>{isEn ? tItem.nameEn : tItem.nameBn}</span>
                  {type === tItem.id && <span className="text-primary font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Upazila & Stand Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ambulance-upazila" className="text-xs font-semibold">
                {t("emergency.ambulanceModal.upazila")}{" "}
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
                {t("emergency.ambulanceModal.standLocation")}
              </Label>
              <Input
                id="ambulance-stand"
                placeholder={t("emergency.ambulanceModal.standLocationPlaceholder")}
                value={standLocation}
                onChange={(e) => setStandLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Coverage Note */}
          <div className="space-y-1.5">
            <Label htmlFor="ambulance-coverage" className="text-xs font-semibold text-muted-foreground">
              {t("emergency.ambulanceModal.coverage")}
            </Label>
            <Input
              id="ambulance-coverage"
              placeholder={t("emergency.ambulanceModal.coveragePlaceholder")}
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
            />
          </div>

          {/* Verified listing note */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-muted/60 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              {t("emergency.ambulanceModal.verificationNote")}
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
                  {t("emergency.ambulanceModal.submitting")}
                </>
              ) : (
                <>
                  <Truck className="mr-2 h-4 w-4" />
                  {t("emergency.ambulanceModal.submit")}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
