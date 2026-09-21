"use client";

import { UseFormRegister, FieldError } from "react-hook-form";
import { Tag, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { MemberRegistrationInput } from "@/lib/validations/member";
import type { ReferenceDiscountType } from "@/lib/referenceCodes";
import type { Locale } from "@/lib/i18n";

export interface RefStatusState {
  status: "idle" | "checking" | "valid" | "invalid";
  message: string;
  discountType?: ReferenceDiscountType;
  discountAmount?: number;
  finalFee?: number;
}

interface ReferenceCodeFieldProps {
  register: UseFormRegister<MemberRegistrationInput>;
  error?: FieldError;
  refStatus: RefStatusState;
  setRefStatus: (state: RefStatusState) => void;
  onVerify: () => void;
  t: (key: string) => string;
  locale: Locale;
}

export function ReferenceCodeField({
  register,
  error,
  refStatus,
  setRefStatus,
  onVerify,
  t,
  locale,
}: ReferenceCodeFieldProps) {
  const isFree = refStatus.discountType === "free" || refStatus.finalFee === 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="reg-refCode"
          className="text-xs font-semibold text-secondary dark:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <Tag className="h-3.5 w-3.5 text-primary" />
          {t("auth.register.referenceCodeLabel")}
        </label>
        {refStatus.status === "valid" && (
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {isFree
              ? locale === "en" ? "100% Free Benefit" : "১০০% ফ্রি সুবিধা"
              : locale === "en" ? "Discount Active" : "ছাড় সক্রিয়"}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="reg-refCode"
            type="text"
            {...register("referenceCode")}
            placeholder={t("auth.register.referenceCodePlaceholder")}
            className={`border-border/60 bg-background dark:bg-slate-800/60 rounded-xl h-10 uppercase tracking-wider font-mono text-xs focus:border-primary/40 ${
              refStatus.status === "valid"
                ? "border-emerald-500/70 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-bold"
                : refStatus.status === "invalid"
                ? "border-destructive/60 bg-destructive/5 text-destructive"
                : ""
            }`}
            onChange={(e) => {
              register("referenceCode").onChange(e);
              if (refStatus.status !== "idle") {
                setRefStatus({ status: "idle", message: "" });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onVerify();
              }
            }}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onVerify}
          disabled={refStatus.status === "checking"}
          className="h-10 px-3.5 rounded-xl border-border/60 hover:bg-primary/5 hover:text-primary shrink-0 text-xs font-semibold cursor-pointer"
        >
          {refStatus.status === "checking" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            t("auth.register.referenceCodeApply")
          )}
        </Button>
      </div>

      {refStatus.message && (
        <p
          className={`text-xs flex items-center gap-1 transition-all ${
            refStatus.status === "valid"
              ? "text-emerald-600 dark:text-emerald-400 font-medium"
              : refStatus.status === "invalid"
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {refStatus.message}
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  );
}
