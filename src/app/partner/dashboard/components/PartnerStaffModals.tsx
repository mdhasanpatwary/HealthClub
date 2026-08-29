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
import { useLanguage } from "@/components/layout/LanguageProvider";

export { ResetStaffPasswordModal, DeleteStaffConfirmModal } from "./PartnerStaffActionModals";

export const DESK_PRESETS = [
  "Counter 1 - Billing",
  "Counter 2 - Billing",
  "Pharmacy Desk",
  "Emergency Counter",
  "Lab & Pathology Desk",
  "Doctor Serial Desk",
  "OPD Billing Counter",
];

// --- ADD / EDIT STAFF MODAL ---
interface AddEditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit: PartnerStaff | null;
  onSuccess: () => void;
  partnerName?: string;
}

export function AddEditStaffModal({
  isOpen,
  onClose,
  staffToEdit,
  onSuccess,
}: AddEditStaffModalProps) {
  const { t } = useLanguage();
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
      setDeskName("Counter 1 - Billing");
      setRole("cashier");
      setPassword("");
    }
  }, [staffToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t("partner.profile.fillRequiredFields"));
      return;
    }
    if (!deskName.trim()) {
      toast.error(t("partner.profile.fillRequiredFields"));
      return;
    }

    if (!isEditing) {
      if (!username.trim() || username.trim().length < 3) {
        toast.error(t("partner.staff.usernamePlaceholder"));
        return;
      }
      if (!password || password.length < 6) {
        toast.error(t("partner.password.minLength"));
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
          toast.success(t("partner.staff.updatedSuccess"));
          onSuccess();
          onClose();
        } else {
          toast.error(res.error || t("common.error"));
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
          toast.success(t("partner.staff.createdSuccess"));
          onSuccess();
          onClose();
        } else {
          toast.error(res.error || t("common.error"));
        }
      }
    } catch {
      toast.error(t("common.error.server"));
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
                {t("partner.staff.modalEditTitle")}
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 text-primary" />
                {t("partner.staff.modalAddTitle")}
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t("partner.staff.modalDesc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Staff Name */}
          <div className="space-y-1.5">
            <label htmlFor="staff-name" className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
              <User className="h-3.5 w-3.5 text-primary" />
              {t("partner.staff.nameLabel")}
            </label>
            <Input
              id="staff-name"
              type="text"
              required
              placeholder={t("partner.staff.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-background h-10"
            />
          </div>

          {/* Desk Identifier with Presets */}
          <div className="space-y-2">
            <label htmlFor="staff-desk-name" className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
              <Building className="h-3.5 w-3.5 text-primary" />
              {t("partner.staff.deskLabel")}
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
              placeholder={t("partner.staff.deskPlaceholder")}
              value={deskName}
              onChange={(e) => setDeskName(e.target.value)}
              className="border-border bg-background h-10"
            />
          </div>

          {/* Username / Login ID */}
          <div className="space-y-1.5">
            <label htmlFor="staff-username" className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              {t("partner.staff.usernameLabel")} {isEditing ? t("partner.staff.usernameImmutable") : "*"}
            </label>
            <Input
              id="staff-username"
              type="text"
              required={!isEditing}
              disabled={isEditing}
              placeholder={t("partner.staff.usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
              className="border-border bg-background h-10 font-mono text-xs"
            />
            {!isEditing && (
              <p className="text-[11px] text-muted-foreground">
                {t("partner.staff.usernameLoginNote")}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label htmlFor="staff-phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
              <Phone className="h-3.5 w-3.5 text-primary" />
              {t("partner.staff.phoneLabel")}
            </label>
            <Input
              id="staff-phone"
              type="tel"
              placeholder={t("partner.staff.phonePlaceholder")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-border bg-background h-10"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              {t("partner.staff.roleRole")}
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
                <div className="text-xs font-bold">{t("partner.staff.roleCashier")}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{t("partner.staff.roleCashierDesc")}</div>
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
                <div className="text-xs font-bold">{t("partner.staff.roleManager")}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{t("partner.staff.roleManagerDesc")}</div>
              </button>
            </div>
          </div>

          {/* Password (Only when adding) */}
          {!isEditing && (
            <div className="space-y-1.5">
              <label htmlFor="staff-password" className="text-xs font-semibold text-foreground flex items-center gap-1.5 cursor-pointer">
                <Lock className="h-3.5 w-3.5 text-primary" />
                {t("partner.staff.passwordMinLength")}
              </label>
              <Input
                id="staff-password"
                type="password"
                required
                placeholder={t("partner.staff.passwordPlaceholder")}
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
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl cursor-pointer"
            >
              {loading ? t("partner.staff.saving") : isEditing ? t("partner.staff.submitUpdate") : t("partner.staff.submitCreate")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
