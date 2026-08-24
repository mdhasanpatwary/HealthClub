"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Search,
  Calendar,
  Clock,
  PhoneCall,
  ChevronRight,
  Pill,
} from "lucide-react";
import { Doctor, Partner } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { DoctorAvatar, DoctorSerialModal } from "@/components/ui/doctors/DoctorModals";

interface HospitalDoctorRosterProps {
  doctors: Doctor[];
  partner: Partner;
}

const DEPARTMENTS = [
  { id: "all", bn: "সকল বিভাগ", en: "All Specialties" },
  { id: "medicine", bn: "মেডিসিন", en: "Medicine" },
  { id: "cardiology", bn: "হৃদরোগ (কার্ডিওলজি)", en: "Cardiology" },
  { id: "gynecology", bn: "স্ত্রী ও প্রসূতিরোগ", en: "Gynecology" },
  { id: "orthopedics", bn: "অর্থোপেডিকস (হাড়-জোড়া)", en: "Orthopedics" },
  { id: "pediatrics", bn: "শিশু ও নবজাতক", en: "Pediatrics" },
  { id: "surgery", bn: "জেনারেল ও ল্যাপারোস্কপিক সার্জারি", en: "Surgery" },
  { id: "dermatology", bn: "চর্ম ও যৌনরোগ", en: "Dermatology" },
  { id: "ent", bn: "নাক, কান ও গলা (ইএনটি)", en: "ENT" },
  { id: "eye", bn: "চক্ষু রোগ", en: "Eye (Ophthalmology)" },
  { id: "dental", bn: "দন্তরোগ ও ডেন্টাল সার্জারি", en: "Dental" },
  { id: "nephrology", bn: "কিডনি রোগ (নেফ্রোলজি)", en: "Nephrology" },
  { id: "psychiatry", bn: "মানসিক রোগ (সাইকিয়াট্রি)", en: "Psychiatry" },
  { id: "hepatology", bn: "লিভার ও পরিপাকতন্ত্র", en: "Hepatology" },
  { id: "nutrition", bn: "পুষ্টি ও ডায়েট", en: "Nutrition" },
];

