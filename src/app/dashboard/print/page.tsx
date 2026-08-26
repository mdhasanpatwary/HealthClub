"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authStore } from "@/services/authStore";
import { getMemberByIdAction } from "@/app/actions/memberActions";
import { Member } from "@/services/db";
import MemberCard from "@/components/ui/MemberCard";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function PrintCardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

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
    window.close();
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
      <div className="print:hidden w-full max-w-md bg-white/80 dark:bg-slate-950/80 backdrop-blur border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-lg mb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-200">
            {t("dashboard.print.title")}
          </h2>
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
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {t("dashboard.print.description")}
        </p>
        <div className="flex gap-2.5 mt-1">
          <Button 
            onClick={handlePrint}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold text-xs h-9 rounded-xl gap-1.5"
          >
            <Printer className="h-4 w-4" />
            {t("dashboard.print.printButton")}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="border-slate-200 dark:border-slate-800 text-xs font-semibold h-9 rounded-xl"
          >
            {t("dashboard.print.closeButton")}
          </Button>
        </div>
      </div>

      {/* Printable Card Area */}
      <div className="print-card-wrapper w-full max-w-md p-2 bg-transparent">
        <MemberCard member={member} />
      </div>

      {/* Printing Styles Injection */}
      <style jsx global>{`
        @media print {
          /* Hide everything except the card wrapper */
          body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Hide main dashboard layouts, headers, footers, control panel */
          header, footer, nav, aside, .print\:hidden, button, div[class*="print:hidden"] {
            display: none !important;
          }
          
          /* Reset print wrapper margins and shadows */
          .print-card-wrapper {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Ensure card is printable with backgrounds */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
