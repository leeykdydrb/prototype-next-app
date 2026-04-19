'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Input, Select, SelectItem } from "@/components/framework/form";
import { Card, CardContent } from "@/components/framework/layout";
import { Search as SearchIcon, X as ClearIcon } from "lucide-react";

// 필드 타입 정의
export type FilterField<T> =
  | { type: "search"; key: keyof T; id: string; placeholder: string }
  | { type: "select"; key: keyof T; label: string; options: { value: string; label: string }[] };

// 공통 필터 props
interface FilterProps<T> {
  filters: T;
  fields: FilterField<T>[];
  onFilterChange: (key: keyof T, value: string) => void;
  onClearFilters: () => void;
}

function SearchFilter<T extends object>({
  filters,
  fields,
  onFilterChange,
  onClearFilters,
}: FilterProps<T>) {
  const t = useTranslations('Common.searchFilter');

  // 로컬 검색어 상태 (디바운스 적용)
  const searchField = fields.find(f => f.type === "search");
  const searchKey = searchField?.key;
  const [localSearch, setLocalSearch] = useState(searchKey ? String(filters[searchKey] ?? "") : "");

  useEffect(() => {
    if (searchKey) setLocalSearch(String(filters[searchKey] ?? ""));
  }, [filters, searchKey]);

  // 디바운싱
  useEffect(() => {
    if (!searchKey) return;
    const timer = setTimeout(() => {
      onFilterChange(searchKey, localSearch);
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch, searchKey, onFilterChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setLocalSearch("");
    if (searchKey) onFilterChange(searchKey, "");
  }, [onFilterChange, searchKey]);

  // Select 필드 개수 계산
  const selectFieldCount = useMemo(() => {
    return fields.filter(field => field.type === "select").length;
  }, [fields]);

  // 검색 필드 크기 계산
  const searchFieldSize = useMemo(() => {
    if (selectFieldCount === 0) return "col-span-12 lg:col-span-10";
    if (selectFieldCount === 1) return "col-span-12 lg:col-span-8";
    if (selectFieldCount === 2) return "col-span-12 lg:col-span-6";
    return "col-span-12 lg:col-span-4";
  }, [selectFieldCount]);

  // Select, 필터 초기화화 필드 크기 계산
  const selectFieldSize = useMemo(() => {
    if (selectFieldCount === 0) return "col-span-12 lg:col-span-2";
    if (selectFieldCount === 1) return "col-span-6 lg:col-span-2";
    if (selectFieldCount === 2) return "col-span-4 lg:col-span-2";
    if (selectFieldCount === 3) return "col-span-3 lg:col-span-2";
    return "col-span-2 lg:col-span-2";
  }, [selectFieldCount]);

  return (
    <Card className="p-4 mb-4">
      <CardContent className="p-0">
        <div className="grid grid-cols-12 gap-4 items-center">
          {fields.map((field) => {
            if (field.type === "search") {
              return (
                <div key={String(field.key)} className={`relative ${searchFieldSize}`}>
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={String(field.id)}
                    placeholder={field.placeholder}
                    value={localSearch}
                    onChange={handleSearchChange}
                    className="pl-10 pr-10"
                  />
                  {localSearch && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                    >
                      <ClearIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            }
            if (field.type === "select") {
              const currentValue = String(filters[field.key] ?? "");
              return (
                <div key={String(field.key)} className={selectFieldSize}>
                  <Select
                    value={currentValue || undefined}
                    onValueChange={(value) => onFilterChange(field.key, value)}
                    placeholder={field.label}
                    selectLabel={field.label}
                  >
                    {field.options.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              );
            }
            return null;
          })}
          <div className={selectFieldSize}>
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full cursor-pointer"
            >
              <ClearIcon className="h-4 w-4" />
              {t('clearFilters')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(SearchFilter) as typeof SearchFilter;
