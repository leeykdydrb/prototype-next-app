"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Table as BaseTable,
  TableHeader as BaseTableHeader,
  TableBody as BaseTableBody,
  TableRow as BaseTableRow,
  TableHead as BaseTableHead,
  TableCell as BaseTableCell
} from "@/components/ui/table";
import { Badge as BaseBadge } from "@/components/ui/badge";
import { Separator as BaseSeparator } from "@/components/ui/separator";
import { Skeleton as BaseSkeleton } from "@/components/ui/skeleton";

// Table Props
interface TableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hover?: boolean;
}

// Table Component - Enhanced table with styling options
export function Table({ 
  children, 
  className
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-md border"
    >
      <BaseTable className={className}>
        {children}
      </BaseTable>
    </div>
  );
}

// Table Header Props
interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

// Table Header Component
export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <BaseTableHeader className={className}>
      {children}
    </BaseTableHeader>
  );
}

// Table Body Props
interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

// Table Body Component
export function TableBody({ children, className }: TableBodyProps) {
  return (
    <BaseTableBody className={className}>
      {children}
    </BaseTableBody>
  );
}

// Table Row Props
interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

// Table Row Component - Enhanced with click and selection
export function TableRow({ children, className }: TableRowProps) {
  return (
    <BaseTableRow className={className}>
      {children}
    </BaseTableRow>
  );
}

// Table Head Props
interface TableHeadProps extends React.ComponentProps<"th"> {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

// Table Head Component - Enhanced with sorting
export function TableHead({ 
  children, 
  className, 
  align = "left",
  ...props
}: TableHeadProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <BaseTableHead className={cn(alignClasses[align], className)} {...props}>
      {children}
    </BaseTableHead>
  );
}

// Table Cell Props
interface TableCellProps extends React.ComponentProps<"td"> {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

// Table Cell Component - Enhanced with alignment
export function TableCell({ 
  children, 
  className, 
  align = "left",
  ...props
}: TableCellProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <BaseTableCell className={cn(alignClasses[align], className)} {...props}>
      {children}
    </BaseTableCell>
  );
}

// Badge Props
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Badge Component - Enhanced with more variants
export function Badge({ 
  children, 
  variant = "default", 
  size = "xs", 
  className
}: BadgeProps) {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };

  return (
    <BaseBadge 
      variant={variant} 
      className={cn(sizeClasses[size], className)}
    >
      {children}
    </BaseBadge>
  );
}

// Skeleton Props
interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

// Skeleton Component - Enhanced with multiple lines
export function Skeleton({ 
  className, 
  lines = 1, 
  height = "h-4" 
}: SkeletonProps) {
  if (lines === 1) {
    return (
      <BaseSkeleton className={cn(height, className)} />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <BaseSkeleton 
          key={i} 
          className={cn(
            height, 
            i === lines - 1 && "w-3/4", // Last line is shorter
            className
          )} 
        />
      ))}
    </div>
  );
}

// Loading State Props
interface SeparatorProps {
  className?: string; 
  orientation?: "horizontal" | "vertical";
}

// Re-export Separator component
export function Separator({ 
  className, 
  orientation = "horizontal" 
}: SeparatorProps) {
  return (
    <BaseSeparator className={className} orientation={orientation} />
  );
}

// ============================================================================
// Compound Component Pattern - Table 네임스페이스로 관련 컴포넌트 그룹화
// ============================================================================

/**
 * Table Compound Component
 * 
 * 관련 컴포넌트들을 네임스페이스로 그룹화하여 사용성을 향상시킵니다.
 * 기존 개별 export와 함께 사용 가능합니다.
 * 
 * @example
 * ```tsx
 * // 방법 1: 개별 import (기존 방식 - 호환성 유지)
 * import { Table, TableHeader, TableBody, TableRow } from '@/components/framework/data-display';
 * 
 * // 방법 2: Compound Component 패턴
 * import { Table as TableComponents } from '@/components/framework/data-display';
 * 
 * <TableComponents.Root>
 *   <TableComponents.Header>
 *     <TableComponents.Row>
 *       <TableComponents.Head>이름</TableComponents.Head>
 *       <TableComponents.Head>이메일</TableComponents.Head>
 *     </TableComponents.Row>
 *   </TableComponents.Header>
 *   <TableComponents.Body>
 *     <TableComponents.Row>
 *       <TableComponents.Cell>홍길동</TableComponents.Cell>
 *       <TableComponents.Cell>hong@example.com</TableComponents.Cell>
 *     </TableComponents.Row>
 *   </TableComponents.Body>
 * </TableComponents.Root>
 * ```
 */
// Table Compound Component를 위한 별도 export
const TableRoot = Table;

export const TableComponents = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
} as const;

