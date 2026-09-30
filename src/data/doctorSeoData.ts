import { DepartmentSeoConfig } from "./departments/types";
import { generalCareDepartments } from "./departments/generalCare";
import { maternalHealthDepartments } from "./departments/maternalHealth";
import { surgicalCareDepartments } from "./departments/surgicalCare";
import { internalSpecialtiesDepartments } from "./departments/internalSpecialties";

export type { DepartmentSeoConfig };

export const DOCTOR_DEPARTMENTS_SEO: Record<string, DepartmentSeoConfig> = {
  ...generalCareDepartments,
  ...maternalHealthDepartments,
  ...surgicalCareDepartments,
  ...internalSpecialtiesDepartments,
};

/**
 * Returns SEO configuration for a specific department id.
 */
export function getDepartmentSeoConfig(departmentId?: string | null): DepartmentSeoConfig | null {
  if (!departmentId || departmentId === "all" || departmentId === "other") {
    return null;
  }
  return DOCTOR_DEPARTMENTS_SEO[departmentId] || null;
}

/**
 * Returns list of all indexed department slugs for sitemap and landing links.
 */
export function getAllDepartmentSlugs(): string[] {
  return Object.keys(DOCTOR_DEPARTMENTS_SEO);
}

export interface DoctorMetadataSource {
  name: string;
  nameEn?: string | null;
  specialty: string;
  degrees?: string | null;
  designation?: string | null;
  chamberName?: string | null;
  chamberAddress?: string | null;
  visitingDays?: string | null;
  visitingHours?: string | null;
  serialPhone?: string | null;
  department?: string | null;
}

/**
 * Generates high-converting local intent meta title for individual doctor profiles.
 * Pattern: "{Name} - {Specialty} | চেম্বার, ভিজিটিং সময় ও সিরিয়াল ফেনী"
 */
export function formatDoctorMetaTitle(name: string, specialty: string): string {
  const cleanName = (name || "").trim();
  const cleanSpecialty = (specialty || "").trim();
  return `${cleanName} - ${cleanSpecialty} | চেম্বার, ভিজিটিং সময় ও সিরিয়াল ফেনী`;
}

/**
 * Generates localized intent meta description for individual doctor profiles.
 */
export function formatDoctorMetaDescription(doc: DoctorMetadataSource): string {
  const parts: string[] = [];
  const degreePart = doc.degrees ? `, ${doc.degrees.trim()}` : "";
  parts.push(`${doc.name.trim()}, ${doc.specialty.trim()}${degreePart}।`);

  if (doc.chamberName) {
    const addr = doc.chamberAddress ? `, ${doc.chamberAddress.trim()}` : "";
    parts.push(`চেম্বার: ${doc.chamberName.trim()}${addr}।`);
  }

  if (doc.visitingDays || doc.visitingHours) {
    const days = doc.visitingDays?.trim() || "";
    const hours = doc.visitingHours?.trim() ? ` (${doc.visitingHours.trim()})` : "";
    parts.push(`রোগী দেখার সময় ও শিডিউল: ${days}${hours}।`);
  }

  if (doc.serialPhone) {
    parts.push(`ফেনীতে সরাসরি সিরিয়াল নিতে কল করুন: ${doc.serialPhone.trim()}।`);
  }

  return parts.join(" ");
}

/**
 * Generates comprehensive localized search keywords for doctor profiles.
 */
export function generateDoctorKeywords(doc: DoctorMetadataSource): string[] {
  const cleanName = doc.name.trim();
  const cleanSpec = doc.specialty.trim();
  const chamber = doc.chamberName?.trim() || "";

  const keywords: string[] = [
    cleanName,
    cleanSpec,
    `${cleanName} চেম্বার ফেনী`,
    `${cleanName} সিরিয়াল`,
    `${cleanName} serial`,
    `${cleanName} chamber`,
    `${cleanName} feni`,
    `${cleanName} visiting time`,
    `${cleanSpec} ডাক্তার ফেনী`,
    `ফেনীতে ${cleanSpec} বিশেষজ্ঞ`,
    "ফেনী ডাক্তার সিরিয়াল নাম্বার",
    "feni doctor serial number",
    "feni specialist doctors",
    "ফেনী ডাক্তার",
    "ফেনীর বিশেষজ্ঞ ডাক্তার",
    "Health Club doctor directory",
  ];

  if (doc.nameEn && doc.nameEn.trim()) {
    const cleanNameEn = doc.nameEn.trim();
    keywords.push(
      cleanNameEn,
      `${cleanNameEn} Feni`,
      `${cleanNameEn} doctor`,
      `${cleanNameEn} serial`,
      `${cleanNameEn} appointment`,
      `${cleanNameEn} chamber`,
      `${cleanNameEn} visiting time`
    );
    if (chamber) {
      keywords.push(`${cleanNameEn} ${chamber}`);
    }
  }

  if (doc.department) {
    keywords.push(doc.department);
  }

  if (chamber) {
    keywords.push(chamber);
    keywords.push(`${chamber} ডাক্তার সিরিয়াল`);
    keywords.push(`${chamber} Feni`);
  }

  return Array.from(new Set(keywords));
}

export {
  generateDoctorQuickSummary,
  generateDoctorProfileFaqs,
} from "./doctorFaqData";
export type { DoctorFaqItem } from "./doctorFaqData";

