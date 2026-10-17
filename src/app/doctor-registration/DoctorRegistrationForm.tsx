"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  Stethoscope,
  Send,
  Loader2,
  AlertCircle,
  FileText,
  Building,
  PhoneCall,
  UserCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  doctorRegistrationSchema,
  type DoctorRegistrationFormValues,
} from "@/lib/validations/doctorRegistration";
import { submitDoctorRegistrationAction } from "@/app/actions/doctorRegistrationActions";

const DEPARTMENT_OPTIONS = [
  { value: "medicine", label: "মেডিসিন (Medicine)" }, { value: "cardiology", label: "হৃদরোগ (Cardiology)" },
  { value: "gynecology", label: "গাইনী ও প্রসূতিরোগ (Gynecology & Obs)" }, { value: "orthopedics", label: "অর্থোপেডিক ও হাড়-জোড় (Orthopedics)" },
  { value: "pediatrics", label: "শিশু রোগ (Pediatrics)" }, { value: "psychiatry", label: "মানসিক ও ব্রেইন রোগ (Psychiatry)" },
  { value: "nephrology", label: "কিডনি রোগ (Nephrology)" }, { value: "hepatology", label: "লিভার রোগ (Hepatology)" },
  { value: "surgery", label: "জেনারেল ও ল্যাপারোস্কপিক সার্জারি (Surgery)" }, { value: "dermatology", label: "চর্ম ও যৌন রোগ (Dermatology)" },
  { value: "ent", label: "নাক, কান ও গলা (ENT)" }, { value: "eye", label: "চক্ষুরোগ (Eye / Ophthalmology)" },
  { value: "dental", label: "ডেন্টাল ও দন্তচিকিৎসা (Dental)" }, { value: "diabetes", label: "ডায়াবেটিস ও হরমোন (Endocrinology)" },
  { value: "neurology", label: "নিউরোলজি ও স্নায়ুরোগ (Neurology)" }, { value: "rheumatology", label: "বাত-ব্যথা ও রিউমাটোলজি (Rheumatology)" },
  { value: "nutrition", label: "পুষ্টি ও ডায়েট (Nutrition)" }, { value: "other", label: "অন্যান্য (Other)" },
];

const UPAZILA_OPTIONS = [
  { value: "feni-sadar", label: "ফেনী সদর (Feni Sadar)" }, { value: "chhagalnaiya", label: "ছাগলনাইয়া (Chhagalnaiya)" },
  { value: "daganbhuiyan", label: "দাগনভূঞা (Daganbhuiyan)" }, { value: "sonagazi", label: "সোনাগাজী (Sonagazi)" },
  { value: "parshuram", label: "পরশুরাম (Parshuram)" }, { value: "fulgazi", label: "ফুলগাজী (Fulgazi)" },
];

