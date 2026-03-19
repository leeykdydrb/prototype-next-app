"use client";

import React from "react";
import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuContent as BaseDropdownMenuContent,
  DropdownMenuItem as BaseDropdownMenuItem,
  DropdownMenuLabel as BaseDropdownMenuLabel,
  DropdownMenuSeparator as BaseDropdownMenuSeparator,
  DropdownMenuTrigger as BaseDropdownMenuTrigger,
  DropdownMenuCheckboxItem as BaseDropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import {
  Popover as BasePopover,
  PopoverContent as BasePopoverContent,
  PopoverTrigger as BasePopoverTrigger
} from "@/components/ui/popover";

// Dropdown Menu Props
interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Dropdown Menu Component
export function DropdownMenu({ children, open, onOpenChange }: DropdownMenuProps) {
  return (
    <BaseDropdownMenu open={open} onOpenChange={onOpenChange}>
      {children}
    </BaseDropdownMenu>
  );
}

// Dropdown Menu Content Props
interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  alignOffset?: number;
  className?: string;
}

// Dropdown Menu Content Component
export function DropdownMenuContent({ 
  children, 
  align = "end", 
  side,
  sideOffset,
  alignOffset,
  className 
}: DropdownMenuContentProps) {
  return (
    <BaseDropdownMenuContent 
      align={align} 
      side={side}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={className}
    >
      {children}
    </BaseDropdownMenuContent>
  );
}

// Dropdown Menu Item Props
interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// Dropdown Menu Item Component
export function DropdownMenuItem({ 
  children, 
  onClick, 
  disabled,
  className 
}: DropdownMenuItemProps) {
  return (
    <BaseDropdownMenuItem 
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </BaseDropdownMenuItem>
  );
}

// Dropdown Menu Label Props
interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

// Dropdown Menu Label Component
export function DropdownMenuLabel({ children, className }: DropdownMenuLabelProps) {
  return (
    <BaseDropdownMenuLabel className={className}>
      {children}
    </BaseDropdownMenuLabel>
  );
}

// Dropdown Menu Separator Props
interface DropdownMenuSeparatorProps {
  className?: string;
}

// Dropdown Menu Separator Component
export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
  return (
    <BaseDropdownMenuSeparator className={className} />
  );
}

// Dropdown Menu Trigger Props
interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

// Dropdown Menu Trigger Component
export function DropdownMenuTrigger({ children, asChild, className }: DropdownMenuTriggerProps) {
  return (
    <BaseDropdownMenuTrigger asChild={asChild} className={className}>
      {children}
    </BaseDropdownMenuTrigger>
  );
}

// Dropdown Menu Checkbox Item Props
interface DropdownMenuCheckboxItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

// Dropdown Menu Checkbox Item Component
export function DropdownMenuCheckboxItem({ 
  children, 
  checked, 
  onCheckedChange,
  className 
}: DropdownMenuCheckboxItemProps) {
  return (
    <BaseDropdownMenuCheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={className}
    >
      {children}
    </BaseDropdownMenuCheckboxItem>
  );
}

// Popover Trigger Props
interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

// Popover Trigger Component
export function PopoverTrigger({ 
  children, 
  asChild 
}: PopoverTriggerProps) {
  return (
    <BasePopoverTrigger asChild={asChild}>
      {children}
    </BasePopoverTrigger>
  );
}

// Popover Props
interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

// Popover Component
export function Popover({ 
  children, 
  open, 
  onOpenChange,
  modal
}: PopoverProps) {
  return (
    <BasePopover open={open} onOpenChange={onOpenChange} modal={modal}>
      {children}
    </BasePopover>
  );
}

// Popover Content Props
interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
}

// Popover Content Component
export function PopoverContent({ 
  children, 
  className 
}: PopoverContentProps) {
  return (
    <BasePopoverContent className={className}>
      {children}
    </BasePopoverContent>
  );
}

// ============================================================================
// Compound Component Pattern - DropdownMenu 네임스페이스로 관련 컴포넌트 그룹화
// ============================================================================

/**
 * DropdownMenu Compound Component
 * 
 * 관련 컴포넌트들을 네임스페이스로 그룹화하여 사용성을 향상시킵니다.
 * 기존 개별 export와 함께 사용 가능합니다.
 * 
 * @example
 * ```tsx
 * // 방법 1: 개별 import (기존 방식 - 호환성 유지)
 * import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/framework/dropdown';
 * 
 * // 방법 2: Compound Component 패턴
 * import { DropdownMenuComponents } from '@/components/framework';
 * 
 * <DropdownMenuComponents.Root>
 *   <DropdownMenuComponents.Trigger>열기</DropdownMenuComponents.Trigger>
 *   <DropdownMenuComponents.Content>
 *     <DropdownMenuComponents.Label>작업</DropdownMenuComponents.Label>
 *     <DropdownMenuComponents.Item>항목 1</DropdownMenuComponents.Item>
 *   </DropdownMenuComponents.Content>
 * </DropdownMenuComponents.Root>
 * ```
 */
export const DropdownMenuComponents = {
  Root: DropdownMenu,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Trigger: DropdownMenuTrigger,
  CheckboxItem: DropdownMenuCheckboxItem,
} as const;

/**
 * Popover Compound Component
 * 
 * 관련 컴포넌트들을 네임스페이스로 그룹화하여 사용성을 향상시킵니다.
 * 기존 개별 export와 함께 사용 가능합니다.
 * 
 * @example
 * ```tsx
 * // 방법 1: 개별 import (기존 방식 - 호환성 유지)
 * import { Popover, PopoverContent, PopoverTrigger } from '@/components/framework/dropdown';
 * 
 * // 방법 2: Compound Component 패턴
 * import { PopoverComponents } from '@/components/framework';
 * 
 * <PopoverComponents.Root>
 *   <PopoverComponents.Trigger>열기</PopoverComponents.Trigger>
 *   <PopoverComponents.Content>내용</PopoverComponents.Content>
 * </PopoverComponents.Root>
 * ```
 */
export const PopoverComponents = {
  Root: Popover,
  Content: PopoverContent,
  Trigger: PopoverTrigger,
} as const;

