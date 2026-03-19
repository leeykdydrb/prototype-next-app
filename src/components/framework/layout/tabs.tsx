"use client";

import React from "react";
import {
  Tabs as BaseTabs,
  TabsContent as BaseTabsContent,
  TabsList as BaseTabsList,
  TabsTrigger as BaseTabsTrigger
} from "@/components/ui/tabs";

// Tabs Props
interface TabsProps {
  children: React.ReactNode; 
  defaultValue?: string; 
  value?: string; 
  onValueChange?: (value: string) => void; 
  className?: string;
}

// Tabs Component
export function Tabs({ 
  children, 
  defaultValue, 
  value, 
  onValueChange, 
  className 
}: TabsProps) {
  return (
    <BaseTabs 
      defaultValue={defaultValue} 
      value={value} 
      onValueChange={onValueChange}
      className={className}
    >
      {children}
    </BaseTabs>
  );
}

// Tabs Content Props
interface TabsContentProps {
  children?: React.ReactNode;
  value: string;
  className?: string;
}

// Tabs Content Component
export function TabsContent({ className, value, children }: TabsContentProps) {
  return (
    <BaseTabsContent className={className} value={value}>
      {children}
    </BaseTabsContent>
  );
}

// Tabs List Props
interface TabsListProps {
  children?: React.ReactNode;
  className?: string;
}

// Tabs List Component
export function TabsList({ className, children }: TabsListProps) {
  return (
    <BaseTabsList className={className}>
      {children}
    </BaseTabsList>
  );
}

// Tabs Trigger Props
interface TabsTriggerProps {
  children?: React.ReactNode;
  value: string;
  className?: string;
}

// Tabs Trigger Component
export function TabsTrigger({ className, value, children }: TabsTriggerProps) {
  return (
    <BaseTabsTrigger className={className} value={value}>
      {children}
    </BaseTabsTrigger>
  );
}

// ============================================================================
// Compound Component Pattern - Tabs 네임스페이스로 관련 컴포넌트 그룹화
// ============================================================================

/**
 * Tabs Compound Component
 * 
 * 관련 컴포넌트들을 네임스페이스로 그룹화하여 사용성을 향상시킵니다.
 * 기존 개별 export와 함께 사용 가능합니다.
 * 
 * @example
 * ```tsx
 * // 방법 1: 개별 import (기존 방식 - 호환성 유지)
 * import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/framework/layout';
 * 
 * // 방법 2: Compound Component 패턴
 * import { Tabs as TabsComponents } from '@/components/framework/layout';
 * 
 * <TabsComponents.Root defaultValue="tab1">
 *   <TabsComponents.List>
 *     <TabsComponents.Trigger value="tab1">탭 1</TabsComponents.Trigger>
 *     <TabsComponents.Trigger value="tab2">탭 2</TabsComponents.Trigger>
 *   </TabsComponents.List>
 *   <TabsComponents.Content value="tab1">내용 1</TabsComponents.Content>
 *   <TabsComponents.Content value="tab2">내용 2</TabsComponents.Content>
 * </TabsComponents.Root>
 * ```
 */
export const TabsComponents = {
  Root: Tabs,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
} as const;