export default function DoctorRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedDoctorName, setSubmittedDoctorName] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DoctorRegistrationFormValues>({
    resolver: zodResolver(doctorRegistrationSchema),
    defaultValues: {
      name: "",
      nameEn: "",
      degrees: "",
      bmdcNo: "",
      department: "medicine",
      specialty: "",
      designation: "",
      chamberName: "",
      chamberAddress: "",
      upazila: "feni-sadar",
      roomNo: "",
      visitingDays: "শনিবার থেকে বৃহস্পতিবার",
      visitingHours: "বিকাল ৪:০০ - রাত ৮:০০",
      serialPhone: "",
      consultationFee: "",
      contactPhone: "",
      notice: "",
    },
  });

  const onSubmit = async (values: DoctorRegistrationFormValues) => {
    try {
      const res = await submitDoctorRegistrationAction(values);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setSubmittedDoctorName(values.name);
      setSubmitted(true);
      reset();
      toast.success(res.message);
    } catch {
      toast.error("আবেদনটি পাঠাতে সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।");
    }
  };

  if (submitted) {
    return (
      <Card className="border border-primary/20 bg-card shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-8 sm:p-12 text-center space-y-6">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-2xl font-bold text-secondary dark:text-white">
              নিবন্ধন আবেদন সফলভাবে গৃহীত হয়েছে!
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              শ্রদ্ধেয় <strong className="text-foreground">{submittedDoctorName}</strong>, আপনার প্রদত্ত চেম্বার ও বিএমডিসি তথ্য আমাদের মেডিকেল ভেরিফিকেশন টিম কর্তৃক দ্রুত যাচাই করা হবে।
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/80 text-xs text-muted-foreground max-w-md mx-auto space-y-1 text-left">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-primary" /> পরবর্তী প্রক্রিয়া:
            </p>
            <p>• ১২ থেকে ২৪ ঘণ্টার মধ্যে BMDC রেজিস্ট্রি ও চেম্বার তথ্য যাচাই সম্পন্ন হবে।</p>
            <p>• তথ্য অনুমোদিত হলে স্বয়ংক্রিয়ভাবে হেলথ ক্লাব ডাক্তার ডিরেক্টরিতে আপনার প্রোফাইল যুক্ত হবে।</p>
          </div>
          <Button
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 rounded-xl cursor-pointer"
          >
            আরেকজন চিকিৎসকের তথ্য যুক্ত করুন
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/80 bg-card shadow-xs rounded-3xl overflow-hidden">
      <CardContent className="p-6 sm:p-10 space-y-8">
        <div className="space-y-2 border-b border-border/60 pb-5">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Stethoscope className="h-4 w-4" />
            <span>১০০% ফ্রি অনলাইন চেম্বার এনলিস্টমেন্ট</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary dark:text-white">
            চিকিৎসক ও চেম্বার রেজিস্ট্রেশন ফর্ম
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            তারকা চিহ্নিত (*) ঘরগুলো পূরণ করা বাধ্যতামূলক। তথ্য জমা দেওয়ার পর আমাদের টিম BMDC নম্বর যাচাই করে ডিরেক্টরিতে যুক্ত করবে।
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Doctor Identity */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <span>১. চিকিৎসকের পরিচয় ও শিক্ষাগত যোগ্যতা</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-foreground">
                  চিকিৎসকের নাম (বাংলায়) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="যেমন: ডাঃ মোঃ কামরুল হাসান"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="nameEn" className="text-xs font-semibold text-foreground">
                  ডাক্তারের নাম (ইংরেজিতে - ঐচ্ছিক)
                </label>
                <Input
                  id="nameEn"
                  placeholder="e.g. Dr. Md. Kamrul Hasan"
                  {...register("nameEn")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="degrees" className="text-xs font-semibold text-foreground">
                  মেডিকেল ডিগ্রি সমূহ <span className="text-red-500">*</span>
                </label>
                <Input
                  id="degrees"
                  placeholder="যেমন: MBBS, BCS (Health), FCPS (Medicine)"
                  {...register("degrees")}
                  className={errors.degrees ? "border-red-500" : ""}
                />
                {errors.degrees && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.degrees.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="bmdcNo" className="text-xs font-semibold text-foreground">
                  BMDC রেজিস্ট্রেশন নম্বর <span className="text-red-500">*</span>
                </label>
                <Input
                  id="bmdcNo"
                  placeholder="যেমন: A-54321 (যাচাইয়ের জন্য আবশ্যক)"
                  {...register("bmdcNo")}
                  className={errors.bmdcNo ? "border-red-500" : ""}
                />
                {errors.bmdcNo && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.bmdcNo.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Specialty & Department */}
          <div className="space-y-4 pt-3 border-t border-border/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>২. বিভাগ, বিশেষজ্ঞতা ও পদবী</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="department" className="text-xs font-semibold text-foreground">
                  চিকিৎসা বিভাগ নির্বাচন করুন <span className="text-red-500">*</span>
                </label>
                <select
                  id="department"
                  {...register("department")}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                >
                  {DEPARTMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.department.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="specialty" className="text-xs font-semibold text-foreground">
                  বিশেষজ্ঞতা টাইটেল <span className="text-red-500">*</span>
                </label>
                <Input
                  id="specialty"
                  placeholder="যেমন: মেডিসিন, ডায়াবেটিস ও বক্ষব্যাধি বিশেষজ্ঞ"
                  {...register("specialty")}
                  className={errors.specialty ? "border-red-500" : ""}
                />
                {errors.specialty && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.specialty.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="designation" className="text-xs font-semibold text-foreground">
                বর্তমান পদবী ও কর্মস্থল <span className="text-red-500">*</span>
              </label>
              <Input
                id="designation"
                placeholder="যেমন: কনসালট্যান্ট (মেডিসিন), ফেনী ২৫০ শয্যা জেনারেল হাসপাতাল"
                {...register("designation")}
                className={errors.designation ? "border-red-500" : ""}
              />
              {errors.designation && (
                <p className="text-2xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.designation.message}
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Chamber & Schedule */}
          <div className="space-y-4 pt-3 border-t border-border/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              <span>৩. চেম্বার ও রোগী দেখার সময়সূচী</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="chamberName" className="text-xs font-semibold text-foreground">
                  চেম্বারের নাম / হাসপাতাল <span className="text-red-500">*</span>
                </label>
                <Input
                  id="chamberName"
                  placeholder="যেমন: ফেনী ডায়াবেটিক হাসপাতাল"
                  {...register("chamberName")}
                  className={errors.chamberName ? "border-red-500" : ""}
                />
                {errors.chamberName && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.chamberName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="upazila" className="text-xs font-semibold text-foreground">
                  উপজেলা <span className="text-red-500">*</span>
                </label>
                <select
                  id="upazila"
                  {...register("upazila")}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                >
                  {UPAZILA_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.upazila && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.upazila.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="chamberAddress" className="text-xs font-semibold text-foreground">
                  চেম্বারের পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                </label>
                <Input
                  id="chamberAddress"
                  placeholder="যেমন: এস.এস.কে রোড, ফেনী সদর"
                  {...register("chamberAddress")}
                  className={errors.chamberAddress ? "border-red-500" : ""}
                />
                {errors.chamberAddress && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.chamberAddress.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="roomNo" className="text-xs font-semibold text-foreground">
                  রুম / কক্ষ নম্বর (ঐচ্ছিক)
                </label>
                <Input
                  id="roomNo"
                  placeholder="যেমন: কক্ষ নং ২০৫"
                  {...register("roomNo")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="visitingDays" className="text-xs font-semibold text-foreground">
                  রোগী দেখার দিনসমূহ <span className="text-red-500">*</span>
                </label>
                <Input
                  id="visitingDays"
                  placeholder="যেমন: শনি থেকে বৃহস্পতিবার (শুক্রবার বন্ধ)"
                  {...register("visitingDays")}
                  className={errors.visitingDays ? "border-red-500" : ""}
                />
                {errors.visitingDays && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.visitingDays.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="visitingHours" className="text-xs font-semibold text-foreground">
                  রোগী দেখার সময়সূচী <span className="text-red-500">*</span>
                </label>
                <Input
                  id="visitingHours"
                  placeholder="যেমন: বিকাল ৪:০০ - রাত ৮:০০"
                  {...register("visitingHours")}
                  className={errors.visitingHours ? "border-red-500" : ""}
                />
                {errors.visitingHours && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.visitingHours.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Serial */}
          <div className="space-y-4 pt-3 border-t border-border/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-primary" />
              <span>৪. সিরিয়াল নম্বর ও ভেরিফিকেশন যোগাযোগ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="serialPhone" className="text-xs font-semibold text-foreground">
                  রোগীদের সিরিয়াল বুকিং ফোন <span className="text-red-500">*</span>
                </label>
                <Input
                  id="serialPhone"
                  type="tel"
                  placeholder="018XXXXXXXX"
                  {...register("serialPhone")}
                  className={errors.serialPhone ? "border-red-500" : ""}
                />
                {errors.serialPhone && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.serialPhone.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="consultationFee" className="text-xs font-semibold text-foreground">
                  পরামর্শ ফি (টাকা - ঐচ্ছিক)
                </label>
                <Input
                  id="consultationFee"
                  placeholder="যেমন: ৬০০ টাকা"
                  {...register("consultationFee")}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contactPhone" className="text-xs font-semibold text-foreground">
                  ভেরিফিকেশন মোবাইল / WhatsApp <span className="text-red-500">*</span>
                </label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="017XXXXXXXX"
                  {...register("contactPhone")}
                  className={errors.contactPhone ? "border-red-500" : ""}
                />
                {errors.contactPhone && (
                  <p className="text-2xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.contactPhone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="notice" className="text-xs font-semibold text-foreground">
                বিশেষ কোনো নির্দেশনা বা তথ্য (ঐচ্ছিক)
              </label>
              <Input
                id="notice"
                placeholder="যেমন: সিরিয়ালের জন্য প্রতিদিন সকাল ১০টায় কল দিতে হবে"
                {...register("notice")}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 rounded-xl text-base shadow-sm cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> তথ্য যাচাই করে জমা দেওয়া হচ্ছে...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-5 w-5" /> চেম্বার তথ্য বিনামূল্যে জমা দিন
              </span>
            )}
          </Button>

          <p className="text-center text-2xs text-muted-foreground">
            আপনার প্রদত্ত তথ্য সুরক্ষিত থাকবে এবং শুধুমাত্র রোগীর সঠিক চিকিৎসা সেবা প্রাপ্তি ও চেম্বার ডিরেক্টরিতে প্রকাশের কাজে ব্যবহৃত হবে।
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
