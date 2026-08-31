"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/services/authStore";
import { getMemberByIdAction } from "@/app/actions/memberActions";
import { Member } from "@/services/db";
import MemberCard from "@/components/ui/MemberCard";
import { Button } from "@/components/ui/button";
import { Printer, X, CreditCard, FileText, CheckCircle2, Sparkles, Scissors } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/layout/LanguageProvider";

type PrintMode = "cr80" | "sheet";

export default function PrintCardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [printMode, setPrintMode] = useState<PrintMode>("cr80");

  useEffect(() => {
    const currentUser = authStore.getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    getMemberByIdAction(currentUser.id).then((freshUser) => {
      const activeUser = freshUser || currentUser;
      setMember(activeUser);
      setLoading(false);

      // Auto trigger print after a brief delay to let images (avatar, QR code) load
      const timer = setTimeout(() => {
        window.print();
      }, 1000);

      return () => clearTimeout(timer);
    });
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      window.close();
    }
  };

  if (loading || !member) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-[240px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Print Control Panel (Hidden during printing) */}
      <div className="print:hidden w-full max-w-lg bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xl mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-heading text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                {t("dashboard.print.title")}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                CR80 (85.60 mm × 53.98 mm)
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close print preview"
            className="h-8 w-8 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Print Mode Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setPrintMode("cr80")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              printMode === "cr80"
                ? "bg-white dark:bg-slate-800 text-primary dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>{t("dashboard.print.modeCr80")}</span>
          </button>
          <button
            type="button"
            onClick={() => setPrintMode("sheet")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              printMode === "sheet"
                ? "bg-white dark:bg-slate-800 text-primary dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>{t("dashboard.print.modeSheet")}</span>
          </button>
        </div>

        {/* CR80 Specs & Quality Indicator */}
        <div className="bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("dashboard.print.specsTitle")}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10.5px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
              <span>{t("dashboard.print.specsDimensions")}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
              <span>{t("dashboard.print.specsCornerRadius")}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-emerald-500/10">
            💡 {t("dashboard.print.tipScale")} {t("dashboard.print.tipBackgrounds")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <Button
            onClick={handlePrint}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold text-xs h-10 rounded-xl gap-2 cursor-pointer shadow-md"
          >
            <Printer className="h-4 w-4" />
            {t("dashboard.print.printButton")}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-200 dark:border-slate-800 text-xs font-semibold h-10 rounded-xl cursor-pointer"
          >
            {t("dashboard.print.closeButton")}
          </Button>
        </div>
      </div>

      {/* Printable Card Area */}
      <div className={`print-card-wrapper ${printMode === "sheet" ? "print-sheet-mode" : "print-cr80-mode"} flex flex-col items-center justify-center p-2 bg-transparent`}>
        {/* Cut Guidelines Wrapper for A4 / Letter sheet printing */}
        <div className="relative group">
          {/* Subtle Crop Marks for Sheet Mode */}
          {printMode === "sheet" && (
            <div className="absolute -inset-4 pointer-events-none flex flex-col justify-between print:flex">
              <div className="flex justify-between items-start">
                <span className="w-3 h-3 border-t-2 border-l-2 border-slate-400 dark:border-slate-600 print:border-black" />
                <span className="w-3 h-3 border-t-2 border-r-2 border-slate-400 dark:border-slate-600 print:border-black" />
              </div>
              <div className="flex justify-between items-end">
                <span className="w-3 h-3 border-b-2 border-l-2 border-slate-400 dark:border-slate-600 print:border-black" />
                <span className="w-3 h-3 border-b-2 border-r-2 border-slate-400 dark:border-slate-600 print:border-black" />
              </div>
            </div>
          )}

          {/* Card Component */}
          <div className="relative">
            <MemberCard member={member} />
          </div>

          {/* Bottom Cut Guide Info for Sheet Mode */}
          {printMode === "sheet" && (
            <div className="mt-3 text-center text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center justify-center gap-1 print:flex">
              <Scissors className="h-3 w-3" />
              <span>{t("dashboard.print.cutGuideLabel")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Printing Styles Injection */}
      <style jsx global>{`
        @media print {
          @page {
            size: ${printMode === "cr80" ? "85.60mm 53.98mm" : "auto"};
            margin: ${printMode === "cr80" ? "0mm" : "15mm auto"};
          }

          html, body {
            background-color: ${printMode === "cr80" ? "#020617" : "#ffffff"} !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            width: ${printMode === "cr80" ? "85.60mm" : "100%"} !important;
            height: ${printMode === "cr80" ? "53.98mm" : "auto"} !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Hide main layouts, headers, footers, and control panel */
          header, footer, nav, aside, .print\\:hidden, button, div[class*="print:hidden"] {
            display: none !important;
          }
          
          /* CR80 Direct Mode Positioning */
          .print-cr80-mode {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 85.60mm !important;
            height: 53.98mm !important;
            max-width: 85.60mm !important;
            max-height: 53.98mm !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Sheet Mode Positioning with Cut Marks */
          .print-sheet-mode {
            position: static !important;
            margin: 0 auto !important;
            padding: 20mm 0 0 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* High-DPI and Anti-Aliasing for Print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            image-rendering: -webkit-optimize-contrast !important;
            image-rendering: high-quality !important;
          }
        }
      `}</style>
    </div>
  );
}
