"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Building2,
  ExternalLink,
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export interface StaffCredentialsData {
  partnerName: string;
  staffName: string;
  deskName: string;
  username: string;
  password?: string;
  role: string;
  type: "created" | "reset" | "view";
}

interface PartnerStaffCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: StaffCredentialsData | null;
}

export function PartnerStaffCredentialsModal({
  isOpen,
  onClose,
  data,
}: PartnerStaffCredentialsModalProps) {
  const [showPassword, setShowPassword] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!data) return null;

  const loginUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/login/partner`
      : "https://healthclub.com.bd/login/partner";

  const roleText =
    data.role === "manager"
      ? "ম্যানেজার"
      : "বিলিং স্টাফ";

  const fullTextToCopy = `🔐 স্টাফ লগইন বিবরণী:
🔗 লগইন পেজ লিংক: ${loginUrl}
👤 ইউজারনেম: ${data.username}
🔑 পাসওয়ার্ড: ${
    data.password || "(প্রশাসক দ্বারা নির্ধারিত)"
  }`;

  const handleCopySingle = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} কপি করা হয়েছে`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(fullTextToCopy);
    setCopiedKey("all");
    toast.success("সকল লগইন তথ্য কপি করা হয়েছে");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background border-border p-5 sm:p-6">
        <DialogHeader className="text-center sm:text-left space-y-1.5 pb-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold font-heading text-secondary dark:text-white">
                স্টাফ লগইন স্লিপ
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                স্টাফকে নিচের তথ্যগুলো দিয়ে পোর্টালে লগইন করতে বলুন
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Credentials Slip Card */}
        <div className="space-y-3 pt-2">
          {/* Header Tag Info */}
          <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-muted/40 border border-border/70 text-xs">
            <div className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4 text-primary shrink-0" />
              <span className="font-semibold text-foreground truncate">
                {data.partnerName}
              </span>
            </div>
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-[11px] shrink-0 font-medium"
            >
              {data.deskName}
            </Badge>
          </div>

          {/* Staff Member Info */}
          <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">
                  {data.staffName}
                </span>
              </div>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                {roleText}
              </Badge>
            </div>

            {/* Login URL */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5 text-primary" />
                লগইন পেজ লিংক
              </span>
              <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-border/60">
                <span className="text-xs font-mono text-foreground select-all truncate flex-1">
                  {loginUrl}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleCopySingle(
                      loginUrl,
                      "url",
                      "লগইন পেজ লিংক"
                    )
                  }
                  className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                  title="লিংক কপি করুন"
                >
                  {copiedKey === "url" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                ইউজারনেম
              </span>
              <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-border/60">
                <span className="text-xs font-mono font-bold text-foreground select-all truncate flex-1">
                  {data.username}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleCopySingle(
                      data.username,
                      "username",
                      "ইউজারনেম"
                    )
                  }
                  className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                  title="ইউজারনেম কপি করুন"
                >
                  {copiedKey === "username" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" />
                পাসওয়ার্ড
              </span>
              <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-border/60">
                <span className="text-xs font-mono font-bold text-foreground select-all truncate flex-1">
                  {data.password
                    ? showPassword
                      ? data.password
                      : "••••••••"
                    : "(প্রশাসক দ্বারা নির্ধারিত)"}
                </span>
                {data.password && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                    title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
                {data.password && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopySingle(
                        data.password || "",
                        "password",
                        "পাসওয়ার্ড"
                      )
                    }
                    className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                    title="পাসওয়ার্ড কপি করুন"
                  >
                    {copiedKey === "password" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            টিপ: &apos;পূর্ণ স্লিপ কপি করুন&apos; বাটনে ক্লিক করে WhatsApp বা SMS-এর মাধ্যমে স্টাফকে পাঠান।
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-border rounded-xl cursor-pointer order-2 sm:order-1"
          >
            বন্ধ করুন
          </Button>
          <Button
            type="button"
            onClick={handleCopyAll}
            className="bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl gap-2 cursor-pointer order-1 sm:order-2 flex-1 shadow-sm"
          >
            {copiedKey === "all" ? (
              <>
                <Check className="h-4 w-4 text-white" />
                <span>কপি সম্পন্ন হয়েছে</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>পূর্ণ স্লিপ কপি করুন</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
