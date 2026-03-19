export interface MenuData {
  id: number;
  title: string;
  path: string | null;
  icon: string | null;
  order: number;
  parentId: number | null;
  isActive: boolean;
  isSystem: boolean;
  permissionIds: number[];
  permissionNames?: string[]; // Keycloak용: 권한 이름 배열
}

export interface MenuTree extends MenuData {
  children?: MenuTree[];
}

export type MenuInput = Omit<MenuData, "id">;

export interface MenuStatsProps {
  total: number;
  active: number;
  inactive: number;
  system: number;
}

export interface MenuSearchParams {
  search?: string;
  isActive?: boolean;
}

export interface MenuSearchFilters {
  search: string;
  isActive: string;
}

export interface MenuFilterProps {
  filters: MenuSearchFilters;
  onFilterChange: (key: keyof MenuSearchFilters, value: string) => void;
  onClearFilters: () => void;
}

export interface MenuListProps {
  menus: MenuData[];
  onEdit: (menu: MenuData) => void;
  onDelete: (menu: MenuData) => void;
  onToggle: (menu: MenuData) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  totalCount: number;
}

export interface MenuDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MenuInput) => void;
  menu: MenuTree | null;
  menus: MenuTree[];
}
