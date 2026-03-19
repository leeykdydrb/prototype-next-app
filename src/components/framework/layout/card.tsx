"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  Card as BaseCard, 
  CardContent as BaseCardContent, 
  CardHeader as BaseCardHeader, 
  CardTitle, CardDescription, 
  CardFooter as BaseCardFooter 
} from "@/components/ui/card";

// Card Props
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outlined" | "elevated";
}

// Card Component - Enhanced card with variants
export function Card({ 
  children, 
  className, 
  variant = "default" 
}: CardProps) {
  const variantClasses = {
    default: "border border-border",
    outlined: "border-2 border-border",
    elevated: "border border-border shadow-lg"
  };

  return (
    <BaseCard className={cn(variantClasses[variant], className)}>
      {children}
    </BaseCard>
  );
}

// Card Header Props
interface CardHeaderProps {
  title?: string;
  titleSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  titleClassName?: string;
  align?: "start" | "between" | "center" | "end";
  gap?: number;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

// Card Header Component - Enhanced card header
export function CardHeader({ 
  title, 
  titleSize = "2xl",
  titleClassName = "",
  align = "between",
  gap = 0,
  description, 
  children, 
  className,
}: CardHeaderProps) {
  const titleSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl"
  };
  const alignClasses = {
    start: "justify-start",
    between: "justify-between",
    center: "justify-center",
    end: "justify-end"
  };
  return (
    <BaseCardHeader className={cn("px-4", className)}>
      <div className={cn(`flex items-center gap-${gap}`, alignClasses[align])}>
        {title && <CardTitle className={cn("text-2xl font-semibold", titleSizeClasses[titleSize], titleClassName)}>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
        {children}
      </div>
    </BaseCardHeader>
  );
}

// Card Content Props
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

// Card Content Component - Enhanced card content
export function CardContent({ 
  children, 
  className 
}: CardContentProps) {
  return (
    <BaseCardContent className={cn("px-4", className)}>
      {children}
    </BaseCardContent>
  );
}

// Card Footer Props
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

// Card Footer Component - Enhanced card footer
export function CardFooter({ 
  children, 
  className 
}: CardFooterProps) {
  return (
    <BaseCardFooter className={className}>
      {children}
    </BaseCardFooter>
  );
}

// Re-export CardTitle and CardDescription
export { CardTitle, CardDescription };

// ============================================================================
// Compound Component Pattern - Card 네임스페이스로 관련 컴포넌트 그룹화
// ============================================================================

/**
 * Card Compound Component
 * 
 * 관련 컴포넌트들을 네임스페이스로 그룹화하여 사용성을 향상시킵니다.
 * 기존 개별 export와 함께 사용 가능합니다.
 * 
 * @example
 * ```tsx
 * // 방법 1: 개별 import (기존 방식 - 호환성 유지)
 * import { Card, CardHeader, CardContent } from '@/components/framework/layout';
 * 
 * // 방법 2: Compound Component 패턴
 * import { Card as CardComponents } from '@/components/framework/layout';
 * 
 * <CardComponents.Root variant="default">
 *   <CardComponents.Header title="제목" titleSize="lg">
 *     <Badge>상태</Badge>
 *   </CardComponents.Header>
 *   <CardComponents.Content>
 *     내용
 *   </CardComponents.Content>
 * </CardComponents.Root>
 * ```
 */
export const CardComponents = {
  Root: Card,
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
  Title: CardTitle,
  Description: CardDescription,
} as const;

// ============================================================================
// Card Presets - 자주 사용하는 카드 패턴을 Preset으로 제공
// ============================================================================

export type CardPresetType = "dashboard" | "list" | "form" | "detail" | "compact";

export interface CardPresetOptions {
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  showHeader?: boolean;
  showFooter?: boolean;
}

// Preset 설정 정의
const cardPresetConfigs: Record<CardPresetType, CardPresetOptions> = {
  dashboard: {
    variant: "default",
    padding: "md",
    showHeader: true,
    showFooter: false,
  },
  list: {
    variant: "default",
    padding: "none",
    showHeader: true,
    showFooter: false,
  },
  form: {
    variant: "default",
    padding: "lg",
    showHeader: true,
    showFooter: true,
  },
  detail: {
    variant: "elevated",
    padding: "lg",
    showHeader: true,
    showFooter: false,
  },
  compact: {
    variant: "outlined",
    padding: "sm",
    showHeader: false,
    showFooter: false,
  },
};

/**
 * Card Presets - 자주 사용하는 카드 패턴
 * 
 * @example
 * ```tsx
 * import { CardPresets } from '@/components/framework/layout';
 * 
 * // 대시보드용 카드
 * <CardPresets.dashboard title="제목">
 *   내용
 * </CardPresets.dashboard>
 * 
 * // 리스트용 카드
 * <CardPresets.list title="목록">
 *   <Table>...</Table>
 * </CardPresets.list>
 * ```
 */
export const CardPresets = {
  /**
   * 대시보드용 카드 Preset
   * - 기본 variant
   * - 중간 padding
   * - 헤더 포함
   */
  dashboard: ({
    title,
    description,
    children,
    className,
    headerActions,
  }: {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    headerActions?: React.ReactNode;
  }) => {
    const preset = cardPresetConfigs.dashboard;
    return (
      <Card variant={preset.variant} className={className}>
        {preset.showHeader && (
          <CardHeader 
            title={title} 
            description={description}
            align="between"
            gap={2}
          >
            {headerActions}
          </CardHeader>
        )}
        <CardContent className={preset.padding === "md" ? "px-4" : ""}>
          {children}
        </CardContent>
      </Card>
    );
  },

  /**
   * 리스트용 카드 Preset
   * - 기본 variant
   * - padding 없음 (리스트가 직접 관리)
   * - 헤더 포함
   */
  list: ({
    title,
    description,
    children,
    className,
    headerActions,
  }: {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    headerActions?: React.ReactNode;
  }) => {
    const preset = cardPresetConfigs.list;
    return (
      <Card variant={preset.variant} className={className}>
        {preset.showHeader && (
          <CardHeader 
            title={title} 
            description={description}
            align="between"
            gap={2}
          >
            {headerActions}
          </CardHeader>
        )}
        <CardContent className="p-0">
          {children}
        </CardContent>
      </Card>
    );
  },

  /**
   * 폼용 카드 Preset
   * - 기본 variant
   * - 큰 padding
   * - 헤더와 푸터 포함
   */
  form: ({
    title,
    description,
    children,
    footer,
    className,
  }: {
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
  }) => {
    const preset = cardPresetConfigs.form;
    return (
      <Card variant={preset.variant} className={className}>
        {preset.showHeader && (
          <CardHeader title={title} description={description} />
        )}
        <CardContent className="px-6">
          {children}
        </CardContent>
        {preset.showFooter && footer && (
          <CardFooter>{footer}</CardFooter>
        )}
      </Card>
    );
  },

  /**
   * 상세보기용 카드 Preset
   * - elevated variant (그림자 효과)
   * - 큰 padding
   * - 헤더 포함
   */
  detail: ({
    title,
    description,
    children,
    className,
  }: {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    const preset = cardPresetConfigs.detail;
    return (
      <Card variant={preset.variant} className={className}>
        {preset.showHeader && (
          <CardHeader title={title} description={description} />
        )}
        <CardContent className="px-6">
          {children}
        </CardContent>
      </Card>
    );
  },

  /**
   * 컴팩트한 카드 Preset
   * - outlined variant
   * - 작은 padding
   * - 헤더 없음
   */
  compact: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const preset = cardPresetConfigs.compact;
    return (
      <Card variant={preset.variant} className={cn("p-2", className)}>
        {children}
      </Card>
    );
  },
};

