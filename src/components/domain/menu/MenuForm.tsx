'use client'

import React, { useState, useCallback, useMemo } from 'react';
import { Plus as AddIcon, Menu as MenuIcon } from 'lucide-react';

import ContentHeader from "@/components/common/ContentHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchFilter from "@/components/common/SearchFilter";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

import { useMenuQuery, useMenuCreate, useMenuUpdate, useMenuDelete } from '@/hooks/menu/useMenuQuery';
import { useMenuStats } from "@/hooks/menu/useMenuStats";
import { useMenuFilters } from "@/hooks/menu/useMenuFilters";

import { MESSAGES, STAT_CONFIG, FILTER_FIELDS } from "@/constants/menu";
import { showSuccess } from "@/lib/toast";
import type { MenuData, MenuTree, MenuInput } from "@/types/menu";
import { buildMenuTree } from "@/utils/buildMenuTree";

import MenuDialog from './MenuDialog';
import MenuList from './MenuList';

export default function MenuForm() {
  console.log("MenuForm");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingMenu, setEditingMenu] = useState<MenuTree | null>(null);

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
  } = useMenuFilters();

  const { data: menus = [], isLoading, error } = useMenuQuery(searchParams);
  const treeMenus = buildMenuTree(menus);
  const createMutation = useMenuCreate();
  const updateMutation = useMenuUpdate();
  const deleteMutation = useMenuDelete();

  // 통계 정보
  const stats = useMenuStats(menus);

  // 필터링된 메뉴 목록
  const filteredMenus = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return treeMenus.slice(startIndex, endIndex);
  }, [treeMenus, page, rowsPerPage]);

  const handleOpen = useCallback((menu?: MenuTree) => {
    if (menu) setEditingMenu(menu);
    else setEditingMenu(null);
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setEditingMenu(null);
  }, []);

  const handleSubmit = useCallback((formData: MenuInput) => {
    const submitData = {
      ...formData,
      path: formData.path || null,
      icon: formData.icon || null,
    };
    const mutationOption = {
      onSuccess: () => {
        handleClose();
        showSuccess(editingMenu ? MESSAGES.MENU_UPDATE_SUCCESS : MESSAGES.MENU_CREATE_SUCCESS);
      }
    };

    if (editingMenu) updateMutation.mutate({ id: editingMenu.id, ...submitData}, mutationOption);
    else createMutation.mutate(submitData, mutationOption);
  }, [editingMenu, updateMutation, createMutation, handleClose]);

  const handleDelete = useCallback((menu: MenuData) => {
    deleteMutation.mutate({ id: menu.id } , {
      onSuccess: () => showSuccess(MESSAGES.MENU_DELETE_SUCCESS)
    });
  }, [deleteMutation]);

  // 메뉴 상태 변경 요청 처리
  const handleToggle = useCallback((menu: MenuData) => {
    updateMutation.mutate({
      ...menu,
      // id: menu.id,
      isActive: !menu.isActive
    }, {
      onSuccess: () => showSuccess(MESSAGES.MENU_TOGGLE_SUCCESS)
    });
  }, [updateMutation]);

  // 로딩 및 에러 처리
  if (isLoading && treeMenus.length === 0) return <Loading message={MESSAGES.LOADING} />;
  if (error) return <ErrorMessage message={MESSAGES.ERROR_LOADING} />;

  return (
    <div className="w-full">
      {/* Content Header */}
      <ContentHeader
        icon={<MenuIcon className="h-6 w-6" />}
        title="메뉴 관리"
        actionIcon={<AddIcon className="h-4 w-4 mr-2" />}
        actionLabel="메뉴 추가"
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

      {/* Menu List */}
      <MenuList
        menus={filteredMenus}
        onEdit={handleOpen}
        onDelete={handleDelete}
        onToggle={handleToggle}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        totalCount={treeMenus.length}
      />

      {/* Menu Dialog */}
      <MenuDialog
        open={dialogOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        menu={editingMenu}
        menus={treeMenus}
      />

    </div>
  );
}