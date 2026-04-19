'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Plus as AddIcon, Menu as MenuIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import ContentHeader from "@/components/common/ContentHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchFilter from "@/components/common/SearchFilter";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";

import { useMenuQuery, useMenuCreate, useMenuUpdate, useMenuDelete } from '@/hooks/menu/useMenuQuery';
import { useMenuStats } from "@/hooks/menu/useMenuStats";
import { useMenuFilters } from "@/hooks/menu/useMenuFilters";

import { STAT_CONFIG } from "@/constants/menu";
import { showSuccess } from "@/lib/toast";
import type { MenuData, MenuTree, MenuInput } from "@/types/menu";
import { buildMenuTree } from "@/utils/buildMenuTree";

import MenuDialog from './MenuDialog';
import MenuList from './MenuList';

export default function MenuForm() {
  console.log("MenuForm");
  const t = useTranslations('AdminMenus');
  const tToast = useTranslations('AdminMenus.toast');

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingMenu, setEditingMenu] = useState<MenuTree | null>(null);

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
  } = useMenuFilters();

  const { data: menus = [], isLoading, error } = useMenuQuery(searchParams);
  const treeMenus = buildMenuTree(menus);
  const createMutation = useMenuCreate();
  const updateMutation = useMenuUpdate();
  const deleteMutation = useMenuDelete();

  // 통계 정보
  const stats = useMenuStats(menus);
  const statConfig = useMemo(
    () =>
      STAT_CONFIG.map(({ key, color }) => ({
        key,
        color,
        label: t(`stats.${key}`),
      })),
    [t],
  );

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
        showSuccess(editingMenu ? tToast('updateSuccess') : tToast('createSuccess'));
      }
    };

    if (editingMenu) updateMutation.mutate({ id: editingMenu.id, ...submitData}, mutationOption);
    else createMutation.mutate(submitData, mutationOption);
  }, [editingMenu, updateMutation, createMutation, handleClose, tToast]);

  const handleDelete = useCallback((menu: MenuData) => {
    deleteMutation.mutate({ id: menu.id } , {
      onSuccess: () => showSuccess(tToast('deleteSuccess'))
    });
  }, [deleteMutation, tToast]);

  // 메뉴 상태 변경 요청 처리
  const handleToggle = useCallback((menu: MenuData) => {
    updateMutation.mutate({
      ...menu,
      // id: menu.id,
      isActive: !menu.isActive
    }, {
      onSuccess: () => showSuccess(tToast('toggleSuccess'))
    });
  }, [updateMutation, tToast]);

  // 로딩 및 에러 처리
  if (isLoading && treeMenus.length === 0) return <Loading message={t('loading')} />;
  if (error) return <ErrorMessage message={t('errorLoading')} />;

  return (
    <div className="w-full">
      {/* Content Header */}
      <ContentHeader
        icon={<MenuIcon className="h-6 w-6" />}
        title={t('header.title')}
        actionIcon={<AddIcon className="h-4 w-4 mr-2" />}
        actionLabel={t('header.addMenu')}
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