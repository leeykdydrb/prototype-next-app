// hooks/api/useApiMutation.ts
// 공통 Mutation 훅 (POST, PUT, DELETE 요청 처리)
// - apiClient를 이용하여 요청을 보내고, 기본적으로 에러 토스트 처리

import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/apiClient";
import { showError } from "@/lib/toast";
import { ApiError } from '@/lib/api/ApiError';
import { toast } from "react-toastify";
import { signOut } from "next-auth/react"

// 공통 API Mutation 훅
// TResult: 응답 데이터 타입
// TVariables: 요청 바디 타입
export const useApiMutation = <TResult = unknown, TVariables = void>(
  url: string | ((variables: TVariables) => string),
  method: "POST" | "PUT" | "DELETE",
  options?: UseMutationOptions<TResult, Error, TVariables> & {
    invalidateQueryKeys?: string[];
    removeQueryKeys?: string[];
  }
) => {
  const queryClient = useQueryClient();
  return useMutation<TResult, Error, TVariables>({
    mutationFn: (variables: TVariables) => {
      const resolvedUrl = typeof url === "function" ? url(variables) : url;
      return apiClient<TResult>(resolvedUrl, {
        method,
        body: variables ? JSON.stringify(variables) : undefined,
      });
    },
    ...options,
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      
      // 캐시 무효화 (데이터 새로고침)
      if (options?.invalidateQueryKeys) {
        options.invalidateQueryKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }

      // 캐시 제거 (완전히 제거해야 하는 경우)
      if (options?.removeQueryKeys) {
        options.removeQueryKeys.forEach(key => {
          queryClient.removeQueries({ queryKey: [key] });
        });
      }

    },
    onError: (error: Error) => {
      if (!(error instanceof ApiError)) {
        showError("알 수 없는 에러가 발생했습니다.");
        return;
      }

      if (error.status === 401) {
        toast.error(error.message, {
          onClose: () => signOut({ redirect: true }),
          autoClose: 3000,
        });
        return;
      }

      showError(error.message);
    },
  });
};
