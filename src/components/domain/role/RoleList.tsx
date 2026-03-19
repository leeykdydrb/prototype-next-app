"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import { createRoleColumns, columnHeaders } from "./table/columns";

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
    createRoleColumns({ onEdit, onToggle, onDeleteClick: handleDeleteClick })
  ), [onEdit, onToggle, handleDeleteClick]);

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
        <CardHeader title="역할 목록">
          <div className="flex items-center gap-2">
            <DropdownMenuComponents.Root>
              <DropdownMenuComponents.Trigger asChild>
                <Button variant="outline" size="sm">
                  <ColumnsIcon />
                  <span className="hidden lg:inline">컬럼 설정</span>
                  <span className="lg:hidden">컬럼</span>
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
                      {columnHeaders[column.id] || column.id}
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
                      className="data-[name=name]:w-30 data-[name=displayName]:w-20 data-[name=description]:w-50 data-[name=permissionCount]:w-24 data-[name=userCount]:w-24 data-[name=isSystem]:w-24 data-[name=isActive]:w-24 data-[name=actions]:w-20 data-[name=name]:text-left data-[name=displayName]:text-left data-[name=description]:text-left data-[name=permissionCount]:text-center data-[name=userCount]:text-center data-[name=isSystem]:text-center data-[name=isActive]:text-center data-[name=actions]:text-center"
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
              {table.getRowModel().rows.map((row) => (
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
              ))}
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
        title="역할 삭제"
        content={
          <>
            <p>
              <span className="font-bold">
                {deleteDialog.role?.displayName}
              </span>
              {" 역할을 삭제하시겠습니까?"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </>
        }
        confirmText="삭제"
        confirmButtonColor="destructive"
        icon={<WarningIcon className="text-warning" />}
      />
    </>
  );
});

export default RoleListNew;

