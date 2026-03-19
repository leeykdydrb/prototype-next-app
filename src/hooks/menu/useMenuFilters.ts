import { useState, useMemo, useCallback } from 'react';
import type { MenuSearchFilters } from '@/types/menu';

export const useMenuFilters = () => {
  const [filters, setFilters] = useState<MenuSearchFilters>({
    search: '',
    isActive: 'all'
  });
  const [page, setPage] = useState(0); // 페이지 번호
  const [rowsPerPage, setRowsPerPage] = useState(10); // 페이지당 표시할 권한 수

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
    page,
    rowsPerPage,
    searchParams,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange
  };
};