import type { RoleData } from "./role";

export interface UserData {
  id: string;
  name: string;
  email: string;
  isSystem: boolean;
  isActive: boolean;
  role: {
    id: number;
    name: string;
    displayName: string;
  };
  profile?: {
    id: number;
    bio: string;
  } | null;
  userPermissions: {
    id: number;
    userId: string;
    permissionId: number;
    granted: boolean;
    permission: {
      id: number;
      name: string;
      displayName: string;
      category: {
        id: number;
        code: string;
        codeName: string;
      };
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  id: string;
  name: string;
  email: string;
  isSystem: boolean;
  isActive: boolean;
  password?: string; // 선택적으로 변경
  roleId: number;
  bio?: string | null; // 선택적으로 변경
  permissionIds?: number[]; // 선택적으로 변경
}

export interface UserStatsProps {
  total: number;
  active: number;
  inactive: number;
  system: number;
}

export interface UserSearchParams {
  search?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface UserSearchFilters {
  search: string;
  roleId: string;
  isActive: string;
}

export interface UserListProps {
  users: UserData[];
  onEdit: (user: UserData) => void;
  onDelete: (user: UserData) => void;
  onToggle: (user: UserData) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  totalCount: number;
}

export interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: UserInput) => void;
  user: UserData | null;
  roles: RoleData[];
}
