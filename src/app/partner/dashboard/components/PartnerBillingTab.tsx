"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Camera, Search, CheckCircle, XCircle, AlertTriangle, Receipt, CreditCard } from "lucide-react";
import { Partner, Transaction } from "@/services/db";
import { authStore } from "@/services/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { verifyMemberForPartnerAction } from "@/app/actions/memberActions";
import { addPartnerTransactionAction } from "@/app/actions/partnerActions";
import { parseDiscountPercentage } from "@/lib/utils";
import { toast } from "sonner";
import type { Html5Qrcode } from "html5-qrcode";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { CameraPermissionModal } from "./CameraPermissionModal";
import { PartnerRecentTransactionsCard } from "./PartnerRecentTransactionsCard";

interface VerifiedMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: string;
  status: string;
  expiryDate: string;
  totalSaved: number;
  profilePictureUrl: string;
  isExpired: boolean;
}

interface PartnerBillingTabProps {
  partner: Partner;
  transactions: Transaction[];
  loadingTransactions: boolean;
  onTransactionComplete: () => void;
}

export function PartnerBillingTab({
  partner,
  transactions,
  loadingTransactions,
  onTransactionComplete,
}: PartnerBillingTabProps) {
  const { t, locale } = useLanguage();
  const [memberId, setMemberId] = useState("");
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [verifiedMember, setVerifiedMember] = useState<VerifiedMember | null>(null);

  // Transaction Form States
  const [billAmount, setBillAmount] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Scanner States & Permission Modal
  const [scanning, setScanning] = useState(false);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [requestingPermission, setRequestingPermission] = useState(false);

  const startScanner = async () => {
    setVerifiedMember(null);

    // Pre-check if camera permission is explicitly denied
    if (typeof navigator !== "undefined" && navigator.permissions?.query) {
      try {
        const result = await navigator.permissions.query({ name: "camera" as PermissionName });
        if (result.state === "denied") {
          setPermissionModalOpen(true);
          return;
        }
      } catch {
        // Permissions query for camera is not supported in all browsers, safe to proceed
      }
    }

    setScanning(true);
  };

  const stopScanner = () => {
    setScanning(false);
  };

  const handleRequestCameraPermission = async () => {
    setRequestingPermission(true);
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Close test stream tracks immediately
        stream.getTracks().forEach((track) => track.stop());
        toast.success(t("partner.billing.cameraSuccessToast"));
        setPermissionModalOpen(false);
        setScanning(true);
      } else {
        toast.error(t("partner.billing.cameraErrorToast"));
      }
    } catch (err: unknown) {
      const error = err as { name?: string };
      if (error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError") {
        toast.error(t("partner.billing.cameraBlockedToast"));
      } else {
        toast.error(t("partner.billing.cameraErrorToast"));
      }
    } finally {
      setRequestingPermission(false);
    }
  };

  const handleManualInputSelect = () => {
    setPermissionModalOpen(false);
    setScanning(false);
    const inputEl = document.getElementById("partner-member-id-input");
    if (inputEl) {
      inputEl.focus();
    }
  };

  const handleVerifyDirect = useCallback(async (idToVerify: string) => {
    if (!idToVerify) return;
    setLoadingVerify(true);
    setVerifiedMember(null);
    try {
      const res = await verifyMemberForPartnerAction(idToVerify);
      if (res.success && res.member) {
        setVerifiedMember(res.member);
        toast.success(t("partner.billing.memberVerifiedToast"));
      } else {
        toast.error(res.message || t("partner.billing.memberInvalidToast"));
      }
    } catch {
      toast.error(t("partner.billing.verifyErrorToast"));
    } finally {
      setLoadingVerify(false);
    }
  }, [t]);

  // Scanner mount/start effect
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    let isStarted = false;

    const setupScanner = async () => {
      if (!scanning) return;

      await new Promise((resolve) => setTimeout(resolve, 100));

      const element = document.getElementById("qr-reader");
      if (!element) {
        toast.error(t("partner.billing.cameraErrorToast"));
        setScanning(false);
        return;
      }

      const { Html5Qrcode } = await import("html5-qrcode");
      try {
        html5QrCode = new Html5Qrcode("qr-reader");

        const qrConfig = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        };

        const onSuccess = (decodedText: string) => {
          setMemberId(decodedText);
          handleVerifyDirect(decodedText);
          setScanning(false);
        };

        const onError = () => {
          // Silently ignore frame errors
        };

        let started = false;

        // 1. Try rear camera (environment) first - ideal for mobile & tablet
        try {
          await html5QrCode.start(
            { facingMode: "environment" },
            qrConfig,
            onSuccess,
            onError
          );
          started = true;
        } catch (backCamError: unknown) {
          const err = backCamError as { name?: string; message?: string };
          // If explicitly denied permission, throw to trigger permission modal
          if (
            err?.name === "NotAllowedError" ||
            err?.name === "PermissionDeniedError" ||
            String(err?.message || "").toLowerCase().includes("permission")
          ) {
            throw backCamError;
          }

          // 2. Fallback for laptop / desktop / front webcam
          try {
            const devices = await Html5Qrcode.getCameras().catch(() => []);
            if (devices && devices.length > 0) {
              await html5QrCode.start(
                devices[0].id,
                qrConfig,
                onSuccess,
                onError
              );
              started = true;
            } else {
              await html5QrCode.start(
                { facingMode: "user" },
                qrConfig,
                onSuccess,
                onError
              );
              started = true;
            }
          } catch (fallbackError) {
            throw fallbackError;
          }
        }

        isStarted = started;
      } catch (err: unknown) {
        console.error("Camera scanner setup error:", err);
        const error = err as { name?: string; message?: string };
        const isPermission =
          error?.name === "NotAllowedError" ||
          error?.name === "PermissionDeniedError" ||
          String(error?.message || "").toLowerCase().includes("permission") ||
          String(error?.message || "").toLowerCase().includes("notallowederror");

        setScanning(false);
        if (isPermission) {
          setPermissionModalOpen(true);
        } else {
          toast.error(t("partner.billing.cameraErrorToast"));
        }
      }
    };

    setupScanner();

    return () => {
      if (html5QrCode && isStarted) {
        isStarted = false;
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [scanning, t, handleVerifyDirect]);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyDirect(memberId);
  };

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedMember || !billAmount || isNaN(Number(billAmount))) {
      toast.error(t("partner.billing.invalidAmountToast"));
      return;
    }

    setLoadingSubmit(true);
    try {
      const res = await addPartnerTransactionAction({
        memberId: verifiedMember.id,
        amount: Math.round(Number(billAmount)),
      });

      if (res.success) {
        toast.success(res.message);
        setBillAmount("");
        setVerifiedMember(null);
        setMemberId("");
        onTransactionComplete();
      } else {
        toast.error(res.message || t("partner.billing.verifyErrorToast"));
      }
    } catch {
      toast.error(t("common.error.server"));
    } finally {
      setLoadingSubmit(false);
    }
  };

  const currentStaff = typeof window !== "undefined" ? authStore.getCurrentStaff() : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Left 2 Cols: Scanner and validation */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-border shadow-sm rounded-3xl">
          <CardHeader className="p-5 sm:p-6 pb-2 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="font-heading text-lg sm:text-xl font-bold text-secondary dark:text-white">
                  {t("partner.billing.cardTitle")}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {t("partner.billing.cardSubtitle")}
                </CardDescription>
              </div>
              {currentStaff && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-800 dark:text-emerald-300 font-semibold self-start sm:self-auto shrink-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{currentStaff.deskName}</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-0 space-y-6">
            {/* QR Reader Area */}
            {scanning ? (
              <div className="space-y-4">
                <div id="qr-reader" className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-border bg-slate-950 aspect-square flex items-center justify-center"></div>
                <div className="text-center">
                  <Button onClick={stopScanner} variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10 rounded-xl cursor-pointer">
                    {t("partner.billing.stopScanner")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center py-6 border-2 border-dashed border-border rounded-2xl bg-muted/20">
                <Button onClick={startScanner} className="bg-primary hover:bg-primary-dark text-white gap-2 font-semibold rounded-xl cursor-pointer">
                  <Camera className="h-4 w-4" />
                  {t("partner.billing.scanQr")}
                </Button>
                <span className="text-muted-foreground text-xs sm:text-sm">{t("partner.billing.orEnterId")}</span>
              </div>
            )}

            {/* Manual Input */}
            <form onSubmit={handleVerifySubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="partner-member-id-input"
                  type="text"
                  required
                  aria-label={t("partner.billing.memberIdAria")}
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder={t("partner.billing.memberIdPlaceholder")}
                  className="pl-10 h-11 border-border rounded-xl"
                />
              </div>
              <Button type="submit" disabled={loadingVerify} className="h-11 bg-secondary text-white hover:bg-slate-800 rounded-xl font-medium cursor-pointer">
                {loadingVerify ? t("partner.billing.verifying") : t("partner.billing.verifyBtn")}
              </Button>
            </form>

            {/* Verified Member Display */}
            {verifiedMember && (
              <div className="p-5 rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-900/60 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-start gap-4">
                  {verifiedMember.profilePictureUrl ? (
                    <Image
                      src={verifiedMember.profilePictureUrl}
                      alt={verifiedMember.name}
                      width={56}
                      height={56}
                      unoptimized
                      className="h-14 w-14 rounded-full object-cover border border-border shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold uppercase border border-border shrink-0">
                      {verifiedMember.name.substring(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-secondary dark:text-white truncate">{verifiedMember.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        verifiedMember.tier === "founding" 
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20" 
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}>
                        {verifiedMember.tier === "founding" ? t("partner.billing.foundingMember") : t("partner.billing.premiumMember")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("partner.billing.memberId")}: {verifiedMember.id}</p>
                    <p className="text-xs text-muted-foreground">{t("partner.billing.phone")}: {verifiedMember.phone}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    {verifiedMember.isExpired ? (
                      <div className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-1 rounded-full border border-destructive/20">
                        <XCircle className="h-3.5 w-3.5" />
                        {t("partner.billing.expired")}
                      </div>
                    ) : verifiedMember.status === "active" ? (
                      <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20">
                        <CheckCircle className="h-3.5 w-3.5" />
                        {t("partner.billing.activeCard")}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/20">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {t("partner.billing.inactiveCard")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction submission form if card is active & valid */}
                {!verifiedMember.isExpired && verifiedMember.status === "active" ? (
                  <form onSubmit={handleTransactionSubmit} className="pt-4 border-t border-border space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="partner-bill-amount" className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                        <Receipt className="h-3.5 w-3.5 text-primary" />
                        {t("partner.billing.billAmountLabel")}
                      </label>
                      <Input
                        id="partner-bill-amount"
                        type="number"
                        required
                        min="1"
                        value={billAmount}
                        onChange={(e) => setBillAmount(e.target.value)}
                        placeholder={t("partner.billing.billAmountPlaceholder")}
                        className="h-11 border-border rounded-xl"
                      />
                    </div>
                    {billAmount && !isNaN(Number(billAmount)) && Number(billAmount) > 0 && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 flex justify-between items-center text-sm font-semibold text-primary">
                        <span>{t("partner.billing.estimatedSaving")}</span>
                        <span className="text-base font-extrabold font-mono">
                          ৳{Math.round(Number(billAmount) * parseDiscountPercentage(partner.discount))}
                        </span>
                      </div>
                    )}
                    <Button type="submit" disabled={loadingSubmit} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl h-11 gap-1.5 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      {loadingSubmit ? t("partner.billing.processingTx") : t("partner.billing.completeTx")}
                    </Button>
                  </form>
                ) : (
                  <div className="p-3.5 bg-destructive/5 border border-destructive/10 text-destructive rounded-xl text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{t("partner.billing.cardInactiveNotice")}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right 1 Col: Recent Transactions history */}
      <div>
        <PartnerRecentTransactionsCard
          transactions={transactions}
          loadingTransactions={loadingTransactions}
          locale={locale}
          t={t}
        />
      </div>

      {/* Camera Permission Request Modal */}
      <CameraPermissionModal
        open={permissionModalOpen}
        onOpenChange={setPermissionModalOpen}
        onRequestAccess={handleRequestCameraPermission}
        onManualInput={handleManualInputSelect}
        isRequesting={requestingPermission}
      />
    </div>
  );
}
