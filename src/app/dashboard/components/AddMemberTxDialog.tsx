import React from "react";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Partner } from "@/services/db";
import { formatNum, Locale } from "@/lib/i18n";
import { parseDiscountPercentage } from "@/lib/utils";

interface AddMemberTxDialogProps {
  isAddTxOpen: boolean;
  setIsAddTxOpen: (open: boolean) => void;
  handleAddMemberTransaction: (e: React.FormEvent) => void;
  newTxPartnerId: string;
  setNewTxPartnerId: (id: string) => void;
  newTxAmount: string;
  setNewTxAmount: (amount: string) => void;
  newTxDiscountPercent: string;
  setNewTxDiscountPercent: (percent: string) => void;
  partners: Partner[];
  addTxSubmitting: boolean;
  t: (key: string) => string;
  locale: Locale;
}

export function AddMemberTxDialog({
  isAddTxOpen,
  setIsAddTxOpen,
  handleAddMemberTransaction,
  newTxPartnerId,
  setNewTxPartnerId,
  newTxAmount,
  setNewTxAmount,
  newTxDiscountPercent,
  setNewTxDiscountPercent,
  partners,
  addTxSubmitting,
  t,
  locale,
}: AddMemberTxDialogProps) {
  return (
    <Dialog open={isAddTxOpen} onOpenChange={setIsAddTxOpen}>
      <DialogContent className="border-border bg-background max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-secondary dark:text-white flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            {t("dashboard.history.addTxTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("dashboard.history.addTxDesc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddMemberTransaction} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary dark:text-white">
              {t("dashboard.history.selectPartner")} *
            </label>
            <select
              required
              value={newTxPartnerId}
              onChange={(e) => {
                const selectedId = e.target.value;
                setNewTxPartnerId(selectedId);
                const selectedPartner = partners.find((p) => p.id === selectedId);
                if (selectedPartner) {
                  const rate = parseDiscountPercentage(selectedPartner.discount);
                  const percentVal = Math.round(rate * 100);
                  setNewTxDiscountPercent(percentVal >= 0 ? String(percentVal) : "10");
                } else {
                  setNewTxDiscountPercent("10");
                }
              }}
              className="w-full h-10 rounded-xl border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="">{t("admin.dashboard.selectPartnerLabel")}</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.discount})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary dark:text-white">
              {t("dashboard.history.billAmount")} *
            </label>
            <Input
              type="number"
              required
              min="1"
              placeholder="e.g. 2000"
              value={newTxAmount}
              onChange={(e) => setNewTxAmount(e.target.value)}
              className="border-border/60 rounded-xl focus:border-primary/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary dark:text-white">
              {locale === "bn" ? "ডিসকাউন্ট (%) *" : "Discount (%) *"}
            </label>
            <Input
              type="number"
              required
              min="0"
              max="30"
              placeholder="10"
              value={newTxDiscountPercent}
              onChange={(e) => setNewTxDiscountPercent(e.target.value)}
              className="border-border/60 rounded-xl focus:border-primary/40"
            />
          </div>

          {newTxPartnerId && newTxAmount && Number(newTxAmount) > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              {t("dashboard.history.calculatedSavings").replace(
                "{saved}",
                formatNum(
                  Math.round(
                    Number(newTxAmount) *
                      (Math.min(Math.max(0, Number(newTxDiscountPercent) || 0), 30) / 100)
                  ),
                  locale
                )
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={addTxSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold"
          >
            {addTxSubmitting ? (locale === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : t("dashboard.history.submitTx")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
