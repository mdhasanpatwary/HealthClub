import Link from "next/link";
import { Stethoscope, ArrowRight, Activity, ShieldCheck } from "lucide-react";
import { Doctor, Partner } from "@/services/db";
import { DOCTOR_DEPARTMENTS_SEO } from "@/data/doctorSeoData";

interface HospitalSpecialtyCrossLinksProps {
  partner: Partner;
  doctors: Doctor[];
}

export default function HospitalSpecialtyCrossLinks({
  partner,
  doctors,
}: HospitalSpecialtyCrossLinksProps) {
  // Extract unique departments present in this hospital's doctor roster
  const hospitalDeptSet = new Set(doctors.map((d) => (d.department || "").toLowerCase()));

  // Map to known department SEO configurations
  const activeDepartments = Object.values(DOCTOR_DEPARTMENTS_SEO).filter((dept) =>
    hospitalDeptSet.has(dept.slug.toLowerCase())
  );

  // Other popular departments in Feni for comprehensive internal linking
  const otherDepartments = Object.values(DOCTOR_DEPARTMENTS_SEO)
    .filter((dept) => !hospitalDeptSet.has(dept.slug.toLowerCase()))
    .slice(0, 6);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-secondary dark:text-white font-heading flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" />
            <span>বিশেষজ্ঞ ডাক্তার বিভাগ ও কনসালটেন্ট ডিরেক্টরি</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {partner.name}-এর বিশেষজ্ঞ সেবা ও ফেনীর সকল বিশেষজ্ঞ ডাক্তারদের তালিকা
          </p>
        </div>
        <Link
          href="/consultants"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>ফেনীর সকল ডাক্তার</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Active Departments in This Hospital */}
      {activeDepartments.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span>এই প্রতিষ্ঠানে কর্মরত বিশেষজ্ঞ বিভাগসমূহ</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeDepartments.map((dept) => (
              <Link
                key={dept.slug}
                href={`/consultants/department/${dept.slug}`}
                className="p-3 rounded-2xl bg-muted/40 hover:bg-primary/10 border border-border/80 hover:border-primary/40 transition-all duration-200 group flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {dept.nameBn}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    ফেনীর সেরা {dept.nameBn} তালিকা ও শিডিউল
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform duration-200 group-hover:translate-x-1 shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Other Major Specialty Guides in Feni */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          ফেনীর অন্যান্য বিশেষজ্ঞ ডাক্তার তালিকা
        </h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {otherDepartments.map((dept) => (
            <Link
              key={dept.slug}
              href={`/consultants/department/${dept.slug}`}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-card hover:bg-muted border border-border/80 hover:border-primary/40 text-foreground transition-all"
            >
              <span>{dept.nameBn}</span>
            </Link>
          ))}
          <Link
            href="/consultants"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <span>সকল চেম্বার →</span>
          </Link>
        </div>
      </div>

      {/* Health Club Member Prescription Benefit Notice */}
      <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-2.5 text-xs">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-muted-foreground">
          <span className="font-bold text-foreground">মেম্বার পরামর্শ ও ডিসকাউন্ট:</span>
          <p className="text-[11px] leading-relaxed">
            {partner.name}-এ ডাক্তার দেখানোর পর হেলথ ক্লাব ডিজিটাল কার্ড প্রদর্শন করে প্রেসক্রিপশন ডায়াগনস্টিক টেস্টে ১০-৩০% নিশ্চিত ছাড় উপভোগ করুন।
          </p>
        </div>
      </div>
    </div>
  );
}
