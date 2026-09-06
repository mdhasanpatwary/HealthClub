"use client";

import { ShieldAlert } from "lucide-react";
import { PortalErrorView } from "@/components/common/PortalErrorView";

export default function AdminErrorBoundary({
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
      portalName="অ্যাডমিন প্যানেল"
      portalEnglishName="Admin Portal"
      portalHomeHref="/admin"
      boundaryName="admin/error"
      portalIcon={ShieldAlert}
      description="অ্যাডমিন পোর্টালের এই সেকশনটিতে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন অথবা অ্যাডমিন মূল ড্যাশবোর্ডে ফিরে যান।"
    />
  );
}
