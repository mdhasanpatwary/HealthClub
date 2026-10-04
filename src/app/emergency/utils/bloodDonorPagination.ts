import { BloodDonor, UPAZILAS_FENI } from "@/data/emergencyData";

export interface PaginateBloodDonorsOptions {
  page?: number;
  pageSize?: number;
  group?: string;
  bloodGroup?: string;
  upazila?: string;
  search?: string;
}

export interface PaginatedBloodDonorsResult {
  donors: BloodDonor[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const DEFAULT_DONOR_PAGE_SIZE = 12;

/**
 * Normalizes blood group string handling '+' which might be decoded as space ' ' in URL query strings.
 */
export function normalizeBloodGroup(group?: string): string {
  if (!group) return "all";
  if (group.endsWith(" ") || /\s+$/.test(group)) {
    return group.trim() + "+";
  }
  return group.trim();
}

/**
 * Filter and paginate blood donors deterministically for server-side rendering.
 */
export function paginateBloodDonors(
  allDonors: BloodDonor[],
  options: PaginateBloodDonorsOptions = {}
): PaginatedBloodDonorsResult {
  const pageSize = Math.max(1, options.pageSize || DEFAULT_DONOR_PAGE_SIZE);
  const rawPage = Math.max(1, options.page || 1);
  const rawGroupInput = options.bloodGroup || options.group || "all";
  const selectedGroup = normalizeBloodGroup(rawGroupInput);
  const selectedUpazila = (options.upazila || "all").trim();
  const query = options.search?.trim().toLowerCase() || "";

  // 1. Filter blood donors
  const filtered = allDonors.filter((donor) => {
    // Only approved/available donors (skip pending)
    if (donor.status === "pending") return false;

    // Blood group match
    if (selectedGroup !== "all" && selectedGroup !== "") {
      if (donor.bloodGroup.toLowerCase() !== selectedGroup.toLowerCase()) {
        return false;
      }
    }

    // Upazila match (matches both upazila ID like 'feni-sadar' and Bengali name like 'ফেনী সদর')
    if (selectedUpazila !== "all" && selectedUpazila !== "") {
      const targetUpazilaObj = UPAZILAS_FENI.find(
        (u) =>
          u.id.toLowerCase() === selectedUpazila.toLowerCase() ||
          u.nameBn === selectedUpazila ||
          u.nameEn.toLowerCase() === selectedUpazila.toLowerCase()
      );

      const donorUpazila = donor.upazila.trim().toLowerCase();
      const matchId = targetUpazilaObj ? donorUpazila === targetUpazilaObj.id.toLowerCase() : false;
      const matchNameBn = targetUpazilaObj ? donor.upazila === targetUpazilaObj.nameBn : false;
      const matchDirect = donorUpazila === selectedUpazila.toLowerCase();

      if (!matchId && !matchNameBn && !matchDirect) {
        return false;
      }
    }

    // Search query match (name, phone, blood group, or upazila name)
    if (query) {
      const nameMatch = donor.name.toLowerCase().includes(query);
      const phoneMatch = donor.phone.includes(query);
      const groupMatch = donor.bloodGroup.toLowerCase().includes(query);

      // Also check if query matches donor's upazila name
      const donorUpazilaObj = UPAZILAS_FENI.find(
        (u) => u.id === donor.upazila || u.nameBn === donor.upazila
      );
      const upazilaBnMatch = donorUpazilaObj?.nameBn.toLowerCase().includes(query) ?? false;
      const upazilaEnMatch = donorUpazilaObj?.nameEn.toLowerCase().includes(query) ?? false;

      if (!nameMatch && !phoneMatch && !groupMatch && !upazilaBnMatch && !upazilaEnMatch) {
        return false;
      }
    }

    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(rawPage, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const donors = filtered.slice(startIndex, endIndex);

  return {
    donors,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
  };
}
