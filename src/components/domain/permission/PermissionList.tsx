"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/framework/form";
import { Card, CardContent, CardHeader } from "@/components/framework/layout";
import { Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/framework/data-display";
import { DropdownMenuComponents } from "@/components/framework";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { 
  ChevronUp as ExpandLessIcon,
  ChevronDown as ExpandMoreIcon,
  AlertTriangle as WarningIcon,
  Columns as ColumnsIcon,
  ChevronDown as ChevronDownIcon
} from "lucide-react";
import type { PermissionData, PermissionListProps } from "@/types/permission";
import TablePagination from "@/components/common/TablePagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { createPermissionColumns, columnHeaders } from "./table/columns";

const PermissionList = React.memo(function PermissionList({
  permissions,
  onEdit,
  onDelete,
  onToggle,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
}: PermissionListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    permission: PermissionData | null;
  }>({ open: false, permission: null });

  // tanstack/react-table 상태
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: page, pageSize: rowsPerPage });

  const handleDeleteClick = useCallback((permission: PermissionData) => {
    setDeleteDialog({ open: true, permission });
  }, []);

  // 카테고리별로 그룹화
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, PermissionData[]> = {};
    
    permissions.forEach(permission => {
      const category = permission.category.codeName;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    // 각 카테고리 내에서 권한명으로 정렬
    Object.keys(groups).forEach(category => {
      groups[category].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [permissions]);

  // 카테고리 정렬 (사용자 정의 순서 + 알파벳 순)
  const sortedCategories = useMemo(() => {
    const categories = Object.keys(groupedPermissions).sort();
    return categories;
    // 우선순위가 있는 카테고리들
    // const priorityCategories = ['사용자', '역할', '권한', '시스템'];
    
    // return categories.sort((a, b) => {
    //   const aIndex = priorityCategories.indexOf(a);
    //   const bIndex = priorityCategories.indexOf(b);
      
    //   if (aIndex !== -1 && bIndex !== -1) {
    //     return aIndex - bIndex;
    //   }
    //   if (aIndex !== -1) return -1;
    //   if (bIndex !== -1) return 1;
      
    //   return a.localeCompare(b);
    // });
  }, [groupedPermissions]);

  const toggleGroup = (category: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleAllGroups = () =>
    setExpandedGroups((prev) =>
      prev.size === sortedCategories.length
        ? new Set()
        : new Set(sortedCategories)
    );

  useEffect(() => {
    // 초기에 모든 그룹을 펼쳐놓기
    setExpandedGroups(new Set(sortedCategories));
  }, [sortedCategories]);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.permission) {
      onDelete(deleteDialog.permission);
      setDeleteDialog({ open: false, permission: null });
    }
  }, [deleteDialog.permission, onDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog({ open: false, permission: null });
  }, []);

  // 컬럼 정의
  const columns = useMemo(() => (
    createPermissionColumns({ onEdit, onToggle, onDeleteClick: handleDeleteClick })
  ), [onEdit, onToggle, handleDeleteClick]);

  // tanstack/react-table 설정
  const table = useReactTable({
    data: permissions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
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
        <CardHeader className="px-4" title="권한 목록">
          <div className="flex items-center gap-2">
            <DropdownMenuComponents.Root>
              <DropdownMenuComponents.Trigger asChild>
                <Button variant="outline" size="sm">
                  <ColumnsIcon className="h-4 w-4" />
                  <span className="hidden lg:inline">컬럼 설정</span>
                  <span className="lg:hidden">컬럼</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuComponents.Trigger>
              <DropdownMenuComponents.Content>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuComponents.CheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {columnHeaders[column.id] || column.id}
                      </DropdownMenuComponents.CheckboxItem>
                    );
                  })}
              </DropdownMenuComponents.Content>
            </DropdownMenuComponents.Root>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAllGroups}
            >
              {expandedGroups.size === sortedCategories.length ? '모두 접기' : '모두 펼치기'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-4">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <TableHead className="w-10"><span /></TableHead>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={header.id === 'isSystem' || header.id === 'isActive' || header.id === 'actions' ? 'text-center' : ''}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {sortedCategories.map((category) => (
                <React.Fragment key={category}>
                  {/* 카테고리 헤더 */}
                  <TableRow className="bg-muted/50 hover:bg-muted">
                    <TableCell colSpan={1 + table.getVisibleFlatColumns().length} className="py-2">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleGroup(category)}>
                        {expandedGroups.has(category) ? (
                          <ExpandLessIcon className="h-4 w-4" />
                        ) : (
                          <ExpandMoreIcon className="h-4 w-4" />
                        )}
                        <span className="font-medium">{category}</span>
                        <Badge variant="outline" className="text-xs">
                          {groupedPermissions[category].length}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* 카테고리 내 권한들 */}
                  {expandedGroups.has(category) && groupedPermissions[category].map((permission) => {
                    const row = table.getRowModel().rows.find(r => r.original.id === permission.id);
                    if (!row) return null;
                       
                    return (
                      <TableRow key={permission.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="w-5 h-px bg-border ml-2" />
                        </TableCell>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className={cell.column.id === 'isSystem' || cell.column.id === 'isActive' || cell.column.id === 'actions' ? 'text-center' : ''}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </React.Fragment>
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
        title="권한 삭제"
        content={
          <div className="space-y-2">
            <p>
              <span className="font-semibold">
                {deleteDialog.permission?.displayName}
              </span>
              {" 권한을 삭제하시겠습니까?"}
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

export default PermissionList;