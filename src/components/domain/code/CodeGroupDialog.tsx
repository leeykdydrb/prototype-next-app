"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, FormField, FormGroup, FormSection, Input, Label, Select, SelectItem, Switch, Textarea } from "@/components/framework/form";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from "@/components/framework/layout";
import type { CodeGroupInput, CodeGroupTree, CodeGroupDialogProps } from "@/types/code-group";
import { MESSAGES } from "@/constants/code";

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
      alert(MESSAGES.REQUIRED_FIELDS);
      return;
    }
    onSubmit({
      ...formData,
      groupCode: formData.groupCode.trim().toUpperCase(),
      groupName: formData.groupName.trim(),
      description: formData.description?.trim() || null,
    });
  }, [isValid, formData, onSubmit]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader
          title={editingCodeGroup ? "코드 그룹 수정" : "코드 그룹 추가"}
          description="코드 그룹 정보를 입력하세요. 필수 항목은 그룹 코드와 그룹명입니다."
        />
        <DialogBody>
          <FormSection>
            <FormGroup columns={2} className="pb-0">
              <FormField>
                <Label htmlFor="groupCode" required>그룹 코드</Label>
                <Input
                  id="groupCode"
                  value={formData.groupCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("groupCode")(e.target.value)}
                  disabled={editingCodeGroup ? true : false}
                  placeholder="예: USER_TYPE"
                  className="uppercase"
                  required={formData.groupCode.trim() === ''}
                  autoFocus={!editingCodeGroup}
                />
              </FormField>
              <FormField>
                <Label htmlFor="groupName" required>그룹명</Label>
                <Input
                  id="groupName"
                  value={formData.groupName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("groupName")(e.target.value)}
                  disabled={codeGroup?.isSystem}
                  placeholder="예: 사용자 유형"
                  required={formData.groupName.trim() === ''}
                />
              </FormField>
            </FormGroup>
            <FormGroup className="pb-0">
              <FormField>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("description")(e.target.value)}
                  disabled={codeGroup?.isSystem}
                  placeholder="코드 그룹에 대한 설명을 입력하세요"
                />
              </FormField>
            </FormGroup>
            <FormGroup className="pb-0">
              <FormField>
                <Label htmlFor="parentCodeGroup">부모 그룹</Label>
                <Select
                  id="parentCodeGroup"
                  value={formData.parentId?.toString() || "none"}
                  onValueChange={(value) => handleChange("parentId")(value === "none" ? null : value)}
                  disabled={formData.isSystem}
                  placeholder="선택 안 함"
                  className="w-auto"
                >
                  <SelectItem value="none">선택 안 함</SelectItem>
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
            {editingCodeGroup ? "수정" : "추가"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 