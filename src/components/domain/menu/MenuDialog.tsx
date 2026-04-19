"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button, FormField, FormGroup, FormSection, Input, Label, Select, SelectItem, Switch } from "@/components/framework/form";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/framework/layout";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/framework/command";
import { PopoverComponents } from "@/components/framework";
import { Badge } from "@/components/framework/data-display";

import { Check, ChevronsUpDown, X } from "lucide-react";
import type { MenuTree, MenuInput, MenuDialogProps } from "@/types/menu";
import type { PermissionData } from "@/types/permission";
import { usePermissionQuery } from '@/hooks/permission/usePermissionQuery';
import { MENU_ICONS } from '@/constants/menu';
import { showError } from "@/lib/toast";

// 초기 폼 데이터 생성 함수
const getInitialFormData = (menu: MenuTree | null): MenuInput => {
  if (menu) {
    return {
      title: menu.title,
      titleKey: menu.titleKey,
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
    titleKey: '',
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
  if (!form.titleKey?.trim()) return false;
  if (!form.permissionIds || form.permissionIds.length === 0) return false;
  return true;
};

export default function MenuDialog({ open, onClose, onSubmit, menu, menus }: MenuDialogProps) {
  const t = useTranslations("AdminMenus.dialog");
  const tf = useTranslations("AdminMenus.dialog.fields");
  const tToast = useTranslations("AdminMenus.toast");

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
      showError(tToast("requiredFields"));
      return;
    }
    onSubmit(formData);
  }, [isValid, formData, onSubmit, tToast]);

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
          title={editingMenu ? t("titleEdit") : t("titleCreate")}
          description={t("description")}
        />
        <DialogBody>
          <FormSection>
            <FormGroup columns={2} className="pb-0">
              <FormField helpText={tf("titleHelp")}>
                <Label htmlFor="title" required>{tf("title")}</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder={tf("titlePlaceholder")}
                  required={formData.title.trim() === ''}
                  autoFocus={!menu}
                />
              </FormField>

              <FormField helpText={tf("titleKeyHelp")}>
                <Label htmlFor="titleKey" required>{tf("titleKey")}</Label>
                <Input
                  id="titleKey"
                  value={formData.titleKey}
                  onChange={(e) => handleFieldChange("titleKey", e.target.value)}
                  placeholder={tf("titleKeyPlaceholder")}
                  required={formData.titleKey.trim() === ''}
                />
              </FormField>

              <FormField helpText={tf("pathHelp")}>
                <Label htmlFor="path">
                  {tf("path")} {formData.isSystem ? "" : tf("pathOptionalSuffix")}
                </Label>
                <Input
                  id="path"
                  value={formData.path || ""}
                  onChange={(e) => handleFieldChange("path", e.target.value)}
                  placeholder={tf("pathPlaceholder")}
                  disabled={formData.isSystem}
                />
              </FormField>
            </FormGroup>

            <FormGroup columns={2} className="pb-0">
              <FormField helpText={tf("iconHelp")}>
                <Label htmlFor="menuIcon">{tf("icon")}</Label>
                <Select
                  id="menuIcon"
                  value={formData.icon || "none"}
                  onValueChange={(value) => handleFieldChange("icon", value === "none" ? "" : value)}
                  placeholder={tf("iconPlaceholder")}
                  className="w-auto"
                >
                  <SelectItem value="none">{tf("iconNone")}</SelectItem>
                  {MENU_ICONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </Select>
              </FormField>

              <FormField helpText={tf("parentMenuHelp")}>
                <Label htmlFor="parentMenu">{tf("parentMenu")}</Label>
                <Select
                  id="parentMenu"
                  value={formData.parentId?.toString() || "none"}
                  onValueChange={(value) => handleFieldChange("parentId", value === "none" ? null : Number(value))}
                  placeholder={tf("parentMenuPlaceholder")}
                  className="w-auto"
                >
                  <SelectItem value="none">{tf("parentMenuNone")}</SelectItem>
                  {getParentMenuOptions(menus, menu?.id).map((m) => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      {m.title}
                    </SelectItem>
                  ))}
                </Select>
              </FormField>
            </FormGroup>

            <FormGroup columns={2} className="pb-0">
              <FormField helpText={tf("orderHelp")}>
                <Label htmlFor="order">{tf("order")}</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleFieldChange("order", Number(e.target.value))}
                  min={1}
                  step={1}
                />
              </FormField>

              <FormField helpText={tf("permissionsHelp")}>
                <Label required>{tf("permissions")}</Label>
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
                        ? tf("permissionsSelectedCount", { count: selectedPermissions.length })
                        : tf("permissionsSelect")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverComponents.Trigger>
                  <PopoverComponents.Content className="w-full p-0">
                    <Command>
                      <CommandInput placeholder={tf("permissionsSearch")} />
                      <CommandList>
                        <CommandEmpty>{tf("permissionsEmpty")}</CommandEmpty>
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
              <FormField helpText={tf("isActiveHelp")}>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
                  disabled={formData.isSystem}
                  label={tf("isActiveLabel")}
                />
              </FormField>
            </FormGroup>
          </FormSection>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {editingMenu ? t("submitEdit") : t("submitCreate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}