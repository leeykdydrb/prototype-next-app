'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Plus as AddIcon, UserCog as UserManagementIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import ContentHeader from "@/components/common/ContentHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchFilter from "@/components/common/SearchFilter";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

import { useUserQuery, useUserCreate, useUserUpdate, useUserDelete } from '@/hooks/user/useUserQuery';
import { useUserStats } from "@/hooks/user/useUserStats";
import { useUserFilters } from "@/hooks/user/useUserFilters";

import { STAT_CONFIG } from "@/constants/user";
import { showSuccess } from "@/lib/toast";
import type { UserData, UserInput } from '@/types/user';

import UserDialog from './UserDialog';
import UserList from './UserList';

export default function UserForm() {
  console.log("UserForm");
  const t = useTranslations('AdminUsers');
  const tToast = useTranslations('AdminUsers.toast');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  // 검색 및 필터
  const {
    filters,
    filterFields,
    roles,
    page,
    rowsPerPage,
    searchParams,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange,
  } = useUserFilters();

  const { data: users = [], isLoading, error } = useUserQuery(searchParams);
  const createMutation = useUserCreate();
  const updateMutation = useUserUpdate();
  const deleteMutation = useUserDelete();

  // 통계 정보
  const stats = useUserStats(users);
  const statConfig = useMemo(
    () =>
      STAT_CONFIG.map(({ key, color }) => ({
        key,
        color,
        label: t(`stats.${key}`),
      })),
    [t],
  );

  const filteredUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return users.slice(startIndex, endIndex);
  }, [users, page, rowsPerPage]);

  const handleOpen = useCallback((user?: UserData) => {
    if (user) setEditingUser(user);
    else setEditingUser(null);
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setEditingUser(null);
  }, []);
  
  const handleSubmit = useCallback((formData: UserInput) => {
    const submitData = { ...formData, bio: formData.bio || null };
    const mutationOption = {
      onSuccess: () => {
        handleClose();
        showSuccess(editingUser ? tToast('updateSuccess') : tToast('createSuccess'));
      }
    };
    
    if (editingUser) updateMutation.mutate({ ...submitData }, mutationOption);
    else createMutation.mutate(submitData, mutationOption);
  }, [editingUser, updateMutation, createMutation, handleClose, tToast]);

  const handleDelete = useCallback((user: UserData) => {
    deleteMutation.mutate({ id: user.id }, {
      onSuccess: () => showSuccess(tToast('deleteSuccess'))
    });
  }, [deleteMutation, tToast]);

  const handleToggle = useCallback((user: UserData) => {
    // 사용자 활성/비활성 상태만 변경
    updateMutation.mutate({
      ...user,
      roleId: user.role.id,
      isActive: !user.isActive
    }, {
      onSuccess: () => showSuccess(tToast('toggleSuccess'))
    });
  }, [updateMutation, tToast]);

  // 로딩 및 에러 처리
  if (isLoading && users.length === 0) return <Loading message={t('loading')} />;
  if (error) return <ErrorMessage message={t('errorLoading')} />;

  return (
    <div className="w-full">
      {/* 컨텐츠 헤더 */}
      <ContentHeader
        icon={<UserManagementIcon className="h-6 w-6" />}
        title={t('header.title')}
        actionIcon={<AddIcon className="h-4 w-4 mr-2" />}
        actionLabel={t('header.addUser')}
        onAction={() => handleOpen()}
      />

      <StatsCard stats={stats} statConfig={statConfig} />

      {/* 검색 및 필터 */}
      <SearchFilter
        filters={filters}
        fields={filterFields}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* 사용자 목록 */}
      <UserList
        users={filteredUsers}
        onEdit={handleOpen}
        onDelete={handleDelete}
        onToggle={handleToggle}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={users.length}
      />

      {/* 사용자 추가/수정 다이얼로그 */}
      <UserDialog
        open={dialogOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        user={editingUser}
        roles={roles}
      />
    </div>
  );
}
