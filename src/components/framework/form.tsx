"use client";

import React from "react";
import { cn } from "@/lib/utils";

import { Button as BaseButton } from "@/components/ui/button";
import { Checkbox as BaseCheckbox } from "@/components/ui/checkbox";
import { Input as BaseInput } from "@/components/ui/input";
import { Label as BaseLabel } from "@/components/ui/label";
import { Switch as BaseSwitch } from "@/components/ui/switch";
import { Textarea as BaseTextarea } from "@/components/ui/textarea";
import { 
  Select as BaseSelect, 
  SelectContent as BaseSelectContent, 
  SelectGroup as BaseSelectGroup,
  SelectItem as BaseSelectItem, 
  SelectLabel as BaseSelectLabel,
  SelectTrigger as BaseSelectTrigger, 
  SelectValue as BaseSelectValue,
} from "@/components/ui/select";

// Form Field Props
interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
  requireDescription?: string;
  helpText?: string;
}

// Form Field Component - Wraps form fields with consistent styling and error handling
export function FormField({ 
  children, 
  className, 
  requireDescription, 
  helpText 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
      {requireDescription && (
        <div className="text-sm text-red-500">{requireDescription}</div>
      )}
      {helpText && !requireDescription && (
        <div className="text-sm text-muted-foreground">{helpText}</div>
      )}
    </div>
  );
}

// Form Label Props
interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

// Form Label Component - Enhanced label with required indicator
export function Label({ 
  children, 
  htmlFor, 
  required = false, 
  className 
}: LabelProps) {
  return (
    <BaseLabel 
      htmlFor={htmlFor} 
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
    >
      {children}
      {required && <span className="text-red-500">*</span>}
    </BaseLabel>
  );
}

// Form Input Props
interface InputProps {
  className?: string;
  id?: string;
  type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search" | "date" | "time" | "datetime-local" | "month" | "week";
  placeholder?: string;
  required?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  error?: boolean;
}

// Form Input Component - Enhanced input with error styling
export function Input({ 
  className, 
  required,
  error = false,
  ...props 
}: InputProps) {
  return (
    <BaseInput
      className={cn(
        required && "border-red-500 focus-visible:ring-red-500",
        error && "border-red-500 focus-visible:ring-red-500",
        className
      )}
      {...props}
    />
  );
}

// Form Textarea Props
interface TextareaProps {
  className?: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
}

// Form Textarea Component - Enhanced textarea with error styling
export function Textarea({ 
  className, 
  error = false, 
  ...props 
}: TextareaProps) {
  return (
    <BaseTextarea
      className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}
      {...props}
    />
  );
}

// Form Select Props
interface SelectProps {
  id?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  selectLabel?: string;
  error?: boolean;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
}

// Form Select Component - Enhanced select with error styling
export function Select({ 
  id,
  value, 
  onValueChange, 
  placeholder, 
  selectLabel,
  error = false, 
  children,
  className,
  size = "lg",
  disabled = false
}: SelectProps) {
  return (
    <BaseSelect value={value} onValueChange={onValueChange} disabled={disabled}>
      <BaseSelectTrigger 
        id={id}
        size={size as "sm" | "default"}
        className={cn(
          "w-full text-sm h-10",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
      >
        <BaseSelectValue placeholder={placeholder} />
      </BaseSelectTrigger>
      <BaseSelectContent>
        <BaseSelectGroup>
          {selectLabel && <BaseSelectLabel>{selectLabel}</BaseSelectLabel>}
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === 'option') {
              const props = child.props as { value: string; children: React.ReactNode };
              return (
                <BaseSelectItem key={props.value} value={props.value}>
                  {props.children}
                </BaseSelectItem>
              );
            }
            return child;
          })}
        </BaseSelectGroup>
      </BaseSelectContent>
    </BaseSelect>
  );
}

// Form Checkbox Props
interface CheckboxProps {
  id?: string;
  checked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  error?: boolean;
  helpText?: string;
  disabled?: boolean;
  className?: string;
}

// Form Checkbox Component - Enhanced checkbox with label
export function Checkbox({ 
  id, 
  checked, 
  onCheckedChange, 
  label, 
  error = false, 
  disabled = false,
  className 
}: CheckboxProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <BaseCheckbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(error && "border-red-500")}
      />
      {label && (
        <BaseLabel 
          htmlFor={id}
          className={cn(
            "text-sm font-normal cursor-pointer",
            error && "text-red-500"
          )}
        >
          {label}
        </BaseLabel>
      )}
    </div>
  );
}

// Form Switch Props
interface SwitchProps {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  error?: boolean;
  helpText?: string;
  className?: string;
}

