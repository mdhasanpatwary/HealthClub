import { z } from "zod";
import { bangladeshiPhoneRegex } from "./member";

export const bloodGroupsEnum = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const ambulanceTypesEnum = [
  "AC",
  "Non-AC",
  "ICU",
  "Freezer",
] as const;

export const bloodDonorRegistrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে।")
    .max(100, "নাম ১০০ অক্ষরের মধ্যে হতে হবে।"),
  phone: z
    .string()
    .trim()
    .regex(bangladeshiPhoneRegex, "সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 01812345678)।"),
  bloodGroup: z.enum(bloodGroupsEnum, {
    message: "সঠিক রক্তের গ্রুপ নির্বাচন করুন।",
  }),
  upazila: z.string().trim().min(2, "উপজেলা নির্বাচন করুন।"),
  lastDonated: z.string().trim().optional(),
});

export type BloodDonorFormValues = z.infer<typeof bloodDonorRegistrationSchema>;

export const ambulanceRegistrationSchema = z.object({
  serviceName: z
    .string()
    .trim()
    .min(2, "প্রতিষ্ঠানের নাম লিখুন।")
    .max(120, "প্রতিষ্ঠানের নাম ১২০ অক্ষরের মধ্যে হতে হবে।"),
  operatorName: z
    .string()
    .trim()
    .min(2, "চালক অথবা অপারেটরের নাম লিখুন।")
    .max(100, "নাম ১০০ অক্ষরের মধ্যে হতে হবে।"),
  phone: z
    .string()
    .trim()
    .regex(bangladeshiPhoneRegex, "সঠিক মোবাইল নম্বর দিন (যেমন: 01812345678)।"),
  altPhone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || bangladeshiPhoneRegex.test(val), {
      message: "বিকল্প নম্বরটি সঠিক হতে হবে।",
    }),
  type: z.enum(ambulanceTypesEnum, {
    message: "অ্যাম্বুলেন্সের ধরন নির্বাচন করুন।",
  }),
  location: z.string().trim().min(2, "স্ট্যান্ড বা লোকেশন লিখুন।"),
  coverage: z.string().trim().optional(),
});

export type AmbulanceFormValues = z.infer<typeof ambulanceRegistrationSchema>;

export const ambulanceDialogFormSchema = z.object({
  serviceName: z
    .string()
    .trim()
    .min(2, "প্রতিষ্ঠানের নাম লিখুন।")
    .max(120, "প্রতিষ্ঠানের নাম ১২০ অক্ষরের মধ্যে হতে হবে।"),
  operatorName: z
    .string()
    .trim()
    .min(2, "চালক অথবা অপারেটরের নাম লিখুন।")
    .max(100, "নাম ১০০ অক্ষরের মধ্যে হতে হবে।"),
  phone: z
    .string()
    .trim()
    .regex(bangladeshiPhoneRegex, "সঠিক মোবাইল নম্বর দিন (যেমন: 01812345678)।"),
  altPhone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || bangladeshiPhoneRegex.test(val), {
      message: "বিকল্প নম্বরটি সঠিক হতে হবে।",
    }),
  type: z.enum(ambulanceTypesEnum, {
    message: "অ্যাম্বুলেন্সের ধরন নির্বাচন করুন।",
  }),
  upazila: z.string().trim().min(2, "উপজেলা নির্বাচন করুন।"),
  standLocation: z.string().trim().optional(),
  coverage: z.string().trim().optional(),
});

export type AmbulanceDialogFormValues = z.infer<typeof ambulanceDialogFormSchema>;

