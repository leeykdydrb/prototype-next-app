import { useState, useMemo, useCallback } from 'react';
import { useCodeQuery } from '@/hooks/code/useCodeQuery';
import type { PermissionSearchFilters } from '@/types/permission';
import type { FilterField } from "@/components/common/SearchFilter";

export const usePermissionFilters = () => {
  const [filters, setFilters] = useState<PermissionSearchFilters>({
    search: '',
    categoryId: 'all',
    isActive: 'all'
  });
  const [page, setPage] = useState(0); // 페이지 번호
  const [rowsPerPage, setRowsPerPage] = useState(10); // 페이지당 표시할 권한 수

  const { data: categories = [] } = useCodeQuery({ groupCode: 'PERMISSION_CATEGORY' });

  // 필터 필드 동적 생성
  const filterFields = useMemo(() => [
    {
      type: "search",
      key: "search",
      id: "permission-search",
      placeholder: "권한명, 표시명, 설명으로 검색...",
    },
    {
      type: "select",
      key: "categoryId",
      label: "카테고리",
      options: [
        { value: "all", label: "전체" },
        ...categories.map(category => ({
          value: String(category.id),
          label: category.codeName
        }))
      ],
    },
    {
      type: "select",
      key: "isActive",
      label: "상태",
      options: [
        { value: "all", label: "전체" },
        { value: "true", label: "활성" },
        { value: "false", label: "비활성" },
      ],
    },
  ] satisfies FilterField<PermissionSearchFilters>[], [categories]);

  const searchParams = useMemo(() => ({
    ...(filters.search && { search: filters.search }),
    ...(filters.categoryId !== 'all' && { categoryId: Number(filters.categoryId) }),
    ...(filters.isActive !== 'all' && { isActive: filters.isActive === 'true' })
  }), [filters]);

  const handleFilterChange = useCallback((key: keyof PermissionSearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', categoryId: 'all', isActive: 'all' });
    setPage(0);
  }, []);

  // 권한 목록 페이지 변경 요청 처리
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 권한 목록 페이지 당 표시할 권한 수 변경 요청 처리
  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  return {
    filters,
    filterFields,
    categories,
    page,
    rowsPerPage,
    searchParams,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange
  };
};