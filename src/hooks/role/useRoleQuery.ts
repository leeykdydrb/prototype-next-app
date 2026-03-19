// hooks/useRoleQuery.ts
// 역할 데이터 조회, 생성, 수정, 삭제 전용 커스텀 훅
// - 내부적으로 공통 fetch 훅인 useApiQuery를 사용
// - queryKey: ["role"] → 캐시 식별자 역할
// - URL: /api/role

import { useApiQuery } from "@/hooks/api/useApiQuery";
import { useApiMutation } from "@/hooks/api/useApiMutation";
import type { RoleSearchParams, RoleData, RoleInput } from "@/types/role";
import { keepPreviousData } from "@tanstack/react-query";

type QueryParams = {
  [key: string]:
    | string
    | number
    | boolean
    | (string | number | boolean)[]
    | undefined;
};

export const useRoleQuery = (params?: RoleSearchParams) =>
  useApiQuery<RoleData[]>(["role", params], "/api/role", params as QueryParams, { placeholderData: keepPreviousData });

export const useRoleCreate = () =>
  useApiMutation<RoleData, RoleInput>("/api/role", "POST", { removeQueryKeys: ["role"] });

export const useRoleUpdate = () =>
  useApiMutation<RoleData, { id: number } & RoleInput>(({ id }) => `/api/role/${id}`, "PUT", { removeQueryKeys: ["role"] });

export const useRoleDelete = () =>
  useApiMutation<RoleData, { id: number }>(({ id }) => `/api/role/${id}`, "DELETE", { removeQueryKeys: ["role"] });
