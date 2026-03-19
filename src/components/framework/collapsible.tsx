"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Accordion as BaseAccordion,
  AccordionContent as BaseAccordionContent,
  AccordionItem as BaseAccordionItem,
  AccordionTrigger as BaseAccordionTrigger
} from "@/components/ui/accordion";
import {
  Collapsible as BaseCollapsible,
  CollapsibleContent as BaseCollapsibleContent,
  CollapsibleTrigger as BaseCollapsibleTrigger
} from "@/components/ui/collapsible";

// Accordion Props
interface AccordionProps {
  children: React.ReactNode;
  type?: "single" | "multiple";
  collapsible?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
}

// Accordion Component - Wrapper for accordion with consistent styling
export function Accordion({
  children,
  type = "single",
  collapsible = true,
  value,
  defaultValue,
  onValueChange,
  className
}: AccordionProps) {
  if (type === "single") {
    return (
      <BaseAccordion
        type="single"
        collapsible={collapsible}
        value={value as string}
        defaultValue={defaultValue as string}
        onValueChange={onValueChange as ((value: string) => void) | undefined}
        className={cn("w-full", className)}
      >
        {children}
      </BaseAccordion>
    );
  } else {
    return (
      <BaseAccordion
        type="multiple"
        value={value as string[]}
        defaultValue={defaultValue as string[]}
        onValueChange={onValueChange as ((value: string[]) => void) | undefined}
        className={cn("w-full", className)}
      >
        {children}
      </BaseAccordion>
    );
  }
}

// Accordion Item Props
interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

// Accordion Item Component
export function AccordionItem({ children, value, className }: AccordionItemProps) {
  return (
    <BaseAccordionItem value={value} className={className}>
      {children}
    </BaseAccordionItem>
  );
}

// Accordion Trigger Props
interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

// Accordion Trigger Component
export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  return (
    <BaseAccordionTrigger className={cn("text-sm", className)}>
      {children}
    </BaseAccordionTrigger>
  );
}

// Accordion Content Props
interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

// Accordion Content Component
export function AccordionContent({ children, className }: AccordionContentProps) {
  return (
    <BaseAccordionContent className={cn("space-y-2 pb-0", className)}>
      {children}
    </BaseAccordionContent>
  );
}

// Collapsible Props
interface CollapsibleProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
}

// Collapsible Component - Wrapper for collapsible content
export function Collapsible({
  children,
  open,
  onOpenChange,
  defaultOpen,
  className
}: CollapsibleProps) {
  return (
    <BaseCollapsible
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      className={className}
    >
      {children}
    </BaseCollapsible>
  );
}

// Collapsible Trigger Props
interface CollapsibleTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

// Collapsible Trigger Component
export function CollapsibleTrigger({ children, asChild, className }: CollapsibleTriggerProps) {
  return (
    <BaseCollapsibleTrigger asChild={asChild} className={className}>
      {children}
    </BaseCollapsibleTrigger>
  );
}

// Collapsible Content Props
interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

// Collapsible Content Component
export function CollapsibleContent({ children, className }: CollapsibleContentProps) {
  return (
    <BaseCollapsibleContent className={className}>
      {children}
    </BaseCollapsibleContent>
  );
}

// ============================================================================
// Compound Component Pattern - Accordion 네임스페이스로 관련 컴포넌트 그룹화
// ============================================================================

/**
 * Accordion Compound Component
 * 
 * 관련 컴포넌트들을 네임스페이스로 그룹화하여 사용성을 향상시킵니다.
 * 기존 개별 export와 함께 사용 가능합니다.
 * 
 * @example
 * ```tsx
 * // 방법 1: 개별 import (기존 방식 - 호환성 유지)
 * import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/framework/collapsible';
 * 
 * // 방법 2: Compound Component 패턴
 * import { Accordion as AccordionComponents } from '@/components/framework/collapsible';
 * 
 * <AccordionComponents.Root type="multiple">
 *   <AccordionComponents.Item value="category1">
 *     <AccordionComponents.Trigger>
 *       카테고리 1
 *     </AccordionComponents.Trigger>
 *     <AccordionComponents.Content>
 *       내용
 *     </AccordionComponents.Content>
 *   </AccordionComponents.Item>
 * </AccordionComponents.Root>
 * ```
 */
export const AccordionComponents = {
  Root: Accordion,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
} as const;

/**
 * Collapsible Compound Component
 * 
 * 관련 컴포넌트들을 네임스페이스로 그룹화하여 사용성을 향상시킵니다.
 * 기존 개별 export와 함께 사용 가능합니다.
 * 
 * @example
 * ```tsx
 * // 방법 1: 개별 import (기존 방식 - 호환성 유지)
 * import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/framework/collapsible';
 * 
 * // 방법 2: Compound Component 패턴
 * import { Collapsible as CollapsibleComponents } from '@/components/framework/collapsible';
 * 
 * <CollapsibleComponents.Root open={open} onOpenChange={setOpen}>
 *   <CollapsibleComponents.Trigger>열기</CollapsibleComponents.Trigger>
 *   <CollapsibleComponents.Content>내용</CollapsibleComponents.Content>
 * </CollapsibleComponents.Root>
 * ```
 */
export const CollapsibleComponents = {
  Root: Collapsible,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
} as const;