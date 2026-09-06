"use client";

import { Building2 } from "lucide-react";
import { PortalErrorView } from "@/components/common/PortalErrorView";

export default function PartnerErrorBoundary({
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
      portalName="পার্টনার ড্যাশবোর্ড"
      portalEnglishName="Partner Portal"
      portalHomeHref="/partner/dashboard"
      boundaryName="partner/error"
      portalIcon={Building2}
      description="পার্টনার পোর্টালের এই সেকশনটিতে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন অথবা পার্টনার মূল ড্যাশবোর্ডে ফিরে যান।"
    />
  );
}
