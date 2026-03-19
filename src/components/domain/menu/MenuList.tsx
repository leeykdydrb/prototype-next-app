"use client";

import React, { useState, useCallback, useMemo } from "react";
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
import { createMenuColumns, columnHeaders } from "./table/columns";

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
    createMenuColumns({ onEdit, onToggle, onDeleteClick: handleDeleteClick })
  ), [onEdit, onToggle, handleDeleteClick]);

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
        <CardHeader title="메뉴 목록">
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
                        {columnHeaders[column.id] || column.id}
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
              {table.getRowModel().rows.map((row) => (
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
        title="메뉴 삭제"
        content={
          <div className="space-y-2">
            <p>
              <span className="font-semibold">
                {deleteDialog.menu?.title}
              </span>
              {" 메뉴를 삭제하시겠습니까?"}
            </p>
            <p className="text-sm text-muted-foreground">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
        }
        confirmText="삭제"
        confirmButtonColor="destructive"
        icon={<WarningIcon className="h-5 w-5 text-warning" />}
      />
    </>
  );
});

export default MenuList;