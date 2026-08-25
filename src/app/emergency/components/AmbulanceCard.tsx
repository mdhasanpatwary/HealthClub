"use client";

import { AmbulanceService, AmbulanceType } from "@/data/emergencyData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  PhoneCall,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Activity,
  Snowflake,
  Truck,
  Wind,
} from "lucide-react";

interface AmbulanceCardProps {
  ambulance: AmbulanceService;
  isEn: boolean;
}

export function getAmbulanceTypeMeta(type: AmbulanceType, isEn: boolean) {
  switch (type) {
    case "ICU":
      return {
        label: isEn ? "ICU Life Support" : "আইসিইউ সাপোর্ট",
        badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
        icon: Activity,
      };
    case "AC":
      return {
        label: isEn ? "AC Ambulance" : "এসি অ্যাম্বুলেন্স",
        badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        icon: Wind,
      };
    case "Non-AC":
      return {
        label: isEn ? "Non-AC Ambulance" : "নন-এসি অ্যাম্বুলেন্স",
        badgeClass: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30",
        icon: Truck,
      };
    case "Freezer":
      return {
        label: isEn ? "Freezing Carrier" : "ফ্রিজিং ক্যারিয়ার",
        badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
        icon: Snowflake,
      };
    default:
      return {
        label: `${type} ${isEn ? "Ambulance" : "অ্যাম্বুলেন্স"}`,
        badgeClass: "bg-muted text-muted-foreground border-border",
        icon: Truck,
      };
  }
}

export function AmbulanceCard({ ambulance, isEn }: AmbulanceCardProps) {
  const typeMeta = getAmbulanceTypeMeta(ambulance.type, isEn);
  const TypeIcon = typeMeta.icon;
  const cleanPhone = ambulance.phone.replace(/[^0-9]/g, "");

  return (
    <Card className="border border-border/80 bg-background hover:border-primary/40 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between h-full">
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2.5">
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-base text-secondary dark:text-white leading-snug">
                {ambulance.name}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span>{ambulance.location}</span>
              </p>
            </div>
            <Badge
              variant="outline"
              className={`text-[11px] font-bold shrink-0 px-2.5 py-0.5 flex items-center gap-1.5 ${typeMeta.badgeClass}`}
            >
              <TypeIcon className="h-3.5 w-3.5" />
              <span>{typeMeta.label}</span>
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10 w-fit">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>{ambulance.availableHours || (isEn ? "24/7 Service" : "২৪/৭ সার্বক্ষণিক")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-border/40">
          <a
            href={`tel:${ambulance.phone}`}
            className="sm:col-span-3 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.98]"
          >
            <PhoneCall className="h-4 w-4" />
            <span className="truncate">
              {isEn ? "Call:" : "কল দিন:"} {ambulance.phone}
            </span>
          </a>
          <a
            href={`https://wa.me/88${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all active:scale-[0.98]"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
