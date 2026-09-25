import Link from "next/link";
import { toBanglaNums } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Droplet, Siren, BookOpen } from "lucide-react";
import type { AdminStatsData } from "./AdminStatsGrid";

interface AdminEcosystemGridProps {
  stats: AdminStatsData;
}

export function AdminEcosystemGrid({ stats }: AdminEcosystemGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Doctors */}
      <Link href="/admin/doctors" className="block group">
        <Card className="border-border shadow-xs group-hover:border-blue-300 dark:group-hover:border-blue-800 transition-all bg-card h-full">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground font-semibold uppercase">
                বিশেষজ্ঞ ডাক্তার
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {toBanglaNums(stats.doctorsCount ?? 0)}
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                {toBanglaNums(stats.activeDoctorsCount ?? stats.doctorsCount ?? 0)} জন সক্রিয়
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
                রক্তদাতা নেটওয়ার্ক
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {toBanglaNums(stats.emergencyDonorsCount ?? 0)}
              </p>
              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                {(stats.pendingDonorsCount ?? 0) > 0
                  ? `${toBanglaNums(stats.pendingDonorsCount ?? 0)} পেন্ডিং`
                  : "সক্রিয় ডোনার"}
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
                অ্যাম্বুলেন্স বহর
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {toBanglaNums(stats.ambulancesCount ?? 0)}
              </p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                জরুরি সার্ভিস
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
                স্বাস্থ্য টিপস ও ব্লগ
              </p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">
                {toBanglaNums(stats.healthTipsCount ?? 0)}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                টি প্রকাশিত গাইড
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
