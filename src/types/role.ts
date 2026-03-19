export interface RoleData {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  _count: { users: number };
  rolePermissions: {
    id: number;
    roleId: number;
    createdAt: Date;
    permissionId: number;
    // permission: {
    //   id: number;
    //   name: string;
    //   displayName: string;
    //   description: string | null;
    //   category: string | null;
    //   isSystem: boolean;
    //   isActive: boolean;
    // };
  }[];
}

// export type RoleInput = Omit<RoleData, "id">;

export interface RoleInput {
  name: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  permissionIds: number[];
}

export interface RoleStatsProps {
  total: number;
  active: number;
  inactive: number;
  system: number;
}

export interface RoleSearchParams {
  search?: string;
  isActive?: boolean;
}

export interface RoleSearchFilters {
  search: string;
  isActive: string;
}

export interface RoleListProps {
  roles: RoleData[];
  onEdit: (role: RoleData) => void;
  onDelete: (role: RoleData) => void;
  onToggle: (role: RoleData) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  totalCount: number;
}

export interface RoleDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: RoleInput) => void;
  role: RoleData | null;
}