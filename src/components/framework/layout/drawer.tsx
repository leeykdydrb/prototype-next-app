"use client";

import React from "react";
import {
  Drawer as BaseDrawer,
  DrawerContent as BaseDrawerContent,
  DrawerHeader as BaseDrawerHeader,
  DrawerTitle as BaseDrawerTitle,
  DrawerDescription as BaseDrawerDescription,
  DrawerFooter as BaseDrawerFooter,
  DrawerClose as BaseDrawerClose,
  DrawerTrigger as BaseDrawerTrigger
} from "@/components/ui/drawer";

// Drawer Props
interface DrawerProps {
  children: React.ReactNode; 
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
}

// Drawer Component
export function Drawer({ 
  children, 
  open, 
  onOpenChange 
}: DrawerProps) {
  return (
    <BaseDrawer open={open} onOpenChange={onOpenChange}>
      {children}
    </BaseDrawer>
  );
}

// Drawer Content Props
interface DrawerContentProps {
  children: React.ReactNode; 
  className?: string;
}

// Drawer Content Component
export function DrawerContent({ 
  children, 
  className 
}: DrawerContentProps) {
  return (
    <BaseDrawerContent className={className}>
      {children}
    </BaseDrawerContent>
  );
}

// Drawer Header Props
interface DrawerHeaderProps {
  children: React.ReactNode; 
  className?: string;
}

// Drawer Header Component
export function DrawerHeader({ 
  children, 
  className 
}: DrawerHeaderProps) {
  return (
    <BaseDrawerHeader className={className}>
      {children}
    </BaseDrawerHeader>
  );
}

// Drawer Title Props
interface DrawerTitleProps {
  children: React.ReactNode;
  className?: string;
}

// Drawer Title Component
export function DrawerTitle({ 
  children, 
  className 
}: DrawerTitleProps) {
  return (
    <BaseDrawerTitle className={className}>
      {children}
    </BaseDrawerTitle>
  );
}

// Drawer Description Props
interface DrawerDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

// Drawer Description Component
export function DrawerDescription({ 
  children, 
  className 
}: DrawerDescriptionProps) {
  return (
    <BaseDrawerDescription className={className}>
      {children}
    </BaseDrawerDescription>
  );
}

// Drawer Footer Props
interface DrawerFooterProps {
  children: React.ReactNode;
  className?: string;
}

// Drawer Footer Component
export function DrawerFooter({ 
  children, 
  className 
}: DrawerFooterProps) {
  return (
    <BaseDrawerFooter className={className}>
      {children}
    </BaseDrawerFooter>
  );
}

// Drawer Close Props
interface DrawerCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
}

// Drawer Close Component
export function DrawerClose({ 
  children, 
  asChild 
}: DrawerCloseProps) {
  return (
    <BaseDrawerClose asChild={asChild}>
      {children}
    </BaseDrawerClose>
  );
}

// Drawer Trigger Props
interface DrawerTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

// Drawer Trigger Component
export function DrawerTrigger({ 
  children, 
  asChild 
}: DrawerTriggerProps) {
  return (
    <BaseDrawerTrigger asChild={asChild}>
      {children}
    </BaseDrawerTrigger>
  );
}

