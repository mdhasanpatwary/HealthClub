import { z } from "zod";

export const doctorImportSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  specialty: z.string().min(2, "Specialty is required"),
  department: z.string().min(2, "Department is required").default("medicine"),
  degrees: z.string().min(2, "Degrees / qualification is required"),
  designation: z.string().min(2, "Designation is required"),
  chamberName: z.string().min(2, "Chamber name is required"),
  chamberAddress: z.string().min(2, "Chamber address is required"),
  roomNo: z.string().optional().default(""),
  visitingDays: z.string().min(2, "Visiting days are required"),
  visitingHours: z.string().min(2, "Visiting hours are required"),
  serialPhone: z.string().min(5, "Serial phone number is required"),
  consultationFee: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  upazila: z.string().optional().default("feni-sadar"),
});

export const partnerImportSchema = z.object({
  name: z.string().min(2, "Facility name is required"),
  category: z.enum(["hospital", "diagnostic", "pharmacy"], {
    message: "Category must be hospital, diagnostic, or pharmacy",
  }),
  address: z.string().min(3, "Address is required"),
  discount: z.string().min(2, "Discount description is required"),
  phone: z.string().min(5, "Contact phone is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  logoText: z.string().min(1, "Logo text is required"),
  emergencyPhone: z.string().optional().default(""),
  workingHours: z.string().optional().default(""),
  mapLink: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  upazila: z.string().optional().default("feni-sadar"),
});

export const bloodDonorImportSchema = z.object({
  name: z.string().min(2, "Donor name is required"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], {
    message: "Blood group must be A+, A-, B+, B-, O+, O-, AB+, or AB-",
  }),
  upazila: z.string().min(2, "Upazila is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  lastDonated: z.string().optional().default("তথ্য নেই"),
  isAvailable: z.boolean().optional().default(true),
});

export const ambulanceImportSchema = z.object({
  name: z.string().min(2, "Agency name is required"),
  type: z.enum(["ICU", "AC", "Non-AC", "Freezer"], {
    message: "Type must be ICU, AC, Non-AC, or Freezer",
  }),
  location: z.string().min(2, "Location is required"),
  phone: z.string().min(5, "Phone number is required"),
  availableHours: z.string().optional().default("২৪ ঘণ্টা"),
});

export const hotlineImportSchema = z.object({
  titleBn: z.string().min(2, "Bengali title is required"),
  titleEn: z.string().min(2, "English title is required"),
  category: z.enum(["hospital", "fire", "police", "oxygen", "blood_bank"], {
    message: "Category must be hospital, fire, police, oxygen, or blood_bank",
  }),
  phone: z.string().min(3, "Phone number is required"),
  descriptionBn: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
});
