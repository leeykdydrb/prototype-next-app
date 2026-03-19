import { CodeData } from "./code";

export interface CodeGroupData {
  id: number;
  groupCode: string;
  groupName: string;
  description: string | null;
  parentId: number | null;
  isActive: boolean;
  isSystem: boolean;
  codes?: CodeData[];
  _count?: {
    codes: number;
  };
}

export interface CodeGroupTree extends CodeGroupData {
  children?: CodeGroupTree[];
}

export interface CodeGroupInput {
  groupCode: string;
  groupName: string;
  description: string | null;
  parentId: number | null;
  isActive: boolean;
  isSystem: boolean;
}

export interface CodeGroupFilter {
  search?: string;
  isActive?: boolean | null;
}

export interface CodeGroupSearchFilters {
  search: string;
  isActive: string;
}

export interface CodeGroupListProps {
  codeGroups: CodeGroupData[];
  selectedCodeGroup: CodeGroupData | null;
  onSelectCodeGroup: (group: CodeGroupData) => void;
  onEdit: (group: CodeGroupData) => void;
  onDelete: (group: CodeGroupData) => void;
  onToggle: (group: CodeGroupData) => void;
}

export interface CodeGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CodeGroupInput) => void;
  codeGroup: CodeGroupData | null;
  codeGroups: CodeGroupTree[];
}