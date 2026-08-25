import React from "react";
import Link from "next/link";
import { CreditCard, Download } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MemberCard from "@/components/ui/MemberCard";
import { Member } from "@/services/db";

interface DashboardCardSectionProps {
  user: Member;
  cardRef: React.RefObject<HTMLDivElement | null>;
  handleDownloadCard: () => void;
  t: (key: string) => string;
}

export function DashboardCardSection({
  user,
  cardRef,
  handleDownloadCard,
  t,
}: DashboardCardSectionProps) {
  return (
    <div className="lg:col-span-5 space-y-4">
      <Card className="border-border/60 shadow-md overflow-hidden">
        <CardHeader className="border-b border-border/60 pb-4 bg-muted/30 dark:bg-slate-900/60">
          <CardTitle className="font-heading text-base font-bold text-secondary dark:text-white flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            {t("dashboard.card.title")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.card.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-5">
          {user.status === "active" ? (
            <div className="space-y-4">
              <div className="w-full flex justify-center pb-1">
                <MemberCard ref={cardRef} member={user} />
              </div>
              <Button
                onClick={handleDownloadCard}
                variant="outline"
                className="w-full text-xs active:scale-[0.98]"
              >
                <Download className="h-4 w-4 text-primary" />
                {t("dashboard.card.printButton")}
              </Button>
            </div>
          ) : user.status === "pending_payment" || (user.status === "inactive" && user.tier === "premium") ? (
            <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 overflow-hidden border border-rose-500/20 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col justify-center items-center text-center space-y-3 shadow-lg">
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px]" />
              <div className="z-10 bg-rose-500/10 p-2.5 rounded-full border border-rose-500/20">
                <CreditCard className="h-6 w-6 text-rose-500 animate-pulse" />
              </div>
              <h4 className="z-10 font-heading text-white font-bold text-sm">{t("dashboard.card.payFee")}</h4>
              <p className="z-10 text-[11px] text-slate-300 max-w-xs leading-relaxed">
                {t("dashboard.card.payFeeDesc")}
              </p>
              <Link href={`/register/payment?memberId=${user.id}`} className="z-10">
                <Button size="xs" className="bg-[#e2125d] hover:bg-[#c20f4f] text-white shadow-md cursor-pointer">
                  {t("dashboard.card.payButton")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 overflow-hidden border border-amber-500/20 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col justify-center items-center text-center space-y-2.5 shadow-lg">
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px]" />
              <div className="z-10 bg-amber-500/10 p-2 rounded-full border border-amber-500/20">
                <svg className="h-6 w-6 text-amber-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="z-10 font-heading text-white font-bold text-sm">{t("dashboard.card.pendingApproval")}</h4>
              <p className="z-10 text-[11px] text-slate-300 max-w-xs leading-relaxed">
                {t("dashboard.card.pendingApprovalDesc")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
