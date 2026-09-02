import { z } from "zod";

export const partnerDoctorChamberSchema = z.object({
  roomNo: z.string().trim().optional(),
  visitingDays: z.string().trim().optional(),
  visitingHours: z.string().trim().optional(),
  serialPhone: z.string().trim().optional(),
  consultationFee: z.string().trim().optional(),
});

export type PartnerDoctorChamberFormValues = z.infer<typeof partnerDoctorChamberSchema>;

export const addPartnerDoctorSchema = z.object({
  name: z.string().trim().min(2, "ডাক্তারের নাম লিখুন।"),
  specialty: z.string().trim().min(2, "বিশেষজ্ঞতা লিখুন।"),
  department: z.string().trim().min(2, "বিভাগ নির্বাচন করুন।"),
  degrees: z.string().trim().min(2, "ডিগ্রি/যোগ্যতা লিখুন।"),
  designation: z.string().trim().min(2, "পদবী লিখুন।"),
  roomNo: z.string().trim().optional(),
  visitingDays: z.string().trim().min(2, "রোগী দেখার দিন উল্লেখ করুন।"),
  visitingHours: z.string().trim().min(2, "রোগী দেখার সময় উল্লেখ করুন।"),
  serialPhone: z.string().trim().min(5, "সিরিয়ালের মোবাইল নম্বর দিন।"),
  consultationFee: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  upazila: z.string().trim().optional(),
  isActive: z.boolean().optional(),
  availableToday: z.boolean().optional(),
  onLeaveUntil: z.string().optional(),
  notice: z.string().trim().optional(),
});

export type AddPartnerDoctorFormValues = z.infer<typeof addPartnerDoctorSchema>;

export const updatePartnerDoctorSchema = z.object({
  name: z.string().trim().min(2, "ডাক্তারের নাম লিখুন।").optional(),
  specialty: z.string().trim().min(2, "বিশেষজ্ঞতা লিখুন।").optional(),
  department: z.string().trim().min(2, "বিভাগ নির্বাচন করুন।").optional(),
  degrees: z.string().trim().optional(),
  designation: z.string().trim().optional(),
  roomNo: z.string().trim().optional(),
  visitingDays: z.string().trim().min(2, "রোগী দেখার দিন উল্লেখ করুন।").optional(),
  visitingHours: z.string().trim().min(2, "রোগী দেখার সময় উল্লেখ করুন।").optional(),
  serialPhone: z.string().trim().min(5, "সিরিয়ালের মোবাইল নম্বর দিন।").optional(),
  consultationFee: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  upazila: z.string().trim().optional(),
  isActive: z.boolean().optional(),
  availableToday: z.boolean().optional(),
  onLeaveUntil: z.string().optional(),
  notice: z.string().trim().optional(),
});

export type UpdatePartnerDoctorFormValues = z.infer<typeof updatePartnerDoctorSchema>;
