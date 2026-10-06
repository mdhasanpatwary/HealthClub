import { z } from "zod";

export const PRODUCTS_CACHE_TAG = "shop-products";

export const PRODUCT_CATEGORIES = [
  { value: "medical_device", labelBn: "মেডিকেল ডিভাইস", labelEn: "Medical Devices" },
  { value: "diabetes_care", labelBn: "ডায়াবেটিস কেয়ার", labelEn: "Diabetes Care" },
  { value: "first_aid", labelBn: "ফার্স্ট এইড ও সার্জিক্যাল", labelEn: "First Aid & Surgical" },
  { value: "wellness", labelBn: "ওয়েলনেস ও হেলথ কেয়ার", labelEn: "Wellness & Health Care" },
  { value: "orthopedic", labelBn: "অর্থোপেডিক সাপোর্ট", labelEn: "Orthopedic Supports" },
  { value: "general", labelBn: "সাধারণ পণ্য", labelEn: "General Products" },
] as const;

export const productCategoryValues = [
  "medical_device",
  "diabetes_care",
  "first_aid",
  "wellness",
  "orthopedic",
  "general",
] as const;

export const productSchema = z.object({
  nameBn: z
    .string()
    .trim()
    .min(2, "প্রোডাক্টের বাংলা নাম কমপক্ষে ২ অক্ষরের হতে হবে।")
    .max(200, "নাম ২০০ অক্ষরের মধ্যে হতে হবে।"),
  nameEn: z
    .string()
    .trim()
    .min(2, "প্রোডাক্টের ইংরেজি নাম কমপক্ষে ২ অক্ষরের হতে হবে।")
    .max(200, "নাম ২০০ অক্ষরের মধ্যে হতে হবে।"),
  slug: z
    .string()
    .trim()
    .min(2, "স্লাগ আবশ্যক।")
    .regex(/^[a-z0-9-]+$/, "স্লাগ শুধুমাত্র ছোট হাতের ইংরেজি অক্ষর, সংখ্যা এবং হাইফেন (-) হতে পারবে।"),
  price: z
    .number({ message: "সঠিক মূল্য (টাকা) প্রদান করুন।" })
    .int("মূল্য পূর্ণসংখ্যা হতে হবে।")
    .positive("মূল্য অবশ্যই ০-এর বেশি হতে হবে।"),
  regularPrice: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),
  discountBadge: z
    .string()
    .trim()
    .optional()
    .nullable(),
  category: z
    .string()
    .trim(),
  categoryBn: z
    .string()
    .trim()
    .optional()
    .nullable(),
  descriptionBn: z
    .string()
    .trim()
    .min(10, "কমপক্ষে ১০ অক্ষরের বাংলা বিবরণ লিখুন।"),
  descriptionEn: z
    .string()
    .trim()
    .optional()
    .nullable(),
  featuresBn: z
    .array(z.string().trim())
    .optional()
    .nullable(),
  imageUrl: z
    .string()
    .trim()
    .min(1, "প্রোডাক্টের ছবি বা ছবির লিংক আবশ্যক।"),
  inStock: z
    .boolean(),
  featured: z
    .boolean(),
  isActive: z
    .boolean(),
  order: z
    .number()
    .int(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export interface ProductItem {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  price: number;
  regularPrice?: number | null;
  discountBadge?: string | null;
  category: string;
  categoryBn?: string | null;
  descriptionBn: string;
  descriptionEn?: string | null;
  featuresBn?: string[] | null;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
