"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/framework/form";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/framework/data-display";
import { Card, CardHeader, CardContent } from "@/components/framework/layout";
import { DropdownMenuComponents } from "@/components/framework";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ExpandedState,
} from "@tanstack/react-table";
import { Columns as ColumnsIcon, ChevronDown as ChevronDownIcon, AlertTriangle as WarningIcon } from "lucide-react";
import type { MenuListProps, MenuData, MenuTree } from "@/types/menu";
import TablePagination from "@/components/common/TablePagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { createMenuColumns, type MenuColumnId } from "./table/columns";

const MenuList = React.memo(function MenuList({
  menus,
  onEdit,
  onDelete,
  onToggle,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
}: MenuListProps) {
  const tList = useTranslations("AdminMenus.list");
  const tCols = useTranslations("AdminMenus.list.columns");

  const labels = useMemo(
    () =>
      ({
        menuName: tCols("menuName"),
        path: tCols("path"),
        icon: tCols("icon"),
        order: tCols("order"),
        isSystem: tCols("isSystem"),
        isActive: tCols("isActive"),
        actions: tCols("actions"),
      }) satisfies Record<MenuColumnId, string>,
    [tCols],
  );

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    menu: MenuData | null;
  }>({ open: false, menu: null });

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({ pageIndex: page, pageSize: rowsPerPage });

  const handleDeleteClick = useCallback((menu: MenuData) => {
    setDeleteDialog({ open: true, menu });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.menu) {
      onDelete(deleteDialog.menu);
      setDeleteDialog({ open: false, menu: null });
    }
  }, [deleteDialog.menu, onDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog({ open: false, menu: null });
  }, []);

  // 컬럼 정의
  const columns = useMemo(() => (
    createMenuColumns({
      onEdit,
      onToggle,
      onDeleteClick: handleDeleteClick,
      labels,
      systemBadge: tList("systemBadge"),
    })
  ), [onEdit, onToggle, handleDeleteClick, labels, tList]);

  // tanstack/react-table 설정
  const table = useReactTable({
    data: menus,
    columns,
    state: {
      expanded,
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getSubRows: (row) => (row as MenuTree).children,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / rowsPerPage),
  });

  // 페이지네이션 변경 핸들러
  React.useEffect(() => {
    if (pagination.pageIndex !== page) onPageChange(pagination.pageIndex);
    if (pagination.pageSize !== rowsPerPage) onRowsPerPageChange(pagination.pageSize);
  }, [pagination, page, rowsPerPage, onPageChange, onRowsPerPageChange]);

  return (
    <>
      <Card className="py-4">
        <CardHeader title={tList("cardTitle")}>
          <div className="flex items-center gap-2">
            <DropdownMenuComponents.Root>
              <DropdownMenuComponents.Trigger asChild>
                <Button variant="outline" size="sm">
                  <ColumnsIcon />
                  <span className="hidden lg:inline">{tList("columnSettings")}</span>
                  <span className="lg:hidden">{tList("columnSettingsShort")}</span>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuComponents.Trigger>
              <DropdownMenuComponents.Content align="end">
                {table
                  .getAllLeafColumns()
                  .filter((column) => column.id !== "expander")
                  .map((column) => {
                    return (
                      <DropdownMenuComponents.CheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {(labels as Record<string, string>)[column.id] || column.id}
                      </DropdownMenuComponents.CheckboxItem>
                    );
                  })}
              </DropdownMenuComponents.Content>
            </DropdownMenuComponents.Root>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      className="data-[name=expander]:w-60 data-[name=path]:w-40 data-[name=icon]:w-20 data-[name=order]:w-20 data-[name=isSystem]:w-24 data-[name=isActive]:w-20 data-[name=actions]:w-24 data-[name=expander]:text-left data-[name=path]:text-left data-[name=icon]:text-center data-[name=order]:text-center data-[name=isSystem]:text-center data-[name=isActive]:text-center data-[name=actions]:text-center"
                      data-name={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    {tList("empty")}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        className="data-[name=expander]:w-60 data-[name=path]:w-40 data-[name=icon]:w-20 data-[name=order]:w-20 data-[name=isSystem]:w-24 data-[name=isActive]:w-20 data-[name=actions]:w-24 data-[name=expander]:text-left data-[name=path]:text-left data-[name=icon]:text-center data-[name=order]:text-center data-[name=isSystem]:text-center data-[name=isActive]:text-center data-[name=actions]:text-center"
                        data-name={cell.column.id}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination table={table} totalCount={totalCount} />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={tList("deleteDialogTitle")}
        content={
          <div className="space-y-2">
            <p>{tList("deleteConfirm", { name: deleteDialog.menu?.title ?? "" })}</p>
            <p className="text-sm text-muted-foreground">{tList("deleteIrreversible")}</p>
          </div>
        }
        confirmText={tList("deleteConfirmButton")}
        cancelText={tList("cancel")}
        confirmButtonColor="destructive"
        icon={<WarningIcon className="h-5 w-5 text-warning" />}
      />
    </>
  );
});

export default MenuList;