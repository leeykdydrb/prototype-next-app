"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader } from '@/components/framework/layout';
import { Button, Input, Label, Select, SelectItem } from '@/components/framework/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/framework/data-display';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, Search } from 'lucide-react';
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
} from '@tanstack/react-table';
import { createDeviceColumns } from "./table/columns";
import DeviceDialog from './DeviceDialog';

type Device = {
  id: string;
  line: string;
  serialNumber: string;
  ip: string;
  registDate: string;
  hardwareCount: number;
  serviceCount: number;
  model?: string;
  gpu?: string;
  hostname?: string;
};

const initialDevices: Device[] = [
  {
    id: "1",
    line: "5CCL",
    serialNumber: "123123123123123",
    ip: "192.168.2.12",
    registDate: "2025-09-10",
    hardwareCount: 2,
    serviceCount: 3,
  },
  {
    id: "2",
    line: "7CCL",
    serialNumber: "123123124123124",
    ip: "192.168.2.13",
    registDate: "2025-09-11",
    hardwareCount: 2,
    serviceCount: 3,
  }
];

const DeviceList = React.memo(function DeviceList() {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [devices, setDevices] = React.useState<Device[]>(initialDevices);

  const columns = useMemo(() => (
    createDeviceColumns({ setSelectedDevice, setIsDialogOpen })
  ), [setSelectedDevice, setIsDialogOpen]);

  const table = useReactTable({
    data: devices,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleSave = (updatedDevice: Device) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === updatedDevice.id ? updatedDevice : device
      )
    );
    console.log('Device updated:', updatedDevice);
  };

  const handleDelete = (deviceId: string) => {
    setDevices(prevDevices => 
      prevDevices.filter(device => device.id !== deviceId)
    );
    console.log('Device deleted:', deviceId);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedDevice(null);
  };

  return (
    <>
      <Card className="py-4">
        <CardHeader>
          {/* 컨트롤 바 */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Show
              </Label>
              <Select
                id="rows-per-page"
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
                placeholder={table.getState().pagination.pageSize.toString()}
                className="w-24"
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </Select>
              <Label htmlFor="search" className="text-sm font-medium">
                entries
              </Label>
            </div>
              
            <div className="flex items-center gap-2 flex-1">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="pl-8 w-full"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        {/* 테이블 */}
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      className="data-[name=line]:w-20 data-[name=serialNumber]:w-40 data-[name=ip]:w-32 data-[name=registDate]:w-32 data-[name=hardwareCount]:w-32 data-[name=serviceCount]:w-32 data-[name=actions]:w-20 [&:has([role=checkbox])]:pl-3 data-[name=line]:text-center data-[name=serialNumber]:text-center data-[name=ip]:text-center data-[name=registDate]:text-center data-[name=hardwareCount]:text-center data-[name=serviceCount]:text-center data-[name=actions]:text-center"
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
                      className="data-[name=line]:w-20 data-[name=serialNumber]:w-40 data-[name=ip]:w-32 data-[name=registDate]:w-32 data-[name=hardwareCount]:w-32 data-[name=serviceCount]:w-32 data-[name=actions]:w-20 [&:has([role=checkbox])]:pl-3 data-[name=line]:text-center data-[name=serialNumber]:text-center data-[name=ip]:text-center data-[name=registDate]:text-center data-[name=hardwareCount]:text-center data-[name=serviceCount]:text-center data-[name=actions]:text-center"
                      data-name={cell.column.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      
        {/* Pagination */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            
            {/* 페이지 번호들 */}
            <div className="flex items-center gap-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className={`h-8 w-8 p-0 text-sm ${table.getState().pagination.pageIndex === i ? "bg-gray-700 text-white" : ""}`}
                  onClick={() => table.setPageIndex(i)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Device Dialog */}
      <DeviceDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        device={selectedDevice}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
});

export default DeviceList;
