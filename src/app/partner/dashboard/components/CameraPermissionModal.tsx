"use client";

import React from "react";
import { Camera, Sparkles, Keyboard, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface CameraPermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestAccess: () => Promise<void> | void;
  onManualInput: () => void;
  isRequesting: boolean;
}

export function CameraPermissionModal({
  open,
  onOpenChange,
  onRequestAccess,
  onManualInput,
  isRequesting,
}: CameraPermissionModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-popover max-w-md p-6 rounded-3xl shadow-xl">
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Camera className="h-8 w-8" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[10px] text-white font-bold items-center justify-center">!</span>
            </span>
          </div>

          <DialogTitle className="font-heading text-lg sm:text-xl font-bold text-secondary dark:text-white leading-snug">
            {t("partner.billing.cameraPermissionTitle")}
          </DialogTitle>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground text-center">
            {t("partner.billing.cameraPermissionDesc")}
          </DialogDescription>
        </DialogHeader>

        {/* Guidance Instructions Card */}
        <div className="rounded-2xl border border-border bg-slate-50 dark:bg-slate-900/50 p-4 space-y-2.5 text-xs text-secondary dark:text-slate-200">
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t("partner.billing.cameraPermissionStep1")}
            </p>
          </div>
          <div className="flex items-start gap-2.5 pt-2 border-t border-border/60">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-muted-foreground">
              {t("partner.billing.cameraPermissionStep2")}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <Button
            type="button"
            onClick={onRequestAccess}
            disabled={isRequesting}
            className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl gap-2 shadow-sm cursor-pointer"
          >
            {isRequesting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>{t("partner.billing.grantCameraPermissionBtn")}...</span>
              </span>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                <span>{t("partner.billing.grantCameraPermissionBtn")}</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onManualInput}
            className="w-full h-11 border-border rounded-xl font-medium text-secondary dark:text-slate-200 hover:bg-muted/50 gap-2 cursor-pointer"
          >
            <Keyboard className="h-4 w-4 text-muted-foreground" />
            <span>{t("partner.billing.enterManuallyBtn")}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
