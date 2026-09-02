import { z } from "zod";

export const bangladeshiPhoneRegex = /^(?:\+?880|0)1[3-9]\d{8}$/;

export const memberRegistrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে।")
    .max(100, "নাম ১০০ অক্ষরের মধ্যে হতে হবে।"),
  phone: z
    .string()
    .trim()
    .regex(bangladeshiPhoneRegex, "সঠিক মোবাইল নম্বর লিখুন (যেমন: 01812345678)।"),
  email: z
    .string()
    .trim()
    .email("সঠিক ইমেইল অ্যাড্রেস লিখুন।")
    .toLowerCase(),
  password: z
    .string()
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"),
  tier: z.enum(["founding", "premium"], {
    message: "সদস্যপদ প্ল্যান নির্বাচন করুন।",
  }),
  address: z
    .string()
    .trim()
    .min(3, "ঠিকানা লিখুন (কমপক্ষে ৩ অক্ষর)।")
    .max(200, "ঠিকানা ২০০ অক্ষরের মধ্যে হতে হবে।"),
  birthDate: z
    .string()
    .trim()
    .min(1, "জন্ম তারিখ নির্বাচন করুন।"),
  profession: z
    .string()
    .trim()
    .min(2, "পেশা লিখুন।")
    .max(100, "পেশা ১০০ অক্ষরের মধ্যে হতে হবে।"),
  profilePictureUrl: z
    .string()
    .trim()
    .min(1, "প্রোফাইল ছবি আপলোড করুন।"),
});

export type MemberRegistrationInput = z.infer<typeof memberRegistrationSchema>;

export const adminAddMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে।")
    .max(100, "নাম ১০০ অক্ষরের মধ্যে হতে হবে।"),
  phone: z
    .string()
    .trim()
    .regex(bangladeshiPhoneRegex, "সঠিক মোবাইল নম্বর লিখুন (যেমন: 01812345678)।"),
  email: z
    .string()
    .trim()
    .email("সঠিক ইমেইল অ্যাড্রেস লিখুন।")
    .toLowerCase()
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।")
    .optional()
    .or(z.literal("")),
  tier: z.enum(["founding", "premium"]),
  address: z.string().trim().optional().or(z.literal("")),
  birthDate: z.string().trim().optional().or(z.literal("")),
  profession: z.string().trim().optional().or(z.literal("")),
  profilePictureUrl: z.string().trim().optional().or(z.literal("")),
});

export type AdminAddMemberInput = z.infer<typeof adminAddMemberSchema>;
