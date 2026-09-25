"use client";

import { useState, useMemo } from "react";
import {
  Stethoscope,
  Search,
  PhoneCall,
  Pill,
} from "lucide-react";
import { Doctor, Partner } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DoctorSerialModal } from "@/components/ui/doctors/DoctorModals";
import { DoctorCard } from "@/components/ui/doctors/DoctorCard";
import { toBanglaNums } from "@/lib/utils";

interface HospitalDoctorRosterProps {
  doctors: Doctor[];
  partner: Partner;
}

const DEPARTMENTS = [
  { id: "all", label: "সকল বিভাগ" },
  { id: "medicine", label: "মেডিসিন" },
  { id: "cardiology", label: "হৃদরোগ (কার্ডিওলজি)" },
  { id: "gynecology", label: "স্ত্রী ও প্রসূতিরোগ" },
  { id: "orthopedics", label: "অর্থোপেডিকস (হাড়-জোড়া)" },
  { id: "pediatrics", label: "শিশু ও নবজাতক" },
  { id: "surgery", label: "জেনারেল ও ল্যাপারোস্কপিক সার্জারি" },
  { id: "dermatology", label: "চর্ম ও যৌনরোগ" },
  { id: "ent", label: "নাক, কান ও গলা (ইএনটি)" },
  { id: "eye", label: "চক্ষু রোগ" },
  { id: "dental", label: "দন্তরোগ ও ডেন্টাল সার্জারি" },
  { id: "nephrology", label: "কিডনি রোগ (নেফ্রোলজি)" },
  { id: "psychiatry", label: "মানসিক রোগ (সাইকিয়াট্রি)" },
  { id: "hepatology", label: "লিভার ও পরিপাকতন্ত্র" },
  { id: "nutrition", label: "পুষ্টি ও ডায়েট" },
];

export default function HospitalDoctorRoster({ doctors, partner }: HospitalDoctorRosterProps) {
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
              মডেল ফার্মেসি ও ঔষধ সেবা
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              এই প্রতিষ্ঠানটি একটি অনুমোদিত মডেল ফার্মেসি হিসেবে খাঁটি প্রেসক্রিপশন মেডিসিন, ইনসুলিন ও চিকিৎসা সামগ্রী সরবরাহ করে। এখানে সরাসরি চেম্বার সেবা নেই।
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
            <span>ফার্মেসিতে কল করুন</span>
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
            কোনো বিশেষজ্ঞ ডাক্তার তালিকাভুক্ত নেই
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            এই প্রতিষ্ঠানে রোগী দেখার শিডিউল শীঘ্রই আপডেট করা হবে। যেকোনো তথ্যের জন্য সরাসরি হেল্পলাইনে যোগাযোগ করুন।
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
            {isDiagnostic ? "ডায়াগনস্টিকে কল করুন" : "হাসপাতাল ডেস্কে কল করুন"}
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
              চেম্বার ও বিশেষজ্ঞ ডাক্তার তালিকা
            </h2>
            <Badge variant="secondary" className="font-bold text-xs bg-primary/10 text-primary border-primary/20">
              {toBanglaNums(doctors.length)} জন ডাক্তার
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {partner.name}-এ নিয়মিত চেম্বার ও রোগী দেখার শিডিউল
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ডাক্তার বা স্পেশালিটি খুঁজুন..."
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
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer border ${isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-2xs font-semibold"
                    : "bg-background dark:bg-slate-900 text-muted-foreground border-border/80 hover:border-primary/40 hover:text-foreground"
                  }`}
              >
                {dept.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Doctor Cards Grid */}
      {displayedDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {displayedDoctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              variant="partner-roster"
              onSerialClick={(selectedDoc) => setSelectedDoctorForSerial(selectedDoc)}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-dashed border-border text-center">
          <p className="text-xs text-muted-foreground">
            আপনার অনুসন্ধানের সাথে মিল রেখে কোনো ডাক্তার পাওয়া যায়নি।
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
            আরো ডাক্তার দেখুন (বাকি {toBanglaNums(filteredDoctors.length - visibleLimit)} জন)
          </Button>
        </div>
      )}

      {/* Serial Hotline Modal */}
      {selectedDoctorForSerial && (
        <DoctorSerialModal
          doctor={selectedDoctorForSerial}
          onClose={() => setSelectedDoctorForSerial(null)}
        />
      )}
    </div>
  );
}
