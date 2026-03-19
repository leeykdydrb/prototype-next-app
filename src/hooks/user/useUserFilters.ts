// hooks/user/useUserFilters.ts
// 사용자 검색 및 필터링 훅

import { useState, useCallback, useMemo } from 'react';
import { useRoleQuery } from '@/hooks/role/useRoleQuery';
import type { UserSearchParams, UserSearchFilters } from '@/types/user';
import type { FilterField } from "@/components/common/SearchFilter";

export const useUserFilters = () => {
  const [filters, setFilters] = useState<UserSearchFilters>({
    search: '',
    roleId: 'all',
    isActive: 'all',
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: roles = [] } = useRoleQuery();

  // 필터 필드 동적 생성
  const filterFields = useMemo(() => [
    {
      type: "search",
      key: "search",
      id: "user-search",
      placeholder: "아이디, 사용자명, 이메일로 검색...",
    },
    {
      type: "select",
      key: "roleId",
      label: "역할",
      options: [
        { value: "all", label: "전체" },
        ...roles.map(role => ({
          value: String(role.id),
          label: role.displayName
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
  ] satisfies FilterField<UserSearchFilters>[], [roles]);

  const searchParams = useMemo((): UserSearchParams => {
    const params: UserSearchParams = {};
    
    if (filters.search) params.search = filters.search;
    if (filters.roleId !== 'all') params.roleId = Number(filters.roleId);
    if (filters.isActive !== 'all') params.isActive = filters.isActive === 'true';
    
    return params;
  }, [filters]);

  const handleFilterChange = useCallback((key: keyof UserSearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // 필터 변경 시 첫 페이지로 이동
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      roleId: 'all',
      isActive: 'all',
    });
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  return {
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
  };
};
