"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog as BaseDialog,
  DialogContent as BaseDialogContent,
  DialogHeader as BaseDialogHeader,
  DialogTitle as BaseDialogTitle,
  DialogDescription as BaseDialogDescription,
  DialogFooter as BaseDialogFooter,
  DialogTrigger as BaseDialogTrigger
} from "@/components/ui/dialog";
import { Form } from "../form";

// Dialog Props
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

// Dialog Component - Enhanced dialog with consistent styling
export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      {children}
    </BaseDialog>
  );
}

// Dialog Content Props
interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

// Dialog Content Component - Enhanced dialog content with size variants
export function DialogContent({ 
  children, 
  className, 
  size = "md" 
}: DialogContentProps) {
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    full: "sm:max-w-full"
  };

  return (
    <BaseDialogContent 
      className={cn(
        "max-h-[80vh] flex flex-col p-0",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </BaseDialogContent>
  );
}

// Dialog Header Props
interface DialogHeaderProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

// Dialog Header Component - Enhanced dialog header
export function DialogHeader({ 
  icon,
  title, 
  description, 
  className 
}: DialogHeaderProps) {
  return (
    <BaseDialogHeader className={cn("px-6 pt-6 pb-4", className)}>
      {icon ? 
        <BaseDialogTitle className="flex items-center gap-2">{icon} {title}</BaseDialogTitle> : 
        <BaseDialogTitle>{title}</BaseDialogTitle>}
      {description ? 
        <BaseDialogDescription>{description}</BaseDialogDescription> : 
        <BaseDialogDescription className="sr-only" aria-hidden="true" />}
    </BaseDialogHeader>
  );
}

// Dialog Title Props
interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

// Dialog Title Component
export function DialogTitle({ 
  children, 
  className 
}: DialogTitleProps) {
  return (
    <BaseDialogTitle className={className}>
      {children}
    </BaseDialogTitle>
  );
}

// Dialog Description Props
interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

// Dialog Description Component
export function DialogDescription({ 
  children, 
  className 
}: DialogDescriptionProps) {
  return (
    <BaseDialogDescription className={className}>
      {children}
    </BaseDialogDescription>
  );
}

// Dialog Trigger Props
interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

// Dialog Trigger Component
export function DialogTrigger({ 
  children, 
  asChild 
}: DialogTriggerProps) {
  return (
    <BaseDialogTrigger asChild={asChild}>
      {children}
    </BaseDialogTrigger>
  );
}

// Dialog Footer Props
interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

// Dialog Footer Component - Enhanced dialog footer
export function DialogFooter({ 
  children, 
  className 
}: DialogFooterProps) {
  return (
    <BaseDialogFooter className={cn("px-6 pb-6 pt-4", className)}>
      {children}
    </BaseDialogFooter>
  );
}

// Dialog Body Props
interface DialogBodyProps {
  children: React.ReactNode;
  className?: string;
}

// Dialog Body Component - Scrollable dialog body
export function DialogBody({ 
  children, 
  className 
}: DialogBodyProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-6", className)}>
      {children}
    </div>
  );
}

// ============================================================================
// Compound Component Pattern - Dialog 네임스페이스로 관련 컴포넌트 그룹화
// ============================================================================

/**
 * Dialog Compound Component
 * 
 * 관련 컴포넌트들을 네임스페이스로 그룹화하여 사용성을 향상시킵니다.
 * 기존 개별 export와 함께 사용 가능합니다.
 * 
 * @example
 * ```tsx
 * // 방법 1: 개별 import (기존 방식 - 호환성 유지)
 * import { Dialog, DialogContent, DialogHeader } from '@/components/framework/layout';
 * 
 * // 방법 2: Compound Component 패턴
 * import { Dialog as DialogComponents } from '@/components/framework/layout';
 * 
 * <DialogComponents.Root open={open} onOpenChange={setOpen}>
 *   <DialogComponents.Trigger>열기</DialogComponents.Trigger>
 *   <DialogComponents.Content size="lg">
 *     <DialogComponents.Header title="제목" description="설명" />
 *     <DialogComponents.Body>내용</DialogComponents.Body>
 *     <DialogComponents.Footer>
 *       <Button>확인</Button>
 *     </DialogComponents.Footer>
 *   </DialogComponents.Content>
 * </DialogComponents.Root>
 * ```
 */
export const DialogComponents = {
  Root: Dialog,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Trigger: DialogTrigger,
} as const;

// ============================================================================
// Dialog Presets - 자주 사용하는 다이얼로그 패턴을 Preset으로 제공
// ============================================================================

export type DialogPresetType = "form" | "confirm" | "info" | "detail" | "fullscreen";

/**
 * Dialog Presets - 자주 사용하는 다이얼로그 패턴
 * 
 * @example
 * ```tsx
 * import { DialogPresets } from '@/components/framework/layout';
 * 
 * // 폼 다이얼로그
 * <DialogPresets.form
 *   open={open}
 *   onClose={onClose}
 *   title="사용자 추가"
 *   description="사용자 정보를 입력하세요"
 *   onSubmit={handleSubmit}
 *   submitLabel="추가"
 * >
 *   <Form.Input ... />
 * </DialogPresets.form>
 * 
 * // 확인 다이얼로그
 * <DialogPresets.confirm
 *   open={open}
 *   onClose={onClose}
 *   onConfirm={handleDelete}
 *   title="삭제 확인"
 *   message="정말 삭제하시겠습니까?"
 * />
 * ```
 */
export const DialogPresets = {
  /**
   * 폼 다이얼로그 Preset
   * - 큰 크기 (3xl)
   * - 헤더, 바디, 푸터 포함
   * - 제출/취소 버튼 자동 생성
   */
  form: ({
    open,
    onClose,
    title,
    description,
    children,
    onSubmit,
    submitLabel = "저장",
    cancelLabel = "취소",
    submitDisabled,
    size = "3xl",
  }: {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    onSubmit?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    submitDisabled?: boolean;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  }) => {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent size={size}>
          <DialogHeader title={title} description={description} />
          <DialogBody>{children}</DialogBody>
          <DialogFooter>
            {onSubmit ? (
              <>
                <Form.Button variant="outline" onClick={onClose}>
                  {cancelLabel}
                </Form.Button>
                <Form.Button onClick={onSubmit} disabled={submitDisabled}>
                  {submitLabel}
                </Form.Button>
              </>
            ) : (
              <Form.Button variant="outline" onClick={onClose}>
                {cancelLabel}
              </Form.Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },

  /**
   * 확인 다이얼로그 Preset
   * - 중간 크기 (md)
   * - 헤더와 확인/취소 버튼만
   */
  confirm: ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "확인",
    cancelLabel = "취소",
    variant = "default",
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "default" | "destructive";
  }) => {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent size="md">
          <DialogHeader title={title} description={message} />
          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                variant === "destructive"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {confirmLabel}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },

  /**
   * 정보 다이얼로그 Preset
   * - 작은 크기 (sm)
   * - 헤더와 확인 버튼만
   */
  info: ({
    open,
    onClose,
    title,
    message,
    confirmLabel = "확인",
  }: {
    open: boolean;
    onClose: () => void;
    title: string;
    message?: string;
    confirmLabel?: string;
  }) => {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent size="sm">
          <DialogHeader title={title} description={message} />
          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {confirmLabel}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
} as const;

