"use client";

import { LayoutDashboard } from "lucide-react";
import { PortalErrorView } from "@/components/common/PortalErrorView";

export default function DashboardErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PortalErrorView
      error={error}
      reset={reset}
      portalName="মেম্বার ড্যাশবোর্ড"
      portalEnglishName="Member Dashboard"
      portalHomeHref="/dashboard"
      boundaryName="dashboard/error"
      portalIcon={LayoutDashboard}
      description="মেম্বার ড্যাশবোর্ডের এই সেকশনটিতে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন অথবা ড্যাশবোর্ড হোমে ফিরে যান।"
    />
  );
}
