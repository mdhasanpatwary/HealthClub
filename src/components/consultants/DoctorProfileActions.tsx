"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PhoneCall, Navigation, Share2 } from "lucide-react";
import { Doctor, Partner } from "@/services/db";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/siteConfig";

// Lazy-load modal to avoid downloading modal code and dependencies on initial page load
const DoctorSerialModal = dynamic(
  () => import("@/components/ui/doctors/DoctorModals").then((m) => m.DoctorSerialModal),
  { ssr: false }
);

interface DoctorProfileActionsProps {
  doctor: Doctor & { partner?: Partner | null };
}

export function DoctorProfileActions({ doctor }: DoctorProfileActionsProps) {
  const [showSerialModal, setShowSerialModal] = useState(false);

  const getMapUrl = () => {
    if (doctor.partner?.mapLink) return doctor.partner.mapLink;
    const query = `${doctor.chamberName}, ${doctor.chamberAddress}, Feni`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const handleShare = async () => {
    const profileUrl = typeof window !== "undefined"
      ? window.location.href
      : `${SITE_URL}/consultants/${encodeURIComponent(doctor.slug || doctor.id)}`;
    const shareTitle = `${doctor.name} - ${doctor.specialty} | Health Club`;
    const shareText = `${doctor.name} (${doctor.specialty}), ${doctor.chamberName}, Feni. সিরিয়াল হটলাইন: ${doctor.serialPhone}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: profileUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("ডাক্তারের প্রোফাইল লিংক কপি করা হয়েছে!");
    } catch {
      toast.error("লিংক কপি করা সম্ভব হয়নি।");
    }
  };

  return (
    <>
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-border/70 md:pl-6">
        <Button
          onClick={() => setShowSerialModal(true)}
          size="lg"
          className="w-full bg-primary hover:bg-primary-dark text-white rounded-2xl h-12 text-sm font-bold shadow-md shadow-primary/20 gap-2 cursor-pointer"
        >
          <PhoneCall className="h-4 w-4 animate-pulse" />
          <span>সিরিয়াল নিতে কল দিন</span>
        </Button>

        <a
          href={getMapUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 h-11 rounded-2xl border border-border bg-background hover:bg-muted text-foreground text-xs sm:text-sm font-semibold transition-colors"
        >
          <Navigation className="h-4 w-4 text-primary" />
          <span>গুগল ম্যাপে দিকনির্দেশনা</span>
        </a>

        <Button
          variant="ghost"
          onClick={handleShare}
          className="w-full rounded-2xl h-10 text-xs font-semibold text-muted-foreground hover:text-foreground gap-2 cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>প্রোফাইল শেয়ার করুন</span>
        </Button>
      </div>

      {showSerialModal && (
        <DoctorSerialModal
          doctor={doctor}
          onClose={() => setShowSerialModal(false)}
        />
      )}
    </>
  );
}
