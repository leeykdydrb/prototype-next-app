// lib/api/apiClient.ts
// 공통 API 요청 함수
// - API 응답 포맷이 { success, message, data } 구조일 경우 자동 처리

"use client";

import { ApiError } from "@/lib/api/ApiError";

interface ResponseType<T> {
  success: boolean;
  message: string;
  data: T;
}

export const apiClient = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const result: ResponseType<T> = await res.json();

  // ok: 상태값이 200 ~ 299 사이이면 true
  if (!res.ok || !result.success) {
    throw new ApiError(result.message || "알 수 없는 에러 발생", res.status);
  }

  return result.data;
};
