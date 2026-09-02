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
