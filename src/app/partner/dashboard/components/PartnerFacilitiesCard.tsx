"use client";

import { useState } from "react";
import {
  ShieldAlert,
  HeartPulse,
  Truck,
  Microscope,
  Activity,
  Sparkles,
  Pill,
  Stethoscope,
  BedDouble,
  Wifi,
  ThermometerSnowflake,
  UserCheck,
  PackageCheck,
  ReceiptText,
  Plus,
  Trash2,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { PartnerFacilityItem, Partner } from "@/services/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toBanglaNums } from "@/lib/utils";
import { toast } from "sonner";

interface PartnerFacilitiesCardProps {
  facilities: PartnerFacilityItem[];
  onChange: (facilities: PartnerFacilityItem[]) => void;
  category: Partner["category"];
}

const ICON_MAP: Record<string, typeof ShieldAlert> = {
  ShieldAlert,
  HeartPulse,
  Truck,
  Microscope,
  Activity,
  Sparkles,
  Pill,
  Stethoscope,
  BedDouble,
  Wifi,
  ThermometerSnowflake,
  UserCheck,
  PackageCheck,
  ReceiptText,
};

export function PartnerFacilitiesCard({
  facilities,
  onChange,
  category,
}: PartnerFacilitiesCardProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customNameBn, setCustomNameBn] = useState("");
  const [customNameEn, setCustomNameEn] = useState("");
  const [customDescBn, setCustomDescBn] = useState("");
  const [customDescEn, setCustomDescEn] = useState("");

  const activeCount = facilities.filter((f) => f.isAvailable).length;

  const handleToggle = (id: string, checked: boolean) => {
    const updated = facilities.map((f) =>
      f.id === id ? { ...f, isAvailable: checked } : f
    );
    onChange(updated);
  };

  const handleRemoveCustom = (id: string, nameBn: string) => {
    const updated = facilities.filter((f) => f.id !== id);
    onChange(updated);
    toast.success(`"${nameBn}" সুবিধাটি মুছে ফেলা হয়েছে`);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedBn = customNameBn.trim();
    if (!trimmedBn) {
      toast.error("অনুগ্রহ করে সুবিধার বাংলা নাম লিখুন");
      return;
    }

    const newId = `custom_${Date.now()}`;
    const newItem: PartnerFacilityItem = {
      id: newId,
      nameBn: trimmedBn,
      nameEn: customNameEn.trim() || trimmedBn,
      descBn: customDescBn.trim() || "হাসপাতালের বিশেষায়িত চিকিৎসাসেবা",
      descEn: customDescEn.trim() || "Specialized healthcare facility",
      icon: "Sparkles",
      isAvailable: true,
      isCustom: true,
    };

    onChange([...facilities, newItem]);
    setCustomNameBn("");
    setCustomNameEn("");
    setCustomDescBn("");
    setCustomDescEn("");
    setIsAddOpen(false);
    toast.success(`"${trimmedBn}" সুবিধা সফলভাবে যুক্ত করা হয়েছে!`);
  };

  const cardTitle =
    category === "pharmacy"
      ? "ফার্মেসি ও ঔষধ সেবার সুবিধাসমূহ"
      : category === "diagnostic"
      ? "ডায়াগনস্টিক ও ল্যাব সুবিধাসমূহ"
      : "হাসপাতাল ও চিকিৎসাসেবার সুবিধাসমূহ";

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="pb-4 sm:pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary shrink-0" />
              <CardTitle className="text-base sm:text-lg font-bold font-heading text-secondary dark:text-white">
                {cardTitle}
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              আপনার প্রতিষ্ঠানে বিদ্যমান সুবিধাগুলো চালু বা বন্ধ রাখুন। সক্রিয় সুবিধাগুলো পাবলিক প্রোফাইলে প্রদর্শিত হবে।
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-1 font-semibold"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              {toBanglaNums(activeCount)} টি সক্রিয়
            </Badge>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsAddOpen(true)}
              className="text-xs h-8 cursor-pointer hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              অতিরিক্ত সুবিধা
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {facilities.map((facility) => {
            const IconComponent = ICON_MAP[facility.icon || ""] || Sparkles;
            const isChecked = Boolean(facility.isAvailable);

            return (
              <div
                key={facility.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isChecked
                    ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
                    : "border-border/60 bg-muted/20 opacity-70"
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isChecked
                        ? "bg-primary/15 text-primary dark:bg-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                        {facility.nameBn || facility.nameEn}
                      </p>
                      {facility.isCustom && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 h-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        >
                          কাস্টম
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {facility.descBn || facility.descEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {facility.isCustom && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCustom(facility.id, facility.nameBn)}
                      className="h-7 w-7 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                      title="মুছুন"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Switch
                    checked={isChecked}
                    onCheckedChange={(checked) => handleToggle(facility.id, checked)}
                    aria-label={facility.nameBn}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* Add Custom Facility Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-heading text-secondary dark:text-white">
              অতিরিক্ত সুবিধা বা সেবা যুক্ত করুন
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              আপনার প্রতিষ্ঠানের নিজস্ব বা বিশেষায়িত সেবার তথ্য লিখুন।
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCustom} className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                সুবিধার নাম (বাংলা) *
              </label>
              <Input
                placeholder="উদাঃ আধুনিক ডেন্টাল ইউনিট, এনআইসিইউ"
                value={customNameBn}
                onChange={(e) => setCustomNameBn(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                সুবিধার নাম (ইংরেজি - ঐচ্ছিক)
              </label>
              <Input
                placeholder="e.g. Modern Dental Unit, NICU"
                value={customNameEn}
                onChange={(e) => setCustomNameEn(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                সংক্ষিপ্ত বিবরণ (বাংলা - ঐচ্ছিক)
              </label>
              <Input
                placeholder="উদাঃ অভিজ্ঞ ডেন্টিস্ট দ্বারা আধুনিক দাঁতের চিকিৎসা"
                value={customDescBn}
                onChange={(e) => setCustomDescBn(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                সংক্ষিপ্ত বিবরণ (ইংরেজি - ঐচ্ছিক)
              </label>
              <Input
                placeholder="e.g. Advanced dental and oral care by specialists"
                value={customDescEn}
                onChange={(e) => setCustomDescEn(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-3 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                className="text-xs h-8 cursor-pointer"
              >
                বাতিল
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs h-8 bg-primary hover:bg-primary/90 text-white cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                সুবিধা যোগ করুন
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
