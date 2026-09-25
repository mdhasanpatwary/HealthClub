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
  t?: (key: string) => string;
}

export function TransactionDialog({
  isOpen,
  onClose,
  partners,
  newTx,
  setNewTx,
  onSubmit,
}: TransactionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-background">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-secondary dark:text-white">মেম্বার ডিসকাউন্ট এন্ট্রি করুন</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="admin-tx-memberid" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">মেম্বার আইডি বা ফোন নম্বর *</label>
            <Input id="admin-tx-memberid" type="text" required placeholder="যেমন: 01711... বা HC-1234" value={newTx.memberId} onChange={e => setNewTx({ ...newTx, memberId: e.target.value })} className="border-border bg-background" />
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-tx-partnerid" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">পার্টনার হাসপাতাল / ডায়াগনস্টিক সেন্টার *</label>
            <select id="admin-tx-partnerid" value={newTx.partnerId} onChange={e => setNewTx({ ...newTx, partnerId: e.target.value })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary">
              <option value="">পার্টনার নির্বাচন করুন</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.discount})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-tx-amount" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">মোট বিলের পরিমাণ (টাকা) *</label>
            <Input id="admin-tx-amount" type="number" required placeholder="যেমন: ১২০০" value={newTx.amount} onChange={e => setNewTx({ ...newTx, amount: e.target.value })} className="border-border bg-background" />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">ডিসকাউন্ট হিসাব ও সেভ করুন</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
