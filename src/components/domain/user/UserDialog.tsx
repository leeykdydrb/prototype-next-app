"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Form, FormDialog, Alert, AccordionComponents } from "@/components/framework";

import type { UserDialogProps, UserInput, UserData } from "@/types/user";
import type { PermissionData } from "@/types/permission";
import { usePermissionQuery } from '@/hooks/permission/usePermissionQuery';
import { MESSAGES } from '@/constants/user';
import { showError } from '@/lib/toast';

// 초기 폼 데이터 생성 함수
const getInitialFormData = (user: UserData | null): UserInput => {
  if (user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: "", // 수정 시 비밀번호는 빈 값
      roleId: user.role.id,
      isSystem: user.isSystem,
      isActive: user.isActive,
      permissionIds: user.userPermissions
        .filter(perm => perm.granted)
        .map(perm => perm.permissionId) || [],
    };
  }
  
  return {
    id: "",
    name: "",
    email: "",
    password: "",
    roleId: 0,
    isSystem: false,
    isActive: true,
    permissionIds: []
  };
};

// 폼 유효성 검사 함수 메모화
const isFormValid = (form: UserInput, isNewUser: boolean) => {
  if (!form.id?.trim()) return false;
  if (!form.name?.trim()) return false;
  if (!form.email?.trim()) return false;
  if (!form.roleId) return false;
  if (isNewUser && !form.password) return false;
  return true;
};

// 권한 카테고리 컴포넌트 분리 및 메모화
const PermissionCategory = React.memo(({ 
  category, 
  permissions, 
  selectedPermissionIds, 
  onPermissionToggle 
}: {
  category: string;
  permissions: PermissionData[];
  selectedPermissionIds: number[];
  onPermissionToggle: (permissionId: number) => void;
}) => {
  const selectedCount = permissions.filter(p => selectedPermissionIds.includes(p.id)).length;

  return (
    <div className="col-span-1">
      <AccordionComponents.Root type="multiple">
        <AccordionComponents.Item value={category}>
          <AccordionComponents.Trigger>
            {category} ({selectedCount}/{permissions.length})
          </AccordionComponents.Trigger>
          <AccordionComponents.Content>
            {permissions.map((permission) => (
              <Form.Checkbox
                key={permission.id}
                id={permission.id.toString()}
                checked={selectedPermissionIds.includes(permission.id)}
                onCheckedChange={() => onPermissionToggle(permission.id)}
                label={`${permission.displayName} (${permission.name})`}
              />
            ))}
          </AccordionComponents.Content>
        </AccordionComponents.Item>
      </AccordionComponents.Root>
    </div>
  );
});

PermissionCategory.displayName = 'PermissionCategory';

