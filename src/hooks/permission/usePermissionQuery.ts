// hooks/permission/usePermissionQuery.ts
// 권한 데이터 조회, 생성, 수정, 삭제 전용 커스텀 훅
// - 내부적으로 공통 fetch 훅인 useApiQuery를 사용
// - queryKey: ["permission"] → 캐시 식별자 역할
// - URL: /api/permission

import { useApiQuery } from "@/hooks/api/useApiQuery";
import { useApiMutation } from "@/hooks/api/useApiMutation";
import type { PermissionSearchParams, PermissionData, PermissionInput } from "@/types/permission";
import { keepPreviousData } from "@tanstack/react-query";

type QueryParams = {
  [key: string]:
    | string
    | number
    | boolean
    | (string | number | boolean)[]
    | undefined;
};

export const usePermissionQuery = (params?: PermissionSearchParams) =>
  useApiQuery<PermissionData[]>(["permission", params], '/api/permission', params as QueryParams, { placeholderData: keepPreviousData })

export const usePermissionDetailQuery = (id: number, enabled: boolean) =>
  useApiQuery<PermissionData & {
    rolePermissions: Array<{ role: { id: number; name: string; displayName: string } }>;
    userPermissions: Array<{ user: { id: string; name: string; email: string } }>;
    menuPermissions: Array<{ menu: { id: number; title: string; path: string | null } }>;
  }>(["permission", id], `/api/permission/${id}`, undefined, { enabled: enabled });

export const usePermissionCreate = () =>
  useApiMutation<PermissionData, PermissionInput>("/api/permission", "POST", { removeQueryKeys: ["permission"] });

export const usePermissionUpdate = () =>
  useApiMutation<PermissionData, { id: number } & PermissionInput>(({ id }) => `/api/permission/${id}`, "PUT", { removeQueryKeys: ["permission"] });

export const usePermissionDelete = () =>
  useApiMutation<PermissionData, { id: number }>(({ id }) => `/api/permission/${id}`, "DELETE", { removeQueryKeys: ["permission"] });
