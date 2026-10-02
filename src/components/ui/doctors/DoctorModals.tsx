"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone, PhoneCall, Calendar, Building2, X, Sparkles, ArrowRight
} from "lucide-react";
import { Doctor } from "@/services/db";
import { Button } from "@/components/ui/button";
import { DoctorAvailabilityBadge, DoctorNoticeBanner } from "./DoctorAvailabilityBadge";
import { trackEvent } from "@/lib/analytics";
import { getDoctorByIdAction } from "@/app/actions/doctorQueryActions";

import { DoctorAvatar } from "./DoctorAvatar";
export { DoctorAvatar };

interface DoctorSerialModalProps {
  doctor: Doctor;
  onClose: () => void;
}

export function DoctorSerialModal({ doctor, onClose }: DoctorSerialModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const parsePhones = (phoneStr: string) => {
    return phoneStr
      .split(/[,/|]+/)
      .map((p) => p.trim())
      .filter(Boolean);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="serial-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pr-6">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <PhoneCall className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 id="serial-modal-title" className="font-heading font-bold text-base text-foreground">
              চেম্বার সিরিয়াল ও সরাসরি যোগাযোগ
            </h4>
            <p className="text-xs text-primary font-semibold">
              {doctor.name}
            </p>
            <div className="pt-0.5">
              <DoctorAvailabilityBadge doctor={doctor} size="sm" />
            </div>
          </div>
        </div>

        {doctor.notice && (
          <DoctorNoticeBanner notice={doctor.notice} />
        )}

        <div className="bg-muted/40 p-3.5 rounded-2xl space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Building2 className="h-4 w-4 text-primary shrink-0" />
            <span>{doctor.chamberName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>
              {doctor.visitingDays} ({doctor.visitingHours})
            </span>
          </div>
          {doctor.consultationFee && (
            <div className="text-primary font-bold">
              পরামর্শ ফি: {doctor.consultationFee}
            </div>
          )}
        </div>

        {/* In-Funnel Member Savings Smart Prompt (Presented BEFORE Dialing) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-primary/5 to-teal-500/10 p-3.5 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  মেম্বারশিপ সুবিধা
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  ১০০% ফ্রি কার্ড
                </span>
              </div>
              <h5 className="font-heading font-bold text-xs sm:text-sm text-foreground leading-snug">
                ডাক্তারের টেস্টে ১০-৩০% মেম্বার ছাড় চান?
              </h5>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                ডাক্তার দেখানোর পর প্রেসক্রিপশনের টেস্টে ফেনী সদরের পার্টনার হাসপাতালে <strong className="text-foreground font-semibold">১০-৩০% নিশ্চিত ছাড়</strong> পেতে এখনই ফ্রি ডিজিটাল কার্ড সাথে রাখুন।
              </p>
            </div>
          </div>

          <Link
            href="/membership"
            onClick={() => {
              trackEvent("membership_funnel", {
                step: "serial_cta_click",
                source: `doctor_serial_modal_${doctor.id}`,
              });
              onClose();
            }}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-md shadow-primary/20 hover:shadow-primary/30"
          >
            <span>১ মিনিটে ফ্রি মেম্বার কার্ড নিন</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Direct Chamber Dialing Hotlines */}
        <div className="space-y-2.5">
          <p className="text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>সরাসরি চেম্বার বা রিসিপশনে কল করে সিরিয়াল নিন:</span>
            <span className="text-[10px] text-primary font-semibold">হটলাইন কল</span>
          </p>
          {parsePhones(doctor.serialPhone).map((phone, idx) => (
            <a
              key={idx}
              href={`tel:${phone.replace(/\s+/g, "")}`}
              onClick={() => {
                trackEvent("doctor_serial_click", {
                  doctor_id: doctor.id,
                  doctor_name: doctor.name,
                  specialty: doctor.specialty,
                  hospital: doctor.chamberName,
                  phone: phone.trim(),
                });
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-heading font-bold text-sm sm:text-base text-foreground tracking-wide font-mono">
                  {phone}
                </span>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                কল দিন
              </span>
            </a>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full rounded-2xl cursor-pointer"
          onClick={onClose}
        >
          বন্ধ করুন
        </Button>
      </div>
    </div>
  );
}

interface DoctorDetailsModalProps {
  doctor: Doctor;
  onClose: () => void;
  onCallSerial: (doctor: Doctor) => void;
}

export function DoctorDetailsModal({ doctor: initialDoctor, onClose, onCallSerial }: DoctorDetailsModalProps) {
  const [doctor, setDoctor] = useState<Doctor>(initialDoctor);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;
    if (!initialDoctor.degrees) {
      getDoctorByIdAction(initialDoctor.slug || initialDoctor.id)
        .then((fullDoc) => {
          if (isMounted && fullDoc) {
            setDoctor(fullDoc);
          }
        })
        .catch(() => {
          // Gracefully maintain initialDoctor
        });
    }
    return () => {
      isMounted = false;
    };
  }, [initialDoctor]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="details-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 my-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Profile Info */}
        <div className="flex items-start gap-4 pr-6">
          <DoctorAvatar
            src={doctor.imageUrl}
            alt={doctor.name}
            className="h-20 w-20"
          />
          <div className="space-y-1 min-w-0 flex-1">
            <h3 id="details-modal-title" className="font-heading font-bold text-base sm:text-lg text-foreground">
              {doctor.name}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-primary">
              {doctor.specialty}
            </p>
            {doctor.degrees ? (
              <p className="text-xs text-muted-foreground font-mono">
                {doctor.degrees}
              </p>
            ) : null}
            <div className="pt-1">
              <DoctorAvailabilityBadge doctor={doctor} size="sm" />
            </div>
          </div>
        </div>

        {doctor.notice && (
          <DoctorNoticeBanner notice={doctor.notice} />
        )}

        {/* Workplace / Designation */}
        <div className="space-y-1 bg-muted/40 p-3.5 rounded-2xl text-xs">
          <p className="text-muted-foreground font-semibold">
            বর্তমান পদবী ও কর্মস্থল
          </p>
          <p className="font-medium text-foreground leading-relaxed">
            {doctor.designation}
          </p>
        </div>

        {/* Chamber & Schedule */}
        <div className="space-y-3 bg-muted/20 border border-border/70 p-4 rounded-2xl text-xs">
          <div>
            <p className="text-muted-foreground font-semibold">
              চেম্বার ও ঠিকানা
            </p>
            <p className="font-bold text-sm text-foreground">
              {doctor.chamberName}
            </p>
            <p className="text-muted-foreground mt-0.5">
              {doctor.chamberAddress}
            </p>
            {doctor.roomNo && (
              <p className="text-primary font-semibold mt-1">
                {doctor.roomNo}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
            <div>
              <p className="text-muted-foreground font-medium">
                রোগী দেখার দিন
              </p>
              <p className="font-bold text-foreground">
                {doctor.visitingDays}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">
                সময়সূচী
              </p>
              <p className="font-bold text-foreground">
                {doctor.visitingHours}
              </p>
            </div>
          </div>

          {doctor.consultationFee && (
            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground font-medium">
                পরামর্শ ফি:
              </span>
              <span className="font-bold text-primary text-sm">
                {doctor.consultationFee}
              </span>
            </div>
          )}
        </div>

        {/* Serial action & Full Profile */}
        <div className="space-y-2 pt-1">
          <Button
            onClick={() => onCallSerial(doctor)}
            className="w-full bg-primary hover:bg-primary-dark text-white rounded-2xl h-11 font-semibold cursor-pointer shadow-xs"
          >
            <PhoneCall className="h-4 w-4 mr-2" />
            সিরিয়াল নিন
          </Button>

          <Link
            href={`/consultants/${encodeURIComponent(doctor.slug || doctor.id)}`}
            className="inline-flex items-center justify-center w-full h-10 rounded-2xl border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-foreground transition-colors"
          >
            সম্পূর্ণ প্রোফাইল দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
}
