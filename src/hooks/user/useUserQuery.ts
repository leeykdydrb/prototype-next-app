// hooks/user/useUserQuery.ts
// 사용자 데이터 조회, 생성, 수정, 삭제 전용 커스텀 훅
// - 내부적으로 공통 fetch 훅인 useApiQuery를 사용
// - queryKey: ["user"] → 캐시 식별자 역할
// - URL: /api/user

import { useApiQuery } from "@/hooks/api/useApiQuery";
import { useApiMutation } from "@/hooks/api/useApiMutation";
import type { UserSearchParams, UserData, UserInput } from "@/types/user";
import { keepPreviousData } from "@tanstack/react-query";

type QueryParams = {
  [key: string]:
    | string
    | number
    | boolean
    | (string | number | boolean)[]
    | undefined;
};

export const useUserQuery = (params?: UserSearchParams) =>
  useApiQuery<UserData[]>(["user", params], "/api/user", params as QueryParams, { placeholderData: keepPreviousData });

export const useUserCreate = () =>
  useApiMutation<UserData, UserInput>("/api/user", "POST", { invalidateQueryKeys: ["user"] });

export const useUserUpdate = () =>
  useApiMutation<UserData, { id: string } & UserInput>(({ id }) => `/api/user/${id}`, "PUT", { invalidateQueryKeys: ["user"] });

export const useUserDelete = () =>
  useApiMutation<UserData, { id: string }>(({ id }) => `/api/user/${id}`, "DELETE", { invalidateQueryKeys: ["user"] });
