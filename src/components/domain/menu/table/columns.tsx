"use client";

import { Badge } from "@/components/framework/data-display";
import { Button, Switch } from "@/components/framework/form";
import { 
  Edit as EditIcon, 
  Trash2 as DeleteIcon,
  ArrowUpDown,
  GripVertical as GripVerticalIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { MenuData, MenuTree } from "@/types/menu";

export type MenuColumnId = "menuName" | "path" | "icon" | "order" | "isSystem" | "isActive" | "actions";

export interface CreateMenuColumnsDeps {
  onEdit: (menu: MenuData) => void;
  onToggle: (menu: MenuData) => void;
  onDeleteClick: (menu: MenuData) => void;
  labels: Record<MenuColumnId, string>;
  systemBadge: string;
}

export function createMenuColumns({
  onEdit,
  onToggle,
  onDeleteClick,
  labels,
  systemBadge,
}: CreateMenuColumnsDeps): ColumnDef<MenuTree>[] {
  return [
    {
      id: "expander",
      header: labels.menuName,
      cell: ({ row }) => {
        const hasChildren = Boolean(row.original.children?.length);
        const isExpanded = row.getIsExpanded();
        const level = row.depth;

        return (
          <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
            {/* 들여쓰기와 아이콘 */}
            {level > 0 && (
              <GripVerticalIcon className="h-4 w-4 text-muted-foreground mr-2" />
            )}
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 mr-2"
                onClick={() => row.toggleExpanded()}
              >
                {isExpanded ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </Button>
            )}
            <span className={`text-sm ${level === 0 ? "font-semibold" : "font-normal"}`}>
              {row.original.title}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "path",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            {labels.path}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {(getValue() as string) || "-"}
        </span>
      ),
    },
    {
      accessorKey: "icon",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            {labels.icon}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => (
        <span className="text-sm text-center">{(getValue() as string) || "-"}</span>
      ),
    },
    {
      accessorKey: "order",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            {labels.order}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => (
        <span className="text-sm text-center">{getValue() as number}</span>
      ),
    },
    {
      accessorKey: "isSystem",
      header: labels.isSystem,
      cell: ({ getValue }) => (
        <div className="text-center">
          {getValue() as boolean && (
            <Badge variant="secondary" className="text-xs">
              {systemBadge}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: labels.isActive,
      cell: ({ row }) => (
        <div className="text-center">
          <Switch
            checked={row.original.isActive}
            onCheckedChange={() => onToggle(row.original)}
            disabled={row.original.isSystem || (row.original.children && row.original.children.length > 0)}
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
            disabled={row.original.isSystem || (row.original.children && row.original.children.length > 0)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <DeleteIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}


