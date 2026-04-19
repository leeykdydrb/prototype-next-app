"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Form } from "./form";
import { DialogPresets } from "./layout/dialog";

// ============================================================================
// Configuration-based Form Dialog
// 필드 정의만으로 폼을 자동 생성하는 방식
// ============================================================================

export type FieldType = "text" | "email" | "password" | "number" | "select" | "switch" | "textarea" | "checkbox";

export interface FieldOption {
  value: string | number;
  label: string;
}

// ============================================================================
// 기본 검증 함수 (타입별 자동 적용)
// ============================================================================

/**
 * 타입별 기본 검증 함수
 * field.validation이 있으면 우선 사용 (오버라이드 가능)
 */
const getDefaultValidator = (type: FieldType): ((value: FormDataValue) => boolean) | null => {
  switch (type) {
    case "email":
      return (value: FormDataValue) => {
        if (!value || typeof value !== 'string') return false;
        // RFC 5322 기반 이메일 형식 검증 (간소화 버전)
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      };
    case "number":
      return (value: FormDataValue) => {
        if (value === null || value === undefined || value === '') return false;
        return !isNaN(Number(value));
      };
    // password, text, select, switch, textarea, checkbox는 기본 검증 없음
    default:
      return null;
  }
};

/**
 * 타입별 기본 에러 메시지
 */
const getDefaultErrorMessage = (
  type: FieldType,
  label: string,
  i18n: {
    invalid: (label: string) => string;
    invalidEmail: string;
    invalidNumber: string;
  },
): string => {
  switch (type) {
    case "email":
      return i18n.invalidEmail;
    case "number":
      return i18n.invalidNumber;
    default:
      return i18n.invalid(label);
  }
};

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  options?: FieldOption[]; // select용
  helpText?: string;
  validation?: {
    message?: string;
    validator?: (value: string | number | boolean | null | undefined) => boolean;
  };
  gridCols?: number; // 그리드 컬럼 수 (기본 1)
  spacer?: boolean; // 빈 공간 (다음 필드를 다음 줄로 내리기 위해)
  autoFocus?: boolean; // 자동 포커스
}

export type FormDataValue = string | number | boolean | null | undefined;

export interface FormDialogConfig {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  initialData?: Record<string, FormDataValue>;
  onSubmit: (data: Record<string, FormDataValue>) => void;
  onClose: () => void;
  open: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  columns?: number; // 기본 그리드 컬럼 수
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  customContent?: React.ReactNode; // 커스텀 콘텐츠 (권한 선택 등)
  getFormData?: () => Record<string, FormDataValue>; // 커스텀 폼 데이터 가져오기
  onFormDataChange?: (data: Record<string, FormDataValue>) => void; // 폼 데이터 변경 시 콜백
}

/**
 * Configuration-based Form Dialog
 * 필드 정의만으로 폼 다이얼로그를 자동 생성
 * 
 * @example
 * ```tsx
 * <FormDialog
 *   open={open}
 *   onClose={handleClose}
 *   onSubmit={handleSubmit}
 *   title="사용자 추가"
 *   fields={[
 *     { name: "id", label: "아이디", type: "text", required: true },
 *     { name: "name", label: "이름", type: "text", required: true },
 *     { name: "email", label: "이메일", type: "email", required: true },
 *     { name: "roleId", label: "역할", type: "select", required: true, options: roleOptions },
 *   ]}
 *   columns={2}
 * />
 * ```
 */
