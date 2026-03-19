"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Sidebar as BaseSidebar,
  SidebarContent as BaseSidebarContent,
  SidebarFooter as BaseSidebarFooter,
  SidebarGroup as BaseSidebarGroup,
  SidebarGroupContent as BaseSidebarGroupContent,
  SidebarGroupLabel as BaseSidebarGroupLabel,
  SidebarHeader as BaseSidebarHeader,
  SidebarInset as BaseSidebarInset,
  SidebarMenu as BaseSidebarMenu,
  SidebarMenuButton as BaseSidebarMenuButton,
  SidebarMenuItem as BaseSidebarMenuItem,
  SidebarMenuSub as BaseSidebarMenuSub,
  SidebarMenuSubButton as BaseSidebarMenuSubButton,
  SidebarMenuSubItem as BaseSidebarMenuSubItem,
  SidebarProvider as BaseSidebarProvider,
  SidebarTrigger as BaseSidebarTrigger
} from "@/components/ui/sidebar";

// Sidebar Props
interface SidebarProps {
  collapsible?: "offcanvas" | "icon" | "none";
  children: React.ReactNode; 
  className?: string;
}

// Sidebar Component
export function Sidebar({ 
  collapsible = "offcanvas",
  children, 
  className 
}: SidebarProps) {
  return (
    <BaseSidebar collapsible={collapsible} className={className}>
      {children}
    </BaseSidebar>
  );
}

// Sidebar Content Props
interface SidebarContentProps {
  children?: React.ReactNode;
  className?: string;
}

// Sidebar Content Component
export function SidebarContent({ className, children }: SidebarContentProps) {
  return (
    <BaseSidebarContent className={className}>
      {children}
    </BaseSidebarContent>
  );
}

// Sidebar Footer Props
interface SidebarFooterProps {
  children?: React.ReactNode;
  className?: string;
}

// Sidebar Footer Component
export function SidebarFooter({ className, children }: SidebarFooterProps) {
  return (
    <BaseSidebarFooter className={className}>
      {children}
    </BaseSidebarFooter>
  );
}

// Sidebar Group Props
interface SidebarGroupProps {
  children?: React.ReactNode;
  className?: string;
}

// Sidebar Group Component
export function SidebarGroup({ className, children }: SidebarGroupProps) {
  return (
    <BaseSidebarGroup className={className}>
      {children}
    </BaseSidebarGroup>
  );
}

// Sidebar Group Content Props
interface SidebarGroupContentProps {
  children?: React.ReactNode;
  className?: string;
}

// Sidebar Group Content Component
export function SidebarGroupContent({ className, children }: SidebarGroupContentProps) {
  return (
    <BaseSidebarGroupContent className={className}>
      {children}
    </BaseSidebarGroupContent>
  );
}

// Sidebar Group Label Props
interface SidebarGroupLabelProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

// Sidebar Group Label Component
export function SidebarGroupLabel({ asChild, className, children }: SidebarGroupLabelProps) {
  return (
    <BaseSidebarGroupLabel asChild={asChild} className={className}>
      {children}
    </BaseSidebarGroupLabel>
  );
}

// Sidebar Header Props
interface SidebarHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

// Sidebar Header Component
export function SidebarHeader({ className, children }: SidebarHeaderProps) {
  return (
    <BaseSidebarHeader className={className}>
      {children}
    </BaseSidebarHeader>
  );
}

// Sidebar Inset Props
interface SidebarInsetProps {
  children?: React.ReactNode;
  className?: string;
}

// Sidebar Inset Component
export function SidebarInset({ className, children }: SidebarInsetProps) {
  return (
    <BaseSidebarInset className={className}>
      {children}
    </BaseSidebarInset>
  );
}

// Sidebar Menu Props
interface SidebarMenuProps {
  children?: React.ReactNode;
  className?: string;
}

// Sidebar Menu Component
export function SidebarMenu({ className, children }: SidebarMenuProps) {
  return (
    <BaseSidebarMenu className={className}>
      {children}
    </BaseSidebarMenu>
  );
}

// Sidebar Menu Button Props
interface SidebarMenuButtonProps {
  children?: React.ReactNode;
  asChild?: boolean;
  isActive?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  tooltip?: string;
  onClick?: () => void;
  className?: string;
}

// Sidebar Menu Button Component
export function SidebarMenuButton({ 
  className,
  children,
  isActive = false,
  onClick,
  ...props
}: SidebarMenuButtonProps) {
  return (
    <BaseSidebarMenuButton className={cn("cursor-pointer", className)} isActive={isActive} onClick={onClick} {...props}>
      {children}
    </BaseSidebarMenuButton>
  );
}

// Sidebar Menu Item Props
interface SidebarMenuItemProps {
  children?: React.ReactNode;
  className?: string;
}

// Sidebar Menu Item Component
export function SidebarMenuItem({ className, children }: SidebarMenuItemProps) {
  return (
    <BaseSidebarMenuItem className={className}>
      {children}
    </BaseSidebarMenuItem>
  );
}

// Sidebar Menu Sub Props
interface SidebarMenuSubProps {
  children?: React.ReactNode;
  className?: string;
}

// Sidebar Menu Sub Component
export function SidebarMenuSub({ className, children }: SidebarMenuSubProps) {
  return (
    <BaseSidebarMenuSub className={className}>
      {children}
    </BaseSidebarMenuSub>
  );
}

// Sidebar Menu Sub Button Props
interface SidebarMenuSubButtonProps {
  children?: React.ReactNode;
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

// Sidebar Menu Sub Button Component
export function SidebarMenuSubButton({ className, children, onClick, ...props }: SidebarMenuSubButtonProps) {
  return (
    <BaseSidebarMenuSubButton className={cn("cursor-pointer", className)} onClick={onClick} {...props}>
      {children}
    </BaseSidebarMenuSubButton>
  );
}

// Sidebar Menu Sub Item Props
interface SidebarMenuSubItemProps {
  children?: React.ReactNode;
  className?: string;
}

// Sidebar Menu Sub Item Component
export function SidebarMenuSubItem({ className, children }: SidebarMenuSubItemProps) {
  return (
    <BaseSidebarMenuSubItem className={className}>
      {children}
    </BaseSidebarMenuSubItem>
  );
}

// Sidebar Provider Props
interface SidebarProviderProps {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

// Sidebar Provider Component
export function SidebarProvider({ className, children, ...props }: SidebarProviderProps) {
  return (
    <BaseSidebarProvider className={className} {...props}>
      {children}
    </BaseSidebarProvider>
  );
}

// Sidebar Trigger Props
interface SidebarTriggerProps {
  className?: string;
  onClick?: () => void;
}

// Sidebar Trigger Component
export function SidebarTrigger({ className, onClick }: SidebarTriggerProps) {
  return (
    <BaseSidebarTrigger className={className} onClick={onClick} />
  );
}

