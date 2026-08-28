"use client";

import { BloodDonor } from "@/data/emergencyData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PhoneCall, MessageCircle, MapPin, Clock, Droplet } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface BloodDonorCardProps {
  donor: BloodDonor;
  areaLabel: string;
  isEn: boolean;
}

export function BloodDonorCard({ donor, areaLabel, isEn }: BloodDonorCardProps) {
  const cleanPhone = donor.phone.replace(/[^0-9]/g, "");

  return (
    <Card className="border border-border/80 bg-background hover:border-rose-500/30 transition-all duration-300 shadow-xs flex flex-col justify-between h-full">
      <CardContent className="p-4 space-y-3 flex flex-col justify-between h-full">
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5 min-w-0">
              <h4 className="font-heading font-bold text-sm text-secondary dark:text-white truncate">
                {donor.name}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="truncate">{areaLabel}</span>
              </p>
            </div>
            <Badge className="bg-rose-600/10 text-rose-600 dark:text-rose-400 border-rose-600/20 font-mono font-black text-sm px-2.5 py-0.5 shrink-0 flex items-center gap-1">
              <Droplet className="h-3 w-3 fill-rose-600/30" />
              <span>{donor.bloodGroup}</span>
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
            <Clock className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {isEn ? "Last Donated:" : "সর্বশেষ দান:"} {donor.lastDonated}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <a
            href={`tel:${donor.phone}`}
            onClick={() => {
              trackEvent("emergency_dial", {
                service_type: "blood_donor",
                target_name: `${donor.name} (${donor.bloodGroup})`,
                phone: donor.phone,
                upazila: donor.upazila,
              });
            }}
            className="inline-flex items-center justify-center gap-1.5 h-8.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
            aria-label={isEn ? `Call blood donor ${donor.name}` : `রক্তদাতা ${donor.name}-কে কল করুন`}
          >
            <PhoneCall className="h-3.5 w-3.5 shrink-0" />
            <span>{isEn ? "Call" : "কল করুন"}</span>
          </a>
          <a
            href={`https://wa.me/88${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-8.5 px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors"
            aria-label={isEn ? `WhatsApp message blood donor ${donor.name}` : `রক্তদাতা ${donor.name}-কে হোয়াটসঅ্যাপে বার্তা পাঠান`}
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
