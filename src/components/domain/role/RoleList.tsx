"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
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
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertTriangle as WarningIcon, ChevronDownIcon, ColumnsIcon } from "lucide-react";
import type { RoleListProps, RoleData } from "@/types/role";
import TablePagination from "@/components/common/TablePagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { createRoleColumns, type RoleColumnId } from "./table/columns";

const RoleListNew = React.memo(function RoleListNew({
  roles,
  onEdit,
  onDelete,
  onToggle,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
}: RoleListProps) {
  const tList = useTranslations("AdminRoles.list");
  const tCols = useTranslations("AdminRoles.list.columns");

  const labels = useMemo(
    () =>
      ({
        name: tCols("name"),
        displayName: tCols("displayName"),
        description: tCols("description"),
        permissionCount: tCols("permissionCount"),
        userCount: tCols("userCount"),
        isSystem: tCols("isSystem"),
        isActive: tCols("isActive"),
        actions: tCols("actions"),
      }) satisfies Record<RoleColumnId, string>,
    [tCols],
  );

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    role: RoleData | null;
  }>({ open: false, role: null });

  // TanStack Table 상태 관리
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: page,
    pageSize: rowsPerPage,
  });

  const handleDeleteClick = useCallback((role: RoleData) => {
    setDeleteDialog({ open: true, role });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.role) {
      onDelete(deleteDialog.role);
      setDeleteDialog({ open: false, role: null });
    }
  }, [deleteDialog.role, onDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog({ open: false, role: null });
  }, []);

  // 컬럼 정의
  const columns = useMemo(() => (
    createRoleColumns({
      onEdit,
      onToggle,
      onDeleteClick: handleDeleteClick,
      labels,
      systemBadge: tList("systemBadge"),
      permissionCountSuffix: tList("permissionCountSuffix"),
      userCountSuffix: tList("userCountSuffix"),
    })
  ), [onEdit, onToggle, handleDeleteClick, labels, tList]);

  // TanStack Table 설정
  const table = useReactTable({
    data: roles,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / rowsPerPage),
  });

  // 페이지네이션 변경 핸들러
  useEffect(() => {
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
              <DropdownMenuComponents.Content>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuComponents.CheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {(labels as Record<string, string>)[column.id] || column.id}
                    </DropdownMenuComponents.CheckboxItem>
                  ))}
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
                      className="data-[name=name]:w-30 data-[name=displayName]:w-20 data-[name=description]:w-50 data-[name=permissionCount]:w-24 data-[name=userCount]:w-24 data-[name=isSystem]:w-24 data-[name=isActive]:w-24 data-[name=actions]:w-20 data-[name=name]:text-center data-[name=displayName]:text-center data-[name=description]:text-left data-[name=permissionCount]:text-center data-[name=userCount]:text-center data-[name=isSystem]:text-center data-[name=isActive]:text-center data-[name=actions]:text-center"
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
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className="data-[name=name]:w-30 data-[name=displayName]:w-20 data-[name=description]:w-50 data-[name=permissionCount]:w-24 data-[name=userCount]:w-24 data-[name=isSystem]:w-24 data-[name=isActive]:w-24 data-[name=actions]:w-20 data-[name=name]:text-left data-[name=displayName]:text-left data-[name=description]:text-left data-[name=permissionCount]:text-center data-[name=userCount]:text-center data-[name=isSystem]:text-center data-[name=isActive]:text-center data-[name=actions]:text-center"
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
            <p>{tList("deleteConfirm", { name: deleteDialog.role?.displayName ?? "" })}</p>
            <p className="text-sm text-muted-foreground">{tList("deleteIrreversible")}</p>
          </div>
        }
        confirmText={tList("deleteConfirmButton")}
        cancelText={tList("cancel")}
        confirmButtonColor="destructive"
        icon={<WarningIcon className="text-warning" />}
      />
    </>
  );
});

export default RoleListNew;

