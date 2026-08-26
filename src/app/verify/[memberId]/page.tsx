"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShieldCheck, ShieldAlert, ArrowLeft } from "lucide-react";
import { getPublicMemberVerificationAction } from "@/app/actions/memberActions";
import { PublicMemberVerification } from "@/services/db";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerificationPage() {
  const params = useParams();
  const memberId = params?.memberId as string;
  const [member, setMember] = useState<PublicMemberVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (memberId) {
      const decodedId = decodeURIComponent(memberId);
      getPublicMemberVerificationAction(decodedId).then((found) => {
        if (found) {
          setMember(found);
        }
        setLoading(false);
      });
    }
  }, [memberId]);

  return (
    <div className="bg-muted/30 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {loading ? (
        <Card className="w-full max-w-md border border-border shadow-2xl bg-background/90 backdrop-blur text-center overflow-hidden animate-pulse">
          <div className="bg-muted/30 py-6 border-b border-border/80 space-y-3">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-3.5 w-32 mx-auto" />
          </div>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="space-y-4 text-left bg-muted/40 p-4 rounded-2xl border border-border">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-3">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-3">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      ) : member ? (
        (() => {
          const expiryDate = new Date(member.expiryDate);
          expiryDate.setHours(23, 59, 59, 999);
          const isExpired = expiryDate < new Date();
          const isActive = member.status === "active" && !isExpired;

          return isActive ? (
          /* 1. VERIFIED SUCCESS SCREEN */
          <Card className="w-full max-w-md border-2 border-primary shadow-2xl bg-background/90 backdrop-blur text-center overflow-hidden">
            
            {/* Header decorative badge */}
            <div className="bg-primary/10 py-6 border-b border-primary/20">
              <ShieldCheck className="h-16 w-16 text-primary mx-auto animate-pulse" />
              <h1 className="font-heading text-2xl font-bold text-primary mt-2">
                {t("pages.verify.verifiedMember")}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                {t("pages.verify.verifiedDatabase")}
              </p>
            </div>

            <CardContent className="p-6 md:p-8 space-y-6">
              
              {/* Member Details */}
              <div className="space-y-4 text-left bg-muted/40 p-4 rounded-2xl border border-border">
                
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.memberName")}</span>
                  <p className="text-base font-bold text-secondary dark:text-white">{member.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.memberId")}</span>
                    <p className="text-sm font-semibold text-primary font-mono">{member.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.memberType")}</span>
                    <p className="text-sm font-semibold text-secondary dark:text-white capitalize">{member.tier}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.expiryDate")}</span>
                    <p className="text-sm font-semibold text-secondary dark:text-white font-mono">{member.expiryDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.membershipStatus")}</span>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 inline-flex items-center gap-1 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {t("pages.verify.active")}
                    </p>
                  </div>
                </div>

              </div>

              {/* Guideline note for Hospital desk */}
              <div className="text-xs text-muted-foreground border-t border-border pt-4 text-center">
                <p className="font-semibold text-secondary dark:text-white mb-1">{t("pages.verify.todoAtHospital")}</p>
                <p>{t("pages.verify.todoStep1")}</p>
                <p className="mt-0.5">{t("pages.verify.todoStep2")}</p>
              </div>

              <div className="pt-2">
                <Link
                  href="/"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full gap-2",
                  })}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("pages.verify.backToHome")}
                </Link>
              </div>

            </CardContent>

          </Card>
        ) : (
          /* PENDING / INACTIVE / EXPIRED SCREEN */
          <Card className="w-full max-w-md border-2 border-amber-500 shadow-2xl bg-background/90 backdrop-blur text-center overflow-hidden">
            <div className="bg-amber-500/10 py-6 border-b border-amber-500/20">
              <ShieldAlert className="h-16 w-16 text-amber-500 mx-auto animate-bounce" />
              <h1 className="font-heading text-2xl font-bold text-amber-600 mt-2">
                {isExpired ? t("verifyMember.expiredTitle") : t("verifyMember.inactiveTitle")}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                {isExpired ? t("verifyMember.expiredDesc") : t("verifyMember.pendingDesc")}
              </p>
            </div>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-4 text-left bg-muted/40 p-4 rounded-2xl border border-border">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.memberName")}</span>
                  <p className="text-base font-bold text-secondary dark:text-white">{member.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.memberId")}</span>
                    <p className="text-sm font-semibold text-secondary dark:text-white font-mono">{member.id}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.memberType")}</span>
                    <p className="text-sm font-semibold text-secondary dark:text-white capitalize">{member.tier}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.membershipStatus")}</span>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 inline-flex items-center gap-1 mt-0.5 uppercase">
                      {isExpired ? "EXPIRED" : "PENDING APPROVAL"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.expiryDate")}</span>
                    <p className="text-xs font-bold font-mono text-secondary dark:text-white mt-0.5">
                      {member.expiryDate}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground border-t border-border pt-4 text-center">
                {isExpired ? t("verifyMember.expiredNote") : t("verifyMember.pendingNote")}
              </div>
              <div className="pt-2">
                <Link
                  href="/"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full gap-2",
                  })}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("pages.verify.backToHome")}
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })()
      ) : (
        
        /* 2. INVALID CARD SCREEN */
        <Card className="w-full max-w-md border-2 border-destructive shadow-2xl bg-background/90 backdrop-blur text-center overflow-hidden">
          
          <div className="bg-destructive/10 py-6 border-b border-destructive/20">
            <ShieldAlert className="h-16 w-16 text-destructive mx-auto animate-bounce" />
            <h1 className="font-heading text-2xl font-bold text-destructive mt-2">
              {t("pages.verify.invalidId")}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {t("pages.verify.idNotFound")}
            </p>
          </div>

          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="p-4 bg-muted/40 rounded-2xl border border-border text-sm text-muted-foreground">
              <p className="font-semibold text-secondary dark:text-white">{t("pages.verify.sorry")}</p>
              <p className="mt-1">
                {t("pages.verify.notFoundMessage")} (<span className="font-mono font-bold text-destructive">{decodeURIComponent(memberId)}</span>)
              </p>
              <p className="mt-2 text-xs">
                {t("pages.verify.invalidDesc")}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className={buttonVariants({
                  className: "w-full bg-primary hover:bg-primary-dark text-white font-semibold",
                })}
              >
                <span>{t("pages.verify.goToHome")}</span>
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({
                  variant: "ghost",
                  className: "w-full text-primary hover:bg-primary-light",
                })}
              >
                <span>{t("pages.verify.contactCustomerSupport")}</span>
              </Link>
            </div>

          </CardContent>

        </Card>

      )}

    </div>
  );
}
