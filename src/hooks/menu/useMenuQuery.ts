// hooks/useMenuQuery.ts
// 메뉴 데이터 조회, 생성, 수정, 삭제 전용 커스텀 훅
// - 내부적으로 공통 fetch 훅인 useApiQuery를 사용
// - queryKey: ["menu"] → 캐시 식별자 역할
// - URL: /api/menu

import { useApiQuery } from "@/hooks/api/useApiQuery";
import { useApiMutation } from "@/hooks/api/useApiMutation";
import type { MenuSearchParams, MenuData, MenuInput } from "@/types/menu";
import { keepPreviousData } from "@tanstack/react-query";

type QueryParams = {
  [key: string]:
    | string
    | number
    | boolean
    | (string | number | boolean)[]
    | undefined;
};

export const useMenuQuery = (params?: MenuSearchParams) =>
  useApiQuery<MenuData[]>(["menu", params], "/api/menu", params as QueryParams, { placeholderData: keepPreviousData });

export const useMenuCreate = () =>
  useApiMutation<MenuData, MenuInput>("/api/menu", "POST", { invalidateQueryKeys: ["menu"] });

export const useMenuUpdate = () =>
  useApiMutation<MenuData, { id: number } & MenuInput>(({ id }) => `/api/menu/${id}`, "PUT", { invalidateQueryKeys: ["menu"] });

export const useMenuDelete = () =>
  useApiMutation<MenuData, { id: number }>(({ id }) => `/api/menu/${id}`, "DELETE", { invalidateQueryKeys: ["menu"] });
