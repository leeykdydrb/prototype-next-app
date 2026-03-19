'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Plus as AddIcon, UserCog as UserManagementIcon } from 'lucide-react';

import ContentHeader from "@/components/common/ContentHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchFilter from "@/components/common/SearchFilter";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

import { useUserQuery, useUserCreate, useUserUpdate, useUserDelete } from '@/hooks/user/useUserQuery';
import { useUserStats } from "@/hooks/user/useUserStats";
import { useUserFilters } from "@/hooks/user/useUserFilters";

import { MESSAGES, STAT_CONFIG } from "@/constants/user";
import { showSuccess } from "@/lib/toast";
import type { UserData, UserInput } from '@/types/user';

import UserDialog from './UserDialog';
import UserList from './UserList';

export default function UserForm() {
  console.log("UserForm");
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

  // 필터링된 사용자 목록
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
        showSuccess(editingUser ? MESSAGES.USER_UPDATE_SUCCESS : MESSAGES.USER_CREATE_SUCCESS);
      }
    };
    
    if (editingUser) updateMutation.mutate({ ...submitData }, mutationOption);
    else createMutation.mutate(submitData, mutationOption);
  }, [editingUser, updateMutation, createMutation, handleClose]);

  const handleDelete = useCallback((user: UserData) => {
    deleteMutation.mutate({ id: user.id }, {
      onSuccess: () => showSuccess(MESSAGES.USER_DELETE_SUCCESS)
    });
  }, [deleteMutation]);

  const handleToggle = useCallback((user: UserData) => {
    // 사용자 활성/비활성 상태만 변경
    updateMutation.mutate({
      ...user,
      roleId: user.role.id,
      isActive: !user.isActive
    }, {
      onSuccess: () => showSuccess(MESSAGES.USER_TOGGLE_SUCCESS)
    });
  }, [updateMutation]);

  // 로딩 및 에러 처리
  if (isLoading && users.length === 0) return <Loading message={MESSAGES.LOADING} />;
  if (error) return <ErrorMessage message={MESSAGES.ERROR_LOADING} />;

  return (
    <div className="w-full">
      {/* 컨텐츠 헤더 */}
      <ContentHeader
        icon={<UserManagementIcon className="h-6 w-6" />}
        title="사용자 관리"
        actionIcon={<AddIcon className="h-4 w-4 mr-2" />}
        actionLabel="사용자 추가"
        onAction={() => handleOpen()}
      />

      {/* 통계 카드 */}
      <StatsCard stats={stats} statConfig={STAT_CONFIG} />

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
