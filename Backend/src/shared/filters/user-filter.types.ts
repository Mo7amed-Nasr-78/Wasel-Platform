export interface UserQueryParams {
  search?: string;
  role?: string;
  isActive?: boolean;
  verify?: boolean;
  companyName?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface UserFilterResult {
  where: Record<string, any>;
  orderBy: Record<string, any>;
  skip: number | undefined;
  take: number | undefined;
}