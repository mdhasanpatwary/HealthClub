"use client";

import { useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MonthlySettlementStatement } from "@/types/partnerAnalytics";
import { Partner } from "@/services/db";
import { Locale } from "@/lib/i18n";
import { Printer, X, Building2, CheckCircle2, ShieldCheck } from "lucide-react";

interface PartnerSettlementPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  statement: MonthlySettlementStatement | null;
  partner: Partner;
  locale: Locale;
}

export function PartnerSettlementPrintModal({
  isOpen,
  onClose,
  statement,
  partner,
  locale,
}: PartnerSettlementPrintModalProps) {
  const isBn = locale === "bn";
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!statement) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-border bg-background">
        {/* Header Controls (Hidden during print) */}
        <div className="print:hidden p-5 sm:p-6 border-b border-border flex items-center justify-between gap-4 bg-muted/40 sticky top-0 z-10 backdrop-blur">
          <div>
            <DialogTitle className="text-base sm:text-lg font-bold font-heading text-secondary dark:text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span>{isBn ? "মাসিক সেটেলমেন্ট ও বিলিং স্টেটমেন্ট" : "Monthly Settlement & Billing Statement"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isBn ? `${statement.monthLabelBn} এর পূর্ণাঙ্গ স্টেটমেন্ট ও বিলিং সারসংক্ষেপ` : `Complete statement summary for ${statement.monthLabelEn}`}
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>{isBn ? "প্রিন্ট / PDF ডাউনলোড" : "Print / Save PDF"}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div
          ref={printContentRef}
          id="partner-settlement-print-content"
          className="p-6 sm:p-8 space-y-6 text-slate-900 bg-white min-h-[500px]"
        >
          {/* Header Branding */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-emerald-600 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                  HC
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">
                    হেলথ ক্লাব (Health Club)
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Smart Healthcare Discount & Privilege Network • Sylhet, Bangladesh
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-md">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isBn ? "সেটেলমেন্ট স্টেটমেন্ট" : "SETTLEMENT STATEMENT"}
              </span>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {isBn ? "তারিখ:" : "Generated:"} {new Date().toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>

          {/* Hospital & Billing Period Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                {isBn ? "পার্টনার হাসপাতাল / প্রতিষ্ঠান" : "Partner Hospital / Facility"}
              </p>
              <p className="text-sm font-bold text-slate-900">{partner.name}</p>
              <p className="text-slate-600">{partner.address}</p>
              <p className="text-slate-600 font-mono">
                {isBn ? "ফোন:" : "Phone:"} {partner.phone} {partner.emergencyPhone && `| জরুরি: ${partner.emergencyPhone}`}
              </p>
            </div>

            <div className="space-y-1 sm:text-right">
              <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                {isBn ? "বিলিং মেয়াদ / স্টেটমেন্ট মাস" : "Statement Billing Month"}
              </p>
              <p className="text-base font-extrabold text-emerald-700">
                {isBn ? statement.monthLabelBn : statement.monthLabelEn}
              </p>
              <p className="text-slate-600">
                {isBn ? "পার্টনার ডিসকাউন্ট হার:" : "Agreed Discount Rate:"}{" "}
                <strong className="text-slate-900">{partner.discount}</strong>
              </p>
              <p className="text-slate-600">
                {isBn ? "মোট সেবাগ্রহীতা:" : "Total Visits:"}{" "}
                <strong className="font-mono text-slate-900">{statement.totalTransactions}</strong>
              </p>
            </div>
          </div>

          {/* KPI Financial Overview Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
              <p className="text-[10px] uppercase font-bold text-slate-500">
                {isBn ? "মোট সেবা বিল" : "Gross Bill Amount"}
              </p>
              <p className="text-lg font-bold font-mono text-slate-800 mt-0.5">
                ৳{statement.grossAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60">
              <p className="text-[10px] uppercase font-bold text-emerald-700">
                {isBn ? "মোট ছাড় প্রদান (ডিসকাউন্ট)" : "Total Discount Dispensed"}
              </p>
              <p className="text-lg font-bold font-mono text-emerald-700 mt-0.5">
                ৳{statement.totalDiscountDispensed.toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
              <p className="text-[10px] uppercase font-bold text-slate-500">
                {isBn ? "রোগী কর্তৃক মোট পরিশোধিত" : "Net Patient Paid"}
              </p>
              <p className="text-lg font-bold font-mono text-slate-800 mt-0.5">
                ৳{statement.netPatientPaid.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Itemized Transactions Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {isBn ? "আইটেমাইজড রোগী ও লেনদেন তালিকা" : "Itemized Patient Transactions"}
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {statement.transactions.length} {isBn ? "টি রেকর্ড" : "records"}
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5 w-10 text-center">#</th>
                    <th className="p-2.5">{isBn ? "তারিখ" : "Date"}</th>
                    <th className="p-2.5">{isBn ? "মেম্বার আইডি" : "Member ID"}</th>
                    <th className="p-2.5">{isBn ? "রোগীর নাম" : "Patient Name"}</th>
                    <th className="p-2.5 text-right">{isBn ? "গ্রস বিল" : "Gross Bill"}</th>
                    <th className="p-2.5 text-right text-emerald-700">{isBn ? "ডিসকাউন্ট" : "Discount"}</th>
                    <th className="p-2.5 text-right">{isBn ? "পরিশোধিত" : "Net Paid"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {statement.transactions.map((tx, idx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="p-2.5 text-slate-600 font-mono whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                      <td className="p-2.5 font-mono font-medium text-slate-700">{tx.memberId}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{tx.memberName}</td>
                      <td className="p-2.5 text-right font-mono text-slate-700">৳{tx.amount.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-600">৳{tx.saved.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-mono font-semibold text-slate-800">৳{(tx.amount - tx.saved).toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <td colSpan={4} className="p-2.5 text-right text-slate-800 uppercase tracking-wide">
                      {isBn ? "সর্বমোট (Total):" : "Total Summary:"}
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-900">৳{statement.grossAmount.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-mono text-emerald-700">৳{statement.totalDiscountDispensed.toLocaleString()}</td>
                    <td className="p-2.5 text-right font-mono text-slate-900">৳{statement.netPatientPaid.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Authorization & Signature Block */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-xs border-t border-slate-200 mt-6">
            <div className="space-y-10">
              <p className="text-[11px] text-slate-500">
                {isBn
                  ? "হেলথ ক্লাব মেম্বারশিপ কার্ডধারীদের চিকিৎসা সেবায় প্রদত্ত সকল ছাড়ের সত্যতা প্রত্যয়ন করা হলো।"
                  : "Certified that all discounts provided to Health Club verified members were rendered as per agreement."}
              </p>
              <div className="border-t border-slate-400 w-44 pt-1.5 text-center">
                <p className="font-bold text-slate-800">{isBn ? "হাসপাতাল কর্তৃপক্ষ / ক্যাশিয়ার" : "Hospital Authority / Cashier"}</p>
                <p className="text-[10px] text-slate-400">{partner.name}</p>
              </div>
            </div>

            <div className="space-y-10 text-right flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                <ShieldCheck className="h-4 w-4" />
                <span>Health Club Verified System Record</span>
              </div>
              <div className="border-t border-slate-400 w-44 pt-1.5 text-center">
                <p className="font-bold text-slate-800">{isBn ? "অনুমোদিত কর্মকর্তা" : "Authorized Officer"}</p>
                <p className="text-[10px] text-slate-400">Health Club Administration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Print Styles */}
        <style jsx global>{`
          @media print {
            body {
              background-color: white !important;
              color: black !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            /* Hide non-print elements */
            header, footer, nav, aside, .print\\:hidden, button, div[role="dialog"] > button {
              display: none !important;
            }

            #partner-settlement-print-content {
              position: static !important;
              width: 100% !important;
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
