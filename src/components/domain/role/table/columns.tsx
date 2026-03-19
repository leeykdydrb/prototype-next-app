"use client";

import { Badge } from "@/components/framework/data-display";
import { Button, Switch } from "@/components/framework/form";
import { ArrowUpDown, Edit, Trash2 as DeleteIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { RoleData } from "@/types/role";

export const columnHeaders: Record<string, string> = {
  name: "역할명",
  displayName: "표시명",
  description: "설명",
  permissionCount: "권한 수",
  userCount: "사용자 수",
  isSystem: "시스템 역할",
  isActive: "상태",
  actions: "작업",
};

export interface CreateRoleColumnsDeps {
  onEdit: (role: RoleData) => void;
  onToggle: (role: RoleData) => void;
  onDeleteClick: (role: RoleData) => void;
}

export function createRoleColumns({
  onEdit,
  onToggle,
  onDeleteClick,
}: CreateRoleColumnsDeps): ColumnDef<RoleData>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          {columnHeaders.name}
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm font-semibold">{row.getValue("name")}</span>
      ),
    },
    {
      id: "displayName",
      accessorKey: "displayName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          {columnHeaders.displayName}
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => row.getValue("displayName") as React.ReactNode,
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
      id: "permissionCount",
      accessorKey: "rolePermissions",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          {columnHeaders.permissionCount}
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            {row.original.rolePermissions?.length || 0}개
          </Badge>
        </div>
      ),
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.rolePermissions?.length || 0;
        const b = rowB.original.rolePermissions?.length || 0;
        return a - b;
      },
    },
    {
      id: "userCount",
      accessorKey: "_count",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          {columnHeaders.userCount}
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="default" className="text-xs">
            {row.original._count?.users || 0}명
          </Badge>
        </div>
      ),
      sortingFn: (rowA, rowB) => {
        const a = rowA.original._count?.users || 0;
        const b = rowB.original._count?.users || 0;
        return a - b;
      },
    },
    {
      id: "isSystem",
      accessorKey: "isSystem",
      header: columnHeaders.isSystem,
      cell: ({ row }) => (
        <div>
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
        <Switch
          checked={row.getValue("isActive")}
          disabled={row.getValue("isSystem")}
          onCheckedChange={() => onToggle(row.original)}
        />
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
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteClick(row.original)}
            disabled={row.getValue("isSystem") || (row.original._count?.users || 0) > 0}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <DeleteIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}


