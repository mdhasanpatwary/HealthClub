import { z } from "zod";
import { bangladeshiPhoneRegex } from "./member";

export const systemSettingsSchema = z.object({
  founding_fee: z
    .string()
    .trim()
    .regex(/^\d+$/, "ফাউন্ডিং মেম্বার ফি সংখ্যা হতে হবে।"),
  premium_fee: z
    .string()
    .trim()
    .regex(/^\d+$/, "প্রিমিয়াম মেম্বার ফি সংখ্যা হতে হবে।"),
  bkash_personal_number: z
    .string()
    .trim()
    .regex(bangladeshiPhoneRegex, "সঠিক বিকাশ পার্সোনাল নম্বর দিন।"),
  bkash_merchant_number: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || bangladeshiPhoneRegex.test(val), {
      message: "সঠিক বিকাশ মার্চেন্ট নম্বর দিন।",
    }),
  payment_instructions: z
    .string()
    .trim()
    .min(5, "পেমেন্ট নির্দেশিকা লিখুন।"),
  hotline_phone: z
    .string()
    .trim()
    .min(5, "হটলাইন নম্বর দিন।"),
  contact_hotline: z.string().trim().optional(),
  whatsapp_phone: z
    .string()
    .trim()
    .min(5, "হোয়াটসঅ্যাপ নম্বর দিন।"),
  contact_whatsapp: z.string().trim().optional(),
  official_email: z
    .string()
    .trim()
    .email("সঠিক অফিসিয়াল ইমেইল লিখুন।"),
  contact_email: z.string().trim().optional(),
  facebook_url: z
    .string()
    .trim()
    .min(5, "ফেসবুক লিংক লিখুন।"),
  notice_enabled: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
  notice_text: z.string().trim().optional(),
  allow_member_tx: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
});

export type SystemSettingsFormValues = z.infer<typeof systemSettingsSchema>;
