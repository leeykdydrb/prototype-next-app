// hooks/api/useApiQuery.ts
// 공통 GET 요청용 React Query 훅
// - queryKey: 캐싱 및 식별용 키
// - url: 요청 대상 URL
// - params: GET 파라미터 (자동 쿼리 문자열 변환)
// - options: useQuery의 추가 옵션들

import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/apiClient";
import qs from "query-string";

type QueryParams = {
  [key: string]:
    | string
    | number
    | boolean
    | (string | number | boolean)[]
    | undefined;
};

export const useApiQuery = <T>(
  queryKey: QueryKey,
  url: string,
  params?: QueryParams,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) => {
  // const fullUrl = params ? `${url}?${qs.stringify(params)}` : url;
  const fullUrl = params && Object.keys(params).length > 0
    ? `${url}?${qs.stringify(params)}`
    : url;
    
  return useQuery<T>({
    queryKey,
    queryFn: () => apiClient<T>(fullUrl),
    staleTime: options?.staleTime ?? 1000 * 60 * 5, // 해당 시간 동안 캐시된 결과를 사용
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
