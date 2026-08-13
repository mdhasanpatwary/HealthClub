"use client";

import { Button } from "@/components/ui/button";
import { WifiOff, RotateCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 py-12">
      <div className="flex flex-col items-center text-center max-w-md gap-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-primary" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-heading text-secondary dark:text-white">ইন্টারনেট সংযোগ নেই</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            আপনি অফলাইনে আছেন। ইন্টারনেট সংযোগ চালু করুন এবং পুনরায় চেষ্টা করুন।
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            You&apos;re offline. Please check your internet connection and try again.
          </p>
        </div>

        {/* Retry button */}
        <Button
          onClick={() => window.location.reload()}
          size="lg"
          className="mt-2 bg-primary hover:bg-primary-dark text-white rounded-xl gap-2 font-semibold shadow-sm"
        >
          <RotateCw className="h-4 w-4" />
          পুনরায় চেষ্টা করুন · Retry
        </Button>
      </div>
    </div>
  );
}
