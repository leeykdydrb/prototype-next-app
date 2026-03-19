import { CodeGroupData } from "./code-group";

export interface CodeData {
  id: number;
  code: string;
  codeName: string;
  description: string | null;
  sortOrder: number;
  groupId: number;
  group: CodeGroupData;
  // group: { 
  //   id: number,
  //   groupCode: string,
  //   groupName: string,
  //   description: string | null,
  //   isActive: boolean,
  //   isSystem: boolean
  // };
  isActive: boolean;
  isSystem: boolean;
}

export type CodeInput = Omit<CodeData, "id" | "group">;

export interface CodeSearchParams {
  search?: string;
  groupId?: number;
  groupCode?: string;
  // code?: number;
  isActive?: boolean;
}

export interface CodeSearchFilters {
  search: string;
  groupId: string;
  isActive: string;
}

export interface CodeFilter {
  search?: string;
  groupId?: number | null;
  isActive?: boolean | null;
}

export interface CodeListProps {
  codes: CodeData[];
  onEdit: (code: CodeData) => void;
  onDelete: (code: CodeData) => void;
  onToggle: (code: CodeData) => void;
}

export interface CodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CodeInput) => void;
  code: CodeData | null;
  selectedGroupId?: number | null;
}