"use client";

import React, { useState, useCallback, useMemo } from "react";

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
import { MESSAGES, CODE_GROUP_STAT_CONFIG, CODE_STAT_CONFIG, CODE_GROUP_FILTER_FIELDS, CODE_FILTER_FIELDS } from '@/constants/code';

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

  // 코드 그룹 관련
  const [selectedCodeGroup, setSelectedCodeGroup] = useState<CodeGroupData | null>(null);
  const [codeGroupDialogOpen, setCodeGroupDialogOpen] = useState<boolean>(false);
  const [editingCodeGroup, setEditingCodeGroup] = useState<CodeGroupData | null>(null);
  const {
    filters: codeGroupFilters,
    searchParams: codeGroupSearchParams,
    handleFilterChange: handleCodeGroupFilterChange,
    handleClearFilters: handleClearCodeGroupFilters,
  } = useCodeGroupFilters();

  // 코드 관련
  const [codeDialogOpen, setCodeDialogOpen] = useState<boolean>(false);
  const [editingCode, setEditingCode] = useState<CodeData | null>(null);
  const {
    filters: codeFilters,
    searchParams: codeSearchParams,
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
        showSuccess(editingCodeGroup ? MESSAGES.CODE_GROUP_UPDATE_SUCCESS : MESSAGES.CODE_GROUP_CREATE_SUCCESS);
      }
    };

    if (editingCodeGroup) updateCodeGroupMutation.mutate({ ...editingCodeGroup, ...formData }, mutationOption);
    else createCodeGroupMutation.mutate(formData, mutationOption);
  }, [editingCodeGroup, updateCodeGroupMutation, createCodeGroupMutation, handleCloseCodeGroupDialog]);

  const handleDeleteCodeGroup = useCallback((group: CodeGroupData) => {
    if (group.isSystem) {
      showError(MESSAGES.CODE_GROUP_SYSTEM_DELETE_ERROR);
      return;
    }
    deleteCodeGroupMutation.mutate({ id: group.id }, {
      onSuccess: () => {
        showSuccess(MESSAGES.CODE_GROUP_DELETE_SUCCESS);
        if (selectedCodeGroup?.id === group.id) {
          setSelectedCodeGroup(null);
        }
      }
    });
  }, [deleteCodeGroupMutation, selectedCodeGroup]);

  const handleToggleCodeGroupStatus = useCallback((group: CodeGroupData) => {
    updateCodeGroupMutation.mutate({
      ...group,
      isActive: !group.isActive
    }, {
      onSuccess: () => showSuccess(MESSAGES.CODE_GROUP_TOGGLE_SUCCESS)
    });
  }, [updateCodeGroupMutation]);

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
        showSuccess(editingCode ? MESSAGES.CODE_UPDATE_SUCCESS : MESSAGES.CODE_CREATE_SUCCESS);
      }
    };

    if (editingCode) updateCodeMutation.mutate({ ...editingCode, ...formData }, mutationOption);
    else createCodeMutation.mutate(formData, mutationOption);
  }, [editingCode, updateCodeMutation, createCodeMutation, handleCloseCodeDialog]);

  const handleDeleteCode = useCallback((code: CodeData) => {
    if (code.isSystem) {
      showError(MESSAGES.CODE_SYSTEM_DELETE_ERROR);
      return;
    }
    deleteCodeMutation.mutate({ id: code.id }, {
      onSuccess: () => showSuccess(MESSAGES.CODE_DELETE_SUCCESS)
    });
  }, [deleteCodeMutation]);

  const handleToggleCode = useCallback((code: CodeData) => {
    updateCodeMutation.mutate({
      ...code,
      isActive: !code.isActive
    }, {
      onSuccess: () => showSuccess(MESSAGES.CODE_TOGGLE_SUCCESS)
    });
  }, [updateCodeMutation]);

  // 로딩 및 에러 처리
  if (codeGroupLoading && codeGroupData.length === 0) return <Loading message={MESSAGES.LOADING} />;
  if (codeGroupError) return <ErrorMessage message={MESSAGES.ERROR_LOADING} />;

  return (
    <div className="w-full">
      {/* 컨텐츠 헤더 */}
      <ContentHeader
        icon={<CodeIcon className="h-6 w-6" />}
        title="코드 관리"
        className="mb-8"
      />

      {/* 마스터-디테일 레이아웃 */}
      <div className={cn("grid grid-cols-1 xl:grid-cols-2 gap-4", codes?.length >= 5 && "h-400", "xl:h-[calc(100vh-145px)]")}>
        {/* 마스터 (코드 그룹) */}
        <div className="flex flex-col min-h-0">
          {/* 코드 그룹 통계 */}
          <StatsCard stats={groupStats} statConfig={CODE_GROUP_STAT_CONFIG} />

          <CardComponents.Root className="flex-1 flex flex-col gap-2 min-h-0">
            <CardComponents.Header className="px-4 flex-shrink-0">
              <ContentHeader
                icon={<CategoryIcon className="h-5 w-5" />}
                title="코드 그룹"
                titleSize="md"
                actionIcon={<AddIcon className="h-4 w-4 mr-2" />}
                actionLabel="그룹 추가"
                actionSize="sm"
                onAction={() => handleOpenCodeGroupDialog()}
                className="mb-0"
              />
            </CardComponents.Header>

            {/* 검색 필터 */}
            <div className="px-4 flex-shrink-0">
              <SearchFilter
                filters={codeGroupFilters}
                fields={CODE_GROUP_FILTER_FIELDS}
                onFilterChange={handleCodeGroupFilterChange}
                onClearFilters={handleClearCodeGroupFilters}
              />
            </div>

            {/* 코드 그룹 목록 */}
            <CardComponents.Content className="flex-1 overflow-auto p-0 min-h-0">
              {codeGroupTree.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  등록된 코드 그룹이 없습니다.
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
          <StatsCard stats={codeStats} statConfig={CODE_STAT_CONFIG} />

          <CardComponents.Root className="flex-1 flex flex-col gap-2 min-h-0">
            <CardComponents.Header className="px-4 flex-shrink-0">
              {selectedCodeGroup && 
                <ContentHeader
                  icon={<CodeIcon className="h-5 w-5" />}
                  title={selectedCodeGroup.groupName}
                  titleSize="md"
                  actionIcon={<AddIcon className="h-4 w-4 mr-2" />}
                  actionLabel="코드 추가"
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
                    fields={CODE_FILTER_FIELDS}
                    onFilterChange={handleCodeFilterChange}
                    onClearFilters={handleClearCodeFilters}
                  />
                </div>
                
                {/* 코드 목록 */}
                <CardComponents.Content className="flex-1 overflow-auto p-0 min-h-0">
                  {codeLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>로딩 중...</span>
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
                  왼쪽에서 코드 그룹을 선택하세요
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