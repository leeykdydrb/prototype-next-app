'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Plus as AddIcon, Users as UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import ContentHeader from "@/components/common/ContentHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchFilter from "@/components/common/SearchFilter";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

import { useRoleQuery, useRoleCreate, useRoleUpdate, useRoleDelete } from '@/hooks/role/useRoleQuery';
import { useRoleStats } from "@/hooks/role/useRoleStats";
import { useRoleFilters } from "@/hooks/role/useRoleFilters";
import { useMenuQuery } from "@/hooks/menu/useMenuQuery";

import { STAT_CONFIG } from "@/constants/role";
import { showSuccess } from "@/lib/toast";
import type { RoleData, RoleInput } from '@/types/role';

import RoleDialog from './RoleDialog';
import RoleList from './RoleList';

export default function RoleForm() {
  console.log("RoleForm")
  const t = useTranslations('AdminRoles');
  const tToast = useTranslations('AdminRoles.toast');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const { refetch } = useMenuQuery({ isActive: true});

  // 검색 및 필터
  const {
    filters,
    filterFields,
    page,
    rowsPerPage,
    searchParams,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange,
  } = useRoleFilters();

  const { data: roles = [], isLoading, error } = useRoleQuery(searchParams);
  const createMutation = useRoleCreate();
  const updateMutation = useRoleUpdate();
  const deleteMutation = useRoleDelete();

  // 통계 정보
  const stats = useRoleStats(roles);
  const statConfig = useMemo(
    () =>
      STAT_CONFIG.map(({ key, color }) => ({
        key,
        color,
        label: t(`stats.${key}`),
      })),
    [t],
  );

  // 필터링된 역할 목록
  const filteredRoles = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return roles.slice(startIndex, endIndex);
  }, [roles, page, rowsPerPage]);

  const handleOpen = useCallback((role?: RoleData) => {
    if (role) setEditingRole(role);
    else setEditingRole(null);
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setEditingRole(null);
  }, []);
  
  const handleSubmit = useCallback((formData: RoleInput) => {
    const submitData = { ...formData, description: formData.description || null };
    const mutationOption = {
      onSuccess: () => {
        handleClose();
        showSuccess(editingRole ? tToast('updateSuccess') : tToast('createSuccess'));

        if (formData.permissionIds) refetch();
      }
    };
    
    if (editingRole) updateMutation.mutate({ id: editingRole.id, ...submitData }, mutationOption);
    else createMutation.mutate(submitData, mutationOption);
  }, [editingRole, updateMutation, createMutation, handleClose, refetch, tToast]);

  const handleDelete = useCallback((role: RoleData) => {
    deleteMutation.mutate({ id: role.id }, {
      onSuccess: () => showSuccess(tToast('deleteSuccess'))
    });
  }, [deleteMutation, tToast]);

  const handleToggle = useCallback((role: RoleData) => {
    updateMutation.mutate({
      ...role,
      id: role.id,
      isActive: !role.isActive,
      permissionIds: role.rolePermissions.map((rp) => rp.permissionId),
    }, {
      onSuccess: () => showSuccess(tToast('toggleSuccess'))
    });
  }, [updateMutation, tToast]);

  // 로딩 및 에러 처리
  if (isLoading && roles.length === 0) return <Loading message={t('loading')} />;
  if (error) return <ErrorMessage message={t('errorLoading')} />;

  return (
    <div className="w-full">
      {/* Content Header */}
      <ContentHeader
        icon={<UsersIcon className="h-6 w-6" />}
        title={t('header.title')}
        actionIcon={<AddIcon className="h-4 w-4 mr-2" />}
        actionLabel={t('header.addRole')}
        onAction={() => handleOpen()}
      />

      {/* Stats Card */}
      <StatsCard stats={stats} statConfig={statConfig} />

      {/* Search Filter */}
      <SearchFilter
        filters={filters}
        fields={filterFields}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Role List */}
      <RoleList
        roles={filteredRoles}
        onEdit={handleOpen}
        onDelete={handleDelete}
        onToggle={handleToggle}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={roles.length}
      />

      {/* Role Dialog */}
      <RoleDialog
        open={dialogOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        role={editingRole}
      />
    </div>
  );
}