import { z } from "zod";
import { bangladeshiPhoneRegex } from "./member";

export const doctorDepartmentsEnum = [
  "medicine",
  "cardiology",
  "gynecology",
  "orthopedics",
  "pediatrics",
  "psychiatry",
  "nephrology",
  "hepatology",
  "surgery",
  "dermatology",
  "ent",
  "eye",
  "dental",
  "diabetes",
  "neurology",
  "rheumatology",
  "nutrition",
  "other",
] as const;

export const feniUpazilasEnum = [
  "feni-sadar",
  "chhagalnaiya",
  "daganbhuiyan",
  "sonagazi",
  "parshuram",
  "fulgazi",
] as const;

export const doctorRegistrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "ডাক্তারের নাম কমপক্ষে ৩ অক্ষরের হতে হবে।")
    .max(120, "নাম ১২০ অক্ষরের মধ্যে হতে হবে।"),
  nameEn: z
    .string()
    .trim()
    .max(120, "ইংরেজি নাম ১২০ অক্ষরের মধ্যে হতে হবে।")
    .optional(),
  degrees: z
    .string()
    .trim()
    .min(3, "মেডিকেল ডিগ্রি (যেমন: MBBS, FCPS, MD) উল্লেখ করুন।")
    .max(250, "ডিগ্রির বিবরণ ২৫০ অক্ষরের মধ্যে রাখুন।"),
  bmdcNo: z
    .string()
    .trim()
    .min(3, "সঠিক BMDC রেজিস্ট্রেশন নম্বর দিন (যেমন: A-12345)।")
    .max(50, "BMDC নম্বর ৫০ অক্ষরের মধ্যে রাখুন।"),
  department: z.enum(doctorDepartmentsEnum, {
    message: "সঠিক চিকিৎসা বিভাগ নির্বাচন করুন।",
  }),
  specialty: z
    .string()
    .trim()
    .min(3, "বিশেষজ্ঞতা উল্লেখ করুন (যেমন: মেডিসিন ও ডায়াবেটিস বিশেষজ্ঞ)।")
    .max(150, "বিশেষজ্ঞতার বিবরণ ১৫০ অক্ষরের মধ্যে রাখুন।"),
  designation: z
    .string()
    .trim()
    .min(3, "পদবী ও কর্মস্থল উল্লেখ করুন (যেমন: কনসালট্যান্ট, ফেনী জেনারেল হাসপাতাল)।")
    .max(200, "পদবীর বিবরণ ২০০ অক্ষরের মধ্যে রাখুন।"),
  chamberName: z
    .string()
    .trim()
    .min(3, "চেম্বারের নাম উল্লেখ করুন (যেমন: ফেনী ডায়াবেটিক হাসপাতাল)।")
    .max(150, "চেম্বারের নাম ১৫০ অক্ষরের মধ্যে রাখুন।"),
  chamberAddress: z
    .string()
    .trim()
    .min(3, "চেম্বারের ঠিকানা উল্লেখ করুন (যেমন: ট্রাঙ্ক রোড, ফেনী)।")
    .max(200, "ঠিকানা ২০০ অক্ষরের মধ্যে রাখুন।"),
  upazila: z.enum(feniUpazilasEnum, {
    message: "উপজেলা নির্বাচন করুন।",
  }),
  roomNo: z
    .string()
    .trim()
    .max(50, "কক্ষ নম্বর ৫০ অক্ষরের মধ্যে রাখুন।")
    .optional(),
  visitingDays: z
    .string()
    .trim()
    .min(2, "রোগী দেখার দিনসমূহ লিখুন (যেমন: শনি থেকে বৃহস্পতি)।")
    .max(150, "রোগী দেখার দিন ১৫০ অক্ষরের মধ্যে রাখুন।"),
  visitingHours: z
    .string()
    .trim()
    .min(2, "রোগী দেখার সময়সূচী লিখুন (যেমন: বিকাল ৪:০০ - রাত ৮:০০)।")
    .max(150, "রোগী দেখার সময় ১৫০ অক্ষরের মধ্যে রাখুন।"),
  serialPhone: z
    .string()
    .trim()
    .regex(bangladeshiPhoneRegex, "সিরিয়ালের জন্য সঠিক মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX)।"),
  consultationFee: z
    .string()
    .trim()
    .max(50, "ভিজিট ফি ৫০ অক্ষরের মধ্যে রাখুন।")
    .optional(),
  contactPhone: z
    .string()
    .trim()
    .regex(bangladeshiPhoneRegex, "ভেরিফিকেশনের জন্য আপনার/সহকারীর ব্যক্তিগত মোবাইল নম্বর দিন।"),
  notice: z
    .string()
    .trim()
    .max(300, "অতিরিক্ত নোট ৩০০ অক্ষরের মধ্যে রাখুন।")
    .optional(),
});

export type DoctorRegistrationFormValues = z.infer<typeof doctorRegistrationSchema>;
