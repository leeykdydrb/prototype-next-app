'use client'

import React, { useState, useCallback, useMemo } from 'react';
import { Plus as AddIcon, Users as UsersIcon } from 'lucide-react';

import ContentHeader from "@/components/common/ContentHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchFilter from "@/components/common/SearchFilter";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

import { useRoleQuery, useRoleCreate, useRoleUpdate, useRoleDelete } from '@/hooks/role/useRoleQuery';
import { useRoleStats } from "@/hooks/role/useRoleStats";
import { useRoleFilters } from "@/hooks/role/useRoleFilters";
import { useMenuQuery } from "@/hooks/menu/useMenuQuery";

import { MESSAGES, STAT_CONFIG, FILTER_FIELDS } from "@/constants/role";
import { showSuccess } from "@/lib/toast";
import type { RoleData, RoleInput } from '@/types/role';

import RoleDialog from './RoleDialog';
import RoleList from './RoleList';

export default function RoleForm() {
  console.log("RoleForm")
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const { refetch } = useMenuQuery({ isActive: true});

  // 검색 및 필터
  const {
    filters,
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
        showSuccess(editingRole ? MESSAGES.ROLE_UPDATE_SUCCESS : MESSAGES.ROLE_CREATE_SUCCESS);

        if (formData.permissionIds) refetch();
      }
    };
    
    if (editingRole) updateMutation.mutate({ id: editingRole.id, ...submitData }, mutationOption);
    else createMutation.mutate(submitData, mutationOption);
  }, [editingRole, updateMutation, createMutation, handleClose, refetch]);

  const handleDelete = useCallback((role: RoleData) => {
    deleteMutation.mutate({ id: role.id }, {
      onSuccess: () => showSuccess(MESSAGES.ROLE_DELETE_SUCCESS)
    });
  }, [deleteMutation]);

  const handleToggle = useCallback((role: RoleData) => {
    updateMutation.mutate({
      ...role,
      id: role.id,
      isActive: !role.isActive,
      permissionIds: role.rolePermissions.map((rp) => rp.permissionId),
    }, {
      onSuccess: () => showSuccess(MESSAGES.ROLE_TOGGLE_SUCCESS)
    });
  }, [updateMutation]);

  // 로딩 및 에러 처리
  if (isLoading && roles.length === 0) return <Loading message={MESSAGES.LOADING} />;
  if (error) return <ErrorMessage message={MESSAGES.ERROR_LOADING} />;

  return (
    <div className="w-full">
      {/* Content Header */}
      <ContentHeader
        icon={<UsersIcon className="h-6 w-6" />}
        title="역할 관리"
        actionIcon={<AddIcon className="h-4 w-4 mr-2" />}
        actionLabel="역할 추가"
        onAction={() => handleOpen()}
      />

      {/* Stats Card */}
      <StatsCard stats={stats} statConfig={STAT_CONFIG} />

      {/* Search Filter */}
      <SearchFilter
        filters={filters}
        fields={FILTER_FIELDS}
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