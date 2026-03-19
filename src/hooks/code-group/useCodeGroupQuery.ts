// hooks/code-group/useCodeGroupQuery.ts
// 코드 그룹 데이터 조회, 생성, 수정, 삭제 전용 커스텀 훅
// - 내부적으로 공통 fetch 훅인 useApiQuery를 사용
// - queryKey: ["codeGroup"] → 캐시 식별자 역할
// - URL: /api/code-group

import { useApiQuery } from "@/hooks/api/useApiQuery";
import { useApiMutation } from "@/hooks/api/useApiMutation";
import type { CodeGroupData, CodeGroupInput } from "@/types/code-group";
import { keepPreviousData } from "@tanstack/react-query";

type QueryParams = {
  [key: string]:
    | string
    | number
    | boolean
    | (string | number | boolean)[]
    | undefined;
};

export const useCodeGroupQuery = (params?: QueryParams) =>
  useApiQuery<CodeGroupData[]>(["codeGroup", params], "/api/code-group", params, { placeholderData: keepPreviousData });

export const useCodeGroupCreate = () =>
  useApiMutation<CodeGroupData, CodeGroupInput>("/api/code-group", "POST", { invalidateQueryKeys: ["codeGroup"] });

export const useCodeGroupUpdate = () =>
  useApiMutation<CodeGroupData, CodeGroupData>((data) => `/api/code-group/${data.id}`, "PUT", { invalidateQueryKeys: ["codeGroup"] });

export const useCodeGroupDelete = () =>
  useApiMutation<void, { id: number }>(({ id }) => `/api/code-group/${id}`, "DELETE", { invalidateQueryKeys: ["codeGroup"] }); 