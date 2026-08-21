export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface BasePaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}
