import { z } from "zod";
import { bangladeshiPhoneRegex } from "./member";

export const partnerCategoryEnum = ["hospital", "diagnostic", "pharmacy"] as const;

export const partnerRequestSchema = z.object({
  orgName: z
    .string()
    .trim()
    .min(3, "প্রতিষ্ঠানের নাম কমপক্ষে ৩ অক্ষরের হতে হবে।")
    .max(120, "প্রতিষ্ঠানের নাম ১২০ অক্ষরের মধ্যে হতে হবে।"),
  category: z.enum(partnerCategoryEnum, {
    message: "প্রতিষ্ঠানের ধরন নির্বাচন করুন।",
  }),
  address: z
    .string()
    .trim()
    .min(5, "প্রতিষ্ঠানের পূর্ণ ঠিকানা লিখুন (যেমন: এসএসকে রোড, ফেনী সদর)।")
    .max(250, "ঠিকানা ২৫০ অক্ষরের মধ্যে রাখুন।"),
  discount: z
    .string()
    .trim()
    .min(2, "প্রস্তাবিত ডিসকাউন্ট রেট লিখুন (যেমন: প্যাথলজিতে ২০% ও বেডে ১৫% ছাড়)।")
    .max(120, "ডিসকাউন্ট বিবরণ ১২০ অক্ষরের মধ্যে রাখুন।"),
  contactName: z
    .string()
    .trim()
    .min(3, "দায়িত্বপ্রাপ্ত কর্মকর্তা বা প্রতিনিধির নাম ও পদবী লিখুন।")
    .max(100, "নাম ১০০ অক্ষরের মধ্যে হতে হবে।"),
  phone: z
    .string()
    .trim()
    .regex(bangladeshiPhoneRegex, "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01812345678)।"),
  email: z
    .string()
    .trim()
    .email("সঠিক অফিসিয়াল ইমেইল অ্যাড্রেস প্রদান করুন (যেমন: contact@hospital.com)।")
    .toLowerCase(),
  upazilaConsent: z.boolean().refine((val) => val === true, {
    message: "প্রতিষ্ঠানটি ফেনী সদর এলাকায় অবস্থিত তা নিশ্চিত করতে হবে।",
  }),
});

export type PartnerRequestFormValues = z.infer<typeof partnerRequestSchema>;
