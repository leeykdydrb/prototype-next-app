"use client";

import React from "react";
import { useTranslations } from 'next-intl';
import { Button, Select, SelectItem } from "@/components/framework/form";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import type { Table } from "@tanstack/react-table";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  totalCount: number;
  type?: "range" | "selected" | "none";
}

export default function TablePagination<TData>({
  table,
  totalCount,
  type = "range",
}: TablePaginationProps<TData>) {
  const t = useTranslations('Common.tablePagination');
  const state = table.getState().pagination;
  const pageIndex = state.pageIndex;
  const pageSize = state.pageSize;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalCount);
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const rowCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  return (
    <div className="flex items-center justify-between pt-3">
      {type === "range" ? (
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {t('rangeSummary', { start, end, total: totalCount })}
        </div>
      ) : type === "selected" ? (
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {t('selectedSummary', { selected: selectedCount, total: rowCount })}
        </div>
      ) : (
        <div></div>
      )}

      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <span className="text-sm font-medium whitespace-nowrap">{t('rowsPerPage')}</span>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            {[5, 10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          {t('pageOf', { current: pageIndex + 1, total: pageCount })}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t('srFirst')}</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t('srPrevious')}</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('srNext')}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t('srLast')}</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
