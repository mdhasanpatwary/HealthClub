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
import { Switch } from "@/components/ui/switch";
import { AdminRole, AdminUser } from "@/services/db";
import { ROLE_CONFIGS } from "@/lib/permissions";
import { UserPlus, UserCheck, Mail, Phone, Lock, Shield, User } from "lucide-react";
import { toast } from "sonner";

interface AdminStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staff: AdminUser | null;
  onSave: (data: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    password?: string;
    role: AdminRole;
    isActive?: boolean;
  }) => Promise<boolean>;
}

interface AdminStaffFormProps {
  staff: AdminUser | null;
  onClose: () => void;
  onSave: AdminStaffDialogProps["onSave"];
}

function AdminStaffForm({ staff, onClose, onSave }: AdminStaffFormProps) {
  const isEditing = !!staff;

  const [name, setName] = useState(staff?.name || "");
  const [email, setEmail] = useState(staff?.email || "");
  const [phone, setPhone] = useState(staff?.phone || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>(staff?.role || "support_staff");
  const [isActive, setIsActive] = useState(staff?.isActive ?? true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning("অনুগ্রহ করে পুরো নাম লিখুন।");
      return;
    }

    if (!isEditing && !email.trim()) {
      toast.warning("অনুগ্রহ করে ইমেইল অ্যাড্রেস লিখুন।");
      return;
    }

    if (!isEditing && (!password || password.length < 6)) {
      toast.warning("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    setLoading(true);
    try {
      const success = await onSave({
        id: staff?.id,
        name: name.trim(),
        email: isEditing ? undefined : email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password: isEditing ? undefined : password,
        role,
        isActive,
      });

      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-primary" />
          পুরো নাম *
        </label>
        <Input
          type="text"
          required
          placeholder="যেমন: হাসান মাহমুদ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-card border-border h-10 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-primary" />
            ইমেইল অ্যাড্রেস *
          </label>
          <Input
            type="email"
            required={!isEditing}
            disabled={isEditing}
            placeholder="staff@healthclub.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`bg-card border-border h-10 text-sm ${
              isEditing ? "opacity-60 cursor-not-allowed bg-muted" : ""
            }`}
          />
          {isEditing && <p className="text-[11px] text-muted-foreground">লগইন ইমেইল অপরিবর্তনযোগ্য</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-primary" />
            মোবাইল নম্বর
          </label>
          <Input
            type="tel"
            placeholder="017XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-card border-border h-10 text-sm"
          />
        </div>
      </div>

      {!isEditing && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-primary" />
            প্রাথমিক পাসওয়ার্ড *
          </label>
          <Input
            type="password"
            required
            placeholder="•••••••• (কমপক্ষে ৬ অক্ষর)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-card border-border h-10 text-sm"
          />
        </div>
      )}

      <div className="space-y-2 pt-1">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-primary" />
          পারমিশন রোল (RBAC Role) *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(Object.keys(ROLE_CONFIGS) as AdminRole[]).map((rKey) => {
            const conf = ROLE_CONFIGS[rKey];
            const isSelected = role === rKey;

            return (
              <button
                type="button"
                key={rKey}
                onClick={() => setRole(rKey)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                    : "border-border bg-card/60 hover:bg-card hover:border-border/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-foreground">{conf.titleBn}</span>
                    <div
                      className={`h-3 w-3 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                    {conf.descriptionBn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isEditing && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/70">
          <div>
            <div className="text-xs font-bold text-foreground">অ্যাকাউন্ট স্ট্যাটাস</div>
            <div className="text-[11px] text-muted-foreground">
              {isActive ? "অ্যাকাউন্টটি সক্রিয় ও লগইন অনুমোদিত" : "অ্যাকাউন্টটি নিষ্ক্রিয় (লগইন ব্লক)"}
            </div>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      )}

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={loading}
          className="text-xs rounded-xl"
        >
          বাতিল
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={loading}
          className="text-xs rounded-xl bg-primary hover:bg-primary-dark font-bold text-white px-5"
        >
          {loading ? "সংরক্ষণ হচ্ছে..." : isEditing ? "আপডেট করুন" : "অ্যাকাউন্ট তৈরি করুন"}
        </Button>
      </div>
    </form>
  );
}

export function AdminStaffDialog({
  isOpen,
  onClose,
  staff,
  onSave,
}: AdminStaffDialogProps) {
  const isEditing = !!staff;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-background/95 backdrop-blur-xl border border-border">
        <DialogHeader className="space-y-2 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              {isEditing ? <UserCheck className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold font-heading text-secondary dark:text-white">
                {isEditing ? "এডমিন/স্টাফ তথ্য পরিবর্তন" : "নতুন স্টাফ অ্যাকাউন্ট তৈরি করুন"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {isEditing
                  ? "স্টাফের নাম, ফোন নম্বর, পারমিশন রোল ও স্ট্যাটাস আপডেট করুন"
                  : "সিস্টেমে নতুন এডমিনিস্ট্রেটিভ ইউজার বা সাপোর্ট টিম মেম্বার যুক্ত করুন"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isOpen && (
          <AdminStaffForm
            key={staff?.id || "new-staff"}
            staff={staff}
            onClose={onClose}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
