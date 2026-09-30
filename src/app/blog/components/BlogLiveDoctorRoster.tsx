import Link from "next/link";
import {
  Stethoscope,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Doctor } from "@/services/db";
import { Badge } from "@/components/ui/badge";
import { toBanglaNums } from "@/lib/utils";
import { DEPT_LABEL_MAP } from "@/components/consultants/consultantData";

interface BlogLiveDoctorRosterProps {
  doctors: Doctor[];
  department?: string;
  departmentNameBn?: string;
  titleBn?: string;
  subtitleBn?: string;
  limit?: number;
}

/**
 * Dynamic Live Doctor Roster component embedded in blog articles.
 * Fetches verified, active doctors from the live database for that department,
 * ensuring real-time chamber schedules, verified serials, and high-converting internal links.
 */
export function BlogLiveDoctorRoster({
  doctors,
  department = "medicine",
  departmentNameBn,
  titleBn,
  subtitleBn,
  limit = 6,
}: BlogLiveDoctorRosterProps) {
  if (!doctors || doctors.length === 0) {
    return null;
  }

  const deptLabel =
    departmentNameBn || DEPT_LABEL_MAP[department] || "বিশেষজ্ঞ ডাক্তার";

  // Deduplicate doctors by normalized name to guarantee no duplicate doctor cards
  const uniqueDoctors: Doctor[] = [];
  const seenDoctorKeys = new Set<string>();

  for (const doc of doctors) {
    const cleanKey = (doc.name || "")
      .replace(/^(ডাঃ|ডা\.|ডাক্তার|সহকারী অধ্যাপক ডা\.|সহকারী অধ্যাপক ডাঃ|অধ্যাপক ডা\.|অধ্যাপক ডাঃ)\s*/i, "")
      .replace(/\s+/g, "")
      .toLowerCase();

    if (!cleanKey || !seenDoctorKeys.has(cleanKey)) {
      if (cleanKey) seenDoctorKeys.add(cleanKey);
      uniqueDoctors.push(doc);
    }
  }

  const displayDoctors = uniqueDoctors.slice(0, limit);
  const remainingCount = uniqueDoctors.length - displayDoctors.length;
  const targetDepartmentUrl =
    department && department !== "all"
      ? `/consultants/department/${department}`
      : "/consultants";

  return (
    <section id="live-doctor-roster" className="scroll-mt-24 space-y-6">
      {/* Header with Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/80 pb-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>লাইভ ডিরেক্টরি থেকে সরাসরি হালনাগাদকৃত</span>
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {titleBn || `ফেনীর শীর্ষ সক্রিয় ও যাচাইকৃত ${deptLabel} বিশেষজ্ঞ`}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {subtitleBn ||
              `ডাটাবেজ থেকে সরাসরি নিয়মিত প্র্যাকটিসরত ${deptLabel} চিকিৎসকদের চেম্বার শিডিউল ও সিরিয়াল হটলাইন।`}
          </p>
        </div>

        <Link
          href={targetDepartmentUrl}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0 self-start sm:self-auto"
        >
          <span>সকল {deptLabel} ডাক্তার ({toBanglaNums(uniqueDoctors.length)} জন)</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        {displayDoctors.map((doctor, index) => {
          const primaryPhone = doctor.serialPhone
            ? doctor.serialPhone.split(/[,/|]+/)[0].trim()
            : "";
          const cleanPhone = primaryPhone.replace(/[^0-9]/g, "");
          const profileSlug = encodeURIComponent(doctor.slug || doctor.id);

          return (
            <div
              key={doctor.id}
              className="rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-all group"
            >
              <div className="space-y-3">
                {/* Header row: Specialty & Rank / Verification badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="text-[11px] font-semibold bg-primary/10 text-primary border-primary/20 cursor-default"
                    >
                      <Stethoscope className="h-3 w-3 mr-1" />
                      {doctor.specialty}
                    </Badge>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      #{toBanglaNums(index + 1)}
                    </span>
                  </div>

                  {doctor.isActive && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>ভেরিফাইড</span>
                    </span>
                  )}
                </div>

                {/* Doctor Name & Designation */}
                <div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    <Link href={`/consultants/${profileSlug}`} className="hover:underline">
                      {doctor.name}
                    </Link>
                  </h3>
                  {doctor.designation && (
                    <p className="text-xs text-primary font-medium mt-0.5">
                      {doctor.designation}
                    </p>
                  )}
                  {doctor.degrees && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {doctor.degrees}
                    </p>
                  )}
                </div>

                {/* Chamber Information Card */}
                <div className="rounded-2xl bg-muted/40 p-3 space-y-2 text-xs border border-border/50">
                  <div className="flex items-start gap-2 text-foreground/90">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="font-semibold block truncate">
                        {doctor.chamberName}
                      </span>
                      {doctor.chamberAddress && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                          {doctor.chamberAddress}
                        </p>
                      )}
                    </div>
                  </div>

                  {doctor.visitingDays && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-[11px] truncate">{doctor.visitingDays}</span>
                    </div>
                  )}

                  {doctor.visitingHours && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-[11px] truncate">{doctor.visitingHours}</span>
                    </div>
                  )}

                  {doctor.consultationFee && (
                    <div className="pt-1.5 flex items-center justify-between border-t border-border/50 text-[11px]">
                      <span className="text-muted-foreground">ভিজিট ফি:</span>
                      <span className="font-bold text-primary font-mono">
                        {toBanglaNums(doctor.consultationFee)}
                      </span>
                    </div>
                  )}

                  {/* Partner Member Discount Callout strictly adhering to 10-30% rule */}
                  {Boolean(doctor.partnerId) && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>হেলথ ক্লাব কার্ডধারীদের জন্য হাসপাতালে ১০-৩০% বিশেষ ছাড়</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Direct Call & Profile Link */}
              <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-border/60">
                {cleanPhone ? (
                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>সিরিয়াল কল</span>
                  </a>
                ) : (
                  <Link
                    href={`/consultants/${profileSlug}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors"
                  >
                    <span>সিরিয়াল দেখুন</span>
                  </Link>
                )}

                <Link
                  href={`/consultants/${profileSlug}`}
                  className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-border bg-muted/50 hover:bg-muted text-foreground text-xs font-semibold transition-colors"
                >
                  <span>প্রোফাইল</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Conversion CTA */}
      <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-foreground">
              {deptLabel} বিভাগে আরও {toBanglaNums(remainingCount > 0 ? remainingCount : uniqueDoctors.length)} জন ভেরিফাইড চিকিৎসক রয়েছেন
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              চেম্বার লোকেশন, প্রেসক্রিপশন প্রস্তুতি ও সিরিয়াল নম্বর দেখতে ডিরেক্টরি ব্রাউজ করুন।
            </p>
          </div>
        </div>

        <Link
          href={targetDepartmentUrl}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0 w-full sm:w-auto"
        >
          <span>সকল {deptLabel} ডাক্তার দেখুন</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default BlogLiveDoctorRoster;
