import { z } from "zod";
import { bangladeshiPhoneRegex } from "./member";

export const contactMessageSchema = z.object({
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
    .email("সঠিক ইমেইল ঠিকানা দিন।")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "বার্তা কমপক্ষে ৫ অক্ষরের হতে হবে।")
    .max(2000, "বার্তা ২০০০ অক্ষরের মধ্যে হতে হবে।"),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
