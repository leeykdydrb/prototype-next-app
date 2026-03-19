import { CodeData } from "./code";

export interface PermissionData {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  categoryId: number;
  category: CodeData;
  isSystem: boolean;
  isActive: boolean;
}

export type PermissionInput = Omit<PermissionData, "id" | "category">;

export interface PermissionStatsProps {
  total: number;
  active: number;
  inactive: number;
  system: number;
}

export interface PermissionSearchParams {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
}

export interface PermissionSearchFilters {
  search: string;
  categoryId?: string;
  isActive: string;
}

export interface PermissionFilterProps {
  filters: PermissionSearchFilters;
  onFilterChange: (key: keyof PermissionSearchFilters, value: string) => void;
  onClearFilters: () => void;
}

export interface PermissionListProps {
  permissions: PermissionData[];
  onEdit: (permission: PermissionData) => void;
  onDelete: (permission: PermissionData) => void;
  onToggle: (permission: PermissionData) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  totalCount: number;
}

export interface PermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PermissionInput) => void;
  permission: PermissionData | null;
  categories: CodeData[]
}