import { Doctor } from "@/services/db";
import { detectUpazilaFromText } from "@/data/feniLocations";

/**
 * Full selection projection for single doctor profile view (/consultants/[slug]),
 * mutations, and full detail views.
 */
export const DOCTOR_FULL_SELECT_FIELDS = {
  id: true,
  slug: true,
  name: true,
  specialty: true,
  department: true,
  degrees: true,
  designation: true,
  chamberName: true,
  chamberAddress: true,
  roomNo: true,
  visitingDays: true,
  visitingHours: true,
  serialPhone: true,
  consultationFee: true,
  imageUrl: true,
  partnerId: true,
  upazila: true,
  isActive: true,
  availableToday: true,
  onLeaveUntil: true,
  notice: true,
  createdAt: true,
} as const;

/**
 * Lightweight directory projection (TODO-220, TODO-223).
 * Strips heavy uncompressed text columns (degrees, notice, onLeaveUntil, createdAt)
 * and imageUrl (which may contain large base64 data) when querying doctors for
 * public directory cards, department lists, related doctors, and partner hospital
 * rosters to cut network wire payload by 50-70%.
 * imageUrl is loaded on-demand in DOCTOR_FULL_SELECT_FIELDS (getDoctorByIdAction)
 * for single profile pages and the details modal.
 */
export const DOCTOR_CARD_SELECT_FIELDS = {
  id: true,
  slug: true,
  name: true,
  specialty: true,
  department: true,
  designation: true,
  chamberName: true,
  chamberAddress: true,
  roomNo: true,
  visitingDays: true,
  visitingHours: true,
  serialPhone: true,
  consultationFee: true,
  partnerId: true,
  upazila: true,
  isActive: true,
  availableToday: true,
} as const;

/**
 * Default projection for directory listing queries.
 * Aliased to DOCTOR_CARD_SELECT_FIELDS for wire protocol trimming across all list queries.
 */
export const DOCTOR_SELECT_FIELDS = DOCTOR_CARD_SELECT_FIELDS;

export const DOCTOR_ADMIN_SELECT_FIELDS = {
  ...DOCTOR_FULL_SELECT_FIELDS,
  // Note: imageUrl omitted from admin bulk queries to prevent heavy base64 data transfer
  imageUrl: false,
} as const;

export type PrismaDoctorRecord = {
  id: string;
  slug?: string | null;
  name: string;
  specialty: string;
  department: string;
  degrees?: string | null;
  designation: string;
  chamberName: string;
  chamberAddress: string;
  roomNo?: string | null;
  visitingDays: string;
  visitingHours: string;
  serialPhone: string;
  consultationFee?: string | null;
  imageUrl?: string | null;
  partnerId?: string | null;
  upazila?: string | null;
  isActive: boolean;
  availableToday?: boolean | null;
  onLeaveUntil?: Date | string | null;
  notice?: string | null;
  createdAt?: Date | string | null;
};

// Pure sync helper to format Prisma Doctor record to Doctor interface
export function formatDoctor(d: PrismaDoctorRecord): Doctor {
  return {
    id: d.id,
    slug: d.slug || undefined,
    name: d.name,
    specialty: d.specialty,
    department: d.department,
    degrees: d.degrees || "",
    designation: d.designation,
    chamberName: d.chamberName,
    chamberAddress: d.chamberAddress,
    roomNo: d.roomNo || undefined,
    visitingDays: d.visitingDays,
    visitingHours: d.visitingHours,
    serialPhone: d.serialPhone,
    consultationFee: d.consultationFee || undefined,
    imageUrl: d.imageUrl
      ? d.imageUrl.startsWith("/images/doctors/ddlab_doc_")
        ? d.imageUrl.replace(/\.(png|jpg)$/, ".webp")
        : d.imageUrl
      : undefined,
    partnerId: d.partnerId || undefined,
    upazila: d.upazila || (d.chamberAddress ? detectUpazilaFromText(d.chamberAddress) : undefined) || "feni-sadar",
    isActive: d.isActive,
    availableToday: d.availableToday ?? true,
    onLeaveUntil: d.onLeaveUntil
      ? typeof d.onLeaveUntil === "string"
        ? d.onLeaveUntil
        : d.onLeaveUntil.toISOString().slice(0, 10)
      : undefined,
    notice: d.notice || undefined,
    createdAt: d.createdAt
      ? typeof d.createdAt === "string"
        ? d.createdAt
        : d.createdAt.toISOString()
      : undefined,
  };
}
