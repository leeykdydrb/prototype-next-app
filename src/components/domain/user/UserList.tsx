"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { Badge, Form, TableComponents, CardComponents, DropdownMenuComponents } from "@/components/framework";
import { 
  Edit as EditIcon, 
  Trash2 as DeleteIcon,
  AlertTriangle as WarningIcon,
  ArrowUpDown,
  ChevronDownIcon,
  ColumnsIcon,
  MoreHorizontal,
} from "lucide-react";
import {
  ColumnDef,
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
import type { UserListProps, UserData } from "@/types/user";
import TablePagination from "@/components/common/TablePagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const COLUMN_IDS = ['id', 'name', 'email', 'role', 'isSystem', 'isActive'] as const;
type ColumnId = (typeof COLUMN_IDS)[number];

function isColumnId(id: string): id is ColumnId {
  return (COLUMN_IDS as readonly string[]).includes(id);
}

function getColumnClassName(columnId: string): string {
  const widthMap: Record<string, string> = {
    select: "data-[name=select]:w-10",
    id: "data-[name=id]:w-16",
    name: "data-[name=name]:w-48",
    email: "data-[name=email]:w-64",
    role: "data-[name=role]:w-24",
    isSystem: "data-[name=isSystem]:w-24",
    isActive: "data-[name=isActive]:w-24",
    actions: "data-[name=actions]:w-10",
  };

  const alignMap: Record<string, string> = {
    select: "data-[name=select]:text-center",
    id: "data-[name=id]:text-center",
    name: "data-[name=name]:text-center",
    email: "data-[name=email]:text-left",
    role: "data-[name=role]:text-center",
    isSystem: "data-[name=isSystem]:text-center",
    isActive: "data-[name=isActive]:text-center",
    actions: "data-[name=actions]:text-center",
  };

  const width = widthMap[columnId] || "";
  const align = alignMap[columnId] || "";
  const checkboxPadding = columnId === "select" ? "[&:has([role=checkbox])]:pl-3" : "";

  return [width, align, checkboxPadding].filter(Boolean).join(" ");
};

const UserListNew = React.memo(function UserListNew({
  users,
  onEdit,
  onDelete,
  onToggle,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
}: UserListProps) {
  const tList = useTranslations('AdminUsers.list');
  const tCols = useTranslations('AdminUsers.list.columns');

  const columnLabel = useCallback(
    (id: string) => (isColumnId(id) ? tCols(id) : id),
    [tCols],
  );

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: UserData | null;
  }>({ open: false, user: null });

  // TanStack Table 상태 관리
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: page,
    pageSize: rowsPerPage,
  });

  const handleDeleteClick = useCallback((user: UserData) => {
    setDeleteDialog({ open: true, user });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.user) {
      onDelete(deleteDialog.user);
      setDeleteDialog({ open: false, user: null });
    }
  }, [deleteDialog.user, onDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog({ open: false, user: null });
  }, []);

  const columns: ColumnDef<UserData>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Form.Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={tList('selectAllAria')}
          />
        ),
        cell: ({ row }) => (
          <Form.Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={tList('selectRowAria')}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <Form.Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            {tCols('id')}
            <ArrowUpDown />
          </Form.Button>
        ),
        cell: ({ row }) => <div className="font-semibold">{row.getValue('id')}</div>,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Form.Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            {tCols('name')}
            <ArrowUpDown />
          </Form.Button>
        ),
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <Form.Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            {tCols('email')}
            <ArrowUpDown />
          </Form.Button>
        ),
        cell: ({ row }) => <div>{row.getValue('email')}</div>,
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <Form.Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            {tCols('role')}
            <ArrowUpDown />
          </Form.Button>
        ),
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div>
              <Badge variant="outline">{user.role.displayName}</Badge>
            </div>
          );
        },
      },
      {
        accessorKey: 'isSystem',
        header: tCols('isSystem'),
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div>
              {user.isSystem && <Badge variant="secondary">{tList('systemBadge')}</Badge>}
            </div>
          );
        },
      },
      {
        accessorKey: 'isActive',
        header: tCols('isActive'),
        cell: ({ row }) => {
          const user = row.original;
          return (
            <Form.Switch
              checked={user.isActive}
              disabled={user.isSystem}
              onCheckedChange={() => onToggle(user)}
            />
          );
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DropdownMenuComponents.Root>
              <DropdownMenuComponents.Trigger asChild>
                <Form.Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Form.Button>
              </DropdownMenuComponents.Trigger>
              <DropdownMenuComponents.Content>
                <DropdownMenuComponents.Label>{tList('actionsMenu')}</DropdownMenuComponents.Label>
                <DropdownMenuComponents.Item onClick={() => onEdit(user)}>
                  <EditIcon className="mr-2 h-4 w-4" />
                  {tList('editUser')}
                </DropdownMenuComponents.Item>
                <DropdownMenuComponents.Separator />
                <DropdownMenuComponents.Item
                  onClick={() => handleDeleteClick(user)}
                  disabled={user.isSystem}
                  className="text-destructive"
                >
                  <DeleteIcon className="mr-2 h-4 w-4 text-destructive" />
                  {tList('deleteUser')}
                </DropdownMenuComponents.Item>
              </DropdownMenuComponents.Content>
            </DropdownMenuComponents.Root>
          );
        },
      },
    ],
    [onEdit, onToggle, handleDeleteClick, tList, tCols],
  );

  // TanStack Table 설정
  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
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
      <CardComponents.Root className="py-4">
        <CardComponents.Header title={tList('cardTitle')}>
          <DropdownMenuComponents.Root>
            <DropdownMenuComponents.Trigger asChild>
              <Form.Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">{tList('columnSettings')}</span>
                <span className="lg:hidden">{tList('columnSettingsShort')}</span>
                <ChevronDownIcon />
              </Form.Button>
            </DropdownMenuComponents.Trigger>
            <DropdownMenuComponents.Content>
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => (
                  <DropdownMenuComponents.CheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {columnLabel(column.id)}
                  </DropdownMenuComponents.CheckboxItem>
                ))}
            </DropdownMenuComponents.Content>
          </DropdownMenuComponents.Root>
        </CardComponents.Header>

        <CardComponents.Content>
          <TableComponents.Root>
            <TableComponents.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableComponents.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableComponents.Head
                      key={header.id}
                      className={getColumnClassName(header.id)}
                      data-name={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableComponents.Head>
                  ))}
                </TableComponents.Row>
              ))}
            </TableComponents.Header>
            <TableComponents.Body>
              {table.getRowModel().rows.length === 0 ? (
                <TableComponents.Row>
                  <TableComponents.Cell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {tList('empty')}
                  </TableComponents.Cell>
                </TableComponents.Row>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableComponents.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableComponents.Cell
                        key={cell.id}
                        className={getColumnClassName(cell.column.id)}
                        data-name={cell.column.id}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableComponents.Cell>
                    ))}
                  </TableComponents.Row>
                ))
              )}
            </TableComponents.Body>
          </TableComponents.Root>

          {/* Pagination */}
          <TablePagination table={table} totalCount={totalCount} type="selected" />
        </CardComponents.Content>
      </CardComponents.Root>

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={tList('deleteDialogTitle')}
        content={
          <div className="space-y-2">
            <p>{tList('deleteConfirm', { name: deleteDialog.user?.name ?? '' })}</p>
            <p className="text-sm text-muted-foreground">{tList('deleteIrreversible')}</p>
          </div>
        }
        confirmText={tList('deleteConfirmButton')}
        cancelText={tList('cancel')}
        confirmButtonColor="destructive"
        icon={<WarningIcon className="text-warning" />}
      />
    </>
  );
});

export default UserListNew;
