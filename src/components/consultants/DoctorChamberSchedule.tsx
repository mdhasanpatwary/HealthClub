import {
  Calendar, Clock, MapPin, Building2, Phone,
  Clock3, CreditCard
} from "lucide-react";
import { Doctor, Partner } from "@/services/db";
import { Card } from "@/components/ui/card";
import { DoctorAvailabilityBadge } from "@/components/ui/doctors/DoctorAvailabilityBadge";

interface DoctorChamberScheduleProps {
  doctor: Doctor & { partner?: Partner | null };
}

/**
 * Chamber Schedule, Address, Visiting Timings & Serial Hotlines.
 */
export function DoctorChamberSchedule({ doctor }: DoctorChamberScheduleProps) {
  const phoneNumbers = doctor.serialPhone
    .split(/[,/|]+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Card className="rounded-3xl border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-foreground">
              চেম্বার ও রোগী দেখার সময়সূচী
            </h2>
            <p className="text-xs text-muted-foreground">
              {doctor.chamberName}
            </p>
          </div>
        </div>
        <DoctorAvailabilityBadge doctor={doctor} size="sm" />
      </div>

      {/* Chamber Details & Address */}
      <div className="space-y-4">
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1 min-w-0">
              <h3 className="font-heading font-bold text-sm sm:text-base text-foreground">
                {doctor.chamberName}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span>{doctor.chamberAddress}</span>
              </p>
              {doctor.roomNo && (
                <p className="text-xs font-semibold text-primary inline-flex items-center gap-1 mt-1 bg-primary/10 px-2.5 py-0.5 rounded-lg">
                  <span>রুম নং:</span>
                  <span>{doctor.roomNo}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Timing & Visiting Schedule Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              <Clock3 className="h-4 w-4 shrink-0" />
              <span>রোগী দেখার দিন</span>
            </div>
            <p className="font-heading font-bold text-sm sm:text-base text-foreground pt-1">
              {doctor.visitingDays}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Clock className="h-4 w-4 shrink-0" />
              <span>সময়সূচী</span>
            </div>
            <p className="font-heading font-bold text-sm sm:text-base text-foreground pt-1">
              {doctor.visitingHours}
            </p>
          </div>
        </div>

        {/* Consultation Fee */}
        {doctor.consultationFee && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2.5 text-xs font-bold text-amber-800 dark:text-amber-300">
              <CreditCard className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>পরামর্শ ফি</span>
            </div>
            <span className="font-heading font-bold text-sm sm:text-base text-amber-700 dark:text-amber-300">
              {doctor.consultationFee}
            </span>
          </div>
        )}
      </div>

      {/* Direct Serial Helpline List */}
      <div className="space-y-3 pt-2">
        <h3 className="font-heading font-bold text-xs sm:text-sm text-foreground uppercase tracking-wider text-muted-foreground">
          চেম্বার সিরিয়াল ও বুকিং নাম্বার
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {phoneNumbers.map((phone, idx) => (
            <a
              key={idx}
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-heading font-bold text-sm text-foreground font-mono">
                  {phone}
                </span>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                কল দিন
              </span>
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}