export function FormDialog({
  open,
  onClose,
  onSubmit,
  title,
  description,
  fields,
  initialData = {},
  submitLabel,
  cancelLabel,
  columns = 2,
  size = "3xl",
  customContent,
  getFormData,
  onFormDataChange,
}: FormDialogConfig) {
  const t = useTranslations("Common.formDialog");
  const submitText = submitLabel ?? t("submitDefault");
  const cancelText = cancelLabel ?? t("cancelDefault");
  const requiredMessage = useCallback((label: string) => t("required", { label }), [t]);
  const invalidMessage = useCallback((label: string) => t("invalid", { label }), [t]);
  const defaultSelectPlaceholder = t("selectPlaceholder");

  const [formData, setFormData] = useState<Record<string, FormDataValue>>(() => initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 필드별 값 변경 핸들러
  const handleFieldChange = useCallback((name: string, value: FormDataValue) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // 외부 콜백 호출
      if (onFormDataChange) {
        onFormDataChange(newData);
      }
      return newData;
    });
    
    // 실시간 유효성 검사
    setErrors((prev) => {
      const newErrors = { ...prev };
      const field = fields.find(f => f.name === name);
      
      if (!field || field.spacer) {
        // spacer 필드는 검증하지 않음
        return prev;
      }
      
      // 값이 비어있는지 확인
      const isEmpty = !value || 
        (typeof value === 'string' && value.trim() === '') || 
        (typeof value === 'number' && value === 0);
      
      // 필수 필드 검사
      if (field.required && isEmpty) {
        newErrors[name] = field.validation?.message || requiredMessage(field.label);
        return newErrors;
      }
      
      // 검증 실행 (커스텀 검증 우선, 없으면 타입별 기본 검증)
      const validator = field.validation?.validator || getDefaultValidator(field.type);
      
      if (validator && !isEmpty) {
        if (!validator(value)) {
          // 커스텀 메시지 우선, 없으면 타입별 기본 메시지
          newErrors[name] =
            field.validation?.message ||
            getDefaultErrorMessage(field.type, field.label, {
              invalid: invalidMessage,
              invalidEmail: t("invalidEmail"),
              invalidNumber: t("invalidNumber"),
            });
        } else {
          // 검증 통과 시 에러 제거
          delete newErrors[name];
        }
      } else if (!field.required && isEmpty) {
        // 선택 필드이고 값이 없으면 에러 제거
        delete newErrors[name];
      } else if (!validator && !isEmpty) {
        // 검증이 없고 값이 있으면 에러 제거
        delete newErrors[name];
      }
      
      return newErrors;
    });
  }, [onFormDataChange, fields, invalidMessage, requiredMessage, t]);

  // 유효성 검사
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach((field) => {
      // spacer는 검증하지 않음
      if (field.spacer) return;
      
      const value = formData[field.name];
      
      // 필수 필드 검사
      if (field.required) {
        if (!value || (typeof value === 'string' && !value.trim()) || (typeof value === 'number' && value === 0)) {
          newErrors[field.name] = field.validation?.message || requiredMessage(field.label);
          return;
        }
      }
      
      // 검증 실행 (커스텀 검증 우선, 없으면 타입별 기본 검증)
      const validator = field.validation?.validator || getDefaultValidator(field.type);
      
      if (validator && value) {
        if (!validator(value)) {
          // 커스텀 메시지 우선, 없으면 타입별 기본 메시지
          newErrors[field.name] =
            field.validation?.message ||
            getDefaultErrorMessage(field.type, field.label, {
              invalid: invalidMessage,
              invalidEmail: t("invalidEmail"),
              invalidNumber: t("invalidNumber"),
            });
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, fields, invalidMessage, requiredMessage, t]);

  // 제출 핸들러
  const handleSubmit = useCallback(() => {
    if (validate()) {
      // 커스텀 getFormData가 있으면 그것을 사용, 없으면 기본 formData 사용
      const finalData = getFormData ? getFormData() : formData;
      onSubmit(finalData);
    }
  }, [formData, validate, onSubmit, getFormData]);

  // 필드 렌더링
  const renderField = useCallback((field: FormFieldConfig) => {
    const value = formData[field.name] ?? "";
    const error = errors[field.name];
    const gridCols = field.gridCols || 1;
    
    // 값이 비어있는지 확인
    const isEmpty = !value || 
                   (typeof value === 'string' && value.trim() === '') || 
                   (typeof value === 'number' && value === 0);
    
    // requireDescription: 에러가 있으면 표시 (필수 필드 에러 또는 커스텀 검증 에러)
    const requireDescription = error 
      ? error
      : (field.required && isEmpty ? requiredMessage(field.label) : undefined);

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <Form.Field 
            key={field.name}
            requireDescription={requireDescription}
            helpText={!requireDescription ? field.helpText : undefined}
            className={gridCols > 1 ? `col-span-${gridCols}` : ""}
          >
            <Form.Label htmlFor={field.name} required={field.required}>
              {field.label}
            </Form.Label>
            <Form.Input
              id={field.name}
              type={field.type}
              value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={field.disabled}
              required={field.required && isEmpty}
              error={!!error}
              placeholder={field.placeholder}
              autoFocus={field.autoFocus}
            />
          </Form.Field>
        );

      case "textarea":
        const textareaIsEmpty = !value || (typeof value === 'string' && value.trim() === '');
        const textareaRequireDescription = field.required && textareaIsEmpty 
          ? (error || requiredMessage(field.label))
          : undefined;
        return (
          <Form.Field 
            key={field.name}
            requireDescription={textareaRequireDescription}
            helpText={!textareaRequireDescription ? field.helpText : undefined}
            className={gridCols > 1 ? `col-span-${gridCols}` : ""}
          >
            <Form.Label htmlFor={field.name} required={field.required}>
              {field.label}
            </Form.Label>
            <Form.Textarea
              id={field.name}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={field.disabled}
              placeholder={field.placeholder}
            />
          </Form.Field>
        );

      case "select":
        const selectIsEmpty = !value || value === 0 || value === '';
        const selectRequireDescription = field.required && selectIsEmpty 
          ? (error || requiredMessage(field.label))
          : undefined;
        return (
          <Form.Field 
            key={field.name}
            requireDescription={selectRequireDescription}
            helpText={!selectRequireDescription ? field.helpText : undefined}
            className={gridCols > 1 ? `col-span-${gridCols}` : ""}
          >
            <Form.Label htmlFor={field.name} required={field.required}>
              {field.label}
            </Form.Label>
            <Form.Select
              id={field.name}
              value={value ? value.toString() : ""}
              onValueChange={(val) => handleFieldChange(field.name, val)}
              placeholder={field.placeholder || defaultSelectPlaceholder}
              error={!!error}
            >
              {field.options?.map((option) => (
                <Form.SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </Form.SelectItem>
              ))}
            </Form.Select>
          </Form.Field>
        );

      case "switch":
        return (
          <Form.Field 
            key={field.name}
            requireDescription={error}
            helpText={field.helpText}
            className={gridCols > 1 ? `col-span-${gridCols}` : ""}
          >
            <Form.Switch
              id={field.name}
              checked={!!value}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
              label={field.label}
            />
          </Form.Field>
        );

      case "checkbox":
        return (
          <Form.Field 
            key={field.name}
            requireDescription={error}
            helpText={field.helpText}
            className={gridCols > 1 ? `col-span-${gridCols}` : ""}
          >
            <Form.Checkbox
              id={field.name}
              checked={!!value}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
              label={field.label}
            />
          </Form.Field>
        );

      default:
        return null;
    }
  }, [formData, errors, handleFieldChange, requiredMessage, defaultSelectPlaceholder]);

  // 초기 데이터 동기화 (다이얼로그가 열릴 때만)
  React.useEffect(() => {
    if (open) {
      setFormData(initialData || {});
      setErrors({});
    } else {
      // 다이얼로그가 닫힐 때 초기화
      setFormData({});
      setErrors({});
    }
  }, [open, initialData]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && fields.every(field => !field.required || formData[field.name]);
  }, [errors, fields, formData]);

  return (
    <DialogPresets.form
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      onSubmit={handleSubmit}
      submitLabel={submitText}
      cancelLabel={cancelText}
      submitDisabled={!isValid}
      size={size}
    >
      <Form.Section>
        <Form.Group columns={columns as 1 | 2 | 3 | 4}>
          {fields.map((field) => {
            // 빈 공간 처리
            if (field.spacer) {
              return <div key={`spacer-${field.name}`}></div>;
            }
            return renderField(field);
          })}
        </Form.Group>
      </Form.Section>
      {customContent && (
        <div className="mt-4">
          {customContent}
        </div>
      )}
    </DialogPresets.form>
  );
}

