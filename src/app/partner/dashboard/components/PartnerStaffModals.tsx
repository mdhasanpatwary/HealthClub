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
import { Badge } from "@/components/ui/badge";
import { PartnerStaff } from "@/services/db";
import {
  updatePartnerStaffAction,
  createPartnerStaffAction,
} from "@/app/actions/partnerStaffActions";
import { toast } from "sonner";
import {
  UserCheck,
  UserPlus,
  Lock,
  Building,
  Phone,
  User,
  Shield,
  CreditCard,
} from "lucide-react";

export { ResetStaffPasswordModal, DeleteStaffConfirmModal } from "./PartnerStaffActionModals";

export const DESK_PRESETS = [
  "কাউন্টার ১ - বিলিং",
  "কাউন্টার ২ - বিলিং",
  "ফার্মেসি ডেস্ক",
  "জরুরি বিভাগ কাউন্টার",
  "ল্যাব ও প্যাথলজি ডেস্ক",
  "ডাক্তার সিরিয়াল ডেস্ক",
  "বহির্বিভাগ (OPD) বিলিং",
];

import { StaffCredentialsData } from "./PartnerStaffCredentialsModal";

// --- ADD / EDIT STAFF MODAL ---
interface AddEditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit: PartnerStaff | null;
  onSuccess: () => void;
  onSuccessWithCredentials?: (credentials: StaffCredentialsData) => void;
  partnerName?: string;
}

