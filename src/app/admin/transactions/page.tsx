"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { Partner, Transaction } from "@/services/db";
import {
  getPaginatedTransactionsAction,
  addTransactionAction,
} from "@/app/actions/transactionActions";
import { getPartnersAction } from "@/app/actions/partnerActions";
import { getMemberByIdOrPhoneAction } from "@/app/actions/memberAdminActions";
import { parseDiscountPercentage, toBanglaNums } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { TransactionsTab } from "../components/TransactionsTab";
import { TransactionDialog } from "../components/TransactionDialog";

export default function AdminTransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [partners, setPartners] = useState<Partner[]>([]);

  // Dialog States
  const [isTxOpen, setIsTxOpen] = useState(false);
  const [newTx, setNewTx] = useState({ memberId: "", partnerId: "", amount: "" });

  const loadData = useCallback(async () => {
    try {
      const [txRes, partnersRes] = await Promise.all([
        getPaginatedTransactionsAction({
          page,
          pageSize,
        }),
        getPartnersAction(),
      ]);
      setTransactions(txRes.data);
      setTotalItems(txRes.totalItems);
      setTotalPages(txRes.totalPages);
      setPartners(partnersRes);
    } catch {
      toast.error("লেনদেন লগ লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);


  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadData();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const member = await getMemberByIdOrPhoneAction(newTx.memberId);
      if (!member) {
        toast.error("মেম্বার খুঁজে পাওয়া যায়নি।");
        return;
      }

      if (member.status !== "active") {
        toast.error("মেম্বার সক্রিয় নন।");
        return;
      }

      const partner = partners.find((p) => p.id === newTx.partnerId);
      if (!partner) {
        toast.error("নির্বাচিত পার্টনার পাওয়া যায়নি।");
        return;
      }

      const billAmount = Number(newTx.amount);
      if (isNaN(billAmount) || billAmount <= 0) {
        toast.error("সঠিক বিলের পরিমাণ লিখুন।");
        return;
      }

      const discountRate = parseDiscountPercentage(partner.discount);
      const safeRate = Math.min(discountRate, 0.70);
      const saved = Math.round(billAmount * safeRate);

      const res = await addTransactionAction({
        memberId: member.id,
        memberName: member.name,
        partnerId: partner.id,
        partnerName: partner.name,
        amount: billAmount,
        saved: saved,
      });

      if ("error" in res) {
        toast.error(res.error || "লেনদেন সেভ করতে সমস্যা হয়েছে।");
        return;
      }

      toast.success(`মেম্বার সফলভাবে ৳${toBanglaNums(saved)} সাশ্রয় পেয়েছেন এবং লেনদেন রেকর্ড হয়েছে!`);
      setNewTx({ memberId: "", partnerId: "", amount: "" });
      setIsTxOpen(false);
      await loadData();
      window.dispatchEvent(new Event("admin-data-change"));
    } catch {
      toast.error("লেনদেন সেভ করতে সমস্যা হয়েছে।");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Card className="border-border shadow-md">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-64" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            লেনদেন লগ
          </h2>
          <p className="text-xs text-muted-foreground">
            মেম্বারদের ডিসকাউন্ট ও সেভিংসের রেকর্ড
          </p>
        </div>
        <Button
          onClick={() => setIsTxOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white font-semibold gap-2"
          size="sm"
        >
          <PlusCircle className="h-4 w-4" />
          + মেম্বার ডিসকাউন্ট এন্ট্রি করুন
        </Button>
      </div>

      <TransactionsTab
        transactions={transactions}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        loading={loading}
      />


      {isTxOpen && (
        <TransactionDialog
          isOpen={isTxOpen}
          onClose={setIsTxOpen}
          partners={partners}
          newTx={newTx}
          setNewTx={setNewTx}
          onSubmit={handleAddTransaction}
        />
      )}
    </div>
  );
}
