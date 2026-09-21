import { Partner } from "@/services/db";

/**
 * Full selection projection for single partner profile view (/partner-hospitals/[slug]),
 * mutations, and full detail views.
 */
export const PARTNER_FULL_SELECT_FIELDS = {
  id: true,
  slug: true,
  name: true,
  category: true,
  address: true,
  discount: true,
  phone: true,
  email: true,
  logoText: true,
  mapLink: true,
  imageUrl: true,
  emergencyPhone: true,
  ambulancePhone: true,
  workingHours: true,
  departmentDiscounts: true,
  socialLinks: true,
  facilities: true,
  galleryImages: true,
  upazila: true,
  createdAt: true,
} as const;

export const PARTNER_SELECT_FIELDS = PARTNER_FULL_SELECT_FIELDS;

/**
 * Lightweight directory projection (TODO-203).
 * Strips heavy JSON strings (facilities, galleryImages, departmentDiscounts,
 * socialLinks, workingHours, mapLink) when querying partners for the public
 * directory cards, homepage, and related partner lists to cut network egress by 60-80%.
 */
export const PARTNER_CARD_SELECT_FIELDS = {
  id: true,
  slug: true,
  name: true,
  category: true,
  address: true,
  discount: true,
  phone: true,
  email: true,
  logoText: true,
  imageUrl: true,
  emergencyPhone: true,
  ambulancePhone: true,
  upazila: true,
  createdAt: true,
} as const;

/**
 * Admin bulk query projection.
 * Omits heavy imageUrl base64 data transfer while providing table metadata.
 */
export const PARTNER_ADMIN_SELECT_FIELDS = {
  id: true,
  slug: true,
  name: true,
  category: true,
  address: true,
  discount: true,
  phone: true,
  email: true,
  logoText: true,
  mapLink: true,
  emergencyPhone: true,
  ambulancePhone: true,
  workingHours: true,
  departmentDiscounts: true,
  socialLinks: true,
  facilities: true,
  galleryImages: true,
  upazila: true,
  createdAt: true,
} as const;

export type PrismaPartnerRecord = {
  id: string;
  slug?: string | null;
  name: string;
  category: string;
  address: string;
  discount: string;
  phone: string;
  email?: string | null;
  logoText: string;
  mapLink?: string | null;
  imageUrl?: string | null;
  emergencyPhone?: string | null;
  ambulancePhone?: string | null;
  workingHours?: string | null;
  departmentDiscounts?: string | null;
  socialLinks?: string | null;
  facilities?: string | null;
  galleryImages?: string | null;
  upazila?: string | null;
  createdAt?: Date | string | null;
};

/**
 * Pure sync helper to format Prisma Partner records into the unified Partner interface.
 */
export function formatPartner(p: PrismaPartnerRecord): Partner {
  return {
    id: p.id,
    slug: p.slug || undefined,
    name: p.name,
    category: p.category as Partner["category"],
    address: p.address,
    discount: p.discount,
    phone: p.phone,
    email: p.email || undefined,
    logoText: p.logoText,
    mapLink: p.mapLink || undefined,
    imageUrl: p.imageUrl || undefined,
    emergencyPhone: p.emergencyPhone || undefined,
    ambulancePhone: p.ambulancePhone || undefined,
    workingHours: p.workingHours || undefined,
    departmentDiscounts: p.departmentDiscounts || undefined,
    socialLinks: p.socialLinks || undefined,
    facilities: p.facilities || undefined,
    galleryImages: p.galleryImages || undefined,
    upazila: p.upazila || "feni-sadar",
    createdAt: p.createdAt
      ? typeof p.createdAt === "string"
        ? p.createdAt
        : p.createdAt.toISOString()
      : undefined,
  };
}