// Form Switch Component - Enhanced switch with label
export function Switch({ 
  id, 
  checked, 
  disabled,
  onCheckedChange, 
  label, 
  error = false, 
  className 
}: SwitchProps) {
  const switchElement = (
    <BaseSwitch
      id={id}
      checked={checked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      className={cn("cursor-pointer", error && "border-red-500", className)}
    />
  );
  
  if (label) {
    return (
      <div className="flex items-center space-x-2">
        {switchElement}
        <Label 
          htmlFor={id}
          className={cn(
            "text-sm font-normal cursor-pointer",
            error && "text-red-500"
          )}
        >
          {label}
        </Label>
      </div>
    );
  }

  return switchElement;
}

// Form Group Props
interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

// Form Group Component - Groups form fields with responsive grid
export function FormGroup({ 
  children, 
  className, 
  columns = 1 
}: FormGroupProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={cn(
      "grid gap-4 pb-4",
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  );
}

// Form Section Props
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

// Form Section Component - Groups related form fields
export function FormSection({ 
  title, 
  description, 
  children, 
  className 
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// Button Props
interface ButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  role?: "button" | "combobox" | "menu" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "option" | "progressbar" | "radio" | "scrollbar" | "searchbox" | "separator" | "slider" | "spinbutton" | "switch" | "tab" | "tablist" | "timer" | "toolbar" | "treeitem";
  children: React.ReactNode;
}

// Button Component - Enhanced button with cursor-pointer and potential future enhancements
export function Button({
  className,
  variant,
  type,
  size,
  onClick,
  disabled,
  role,
  children,
  ...props
}: ButtonProps) {
  return (
    <BaseButton 
      className={cn("cursor-pointer", className)} 
      variant={variant} 
      type={type}
      size={size} 
      onClick={onClick} 
      disabled={disabled}
      role={role}
      {...props}
    >
      {children}
    </BaseButton>
  );
}

// Select Item Props
interface SelectItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Select Item Component - Enhanced select item with explicit props
export function SelectItem({
  value,
  disabled = false,
  className,
  children
}: SelectItemProps) {
  return (
    <BaseSelectItem 
      value={value} 
      disabled={disabled}
      className={className}
    >
      {children}
    </BaseSelectItem>
  );
}

// ============================================================================
// Compound Component Pattern - Form 네임스페이스로 관련 컴포넌트 그룹화
// ============================================================================

/**
 * Form Compound Component
 * 
 * 관련 컴포넌트들을 네임스페이스로 그룹화하여 사용성을 향상시킵니다.
 * 기존 개별 export와 함께 사용 가능합니다.
 * 
 * @example
 * ```tsx
 * // 방법 1: 개별 import (기존 방식 - 호환성 유지)
 * import { Input, Label, Button } from '@/components/framework/form';
 * 
 * // 방법 2: Compound Component 패턴
 * import { Form } from '@/components/framework/form';
 * 
 * <Form.Field>
 *   <Form.Label htmlFor="email" required>이메일</Form.Label>
 *   <Form.Input id="email" type="email" placeholder="email@example.com" />
 * </Form.Field>
 * <Form.Button type="submit">제출</Form.Button>
 * ```
 */
export const Form = {
  // Field & Layout
  Field: FormField,
  Group: FormGroup,
  Section: FormSection,
  
  // Input Components
  Label,
  Input,
  Textarea,
  Select,
  SelectItem,
  Checkbox,
  Switch,
  Button,
} as const;

// ============================================================================
// Form Presets - 자주 사용하는 폼 패턴을 Preset으로 제공
// ============================================================================

export type FormPresetType = "twoColumn" | "singleColumn" | "inline" | "compact";

/**
 * Form Presets - 자주 사용하는 폼 패턴
 * 
 * @example
 * ```tsx
 * import { FormPresets } from '@/components/framework/form';
 * 
 * // 2열 폼
 * <FormPresets.twoColumn>
 *   <Form.Field>
 *     <Form.Label>이름</Form.Label>
 *     <Form.Input />
 *   </Form.Field>
 *   <Form.Field>
 *     <Form.Label>이메일</Form.Label>
 *     <Form.Input />
 *   </Form.Field>
 * </FormPresets.twoColumn>
 * ```
 */
export const FormPresets = {
  /**
   * 2열 폼 Preset
   * - 2개의 컬럼으로 필드 배치
   * - 반응형 (모바일에서는 1열)
   */
  twoColumn: ({
    children,
    className,
    title,
  }: {
    children: React.ReactNode;
    className?: string;
    title?: string;
  }) => {
    return (
      <FormSection title={title} className={className}>
        <FormGroup columns={2}>{children}</FormGroup>
      </FormSection>
    );
  },

  /**
   * 1열 폼 Preset
   * - 모든 필드를 1열로 배치
   */
  singleColumn: ({
    children,
    className,
    title,
  }: {
    children: React.ReactNode;
    className?: string;
    title?: string;
  }) => {
    return (
      <FormSection title={title} className={className}>
        <FormGroup columns={1}>{children}</FormGroup>
      </FormSection>
    );
  },

  /**
   * 인라인 폼 Preset
   * - 필드를 가로로 나열
   * - 검색 필터 등에 적합
   */
  inline: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div className={cn("flex flex-wrap items-end gap-4", className)}>
        {children}
      </div>
    );
  },

  /**
   * 컴팩트한 폼 Preset
   * - 작은 간격과 패딩
   * - 모달이나 작은 공간에 적합
   */
  compact: ({
    children,
    className,
    title,
  }: {
    children: React.ReactNode;
    className?: string;
    title?: string;
  }) => {
    return (
      <FormSection title={title} className={cn("py-2", className)}>
        <FormGroup columns={1} className="gap-2">
          {children}
        </FormGroup>
      </FormSection>
    );
  },
} as const;