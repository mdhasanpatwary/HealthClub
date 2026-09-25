"use client";

import { useState } from "react";
import Link from "next/link";
import { DoctorSpecialtyGroup, DoctorSpecialistItem } from "@/types/blog";
import {
  Stethoscope,
  HeartPulse,
  Activity,
  UserCheck,
  Baby,
  Bone,
  Phone,
  MapPin,
  Clock,
  Calendar,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Ear,
  Brain,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogReviewCardWrapper } from "./BlogReviewCardWrapper";

interface DoctorSpecialtySectionProps {
  doctorGroups: DoctorSpecialtyGroup[];
}

const DEPARTMENT_ICONS: Record<string, React.ElementType> = {
  medicine: Stethoscope,
  cardiology: HeartPulse,
  surgery: Activity,
  gynecology: UserCheck,
  "high-risk-pregnancy": Baby,
  "infertility-laparoscopy": Sparkles,
  "maternal-fetal-care": UserCheck,
  "clinical-cardiology": HeartPulse,
  "hypertension-vascular": Activity,
  "echo-preventive": Sparkles,
  pediatrics: Baby,
  "general-pediatrics": Baby,
  "neonatology-nicu": ShieldCheck,
  "pediatric-subspecialties": Sparkles,
  orthopedics: Bone,
  "trauma-fracture": Bone,
  "spine-arthroscopy": Activity,
  "arthritis-joint-care": Sparkles,
  dermatology: Sparkles,
  "general-dermatology": Sparkles,
  "dermatosurgery-cosmetology": ShieldCheck,
  "vd-sexology": Activity,
  "skin-allergy": Sparkles,
  ophthalmology: Eye,
  "cataract-phaco": Eye,
  "glaucoma-retina": ShieldCheck,
  "pediatric-cornea": Sparkles,
  ent: Ear,
  "ear-hearing": Ear,
  "nose-sinus": Activity,
  "throat-head-neck": ShieldCheck,
  "general-laparoscopy": Activity,
  "colorectal-proctology": ShieldCheck,
  "pediatric-breast-urology": Sparkles,
  neurology: Brain,
  "stroke-paralysis": Activity,
  "headache-epilepsy": Sparkles,
  "neuropathy-neuro-rehab": ShieldCheck,
  diabetes: Activity,
  "endocrinology-diabetes": Activity,
  "thyroid-gestational": Sparkles,
  "diabetic-complications-diet": ShieldCheck,
  psychiatry: Brain,
  "general-psychiatry": Brain,
  "child-adolescent-psychiatry": Sparkles,
  "addiction-counseling-psychiatry": ShieldCheck,
};

export function DoctorSpecialtySection({
  doctorGroups,
}: DoctorSpecialtySectionProps) {
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const filteredGroups =
    selectedDept === "all"
      ? doctorGroups
      : doctorGroups.filter((group) => group.department === selectedDept);

  return (
    <section id="specialist-doctors" className="scroll-mt-24 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1.5">
          <Sparkles className="h-4 w-4" />
          <span>যাচাইকৃত বিশেষজ্ঞ তালিকা</span>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
          ২. ফেনীর শীর্ষ বিশেষজ্ঞ ডাক্তারদের তালিকা ও চেম্বার শিডিউল
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          মেডিসিন, হৃদরোগ, সার্জারি, গাইনী, শিশু ও অর্থোপেডিক চিকিৎসকদের চেম্বার, ভিজিটিং সময় ও ফোন নম্বর।
        </p>
      </div>

      {/* Department Quick Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedDept("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedDept === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          সকল বিশেষজ্ঞ
        </button>
        {doctorGroups.map((group) => {
          const Icon = DEPARTMENT_ICONS[group.department] || Stethoscope;
          const isSelected = selectedDept === group.department;
          return (
            <button
              key={group.department}
              type="button"
              onClick={() => setSelectedDept(group.department)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{group.departmentNameBn || group.departmentNameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Specialty Groups */}
      <div className="space-y-10 sm:space-y-12">
        {filteredGroups.map((group) => {
          const Icon = DEPARTMENT_ICONS[group.department] || Stethoscope;
          return (
            <div
              key={group.department}
              id={`dept-${group.department}`}
              className="scroll-mt-24 space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-border/70 pb-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
                    {group.departmentNameBn || group.departmentNameEn}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {group.descriptionBn ||
                      `ফেনীর অভিজ্ঞ ${group.departmentNameBn || group.departmentNameEn} বিশেষজ্ঞ চিকিৎসকদের চেম্বার ও বিস্তারিত তালিকা।`}
                  </p>
                </div>
              </div>

              {/* Doctor Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
                {group.doctors.map((doctor, docIdx) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    rank={doctor.rank ?? docIdx + 1}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DoctorCard({
  doctor,
  rank,
}: {
  doctor: DoctorSpecialistItem;
  rank: number;
}) {
  const primaryPhone = doctor.serialPhone.split(",")[0].trim();
  const cleanPhone = primaryPhone.replace(/[^0-9]/g, "");

  return (
    <BlogReviewCardWrapper
      sectionId={`doctor-${doctor.id}`}
      rank={rank}
      partnerStatus={doctor.partnerStatus}
      wrapperClassName="h-full flex flex-col"
      contentPadding="p-4 sm:p-5"
      contentSpacing="space-y-4"
      className="flex-1 flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {doctor.featuredBadgeBn && (
            <Badge
              variant="outline"
              className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20 hover:text-emerald-950 dark:hover:bg-emerald-500/25 dark:hover:text-emerald-100 transition-colors cursor-default"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {doctor.featuredBadgeBn}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="text-[11px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-default"
          >
            {doctor.specialtyBn || doctor.specialtyEn}
          </Badge>
        </div>

        {/* Doctor Name & Designation */}
        <div>
          <h4 className="font-heading text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors">
            <Link href={doctor.consultantProfileUrl || `/consultants/${doctor.id}`}>
              {doctor.nameBn || doctor.nameEn}
            </Link>
          </h4>
          <p className="text-xs text-primary font-medium mt-0.5">
            {doctor.designationBn}
          </p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {doctor.degreesBn}
          </p>
        </div>

        {/* Chamber Details */}
        <div className="rounded-xl bg-muted/40 p-3 space-y-2 text-xs border border-border/50">
          <div className="flex items-start gap-2 text-foreground/90">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">{doctor.chamberNameBn}</span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {doctor.chamberAddressBn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-[11px] truncate">{doctor.visitingDaysBn}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-[11px] truncate">{doctor.visitingHoursBn}</span>
          </div>

          <div className="pt-1 flex items-center justify-between border-t border-border/50 text-[11px]">
            <span className="text-muted-foreground">
              ভিজিট ফি:
            </span>
            <span className="font-bold text-primary">
              {doctor.consultationFeeBn}
            </span>
          </div>

          {doctor.partnerStatus && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                হেলথ ক্লাব কার্ডধারীদের জন্য হাসপাতালে ১০-৩০% বিশেষ ছাড়
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: Serial Call & Consultant Link */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <a
          href={`tel:${cleanPhone}`}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors"
        >
          <Phone className="h-3.5 w-3.5" />
          <span>সিরিয়াল কল</span>
        </a>

        <Link
          href={doctor.consultantProfileUrl || `/consultants/${doctor.id}`}
          className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-border bg-muted/50 hover:bg-muted text-foreground text-xs font-semibold transition-colors"
        >
          <span>প্রোফাইল</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </BlogReviewCardWrapper>
  );
}
