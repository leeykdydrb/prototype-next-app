import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { MenuSearchFilters } from '@/types/menu';
import type { FilterField } from '@/components/common/SearchFilter';

export const useMenuFilters = () => {
  const tf = useTranslations('AdminMenus.filters');

  const [filters, setFilters] = useState<MenuSearchFilters>({
    search: '',
    isActive: 'all'
  });
  const [page, setPage] = useState(0); // 페이지 번호
  const [rowsPerPage, setRowsPerPage] = useState(10); // 페이지당 표시할 권한 수

  const filterFields = useMemo(
    () =>
      [
        {
          type: 'search' as const,
          key: 'search' as const,
          id: 'menu-search',
          placeholder: tf('searchPlaceholder'),
        },
        {
          type: 'select' as const,
          key: 'isActive' as const,
          label: tf('status'),
          options: [
            { value: 'all', label: tf('all') },
            { value: 'true', label: tf('active') },
            { value: 'false', label: tf('inactive') },
          ],
        },
      ] satisfies FilterField<MenuSearchFilters>[],
    [tf],
  );

  const searchParams = useMemo(() => ({
    ...(filters.search && { search: filters.search }),
    ...(filters.isActive !== 'all' && { isActive: filters.isActive === 'true' })
  }), [filters]);

  const handleFilterChange = useCallback((key: keyof MenuSearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', isActive: 'all' });
    setPage(0);
  }, []);

  // 역할 목록 페이지 변경 요청 처리
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 역할 목록 페이지 당 표시할 권한 수 변경 요청 처리
  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  return {
    filters,
    filterFields,
    page,
    rowsPerPage,
    searchParams,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange
  };
};