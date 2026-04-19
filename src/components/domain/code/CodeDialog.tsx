"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, FormField, FormGroup,FormSection,Input, Label, Switch, Textarea } from "@/components/framework/form";
import { Dialog, DialogContent, DialogBody, DialogFooter, DialogHeader } from "@/components/framework/layout";
import { Alert } from "@/components/framework/feedback";
import type { CodeDialogProps, CodeData, CodeInput } from "@/types/code";
import { showError } from "@/lib/toast";
import { useTranslations } from "next-intl";

// 초기 폼 데이터 생성 함수
const getInitialFormData = (code: CodeData | null, selectedGroupId: number): CodeInput => {
  if (code) {
    return {
      code: code.code,
      codeName: code.codeName,
      description: code.description || "",
      sortOrder: code.sortOrder,
      groupId: code.groupId,
      isSystem: code.isSystem,
      isActive: code.isActive
    };
  }
  
  return {
    code: "",
    codeName: "",
    description: "",
    sortOrder: 1,
    groupId: selectedGroupId,
    isSystem: false,
    isActive: true
  };
};

const isFormValid = (form: CodeInput) => {
  if (!form.code.trim()) return false;
  if (!form.codeName.trim()) return false;
  return true;
};

export default function CodeDialog({ open, onClose, onSubmit, code, selectedGroupId }: CodeDialogProps) {
  const t = useTranslations("AdminCodes.dialogs.code");
  const tToast = useTranslations("AdminCodes.toast");
  const tActions = useTranslations("AdminCodes.actions");
  const [formData, setFormData] = useState<CodeInput>(() => getInitialFormData(null, 0));
  const [editingCode, setEditingCode] = useState<CodeData | null>(null);
  const isValid = useMemo(() => isFormValid(formData), [formData]);

  useEffect(() => {
    if (open) {
      setEditingCode(code)
      setFormData(getInitialFormData(code, Number(selectedGroupId)));
    }
  }, [code, open, selectedGroupId]);

  const handleChange = (field: keyof CodeInput) => (
    value: string | boolean | number
  ) => {
    const processedValue = field === "groupId" || field === "sortOrder"
      ? Number(value)
      : value;
      
    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const handleSubmit = useCallback(() => {
    if (!isValid) {
      showError(tToast("requiredFields"));
      return;
    }
    onSubmit({
      ...formData,
      code: formData.code.trim().toUpperCase(),
      codeName: formData.codeName.trim(),
      description: formData.description?.trim() || null,
    });
  }, [isValid, formData, onSubmit, tToast]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader
          title={editingCode ? t("titleEdit") : t("titleCreate")}
          description={t("description")}
        />
        <DialogBody>
          {code?.isSystem && (
            <Alert variant="warning" className="mb-4">
              {t("systemEditWarning")}
            </Alert>
          )}
          <FormSection>
            <FormGroup columns={2} className="pb-0">
              <FormField>
                <Label htmlFor="code" required>{t("fields.code")}</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("code")(e.target.value)}
                  disabled={editingCode?.code ? true : false}
                  placeholder={t("fields.codePlaceholder")}
                  className="uppercase"
                  required={formData.code.trim() === ''}
                  autoFocus={!editingCode}
                />
              </FormField>
              <FormField>
                <Label htmlFor="codeName" required>{t("fields.codeName")}</Label>
                <Input
                  id="codeName"
                  value={formData.codeName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("codeName")(e.target.value)}
                  disabled={code?.isSystem}
                  placeholder={t("fields.codeNamePlaceholder")}
                  required={formData.codeName.trim() === ''}
                />
              </FormField>
            </FormGroup>
            <FormGroup columns={2} className="pb-0">
              <FormField>
                <Label htmlFor="sortOrder">{t("fields.sortOrder")}</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("sortOrder")(e.target.value)}
                  disabled={code?.isSystem}
                  min={1}
                  step={1}
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
                  disabled={code?.isSystem}
                  placeholder={t("fields.descriptionPlaceholder")}
                />
              </FormField>
            </FormGroup>
            <FormGroup>
              <FormField>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange("isActive")(checked)}
                  disabled={code?.isSystem}
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
            {editingCode ? tActions("edit") : tActions("add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 