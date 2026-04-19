"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, FormField, FormGroup, FormSection, Input, Label, Select, SelectItem, Switch, Textarea } from "@/components/framework/form";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/framework/layout";
import type { CodeGroupInput, CodeGroupTree, CodeGroupDialogProps } from "@/types/code-group";
import { showError } from "@/lib/toast";
import { useTranslations } from "next-intl";

// 초기 폼 데이터 생성 함수
const getInitialFormData = (codeGroup: CodeGroupTree | null): CodeGroupInput => {
  if (codeGroup) {
    return {
      groupCode: codeGroup.groupCode,
      groupName: codeGroup.groupName,
      description: codeGroup.description || "",
      parentId: codeGroup.parentId,
      isSystem: codeGroup.isSystem,
      isActive: codeGroup.isActive,
    };
  }
  
  return {
    groupCode: "",
    groupName: "",
    description: "",
    parentId: null,
    isSystem: false,
    isActive: true,
  };
};

// 재귀적으로 부모 그룹 옵션을 렌더링하는 함수
const renderParentGroupOptions = (codeGroups: CodeGroupTree[], excludeId?: number, level = 0): React.ReactElement[] => {
  const options: React.ReactElement[] = [];
    
  codeGroups.forEach((group) => {
    if (excludeId && group.id === excludeId || !group.isActive || group.isSystem) {
      return;
    }

    options.push(
      <SelectItem key={group.id} value={group.id.toString()}>
        {level > 0 && "└ "}{group.groupName}
      </SelectItem>
    );
      
    if (group.children && group.children.length > 0) {
      options.push(...renderParentGroupOptions(group.children, excludeId, level + 1));
    }
  });
    
  return options;
};

const isFormValid = (form: CodeGroupInput) => {
  if (!form.groupCode.trim()) return false;
  if (!form.groupName.trim()) return false;
  return true;
};

export default function CodeGroupDialog({ open, onClose, onSubmit, codeGroup, codeGroups = [] }: CodeGroupDialogProps) {
  const t = useTranslations("AdminCodes.dialogs.group");
  const tConfirm = useTranslations("AdminCodes.toast");
  const tActions = useTranslations("AdminCodes.actions");
  const [formData, setFormData] = useState<CodeGroupInput>(() => getInitialFormData(null));
  const [editingCodeGroup, setEditingCodeGroup] = useState<CodeGroupTree | null>(null);
  const isValid = useMemo(() => isFormValid(formData), [formData]);

  useEffect(() => {
    if (open) {
      setEditingCodeGroup(codeGroup)
      setFormData(getInitialFormData(codeGroup));
    }
  }, [codeGroup, open]);

  const handleChange = (field: keyof CodeGroupInput) => (
    value: string | boolean | number | null
  ) => {
    const processedValue = field === "parentId"
      ? value === null ? null : Number(value) || null
      : value;
      
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const handleSubmit = useCallback(() => {
    if (!isValid) {
      showError(tConfirm("requiredFields"));
      return;
    }
    onSubmit({
      ...formData,
      groupCode: formData.groupCode.trim().toUpperCase(),
      groupName: formData.groupName.trim(),
      description: formData.description?.trim() || null,
    });
  }, [isValid, formData, onSubmit, tConfirm]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader
          title={editingCodeGroup ? t("titleEdit") : t("titleCreate")}
          description={t("description")}
        />
        <DialogBody>
          <FormSection>
            <FormGroup columns={2} className="pb-0">
              <FormField>
                <Label htmlFor="groupCode" required>{t("fields.groupCode")}</Label>
                <Input
                  id="groupCode"
                  value={formData.groupCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("groupCode")(e.target.value)}
                  disabled={editingCodeGroup ? true : false}
                  placeholder={t("fields.groupCodePlaceholder")}
                  className="uppercase"
                  required={formData.groupCode.trim() === ''}
                  autoFocus={!editingCodeGroup}
                />
              </FormField>
              <FormField>
                <Label htmlFor="groupName" required>{t("fields.groupName")}</Label>
                <Input
                  id="groupName"
                  value={formData.groupName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("groupName")(e.target.value)}
                  disabled={codeGroup?.isSystem}
                  placeholder={t("fields.groupNamePlaceholder")}
                  required={formData.groupName.trim() === ''}
                />
              </FormField>
            </FormGroup>
            <FormGroup className="pb-0">
              <FormField>
                <Label htmlFor="description">{t("fields.description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("description")(e.target.value)}
                  disabled={codeGroup?.isSystem}
                  placeholder={t("fields.descriptionPlaceholder")}
                />
              </FormField>
            </FormGroup>
            <FormGroup className="pb-0">
              <FormField>
                <Label htmlFor="parentCodeGroup">{t("fields.parentGroup")}</Label>
                <Select
                  id="parentCodeGroup"
                  value={formData.parentId?.toString() || "none"}
                  onValueChange={(value) => handleChange("parentId")(value === "none" ? null : value)}
                  disabled={formData.isSystem}
                  placeholder={t("fields.parentGroupPlaceholder")}
                  className="w-auto"
                >
                  <SelectItem value="none">{t("fields.parentGroupNone")}</SelectItem>
                  {renderParentGroupOptions(codeGroups, codeGroup?.id)}
                </Select>
              </FormField>
            </FormGroup>
            <FormGroup>
              <FormField>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange("isActive")(checked)}
                  disabled={formData.isSystem}
                  label={t("fields.isActiveLabel")}
                />
              </FormField>
            </FormGroup>
          </FormSection>
        </DialogBody>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {tActions("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {editingCodeGroup ? tActions("edit") : tActions("add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 