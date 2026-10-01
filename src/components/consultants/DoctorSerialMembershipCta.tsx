"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface DoctorSerialMembershipCtaProps {
  doctorId: string;
}

export function DoctorSerialMembershipCta({ doctorId }: DoctorSerialMembershipCtaProps) {
  return (
    <Link
      href="/membership"
      onClick={() => {
        trackEvent("membership_funnel", {
          step: "serial_cta_click",
          source: `doctor_profile_serial_${doctorId}`,
        });
      }}
      className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-xs"
    >
      <span>১ মিনিটে ফ্রি মেম্বার কার্ড সংগ্রহ করুন</span>
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}

export default DoctorSerialMembershipCta;
