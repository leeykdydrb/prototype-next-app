import { useState, useCallback, useMemo } from "react";
import { DEFAULT_ROWS_PER_PAGE } from "@/constants/code";

export const useCodeGroupFilters = () => {
  const [filters, setFilters] = useState({
    search: "",
    isActive: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback((name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0); // 필터 변경 시 첫 페이지로 이동
  }, []);

  // 필터 초기화
  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      isActive: "",
    });
    setPage(0);
  }, []);

  // 페이지 변경
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 행 수 변경
  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // API 검색 파라미터 생성
  const searchParams = useMemo(() => {
    const params: Record<string, string | number | boolean> = {};
    
    if (filters.search) params.search = filters.search;
    if (filters.isActive && filters.isActive !== "all") params.isActive = filters.isActive;
    
    return params;
  }, [filters]);

  return {
    filters,
    page,
    rowsPerPage,
    searchParams,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange,
  };
}; 