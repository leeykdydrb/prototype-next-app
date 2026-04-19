"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/framework/data-display";
import { Button, FormField, FormGroup, FormSection, Input, Label, Select, SelectItem, Switch, Textarea } from "@/components/framework/form";
import { Dialog, DialogContent, DialogBody, DialogFooter, DialogHeader } from "@/components/framework/layout";
import { Loader2 } from "lucide-react";
import { usePermissionDetailQuery } from "@/hooks/permission/usePermissionQuery";
import type { PermissionData, PermissionInput, PermissionDialogProps } from "@/types/permission";
import { showError } from "@/lib/toast";

// 초기 폼 데이터 생성 함수
const getInitialFormData = (permission: PermissionData | null): PermissionInput => {
  if (permission) {
    return {
      name: permission.name,
      displayName: permission.displayName,
      categoryId: permission.categoryId,
      description: permission.description || "",
      isSystem: permission.isSystem,
      isActive: permission.isActive,
    };
  }
  
  return {
    name: "",
    displayName: "",
    categoryId: 0,
    description: "",
    isSystem: false,
    isActive: true,
  };
};

// 폼 유효성 검사 함수
const isFormValid = (form: PermissionInput): boolean => {
  return form.name.trim() !== '' && form.displayName.trim() !== '' && form.categoryId !== 0;
};

export default function PermissionDialog({ open, onClose, onSubmit, permission, categories }: PermissionDialogProps) {
  const t = useTranslations("AdminPermissions.dialog");
  const tf = useTranslations("AdminPermissions.dialog.fields");
  const tToast = useTranslations("AdminPermissions.toast");
  const tUsage = useTranslations("AdminPermissions.dialog.usage");

  const [formData, setFormData] = useState<PermissionInput>(() => getInitialFormData(null));
  const [editingPermission, setEditingPermission] = useState<PermissionData | null>(null);
  const { data: permissionDetail, isLoading: isDetailLoading } = usePermissionDetailQuery(editingPermission?.id ?? 0, !!editingPermission?.id && open);
  const isValid = useMemo(() => isFormValid(formData), [formData]);

  // 권한 데이터가 변경될 때 폼 데이터 초기화
  useEffect(() => {
    if (open) {
      setEditingPermission(permission);
      setFormData(getInitialFormData(permission));
    }
  }, [permission, open]);

  // 폼 필드 변경 핸들러
  const handleFieldChange = useCallback(<K extends keyof PermissionInput>(
    field: K,
    value: PermissionInput[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // 권한명 입력 시 소문자로 변환하고 특수문자 제거
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9.]/g, '');
    handleFieldChange('name', value);
  }, [handleFieldChange]);

  const handleSelectChange = useCallback((value: string) => {
    handleFieldChange('categoryId', Number(value) || 0);
  }, [handleFieldChange]);

  const handleSubmit = useCallback(() => {
    if (!isValid) {
      showError(tToast("requiredFields"));
      return;
    }
    onSubmit(formData);
  }, [isValid, formData, onSubmit, tToast]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader
          title={editingPermission ? t("titleEdit") : t("titleCreate")}
          description={t("description")}
        />
        <DialogBody>
          <FormSection>
            <FormGroup className="pb-0">
              <FormField helpText={tf("nameHelp")}>
                <Label htmlFor="permissionName" required>{tf("name")}</Label>
                <Input
                  id="permissionName"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder={tf("namePlaceholder")}
                  className="lowercase"
                  required={formData.name.trim() === ''}
                  autoFocus={!editingPermission}
                />
              </FormField>
            </FormGroup>
            <FormGroup columns={2} className="pb-0">
              <FormField>
                <Label htmlFor="displayName" required>{tf("displayName")}</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleFieldChange('displayName', e.target.value)}
                  placeholder={tf("displayNamePlaceholder")}
                  required={formData.displayName.trim() === ''}
                />
              </FormField>
              <FormField>
                <Label htmlFor="category" required>{tf("category")}</Label>
                <Select
                  id="category"
                  value={formData.categoryId ? formData.categoryId.toString() : ""}
                  onValueChange={handleSelectChange}
                  placeholder={tf("categoryPlaceholder")}
                  error={formData.categoryId === 0}
                >
                  <SelectItem value="none">{tf("categoryNone")}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.codeName}
                    </SelectItem>
                  ))}
                </Select>
              </FormField>
            </FormGroup>
            <FormGroup>
              <FormField>
                <Label htmlFor="description">{tf("description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder={tf("descriptionPlaceholder")}
                />
              </FormField>
              <FormField>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleFieldChange('isActive', checked)}
                  disabled={formData.isSystem}
                  label={tf("isActiveLabel")}
                  id="isActive"
                />
              </FormField>
            </FormGroup>
          </FormSection>
          {editingPermission && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium">{tUsage("title")}</h4>
              {isDetailLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">{tUsage("loading")}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {tUsage("rolesTitle", { count: permissionDetail?.rolePermissions.length || 0 })}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {permissionDetail?.rolePermissions.map((rp) => (
                        <Badge key={rp.role.id} variant="secondary" className="text-xs">
                          {rp.role.displayName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {tUsage("usersTitle", { count: permissionDetail?.userPermissions.length || 0 })}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {permissionDetail?.userPermissions.map((up) => (
                        <Badge key={up.user.id} variant="outline" className="text-xs">
                          {up.user.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {tUsage("menusTitle", { count: permissionDetail?.menuPermissions.length || 0 })}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {permissionDetail?.menuPermissions.map((mp) => (
                        <Badge key={mp.menu.id} variant="default" className="text-xs">
                          {mp.menu.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogBody>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {editingPermission ? t("submitEdit") : t("submitCreate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
