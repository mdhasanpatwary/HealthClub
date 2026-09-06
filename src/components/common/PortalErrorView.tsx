"use client";

import React, { ElementType, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { telemetry } from "@/lib/telemetry";
import { cn } from "@/lib/utils";

export interface PortalErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
  portalName: string;
  portalEnglishName: string;
  portalHomeHref: string;
  boundaryName: string;
  portalIcon?: ElementType;
  description?: string;
}

export function PortalErrorView({
  error,
  reset,
  portalName,
  portalEnglishName,
  portalHomeHref,
  boundaryName,
  portalIcon: PortalIcon,
  description,
}: PortalErrorViewProps) {
  useEffect(() => {
    telemetry.captureException(error, {
      digest: error.digest,
      boundary: boundaryName,
      portal: portalEnglishName,
    });
  }, [error, boundaryName, portalEnglishName]);

  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-8 sm:py-12 w-full">
      <Card className="max-w-lg w-full border-border shadow-xl bg-card rounded-2xl sm:rounded-3xl overflow-hidden">
        <CardContent className="p-6 sm:p-8 text-center space-y-6">
          {/* Error Visual Icon */}
          <div className="mx-auto inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 ring-8 ring-rose-50 dark:ring-rose-900/20 shadow-md">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          {/* Portal Scope & Heading */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/80 rounded-full border border-rose-200 dark:border-rose-800">
              {PortalIcon && <PortalIcon className="w-3.5 h-3.5" />}
              <span>
                {portalName} • {portalEnglishName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              সাময়িক সমস্যা দেখা দিয়েছে
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
              {description ||
                `${portalName}-এর এই অংশে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। আপনি পুনরায় চেষ্টা করতে পারেন অথবা আপনার ড্যাশবোর্ডে ফিরে যেতে পারেন।`}
            </p>
          </div>

          {/* Non-sensitive Digest if present */}
          {error.digest && (
            <div className="inline-block px-3 py-1 rounded-lg bg-muted/60 border border-border/50 text-[11px] text-muted-foreground font-mono">
              Error Digest: {error.digest}
            </div>
          )}

          {/* Mobile-First Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => reset()}
              size="lg"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>পুনরায় চেষ্টা করুন (Retry)</span>
            </Button>

            <Link
              href={portalHomeHref}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              )}
            >
              {PortalIcon ? <PortalIcon className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{portalName}-এ ফিরে যান</span>
            </Link>
          </div>

          {/* Secondary Exit Link */}
          <div className="pt-3 border-t border-border/40">
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>মূল ওয়েবসাইটে ফিরে যান (Homepage)</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
