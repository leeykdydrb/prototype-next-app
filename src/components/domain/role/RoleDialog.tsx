"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Form, DialogComponents, AccordionComponents } from "@/components/framework";

import type { RoleData, RoleInput, RoleDialogProps } from "@/types/role";
import type { PermissionData } from "@/types/permission";

import { usePermissionQuery } from '@/hooks/permission/usePermissionQuery';
import { showError } from "@/lib/toast";

// 초기 폼 데이터 생성 함수
const getInitialFormData = (role: RoleData | null): RoleInput => {
  if (role) {
    return {
      name: role.name,
      displayName: role.displayName,
      description: role.description || "",
      isSystem: role.isSystem,
      isActive: role.isActive,
      permissionIds: role.rolePermissions.map(p => p.permissionId) || [],
    };
  }
  
  return {
    name: "",
    displayName: "",
    description: "",
    isSystem: false,
    isActive: true,
    permissionIds: []
  };
};

// 폼 유효성 검사 함수 메모화
const isFormValid = (form: RoleInput) => {
  if (!form.name?.trim()) return false;
  if (!form.displayName?.trim()) return false;
  if (!form.permissionIds || form.permissionIds.length === 0) return false;
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

export default function RoleDialog({ open, onClose, onSubmit, role }: RoleDialogProps) {
  const t = useTranslations("AdminRoles.dialog");
  const tFields = useTranslations("AdminRoles.dialog.fields");
  const tToast = useTranslations("AdminRoles.toast");

  const [formData, setFormData] = useState<RoleInput>(() => getInitialFormData(null));
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const { data: permissions = [] } = usePermissionQuery({ isActive: true });
  const isValid = useMemo(() => isFormValid(formData), [formData]);

  useEffect(() => {
    if (open) {
      setEditingRole(role);
      setFormData(getInitialFormData(role));
    }
  }, [role, open]);

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

  // 핸들러 함수들 메모화
  const handleFieldChange = useCallback(<K extends keyof RoleInput>(
    field: K,
    value: RoleInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isValid) {
      showError(tToast("requiredFields"));
      return;
    }
    onSubmit(formData);
  }, [isValid, formData, onSubmit, tToast]);

  const handlePermissionToggle = useCallback((permissionId: number) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  }, []);

  return (
    <DialogComponents.Root open={open} onOpenChange={onClose}>
      <DialogComponents.Content size="3xl">
        <DialogComponents.Header
          title={editingRole ? t("titleEdit") : t("titleCreate")}
          description={t("description")}
        />
        <DialogComponents.Body>
          <Form.Section>
            <Form.Group columns={2} className="pb-0">
              <Form.Field helpText={tFields("nameHelp")}>
                <Form.Label htmlFor="roleName" required>{tFields("name")}</Form.Label>
                <Form.Input
                  id="roleName"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value.toUpperCase())}
                  placeholder={tFields("namePlaceholder")}
                  className="uppercase"
                  required={formData.name.trim() === ''}
                  autoFocus={!role}
                />
              </Form.Field>
              <Form.Field helpText={tFields("displayNameHelp")}>
                <Form.Label htmlFor="displayName" required>{tFields("displayName")}</Form.Label>
                <Form.Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleFieldChange('displayName', e.target.value)}
                  placeholder={tFields("displayNamePlaceholder")}
                  required={formData.displayName.trim() === ''}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field helpText={tFields("descriptionHelp")}>
                <Form.Label htmlFor="description">{tFields("description")}</Form.Label>
                <Form.Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder={tFields("descriptionPlaceholder")}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field>
                <Form.Label required>{tFields("permissions")}</Form.Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(permissionsByCategory).map(
                    ([category, categoryPermissions]) => (
                      <PermissionCategory
                        key={category}
                        category={category}
                        permissions={categoryPermissions}
                        selectedPermissionIds={formData.permissionIds}
                        onPermissionToggle={handlePermissionToggle}
                      />
                    )
                  )}
                </div>
              </Form.Field>
            </Form.Group>
          </Form.Section>
        </DialogComponents.Body>

        <DialogComponents.Footer>
          <Form.Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Form.Button>
          <Form.Button onClick={handleSubmit} disabled={!isValid}>
            {editingRole ? t("submitEdit") : t("submitCreate")}
          </Form.Button>
        </DialogComponents.Footer>
      </DialogComponents.Content>
    </DialogComponents.Root>
  );
}