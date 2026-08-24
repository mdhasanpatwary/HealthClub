"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone, PhoneCall, Calendar, Building2,
  Stethoscope, X
} from "lucide-react";
import { Doctor } from "@/services/db";
import { Button } from "@/components/ui/button";

export function DoctorAvatar({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative shrink-0 rounded-2xl overflow-hidden bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center ${className}`}>
      {!hasError && src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 80px, 100px"
          unoptimized
          className="object-cover object-top"
          onError={() => setHasError(true)}
        />
      ) : (
        <Stethoscope className="h-1/2 w-1/2 text-primary/60" />
      )}
    </div>
  );
}

interface DoctorSerialModalProps {
  doctor: Doctor;
  onClose: () => void;
  t: (key: string) => string;
  locale: string;
}

export function DoctorSerialModal({ doctor, onClose, t, locale }: DoctorSerialModalProps) {
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
          <div>
            <h4 id="serial-modal-title" className="font-heading font-bold text-base text-foreground">
              {t("consultants.modal.serialModalTitle")}
            </h4>
            <p className="text-xs text-primary font-semibold">
              {doctor.name}
            </p>
          </div>
        </div>

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
              {t("consultants.card.fee")}: {doctor.consultationFee}
            </div>
          )}
        </div>

        <div className="space-y-2.5">
          <p className="text-xs text-muted-foreground font-medium">
            {t("consultants.modal.serialModalDesc")}
          </p>
          {parsePhones(doctor.serialPhone).map((phone, idx) => (
            <a
              key={idx}
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-heading font-bold text-sm sm:text-base text-foreground tracking-wide font-mono">
                  {phone}
                </span>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                {locale === "en" ? "Call Now" : "কল দিন"}
              </span>
            </a>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full rounded-2xl cursor-pointer"
          onClick={onClose}
        >
          {t("consultants.modal.close")}
        </Button>
      </div>
    </div>
  );
}

interface DoctorDetailsModalProps {
  doctor: Doctor;
  onClose: () => void;
  onCallSerial: (doctor: Doctor) => void;
  t: (key: string) => string;
}

export function DoctorDetailsModal({ doctor, onClose, onCallSerial, t }: DoctorDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
          <div className="space-y-1">
            <h3 id="details-modal-title" className="font-heading font-bold text-base sm:text-lg text-foreground">
              {doctor.name}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-primary">
              {doctor.specialty}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {doctor.degrees}
            </p>
          </div>
        </div>

        {/* Workplace / Designation */}
        <div className="space-y-1 bg-muted/40 p-3.5 rounded-2xl text-xs">
          <p className="text-muted-foreground font-semibold">
            {t("consultants.modal.designation")}
          </p>
          <p className="font-medium text-foreground leading-relaxed">
            {doctor.designation}
          </p>
        </div>

        {/* Chamber & Schedule */}
        <div className="space-y-3 bg-muted/20 border border-border/70 p-4 rounded-2xl text-xs">
          <div>
            <p className="text-muted-foreground font-semibold">
              {t("consultants.card.chamber")}
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
                {t("consultants.card.visitingDays")}
              </p>
              <p className="font-bold text-foreground">
                {doctor.visitingDays}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">
                {t("consultants.card.visitingHours")}
              </p>
              <p className="font-bold text-foreground">
                {doctor.visitingHours}
              </p>
            </div>
          </div>

          {doctor.consultationFee && (
            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground font-medium">
                {t("consultants.card.fee")}:
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
            {t("consultants.card.callSerial")}
          </Button>

          <Link
            href={`/consultants/${doctor.id}`}
            className="inline-flex items-center justify-center w-full h-10 rounded-2xl border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-foreground transition-colors"
          >
            {t("consultants.profile.viewAllDoctors") ? "পূর্ণাঙ্গ প্রোফাইল ও ম্যাপ দেখুন" : "View Full Profile & Map"}
          </Link>
        </div>
      </div>
    </div>
  );
}
