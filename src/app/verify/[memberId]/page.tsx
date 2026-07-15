"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ShieldCheck, ShieldAlert, ArrowLeft } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Member } from "@/services/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function VerificationPage() {
  const params = useParams();
  const memberId = params?.memberId as string;
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (memberId) {
      const decodedId = decodeURIComponent(memberId);
      dbStore.getMemberById(decodedId).then((found) => {
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
        <div className="text-center text-muted-foreground">{t("pages.verify.loading")}</div>
      ) : member ? (
        
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
                <p className="text-base font-bold text-secondary">{member.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-3">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.memberId")}</span>
                  <p className="text-sm font-semibold text-secondary font-mono">{member.id}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.memberType")}</span>
                  <p className="text-sm font-semibold text-secondary capitalize">{member.tier}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-3">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.expiryDate")}</span>
                  <p className="text-sm font-semibold text-secondary font-mono">{member.expiryDate}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("pages.verify.membershipStatus")}</span>
                  <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 inline-flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    {t("pages.verify.active")}
                  </p>
                </div>
              </div>

            </div>

            {/* Guideline note for Hospital desk */}
            <div className="text-xs text-muted-foreground border-t border-border pt-4 text-center">
              <p className="font-semibold text-secondary mb-1">{t("pages.verify.todoAtHospital")}</p>
              <p>{t("pages.verify.todoStep1")}</p>
              <p className="mt-0.5">{t("pages.verify.todoStep2")}</p>
            </div>

            <div className="pt-2">
              <Link href="/">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t("pages.verify.backToHome")}
                </Button>
              </Link>
            </div>

          </CardContent>

        </Card>
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
              <p className="font-semibold text-secondary">{t("pages.verify.sorry")}</p>
              <p className="mt-1">
                {t("pages.verify.notFoundMessage")} (<span className="font-mono font-bold text-destructive">{decodeURIComponent(memberId)}</span>)
              </p>
              <p className="mt-2 text-xs">
                {t("pages.verify.invalidDesc")}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/">
                <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                  {t("pages.verify.goToHome")}
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="w-full text-primary hover:bg-primary-light">
                  {t("pages.verify.contactCustomerSupport")}
                </Button>
              </Link>
            </div>

          </CardContent>

        </Card>

      )}

    </div>
  );
}
