"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Partner } from "@/services/db";

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  partners: Partner[];
  newTx: {
    memberId: string;
    partnerId: string;
    amount: string;
  };
  setNewTx: (tx: {
    memberId: string;
    partnerId: string;
    amount: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  txSuccess: string;
  txError: string;
  t: (key: string) => string;
}

export function TransactionDialog({
  isOpen,
  onClose,
  partners,
  newTx,
  setNewTx,
  onSubmit,
  txSuccess,
  txError,
  t,
}: TransactionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-background">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-secondary">{t("admin.dashboard.logMemberDiscountTitle")}</DialogTitle>
        </DialogHeader>

        {txSuccess && (
          <div className="bg-green-50 text-green-600 text-xs p-3 rounded-lg border border-green-200">
            {txSuccess}
          </div>
        )}
        {txError && (
          <div className="bg-rose-50 text-rose-600 text-xs p-3 rounded-lg border border-rose-200">
            {txError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.memberSearchLabel")}</label>
            <Input type="text" required placeholder={t("admin.dashboard.egMemberSearch")} value={newTx.memberId} onChange={e => setNewTx({ ...newTx, memberId: e.target.value })} className="border-border bg-background" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.partnerMedicalCenterLabelReq")}</label>
            <select value={newTx.partnerId} onChange={e => setNewTx({ ...newTx, partnerId: e.target.value })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
              <option value="">{t("admin.dashboard.selectPartnerLabel")}</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.discount})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary">{t("admin.dashboard.billAmountLabel")}</label>
            <Input type="number" required placeholder={t("admin.dashboard.egBillAmount")} value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} className="border-border bg-background" />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">{t("admin.dashboard.applyLogDiscountButton")}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
