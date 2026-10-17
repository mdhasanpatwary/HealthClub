import Link from "next/link";
import { Building2, ArrowRight, ShieldCheck, Tag, Stethoscope, MapPin } from "lucide-react";
import { FENI_HOSPITALS_DIRECTORY, FeniHospitalDirectoryItem } from "@/data/feniHospitalsData";
import { cn } from "@/lib/utils";

interface HospitalDoctorQuickLinksProps {
  variant?: "grid" | "landing" | "compact";
  className?: string;
  showHeading?: boolean;
  limit?: number;
}

export default function HospitalDoctorQuickLinks({
  variant = "grid",
  className,
  showHeading = true,
  limit,
}: HospitalDoctorQuickLinksProps) {
  const displayedHospitals = limit
    ? FENI_HOSPITALS_DIRECTORY.slice(0, limit)
    : FENI_HOSPITALS_DIRECTORY;

  if (variant === "landing") {
    return (
      <div className={cn("space-y-4", className)}>
        {showHeading && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-secondary dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span>হাসপাতাল ও চেম্বার অনুযায়ী ডাক্তার তালিকা</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                ফেনীর শীর্ষ হাসপাতাল ও ক্লিনিকের বিশেষজ্ঞ ডাক্তারদের তালিকা ও চেম্বার শিডিউল
              </p>
            </div>
            <Link
              href="/consultants"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>সকল ডাক্তার দেখুন</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {displayedHospitals.slice(0, 8).map((hospital: FeniHospitalDirectoryItem) => {
            const href = hospital.partnerSlug
              ? `/partner-hospitals/${hospital.partnerSlug}`
              : `/consultants?chamber=${hospital.id}`;

            return (
              <Link
                key={hospital.id}
                href={href}
                className={cn(
                  "p-3 rounded-2xl border transition-all duration-200 group flex flex-col justify-between gap-2 shadow-2xs hover:shadow-xs",
                  hospital.isPartner
                    ? "bg-card hover:bg-primary/5 border-primary/30 hover:border-primary/50"
                    : "bg-card hover:bg-muted border-border/80 hover:border-primary/30"
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {hospital.categoryBn}
                    </span>
                    {hospital.isPartner && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary/15 text-primary flex items-center gap-0.5 shrink-0">
                        <Tag className="h-2.5 w-2.5" />
                        <span>মেম্বার ছাড়</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {hospital.nameBn}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {hospital.addressBn}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-primary">
                  <span>ডাক্তার তালিকা</span>
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2.5", className)}>
        {showHeading && (
          <div className="flex items-center gap-1.5 px-1">
            <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              হাসপাতাল অনুযায়ী দ্রুত ডাক্তার খুঁজুন
            </h3>
          </div>
        )}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none sm:flex-wrap">
          {displayedHospitals.map((hospital) => {
            const href = hospital.partnerSlug
              ? `/partner-hospitals/${hospital.partnerSlug}`
              : `/consultants?chamber=${hospital.id}`;

            return (
              <Link
                key={hospital.id}
                href={href}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap shrink-0 border",
                  hospital.isPartner
                    ? "bg-card hover:bg-primary/10 text-foreground border-primary/30 hover:border-primary/50"
                    : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/80"
                )}
              >
                <span>{hospital.shortNameBn}</span>
                {hospital.isPartner && (
                  <span className="text-[9px] px-1 py-0.2 rounded-md bg-primary/20 text-primary font-bold">
                    ১০-৩০% ছাড়
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Full Grid Variant
  return (
    <section
      aria-labelledby="hospital-doctors-hub-heading"
      className={cn("space-y-6 pt-4 sm:pt-6", className)}
    >
      {showHeading && (
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-emerald-800 dark:text-emerald-300 border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5" />
            <span>হাসপাতাল অনুযায়ী ডাক্তার ডিরেক্টরি</span>
          </div>
          <h2
            id="hospital-doctors-hub-heading"
            className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-secondary dark:text-white font-heading tracking-tight"
          >
            ফেনীর হাসপাতাল ও ক্লিনিক অনুযায়ী ডাক্তার তালিকা
          </h2>
          {/* Direct Answer Capsule (BLUF - Answer Engine Optimization) */}
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            ফেনী সদর উপজেলার ইউনাইটেড মেডিকেল সেন্টার, কনসেপ্ট প্লাস, ফেনী ক্লিনিক, ডিডি ল্যাব, লাইফ কেয়ার, ফেনী কেয়ার এবং আল-আকসা হাসপাতাল সহ প্রধান প্রধান স্বাস্থ্য প্রতিষ্ঠানে রোগী দেখার চেম্বার শিডিউল ও বিশেষজ্ঞ চিকিৎসকদের বিস্তারিত তথ্য।
          </p>
        </div>
      )}

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {displayedHospitals.map((hospital) => {
          const href = hospital.partnerSlug
            ? `/partner-hospitals/${hospital.partnerSlug}`
            : `/consultants?chamber=${hospital.id}`;

          return (
            <article
              key={hospital.id}
              className={cn(
                "p-4 sm:p-5 rounded-2xl border transition-all duration-300 group flex flex-col justify-between gap-3 shadow-xs hover:shadow-md hover:-translate-y-0.5",
                hospital.isPartner
                  ? "bg-card border-primary/30 hover:border-primary/60"
                  : "bg-card border-border/80 hover:border-primary/40"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-primary" />
                    <span>{hospital.categoryBn}</span>
                  </span>
                  {hospital.isPartner ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/25">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{hospital.memberDiscountBn || "১০-৩০% মেম্বার ছাড়"}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      ফেনী সদর
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-heading text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {hospital.nameBn}
                  </h3>
                  <p className="text-[11px] text-muted-foreground/80 font-mono mt-0.5">
                    {hospital.nameEn}
                  </p>
                </div>

                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="line-clamp-2 text-[11px] sm:text-xs">{hospital.addressBn}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/50">
                <Link
                  href={href}
                  className="w-full inline-flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <span className="flex items-center gap-1.5">
                    <Stethoscope className="h-3.5 w-3.5" />
                    <span>{hospital.isPartner ? "হাসপাতাল ও ডাক্তার শিডিউল" : "ডাক্তার তালিকা দেখুন"}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
