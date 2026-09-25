"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AmbulanceService, AMBULANCE_TYPES } from "@/data/emergencyData";
import { saveAmbulanceAction } from "@/app/actions/emergencyAdminActions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
interface EmergencyAmbulanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ambulance: AmbulanceService | null;
  onSuccess: () => void;
}

export function EmergencyAmbulanceDialog({
  open,
  onOpenChange,
  ambulance,
  onSuccess,
}: EmergencyAmbulanceDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AmbulanceService["type"]>("AC");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [availableHours, setAvailableHours] = useState("২৪/৭ সার্বক্ষণিক");
  const [status, setStatus] = useState<"approved" | "pending">("approved");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      if (ambulance) {
        setName(ambulance.name);
        setType(ambulance.type);
        setLocation(ambulance.location);
        setPhone(ambulance.phone);
        setAvailableHours(ambulance.availableHours);
        setStatus(ambulance.status || "approved");
      } else {
        setName("");
        setType("AC");
        setLocation("ফেনী সদর");
        setPhone("");
        setAvailableHours("২৪/৭ সার্বক্ষণিক");
        setStatus("approved");
      }
    });
    return () => {
      isMounted = false;
    };
  }, [ambulance, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("অনুগ্রহ করে সব তথ্য দিন");
      return;
    }

    setSaving(true);
    try {
      const payload: AmbulanceService = {
        id: ambulance ? ambulance.id : `amb-${Date.now()}`,
        name: name.trim(),
        type,
        location: location.trim(),
        phone: phone.trim(),
        availableHours: availableHours.trim(),
        status,
      };

      const res = await saveAmbulanceAction(payload);
      if (res.success) {
        toast.success(
          ambulance
            ? "অ্যাম্বুলেন্সের তথ্য আপডেট হয়েছে!"
            : "নতুন অ্যাম্বুলেন্স সার্ভিস যুক্ত হয়েছে!"
        );
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(res.error || "সংরক্ষণ ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("একটি সমস্যা দেখা দিয়েছে");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {ambulance
              ? "অ্যাম্বুলেন্স তথ্য এডিট করুন"
              : "নতুন অ্যাম্বুলেন্স সার্ভিস যুক্ত করুন"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            জরুরি সেবার জন্য অ্যাম্বুলেন্স চালক বা এজেন্সির তথ্য দিন।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="amb-name" className="text-xs font-semibold">
              অ্যাম্বুলেন্স বা এজেন্সির নাম *
            </Label>
            <Input
              id="amb-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: রেড ক্রিসেন্ট এম্বুলেন্স"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                অ্যাম্বুলেন্সের ধরন *
              </Label>
              <Select
                value={type}
                onValueChange={(val) => {
                  if (val) setType(val as AmbulanceService["type"]);
                }}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="ধরন" />
                </SelectTrigger>
                <SelectContent>
                  {AMBULANCE_TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="text-xs">
                      {t.nameBn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amb-location" className="text-xs font-semibold">
                স্ট্যান্ড / এলাকা *
              </Label>
              <Input
                id="amb-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="যেমন: এসএসকে রোড, ফেনী"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amb-phone" className="text-xs font-semibold">
                সরাসরি কল নম্বর *
              </Label>
              <Input
                id="amb-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amb-hours" className="text-xs font-semibold">
                সেবা প্রদানের সময়
              </Label>
              <Input
                id="amb-hours"
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
                placeholder="২৪/৭ সার্বক্ষণিক"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amb-status" className="text-xs font-semibold">
              অনুমোদন স্ট্যাটাস
            </Label>
            <Select
              value={status}
              onValueChange={(val) => {
                if (val) setStatus(val as "approved" | "pending");
              }}
            >
              <SelectTrigger id="amb-status" className="h-9 text-xs">
                <SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved" className="text-xs">
                  অনুমোদিত (পাবলিক ডিরেক্টরিতে দৃশ্যমান)
                </SelectItem>
                <SelectItem value="pending" className="text-xs">
                  অনুমোদন অপেক্ষমাণ (পাবলিক থেকে লুকানো)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="text-xs"
            >
              বাতিল
            </Button>
            <Button type="submit" disabled={saving} className="text-xs font-bold">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                "সংরক্ষণ করুন"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
