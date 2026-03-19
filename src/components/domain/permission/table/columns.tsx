"use client";

import { Badge } from "@/components/framework/data-display";
import { Button, Switch } from "@/components/framework/form";
import { Edit as EditIcon, Trash2 as DeleteIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PermissionData } from "@/types/permission";

export const columnHeaders: Record<string, string> = {
  name: '권한명',
  displayName: '표시명',
  description: '설명',
  isSystem: '시스템 권한',
  isActive: '상태',
  actions: '작업'
};

export interface CreatePermissionColumnsDeps {
  onEdit: (permission: PermissionData) => void;
  onToggle: (permission: PermissionData) => void;
  onDeleteClick: (permission: PermissionData) => void;
}

export function createPermissionColumns({
  onEdit,
  onToggle,
  onDeleteClick,
}: CreatePermissionColumnsDeps): ColumnDef<PermissionData>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: columnHeaders.name,
      cell: ({ row }) => (
        <span className="text-sm font-mono">{row.getValue("name")}</span>
      ),
    },
    {
      id: "displayName",
      accessorKey: "displayName",
      header: columnHeaders.displayName,
      cell: ({ row }) => row.getValue("displayName"),
    },
    {
      id: "description",
      accessorKey: "description",
      header: columnHeaders.description,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {row.getValue("description")}
        </span>
      ),
    },
    {
      id: "isSystem",
      accessorKey: "isSystem",
      header: columnHeaders.isSystem,
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("isSystem") ? (
            <Badge variant="secondary" className="text-xs">
              시스템
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      id: "isActive",
      accessorKey: "isActive",
      header: columnHeaders.isActive,
      cell: ({ row }) => (
        <div className="text-center">
          <Switch
            checked={row.getValue("isActive")}
            disabled={row.getValue("isSystem")}
            onCheckedChange={() => onToggle(row.original)}
          />
        </div>
      ),
    },
    {
      id: "actions",
      header: columnHeaders.actions,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row.original)}
            className="h-8 w-8 p-0"
          >
            <EditIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteClick(row.original)}
            disabled={row.getValue("isSystem")}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <DeleteIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}