export function AddEditStaffModal({
  isOpen,
  onClose,
  staffToEdit,
  onSuccess,
  onSuccessWithCredentials,
  partnerName = "",
}: AddEditStaffModalProps) {
  const isEditing = !!staffToEdit;
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [deskName, setDeskName] = useState("");
  const [role, setRole] = useState<"cashier" | "manager">("cashier");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staffToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(staffToEdit.name || "");
      setUsername(staffToEdit.username || "");
      setPhone(staffToEdit.phone || "");
      setDeskName(staffToEdit.deskName || "");
      setRole(staffToEdit.role || "cashier");
      setPassword("");
    } else {
      setName("");
      setUsername("");
      setPhone("");
      setDeskName("কাউন্টার ১ - বিলিং");
      setRole("cashier");
      setPassword("");
    }
  }, [staffToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("দয়া করে সকল বাধ্যতামূলক তথ্য পূরণ করুন।");
      return;
    }
    if (!deskName.trim()) {
      toast.error("দয়া করে সকল বাধ্যতামূলক তথ্য পূরণ করুন।");
      return;
    }

    if (!isEditing) {
      if (!username.trim() || username.trim().length < 3) {
        toast.error("ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে");
        return;
      }
      if (!password || password.length < 6) {
        toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
        return;
      }
    }

    setLoading(true);
    try {
      if (isEditing && staffToEdit) {
        const res = await updatePartnerStaffAction(staffToEdit.id, {
          name: name.trim(),
          phone: phone.trim() || undefined,
          deskName: deskName.trim(),
          role,
          isActive: staffToEdit.isActive,
        });

        if (res.success) {
          toast.success("স্টাফ তথ্য সফলভাবে আপডেট হয়েছে");
          onSuccess();
          onClose();
        } else {
          toast.error(res.error || "ত্রুটি হয়েছে, আবার চেষ্টা করুন");
        }
      } else {
        const res = await createPartnerStaffAction({
          name: name.trim(),
          username: username.trim(),
          phone: phone.trim() || undefined,
          deskName: deskName.trim(),
          password,
          role,
        });

        if (res.success) {
          toast.success("নতুন স্টাফ সফলভাবে যুক্ত হয়েছে");
          onSuccess();
          onClose();
          if (onSuccessWithCredentials) {
            onSuccessWithCredentials({
              partnerName: partnerName || "",
              staffName: name.trim(),
              deskName: deskName.trim(),
              username: username.trim().toLowerCase(),
              password: password,
              role,
              type: "created",
            });
          }
        } else {
          toast.error(res.error || "ত্রুটি হয়েছে, আবার চেষ্টা করুন");
        }
      }
    } catch {
      toast.error("সার্ভার ত্রুটি, অনুগ্রহ করে আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-background border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-heading text-lg">
            {isEditing ? (
              <>
                <UserCheck className="h-5 w-5 text-primary" />
                স্টাফ তথ্য সংশোধন
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 text-primary" />
                নতুন বিলিং স্টাফ যুক্ত করুন
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            বিলিং কাউন্টারের জন্য স্টাফ নিয়োগ করুন এবং তাদের আলাদা ইউজারনেম ও পাসওয়ার্ড প্রদান করুন।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Staff Name */}
          <div className="space-y-1.5">
            <label htmlFor="staff-name" className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
              <User className="h-3.5 w-3.5 text-primary" />
              স্টাফের পূর্ণ নাম *
            </label>
            <Input
              id="staff-name"
              type="text"
              required
              placeholder="উদাঃ মোহাম্মদ হাসান"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-background h-10"
            />
          </div>

          {/* Desk Identifier with Presets */}
          <div className="space-y-2">
            <label htmlFor="staff-desk-name" className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
              <Building className="h-3.5 w-3.5 text-primary" />
              কাউন্টার / ডেস্কের নাম *
            </label>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {DESK_PRESETS.map((preset) => (
                <Badge
                  key={preset}
                  variant={deskName === preset ? "default" : "outline"}
                  onClick={() => setDeskName(preset)}
                  className={`text-[11px] cursor-pointer py-1 px-2.5 transition-all ${
                    deskName === preset
                      ? "bg-primary text-white border-primary"
                      : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                  }`}
                >
                  {preset}
                </Badge>
              ))}
            </div>
            <Input
              id="staff-desk-name"
              type="text"
              required
              placeholder="উদাঃ কাউন্টার ১ - প্যাথলজি"
              value={deskName}
              onChange={(e) => setDeskName(e.target.value)}
              className="border-border bg-background h-10"
            />
          </div>

          {/* Username / Login ID */}
          <div className="space-y-1.5">
            <label htmlFor="staff-username" className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              {isEditing ? "ইউজারনেম (পরিবর্তনযোগ্য নয়)" : "ইউজারনেম (লগইন আইডি) *"}
            </label>
            <Input
              id="staff-username"
              type="text"
              required={!isEditing}
              disabled={isEditing}
              placeholder="উদাঃ hasan_counter1"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
              className="border-border bg-background h-10 font-mono text-xs"
            />
            {!isEditing && (
              <p className="text-[11px] text-muted-foreground">
                স্টাফ এই ইউজারনেম দিয়ে পার্টনার পোর্টালে লগইন করবেন।
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label htmlFor="staff-phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
              <Phone className="h-3.5 w-3.5 text-primary" />
              ফোন নম্বর (ঐচ্ছিক)
            </label>
            <Input
              id="staff-phone"
              type="tel"
              placeholder="উদাঃ ০১৮XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-border bg-background h-10"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              স্টাফ পদবী / ভূমিকা
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("cashier")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === "cashier"
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-border/80"
                }`}
              >
                <div className="text-xs font-bold">বিলিং স্টাফ</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">শুধুমাত্র মেম্বারশিপ ভেরিফাই ও ডিসকাউন্ট লেনদেন এন্ট্রি করতে পারবেন।</div>
              </button>
              <button
                type="button"
                onClick={() => setRole("manager")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === "manager"
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-border/80"
                }`}
              >
                <div className="text-xs font-bold">ম্যানেজার</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">বিলিং এর পাশাপাশি রিপোর্ট দেখা ও তথ্য পরিবর্তনের সুবিধা পাবেন।</div>
              </button>
            </div>
          </div>

          {/* Password (Only when adding) */}
          {!isEditing && (
            <div className="space-y-1.5">
              <label htmlFor="staff-password" className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
                <Lock className="h-3.5 w-3.5 text-primary" />
                পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *
              </label>
              <Input
                id="staff-password"
                type="password"
                required
                placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border bg-background h-10"
              />
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border rounded-xl cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl cursor-pointer"
            >
              {loading ? "সংরক্ষণ হচ্ছে..." : isEditing ? "তথ্য আপডেট করুন" : "স্টাফ তৈরি করুন"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
