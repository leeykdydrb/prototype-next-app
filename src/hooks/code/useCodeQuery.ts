// hooks/code/useCodeQuery.ts
// 코드 데이터 조회, 생성, 수정, 삭제 전용 커스텀 훅
// - 내부적으로 공통 fetch 훅인 useApiQuery를 사용
// - queryKey: ["code"] → 캐시 식별자 역할
// - URL: /api/code

import { useApiQuery } from "@/hooks/api/useApiQuery";
import { useApiMutation } from "@/hooks/api/useApiMutation";
import type { CodeSearchParams, CodeData, CodeInput } from "@/types/code";
import { keepPreviousData } from "@tanstack/react-query";

type QueryParams = {
  [key: string]:
    | string
    | number
    | boolean
    | (string | number | boolean)[]
    | undefined;
};

export const useCodeQuery = (params?: CodeSearchParams, enabled: boolean = true) =>
  useApiQuery<CodeData[]>(["code", params], "/api/code", params as QueryParams, { placeholderData: keepPreviousData, enabled: enabled });

export const useCodeCreate = () =>
  useApiMutation<CodeData, CodeInput>("/api/code", "POST", { removeQueryKeys: ["code"] });

export const useCodeUpdate = () =>
  useApiMutation<CodeData, { id: number } & CodeInput>(({ id }) => `/api/code/${id}`, "PUT", { removeQueryKeys: ["code"] });

export const useCodeDelete = () =>
  useApiMutation<CodeData, { id: number }>(({ id }) => `/api/code/${id}`, "DELETE", { removeQueryKeys: ["code"] });
