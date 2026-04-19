"use client";

import { Badge } from "@/components/framework/data-display";
import { Button, Switch } from "@/components/framework/form";
import { Edit as EditIcon, Trash2 as DeleteIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PermissionData } from "@/types/permission";

export type PermissionColumnId = "name" | "displayName" | "description" | "isSystem" | "isActive" | "actions";

export interface CreatePermissionColumnsDeps {
  onEdit: (permission: PermissionData) => void;
  onToggle: (permission: PermissionData) => void;
  onDeleteClick: (permission: PermissionData) => void;
  labels: Record<PermissionColumnId, string>;
  systemBadge: string;
}

export function createPermissionColumns({
  onEdit,
  onToggle,
  onDeleteClick,
  labels,
  systemBadge,
}: CreatePermissionColumnsDeps): ColumnDef<PermissionData>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: labels.name,
      cell: ({ row }) => (
        <span className="text-sm font-mono">{row.getValue("name")}</span>
      ),
    },
    {
      id: "displayName",
      accessorKey: "displayName",
      header: labels.displayName,
      cell: ({ row }) => row.getValue("displayName"),
    },
    {
      id: "description",
      accessorKey: "description",
      header: labels.description,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {row.getValue("description")}
        </span>
      ),
    },
    {
      id: "isSystem",
      accessorKey: "isSystem",
      header: labels.isSystem,
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("isSystem") ? (
            <Badge variant="secondary" className="text-xs">
              {systemBadge}
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      id: "isActive",
      accessorKey: "isActive",
      header: labels.isActive,
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
      header: labels.actions,
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


