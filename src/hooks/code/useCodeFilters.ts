import { useState, useCallback, useMemo } from "react";
import { DEFAULT_ROWS_PER_PAGE } from "@/constants/code";
import type { FilterField } from "@/components/common/SearchFilter";
import type { CodeSearchFilters } from "@/types/code";
import { useTranslations } from "next-intl";

export const useCodeFilters = () => {
  const t = useTranslations("AdminCodes.filters");
  const [filters, setFilters] = useState({
    search: "",
    groupId: "",
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
      groupId: "",
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
    if (filters.groupId) params.groupId = filters.groupId;
    if (filters.isActive && filters.isActive !== "all") params.isActive = filters.isActive;
    
    return params;
  }, [filters]);

  const filterFields = useMemo(() => {
    return [
      {
        type: "search",
        key: "search",
        id: "code-search",
        placeholder: t("codeSearchPlaceholder"),
      },
      {
        type: "select",
        key: "isActive",
        label: t("statusLabel"),
        options: [
          { value: "all", label: t("status.all") },
          { value: "true", label: t("status.active") },
          { value: "false", label: t("status.inactive") },
        ],
      },
    ] as const satisfies FilterField<CodeSearchFilters>[];
  }, [t]);

  return {
    filters,
    page,
    rowsPerPage,
    filterFields,
    searchParams,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleRowsPerPageChange,
  };
}; 