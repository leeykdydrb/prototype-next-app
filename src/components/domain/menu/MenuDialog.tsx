"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, FormField, FormGroup, FormSection, Input, Label, Select, SelectItem, Switch } from "@/components/framework/form";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/framework/layout";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/framework/command";
import { PopoverComponents } from "@/components/framework";
import { Badge } from "@/components/framework/data-display";

import { Check, ChevronsUpDown, X } from "lucide-react";
import type { MenuTree, MenuInput, MenuDialogProps } from "@/types/menu";
import type { PermissionData } from "@/types/permission";
import { usePermissionQuery } from '@/hooks/permission/usePermissionQuery';
import { MENU_ICONS, MESSAGES } from '@/constants/menu';

// 초기 폼 데이터 생성 함수
const getInitialFormData = (menu: MenuTree | null): MenuInput => {
  if (menu) {
    return {
      title: menu.title,
      path: menu.path || '',
      icon: menu.icon || '',
      parentId: menu.parentId,
      order: menu.order,
      isActive: menu.isActive,
      isSystem: menu.isSystem,
      permissionIds: menu.permissionIds || [],
    };
  }
  
  return {
    title: '',
    path: '',
    icon: '',
    parentId: null,
    order: 1,
    isActive: true,
    isSystem: false,
    permissionIds: []
  };
};

// 부모 메뉴 옵션 (현재 편집 중인 메뉴와 그 하위 메뉴 제외)
const getParentMenuOptions = (
  menus: MenuTree[],
  excludeId?: number
): MenuTree[] => {
  return menus
    .filter((menu) => menu.id !== excludeId)
    .map((menu) => ({
      ...menu,
      children: menu.children?.filter((child) => child.id !== excludeId) || [],
    }));
};

const isFormValid = (form: MenuInput) => {
  if (!form.title?.trim()) return false;
  if (!form.permissionIds || form.permissionIds.length === 0) return false;
  return true;
};

export default function MenuDialog({ open, onClose, onSubmit, menu, menus }: MenuDialogProps) {
  const [formData, setFormData] = useState<MenuInput>(() => getInitialFormData(null));
  const [editingMenu, setEditingMenu] = useState<MenuTree | null>(null);
  const [permissionOpen, setPermissionOpen] = useState(false);
  const { data: permissions = [] } = usePermissionQuery({ isActive: true });
  const isValid = useMemo(() => isFormValid(formData), [formData]);

  useEffect(() => {
    if (open) {
      setEditingMenu(menu)
      setFormData(getInitialFormData(menu));
    }
  }, [menu, open]);

  const handleFieldChange = useCallback(<K extends keyof MenuInput>(
    field: K,
    value: MenuInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!isValid) {
      alert(MESSAGES.MENU_REQUIRED_FIELDS);
      return;
    }
    onSubmit(formData);
  }, [isValid, formData, onSubmit]);

  const handlePermissionToggle = useCallback((permission: PermissionData) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permission.id)
        ? prev.permissionIds.filter((id) => id !== permission.id)
        : [...prev.permissionIds, permission.id],
    }));
  }, []);

  const selectedPermissions = useMemo(() => {
    return permissions.filter((p) => formData.permissionIds.includes(p.id));
  }, [permissions, formData.permissionIds]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="3xl">
        <DialogHeader
          title={editingMenu ? "메뉴 수정" : "메뉴 추가"}
          description="메뉴 정보를 입력하고 권한을 선택하세요. 필수 항목은 메뉴명과 권한입니다."
        />
        <DialogBody>
          <FormSection>
            <FormGroup columns={2} className="pb-0">
              <FormField helpText="사용자에게 표시될 메뉴명 입니다">
                <Label htmlFor="title" required>메뉴명</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="예: 대시보드"
                  required={formData.title.trim() === ''}
                  autoFocus={!menu}
                />
              </FormField>

              <FormField helpText="메뉴의 경로를 입력하세요">
                <Label htmlFor="path">경로 {formData.isSystem ? "" : "(선택사항)"}</Label>
                <Input
                  id="path"
                  value={formData.path || ""}
                  onChange={(e) => handleFieldChange("path", e.target.value)}
                  placeholder="예: /dashboard, /admin/users"
                  disabled={formData.isSystem}
                />
              </FormField>
            </FormGroup>

            <FormGroup columns={2} className="pb-0">
              <FormField helpText="메뉴에 표시될 아이콘을 선택하세요">
                <Label htmlFor="menuIcon">아이콘</Label>
                <Select
                  id="menuIcon"
                  value={formData.icon || "none"}
                  onValueChange={(value) => handleFieldChange("icon", value === "none" ? "" : value)}
                  placeholder="아이콘 선택"
                  className="w-auto"
                >
                  <SelectItem value="none">없음</SelectItem>
                  {MENU_ICONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </Select>
              </FormField>

              <FormField helpText="상위 메뉴를 선택하세요">
                <Label htmlFor="parentMenu">상위 메뉴</Label>
                <Select
                  id="parentMenu"
                  value={formData.parentId?.toString() || "none"}
                  onValueChange={(value) => handleFieldChange("parentId", value === "none" ? null : Number(value))}
                  placeholder="상위 메뉴 선택"
                  className="w-auto"
                >
                  <SelectItem value="none">최상위 메뉴</SelectItem>
                  {getParentMenuOptions(menus, menu?.id).map((m) => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      {m.title}
                    </SelectItem>
                  ))}
                </Select>
              </FormField>
            </FormGroup>

            <FormGroup columns={2} className="pb-0">
              <FormField helpText="메뉴의 표시 순서를 입력하세요">
                <Label htmlFor="order">순서</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleFieldChange("order", Number(e.target.value))}
                  min={1}
                  step={1}
                />
              </FormField>

              <FormField helpText="메뉴에 필요한 권한을 선택하세요">
                <Label required>권한</Label>
                <PopoverComponents.Root open={permissionOpen} onOpenChange={setPermissionOpen} modal={true}>
                  <PopoverComponents.Trigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={permissionOpen}
                      className="w-full justify-between"
                      disabled={formData.isSystem}
                    >
                      {selectedPermissions.length > 0
                        ? `${selectedPermissions.length}개 선택됨`
                        : "권한 선택"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverComponents.Trigger>
                  <PopoverComponents.Content className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="권한 검색..." />
                      <CommandList>
                        <CommandEmpty>권한을 찾을 수 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {permissions.map((permission) => (
                            <CommandItem
                              key={permission.id}
                              value={`${permission.name} ${permission.displayName}`}
                              onSelect={() => handlePermissionToggle(permission)}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.permissionIds.includes(permission.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{permission.displayName}</div>
                                <div className="text-sm text-muted-foreground">{permission.name}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverComponents.Content>
                </PopoverComponents.Root>
                {selectedPermissions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedPermissions.map((permission) => (
                      <Badge key={permission.id} variant="secondary" className="text-xs py-1">
                        {permission.displayName}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-3 w-3 hover:bg-transparent"
                          onClick={() => handlePermissionToggle(permission)}
                        >
                          <X />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </FormField>
            </FormGroup>

            <FormGroup>
              <FormField helpText="메뉴의 활성화 상태를 설정하세요">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
                  disabled={formData.isSystem}
                  label="활성화"
                />
              </FormField>
            </FormGroup>
          </FormSection>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {editingMenu ? "수정" : "추가"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}