export default function HospitalDoctorRoster({ doctors, partner }: HospitalDoctorRosterProps) {
  const { locale, t } = useLanguage();
  const isEn = locale === "en";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [visibleLimit, setVisibleLimit] = useState(12);
  const [selectedDoctorForSerial, setSelectedDoctorForSerial] = useState<Doctor | null>(null);

  const isPharmacy = partner.category === "pharmacy";
  const isDiagnostic = partner.category === "diagnostic";

  // Available departments in the roster
  const availableDeptIds = useMemo(() => {
    const set = new Set(doctors.map((d) => d.department.toLowerCase()));
    return set;
  }, [doctors]);

  const filteredDepartments = useMemo(() => {
    return DEPARTMENTS.filter(
      (dept) => dept.id === "all" || availableDeptIds.has(dept.id.toLowerCase())
    );
  }, [availableDeptIds]);

  const filteredDoctors = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return doctors.filter((doc) => {
      const matchDept = selectedDept === "all" || doc.department.toLowerCase() === selectedDept.toLowerCase();
      if (!matchDept) return false;

      if (!q) return true;
      return (
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.degrees.toLowerCase().includes(q) ||
        doc.designation.toLowerCase().includes(q) ||
        doc.visitingDays.toLowerCase().includes(q)
      );
    });
  }, [doctors, selectedDept, searchQuery]);

  const displayedDoctors = filteredDoctors.slice(0, visibleLimit);

  if (doctors.length === 0) {
    if (isPharmacy) {
      return (
        <div className="p-6 sm:p-8 rounded-3xl border border-dashed border-border/80 bg-muted/20 text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Pill className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              {isEn ? "Model Pharmacy & Medicine Service" : "মডেল ফার্মেসি ও ঔষধ সেবা"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              {isEn
                ? "This facility operates as a model pharmacy offering 100% genuine medicines, baby products, and medical supplies. Specialist doctor chambers are not currently hosted here."
                : "এই প্রতিষ্ঠানটি একটি অনুমোদিত মডেল ফার্মেসি হিসেবে খাঁটি প্রেসক্রিপশন মেডিসিন, ইনসুলিন ও চিকিৎসা সামগ্রী সরবরাহ করে। এখানে সরাসরি চেম্বার সেবা নেই।"}
            </p>
          </div>
          <a
            href={`tel:${partner.phone}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "rounded-xl mt-2 inline-flex items-center",
            })}
          >
            <PhoneCall className="h-3.5 w-3.5 mr-1.5" />
            <span>{isEn ? "Call Pharmacy Counter" : "ফার্মেসিতে কল করুন"}</span>
          </a>
        </div>
      );
    }

    return (
      <div className="p-8 rounded-3xl border border-dashed border-border/80 bg-muted/20 text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <Stethoscope className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            {isEn ? "No Resident Doctors Listed Yet" : "কোনো বিশেষজ্ঞ ডাক্তার তালিকাভুক্ত নেই"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {isEn
              ? "Doctors visiting this facility will be updated soon. Please call the hotline for schedule inquiries."
              : "এই প্রতিষ্ঠানে রোগী দেখার শিডিউল শীঘ্রই আপডেট করা হবে। যেকোনো তথ্যের জন্য সরাসরি হেল্পলাইনে যোগাযোগ করুন।"}
          </p>
        </div>
        <a
          href={`tel:${partner.phone}`}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "rounded-xl mt-2 inline-flex items-center",
          })}
        >
          <PhoneCall className="h-3.5 w-3.5 mr-1.5" />
          <span>
            {isDiagnostic
              ? isEn ? "Call Diagnostic Desk" : "ডায়াগনস্টিকে কল করুন"
              : isEn ? "Call Hospital Desk" : "হাসপাতাল ডেস্কে কল করুন"}
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-secondary dark:text-white font-heading">
              {isEn ? "Resident Consultant Doctors" : "চেম্বার ও বিশেষজ্ঞ ডাক্তার তালিকা"}
            </h2>
            <Badge variant="secondary" className="font-bold text-xs bg-primary/10 text-primary border-primary/20">
              {doctors.length} {isEn ? "Specialists" : "জন ডাক্তার"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEn
              ? `Specialist doctors practicing and providing outpatient consultations at ${partner.name}`
              : `${partner.name}-এ নিয়মিত চেম্বার ও রোগী দেখার শিডিউল`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isEn ? "Search doctor or specialty..." : "ডাক্তার বা স্পেশালিটি খুঁজুন..."}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleLimit(12);
            }}
            className="pl-9 h-9 text-xs rounded-xl bg-background"
          />
        </div>
      </div>

      {/* Department Filter Pills */}
      {filteredDepartments.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          {filteredDepartments.map((dept) => {
            const isSelected = selectedDept === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDept(dept.id);
                  setVisibleLimit(12);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-2xs font-semibold"
                    : "bg-background dark:bg-slate-900 text-muted-foreground border-border/80 hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {isEn ? dept.en : dept.bn}
              </button>
            );
          })}
        </div>
      )}

      {/* Doctor Cards Grid */}
      {displayedDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedDoctors.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl border border-border/80 bg-background dark:bg-slate-900/80 shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start gap-3.5">
                <DoctorAvatar
                  src={doc.imageUrl}
                  alt={doc.name}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl"
                />

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 truncate">
                      {doc.specialty}
                    </span>
                    {doc.roomNo && (
                      <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                        {isEn ? `Room ${doc.roomNo}` : `রুম #${doc.roomNo}`}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/consultants/${doc.id}`}
                    className="block group-hover:text-primary transition-colors"
                  >
                    <h3 className="text-sm font-bold text-secondary dark:text-white truncate font-heading">
                      {doc.name}
                    </h3>
                  </Link>

                  <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
                    {doc.degrees}
                  </p>

                  <p className="text-[11px] font-medium text-foreground/80 line-clamp-1">
                    {doc.designation}
                  </p>
                </div>
              </div>

              {/* Visiting Schedule & Fees */}
              <div className="p-2.5 rounded-xl bg-muted/40 text-[11px] space-y-1 border border-border/40">
                <div className="flex items-center justify-between gap-2 text-foreground/90 font-medium">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{doc.visitingDays}</span>
                  </div>
                  {doc.consultationFee && (
                    <span className="shrink-0 font-bold text-primary font-mono text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">
                      {doc.consultationFee}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{doc.visitingHours}</span>
                </div>
              </div>

              {/* Action Buttons: Appointment Serial & Full Profile */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={() => setSelectedDoctorForSerial(doc)}
                  className="flex-1 h-8 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  <PhoneCall className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                  {isEn ? "Book Serial" : "সিরিয়াল নিন"}
                </Button>

                <Link
                  href={`/consultants/${doc.id}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "h-8 rounded-xl text-xs px-3 border-border hover:border-primary/40 hover:bg-muted/80 cursor-pointer",
                  })}
                >
                  <span>{isEn ? "Profile" : "প্রোফাইল"}</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-0.5 text-muted-foreground" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-dashed border-border text-center">
          <p className="text-xs text-muted-foreground">
            {isEn
              ? "No doctors found matching your filter criteria."
              : "আপনার অনুসন্ধানের সাথে মিল রেখে কোনো ডাক্তার পাওয়া যায়নি।"}
          </p>
        </div>
      )}

      {/* Show More Pagination */}
      {filteredDoctors.length > visibleLimit && (
        <div className="text-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleLimit((prev) => prev + 12)}
            className="rounded-xl px-6 border-primary/30 text-primary hover:bg-primary hover:text-white text-xs font-semibold cursor-pointer"
          >
            {isEn
              ? `Show More Doctors (${filteredDoctors.length - visibleLimit} remaining)`
              : `আরো ডাক্তার দেখুন (বাকি ${filteredDoctors.length - visibleLimit} জন)`}
          </Button>
        </div>
      )}

      {/* Serial Hotline Modal */}
      {selectedDoctorForSerial && (
        <DoctorSerialModal
          doctor={selectedDoctorForSerial}
          onClose={() => setSelectedDoctorForSerial(null)}
          t={t}
          locale={locale}
        />
      )}
    </div>
  );
}
