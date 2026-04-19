"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Plus as AddIcon, Shield as SecurityIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import ContentHeader from "@/components/common/ContentHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchFilter from "@/components/common/SearchFilter";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

import {
  usePermissionQuery,
  usePermissionCreate,
  usePermissionUpdate,
  usePermissionDelete,
} from "@/hooks/permission/usePermissionQuery";
import { usePermissionStats } from "@/hooks/permission/usePermissionStats";
import { usePermissionFilters } from "@/hooks/permission/usePermissionFilters";

import { STAT_CONFIG } from '@/constants/permission';
import { showSuccess } from "@/lib/toast";
import type { PermissionData, PermissionInput } from "@/types/permission";

import PermissionDialog from "./PermissionDialog";
import PermissionList from "./PermissionList";

export default function PermissionForm() {
  console.log("PermissionForm");
  const t = useTranslations("AdminPermissions");
  const tToast = useTranslations("AdminPermissions.toast");

  // 상태 관리
  const [dialogOpen, setDialogOpen] = useState(false); // 권한 추가/수정 다이얼로그 열기/닫기
  const [editingPermission, setEditingPermission] = useState<PermissionData | null>(null); // 수정할 권한 정보

  // 검색 및 필터
  const {
    filters,
    filterFields,
    categories,
    page,
    rowsPerPage,
    searchParams,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePermissionFilters();

  const { data: permissions = [], isLoading, error } = usePermissionQuery(searchParams);
  const createMutation = usePermissionCreate();
  const updateMutation = usePermissionUpdate();
  const deleteMutation = usePermissionDelete();

  // 통계 정보
  const stats = usePermissionStats(permissions);
  const statConfig = useMemo(
    () =>
      STAT_CONFIG.map(({ key, color }) => ({
        key,
        color,
        label: t(`stats.${key}`),
      })),
    [t],
  );

  // 카테고리별로 그룹화된 권한 목록
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, PermissionData[]> = {};
    
    permissions.forEach(permission => {
      const category = permission.category.codeName;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    // 각 카테고리 내에서 권한명으로 정렬
    Object.keys(groups).forEach(category => {
      groups[category].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [permissions]);

  // 그룹화된 데이터를 평면 배열로 변환 (페이지네이션용)
  const flattenedPermissions = useMemo(() => {
    const result: PermissionData[] = [];
    
    // 카테고리 정렬
    const sortedCategories = Object.keys(groupedPermissions).sort();
    
    sortedCategories.forEach(category => {
      result.push(...groupedPermissions[category]);
    });
    
    return result;
  }, [groupedPermissions]);

  // 페이지네이션된 권한 목록
  const paginatedPermissions = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return flattenedPermissions.slice(startIndex, endIndex);
  }, [flattenedPermissions, page, rowsPerPage]);

  // 권한 추가 또는 수정 다이얼로그 열기
  const handleOpen = useCallback((permission?: PermissionData) => {
    setEditingPermission(permission || null);
    setDialogOpen(true);
  }, []);

  // 권한 추가 또는 수정 다이얼로그 닫기
  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setEditingPermission(null);
  }, []);

  // 권한 수정 또는 추가 요청 처리
  const handleSubmit = useCallback((formData: PermissionInput) => {
    const submitData = {
      ...formData,
      description: formData.description || null,
      categoryId: formData.categoryId,
    };
    const mutationOption = {
      onSuccess: () => {
        handleClose();
        showSuccess(editingPermission ? tToast('updateSuccess') : tToast('createSuccess'));
      }
    };

    if (editingPermission) updateMutation.mutate({ id: editingPermission.id, ...submitData }, mutationOption);
    else createMutation.mutate(submitData, mutationOption);
  }, [editingPermission, updateMutation, createMutation, handleClose, tToast]);

  // 권한 삭제 요청 처리
  const handleDelete = useCallback((permission: PermissionData) => {
    deleteMutation.mutate({ id: permission.id }, {
      onSuccess: () => showSuccess(tToast('deleteSuccess'))
    });
  }, [deleteMutation, tToast]);

  // 권한 상태 변경 요청 처리
  const handleToggle = useCallback((permission: PermissionData) => {
    updateMutation.mutate({
      ...permission,
      id: permission.id,
      isActive: !permission.isActive
    }, {
      onSuccess: () => showSuccess(tToast('toggleSuccess'))
    });
  }, [updateMutation, tToast]);

  // 로딩 및 에러 처리
  if (isLoading && permissions.length === 0) return <Loading message={t('loading')} />;  
  if (error) return <ErrorMessage message={t('errorLoading')} />;

  return (
    <div className="w-full">
      {/* 컨텐츠 헤더 */}
      <ContentHeader
        icon={<SecurityIcon className="h-6 w-6" />}
        title={t('header.title')}
        actionIcon={<AddIcon className="h-4 w-4 mr-2" />}
        actionLabel={t('header.addPermission')}
        onAction={() => handleOpen()}
      />

      {/* 통계 카드 */}
      <StatsCard stats={stats} statConfig={statConfig} />

      {/* 검색 및 필터 */}
      <SearchFilter
        filters={filters}
        fields={filterFields}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* 권한 목록 */}
      <PermissionList
        permissions={paginatedPermissions}
        onEdit={handleOpen}
        onDelete={handleDelete}
        onToggle={handleToggle}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={flattenedPermissions.length}
      />

      {/* 권한 추가/수정 다이얼로그 */}
      <PermissionDialog
        open={dialogOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        permission={editingPermission}
        categories={categories}
      />
    </div>
  );
}