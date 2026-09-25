import React from "react";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Partner } from "@/services/db";
import { parseDiscountPercentage, toBanglaNums } from "@/lib/utils";

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
}: AddMemberTxDialogProps) {
  return (
    <Dialog open={isAddTxOpen} onOpenChange={setIsAddTxOpen}>
      <DialogContent className="border-border bg-background max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-secondary dark:text-white flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            নতুন ডিসকাউন্ট ট্রানজেকশন
          </DialogTitle>
          <DialogDescription>
            পার্টনার চিকিৎসাকেন্দ্র থেকে প্রাপ্ত ডিসকাউন্টের বিবরণ লিপিবদ্ধ করুন।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddMemberTransaction} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="member-tx-partner" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">
              পার্টনার চিকিৎসাকেন্দ্র নির্বাচন করুন *
            </label>
            <select
              id="member-tx-partner"
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
              className="w-full h-10 rounded-xl border border-border/60 bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
            >
              <option value="">পার্টনার চিকিৎসাকেন্দ্র নির্বাচন করুন</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.discount})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="member-tx-amount" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">
              মোট বিলের পরিমাণ (৳) *
            </label>
            <Input
              id="member-tx-amount"
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
            <label htmlFor="member-tx-discount" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">
              ডিসকাউন্ট (%) *
            </label>
            <Input
              id="member-tx-discount"
              type="number"
              required
              min="0"
              max="70"
              placeholder="10"
              value={newTxDiscountPercent}
              onChange={(e) => setNewTxDiscountPercent(e.target.value)}
              className="border-border/60 rounded-xl focus:border-primary/40"
            />
          </div>

          {newTxPartnerId && newTxAmount && Number(newTxAmount) > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              আনুমানিক সাশ্রয়: ৳{toBanglaNums(
                Math.round(
                  Number(newTxAmount) *
                    (Math.min(Math.max(0, Number(newTxDiscountPercent) || 0), 70) / 100)
                )
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={addTxSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold"
          >
            {addTxSubmitting ? "সংরক্ষণ হচ্ছে..." : "ট্রানজেকশন সংরক্ষণ করুন"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