export default function UserDialog({ open, onClose, onSubmit, user, roles }: UserDialogProps) {
  const [formData, setFormData] = useState<UserInput>(() => getInitialFormData(null));
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const { data: permissions = [] } = usePermissionQuery({ isActive: true });

  useEffect(() => {
    if (open) {
      setEditingUser(user);
      setFormData(getInitialFormData(user));
    }
  }, [user, open]);

  // 권한을 카테고리별로 그룹화 - 메모화
  const permissionsByCategory = useMemo(() => {
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.category.codeName as string]) {
        acc[permission.category.codeName as string] = [];
      }
      acc[permission.category.codeName as string].push(permission);
      return acc;
    }, {} as Record<string, PermissionData[]>);
  }, [permissions]);

  const handlePermissionToggle = useCallback((permissionId: number) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: (prev.permissionIds || []).includes(permissionId)
        ? (prev.permissionIds || []).filter((id) => id !== permissionId)
        : [...(prev.permissionIds || []), permissionId],
    }));
  }, []);

  // FormDialog용 필드 정의
  const formFields = useMemo(() => [
    {
      name: "id",
      label: "아이디",
      type: "text" as const,
      required: true,
      disabled: !!editingUser,
      autoFocus: !editingUser,
    },
    {
      name: "password",
      label: "비밀번호",
      type: "password" as const,
      required: !editingUser,
      helpText: editingUser ? "수정 시 비워두면 변경되지 않습니다." : undefined,
    },
    {
      name: "name",
      label: "이름",
      type: "text" as const,
      required: true,
    },
    {
      name: "email",
      label: "이메일",
      type: "email" as const,
      required: true,
    },
    {
      name: "roleId",
      label: "역할",
      type: "select" as const,
      required: true,
      options: roles.map(role => ({ value: role.id, label: role.displayName })),
    },
    {
      name: "spacer",
      label: "",
      type: "text" as const,
      spacer: true,
    },
    {
      name: "isActive",
      label: "활성화",
      type: "switch" as const,
    },
    {
      name: "isSystem",
      label: "시스템 사용자",
      type: "switch" as const,
    },
  ], [editingUser, roles]);

  // FormDialog의 데이터 변경 핸들러
  const handleFormDataChange = useCallback((data: Record<string, string | number | boolean | null | undefined>) => {
    setFormData((prev) => ({
      ...prev,
      id: data.id !== undefined ? String(data.id) : prev.id,
      name: data.name !== undefined ? String(data.name) : prev.name,
      email: data.email !== undefined ? String(data.email) : prev.email,
      password: data.password !== undefined ? (data.password ? String(data.password) : "") : prev.password,
      roleId: data.roleId !== undefined ? (typeof data.roleId === 'number' ? data.roleId : Number(data.roleId) || 0) : prev.roleId,
      isActive: data.isActive !== undefined ? (typeof data.isActive === 'boolean' ? data.isActive : prev.isActive) : prev.isActive,
      isSystem: data.isSystem !== undefined ? (typeof data.isSystem === 'boolean' ? data.isSystem : prev.isSystem) : prev.isSystem,
    }));
  }, []);

  // 초기 데이터 변환 (다이얼로그가 열릴 때만 사용)
  const initialData = useMemo(() => {
    if (!open) return {};
    return {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      password: formData.password || "",
      roleId: formData.roleId,
      isActive: formData.isActive,
      isSystem: formData.isSystem,
    };
  }, [open, formData]);

  // 유효성 검사
  const isValid = useMemo(() => isFormValid(formData, !editingUser), [formData, editingUser]);

  // 제출 핸들러
  const handleSubmit = useCallback((data: Record<string, string | number | boolean | null | undefined>) => {
    if (!isValid) {
      showError(MESSAGES.USER_REQUIRED_FIELDS);
      return;
    }
    // FormDialog의 data와 현재 formData(권한 포함)를 병합
    const submitData: UserInput = {
      id: String(data.id || formData.id),
      name: String(data.name || formData.name),
      email: String(data.email || formData.email),
      password: data.password ? String(data.password) : formData.password,
      roleId: typeof data.roleId === 'number' ? data.roleId : Number(data.roleId) || 0,
      isActive: typeof data.isActive === 'boolean' ? data.isActive : formData.isActive,
      isSystem: typeof data.isSystem === 'boolean' ? data.isSystem : formData.isSystem,
      permissionIds: formData.permissionIds || [],
    };
    onSubmit(submitData);
  }, [isValid, formData, onSubmit]);

  // 권한 선택 커스텀 콘텐츠 (메모화)
  const permissionContent = useMemo(() => (
    <Form.Section title="권한 선택">
      <Alert variant="warning">
        <strong>주의:</strong> 선택한 권한은 사용자의 역할과 무관하게 직접 부여됩니다. 신중하게 선택해주세요.
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {Object.entries(permissionsByCategory).map(
          ([category, categoryPermissions]) => (
            <PermissionCategory
              key={category}
              category={category}
              permissions={categoryPermissions}
              selectedPermissionIds={formData.permissionIds || []}
              onPermissionToggle={handlePermissionToggle}
            />
          )
        )}
      </div>
    </Form.Section>
  ), [permissionsByCategory, formData.permissionIds, handlePermissionToggle]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingUser ? "사용자 수정" : "사용자 추가"}
      description="사용자 정보를 입력하고 권한을 설정하세요."
      fields={formFields}
      initialData={initialData}
      submitLabel={editingUser ? "수정" : "추가"}
      columns={2}
      size="3xl"
      customContent={permissionContent}
      onFormDataChange={handleFormDataChange}
    />
  );
}
