"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";

import { CardComponents } from '@/components/framework/layout';
import { Plus as AddIcon, Code as CodeIcon, Folder as CategoryIcon, Loader2 } from "lucide-react";
import { useCodeGroupQuery, useCodeGroupCreate, useCodeGroupUpdate, useCodeGroupDelete } from "@/hooks/code-group/useCodeGroupQuery";
import { useCodeQuery, useCodeCreate, useCodeUpdate, useCodeDelete } from "@/hooks/code/useCodeQuery";
import { useCodeGroupFilters } from "@/hooks/code-group/useCodeGroupFilters";
import { useCodeFilters } from "@/hooks/code/useCodeFilters";
import { useCodeGroupStats } from "@/hooks/code-group/useCodeGroupStats";
import { useCodeStats } from "@/hooks/code/useCodeStats";

import ContentHeader from "@/components/common/ContentHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchFilter from "@/components/common/SearchFilter";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import { CODE_GROUP_STAT_CONFIG, CODE_STAT_CONFIG } from '@/constants/code';

import { showSuccess, showError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { buildCodeGroupTree } from "@/utils/buildCodeGroupTree";
import type { CodeGroupData, CodeGroupInput, CodeGroupTree } from "@/types/code-group";
import type { CodeData, CodeInput } from "@/types/code";

import CodeGroupDialog from "./CodeGroupDialog";
import CodeGroupList from "./CodeGroupList";
import CodeDialog from "./CodeDialog";
import CodeList from "./CodeList";

export default function CodeForm() {
  console.log("CodeForm");
  const t = useTranslations("AdminCodes");
  const tToast = useTranslations("AdminCodes.toast");
  const tStatsGroup = useTranslations("AdminCodes.stats.group");
  const tStatsCode = useTranslations("AdminCodes.stats.code");

  // 코드 그룹 관련
  const [selectedCodeGroup, setSelectedCodeGroup] = useState<CodeGroupData | null>(null);
  const [codeGroupDialogOpen, setCodeGroupDialogOpen] = useState<boolean>(false);
  const [editingCodeGroup, setEditingCodeGroup] = useState<CodeGroupData | null>(null);
  const {
    filters: codeGroupFilters,
    searchParams: codeGroupSearchParams,
    filterFields: codeGroupFilterFields,
    handleFilterChange: handleCodeGroupFilterChange,
    handleClearFilters: handleClearCodeGroupFilters,
  } = useCodeGroupFilters();

  // 코드 관련
  const [codeDialogOpen, setCodeDialogOpen] = useState<boolean>(false);
  const [editingCode, setEditingCode] = useState<CodeData | null>(null);
  const {
    filters: codeFilters,
    searchParams: codeSearchParams,
    filterFields: codeFilterFields,
    handleFilterChange: handleCodeFilterChange,
    handleClearFilters: handleClearCodeFilters,
  } = useCodeFilters();

  // API 호출
  const { data: codeGroupData = [], isLoading: codeGroupLoading, error: codeGroupError } = useCodeGroupQuery(codeGroupSearchParams);
  const { data: allCodeData = [] } = useCodeQuery();
  const { data: codeData = [], isLoading: codeLoading } = useCodeQuery({ ...codeSearchParams, groupId: selectedCodeGroup?.id }, !!selectedCodeGroup);

  const codes: CodeData[] = selectedCodeGroup ? codeData : [];

  // 트리 구조로 변환
  const codeGroupTree = useMemo(() => buildCodeGroupTree(codeGroupData), [codeGroupData]);

  const createCodeGroupMutation = useCodeGroupCreate();
  const updateCodeGroupMutation = useCodeGroupUpdate();
  const deleteCodeGroupMutation = useCodeGroupDelete();
  
  const createCodeMutation = useCodeCreate();
  const updateCodeMutation = useCodeUpdate();
  const deleteCodeMutation = useCodeDelete();

  // 통계 정보
  const groupStats = useCodeGroupStats(codeGroupData);
  const codeStats = useCodeStats(selectedCodeGroup ? (codeLoading ? allCodeData : codes) : allCodeData);

  const codeGroupStatConfig = useMemo(() => {
    return CODE_GROUP_STAT_CONFIG.map((c) => ({
      ...c,
      key: c.key as (typeof c.key),
      label: tStatsGroup(c.key),
    }));
  }, [tStatsGroup]);

  const codeStatConfig = useMemo(() => {
    return CODE_STAT_CONFIG.map((c) => ({
      ...c,
      key: c.key as (typeof c.key),
      label: tStatsCode(c.key),
    }));
  }, [tStatsCode]);

  // 그룹 선택
  const handleSelectCodeGroup = useCallback((group: CodeGroupData) => {
    setSelectedCodeGroup(group);
    handleClearCodeFilters();
    // 그룹이 선택되면 해당 그룹의 코드 필터 설정
    handleCodeFilterChange('groupId', group.id.toString());
  }, [handleCodeFilterChange, handleClearCodeFilters]);

  // 코드 그룹 핸들러
  const handleOpenCodeGroupDialog = useCallback((group?: CodeGroupTree) => {
    setEditingCodeGroup(group || null);
    setCodeGroupDialogOpen(true);
  }, []);

  const handleCloseCodeGroupDialog = useCallback(() => {
    setCodeGroupDialogOpen(false);
    setEditingCodeGroup(null);
  }, []);

  const handleSubmitCodeGroup = useCallback((formData: CodeGroupInput) => {
    const mutationOption = {
      onSuccess: () => {
        handleCloseCodeGroupDialog();
        showSuccess(editingCodeGroup ? tToast("groupUpdateSuccess") : tToast("groupCreateSuccess"));
      }
    };

    if (editingCodeGroup) updateCodeGroupMutation.mutate({ ...editingCodeGroup, ...formData }, mutationOption);
    else createCodeGroupMutation.mutate(formData, mutationOption);
  }, [editingCodeGroup, updateCodeGroupMutation, createCodeGroupMutation, handleCloseCodeGroupDialog, tToast]);

  const handleDeleteCodeGroup = useCallback((group: CodeGroupData) => {
    if (group.isSystem) {
      showError(tToast("groupSystemDeleteError"));
      return;
    }
    deleteCodeGroupMutation.mutate({ id: group.id }, {
      onSuccess: () => {
        showSuccess(tToast("groupDeleteSuccess"));
        if (selectedCodeGroup?.id === group.id) {
          setSelectedCodeGroup(null);
        }
      }
    });
  }, [deleteCodeGroupMutation, selectedCodeGroup, tToast]);

  const handleToggleCodeGroupStatus = useCallback((group: CodeGroupData) => {
    updateCodeGroupMutation.mutate({
      ...group,
      isActive: !group.isActive
    }, {
      onSuccess: () => showSuccess(tToast("groupToggleSuccess"))
    });
  }, [updateCodeGroupMutation, tToast]);

  // 코드 핸들러
  const handleOpenCodeDialog = useCallback((code?: CodeData) => {
    setEditingCode(code || null);
    setCodeDialogOpen(true);
  }, []);

  const handleCloseCodeDialog = useCallback(() => {
    setCodeDialogOpen(false);
    setEditingCode(null);
  }, []);

  const handleSubmitCode = useCallback((formData: CodeInput) => {
    const mutationOption = {
      onSuccess: () => {
        handleCloseCodeDialog();
        showSuccess(editingCode ? tToast("codeUpdateSuccess") : tToast("codeCreateSuccess"));
      }
    };

    if (editingCode) updateCodeMutation.mutate({ ...editingCode, ...formData }, mutationOption);
    else createCodeMutation.mutate(formData, mutationOption);
  }, [editingCode, updateCodeMutation, createCodeMutation, handleCloseCodeDialog, tToast]);

  const handleDeleteCode = useCallback((code: CodeData) => {
    if (code.isSystem) {
      showError(tToast("codeSystemDeleteError"));
      return;
    }
    deleteCodeMutation.mutate({ id: code.id }, {
      onSuccess: () => showSuccess(tToast("codeDeleteSuccess"))
    });
  }, [deleteCodeMutation, tToast]);

  const handleToggleCode = useCallback((code: CodeData) => {
    updateCodeMutation.mutate({
      ...code,
      isActive: !code.isActive
    }, {
      onSuccess: () => showSuccess(tToast("codeToggleSuccess"))
    });
  }, [updateCodeMutation, tToast]);

  // 로딩 및 에러 처리
  if (codeGroupLoading && codeGroupData.length === 0) return <Loading message={t("loading.page")} />;
  if (codeGroupError) return <ErrorMessage message={t("error.load")} />;

  return (
    <div className="w-full">
      {/* 컨텐츠 헤더 */}
      <ContentHeader
        icon={<CodeIcon className="h-6 w-6" />}
        title={t("header.title")}
        className="mb-8"
      />

      {/* 마스터-디테일 레이아웃 */}
      <div className={cn("grid grid-cols-1 xl:grid-cols-2 gap-4", codes?.length >= 5 && "h-400", "xl:h-[calc(100vh-145px)]")}>
        {/* 마스터 (코드 그룹) */}
        <div className="flex flex-col min-h-0">
          {/* 코드 그룹 통계 */}
          <StatsCard stats={groupStats} statConfig={codeGroupStatConfig} />

          <CardComponents.Root className="flex-1 flex flex-col gap-2 min-h-0">
            <CardComponents.Header className="px-4 flex-shrink-0">
              <ContentHeader
                icon={<CategoryIcon className="h-5 w-5" />}
                title={t("tabs.group")}
                titleSize="md"
                actionIcon={<AddIcon className="h-4 w-4 mr-2" />}
                actionLabel={t("actions.addGroup")}
                actionSize="sm"
                onAction={() => handleOpenCodeGroupDialog()}
                className="mb-0"
              />
            </CardComponents.Header>

            {/* 검색 필터 */}
            <div className="px-4 flex-shrink-0">
              <SearchFilter
                filters={codeGroupFilters}
                fields={codeGroupFilterFields}
                onFilterChange={handleCodeGroupFilterChange}
                onClearFilters={handleClearCodeGroupFilters}
              />
            </div>

            {/* 코드 그룹 목록 */}
            <CardComponents.Content className="flex-1 overflow-auto p-0 min-h-0">
              {codeGroupTree.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  {t("empty.groups")}
                </div>
              ) : (
                <CodeGroupList
                  codeGroups={codeGroupTree}
                  selectedCodeGroup={selectedCodeGroup}
                  onSelectCodeGroup={handleSelectCodeGroup}
                  onEdit={handleOpenCodeGroupDialog}
                  onDelete={handleDeleteCodeGroup}
                  onToggle={handleToggleCodeGroupStatus}
                />
              )}
            </CardComponents.Content>
          </CardComponents.Root>
        </div>

        {/* 디테일 (코드) */}
        <div className="flex flex-col min-h-0">
          {/* 코드 통계 */}
          <StatsCard stats={codeStats} statConfig={codeStatConfig} />

          <CardComponents.Root className="flex-1 flex flex-col gap-2 min-h-0">
            <CardComponents.Header className="px-4 flex-shrink-0">
              {selectedCodeGroup && 
                <ContentHeader
                  icon={<CodeIcon className="h-5 w-5" />}
                  title={selectedCodeGroup.groupName}
                  titleSize="md"
                  actionIcon={<AddIcon className="h-4 w-4 mr-2" />}
                  actionLabel={t("actions.addCode")}
                  actionSize="sm"
                  onAction={() => handleOpenCodeDialog()}
                  className="mb-0"
                />
              }
            </CardComponents.Header>

            {selectedCodeGroup ? (
              <>
                {/* 검색 필터 */}
                <div className="px-4 flex-shrink-0">
                  <SearchFilter
                    filters={codeFilters}
                    fields={codeFilterFields}
                    onFilterChange={handleCodeFilterChange}
                    onClearFilters={handleClearCodeFilters}
                  />
                </div>
                
                {/* 코드 목록 */}
                <CardComponents.Content className="flex-1 overflow-auto p-0 min-h-0">
                  {codeLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>{t("loading.codes")}</span>
                    </div>
                  ) : (
                    <CodeList
                      codes={codes}
                      onEdit={handleOpenCodeDialog}
                      onDelete={handleDeleteCode}
                      onToggle={handleToggleCode}
                    />
                  )}
                </CardComponents.Content>
              </>
            ) : (
              <CardComponents.Content className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  {t("empty.selectGroup")}
                </div>
              </CardComponents.Content>
            )}
          </CardComponents.Root>
        </div>
      </div>

      {/* 코드 그룹 다이얼로그 */}
      <CodeGroupDialog
        open={codeGroupDialogOpen}
        onClose={handleCloseCodeGroupDialog}
        onSubmit={handleSubmitCodeGroup}
        codeGroup={editingCodeGroup}
        codeGroups={codeGroupTree}
      />

      {/* 코드 다이얼로그 */}
      <CodeDialog
        open={codeDialogOpen}
        onClose={handleCloseCodeDialog}
        onSubmit={handleSubmitCode}
        code={editingCode}
        selectedGroupId={selectedCodeGroup?.id}
      />
    </div>
  );
} 