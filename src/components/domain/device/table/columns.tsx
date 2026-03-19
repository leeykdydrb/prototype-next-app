"use client";

import { Button } from "@/components/framework/form";
import { ArrowUpDown, MoreVertical } from 'lucide-react';
import type { ColumnDef } from "@tanstack/react-table";

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

export const columnHeaders: Record<string, string> = {
  name: '권한명',
  displayName: '표시명',
  description: '설명',
  isSystem: '시스템 권한',
  isActive: '상태',
  actions: '작업'
};

export interface CreateDeviceColumnsDeps {
  setSelectedDevice: (device: Device) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export function createDeviceColumns({
  setSelectedDevice,
  setIsDialogOpen
}: CreateDeviceColumnsDeps): ColumnDef<Device>[] {
  return [
    {
      accessorKey: "line",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3 font-semibold"
          >
            Line
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm font-medium">{row.getValue("line")}</div>
      ),
    },
    {
      accessorKey: "serialNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3 font-semibold"
          >
            Serial Number
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue("serialNumber")}</div>
      ),
    },
    {
      accessorKey: "ip",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3 font-semibold"
          >
            IP
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue("ip")}</div>
      ),
    },
    {
      accessorKey: "registDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3 font-semibold"
          >
            Regist Date
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue("registDate")}</div>
      ),
    },
    {
      accessorKey: "hardwareCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3 font-semibold"
          >
            연결된 하드웨어 개수
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue("hardwareCount")}</div>
      ),
    },
    {
      accessorKey: "serviceCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3 font-semibold"
          >
            탑재된 서비스 개수
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue("serviceCount")}</div>
      ),
    },
    {
      accessorKey: "action",
      id: "actions",
      enableHiding: false,
      header: () => {
        return (
          <div className="text-sm font-semibold">Action</div>
        );
      },
      cell: ({ row }) => {
        const device = row.original;

        return (
          <Button 
            variant="outline" 
            className="h-8 w-8 p-0"
            onClick={() => {
              setSelectedDevice(device);
              setIsDialogOpen(true);
            }}
          >
            <span className="sr-only">Open device details</span>
            <MoreVertical />
          </Button>
        );
      },
    }
  ];
}


