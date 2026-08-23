"use client";

import Link from "next/link";
import { formatNum, Locale } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Droplet, Siren, BookOpen } from "lucide-react";
import { AdminStatsData } from "./AdminStatsGrid";

interface AdminEcosystemGridProps {
  stats: AdminStatsData;
  locale: Locale;
}

export function AdminEcosystemGrid({ stats, locale }: AdminEcosystemGridProps) {
  const isBn = locale === "bn";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Doctors */}
      <Link href="/admin/doctors" className="block group">
        <Card className="border-border shadow-xs group-hover:border-blue-300 dark:group-hover:border-blue-800 transition-all bg-card h-full">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase">
                {isBn ? "বিশেষজ্ঞ ডাক্তার" : "Specialist Doctors"}
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {formatNum(stats.doctorsCount ?? 0, locale)}
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                {formatNum(stats.activeDoctorsCount ?? stats.doctorsCount ?? 0, locale)} {isBn ? "জন সক্রিয়" : "active"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Stethoscope className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Blood Donors */}
      <Link href="/admin/emergency" className="block group">
        <Card className="border-border shadow-xs group-hover:border-rose-300 dark:group-hover:border-rose-800 transition-all bg-card h-full">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase">
                {isBn ? "রক্তদাতা নেটওয়ার্ক" : "Blood Donors"}
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {formatNum(stats.emergencyDonorsCount ?? 0, locale)}
              </p>
              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                {(stats.pendingDonorsCount ?? 0) > 0
                  ? `${formatNum(stats.pendingDonorsCount ?? 0, locale)} ${isBn ? "পেন্ডিং" : "pending"}`
                  : isBn ? "সক্রিয় ডোনার" : "ready donors"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Droplet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Ambulances */}
      <Link href="/admin/emergency" className="block group">
        <Card className="border-border shadow-xs group-hover:border-amber-300 dark:group-hover:border-amber-800 transition-all bg-card h-full">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase">
                {isBn ? "অ্যাম্বুলেন্স বহর" : "Ambulance Fleet"}
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {formatNum(stats.ambulancesCount ?? 0, locale)}
              </p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                {isBn ? "জরুরি সার্ভিস" : "emergency fleet"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Siren className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Health Tips */}
      <Link href="/admin/health-tips" className="block group">
        <Card className="border-border shadow-xs group-hover:border-emerald-300 dark:group-hover:border-emerald-800 transition-all bg-card h-full">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase">
                {isBn ? "স্বাস্থ্য টিপস ও ব্লগ" : "Health Tips"}
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {formatNum(stats.healthTipsCount ?? 0, locale)}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {isBn ? "টি প্রকাশিত গাইড" : "guides published"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
