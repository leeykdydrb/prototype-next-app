"use client";

import React from "react";
import {
  Breadcrumb as BaseBreadcrumb,
  BreadcrumbItem as BaseBreadcrumbItem,
  BreadcrumbLink as BaseBreadcrumbLink,
  BreadcrumbList as BaseBreadcrumbList,
  BreadcrumbPage as BaseBreadcrumbPage,
  BreadcrumbSeparator as BaseBreadcrumbSeparator
} from "@/components/ui/breadcrumb";

// Breadcrumb Props
interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

// Breadcrumb Component
export function Breadcrumb({ 
  children, 
  className 
}: BreadcrumbProps) {
  return (
    <BaseBreadcrumb className={className}>
      {children}
    </BaseBreadcrumb>
  );
}

// Breadcrumb Item Props
interface BreadcrumbItemProps {
  children?: React.ReactNode;
  className?: string;
}

// Breadcrumb Item Component
export function BreadcrumbItem({ 
  className, 
  children, 
  ...props 
}: BreadcrumbItemProps) {
  return (
    <BaseBreadcrumbItem className={className} {...props}>
      {children}
    </BaseBreadcrumbItem>
  );
}

// Breadcrumb Link Props
interface BreadcrumbLinkProps {
  children?: React.ReactNode;
  asChild?: boolean;
  href?: string;
  className?: string;
}

// Breadcrumb Link Component
export function BreadcrumbLink({ 
  asChild, 
  href,
  className, 
  children, 
  ...props 
}: BreadcrumbLinkProps) {
  return (
    <BaseBreadcrumbLink asChild={asChild} href={href} className={className} {...props}>
      {children}
    </BaseBreadcrumbLink>
  );
}

// Breadcrumb List Props
interface BreadcrumbListProps {
  children?: React.ReactNode;
  className?: string;
}

// Breadcrumb List Component
export function BreadcrumbList({ 
  className, 
  children, 
  ...props 
}: BreadcrumbListProps) {
  return (
    <BaseBreadcrumbList className={className} {...props}>
      {children}
    </BaseBreadcrumbList>
  );
}

// Breadcrumb Page Props
interface BreadcrumbPageProps {
  children?: React.ReactNode;
  className?: string;
}

// Breadcrumb Page Component
export function BreadcrumbPage({ 
  className, 
  children, 
  ...props 
}: BreadcrumbPageProps) {
  return (
    <BaseBreadcrumbPage className={className} {...props}>
      {children}
    </BaseBreadcrumbPage>
  );
}

// Breadcrumb Separator Props
interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
  className?: string;
}

// Breadcrumb Separator Component
export function BreadcrumbSeparator({ 
  children, 
  className, 
  ...props 
}: BreadcrumbSeparatorProps) {
  return (
    <BaseBreadcrumbSeparator className={className} {...props}>
      {children}
    </BaseBreadcrumbSeparator>
  );
}

