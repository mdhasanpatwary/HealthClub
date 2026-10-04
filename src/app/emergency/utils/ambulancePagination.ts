import { AmbulanceService, AMBULANCE_TYPES } from "@/data/emergencyData";

export interface PaginateAmbulancesOptions {
  page?: number;
  pageSize?: number;
  type?: string;
  search?: string;
}

export interface PaginatedAmbulancesResult {
  ambulances: AmbulanceService[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  counts: Record<string, number>;
}

export const DEFAULT_AMBULANCE_PAGE_SIZE = 8;

/**
 * Filter and paginate ambulances deterministically for server-side rendering.
 */
export function paginateAmbulances(
  allAmbulances: AmbulanceService[],
  options: PaginateAmbulancesOptions = {}
): PaginatedAmbulancesResult {
  const pageSize = Math.max(1, options.pageSize || DEFAULT_AMBULANCE_PAGE_SIZE);
  const rawPage = Math.max(1, options.page || 1);
  const selectedType = (options.type || "all").trim();
  const query = options.search?.trim().toLowerCase() || "";

  // 1. Calculate counts across all approved ambulances
  const counts: Record<string, number> = { all: 0 };
  const approved = allAmbulances.filter((amb) => {
    if (amb.status === "pending") return false;
    counts.all = (counts.all || 0) + 1;
    counts[amb.type] = (counts[amb.type] || 0) + 1;
    return true;
  });

  // 2. Filter ambulances
  const filtered = approved.filter((amb) => {
    // Type filter
    if (selectedType !== "all" && selectedType !== "") {
      if (amb.type.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }
    }

    // Search query match (name, phone, location, type, or Bengali type label)
    if (query) {
      const nameMatch = amb.name.toLowerCase().includes(query);
      const phoneMatch = amb.phone.includes(query);
      const locationMatch = amb.location.toLowerCase().includes(query);
      const typeMatch = amb.type.toLowerCase().includes(query);

      const typeConfig = AMBULANCE_TYPES.find((t) => t.id === amb.type);
      const typeBnMatch = typeConfig
        ? typeConfig.nameBn.toLowerCase().includes(query) ||
          typeConfig.shortBn.toLowerCase().includes(query)
        : false;

      if (!nameMatch && !phoneMatch && !locationMatch && !typeMatch && !typeBnMatch) {
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
  const ambulances = filtered.slice(startIndex, endIndex);

  return {
    ambulances,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    counts,
  };
}
