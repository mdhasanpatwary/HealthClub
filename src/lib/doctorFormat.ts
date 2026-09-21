import { Doctor } from "@/services/db";
import { detectUpazilaFromText } from "@/data/feniLocations";

export const DOCTOR_SELECT_FIELDS = {
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

export const DOCTOR_ADMIN_SELECT_FIELDS = {
  ...DOCTOR_SELECT_FIELDS,
  // Note: imageUrl omitted from admin bulk queries to prevent heavy base64 data transfer
  imageUrl: false,
} as const;

export type PrismaDoctorRecord = {
  id: string;
  slug?: string | null;
  name: string;
  specialty: string;
  department: string;
  degrees: string;
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
    degrees: d.degrees,
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
