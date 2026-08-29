"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, AlertTriangle, Receipt, CreditCard, Percent, RotateCcw } from "lucide-react";
import { Partner } from "@/services/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addPartnerTransactionAction } from "@/app/actions/partnerActions";
import { parseDiscountPercentage } from "@/lib/utils";
import { toast } from "sonner";

export interface VerifiedMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: string;
  status: string;
  expiryDate: string;
  totalSaved: number;
  profilePictureUrl: string;
  isExpired: boolean;
}

interface PartnerVerifiedMemberCardProps {
  verifiedMember: VerifiedMember;
  partner: Partner;
  onTransactionComplete: () => void;
  onClearMember: () => void;
  t: (key: string) => string;
}

export function PartnerVerifiedMemberCard({
  verifiedMember,
  partner,
  onTransactionComplete,
  onClearMember,
  t,
}: PartnerVerifiedMemberCardProps) {
  const [billAmount, setBillAmount] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [isCustomDiscount, setIsCustomDiscount] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const partnerDiscountRate = parseDiscountPercentage(partner.discount);
  const partnerDiscountPercentDisplay = Math.round(partnerDiscountRate * 100);

  const handleBillAmountChange = (val: string) => {
    setBillAmount(val);
    if (!isCustomDiscount) {
      if (val && !isNaN(Number(val)) && Number(val) > 0) {
        const calculated = Math.round(Number(val) * Math.min(partnerDiscountRate, 0.70));
        setDiscountAmount(calculated > 0 ? calculated.toString() : "");
      } else {
        setDiscountAmount("");
      }
    }
  };

  const handleDiscountAmountChange = (val: string) => {
    setIsCustomDiscount(true);
    setDiscountAmount(val);
  };

  const handleResetDiscount = () => {
    setIsCustomDiscount(false);
    if (billAmount && !isNaN(Number(billAmount)) && Number(billAmount) > 0) {
      const calculated = Math.round(Number(billAmount) * Math.min(partnerDiscountRate, 0.70));
      setDiscountAmount(calculated > 0 ? calculated.toString() : "");
    } else {
      setDiscountAmount("");
    }
  };

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numBill = Number(billAmount);
    if (!billAmount || isNaN(numBill) || numBill <= 0) {
      toast.error(t("partner.billing.invalidAmountToast"));
      return;
    }

    const numDiscount = discountAmount !== "" ? Number(discountAmount) : NaN;
    if (!isNaN(numDiscount) && (numDiscount < 0 || numDiscount > numBill)) {
      toast.error(t("partner.billing.invalidDiscountToast"));
      return;
    }

    setLoadingSubmit(true);
    try {
      const res = await addPartnerTransactionAction({
        memberId: verifiedMember.id,
        amount: Math.round(numBill),
        discountAmount: !isNaN(numDiscount) ? Math.round(numDiscount) : undefined,
      });

      if (res.success) {
        toast.success(res.message);
        setBillAmount("");
        setDiscountAmount("");
        setIsCustomDiscount(false);
        onClearMember();
        onTransactionComplete();
      } else {
        const errMsg = res.errorKey ? t(res.errorKey) : (res.message || t("partner.billing.verifyErrorToast"));
        toast.error(errMsg);
      }
    } catch {
      toast.error(t("common.error.server"));
    } finally {
      setLoadingSubmit(false);
    }
  };

  const numBill = !isNaN(Number(billAmount)) ? Number(billAmount) : 0;
  const numDiscount = !isNaN(Number(discountAmount)) ? Number(discountAmount) : 0;
  const netPayable = Math.max(0, numBill - numDiscount);

  return (
    <div className="p-5 rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-900/60 space-y-4 animate-in fade-in duration-200">
      <div className="flex items-start gap-4">
        {verifiedMember.profilePictureUrl ? (
          <Image
            src={verifiedMember.profilePictureUrl}
            alt={verifiedMember.name}
            width={56}
            height={56}
            unoptimized
            className="h-14 w-14 rounded-full object-cover border border-border shadow-sm shrink-0"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold uppercase border border-border shrink-0">
            {verifiedMember.name.substring(0, 2)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-secondary dark:text-white truncate">{verifiedMember.name}</h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                verifiedMember.tier === "founding"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20"
                  : "bg-primary/10 text-primary border border-primary/20"
              }`}
            >
              {verifiedMember.tier === "founding"
                ? t("partner.billing.foundingMember")
                : t("partner.billing.premiumMember")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("partner.billing.memberId")}: {verifiedMember.id}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("partner.billing.phone")}: {verifiedMember.phone}
          </p>
        </div>

        <div className="shrink-0 text-right">
          {verifiedMember.isExpired ? (
            <div className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-1 rounded-full border border-destructive/20">
              <XCircle className="h-3.5 w-3.5" />
              {t("partner.billing.expired")}
            </div>
          ) : verifiedMember.status === "active" ? (
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20">
              <CheckCircle className="h-3.5 w-3.5" />
              {t("partner.billing.activeCard")}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/20">
              <AlertTriangle className="h-3.5 w-3.5" />
              {t("partner.billing.inactiveCard")}
            </div>
          )}
        </div>
      </div>

      {/* Transaction submission form if card is active & valid */}
      {!verifiedMember.isExpired && verifiedMember.status === "active" ? (
        <form onSubmit={handleTransactionSubmit} className="pt-4 border-t border-border space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Bill Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="partner-bill-amount"
                className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Receipt className="h-3.5 w-3.5 text-primary" />
                {t("partner.billing.billAmountLabel")}
              </label>
              <Input
                id="partner-bill-amount"
                type="number"
                required
                min="1"
                value={billAmount}
                onChange={(e) => handleBillAmountChange(e.target.value)}
                placeholder={t("partner.billing.billAmountPlaceholder")}
                className="h-11 border-border rounded-xl"
              />
            </div>

            {/* Discount Amount Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="partner-discount-amount"
                  className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Percent className="h-3.5 w-3.5 text-primary" />
                  {t("partner.billing.discountAmountLabel")}
                </label>
                {isCustomDiscount && (
                  <button
                    type="button"
                    onClick={handleResetDiscount}
                    className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                    {t("partner.billing.resetToAuto")}
                  </button>
                )}
              </div>
              <Input
                id="partner-discount-amount"
                type="number"
                min="0"
                max={billAmount || undefined}
                value={discountAmount}
                onChange={(e) => handleDiscountAmountChange(e.target.value)}
                placeholder={t("partner.billing.discountAmountPlaceholder")}
                className="h-11 border-border rounded-xl font-medium"
              />
              <p className="text-[10px] text-muted-foreground">
                {t("partner.billing.autoRateNotice")}{" "}
                <span className="font-semibold text-secondary dark:text-slate-200">
                  {partner.discount || `${partnerDiscountPercentDisplay}%`}
                </span>
              </p>
            </div>
          </div>

          {/* Breakdown Summary */}
          {numBill > 0 && (
            <div className="bg-slate-100/70 dark:bg-slate-800/50 border border-border rounded-2xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{t("partner.billing.totalBill")}</span>
                <span className="font-semibold text-secondary dark:text-slate-200 font-mono">
                  ৳{numBill.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-primary font-medium">
                <span>{t("partner.billing.discountGiven")}</span>
                <span className="font-bold font-mono">-৳{numDiscount.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between items-center text-sm font-bold text-secondary dark:text-white">
                <span>{t("partner.billing.netPayable")}</span>
                <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  ৳{netPayable.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loadingSubmit}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl h-11 gap-1.5 cursor-pointer"
          >
            <CreditCard className="h-4 w-4" />
            {loadingSubmit ? t("partner.billing.processingTx") : t("partner.billing.completeTx")}
          </Button>
        </form>
      ) : (
        <div className="p-3.5 bg-destructive/5 border border-destructive/10 text-destructive rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{t("partner.billing.cardInactiveNotice")}</span>
        </div>
      )}
    </div>
  );
}
